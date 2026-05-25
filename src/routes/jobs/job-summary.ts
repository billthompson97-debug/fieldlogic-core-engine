interface SavedOperationalEvent {
  event_type: string;
  occurred_at: string;
  payload_json: string;
}

interface LatestActionOutcome {
  action_completed: string;
  outcome: string;
  completed_by: string;
  notes: string | null;
  created_at: string;
}

export interface JobSummary {
  jobId: string;
  healthScore: number;
  callbackRiskProbability: number;
  priority: 'normal' | 'elevated' | 'urgent';
  owner: 'none' | 'production_manager' | 'service_department' | 'operations';
  nextAction: string;
  completedAction?: {
    actionCompleted: string;
    outcome: string;
    completedBy: string;
    notes?: string | null;
    completedAt: string;
  };
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

function adjustForCompletedAction(
  healthScore: number,
  callbackRiskProbability: number,
  outcome?: string
): { healthScore: number; callbackRiskProbability: number } {
  if (outcome === 'resolved') {
    return {
      healthScore: Math.min(100, healthScore + 25),
      callbackRiskProbability: Math.max(0, callbackRiskProbability - 25)
    };
  }

  if (outcome === 'improved') {
    return {
      healthScore: Math.min(100, healthScore + 15),
      callbackRiskProbability: Math.max(0, callbackRiskProbability - 15)
    };
  }

  return { healthScore, callbackRiskProbability };
}

function determinePriority(
  healthScore: number,
  callbackRiskProbability: number,
  unresolvedPunchItems: number,
  estimatedMarginLeakPercent: number,
  laborVariancePercent: number,
  scheduleDelayDays: number
): JobSummary['priority'] {
  if (
    healthScore < 65 ||
    callbackRiskProbability >= 50 ||
    unresolvedPunchItems >= 3 ||
    estimatedMarginLeakPercent >= 12 ||
    laborVariancePercent >= 20 ||
    scheduleDelayDays >= 5
  ) {
    return 'urgent';
  }

  if (
    healthScore < 85 ||
    callbackRiskProbability >= 30 ||
    unresolvedPunchItems > 0 ||
    estimatedMarginLeakPercent >= 6 ||
    laborVariancePercent >= 12 ||
    scheduleDelayDays >= 3
  ) {
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

  if (eventType.includes('margin')) {
    return 'operations';
  }

  if (eventType.includes('qa') || unresolvedPunchItems > 0) {
    return 'production_manager';
  }

  return 'none';
}

function determineNextAction(
  owner: JobSummary['owner'],
  priority: JobSummary['priority'],
  qaScore: number,
  callbackRiskProbability: number,
  unresolvedPunchItems: number,
  estimatedMarginLeakPercent: number,
  laborVariancePercent: number,
  materialVariancePercent: number,
  scheduleDelayDays: number,
  latestActionOutcome?: LatestActionOutcome | null
): string {
  if (latestActionOutcome?.outcome === 'resolved') {
    return 'Action resolved. Monitor job before final closeout.';
  }

  if (latestActionOutcome?.outcome === 'improved') {
    return 'Action improved the job. Monitor before closeout and confirm no new issues appear.';
  }

  if (owner === 'service_department') {
    const parts = ['Contact homeowner'];

    if (priority === 'urgent') parts.push('schedule callback inspection');
    if (callbackRiskProbability >= 50) parts.push(`review callback risk at ${callbackRiskProbability}%`);
    if (qaScore < 85) parts.push(`review QA score of ${qaScore}`);

    return `${parts.join(', ')}.`;
  }

  if (owner === 'operations') {
    const parts = ['Review margin exposure'];

    if (estimatedMarginLeakPercent > 0) parts.push(`margin leak ${estimatedMarginLeakPercent}%`);
    if (laborVariancePercent > 0) parts.push(`labor variance ${laborVariancePercent}%`);
    if (materialVariancePercent > 0) parts.push(`material variance ${materialVariancePercent}%`);
    if (scheduleDelayDays > 0) parts.push(`${scheduleDelayDays} schedule delay day(s)`);

    return `${parts.join(', ')}.`;
  }

  if (owner === 'production_manager') {
    const parts = ['Perform secondary QA verification'];

    if (qaScore < 85) parts.push(`QA score is ${qaScore}`);
    if (unresolvedPunchItems > 0) parts.push(`clear ${unresolvedPunchItems} punch item(s)`);
    if (callbackRiskProbability >= 30) parts.push(`review callback risk at ${callbackRiskProbability}% before closeout`);

    return `${parts.join(', ')}.`;
  }

  return 'Continue normal job progression.';
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

  const latestActionOutcome = await db
    .prepare(
      `SELECT action_completed, outcome, completed_by, notes, created_at
       FROM action_outcomes
       WHERE job_id = ?
       ORDER BY created_at DESC
       LIMIT 1`
    )
    .bind(jobId)
    .first<LatestActionOutcome>();

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
  const baseCallbackRiskProbability = toNumber(payload.callbackRiskProbability, qaScore < 85 ? 38 : 12);
  const unresolvedPunchItems = toNumber(payload.unresolvedPunchItems, 0);
  const estimatedMarginLeakPercent = toNumber(payload.estimatedMarginLeakPercent, 0);
  const laborVariancePercent = toNumber(payload.laborVariancePercent, 0);
  const materialVariancePercent = toNumber(payload.materialVariancePercent, 0);
  const scheduleDelayDays = toNumber(payload.scheduleDelayDays, 0);

  const activeRisks: string[] = [];
  const anomalies: string[] = [];
  const recommendations: string[] = [];

  if (qaScore < 85) {
    activeRisks.push('qa_review_required');
    recommendations.push('Perform secondary QA verification');
  }

  if (baseCallbackRiskProbability >= 40) {
    activeRisks.push('callback_risk_watch');
    recommendations.push('Review callback prevention steps before closeout');
  }

  if (unresolvedPunchItems > 0) {
    anomalies.push('open_punch_items');
    recommendations.push('Clear punch items before final completion');
  }

  if (estimatedMarginLeakPercent >= 6) {
    activeRisks.push('margin_leak_watch');
    recommendations.push('Review labor, material, and schedule cost drivers');
  }

  if (laborVariancePercent >= 12) {
    anomalies.push('labor_variance_above_target');
  }

  if (materialVariancePercent >= 8) {
    anomalies.push('material_variance_above_target');
  }

  if (scheduleDelayDays >= 3) {
    anomalies.push('schedule_delay_detected');
  }

  const baseHealthScore = Math.max(
    0,
    Math.round(
      100 -
        (100 - qaScore) * 0.8 -
        baseCallbackRiskProbability * 0.25 -
        unresolvedPunchItems * 4 -
        estimatedMarginLeakPercent * 1.5 -
        laborVariancePercent * 0.4 -
        materialVariancePercent * 0.3 -
        scheduleDelayDays * 2
    )
  );

  const adjusted = adjustForCompletedAction(
    baseHealthScore,
    baseCallbackRiskProbability,
    latestActionOutcome?.outcome
  );

  const priority = determinePriority(
    adjusted.healthScore,
    adjusted.callbackRiskProbability,
    unresolvedPunchItems,
    estimatedMarginLeakPercent,
    laborVariancePercent,
    scheduleDelayDays
  );
  const owner = determineOwner(latestEvent.event_type, adjusted.callbackRiskProbability, unresolvedPunchItems);
  const nextAction = determineNextAction(
    owner,
    priority,
    qaScore,
    adjusted.callbackRiskProbability,
    unresolvedPunchItems,
    estimatedMarginLeakPercent,
    laborVariancePercent,
    materialVariancePercent,
    scheduleDelayDays,
    latestActionOutcome
  );

  const summary: JobSummary = {
    jobId,
    healthScore: adjusted.healthScore,
    callbackRiskProbability: adjusted.callbackRiskProbability,
    priority,
    owner,
    nextAction,
    completedAction: latestActionOutcome
      ? {
          actionCompleted: latestActionOutcome.action_completed,
          outcome: latestActionOutcome.outcome,
          completedBy: latestActionOutcome.completed_by,
          notes: latestActionOutcome.notes,
          completedAt: latestActionOutcome.created_at
        }
      : undefined,
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
