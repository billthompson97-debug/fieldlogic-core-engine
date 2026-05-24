export interface CallbackWorkflowInput {
  jobId: string;
  homeownerConcern: string;
  callbackCategory: string;
  daysAfterCompletion: number;
  installerId?: string;
}

export interface CallbackWorkflowResult {
  severity: 'low' | 'moderate' | 'high';
  escalationRequired: boolean;
  actions: string[];
}

export function processCallbackWorkflow(
  input: CallbackWorkflowInput
): CallbackWorkflowResult {
  const actions: string[] = [
    'Create callback review timeline',
    'Attach QA and installer history'
  ];

  const severity =
    input.callbackCategory.includes('waterproof')
      ? 'high'
      : input.daysAfterCompletion < 30
      ? 'moderate'
      : 'low';

  return {
    severity,
    escalationRequired: severity === 'high',
    actions
  };
}
