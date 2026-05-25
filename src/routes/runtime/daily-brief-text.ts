interface SavedOperationalEvent {
  job_id: string;
  event_type: string;
  occurred_at: string;
  payload_json: string;
}

interface BriefJob {
  jobId: string;
  priority: 'normal' | 'elevated' | 'urgent';
  owner: 'none' | 'production_manager' | 'service_department' | 'operations';
  healthScore: number;
  nextAction: string;
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

function readableOwner(owner: BriefJob['owner']): string {
  if (owner === 'production_manager') return 'Production Manager';
  if (owner === 'service_department') return 'Service Department';
  if (owner === 'operations') return 'Operations';
  return 'Unassigned';
}

function summarizeJob(event: SavedOperationalEvent): BriefJob {
  const payload = safeParsePayload(event.payload_json);

  const qaScore = toNumber(payload.qaScore, 90);
  const callbackRiskProbability = toNumber(
    payload.callbackRiskProbability,
    event.event_type.includes('callback') ? 65 : qaScore < 85 ? 38 : 12
  );
  const unresolvedPunchItems = toNumber(payload.unresolvedPunchItems, 0);
  const estimatedMarginLeakPercent = toNumber(payload.estimatedMarginLeakPercent, 0);
  const laborVariancePercent = toNumber(payload.laborVariancePercent, 0);
  const materialVariancePercent = toNumber(payload.materialVariancePercent, 0);
  const scheduleDelayDays = toNumber(payload.scheduleDelayDays, 0);

  const healthScore = Math.max(
    0,
    Math.round(
      100 -
        (100 - qaScore) * 0.8 -
        callbackRiskProbability * 0.25 -
        unresolvedPunchItems * 4 -
        estimatedMarginLeakPercent * 1.5 -
        laborVariancePercent * 0.4 -
        materialVariancePercent * 0.3 -
        scheduleDelayDays * 2
    )
  );

  const priority =
    healthScore < 65 ||
    callbackRiskProbability >= 50 ||
    unresolvedPunchItems >= 3 ||
    estimatedMarginLeakPercent >= 12 ||
    laborVariancePercent >= 20 ||
    scheduleDelayDays >= 5
      ? 'urgent'
      : healthScore < 85 ||
        callbackRiskProbability >= 30 ||
        unresolvedPunchItems > 0 ||
        estimatedMarginLeakPercent >= 6 ||
        laborVariancePercent >= 12 ||
        scheduleDelayDays >= 3
      ? 'elevated'
      : 'normal';

  const owner =
    event.event_type.includes('callback') || callbackRiskProbability >= 50
      ? 'service_department'
      : event.event_type.includes('margin')
      ? 'operations'
      : event.event_type.includes('qa') || unresolvedPunchItems > 0
      ? 'production_manager'
      : 'none';

  const nextAction =
    owner === 'service_department' && priority === 'urgent'
      ? 'Contact homeowner, schedule callback inspection, and review QA history.'
      : owner === 'operations' && priority === 'urgent'
      ? 'Review margin leak, labor overage, material variance, and schedule delay today.'
      : owner === 'operations'
      ? 'Review margin and schedule exposure.'
      : owner === 'production_manager'
      ? 'Perform secondary QA verification.'
      : 'Continue normal job progression.';

  return {
    jobId: event.job_id,
    priority,
    owner,
    healthScore,
    nextAction
  };
}

function sortJobsByPriority(jobs: BriefJob[]): BriefJob[] {
  const rank = { urgent: 2, elevated: 1, normal: 0 };
  return [...jobs].sort((a, b) => rank[b.priority] - rank[a.priority] || a.healthScore - b.healthScore);
}

export async function handleDailyBriefTextRequest(db: D1Database): Promise<Response> {
  const rows = await db
    .prepare(
      `SELECT job_id, event_type, occurred_at, payload_json
       FROM operational_events
       ORDER BY occurred_at DESC`
    )
    .all<SavedOperationalEvent>();

  const latestByJob = new Map<string, SavedOperationalEvent>();

  for (const row of rows.results ?? []) {
    if (!latestByJob.has(row.job_id)) {
      latestByJob.set(row.job_id, row);
    }
  }

  const jobs = sortJobsByPriority(
    Array.from(latestByJob.values())
      .map(summarizeJob)
      .filter(job => job.priority !== 'normal')
  );

  const urgentCount = jobs.filter(job => job.priority === 'urgent').length;
  const elevatedCount = jobs.filter(job => job.priority === 'elevated').length;

  const owners: BriefJob['owner'][] = [
    'operations',
    'service_department',
    'production_manager',
    'none'
  ];

  const lines: string[] = [
    'FieldLogic Daily Brief',
    '',
    `Urgent Jobs: ${urgentCount}`,
    `Elevated Jobs: ${elevatedCount}`,
    `Total Jobs Needing Attention: ${jobs.length}`,
    ''
  ];

  if (jobs.length === 0) {
    lines.push('No jobs need attention right now.');
  } else {
    lines.push('Jobs by owner:');
    lines.push('');

    for (const owner of owners) {
      const ownerJobs = jobs.filter(job => job.owner === owner);

      if (ownerJobs.length === 0) continue;

      lines.push(`${readableOwner(owner)} (${ownerJobs.length})`);

      ownerJobs.forEach((job, index) => {
        lines.push(`${index + 1}. ${job.jobId}`);
        lines.push(`   Priority: ${job.priority}`);
        lines.push(`   Health Score: ${job.healthScore}`);
        lines.push(`   Next Action: ${job.nextAction}`);
      });

      lines.push('');
    }
  }

  return new Response(lines.join('\n'), {
    headers: {
      'content-type': 'text/plain;charset=UTF-8'
    }
  });
}
