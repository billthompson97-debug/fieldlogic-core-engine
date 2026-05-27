-- migrations/0003_photo_ai_analyses.sql
-- FieldLogic Phase 1 -- AI Vision Pipeline storage table.
-- Stores Claude Haiku 4.5 verdicts on installer-uploaded photos
-- from JobTread, CompanyCam, or manual sources.

CREATE TABLE IF NOT EXISTS photo_ai_analyses (
  id                TEXT PRIMARY KEY,
  photo_id          TEXT NOT NULL,
  project_id        TEXT,
  job_id            TEXT,
  source            TEXT NOT NULL DEFAULT 'companycam',
  phase             TEXT,
  scope_category    TEXT,
  quality_flags     TEXT,
  coverage_type     TEXT,
  installer_visible INTEGER DEFAULT 0,
  confidence        REAL,
  reasoning         TEXT,
  ai_tags           TEXT,
  full_response     TEXT,
  status            TEXT NOT NULL DEFAULT 'pending',
  model             TEXT,
  processing_ms     INTEGER,
  created_at        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );

CREATE INDEX IF NOT EXISTS idx_photo_ai_analyses_source ON photo_ai_analyses(source);
CREATE INDEX IF NOT EXISTS idx_photo_ai_analyses_job_id ON photo_ai_analyses(job_id);
CREATE INDEX IF NOT EXISTS idx_photo_ai_analyses_photo_id ON photo_ai_analyses(photo_id);
CREATE INDEX IF NOT EXISTS idx_photo_ai_analyses_status ON photo_ai_analyses(status);
CREATE INDEX IF NOT EXISTS idx_photo_ai_analyses_created_at ON photo_ai_analyses(created_at);
