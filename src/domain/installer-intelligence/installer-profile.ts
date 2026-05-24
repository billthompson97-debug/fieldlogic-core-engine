export interface InstallerProfile {
  installerId: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  active: boolean;
  specialties: InstallerSpecialty[];
  riskFlags: InstallerRiskFlag[];
  performance: InstallerPerformanceSnapshot;
}

export type InstallerSpecialty =
  | 'demo'
  | 'plumbing_support'
  | 'wall_systems'
  | 'waterproofing'
  | 'tile'
  | 'solid_surface'
  | 'glass'
  | 'finish_carpentry'
  | 'customer_communication';

export type InstallerRiskFlag =
  | 'new_to_system'
  | 'callback_trend'
  | 'labor_overage_trend'
  | 'photo_compliance_gap'
  | 'scope_complexity_mismatch'
  | 'customer_communication_gap';

export interface InstallerPerformanceSnapshot {
  jobsCompleted: number;
  callbackRate: number;
  averageLaborVariancePercent: number;
  qaPassRate: number;
  photoComplianceRate: number;
  homeownerExperienceScore?: number;
}
