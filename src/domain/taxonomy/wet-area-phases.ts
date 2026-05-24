export const WetAreaPhases = [
  'protection',
  'demo',
  'plumbing',
  'electrical',
  'framing',
  'substrate',
  'waterproofing',
  'wall_install',
  'pan_install',
  'glass_install',
  'trim_finish',
  'cleanup',
  'qa_review'
] as const;

export type WetAreaPhase = typeof WetAreaPhases[number];
