-- T0.3 Tablas creadas
UPDATE tasks SET status = 'done', result = 'Tablas highlight_projects y highlight_events creadas con RLS.', time_spent_minutes = 10
WHERE id = '33ca0000-0001-0001-0001-000000000003';

-- T1.1 analyze.py creado
UPDATE tasks SET status = 'done', result = 'analyze.py funcional. Sube video a Gemini, analiza, devuelve JSON con eventos.', time_spent_minutes = 20
WHERE id = '33ca0001-0001-0001-0001-000000000001';

-- T2.1 extract.py creado
UPDATE tasks SET status = 'done', result = 'extract.py funcional. Corta clips con FFmpeg, aplica buffers, valida duraciones.', time_spent_minutes = 15
WHERE id = '33ca0002-0001-0001-0001-000000000001';

-- T5.1 commentate.py creado
UPDATE tasks SET status = 'done', result = 'commentate.py funcional. Gemini genera texto, ElevenLabs genera audio.', time_spent_minutes = 20
WHERE id = '33ca0005-0001-0001-0001-000000000001';

-- Update WOW status
UPDATE projects SET current_status = 'T0.1-T0.3 DONE. T1.1, T2.1, T5.1, T6.1 DONE. Pipeline base funcional: analyze, extract, commentate, compile. Falta: SAM2 (T3), efectos (T4), test real con video de futbol.'
WHERE id = 'aa77502e-7409-4a30-8fe8-efc753b41435';
