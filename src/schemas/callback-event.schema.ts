export interface CallbackEvent {
  callbackId: string;
  jobId: string;
  installerId?: string;
  phase:
    | 'demo'
    | 'plumbing'
    | 'electrical'
    | 'substrate'
    | 'waterproofing'
    | 'wall_install'
    | 'glass'
    | 'finish';
  severity: 'low' | 'medium' | 'high' | 'critical';
  defectCategory:
    | 'water_intrusion'
    | 'alignment'
    | 'finish_damage'
    | 'material_failure'
    | 'communication_failure'
    | 'scope_gap'
    | 'installation_error';
  rootCause: string;
  resolutionAction: string;
  warrantyCost?: number;
  createdAt: string;
}
