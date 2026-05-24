export interface ReasoningContext {
  jobId: string;
  healthScore: number;
  activeRisks: string[];
  anomalies: string[];
  benchmarkSignals: string[];
  memorySignals: string[];
  recommendations: string[];
}

export interface OperationalConclusion {
  summary: string;
  operationalState: 'stable' | 'watch' | 'unstable';
  primaryConcerns: string[];
  recommendedActions: string[];
}

export function generateOperationalConclusion(
  context: ReasoningContext
): OperationalConclusion {
  const primaryConcerns: string[] = [];

  if (context.healthScore < 70) {
    primaryConcerns.push('Operational health degradation detected');
  }

  if (context.activeRisks.length > 0) {
    primaryConcerns.push('Active operational risks require monitoring');
  }

  if (context.anomalies.length > 0) {
    primaryConcerns.push('Operational anomalies impacting project stability');
  }

  const operationalState =
    context.healthScore < 60
      ? 'unstable'
      : context.healthScore < 80
      ? 'watch'
      : 'stable';

  return {
    summary:
      `FieldLogic generated operational reasoning for job ${context.jobId}.`,
    operationalState,
    primaryConcerns,
    recommendedActions: context.recommendations
  };
}
