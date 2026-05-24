import type { OperationalEvent } from '../schemas/operational-event.schema';

export interface QueueMessage {
  event: OperationalEvent;
  receivedAt: string;
}

export async function processOperationalEventQueue(
  messages: QueueMessage[]
): Promise<void> {
  for (const message of messages) {
    const { event } = message;

    console.log(
      JSON.stringify({
        type: 'fieldlogic.event.processed',
        eventId: event.id,
        eventType: event.type,
        jobId: event.jobId,
        processedAt: new Date().toISOString()
      })
    );
  }
}
