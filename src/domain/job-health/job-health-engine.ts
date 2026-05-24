export interface JobHealthInputs {
  scopeRiskScore: number;
  qaScore: number;
  laborVariancePercent: number;
  marginLeakPercent: number;
  callbackCount: number;
  scheduleDelayDays: number;
  homeownerExperienceScore?: number;
}

export interface JobHealthResult {
  score: number;
  status: 'healthy' | 'watch' | 'at_risk' | 'intervention_required';
  drivers: string[];
}

export function calculateJobHealth(input: JobHealthInputs): JobHealthResult {
  let score = 100;
  const drivers: string[] = [];

  score -= input.scopeRiskScore * 0.25;
  score -= Math.max(0, 100 - input.qaScore) * 0.4;
  score -= input.laborVariancePercent * 0.7;
  score -= input.marginLeakPercent * 1.2;
  score -= input.callbackCount * 12;
  score -= input.scheduleDelayDays * 2;

  if (typeof input.homeownerExperienceScore === 'number') {
    score -= Math.max(0, 10 - input.homeownerExperienceScore) * 3;
  }

  if (input.scopeRiskScore >= 50) drivers.push('High scope risk');
  if (input.qaScore < 85) drivers.push('QA score below standard');
  if (input.laborVariancePercent > 12) drivers.push('Labor variance above target');
  if (input.marginLeakPercent > 7) drivers.push('Margin exposure detected');
  if (input.callbackCount > 0) drivers.push('Callback activity present');
  if (input.scheduleDelayDays > 2) drivers.push('Schedule delay impacting job health');

  score = Math.max(0, Math.round(score));

  const status =
    score >= 85
      ? 'healthy'
      : score >= 70
      ? 'watch'
      : score >= 55
      ? 'at_risk'
      : 'intervention_required';

  return { score, status, drivers };
}
