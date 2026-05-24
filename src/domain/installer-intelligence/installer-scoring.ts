import type { InstallerProfile } from './installer-profile';

export interface InstallerScoreResult {
  installerId: string;
  score: number;
  classification: 'elite' | 'strong' | 'developing' | 'high_attention';
  recommendations: string[];
}

export function calculateInstallerScore(profile: InstallerProfile): InstallerScoreResult {
  let score = 100;
  const recommendations: string[] = [];

  score -= profile.performance.callbackRate * 25;
  score -= profile.performance.averageLaborVariancePercent;
  score -= (100 - profile.performance.qaPassRate) * 0.5;
  score -= (100 - profile.performance.photoComplianceRate) * 0.25;

  if (profile.performance.callbackRate > 0.08) {
    recommendations.push('Review recurring callback patterns');
  }

  if (profile.performance.averageLaborVariancePercent > 15) {
    recommendations.push('Audit labor planning and phase execution');
  }

  if (profile.performance.photoComplianceRate < 90) {
    recommendations.push('Increase field documentation compliance');
  }

  const classification =
    score >= 90
      ? 'elite'
      : score >= 75
      ? 'strong'
      : score >= 60
      ? 'developing'
      : 'high_attention';

  return {
    installerId: profile.installerId,
    score,
    classification,
    recommendations
  };
}
