-- Action completion and outcome tracking

CREATE TABLE IF NOT EXISTS action_outcomes (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  completed_by TEXT NOT NULL,
  action_completed TEXT NOT NULL,
  outcome TEXT NOT NULL,
  notes TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_action_outcomes_job_id ON action_outcomes(job_id);
CREATE INDEX IF NOT EXISTS idx_action_outcomes_created_at ON action_outcomes(created_at);
