-- Blocked task: Video ID sync
INSERT INTO task_updates (task_id, event_date, description, outcome, created_by) VALUES
('53111111-1111-1111-1111-411111111115', '2026-03-06T15:00:00-03:00', 'Descubrimiento crítico: Blotato API retorna postSubmissionId, no el video ID real', 'Documentado: el ID real solo está disponible cuando status=published (1-10 min delay)', 'kimi'),
('53111111-1111-1111-1111-411111111115', '2026-03-06T15:30:00-03:00', 'Intento: usar Supabase Edge Function cron para polling async', 'Falla: Supabase sa-east-1 tiene IP blocking con Blotato API', 'kimi'),
('53111111-1111-1111-1111-411111111115', '2026-03-06T16:00:00-03:00', 'Alternativa propuesta: n8n workflow con 3 ramas paralelas (shorts/largos/music)', 'Pendiente implementación. Decision required de Matias/Adrian', 'kimi'),
('53111111-1111-1111-1111-411111111115', '2026-03-06T17:00:00-03:00', 'Status: BLOCKED. 3 opciones documentadas: A) Polling, B) Endpoint separado, C) Webhook', 'Esperando decisión de arquitectura. Task queda en blocked con learnings registrados', 'kimi');

-- Upload Multi-Tenant operation task
INSERT INTO task_updates (task_id, event_date, description, outcome, created_by) VALUES
('53111111-1111-1111-1111-311111111112', '2026-03-05T10:00:00-03:00', 'Inicio migración Upload Multi-Tenant: 19 tareas identificadas', 'Features: Edge Functions, schema extendido, upload_logs, feature flags', 'kimi'),
('53111111-1111-1111-1111-311111111112', '2026-03-05T14:00:00-03:00', 'Bug crítico: error header Authorization Bearer vs blotato-api-key', 'Aprendizaje: Blotato usa header propietario, no estándar. Documentado para futuro', 'kimi'),
('53111111-1111-1111-1111-311111111112', '2026-03-05T18:00:00-03:00', 'Regla establecida: CÉLULA DE PRUEBA para todos los tests', 'NUNCA usar Musica Infinita ni HUB para pruebas. Célula 24a324bc-fa7a-496f-9076-c763123a00fb como sandbox', 'kimi'),
('53111111-1111-1111-1111-311111111112', '2026-03-06T12:00:00-03:00', 'Upload-direct Edge Function operativa. Multi-tenant funcionando', '3 tablas soportadas: guiones_shorts, guiones_largos, music_videos', 'kimi'),
('53111111-1111-1111-1111-311111111112', '2026-03-06T16:00:00-03:00', 'Pendiente: video ID sync. Mover a task separado', '19/20 tareas completadas. 1 bloqueada pendiente decisión', 'kimi');
