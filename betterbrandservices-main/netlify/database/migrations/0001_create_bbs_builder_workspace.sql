CREATE TABLE IF NOT EXISTS bbs_projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  initial_prompt TEXT NOT NULL DEFAULT '',
  provider TEXT NOT NULL DEFAULT 'bbs-ai',
  status TEXT NOT NULL DEFAULT 'draft',
  published_url TEXT,
  custom_domain TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bbs_projects_user_updated_idx
  ON bbs_projects (user_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS bbs_domains (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT REFERENCES bbs_projects(id) ON DELETE SET NULL,
  hostname TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'needs_configuration',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, hostname)
);

CREATE INDEX IF NOT EXISTS bbs_domains_user_created_idx
  ON bbs_domains (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS bbs_deployments (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT NOT NULL REFERENCES bbs_projects(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  published_url TEXT,
  is_latest BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bbs_deployments_user_created_idx
  ON bbs_deployments (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS bbs_builder_messages (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT NOT NULL REFERENCES bbs_projects(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'queued',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS bbs_builder_messages_project_created_idx
  ON bbs_builder_messages (project_id, created_at ASC);
