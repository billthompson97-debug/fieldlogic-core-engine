export interface CBILiveTelemetryInput {
  jobId: string;
  qaScore?: number;
  callbackCategory?: string;
  callbackRate?: number;
  laborVariancePercent?: number;
  scheduleDelayDays?: number;
  materialVariancePercent?: number;
  estimatedMarginLeakPercent?: number;
  photoComplianceRate?: number;
  homeownerExperienceScore?: number;
}

export interface CBIRuntimeEvaluation {
  jobId: string;
  operationalState: 'stable' | 'watch' | 'critical';
  anomalySignals: string[];
  callbackRiskProbability: number;
  marginRiskSignal: 'low' | 'moderate' | 'high';
  recommendedActions: string[];
}

export function evaluateCBILiveTelemetry(
  input: CBILiveTelemetryInput
): CBIRuntimeEvaluation {
  const anomalySignals: string[] = [];
  const recommendedActions: string[] = [];

  if ((input.qaScore ?? 100) < 85) {
    anomalySignals.push('qa_score_below_standard');
    recommendedActions.push('Schedule secondary QA review');
  }

  if ((input.laborVariancePercent ?? 0) > 12) {
    anomalySignals.push('labor_variance_above_target');
    recommendedActions.push('Review installer phase execution');
  }

  if ((input.scheduleDelayDays ?? 0) > 3) {
    anomalySignals.push('schedule_delay_detected');
    recommendedActions.push('Review schedule dependency chain');
  }

  if ((input.estimatedMarginLeakPercent ?? 0) > 7) {
    anomalySignals.push('margin_leak_detected');
    recommendedActions.push('Review labor, material, and callback drivers');
  }

  if ((input.photoComplianceRate ?? 100) < 90) {
    anomalySignals.push('photo_documentation_gap');
    recommendedActions.push('Enforce phase photo capture standard');
  }

  if ((input.homeownerExperienceScore ?? 10) < 8) {
    anomalySignals.push('homeowner_experience_watch');
    recommendedActions.push('Trigger homeowner follow-up');
  }

  const callbackRiskProbability =
    input.callbackCategory?.includes('waterproofing')
      ? 72
      : (input.qaScore ?? 100) < 85
      ? 46
      : (input.laborVariancePercent ?? 0) > 15
      ? 38
      : 12;

  const marginRiskSignal =
    (input.estimatedMarginLeakPercent ?? 0) > 10
      ? 'high'
      : (input.estimatedMarginLeakPercent ?? 0) > 5
      ? 'moderate'
      : 'low';

  const operationalState =
    callbackRiskProbability > 65 || marginRiskSignal === 'high'
      ? 'critical'
      : anomalySignals.length > 1
      ? 'watch'
      : 'stable';

  return {
    jobId: input.jobId,
    operationalState,
    anomalySignals,
    callbackRiskProbability,
    marginRiskSignal,
    recommendedActions: [...new Set(recommendedActions)]
  };
}
