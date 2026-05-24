export interface RetrievalRecord {
  id: string;
  category: string;
  summary: string;
  tags: string[];
}

export interface RetrievalResult {
  id: string;
  relevanceScore: number;
  summary: string;
}

export function retrieveOperationalContext(
  records: RetrievalRecord[],
  query: string
): RetrievalResult[] {
  const normalized = query.toLowerCase();

  return records
    .map(record => {
      let relevanceScore = 0;

      if (record.summary.toLowerCase().includes(normalized)) {
        relevanceScore += 50;
      }

      record.tags.forEach(tag => {
        if (normalized.includes(tag.toLowerCase())) {
          relevanceScore += 20;
        }
      });

      return {
        id: record.id,
        relevanceScore,
        summary: record.summary
      };
    })
    .filter(result => result.relevanceScore > 0)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
