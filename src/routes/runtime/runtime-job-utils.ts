export interface SavedOperationalEvent {
  job_id: string;
  event_type: string;
  occurred_at: string;
  payload_json: string;
}

export interface ActionOutcomeRow {
  job_id: string;
  action_completed: string;
  outcome: string;
  completed_by: string;
  notes: string | null;
  created_at: string;
}

export type RuntimeOwner = 'none' | 'production_manager' | 'service_department' | 'operations';
export type RuntimePriority = 'normal' | 'elevated' | 'urgent';

export interface RuntimeJob {
  jobId: string;
  priority: RuntimePriority;
  owner: RuntimeOwner;
  healthScore: number;
  callbackRiskProbability: number;
  nextAction: string;
  latestEventType: string;
  latestEventTimestamp: string;
  latestActionOutcome?: {
    actionCompleted: string;
    outcome: string;
    completedBy: string;
    createdAt: string;
  };
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

function adjustForOutcome(
  healthScore: number,
  callbackRiskProbability: number,
  outcome?: string
): { healthScore: number; callbackRiskProbability: number } {
  if (outcome === 'resolved') {
    return {
      healthScore: Math.min(92, healthScore + 18),
      callbackRiskProbability: Math.max(8, callbackRiskProbability - 22)
    };
  }

  if (outcome === 'improved') {
    return {
      healthScore: Math.min(82, healthScore + 10),
      callbackRiskProbability: Math.max(20, callbackRiskProbability - 10)
    };
  }

  if (outcome === 'worse') {
    return {
      healthScore: Math.max(0, healthScore - 15),
      callbackRiskProbability: Math.min(100, callbackRiskProbability + 15)
    };
  }

  return { healthScore, callbackRiskProbability };
}

export function readableOwner(owner: RuntimeOwner): string {
  if (owner === 'production_manager') return 'Production Manager';
  if (owner === 'service_department') return 'Service Department';
  if (owner === 'operations') return 'Operations';
  return 'Unassigned';
}

function buildNextAction(
  owner: RuntimeOwner,
  priority: RuntimePriority,
  qaScore: number,
  callbackRiskProbability: number,
  unresolvedPunchItems: number,
  estimatedMarginLeakPercent: number,
  laborVariancePercent: number,
  materialVariancePercent: number,
  scheduleDelayDays: number,
  latestActionOutcome?: ActionOutcomeRow
): string {
  if (latestActionOutcome?.outcome === 'resolved') {
    return 'Action resolved. Confirm closeout readiness and keep normal watch.';
  }

  if (latestActionOutcome?.outcome === 'improved') {
    return 'Action improved the job. Keep this on watch before closeout and confirm no new issues appear.';
  }

  if (latestActionOutcome?.outcome === 'worse') {
    return 'Action did not fix the issue. Escalate for manager review today.';
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

export function scoreRuntimeJob(
  event: SavedOperationalEvent,
  latestActionOutcome?: ActionOutcomeRow
): RuntimeJob {
  const payload = safeParsePayload(event.payload_json);

  const qaScore = toNumber(payload.qaScore, 90);
  const baseCallbackRiskProbability = toNumber(
    payload.callbackRiskProbability,
    event.event_type.includes('callback') ? 65 : qaScore < 85 ? 38 : 12
  );
  const unresolvedPunchItems = toNumber(payload.unresolvedPunchItems, 0);
  const estimatedMarginLeakPercent = toNumber(payload.estimatedMarginLeakPercent, 0);
  const laborVariancePercent = toNumber(payload.laborVariancePercent, 0);
  const materialVariancePercent = toNumber(payload.materialVariancePercent, 0);
  const scheduleDelayDays = toNumber(payload.scheduleDelayDays, 0);

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

  const adjusted = adjustForOutcome(
    baseHealthScore,
    baseCallbackRiskProbability,
    latestActionOutcome?.outcome
  );

  const priority: RuntimePriority =
    adjusted.healthScore < 65 ||
    adjusted.callbackRiskProbability >= 50 ||
    unresolvedPunchItems >= 3 ||
    estimatedMarginLeakPercent >= 12 ||
    laborVariancePercent >= 20 ||
    scheduleDelayDays >= 5
      ? 'urgent'
      : adjusted.healthScore < 85 ||
        adjusted.callbackRiskProbability >= 30 ||
        unresolvedPunchItems > 0 ||
        estimatedMarginLeakPercent >= 6 ||
        laborVariancePercent >= 12 ||
        scheduleDelayDays >= 3
      ? 'elevated'
      : 'normal';

  const owner: RuntimeOwner =
    event.event_type.includes('callback') || adjusted.callbackRiskProbability >= 50
      ? 'service_department'
      : event.event_type.includes('margin')
      ? 'operations'
      : event.event_type.includes('qa') || unresolvedPunchItems > 0
      ? 'production_manager'
      : 'none';

  const nextAction = buildNextAction(
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

  return {
    jobId: event.job_id,
    priority,
    owner,
    healthScore: adjusted.healthScore,
    callbackRiskProbability: adjusted.callbackRiskProbability,
    nextAction,
    latestEventType: event.event_type,
    latestEventTimestamp: event.occurred_at,
    latestActionOutcome: latestActionOutcome
      ? {
          actionCompleted: latestActionOutcome.action_completed,
          outcome: latestActionOutcome.outcome,
          completedBy: latestActionOutcome.completed_by,
          createdAt: latestActionOutcome.created_at
        }
      : undefined
  };
}

export async function getLatestRuntimeJobs(db: D1Database): Promise<RuntimeJob[]> {
  const rows = await db
    .prepare(
      `SELECT job_id, event_type, occurred_at, payload_json
       FROM operational_events
       ORDER BY occurred_at DESC`
    )
    .all<SavedOperationalEvent>();

  const actionRows = await db
    .prepare(
      `SELECT job_id, action_completed, outcome, completed_by, notes, created_at
       FROM action_outcomes
       ORDER BY created_at DESC`
    )
    .all<ActionOutcomeRow>();

  const latestByJob = new Map<string, SavedOperationalEvent>();
  const latestActionByJob = new Map<string, ActionOutcomeRow>();

  for (const row of rows.results ?? []) {
    if (!latestByJob.has(row.job_id)) {
      latestByJob.set(row.job_id, row);
    }
  }

  for (const row of actionRows.results ?? []) {
    if (!latestActionByJob.has(row.job_id)) {
      latestActionByJob.set(row.job_id, row);
    }
  }

  return Array.from(latestByJob.values()).map(event =>
    scoreRuntimeJob(event, latestActionByJob.get(event.job_id))
  );
}

export function sortRuntimeJobs(jobs: RuntimeJob[]): RuntimeJob[] {
  const rank = { urgent: 2, elevated: 1, normal: 0 };
  return [...jobs].sort((a, b) => rank[b.priority] - rank[a.priority] || a.healthScore - b.healthScore);
}
