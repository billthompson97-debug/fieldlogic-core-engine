export interface CallbackPredictionInputs {
  qaScore: number;
  laborVariancePercent: number;
  scheduleDelayDays: number;
  installerCallbackRate: number;
  waterproofingIssuesDetected: boolean;
  unresolvedPunchItems: number;
}

export interface CallbackPredictionResult {
  probability: number;
  classification: 'low' | 'moderate' | 'high';
  contributors: string[];
}

export function predictCallbackRisk(
  input: CallbackPredictionInputs
): CallbackPredictionResult {
  let probability = 0;
  const contributors: string[] = [];

  probability += Math.max(0, 100 - input.qaScore) * 0.5;
  probability += input.laborVariancePercent * 0.8;
  probability += input.scheduleDelayDays * 2;
  probability += input.installerCallbackRate * 100;
  probability += input.unresolvedPunchItems * 5;

  if (input.waterproofingIssuesDetected) {
    probability += 25;
    contributors.push('Waterproofing issues detected');
  }

  if (input.qaScore < 85) {
    contributors.push('QA score below target');
  }

  if (input.laborVariancePercent > 12) {
    contributors.push('Elevated labor variance');
  }

  if (input.unresolvedPunchItems > 0) {
    contributors.push('Outstanding punch items');
  }

  probability = Math.min(100, Math.round(probability));

  const classification =
    probability >= 60
      ? 'high'
      : probability >= 30
      ? 'moderate'
      : 'low';

  return {
    probability,
    classification,
    contributors
  };
}
