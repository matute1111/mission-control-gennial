-- Add detailed tools info as project updates

-- Muses tools
INSERT INTO project_updates (project_id, update_type, content, created_by) VALUES
('ef539d21-ab43-456b-aa85-3a40ec2b890d', 'note', 'Tools: Supabase (pnyvavhnkuicikkjougj), Blotato API, YouTube API, Telegram Bot, n8n, Vercel, GitHub', 'kimi'),
('ef539d21-ab43-456b-aa85-3a40ec2b890d', 'note', 'DB: 3 tablas (guiones_shorts, guiones_largos, music_videos). ~1,547 videos totales. 458 shorts, 89 largos, 1000+ en YouTube', 'kimi'),
('ef539d21-ab43-456b-aa85-3a40ec2b890d', 'note', 'Canales: Musica Infinita, HUB de historias Intergalacticas, Musica Infinita Kids', 'kimi');

-- Upload Multi-Tenant tools
INSERT INTO project_updates (project_id, update_type, content, created_by) VALUES
('daa6ffda-012d-4163-b9dd-ca9bf9236fd5', 'note', 'Edge Functions: upload-direct (operativa), youtube-oauth-refresh, blotato-upload', 'kimi'),
('daa6ffda-012d-4163-b9dd-ca9bf9236fd5', 'note', 'Schema: celula_configuracion, upload_logs, per-platform status columns en 3 tablas de video', 'kimi'),
('daa6ffda-012d-4163-b9dd-ca9bf9236fd5', 'note', 'Celulas: Célula de Prueba (24a324bc-fa7a-496f-9076-c763123a00fb), HUB, Musica Infinita', 'kimi'),
('daa6ffda-012d-4163-b9dd-ca9bf9236fd5', 'note', 'Blotato API: usa header blotato-api-key (NO Authorization Bearer). Limit: 10 videos/24hr YouTube', 'kimi');

-- Mission Control tools
INSERT INTO project_updates (project_id, update_type, content, created_by) VALUES
('31111111-1111-1111-1111-111111111111', 'note', 'Stack: React + TypeScript + Tailwind + shadcn/ui + Supabase + Vercel', 'kimi'),
('31111111-1111-1111-1111-111111111111', 'note', 'Supabase: zyyebbeqofkhsanhwerk (sa-east-1). Tablas: projects, tasks, project_updates, task_updates', 'kimi'),
('31111111-1111-1111-1111-111111111111', 'note', 'Features: Sheets laterales, brief editable, roadmap, current_status, timeline de seguimiento por task', 'kimi');

-- WOW tools (placeholder for now)
INSERT INTO project_updates (project_id, update_type, content, created_by) VALUES
('aa77502e-7409-4a30-8fe8-efc753b41435', 'note', 'Stack pendiente definición. Esperando PRD de Matias.', 'kimi');

-- AI Video Highlights tools
INSERT INTO project_updates (project_id, update_type, content, created_by) VALUES
('33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'note', 'Stack planificado: Gemini 2.5 Flash, FFmpeg, SAM 2 via fal.ai, ElevenLabs, Supabase', 'kimi'),
('33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'note', 'Costo estimado: $0.50-0.80 por video. 7 hitos: Video Understanding → Clip Extraction → Segmentación → Efectos → Comentarista → Compilado → Simulación', 'kimi'),
('33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'note', 'Demos para WoMM: Fútbol (highlights argentino), Recital (audio-reactivo), Simulación en vivo (5-7 sec)', 'kimi');

-- Kimi tools
INSERT INTO project_updates (project_id, update_type, content, created_by) VALUES
('51111111-1111-1111-1111-111111111111', 'note', 'Modelos: Gemini 2.5 Flash-Lite (research), Claude Sonnet 4.5 (code/writing), Kimi K2.5 (coordination), Claude Opus 4.6 (critical), GPT-5-nano (automation)', 'kimi'),
('51111111-1111-1111-1111-111111111111', 'note', 'Skills: 22+ instalados. Sistema: mission-control, muses, github, docker-essentials, model-usage, backup, capability-evolver, weather, gog', 'kimi'),
('51111111-1111-1111-1111-111111111111', 'note', 'Accesos: Google Workspace, LinkedIn (own profile), GitHub, Supabase (2 proyectos), Blotato API, Telegram', 'kimi');
