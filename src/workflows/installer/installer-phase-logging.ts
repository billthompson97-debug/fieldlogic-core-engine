export interface InstallerPhaseLogInput {
  jobId: string;
  installerId: string;
  phase: string;
  plannedHours: number;
  actualHours: number;
  notes?: string;
}

export interface InstallerPhaseLogResult {
  laborVariancePercent: number;
  efficiencyClassification: 'efficient' | 'watch' | 'over_budget';
}

export function processInstallerPhaseLog(
  input: InstallerPhaseLogInput
): InstallerPhaseLogResult {
  const laborVariancePercent =
    ((input.actualHours - input.plannedHours) / input.plannedHours) * 100;

  const efficiencyClassification =
    laborVariancePercent > 15
      ? 'over_budget'
      : laborVariancePercent > 5
      ? 'watch'
      : 'efficient';

  return {
    laborVariancePercent,
    efficiencyClassification
  };
}
