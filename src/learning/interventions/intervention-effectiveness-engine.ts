export interface InterventionRecord {
  interventionType: string;
  callbackReduced: boolean;
  qaImproved: boolean;
  laborVarianceImproved: boolean;
  marginLeakReduced: boolean;
}

export interface InterventionEffectivenessResult {
  interventionType: string;
  effectivenessScore: number;
}

export function analyzeInterventionEffectiveness(
  interventions: InterventionRecord[]
): InterventionEffectivenessResult[] {
  const grouped = new Map<string, InterventionRecord[]>();

  interventions.forEach(intervention => {
    const existing = grouped.get(intervention.interventionType) ?? [];
    existing.push(intervention);
    grouped.set(intervention.interventionType, existing);
  });

  return Array.from(grouped.entries()).map(([type, records]) => {
    let effectivenessScore = 0;

    records.forEach(record => {
      if (record.callbackReduced) effectivenessScore += 25;
      if (record.qaImproved) effectivenessScore += 25;
      if (record.laborVarianceImproved) effectivenessScore += 25;
      if (record.marginLeakReduced) effectivenessScore += 25;
    });

    return {
      interventionType: type,
      effectivenessScore: Math.round(effectivenessScore / records.length)
    };
  });
}
