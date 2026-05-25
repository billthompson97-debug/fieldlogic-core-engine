type DailyJobNoteIssueType =
  | 'qa'
  | 'callback'
  | 'margin'
  | 'schedule'
  | 'labor'
  | 'homeowner';

interface DailyJobNoteInput {
  jobId: string;
  issueType: DailyJobNoteIssueType;
  capturedBy: string;
  notes?: string;
  qaScore?: number;
  callbackRiskProbability?: number;
  unresolvedPunchItems?: number;
  laborVariancePercent?: number;
  materialVariancePercent?: number;
  scheduleDelayDays?: number;
  estimatedMarginLeakPercent?: number;
  homeownerConcern?: string;
}

function eventTypeForIssue(issueType: DailyJobNoteIssueType): string {
  if (issueType === 'callback') return 'callback.logged';
  if (issueType === 'margin') return 'margin.signal.created';
  if (issueType === 'schedule') return 'risk.signal.created';
  if (issueType === 'labor') return 'labor.phase.completed';
  if (issueType === 'homeowner') return 'risk.signal.created';
  return 'qa.event.logged';
}

function buildDailyJobPayload(input: DailyJobNoteInput): Record<string, unknown> {
  return {
    issueType: input.issueType,
    notes: input.notes,
    qaScore: input.qaScore,
    callbackRiskProbability: input.callbackRiskProbability,
    unresolvedPunchItems: input.unresolvedPunchItems,
    laborVariancePercent: input.laborVariancePercent,
    materialVariancePercent: input.materialVariancePercent,
    scheduleDelayDays: input.scheduleDelayDays,
    estimatedMarginLeakPercent: input.estimatedMarginLeakPercent,
    homeownerConcern: input.homeownerConcern
  };
}

function validateDailyJobNote(input: Partial<DailyJobNoteInput>): string[] {
  const errors: string[] = [];

  if (!input.jobId) errors.push('jobId is required');
  if (!input.issueType) errors.push('issueType is required');
  if (!input.capturedBy) errors.push('capturedBy is required');

  return errors;
}

export async function handleCBIDailyJobNoteRequest(
  request: Request,
  db: D1Database
): Promise<Response> {
  try {
    const input = (await request.json()) as Partial<DailyJobNoteInput>;
    const errors = validateDailyJobNote(input);

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({ success: false, errors }, null, 2),
        {
          status: 400,
          headers: { 'content-type': 'application/json;charset=UTF-8' }
        }
      );
    }

    const dailyNote = input as DailyJobNoteInput;
    const event = {
      id: `daily_note_${dailyNote.issueType}_${Date.now()}`,
      type: eventTypeForIssue(dailyNote.issueType),
      jobId: dailyNote.jobId,
      occurredAt: new Date().toISOString(),
      capturedBy: dailyNote.capturedBy,
      source: 'fieldlogic',
      payload: buildDailyJobPayload(dailyNote)
    };

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
        event.id,
        event.jobId,
        event.type,
        event.occurredAt,
        JSON.stringify(event.payload)
      )
      .run();

    return new Response(
      JSON.stringify(
        {
          success: true,
          message: 'CBI daily job note saved',
          event
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
          error: 'Unable to save CBI daily job note'
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
