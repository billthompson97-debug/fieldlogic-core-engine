export interface BuilderPrimeEventPayload {
  leadId?: string;
  jobId: string;
  eventType: string;
  timestamp: string;
  salesRep?: string;
  payload: Record<string, unknown>;
}

export interface NormalizedBuilderPrimeEvent {
  id: string;
  type: string;
  jobId: string;
  occurredAt: string;
  capturedBy: string;
  source: 'builder_prime';
  payload: Record<string, unknown>;
}

export function normalizeBuilderPrimeEvent(
  payload: BuilderPrimeEventPayload
): NormalizedBuilderPrimeEvent {
  return {
    id: `builder_prime_${payload.jobId}_${Date.now()}`,
    type: payload.eventType,
    jobId: payload.jobId,
    occurredAt: payload.timestamp,
    capturedBy: payload.salesRep ?? 'builder_prime_system',
    source: 'builder_prime',
    payload: payload.payload
  };
}
