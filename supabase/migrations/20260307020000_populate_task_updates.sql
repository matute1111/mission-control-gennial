INSERT INTO task_updates (task_id, event_date, description, outcome, created_by) VALUES
('53111111-1111-1111-1111-311111111113', '2026-03-06T09:00:00-03:00', 'Inicio diseño arquitectura: jerarquía Macro → Feature → Task', 'Schema diseñado: projects, tasks, project_updates. Campos de brief, roadmap, current_status', 'kimi'),
('53111111-1111-1111-1111-311111111113', '2026-03-06T11:00:00-03:00', 'Bug: column mismatch entre schema y datos cargados', 'Decisión: dropear todas las tablas y recrear desde cero con schema limpio', 'kimi'),
('53111111-1111-1111-1111-311111111113', '2026-03-06T14:00:00-03:00', 'Poblado de datos: 37 tasks, 7 projects, 16 updates', 'Muses, Upload Multi-Tenant, WOW, AI Video Highlights, Kimi projects — todo en Mission Control', 'kimi'),
('53111111-1111-1111-1111-311111111113', '2026-03-06T18:00:00-03:00', 'Deploy a Vercel exitoso. Mission Control online', 'https://mission-control-gennial.vercel.app funcionando con trazabilidad completa', 'kimi'),
('53111111-1111-1111-1111-311111111113', '2026-03-06T22:00:00-03:00', 'Feature: Agent section en sidebar', 'Commit 24f0cd1 — UI muestra identidad del agente junto a user profile', 'kimi'),
('53111111-1111-1111-1111-311111111113', '2026-03-06T23:00:00-03:00', 'Feature: Task Updates (seguimiento cronológico)', 'Tabla task_updates + UI timeline. Cada task ahora tiene historia de eventos', 'kimi');
