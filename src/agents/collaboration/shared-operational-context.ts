export interface SharedOperationalContext {
  jobId: string;
  activeSignals: string[];
  activeAnomalies: string[];
  benchmarkSignals: string[];
  recommendations: string[];
  callbackRiskProbability: number;
  healthScore: number;
}

export function buildSharedOperationalContext(
  context: SharedOperationalContext
): SharedOperationalContext {
  return {
    ...context,
    activeSignals: [...new Set(context.activeSignals)],
    activeAnomalies: [...new Set(context.activeAnomalies)],
    benchmarkSignals: [...new Set(context.benchmarkSignals)],
    recommendations: [...new Set(context.recommendations)]
  };
}
