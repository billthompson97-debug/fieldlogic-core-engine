interface SavedOperationalEvent {
  event_type: string;
  occurred_at: string;
  payload_json: string;
}

export interface JobSummary {
  jobId: string;
  healthScore: number;
  callbackRiskProbability: number;
  priority: 'normal' | 'elevated' | 'urgent';
  owner: 'none' | 'production_manager' | 'service_department' | 'operations';
  nextAction: string;
  activeRisks: string[];
  anomalies: string[];
  recommendations: string[];
  latestEventType?: string;
  latestEventTimestamp?: string;
}

function safeParsePayload(payloadJson: string): Record<string, unknown> {
  try {
    return JSON.parse(payloadJson) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === 'number' ? value : fallback;
}

function determinePriority(
  healthScore: number,
  callbackRiskProbability: number,
  unresolvedPunchItems: number
): JobSummary['priority'] {
  if (healthScore < 65 || callbackRiskProbability >= 50 || unresolvedPunchItems >= 3) {
    return 'urgent';
  }

  if (healthScore < 85 || callbackRiskProbability >= 30 || unresolvedPunchItems > 0) {
    return 'elevated';
  }

  return 'normal';
}

function determineOwner(
  eventType: string,
  callbackRiskProbability: number,
  unresolvedPunchItems: number
): JobSummary['owner'] {
  if (eventType.includes('callback') || callbackRiskProbability >= 50) {
    return 'service_department';
  }

  if (eventType.includes('qa') || unresolvedPunchItems > 0) {
    return 'production_manager';
  }

  if (eventType.includes('margin')) {
    return 'operations';
  }

  return 'none';
}

function determineNextAction(
  owner: JobSummary['owner'],
  priority: JobSummary['priority'],
  recommendations: string[]
): string {
  if (recommendations.length > 0) {
    return recommendations[0];
  }

  if (priority === 'normal') {
    return 'Continue normal job progression';
  }

  if (owner === 'production_manager') {
    return 'Review job before closeout';
  }

  if (owner === 'service_department') {
    return 'Contact homeowner and review callback prevention steps';
  }

  if (owner === 'operations') {
    return 'Review margin and schedule exposure';
  }

  return 'Review job status';
}

export async function handleJobSummaryRequest(
  jobId: string,
  db: D1Database
): Promise<Response> {
  const latestEvent = await db
    .prepare(
      `SELECT event_type, occurred_at, payload_json
       FROM operational_events
       WHERE job_id = ?
       ORDER BY occurred_at DESC
       LIMIT 1`
    )
    .bind(jobId)
    .first<SavedOperationalEvent>();

  if (!latestEvent) {
    return new Response(
      JSON.stringify(
        {
          jobId,
          healthScore: 100,
          callbackRiskProbability: 0,
          priority: 'normal',
          owner: 'none',
          nextAction: 'No operational events recorded yet',
          activeRisks: [],
          anomalies: [],
          recommendations: ['No operational events recorded yet']
        },
        null,
        2
      ),
      {
        headers: {
          'content-type': 'application/json;charset=UTF-8'
        }
      }
    );
  }

  const payload = safeParsePayload(latestEvent.payload_json);
  const qaScore = toNumber(payload.qaScore, 90);
  const callbackRiskProbability = toNumber(payload.callbackRiskProbability, qaScore < 85 ? 38 : 12);
  const unresolvedPunchItems = toNumber(payload.unresolvedPunchItems, 0);

  const activeRisks: string[] = [];
  const anomalies: string[] = [];
  const recommendations: string[] = [];

  if (qaScore < 85) {
    activeRisks.push('qa_review_required');
    recommendations.push('Perform secondary QA verification');
  }

  if (callbackRiskProbability >= 40) {
    activeRisks.push('callback_risk_watch');
    recommendations.push('Review callback prevention steps before closeout');
  }

  if (unresolvedPunchItems > 0) {
    anomalies.push('open_punch_items');
    recommendations.push('Clear punch items before final completion');
  }

  const healthScore = Math.max(
    0,
    Math.round(100 - (100 - qaScore) * 0.8 - callbackRiskProbability * 0.25 - unresolvedPunchItems * 4)
  );

  const priority = determinePriority(healthScore, callbackRiskProbability, unresolvedPunchItems);
  const owner = determineOwner(latestEvent.event_type, callbackRiskProbability, unresolvedPunchItems);
  const nextAction = determineNextAction(owner, priority, recommendations);

  const summary: JobSummary = {
    jobId,
    healthScore,
    callbackRiskProbability,
    priority,
    owner,
    nextAction,
    activeRisks,
    anomalies,
    recommendations,
    latestEventType: latestEvent.event_type,
    latestEventTimestamp: latestEvent.occurred_at
  };

  return new Response(JSON.stringify(summary, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  });
}
