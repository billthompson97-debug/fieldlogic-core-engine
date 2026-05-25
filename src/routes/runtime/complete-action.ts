interface CompleteActionInput {
  jobId: string;
  completedBy: string;
  actionCompleted: string;
  outcome: 'improved' | 'unchanged' | 'worse' | 'resolved';
  notes?: string;
}

function validateCompleteAction(input: Partial<CompleteActionInput>): string[] {
  const errors: string[] = [];

  if (!input.jobId) errors.push('jobId is required');
  if (!input.completedBy) errors.push('completedBy is required');
  if (!input.actionCompleted) errors.push('actionCompleted is required');
  if (!input.outcome) errors.push('outcome is required');

  return errors;
}

export async function handleCompleteActionRequest(
  request: Request,
  db: D1Database
): Promise<Response> {
  try {
    const input = (await request.json()) as Partial<CompleteActionInput>;
    const errors = validateCompleteAction(input);

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, errors }, null, 2),
        {
          status: 400,
          headers: { 'content-type': 'application/json;charset=UTF-8' }
        }
      );
    }

    const action = input as CompleteActionInput;
    const id = `action_outcome_${Date.now()}`;
    const createdAt = new Date().toISOString();

    await db
      .prepare(
        `INSERT INTO action_outcomes (
          id,
          job_id,
          completed_by,
          action_completed,
          outcome,
          notes,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        id,
        action.jobId,
        action.completedBy,
        action.actionCompleted,
        action.outcome,
        action.notes ?? null,
        createdAt
      )
      .run();

    await db
      .prepare(
        `INSERT INTO operational_events (
          id,
          job_id,
          event_type,
          occurred_at,
          payload_json
        ) VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        `event_${id}`,
        action.jobId,
        'risk.signal.created',
        createdAt,
        JSON.stringify({
          actionCompleted: action.actionCompleted,
          completedBy: action.completedBy,
          outcome: action.outcome,
          notes: action.notes
        })
      )
      .run();

    return new Response(
      JSON.stringify(
        {
          success: true,
          message: 'Action completion saved',
          actionOutcome: {
            id,
            jobId: action.jobId,
            completedBy: action.completedBy,
            actionCompleted: action.actionCompleted,
            outcome: action.outcome,
            notes: action.notes,
            createdAt
          }
        },
        null,
        2
      ),
      {
        status: 202,
        headers: { 'content-type': 'application/json;charset=UTF-8' }
      }
    );
  } catch {
    return new Response(
      JSON.stringify(
        {
          success: false,
          error: 'Unable to complete action'
        },
        null,
        2
      ),
      {
        status: 500,
        headers: { 'content-type': 'application/json;charset=UTF-8' }
      }
    );
  }
}
