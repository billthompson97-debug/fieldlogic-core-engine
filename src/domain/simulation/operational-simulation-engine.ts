export interface SimulationScenario {
  laborVariancePercent: number;
  callbackRiskProbability: number;
  scheduleDelayDays: number;
  marginLeakPercent: number;
}

export interface SimulationOutcome {
  projectedJobHealthScore: number;
  projectedOperationalStatus: 'healthy' | 'watch' | 'at_risk';
  projectedRisks: string[];
}

export function simulateOperationalOutcome(
  scenario: SimulationScenario
): SimulationOutcome {
  let projectedJobHealthScore = 100;
  const projectedRisks: string[] = [];

  projectedJobHealthScore -= scenario.laborVariancePercent;
  projectedJobHealthScore -= scenario.callbackRiskProbability * 0.4;
  projectedJobHealthScore -= scenario.scheduleDelayDays * 3;
  projectedJobHealthScore -= scenario.marginLeakPercent * 2;

  if (scenario.callbackRiskProbability > 60) {
    projectedRisks.push('Elevated callback exposure');
  }

  if (scenario.marginLeakPercent > 10) {
    projectedRisks.push('Projected margin degradation');
  }

  if (scenario.scheduleDelayDays > 5) {
    projectedRisks.push('Projected scheduling instability');
  }

  const projectedOperationalStatus =
    projectedJobHealthScore >= 80
      ? 'healthy'
      : projectedJobHealthScore >= 60
      ? 'watch'
      : 'at_risk';

  return {
    projectedJobHealthScore,
    projectedOperationalStatus,
    projectedRisks
  };
}
