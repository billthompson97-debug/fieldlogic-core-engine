export interface UnifiedOperationalContext {
  jobId: string;
  healthScore: number;
  callbackRiskProbability: number;
  activeRisks: string[];
  anomalies: string[];
  benchmarkSignals: string[];
  memorySignals: string[];
  recommendations: string[];
  timelineEvents: string[];
}

export interface UnifiedOperationalOutput {
  operationalState: 'stable' | 'watch' | 'critical';
  summary: string;
  prioritizedActions: string[];
  activeSignals: string[];
}

export function runUnifiedOperationalRuntime(
  context: UnifiedOperationalContext
): UnifiedOperationalOutput {
  const activeSignals = [
    ...context.activeRisks,
    ...context.anomalies,
    ...context.benchmarkSignals,
    ...context.memorySignals
  ];

  const operationalState =
    context.healthScore < 60 || context.callbackRiskProbability > 70
      ? 'critical'
      : context.healthScore < 80
      ? 'watch'
      : 'stable';

  return {
    operationalState,
    summary:
      `Unified operational runtime evaluated job ${context.jobId} with ${activeSignals.length} active operational signals.`,
    prioritizedActions: context.recommendations,
    activeSignals
  };
}
