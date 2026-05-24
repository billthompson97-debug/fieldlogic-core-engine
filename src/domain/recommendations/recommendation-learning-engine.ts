export interface RecommendationOutcome {
  recommendationId: string;
  category: string;
  accepted: boolean;
  outcome: 'improved' | 'unchanged' | 'degraded';
}

export interface RecommendationLearningSummary {
  category: string;
  acceptanceRate: number;
  improvementRate: number;
}

export function analyzeRecommendationPerformance(
  outcomes: RecommendationOutcome[]
): RecommendationLearningSummary[] {
  const grouped = new Map<string, RecommendationOutcome[]>();

  outcomes.forEach(outcome => {
    const existing = grouped.get(outcome.category) ?? [];
    existing.push(outcome);
    grouped.set(outcome.category, existing);
  });

  return Array.from(grouped.entries()).map(([category, records]) => {
    const accepted = records.filter(record => record.accepted).length;
    const improved = records.filter(record => record.outcome === 'improved').length;

    return {
      category,
      acceptanceRate: accepted / records.length,
      improvementRate: improved / records.length
    };
  });
}
