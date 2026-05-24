CREATE TABLE IF NOT EXISTS jobs (
  id TEXT PRIMARY KEY,
  customer_name TEXT,
  address TEXT,
  market TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS operational_events (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  source TEXT NOT NULL,
  captured_by TEXT,
  occurred_at TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  parent_event_id TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE IF NOT EXISTS lineage_records (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  event_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  upstream_event_ids_json TEXT NOT NULL,
  downstream_event_ids_json TEXT NOT NULL,
  notes TEXT,
  FOREIGN KEY (job_id) REFERENCES jobs(id),
  FOREIGN KEY (event_id) REFERENCES operational_events(id)
);

CREATE TABLE IF NOT EXISTS installer_profiles (
  installer_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  level INTEGER NOT NULL,
  active INTEGER NOT NULL,
  specialties_json TEXT NOT NULL,
  risk_flags_json TEXT NOT NULL,
  performance_json TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS qa_scores (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  installer_id TEXT,
  score REAL NOT NULL,
  status TEXT NOT NULL,
  issues_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE TABLE IF NOT EXISTS margin_analyses (
  id TEXT PRIMARY KEY,
  job_id TEXT NOT NULL,
  risk_level TEXT NOT NULL,
  estimated_margin_leak_percent REAL NOT NULL,
  primary_drivers_json TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (job_id) REFERENCES jobs(id)
);

CREATE INDEX IF NOT EXISTS idx_operational_events_job_id ON operational_events(job_id);
CREATE INDEX IF NOT EXISTS idx_operational_events_type ON operational_events(event_type);
CREATE INDEX IF NOT EXISTS idx_lineage_job_id ON lineage_records(job_id);
CREATE INDEX IF NOT EXISTS idx_qa_scores_job_id ON qa_scores(job_id);
CREATE INDEX IF NOT EXISTS idx_margin_analyses_job_id ON margin_analyses(job_id);
