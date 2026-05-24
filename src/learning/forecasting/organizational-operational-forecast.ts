export interface OrganizationalForecastInput {
  averageHealthScore: number;
  callbackRate: number;
  averageMarginLeakPercent: number;
  averageLaborVariancePercent: number;
  activeCriticalJobs: number;
}

export interface OrganizationalForecastResult {
  organizationalRiskLevel: 'low' | 'moderate' | 'high';
  projectedOperationalTrend: 'improving' | 'stable' | 'declining';
  recommendedFocusAreas: string[];
}

export function forecastOrganizationalOperations(
  input: OrganizationalForecastInput
): OrganizationalForecastResult {
  const recommendedFocusAreas: string[] = [];

  if (input.callbackRate > 0.08) {
    recommendedFocusAreas.push('Callback prevention');
  }

  if (input.averageMarginLeakPercent > 7) {
    recommendedFocusAreas.push('Margin protection');
  }

  if (input.averageLaborVariancePercent > 12) {
    recommendedFocusAreas.push('Installer efficiency');
  }

  if (input.activeCriticalJobs > 3) {
    recommendedFocusAreas.push('Production escalation management');
  }

  const organizationalRiskLevel =
    input.activeCriticalJobs > 5 || input.callbackRate > 0.1
      ? 'high'
      : input.averageHealthScore < 80
      ? 'moderate'
      : 'low';

  const projectedOperationalTrend =
    recommendedFocusAreas.length > 3
      ? 'declining'
      : recommendedFocusAreas.length === 0
      ? 'improving'
      : 'stable';

  return {
    organizationalRiskLevel,
    projectedOperationalTrend,
    recommendedFocusAreas
  };
}
