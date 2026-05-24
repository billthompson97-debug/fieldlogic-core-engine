export const CallbackCategories = [
  'waterproofing_review',
  'glass_alignment',
  'finish_detail',
  'plumbing_adjustment',
  'homeowner_education'
] as const;

export const QAFindingCategories = [
  'photo_documentation_gap',
  'waterproofing_review_required',
  'finish_alignment_review',
  'punch_item_remaining',
  'cleanliness_review'
] as const;

export const OperationalAnomalyCategories = [
  'labor_variance_above_target',
  'schedule_delay_detected',
  'margin_leak_detected',
  'callback_activity_detected',
  'homeowner_experience_watch'
] as const;

export const RecommendationCategories = [
  'secondary_qa_review',
  'installer_phase_review',
  'schedule_dependency_review',
  'callback_prevention_review',
  'homeowner_followup'
] as const;
