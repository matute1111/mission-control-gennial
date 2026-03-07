UPDATE tasks SET 
  status = 'done',
  result = 'Todas las dependencias instaladas. Gemini OK, fal.ai OK, ElevenLabs OK (86 voices), FFmpeg 8.0.1 OK.',
  time_spent_minutes = 15
WHERE id = '33ca0000-0001-0001-0001-000000000002';

INSERT INTO task_updates (task_id, event_date, description, outcome, created_by) VALUES
('33ca0000-0001-0001-0001-000000000002', NOW(), 'Dependencias instaladas y APIs testeadas', 'Gemini OK, fal.ai OK, ElevenLabs OK (86 voices), FFmpeg 8.0.1', 'kimi');
