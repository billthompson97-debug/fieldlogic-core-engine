export interface RuntimeOutcomeFeedback {
  jobId: string;
  recommendationCategory: string;
  recommendationApplied: boolean;
  callbackOccurred: boolean;
  qaImproved: boolean;
  laborVarianceImproved: boolean;
  homeownerExperienceImproved: boolean;
  marginLeakReduced: boolean;
}

export interface RuntimeLearningResult {
  recommendationCategory: string;
  effectivenessScore: number;
  learningSignals: string[];
}

export function evaluateRuntimeOutcomeLearning(
  feedback: RuntimeOutcomeFeedback[]
): RuntimeLearningResult[] {
  const grouped = new Map<string, RuntimeOutcomeFeedback[]>();

  feedback.forEach(entry => {
    const existing = grouped.get(entry.recommendationCategory) ?? [];
    existing.push(entry);
    grouped.set(entry.recommendationCategory, existing);
  });

  return Array.from(grouped.entries()).map(([category, entries]) => {
    let effectivenessScore = 0;
    const learningSignals: string[] = [];

    entries.forEach(entry => {
      if (entry.recommendationApplied) effectivenessScore += 10;
      if (!entry.callbackOccurred) effectivenessScore += 15;
      if (entry.qaImproved) effectivenessScore += 10;
      if (entry.laborVarianceImproved) effectivenessScore += 10;
      if (entry.homeownerExperienceImproved) effectivenessScore += 10;
      if (entry.marginLeakReduced) effectivenessScore += 15;
    });

    effectivenessScore = Math.round(effectivenessScore / entries.length);

    if (effectivenessScore > 50) {
      learningSignals.push('Recommendation pathway producing positive operational outcomes');
    }

    if (effectivenessScore < 30) {
      learningSignals.push('Recommendation pathway requires operational review');
    }

    return {
      recommendationCategory: category,
      effectivenessScore,
      learningSignals
    };
  });
}
