export interface OperationalMemoryRecord {
  memoryId: string;
  jobId: string;
  category: string;
  summary: string;
  tags: string[];
  createdAt: string;
}

export interface SemanticSearchResult {
  memoryId: string;
  relevanceScore: number;
  summary: string;
}

export function searchOperationalMemory(
  records: OperationalMemoryRecord[],
  query: string
): SemanticSearchResult[] {
  const normalizedQuery = query.toLowerCase();

  return records
    .map(record => {
      let relevanceScore = 0;

      if (record.summary.toLowerCase().includes(normalizedQuery)) {
        relevanceScore += 50;
      }

      record.tags.forEach(tag => {
        if (normalizedQuery.includes(tag.toLowerCase())) {
          relevanceScore += 20;
        }
      });

      return {
        memoryId: record.memoryId,
        relevanceScore,
        summary: record.summary
      };
    })
    .filter(result => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
