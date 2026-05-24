export interface OperationalContextObject {
  jobId: string;
  healthScore: number;
  callbackRiskProbability: number;
  activeRisks: string[];
  anomalies: string[];
  recommendations: string[];
  benchmarkSignals: string[];
  memorySummaries: string[];
}

export function assembleOperationalContext(
  input: OperationalContextObject
): OperationalContextObject {
  return {
    ...input,
    activeRisks: [...new Set(input.activeRisks)],
    anomalies: [...new Set(input.anomalies)],
    recommendations: [...new Set(input.recommendations)],
    benchmarkSignals: [...new Set(input.benchmarkSignals)],
    memorySummaries: [...new Set(input.memorySummaries)]
  };
}
