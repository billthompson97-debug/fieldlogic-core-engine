import type { OperationalEvent } from '../../schemas/operational-event.schema';

export interface LineageRecord {
  id: string;
  jobId: string;
  eventId: string;
  eventType: string;
  occurredAt: string;
  upstreamEventIds: string[];
  downstreamEventIds: string[];
  notes?: string;
}

export function createLineageRecord(event: OperationalEvent, upstreamEventIds: string[] = []): LineageRecord {
  return {
    id: `lineage_${event.id}`,
    jobId: event.jobId,
    eventId: event.id,
    eventType: event.type,
    occurredAt: event.occurredAt,
    upstreamEventIds,
    downstreamEventIds: [],
    notes: event.lineage?.parentEventId
      ? `Parent event: ${event.lineage.parentEventId}`
      : undefined
  };
}
