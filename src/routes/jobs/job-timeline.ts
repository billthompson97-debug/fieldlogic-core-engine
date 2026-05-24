export interface TimelineEntry {
  eventType: string;
  occurredAt: string;
  payload: string;
}

export async function handleJobTimelineRequest(
  jobId: string,
  db: D1Database
): Promise<Response> {
  const events = await db
    .prepare(
      `SELECT event_type, occurred_at, payload_json
       FROM operational_events
       WHERE job_id = ?
       ORDER BY occurred_at ASC`
    )
    .bind(jobId)
    .all<TimelineEntry>();

  return new Response(
    JSON.stringify(
      {
        jobId,
        timeline: events.results
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
