export interface QAInputs {
  waterproofingPass: boolean;
  finishQualityScore: number;
  punchItems: number;
  photoDocumentationComplete: boolean;
  homeownerWalkthroughCompleted: boolean;
}

export interface QAResult {
  score: number;
  status: 'pass' | 'conditional' | 'fail';
  issues: string[];
}

export function calculateQAScore(input: QAInputs): QAResult {
  let score = 100;
  const issues: string[] = [];

  if (!input.waterproofingPass) {
    score -= 40;
    issues.push('Waterproofing validation failed');
  }

  score -= input.punchItems * 5;
  score -= (10 - input.finishQualityScore) * 3;

  if (!input.photoDocumentationComplete) {
    score -= 10;
    issues.push('Photo documentation incomplete');
  }

  if (!input.homeownerWalkthroughCompleted) {
    score -= 5;
    issues.push('Homeowner walkthrough incomplete');
  }

  const status = score >= 85 ? 'pass' : score >= 70 ? 'conditional' : 'fail';

  return {
    score,
    status,
    issues
  };
}
