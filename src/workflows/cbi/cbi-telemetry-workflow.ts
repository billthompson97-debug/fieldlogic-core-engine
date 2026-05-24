import type { OperationalEvent } from '../../schemas/operational-event.schema';

export type CBITelemetrySource =
  | 'tech_measure'
  | 'production'
  | 'qa'
  | 'callback'
  | 'installer'
  | 'homeowner_experience';

export interface CBITelemetryWorkflowInput {
  jobId: string;
  source: CBITelemetrySource;
  capturedBy: string;
  payload: Record<string, unknown>;
}

export function createCBIOperationalEvent(
  input: CBITelemetryWorkflowInput
): OperationalEvent {
  const id = `cbi_evt_${input.source}_${Date.now()}`;

  const typeMap: Record<CBITelemetrySource, OperationalEvent['type']> = {
    tech_measure: 'tech_measure.completed',
    production: 'labor.phase.completed',
    qa: 'qa.event.logged',
    callback: 'callback.logged',
    installer: 'labor.phase.completed',
    homeowner_experience: 'risk.signal.created'
  };

  return {
    id,
    type: typeMap[input.source],
    jobId: input.jobId,
    occurredAt: new Date().toISOString(),
    capturedBy: input.capturedBy,
    source: 'fieldlogic',
    payload: input.payload
  };
}

export function validateCBITelemetryPayload(
  event: OperationalEvent
): string[] {
  const errors: string[] = [];

  if (!event.jobId) errors.push('Missing jobId');
  if (!event.type) errors.push('Missing event type');
  if (!event.occurredAt) errors.push('Missing occurredAt');
  if (!event.capturedBy) errors.push('Missing capturedBy');
  if (!event.payload) errors.push('Missing payload');

  return errors;
}
