export interface QAAgentInput {
  jobId: string;
  qaScore: number;
  unresolvedPunchItems: number;
  callbackRiskProbability: number;
}

export interface QAAgentResult {
  status: 'pass' | 'review_required' | 'critical';
  actions: string[];
}

export function evaluateQAAgent(
  input: QAAgentInput
): QAAgentResult {
  const actions: string[] = [];

  if (input.qaScore < 85) {
    actions.push('Perform secondary QA inspection');
  }

  if (input.unresolvedPunchItems > 3) {
    actions.push('Resolve outstanding punch items before closeout');
  }

  if (input.callbackRiskProbability > 60) {
    actions.push('Escalate callback prevention review');
  }

  const status =
    input.callbackRiskProbability > 70
      ? 'critical'
      : input.qaScore < 85
      ? 'review_required'
      : 'pass';

  return {
    status,
    actions
  };
}
