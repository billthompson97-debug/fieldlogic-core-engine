export interface EscalationInputs {
  jobHealthScore: number;
  callbackRiskProbability: number;
  openCallbackCount: number;
  unresolvedPunchItems: number;
  activeAnomalies: number;
}

export interface EscalationDecision {
  escalationRequired: boolean;
  escalationLevel: 'none' | 'production_manager' | 'leadership';
  reasons: string[];
}

export function evaluateProductionEscalation(
  input: EscalationInputs
): EscalationDecision {
  const reasons: string[] = [];

  if (input.jobHealthScore < 60) {
    reasons.push('Job health below intervention threshold');
  }

  if (input.callbackRiskProbability > 70) {
    reasons.push('High callback probability detected');
  }

  if (input.openCallbackCount > 1) {
    reasons.push('Multiple open callbacks detected');
  }

  if (input.unresolvedPunchItems > 5) {
    reasons.push('Punch backlog exceeds operational standard');
  }

  if (input.activeAnomalies > 2) {
    reasons.push('Multiple operational anomalies active');
  }

  const escalationRequired = reasons.length > 0;

  const escalationLevel =
    reasons.length >= 3
      ? 'leadership'
      : reasons.length > 0
      ? 'production_manager'
      : 'none';

  return {
    escalationRequired,
    escalationLevel,
    reasons
  };
}
