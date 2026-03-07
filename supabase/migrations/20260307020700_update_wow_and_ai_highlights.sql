-- Update WOW project - roadmap is JSON array
UPDATE projects SET 
  description = 'WOW investor demo event',
  brief = 'Demo for investors. Muses, AI Highlights, Kimi avatar.',
  current_status = 'PRD v4 received. 8 milestones defined.',
  docs_url = 'https://claude.ai/public/artifacts/313baff8-0dbe-40ad-b4a6-5cf9c877e757'
WHERE id = 'aa77502e-7409-4a30-8fe8-efc753b41435';

-- Update AI Video Highlights
UPDATE projects SET 
  description = 'AI video highlights with effects',
  brief = 'Automated video pipeline with AI commentary',
  current_status = 'PRD v4 complete. Cost 0.50-0.95 per video.',
  docs_url = 'https://claude.ai/public/artifacts/313baff8-0dbe-40ad-b4a6-5cf9c877e757'
WHERE id = '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8';

-- Add project updates
INSERT INTO project_updates (project_id, update_type, content, created_by) VALUES
('33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'milestone', 'PRD v4 received with 8 milestones', 'kimi'),
('33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'note', 'Stack: Gemini, SAM2, FFmpeg, ElevenLabs', 'kimi'),
('33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'note', 'Milestone 7: 5-7 second replay generation', 'kimi');
