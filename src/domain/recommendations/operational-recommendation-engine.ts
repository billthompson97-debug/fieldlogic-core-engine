export interface RecommendationInputs {
  jobHealthScore: number;
  callbackRiskProbability: number;
  laborVariancePercent: number;
  qaScore: number;
  scheduleDelayDays: number;
  anomaliesDetected: string[];
}

export interface OperationalRecommendation {
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  recommendation: string;
}

export function generateOperationalRecommendations(
  input: RecommendationInputs
): OperationalRecommendation[] {
  const recommendations: OperationalRecommendation[] = [];

  if (input.jobHealthScore < 70) {
    recommendations.push({
      priority: 'high',
      category: 'job_health',
      recommendation: 'Escalate project to production leadership review'
    });
  }

  if (input.callbackRiskProbability > 60) {
    recommendations.push({
      priority: 'urgent',
      category: 'callback_prevention',
      recommendation: 'Perform proactive QA intervention before project completion'
    });
  }

  if (input.laborVariancePercent > 15) {
    recommendations.push({
      priority: 'medium',
      category: 'labor_efficiency',
      recommendation: 'Review installer assignment and labor phase execution'
    });
  }

  if (input.qaScore < 85) {
    recommendations.push({
      priority: 'high',
      category: 'quality_control',
      recommendation: 'Conduct secondary QA inspection and punch verification'
    });
  }

  if (input.scheduleDelayDays > 3) {
    recommendations.push({
      priority: 'medium',
      category: 'scheduling',
      recommendation: 'Re-evaluate scheduling dependencies and material readiness'
    });
  }

  if (input.anomaliesDetected.length > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'anomaly_response',
      recommendation: 'Investigate operational anomaly patterns for upstream causes'
    });
  }

  return recommendations;
}
