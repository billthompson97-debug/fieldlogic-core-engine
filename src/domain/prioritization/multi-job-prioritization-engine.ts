export interface PrioritizedJob {
  jobId: string;
  jobHealthScore: number;
  callbackRiskProbability: number;
  activeAnomalyCount: number;
  scheduleDelayDays: number;
}

export interface PrioritizedJobResult {
  jobId: string;
  priorityScore: number;
  operationalPriority: 'normal' | 'elevated' | 'critical';
}

export function prioritizeOperationalAttention(
  jobs: PrioritizedJob[]
): PrioritizedJobResult[] {
  return jobs
    .map(job => {
      let priorityScore = 0;

      priorityScore += Math.max(0, 100 - job.jobHealthScore);
      priorityScore += job.callbackRiskProbability;
      priorityScore += job.activeAnomalyCount * 10;
      priorityScore += job.scheduleDelayDays * 5;

      const operationalPriority =
        priorityScore >= 120
          ? 'critical'
          : priorityScore >= 70
          ? 'elevated'
          : 'normal';

      return {
        jobId: job.jobId,
        priorityScore,
        operationalPriority
      };
    })
    .sort((a, b) => b.priorityScore - a.priorityScore);
}
