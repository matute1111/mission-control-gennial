-- Delete existing AI Video Highlights tasks (cascade will handle task_updates)
DELETE FROM tasks WHERE project_id = '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8';

-- Insert new detailed tasks from TASKS-ai-video-highlights-womm.md

-- SETUP INICIAL
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0000-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T0.1: Crear estructura del proyecto', 'Crear directorio highlights-pipeline/, subdirectorios (effects/, utils/, prompts/, output/, tests/), archivos init.py, config.py, .env, requirements.txt, prompts deporte/musica.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0000-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T0.2: Instalar dependencias', 'pip install -r requirements.txt, verificar ffmpeg, probar imports (cv2, librosa, moviepy, google.generativeai, fal_client, numpy, supabase).', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0000-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T0.3: Crear tablas en Supabase MC', 'Crear highlight_projects y highlight_events. Crear bucket highlights publico. Probar insercion.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0000-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T0.4: Crear utilidades base', 'Crear utils/timestamps.py, utils/video.py, utils/audio.py, utils/masks.py, utils/supabase.py con codigo del PRD.', 'todo', 'critical', 'kimi', 'kimi');

-- HITO 1: Video Understanding
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0001-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T1.1: Crear analyze.py', 'Funcion analyze_video: leer prompt segun content_type, subir video a Gemini, parsear JSON, validar timestamps, guardar en Supabase. QA: eventos con start_time, end_time, type, description, intensity. Validar contra video real.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0001-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T1.2: Probar con video de musica', 'Descargar video de recital 5-10 min. Ejecutar analyze_video con content_type=music. Verificar campos de musica (artist, song, energy).', 'todo', 'high', 'kimi', 'kimi'),
('33ca0001-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T1.3: Manejo de videos largos', 'Agregar logica para dividir videos >15 min en segmentos con 30s overlap. Mergear resultados sin duplicados.', 'todo', 'medium', 'kimi', 'kimi');

-- HITO 2: Clip Extraction
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0002-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T2.1: Crear extract.py', 'Funcion extract_clips: leer eventos, detectar solapamientos, cortar con FFmpeg stream copy, generar thumbnails, subir a Supabase Storage, actualizar highlight_events.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0002-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T2.2: Integrar con main.py', 'Crear main.py entry point. Probar: python main.py --video partido.mp4 --type sport --no-effects --no-commentary. Debe ejecutar Hito 1 + 2 completos.', 'todo', 'critical', 'kimi', 'kimi');

-- HITO 3: Segmentacion
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0003-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T3.1: Crear segment.py', 'Funcion segment_clips: enviar clip a fal.ai SAM 2, usar centro del frame como punto de prompt, recibir mascaras frame a frame, guardar en output/masks/.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0003-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T3.2: Probar con clip de recital', 'Ejecutar segment_clips con clip de recital. Verificar que aisla al artista correctamente.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0003-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T3.3: Manejo de fallos', 'Si SAM 2 falla, el clip debe seguir en pipeline sin mascara. Agregar try/except robusto. Loguear fallos pero no detener pipeline.', 'todo', 'high', 'kimi', 'kimi');

-- HITO 4: Efectos Visuales
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0004-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T4.1: Efecto Spotlight', 'Crear effects/spotlight.py. Fondo oscurecido ~30%, sujeto mantiene brillo original. Transicion suave sin bordes duros.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T4.2: Efecto Color Pop', 'Crear effects/color_pop.py. Fondo en B&W, sujeto a color. FFmpeg hue=saturation 0 + maskedmerge.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T4.3: Efecto Glow', 'Crear effects/glow.py. Contorno luminoso alrededor del sujeto. OpenCV dilate + Gaussian blur. Glow azul para goles, rojo para tarjetas.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T4.4: Efecto Freeze + Zoom', 'Crear effects/freeze_zoom.py. Freeze en momento clave + zoom suave. Freeze ~1.5s, zoom al bounding box de la mascara.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000005', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T4.5: Audio Waves', 'Crear effects/audio_waves.py. Ondas expandiendose desde contorno del sujeto, reactivas al volumen (RMS). librosa + OpenCV.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000006', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T4.6: Particulas', 'Crear effects/particles.py. Particulas que emiten desde sujeto en beats detectados. Sistema de particulas con vida limitada (~1s).', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000007', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T4.7: Pulse Glow', 'Crear effects/pulse_glow.py. Glow pulsante sincronizado con RMS del audio. Mas brillo en momentos fuertes.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000008', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T4.8: Orquestador de efectos', 'Crear effects/orchestrator.py y effects.py. select_effects mapea evento+tipo a lista de efectos. apply_effects procesa todos los clips.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000009', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T4.9: Pipeline completo de efectos', 'Ejecutar pipeline: video > analisis > clips > segmentacion > efectos. Probar con futbol y recital. Validar efectos correctos por tipo de evento.', 'todo', 'critical', 'kimi', 'kimi');

