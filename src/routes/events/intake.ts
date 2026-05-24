import type { OperationalEvent } from '../../schemas/operational-event.schema';

export async function handleOperationalEventIntake(request: Request): Promise<Response> {
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

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Operational event accepted',
        eventId: event.id,
        eventType: event.type,
        occurredAt: event.occurredAt
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
        error: 'Unable to process operational event intake'
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
