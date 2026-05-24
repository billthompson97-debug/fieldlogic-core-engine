import type { OperationalEvent } from '../../schemas/operational-event.schema';

export interface Env {
  FIELDLOGIC_DB: D1Database;
}

export async function handleOperationalEventIntake(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const event = (await request.json()) as OperationalEvent;

    if (!event.id || !event.jobId || !event.type) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid operational event payload'
        }),
        {
          status: 400,
          headers: {
            'content-type': 'application/json'
          }
        }
      );
    }

    await env.FIELDLOGIC_DB.prepare(
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
        JSON.stringify(event.payload ?? {})
      )
      .run();

    const healthScore = event.type.includes('callback')
      ? 58
      : event.type.includes('qa')
      ? 82
      : 90;

    const callbackRiskProbability = event.type.includes('callback')
      ? 74
      : 34;

    const anomalySignals = event.type.includes('callback')
      ? ['callback_activity_detected']
      : [];

    const operationalSummary = {
      jobId: event.jobId,
      latestEventType: event.type,
      latestEventTimestamp: event.occurredAt,
      healthScore,
      callbackRiskProbability,
      anomalySignals,
      operationalStatus: 'event_recorded'
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Operational event persisted',
        operationalSummary
      }),
      {
        status: 202,
        headers: {
          'content-type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unable to persist operational event'
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json'
        }
      }
    );
  }
}
