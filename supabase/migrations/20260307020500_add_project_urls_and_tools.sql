-- MUSES (Animania) - Update with URLs and tools
UPDATE projects SET 
  github_url = 'https://github.com/matute1111/animania-audio-vision',
  vercel_url = 'https://muses-frontend.vercel.app',
  docs_url = 'https://docs.gennial.ai/muses',
  current_status = 'Plataforma principal de Gennial. 1,547 videos generados. Upload Multi-Tenant operativo. Pendiente: Video ID sync (blocked).'
WHERE id = 'ef539d21-ab43-456b-aa85-3a40ec2b890d';

-- Upload Multi-Tenant (Feature under Muses)
UPDATE projects SET 
  github_url = 'https://github.com/matute1111/animania-audio-vision/tree/main/supabase/functions',
  vercel_url = 'https://muses-frontend.vercel.app/upload',
  docs_url = 'https://docs.gennial.ai/muses/upload-multi-tenant',
  current_status = 'Edge Functions: upload-direct operativa. 19/20 tareas completadas. Blocked: Video ID sync (decision pendiente).'
WHERE id = 'daa6ffda-012d-4163-b9dd-ca9bf9236fd5';

-- MISSION CONTROL
UPDATE projects SET 
  github_url = 'https://github.com/matute1111/mission-control-gennial',
  vercel_url = 'https://mission-control-gennial.vercel.app',
  docs_url = 'https://docs.gennial.ai/mission-control',
  current_status = 'CEREBRO EXTERNO operativo. Task Updates timeline implementado con 14 entries. Jerarquía Macro→Feature→Task funcionando.'
WHERE id = '31111111-1111-1111-1111-111111111111';

-- WOW
UPDATE projects SET 
  github_url = 'https://github.com/matute1111/wow-ai-video',
  vercel_url = null,
  docs_url = null,
  current_status = 'Esperando PRD nuevo de Matias. AI Video Highlights integrado como feature.'
WHERE id = 'aa77502e-7409-4a30-8fe8-efc753b41435';

-- AI Video Highlights (Feature under WOW)
UPDATE projects SET 
  github_url = 'https://github.com/matute1111/wow-ai-video',
  vercel_url = null,
  docs_url = null,
  current_status = 'Esperando PRD nuevo de Matias. 7 hitos planificados: Video Understanding → Clip Extraction → Segmentación SAM2 → Efectos Visuales → Comentarista AI → Compilado Final → Modo Simulación.'
WHERE id = '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8';

-- KIMI (AI Agent)
UPDATE projects SET 
  github_url = 'https://github.com/matute1111/mission-control-gennial',
  vercel_url = null,
  docs_url = 'https://docs.gennial.ai/kimi',
  current_status = 'AI Agent operativo. Model routing implementado. Accesos configurados: Google Workspace, LinkedIn, GitHub, Supabase (Muses + Mission Control).'
WHERE id = '51111111-1111-1111-1111-111111111111';

-- SOUL.md Feature
UPDATE projects SET 
  github_url = 'https://github.com/matute1111/mission-control-gennial/blob/main/SOUL.md',
  current_status = 'Identidad definida: CEO de operaciones, no worker. Reporta a Matias y Adrian. Propósito: hacer crecer Gennial.'
WHERE id = '52111111-1111-1111-1111-111111111111';

-- AGENTS.md Feature  
UPDATE projects SET 
  github_url = 'https://github.com/matute1111/mission-control-gennial/blob/main/AGENTS.md',
  current_status = 'Reglas de operación definidas. Model routing: Gemini Flash-Lite (research), Claude Sonnet 4.5 (code), Kimi K2.5 (coord), Opus 4.6 (critical).'
WHERE id = '52211111-1111-1111-1111-111111111111';

-- HEARTBEAT.md Feature
UPDATE projects SET 
  github_url = 'https://github.com/matute1111/mission-control-gennial/blob/main/HEARTBEAT.md',
  current_status = 'Ciclo de vida definido. Check: pending tasks, blocked/overdue, proposals, activity log. Regla: no noise a Telegram.'
WHERE id = '52311111-1111-1111-1111-111111111111';

-- Skills Feature
UPDATE projects SET 
  github_url = 'https://github.com/matute1111/openclaw-skills',
  current_status = '22+ skills instalados: muses, mission-control, github, docker-essentials, model-usage, backup, capability-evolver, weather, gog, etc.'
WHERE id = '52411111-1111-1111-1111-111111111111';

-- Accesos Feature
UPDATE projects SET 
  current_status = 'Google Workspace (Gmail/Calendar/Drive/Contacts/Sheets/Docs), LinkedIn (perfil propio), GitHub (Gennial repos), Supabase (Muses + Mission Control), Blotato API, Telegram, n8n.'
WHERE id = '52511111-1111-1111-1111-111111111111';
