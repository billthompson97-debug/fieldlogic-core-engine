export interface JobSummary {
  jobId: string;
  healthScore: number;
  callbackRiskProbability: number;
  activeRisks: string[];
  anomalies: string[];
  recommendations: string[];
  latestEventType?: string;
  latestEventTimestamp?: string;
}

export async function handleJobSummaryRequest(
  jobId: string,
  db: D1Database
): Promise<Response> {
  const latestEvent = await db
    .prepare(
      `SELECT event_type, occurred_at
       FROM operational_events
       WHERE job_id = ?
       ORDER BY occurred_at DESC
       LIMIT 1`
    )
    .bind(jobId)
    .first<{ event_type: string; occurred_at: string }>();

  const summary: JobSummary = {
    jobId,
    healthScore: 82,
    callbackRiskProbability: 34,
    activeRisks: ['qa_review_required'],
    anomalies: [],
    recommendations: ['Perform secondary QA verification'],
    latestEventType: latestEvent?.event_type,
    latestEventTimestamp: latestEvent?.occurred_at
  };

  return new Response(JSON.stringify(summary, null, 2), {
    headers: {
      'content-type': 'application/json;charset=UTF-8'
    }
  });
}
