import {
  createCBIOperationalEvent,
  validateCBITelemetryPayload
} from '../../workflows/cbi/cbi-telemetry-workflow';

export async function handleCBITelemetryWorkflow(
  request: Request
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

    return new Response(
      JSON.stringify({
        success: true,
        generatedEvent: event
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json'
        }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unable to process CBI telemetry workflow'
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
