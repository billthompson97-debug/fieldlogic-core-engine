export interface OperationalMemoryEntry {
  memoryId: string;
  jobId: string;
  category: string;
  summary: string;
  createdAt: string;
  tags: string[];
}

export class OperationalMemoryStore {
  private memories: OperationalMemoryEntry[] = [];

  add(entry: OperationalMemoryEntry): void {
    this.memories.push(entry);
  }

  findByJob(jobId: string): OperationalMemoryEntry[] {
    return this.memories.filter(memory => memory.jobId === jobId);
  }

  searchByTag(tag: string): OperationalMemoryEntry[] {
    return this.memories.filter(memory =>
      memory.tags.includes(tag)
    );
  }
}
