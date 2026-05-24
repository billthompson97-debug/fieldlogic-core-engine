export interface LaborForecastInputs {
  activeJobs: number;
  averageLaborHoursPerJob: number;
  installerCount: number;
  availableHoursPerInstallerPerWeek: number;
  projectedSalesJobsNext30Days: number;
}

export interface LaborForecastResult {
  projectedRequiredHours: number;
  projectedAvailableHours: number;
  projectedCapacityGap: number;
  utilizationPercent: number;
  recommendation: string;
}

export function forecastLaborCapacity(
  input: LaborForecastInputs
): LaborForecastResult {
  const projectedRequiredHours =
    (input.activeJobs + input.projectedSalesJobsNext30Days) *
    input.averageLaborHoursPerJob;

  const projectedAvailableHours =
    input.installerCount * input.availableHoursPerInstallerPerWeek;

  const projectedCapacityGap =
    projectedAvailableHours - projectedRequiredHours;

  const utilizationPercent = Math.round(
    (projectedRequiredHours / projectedAvailableHours) * 100
  );

  let recommendation = 'Capacity within operational target';

  if (utilizationPercent > 95) {
    recommendation = 'Capacity expansion or schedule compression required';
  } else if (utilizationPercent > 85) {
    recommendation = 'Monitor labor capacity closely';
  }

  return {
    projectedRequiredHours,
    projectedAvailableHours,
    projectedCapacityGap,
    utilizationPercent,
    recommendation
  };
}
