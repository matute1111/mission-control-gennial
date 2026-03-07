CREATE TABLE IF NOT EXISTS highlight_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  content_type TEXT NOT NULL DEFAULT 'sport',
  description TEXT,
  source_video_url TEXT,
  source_video_path TEXT,
  reel_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_by TEXT DEFAULT 'kimi',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS highlight_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES highlight_projects(id) ON DELETE CASCADE,
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  event_type TEXT NOT NULL,
  team TEXT,
  player TEXT,
  description TEXT,
  intensity INTEGER DEFAULT 5,
  energy TEXT,
  clip_url TEXT,
  thumbnail_url TEXT,
  processed_clip_url TEXT,
  mask_url TEXT,
  effect_applied TEXT,
  final_clip_url TEXT,
  commentary_text TEXT,
  commentary_style TEXT,
  status TEXT NOT NULL DEFAULT 'detected',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_highlight_events_project ON highlight_events(project_id);
CREATE INDEX idx_highlight_events_status ON highlight_events(status);

ALTER TABLE highlight_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlight_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "allow_all_highlight_projects" ON highlight_projects;
CREATE POLICY "allow_all_highlight_projects" ON highlight_projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "allow_all_highlight_events" ON highlight_events;
CREATE POLICY "allow_all_highlight_events" ON highlight_events FOR ALL USING (true) WITH CHECK (true);
