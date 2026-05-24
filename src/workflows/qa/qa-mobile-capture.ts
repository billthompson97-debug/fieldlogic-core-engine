export interface QAMobileCaptureInput {
  jobId: string;
  installerId: string;
  phase: string;
  qaScore: number;
  unresolvedPunchItems: number;
  findings: string[];
  photoIds: string[];
}

export interface QAMobileCaptureResult {
  accepted: boolean;
  callbackRiskProbability: number;
  requiredActions: string[];
}

export function processQAMobileCapture(
  input: QAMobileCaptureInput
): QAMobileCaptureResult {
  const requiredActions: string[] = [];

  if (input.qaScore < 85) {
    requiredActions.push('Secondary QA inspection required');
  }

  if (input.unresolvedPunchItems > 2) {
    requiredActions.push('Punch remediation required before completion');
  }

  const callbackRiskProbability =
    input.qaScore < 80
      ? 65
      : input.qaScore < 90
      ? 32
      : 12;

  return {
    accepted: true,
    callbackRiskProbability,
    requiredActions
  };
}
