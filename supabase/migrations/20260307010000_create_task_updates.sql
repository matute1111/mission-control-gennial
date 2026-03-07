-- Task Updates (Timeline per task)
-- Run this in Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS task_updates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  task_id uuid NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  event_date timestamptz DEFAULT now(),
  description text NOT NULL,
  outcome text,
  created_by text DEFAULT 'kimi',
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_task_updates_task_id ON task_updates(task_id);
CREATE INDEX IF NOT EXISTS idx_task_updates_event_date ON task_updates(event_date);

ALTER TABLE task_updates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all task_updates" ON task_updates;
CREATE POLICY "Allow all task_updates" ON task_updates FOR ALL USING (true) WITH CHECK (true);
