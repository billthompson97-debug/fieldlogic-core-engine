export interface InstallerCoachingInputs {
  installerId: string;
  callbackRate: number;
  qaScore: number;
  laborVariancePercent: number;
  photoComplianceRate: number;
}

export interface CoachingRecommendation {
  focusArea: string;
  recommendation: string;
  urgency: 'low' | 'medium' | 'high';
}

export function generateInstallerCoachingRecommendations(
  input: InstallerCoachingInputs
): CoachingRecommendation[] {
  const recommendations: CoachingRecommendation[] = [];

  if (input.callbackRate > 0.08) {
    recommendations.push({
      focusArea: 'callback_reduction',
      recommendation: 'Review recurring installation quality and handoff standards',
      urgency: 'high'
    });
  }

  if (input.qaScore < 85) {
    recommendations.push({
      focusArea: 'quality_control',
      recommendation: 'Increase QA checkpoint verification and punch discipline',
      urgency: 'high'
    });
  }

  if (input.laborVariancePercent > 12) {
    recommendations.push({
      focusArea: 'labor_efficiency',
      recommendation: 'Audit phase planning and execution efficiency',
      urgency: 'medium'
    });
  }

  if (input.photoComplianceRate < 90) {
    recommendations.push({
      focusArea: 'documentation',
      recommendation: 'Improve field photo capture consistency and standards compliance',
      urgency: 'low'
    });
  }

  return recommendations;
}
