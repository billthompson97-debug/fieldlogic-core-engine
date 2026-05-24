export interface TrendSnapshot {
  timestamp: string;
  qaScore: number;
  callbackRate: number;
  laborVariancePercent: number;
  homeownerExperienceScore: number;
}

export interface TrendAnalysisResult {
  qaTrend: 'improving' | 'stable' | 'declining';
  callbackTrend: 'improving' | 'stable' | 'declining';
  laborTrend: 'improving' | 'stable' | 'declining';
  homeownerTrend: 'improving' | 'stable' | 'declining';
}

export function analyzeOperationalTrends(
  snapshots: TrendSnapshot[]
): TrendAnalysisResult {
  const first = snapshots[0];
  const last = snapshots[snapshots.length - 1];

  return {
    qaTrend:
      last.qaScore > first.qaScore
        ? 'improving'
        : last.qaScore < first.qaScore
        ? 'declining'
        : 'stable',
    callbackTrend:
      last.callbackRate < first.callbackRate
        ? 'improving'
        : last.callbackRate > first.callbackRate
        ? 'declining'
        : 'stable',
    laborTrend:
      last.laborVariancePercent < first.laborVariancePercent
        ? 'improving'
        : last.laborVariancePercent > first.laborVariancePercent
        ? 'declining'
        : 'stable',
    homeownerTrend:
      last.homeownerExperienceScore > first.homeownerExperienceScore
        ? 'improving'
        : last.homeownerExperienceScore < first.homeownerExperienceScore
        ? 'declining'
        : 'stable'
  };
}
