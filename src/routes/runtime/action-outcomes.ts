interface ActionOutcomeRow {
  id: string;
  job_id: string;
  completed_by: string;
  action_completed: string;
  outcome: string;
  notes: string | null;
  created_at: string;
}

export async function handleActionOutcomesRequest(db: D1Database): Promise<Response> {
  const rows = await db
    .prepare(
      `SELECT id, job_id, completed_by, action_completed, outcome, notes, created_at
       FROM action_outcomes
       ORDER BY created_at DESC`
    )
    .all<ActionOutcomeRow>();

  return new Response(
    JSON.stringify(
      {
        count: rows.results?.length ?? 0,
        outcomes: rows.results ?? []
      },
      null,
      2
    ),
    {
      headers: { 'content-type': 'application/json;charset=UTF-8' }
    }
  );
}
