export interface MarginLeakInputs {
  laborVariancePercent: number;
  materialVariancePercent: number;
  callbackCost: number;
  scheduleDelayDays: number;
  changeOrderCaptured: boolean;
}

export interface MarginLeakAnalysis {
  riskLevel: 'low' | 'moderate' | 'high';
  estimatedMarginLeakPercent: number;
  primaryDrivers: string[];
}

export function detectMarginLeak(input: MarginLeakInputs): MarginLeakAnalysis {
  let estimatedMarginLeakPercent = 0;
  const primaryDrivers: string[] = [];

  estimatedMarginLeakPercent += input.laborVariancePercent * 0.4;
  estimatedMarginLeakPercent += input.materialVariancePercent * 0.3;
  estimatedMarginLeakPercent += input.scheduleDelayDays * 0.75;

  if (input.callbackCost > 0) {
    estimatedMarginLeakPercent += 3;
    primaryDrivers.push('Warranty and callback cost');
  }

  if (!input.changeOrderCaptured) {
    estimatedMarginLeakPercent += 5;
    primaryDrivers.push('Uncaptured scope expansion');
  }

  if (input.laborVariancePercent > 12) {
    primaryDrivers.push('Labor inefficiency');
  }

  if (input.materialVariancePercent > 8) {
    primaryDrivers.push('Material overage');
  }

  const riskLevel =
    estimatedMarginLeakPercent >= 15
      ? 'high'
      : estimatedMarginLeakPercent >= 7
      ? 'moderate'
      : 'low';

  return {
    riskLevel,
    estimatedMarginLeakPercent,
    primaryDrivers
  };
}
