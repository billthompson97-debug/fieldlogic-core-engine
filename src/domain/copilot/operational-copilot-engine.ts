export interface CopilotContext {
  jobId: string;
  jobHealthScore: number;
  callbackRiskProbability: number;
  activeRisks: string[];
  anomalies: string[];
  recommendations: string[];
}

export interface CopilotResponse {
  priority: 'normal' | 'elevated' | 'critical';
  operationalSummary: string;
  recommendedActions: string[];
}

export function generateOperationalCopilotResponse(
  context: CopilotContext
): CopilotResponse {
  const recommendedActions: string[] = [...context.recommendations];

  if (context.callbackRiskProbability > 70) {
    recommendedActions.push('Initiate proactive callback prevention review');
  }

  if (context.jobHealthScore < 60) {
    recommendedActions.push('Escalate operational review to leadership');
  }

  if (context.anomalies.length > 0) {
    recommendedActions.push('Investigate operational anomaly patterns');
  }

  const priority =
    context.jobHealthScore < 60 || context.callbackRiskProbability > 70
      ? 'critical'
      : context.jobHealthScore < 75
      ? 'elevated'
      : 'normal';

  return {
    priority,
    operationalSummary:
      `Job ${context.jobId} currently operating with ${priority} operational priority status.`,
    recommendedActions
  };
}
