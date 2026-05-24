export interface BottleneckInputs {
  pendingMaterialOrders: number;
  installerCapacityUtilization: number;
  averageScheduleDelayDays: number;
  qaBacklogCount: number;
  callbackOpenCount: number;
}

export interface BottleneckSignal {
  category: string;
  severity: 'low' | 'moderate' | 'high';
  description: string;
}

export function detectProductionBottlenecks(
  input: BottleneckInputs
): BottleneckSignal[] {
  const signals: BottleneckSignal[] = [];

  if (input.pendingMaterialOrders > 10) {
    signals.push({
      category: 'procurement',
      severity: 'moderate',
      description: 'Material order backlog detected'
    });
  }

  if (input.installerCapacityUtilization > 92) {
    signals.push({
      category: 'labor_capacity',
      severity: 'high',
      description: 'Installer utilization approaching operational limit'
    });
  }

  if (input.averageScheduleDelayDays > 3) {
    signals.push({
      category: 'scheduling',
      severity: 'moderate',
      description: 'Scheduling delays impacting throughput'
    });
  }

  if (input.qaBacklogCount > 5) {
    signals.push({
      category: 'qa_capacity',
      severity: 'moderate',
      description: 'QA review backlog detected'
    });
  }

  if (input.callbackOpenCount > 3) {
    signals.push({
      category: 'warranty_load',
      severity: 'high',
      description: 'Open callback volume impacting operations'
    });
  }

  return signals;
}
