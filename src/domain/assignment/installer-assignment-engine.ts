import type { InstallerProfile } from '../installer-intelligence/installer-profile';

export interface AssignmentInputs {
  jobId: string;
  requiredSpecialties: string[];
  scopeRiskScore: number;
  homeownerExperiencePriority: boolean;
}

export interface AssignmentRecommendation {
  installerId: string;
  compatibilityScore: number;
  reasons: string[];
}

export function recommendInstallers(
  installers: InstallerProfile[],
  input: AssignmentInputs
): AssignmentRecommendation[] {
  return installers
    .filter(installer => installer.active)
    .map(installer => {
      let compatibilityScore = 0;
      const reasons: string[] = [];

      compatibilityScore += installer.level * 10;

      input.requiredSpecialties.forEach(required => {
        if (installer.specialties.includes(required as never)) {
          compatibilityScore += 15;
          reasons.push(`Specialty match: ${required}`);
        }
      });

      if (input.scopeRiskScore > 50 && installer.level >= 5) {
        compatibilityScore += 20;
        reasons.push('Advanced installer recommended for elevated risk scope');
      }

      if (
        input.homeownerExperiencePriority &&
        (installer.performance.homeownerExperienceScore ?? 0) >= 9
      ) {
        compatibilityScore += 10;
        reasons.push('Strong homeowner experience history');
      }

      compatibilityScore -= installer.performance.callbackRate * 100;
      compatibilityScore -= installer.performance.averageLaborVariancePercent;

      return {
        installerId: installer.installerId,
        compatibilityScore: Math.round(compatibilityScore),
        reasons
      };
    })
    .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
}
