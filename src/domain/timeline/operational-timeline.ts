import type { OperationalEvent } from '../../schemas/operational-event.schema';

export interface TimelineEvent {
  eventId: string;
  eventType: string;
  occurredAt: string;
  source: string;
  summary: string;
}

export interface OperationalTimeline {
  jobId: string;
  generatedAt: string;
  events: TimelineEvent[];
}

export function buildOperationalTimeline(
  jobId: string,
  events: OperationalEvent[]
): OperationalTimeline {
  const timelineEvents: TimelineEvent[] = events
    .filter(event => event.jobId === jobId)
    .sort((a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
    )
    .map(event => ({
      eventId: event.id,
      eventType: event.type,
      occurredAt: event.occurredAt,
      source: event.source,
      summary: `${event.type} captured from ${event.source}`
    }));

  return {
    jobId,
    generatedAt: new Date().toISOString(),
    events: timelineEvents
  };
}
