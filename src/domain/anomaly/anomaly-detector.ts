export interface OperationalAnomalyInputs {
  laborVariancePercent: number;
  scheduleDelayDays: number;
  callbackCount: number;
  qaScore: number;
  photoComplianceRate: number;
}

export interface OperationalAnomaly {
  severity: 'low' | 'moderate' | 'high';
  category: string;
  description: string;
}

export function detectOperationalAnomalies(
  input: OperationalAnomalyInputs
): OperationalAnomaly[] {
  const anomalies: OperationalAnomaly[] = [];

  if (input.laborVariancePercent > 20) {
    anomalies.push({
      severity: 'high',
      category: 'labor_variance',
      description: 'Labor variance significantly above expected threshold'
    });
  }

  if (input.scheduleDelayDays > 5) {
    anomalies.push({
      severity: 'moderate',
      category: 'schedule_delay',
      description: 'Project schedule delay detected'
    });
  }

  if (input.callbackCount >= 2) {
    anomalies.push({
      severity: 'high',
      category: 'callback_activity',
      description: 'Elevated callback activity detected'
    });
  }

  if (input.qaScore < 80) {
    anomalies.push({
      severity: 'moderate',
      category: 'qa_degradation',
      description: 'QA score below operational standard'
    });
  }

  if (input.photoComplianceRate < 85) {
    anomalies.push({
      severity: 'low',
      category: 'documentation_gap',
      description: 'Photo documentation compliance below target'
    });
  }

  return anomalies;
}
