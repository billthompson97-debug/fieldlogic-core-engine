export interface PredictiveProgressionInput {
  currentHealthScore: number;
  callbackRiskProbability: number;
  activeAnomalyCount: number;
  marginLeakPercent: number;
}

export interface PredictiveProgressionResult {
  projectedOperationalState: 'stable' | 'watch' | 'critical';
  projectedTrend: 'improving' | 'stable' | 'declining';
  projectedRiskSignals: string[];
}

export function predictOperationalProgression(
  input: PredictiveProgressionInput
): PredictiveProgressionResult {
  const projectedRiskSignals: string[] = [];

  if (input.callbackRiskProbability > 60) {
    projectedRiskSignals.push('Elevated callback escalation risk');
  }

  if (input.activeAnomalyCount > 2) {
    projectedRiskSignals.push('Multiple anomalies likely to destabilize operations');
  }

  if (input.marginLeakPercent > 10) {
    projectedRiskSignals.push('Margin deterioration likely to continue');
  }

  const projectedOperationalState =
    input.currentHealthScore < 60
      ? 'critical'
      : input.currentHealthScore < 80
      ? 'watch'
      : 'stable';

  const projectedTrend =
    projectedRiskSignals.length > 2
      ? 'declining'
      : projectedRiskSignals.length === 0
      ? 'improving'
      : 'stable';

  return {
    projectedOperationalState,
    projectedTrend,
    projectedRiskSignals
  };
}
