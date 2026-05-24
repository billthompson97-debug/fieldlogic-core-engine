import type { OperationalEvent } from '../../schemas/operational-event.schema';

export interface ReplayResult {
  jobId: string;
  replayedEventCount: number;
  startedAt?: string;
  endedAt?: string;
  eventTypes: string[];
}

export function replayOperationalEvents(
  jobId: string,
  events: OperationalEvent[]
): ReplayResult {
  const filtered = events
    .filter(event => event.jobId === jobId)
    .sort((a, b) =>
      new Date(a.occurredAt).getTime() - new Date(b.occurredAt).getTime()
    );

  return {
    jobId,
    replayedEventCount: filtered.length,
    startedAt: filtered[0]?.occurredAt,
    endedAt: filtered[filtered.length - 1]?.occurredAt,
    eventTypes: [...new Set(filtered.map(event => event.type))]
  };
}
