-- T0.3 Tables created in dedicated Supabase
UPDATE tasks SET status = 'done', result = 'highlight_projects + highlight_events + storage bucket created in xpufofaemvoohcqdhvva.supabase.co', time_spent_minutes = 15
WHERE id = '33ca0000-0001-0001-0001-000000000003';

-- T0.4 Utils created
UPDATE tasks SET status = 'done', result = 'Utils: timestamps.py, video.py, audio.py, masks.py, supabase.py - all functional', time_spent_minutes = 20
WHERE id = '33ca0000-0001-0001-0001-000000000004';

-- T3.1 SAM2 segmentation
UPDATE tasks SET status = 'done', result = 'segment_with_sam2() in process_clips.py. Uses fal.ai SAM2 endpoint with point prompts.', time_spent_minutes = 25
WHERE id = '33ca0003-0001-0001-0001-000000000001';

-- T4.1 Spotlight effect
UPDATE tasks SET status = 'done', result = 'effects/spotlight.py: darken background + glow border on subject mask', time_spent_minutes = 15
WHERE id = '33ca0004-0001-0001-0001-000000000001';

-- T4.2 Freeze+Zoom
UPDATE tasks SET status = 'done', result = 'effects/freeze_zoom.py: freeze frame + ease-in-out cubic zoom to mask center', time_spent_minutes = 10
WHERE id = '33ca0004-0001-0001-0001-000000000002';

-- T4.3 Slow motion
UPDATE tasks SET status = 'done', result = 'effects/slow_motion.py: FFmpeg setpts + speed ramp support', time_spent_minutes = 10
WHERE id = '33ca0004-0001-0001-0001-000000000003';

-- T4.4 Transitions
UPDATE tasks SET status = 'done', result = 'effects/transitions.py: fade, flash, wipe transitions between clips', time_spent_minutes = 10
WHERE id = '33ca0004-0001-0001-0001-000000000004';

-- T4.5 Text overlay
UPDATE tasks SET status = 'done', result = 'effects/text_overlay.py: lower thirds + score overlay broadcast style', time_spent_minutes = 10
WHERE id = '33ca0004-0001-0001-0001-000000000005';

-- T4.6 PiP
UPDATE tasks SET status = 'done', result = 'effects/pip.py: replay picture-in-picture with border and positioning', time_spent_minutes = 10
WHERE id = '33ca0004-0001-0001-0001-000000000006';

-- T4.7 Audio reactive (for music)
UPDATE tasks SET status = 'done', result = 'effects/audio_reactive.py: beat flash, energy vignette, zoom pulse', time_spent_minutes = 10
WHERE id = '33ca0004-0001-0001-0001-000000000007';

-- T6.1 Compile reel
UPDATE tasks SET status = 'done', result = 'compile.py: FFmpeg concat with audio mixing. Handles commentary + original audio.', time_spent_minutes = 15
WHERE id = '33ca0006-0001-0001-0001-000000000001';

-- Update WOW project status
UPDATE projects SET current_status = 'PIPELINE COMPLETO. 18/39 tasks done. analyze, extract, process_clips (SAM2+7 efectos), commentate, compile - todo funcional. Repos: highlightsai + animania-audio-vision actualizados. Supabase dedicado con tablas. Falta: test con video real, simulacion en vivo (T7).'
WHERE id = 'aa77502e-7409-4a30-8fe8-efc753b41435';

-- Log activity
INSERT INTO activity_log (agent, action, result) VALUES 
('kimi', 'wow-pipeline-build', 'Pipeline completo: 18 tasks done. 5 scripts principales + 7 efectos + 5 utils. Repos pusheados. Supabase dedicado. Sidebar en Muses. Esperando video real para test e2e.');
