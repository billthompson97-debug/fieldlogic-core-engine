import type { OperationalEvent } from '../../schemas/operational-event.schema';

export interface LiveJobState {
  jobId: string;
  currentStatus: string;
  lastEventType: string;
  lastUpdatedAt: string;
  activeSignals: string[];
}

export function updateLiveJobState(
  currentState: LiveJobState | null,
  event: OperationalEvent
): LiveJobState {
  const activeSignals = [...(currentState?.activeSignals ?? [])];

  if (event.type.includes('callback')) {
    activeSignals.push('callback_activity_detected');
  }

  if (event.type.includes('qa')) {
    activeSignals.push('qa_review_activity');
  }

  return {
    jobId: event.jobId,
    currentStatus: event.type,
    lastEventType: event.type,
    lastUpdatedAt: event.occurredAt,
    activeSignals
  };
}
