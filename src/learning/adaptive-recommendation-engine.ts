export interface RecommendationLearningSignal {
  recommendationCategory: string;
  effectivenessScore: number;
}

export interface AdaptiveRecommendationResult {
  recommendationCategory: string;
  operationalPriority: 'deprioritize' | 'monitor' | 'reinforce';
  reasoning: string;
}

export function generateAdaptiveRecommendationSignals(
  signals: RecommendationLearningSignal[]
): AdaptiveRecommendationResult[] {
  return signals.map(signal => {
    const operationalPriority =
      signal.effectivenessScore > 50
        ? 'reinforce'
        : signal.effectivenessScore < 30
        ? 'deprioritize'
        : 'monitor';

    const reasoning =
      operationalPriority === 'reinforce'
        ? 'Operational outcomes improving after recommendation application'
        : operationalPriority === 'deprioritize'
        ? 'Recommendation pathway underperforming operationally'
        : 'Recommendation pathway requires additional telemetry';

    return {
      recommendationCategory: signal.recommendationCategory,
      operationalPriority,
      reasoning
    };
  });
}
