import {
  createCBIOperationalEvent,
  validateCBITelemetryPayload
} from '../../workflows/cbi/cbi-telemetry-workflow';

export interface Env {
  FIELDLOGIC_DB: D1Database;
}

export async function handleCBITelemetryWorkflow(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    const body = await request.json();

    const event = createCBIOperationalEvent(body);
    const errors = validateCBITelemetryPayload(event);

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          errors
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

    const operationalSummary = {
      jobId: event.jobId,
      latestEventType: event.type,
      latestEventTimestamp: event.occurredAt,
      operationalStatus: 'cbi_telemetry_persisted'
    };

    return new Response(
      JSON.stringify({
        success: true,
        message: 'CBI telemetry generated and persisted',
        generatedEvent: event,
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
        error: 'Unable to process and persist CBI telemetry workflow'
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
