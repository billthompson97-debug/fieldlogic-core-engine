export type OperationalEventType =
  | 'job.created'
  | 'scope.captured'
  | 'tech_measure.completed'
  | 'material.package.ordered'
  | 'labor.phase.started'
  | 'labor.phase.completed'
  | 'qa.event.logged'
  | 'callback.logged'
  | 'risk.signal.created'
  | 'margin.signal.created';

export interface OperationalEvent<TPayload = Record<string, unknown>> {
  id: string;
  type: OperationalEventType;
  jobId: string;
  occurredAt: string;
  capturedBy: string;
  source: 'manual' | 'builder_prime' | 'jobtread' | 'companycam' | 'fieldlogic' | 'api';
  payload: TPayload;
  lineage?: {
    parentEventId?: string;
    relatedEventIds?: string[];
  };
}

export function createOperationalEvent<TPayload>(event: OperationalEvent<TPayload>): OperationalEvent<TPayload> {
  return event;
}
