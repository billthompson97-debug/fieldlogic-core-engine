export interface ScopeRiskInputs {
  roomAgeYears: number;
  slabFoundation: boolean;
  plumbingRelocationRequired: boolean;
  customGlassRequired: boolean;
  structuralRepairProbability: number;
  homeownerSelectionsFinalized: boolean;
}

export interface ScopeRiskResult {
  riskScore: number;
  classification: 'low' | 'moderate' | 'high';
  warnings: string[];
}

export function calculateScopeRisk(input: ScopeRiskInputs): ScopeRiskResult {
  let riskScore = 0;
  const warnings: string[] = [];

  riskScore += Math.min(input.roomAgeYears / 5, 20);

  if (input.slabFoundation) {
    riskScore += 10;
    warnings.push('Slab foundation increases plumbing modification complexity');
  }

  if (input.plumbingRelocationRequired) {
    riskScore += 20;
    warnings.push('Plumbing relocation required');
  }

  if (input.customGlassRequired) {
    riskScore += 5;
    warnings.push('Custom glass coordination required');
  }

  riskScore += input.structuralRepairProbability * 20;

  if (!input.homeownerSelectionsFinalized) {
    riskScore += 10;
    warnings.push('Selections not finalized');
  }

  const classification =
    riskScore >= 50
      ? 'high'
      : riskScore >= 25
      ? 'moderate'
      : 'low';

  return {
    riskScore,
    classification,
    warnings
  };
}
