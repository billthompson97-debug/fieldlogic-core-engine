export interface JobBenchmarkInput {
  jobId: string;
  installerId?: string;
  scopeType: 'tub_to_shower' | 'shower_replacement' | 'walk_in_tub' | 'dry_area' | 'mixed_scope';
  laborVariancePercent: number;
  materialVariancePercent: number;
  qaScore: number;
  callbackCount: number;
  scheduleDelayDays: number;
  marginLeakPercent: number;
}

export interface BenchmarkSummary {
  sampleSize: number;
  averageLaborVariancePercent: number;
  averageMaterialVariancePercent: number;
  averageQaScore: number;
  averageCallbackCount: number;
  averageScheduleDelayDays: number;
  averageMarginLeakPercent: number;
}

export interface JobBenchmarkResult {
  jobId: string;
  percentileSignals: string[];
  outlierFlags: string[];
  benchmark: BenchmarkSummary;
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function benchmarkJobAgainstPeers(
  target: JobBenchmarkInput,
  peers: JobBenchmarkInput[]
): JobBenchmarkResult {
  const comparable = peers.filter(peer => peer.scopeType === target.scopeType && peer.jobId !== target.jobId);

  const benchmark: BenchmarkSummary = {
    sampleSize: comparable.length,
    averageLaborVariancePercent: average(comparable.map(job => job.laborVariancePercent)),
    averageMaterialVariancePercent: average(comparable.map(job => job.materialVariancePercent)),
    averageQaScore: average(comparable.map(job => job.qaScore)),
    averageCallbackCount: average(comparable.map(job => job.callbackCount)),
    averageScheduleDelayDays: average(comparable.map(job => job.scheduleDelayDays)),
    averageMarginLeakPercent: average(comparable.map(job => job.marginLeakPercent))
  };

  const percentileSignals: string[] = [];
  const outlierFlags: string[] = [];

  if (target.laborVariancePercent > benchmark.averageLaborVariancePercent + 10) {
    outlierFlags.push('labor_variance_outlier');
    percentileSignals.push('Labor variance materially worse than comparable jobs');
  }

  if (target.qaScore < benchmark.averageQaScore - 10) {
    outlierFlags.push('qa_score_outlier');
    percentileSignals.push('QA score materially worse than comparable jobs');
  }

  if (target.marginLeakPercent > benchmark.averageMarginLeakPercent + 5) {
    outlierFlags.push('margin_leak_outlier');
    percentileSignals.push('Margin leakage materially worse than comparable jobs');
  }

  if (target.callbackCount > benchmark.averageCallbackCount) {
    outlierFlags.push('callback_outlier');
    percentileSignals.push('Callback activity above peer benchmark');
  }

  return {
    jobId: target.jobId,
    percentileSignals,
    outlierFlags,
    benchmark
  };
}