-- HITO 5: Comentarista AI
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0005-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T5.1: Crear commentary.py', 'Funcion add_commentary_to_clip: enviar clip a Gemini con prompt de estilo, recibir texto, generar voz ElevenLabs, mezclar audio con FFmpeg (original 30%, comentario 100%, delay 1s).', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0005-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T5.2: Probar generacion de texto', 'Enviar clip de gol a Gemini con prompt de relator argentino. Verificar que texto describe la jugada, tiene tono correcto, no excede ~50 palabras.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0005-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T5.3: Probar generacion de voz', 'Enviar texto a ElevenLabs. Verificar que audio suena bien, es audible, voz coincide con estilo.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0005-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T5.4: Probar mezcla de audio', 'Mezclar audio de comentario sobre clip del gol. Verificar: audio original de fondo bajo, comentario claro, delay ~1s, sin glitches.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0005-0001-0001-0001-000000000005', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T5.5: Probar multiples estilos', 'Generar comentario del mismo clip con 3 estilos: relator_argentino, analista_tactico, fan_estadio. Comparar resultados.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0005-0001-0001-0001-000000000006', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T5.6: Probar con clip de musica', 'Generar comentario de recital con estilo critico_musical. Verificar que describe performance, tono analitico.', 'todo', 'high', 'kimi', 'kimi');

-- HITO 6: Compilado Final
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0006-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T6.1: Crear compile.py', 'Crear compile.py con: add_text_overlay, generate_intro, generate_outro, concatenate_clips. Intro ~4s, outro ~3s.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0006-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T6.2: Probar texto overlay', 'Agregar overlay con tipo de evento + nombre de jugador. Texto blanco con borde negro, centrado inferior, primeros 3s.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0006-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T6.3: Probar intro y outro', 'Generar intro con datos del partido (fondo negro, texto blanco). Generar outro con Generated by AI / Gennial Studios.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0006-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T6.4: Probar compilado completo', 'Compilar reel: intro + clips procesados (con overlay) + outro. Verificar reproduccion completa sin errores, resolucion consistente.', 'todo', 'critical', 'kimi', 'kimi');

-- HITO 7: Simulacion En Vivo
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0007-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T7.1: Crear live_simulation.py', 'Crear live_simulation.py con: run_live_simulation, quick_extract. Buffer circular ultimos 30s, pre-analisis offline, pipeline rapido.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0007-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T7.2: Probar pipeline rapido', 'Ejecutar run_live_simulation con Orlando vs Miami. Medir tiempo de cada paso. Target: <7 segundos total.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0007-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T7.3: Optimizar tiempos', 'Si pipeline >7s: identificar cuello de botella. Reducir tamano clip para Gemini, usar streaming TTS en ElevenLabs.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0007-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T7.4: Implementar fallback', 'Si pipeline >10s: mostrar replay sin comentario inmediatamente, agregar comentario despues sin interrumpir.', 'todo', 'medium', 'kimi', 'kimi');

-- INTEGRACION FINAL
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0008-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T8.1: Pipeline offline futbol', 'Ejecutar: python main.py --video partido.mp4 --type sport --style relator_argentino. Verificar reel final con intro, clips, comentario, outro.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0008-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T8.2: Pipeline offline recital', 'Ejecutar: python main.py --video recital.mp4 --type music --style critico_musical. Verificar efectos audio-reactivos.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0008-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T8.3: Simulacion en vivo futbol', 'Ejecutar: python main.py --video partido.mp4 --type sport --style relator_argentino --mode live. Verificar cada evento genera replay con comentario.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0008-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'T8.4: Preparar demos finales', 'Generar Demo 1 (futbol), Demo 2 (recital), Demo 3 (simulacion en vivo grabada). Subir a Supabase Storage. Crear entradas en Mission Control.', 'todo', 'critical', 'kimi', 'kimi');
