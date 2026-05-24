export interface LongitudinalMemoryEntry {
  jobId: string;
  timestamp: string;
  healthScore: number;
  callbackRiskProbability: number;
  marginRiskSignal: string;
  interventionApplied?: string;
}

export class LongitudinalOperationalMemory {
  private history: LongitudinalMemoryEntry[] = [];

  add(entry: LongitudinalMemoryEntry): void {
    this.history.push(entry);
  }

  findByJob(jobId: string): LongitudinalMemoryEntry[] {
    return this.history.filter(entry => entry.jobId === jobId);
  }
}
