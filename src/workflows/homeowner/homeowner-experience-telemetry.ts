export interface HomeownerExperienceInput {
  jobId: string;
  homeownerExperienceScore: number;
  reviewReceived: boolean;
  communicationRating: number;
  cleanlinessRating: number;
  notes?: string;
}

export interface HomeownerExperienceResult {
  homeownerRiskSignal: 'positive' | 'watch' | 'negative';
  followUpActions: string[];
}

export function processHomeownerExperience(
  input: HomeownerExperienceInput
): HomeownerExperienceResult {
  const followUpActions: string[] = [];

  if (input.homeownerExperienceScore < 8) {
    followUpActions.push('Customer service follow-up recommended');
  }

  if (!input.reviewReceived) {
    followUpActions.push('Review request follow-up recommended');
  }

  const homeownerRiskSignal =
    input.homeownerExperienceScore < 6
      ? 'negative'
      : input.homeownerExperienceScore < 8
      ? 'watch'
      : 'positive';

  return {
    homeownerRiskSignal,
    followUpActions
  };
}
