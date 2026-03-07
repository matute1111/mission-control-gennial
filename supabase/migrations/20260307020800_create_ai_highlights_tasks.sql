-- Create tasks for AI Video Highlights - HITO 1 (simplified, using JSON for arrays)
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0001-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H1.1: Setup Google Generative AI', 'Instalar google-generativeai en VPS. Configurar API key. Verificar conexion.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0001-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H1.2: Script upload_and_analyze.py', 'Script que sube video a Gemini, envia prompt segun tipo, parsea JSON de eventos.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0001-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H1.3: Prompt deporte (futbol)', 'Prompt especifico para futbol: goles, jugadas peligrosas, atajadas, tarjetas, penales, celebraciones.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0001-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H1.4: Prompt musica (recital)', 'Prompt para recitales: solos, chorus, crowd_singing, drops, emotional_moments.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0001-0001-0001-0001-000000000005', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H1.5: Manejo videos largos', 'Si video excede limite Gemini, dividir en segmentos 15min con 30s overlap.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0001-0001-0001-0001-000000000006', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H1.6: Validacion timestamps', 'Validar que timestamps de Gemini correspondan a video real. Tolerancia +-3 segundos.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0001-0001-0001-0001-000000000007', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H1.7: Guardar en Supabase', 'Crear tabla highlight_events. Guardar JSON de eventos con referencia al proyecto.', 'todo', 'critical', 'kimi', 'kimi');

-- HITO 2: Clip Extraction
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0002-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H2.1: Script extract_clips.py', 'Script que lee JSON de eventos y corta clips con FFmpeg.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0002-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H2.2: Deteccion solapamiento', 'Detectar eventos que se solapan y mergear en un solo clip.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0002-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H2.3: Generacion thumbnails', 'Extraer frame representativo de cada clip como thumbnail JPG.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0002-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H2.4: Upload Supabase Storage', 'Subir clips y thumbnails a bucket highlights.', 'todo', 'critical', 'kimi', 'kimi');

-- HITO 3: Segmentacion SAM2
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0003-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H3.1: Setup fal.ai SAM2', 'Configurar fal-client. Crear cuenta y obtener API key.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0003-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H3.2: Script segment_clips.py', 'Script que toma clip, envia a SAM2, recibe mascaras frame a frame.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0003-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H3.3: Seleccion sujeto', 'Opcion A: centro del frame. Opcion B: YOLO para detectar persona principal.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0003-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H3.4: Validacion mascaras', 'Superponer mascara sobre clip original y verificar tracking correcto.', 'todo', 'high', 'kimi', 'kimi');

-- HITO 4: Efectos Visuales
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0004-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H4.1: Efecto Spotlight', 'Fondo oscurecido, sujeto principal brillante. FFmpeg con maskedmerge.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H4.2: Efecto Color Pop', 'Todo en B&W excepto sujeto a color. FFmpeg hue=saturation 0 + maskedmerge.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H4.3: Efecto Glow/Outline', 'Contorno brillante alrededor del sujeto. OpenCV dilate + Gaussian blur.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H4.4: Efecto Freeze + Zoom', 'Freeze en momento clave + zoom suave hacia sujeto.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000005', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H4.5: Audio Waves', 'Ondas de audio desde contorno del sujeto, reactivas al volumen.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000006', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H4.6: Particulas en Beats', 'Particulas que emiten desde sujeto en beats detectados.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000007', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H4.7: Pulse Glow', 'Glow pulsante sincronizado con RMS del audio.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0004-0001-0001-0001-000000000008', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H4.8: Orquestador select_effect', 'Mapeo automatico evento a efectos segun tipo y energia.', 'todo', 'critical', 'kimi', 'kimi');

-- HITO 5: Comentarista AI
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0005-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H5.1: Prompts 6 estilos', 'Crear prompts para: relator argentino, analista tactico, fan, britanico, critico musical, narrador epico.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0005-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H5.2: Integracion ElevenLabs', 'Reutilizar credenciales de Muses. Configurar voces por estilo.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0005-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H5.3: Script generate_commentary.py', 'Pipeline: enviar clip a Gemini, recibir texto, generar voz ElevenLabs.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0005-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H5.4: Mezcla audio FFmpeg', 'Mezclar comentario con audio original. Volumen original 30%, comentario 100%, delay 1s.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0005-0001-0001-0001-000000000005', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H5.5: Testing gol Messi', 'Generar 3 versiones de un gol: relator argentino, analista, fan. Validar timing.', 'todo', 'high', 'kimi', 'kimi');

-- HITO 6: Compilado Final
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0006-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H6.1: Intro/Outro', 'Crear intro 3-5s con datos del contenido. Outro 2-3s con logo Gennial.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0006-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H6.2: Texto overlay', 'Mostrar tipo de evento + descripcion corta sobre cada clip.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0006-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H6.3: Crossfade', 'Transicion fade de 0.5s entre clips. FFmpeg xfade.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0006-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H6.4: Script compile_reel.py', 'Orquestador final: intro a clips con crossfade a outro. Upload reel final.', 'todo', 'critical', 'kimi', 'kimi');

-- HITO 7: Simulacion En Vivo
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0007-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H7.1: Buffer circular', 'Mantener ultimos 30 segundos de video en memoria. Buffer circular frame a frame.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0007-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H7.2: Deteccion tiempo real', 'Enviar frame a Gemini cada 2 segundos. Detectar eventos en tiempo real (simulado).', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0007-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H7.3: Pipeline rapido', 'Cortar clip + generar comentario + mezclar audio en 5-7 segundos total.', 'todo', 'critical', 'kimi', 'kimi'),
('33ca0007-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H7.4: UI demo', 'Pantalla dividida: video corriendo + panel AI Processing + timer visible.', 'todo', 'high', 'kimi', 'kimi'),
('33ca0007-0001-0001-0001-000000000005', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H7.5: Testing Orlando vs Miami', 'Probar con video real de partido. Pre-analizar eventos. Medir tiempo real.', 'todo', 'critical', 'kimi', 'kimi');

-- HITO 8: Video Intelligence
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, created_by) VALUES
('33ca0008-0001-0001-0001-000000000001', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H8.1: Crear tablas DB', 'Crear content_structure_analysis y content_patterns en Supabase Muses.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0008-0001-0001-0001-000000000002', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H8.2: Script analyze_published_video.py', 'Descargar video publicado, analizar con Gemini, guardar estructura en DB.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0008-0001-0001-0001-000000000003', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H8.3: Integracion n8n', 'Agregar pasos de analisis y deteccion de patrones al workflow Content Optimization Loop.', 'todo', 'medium', 'kimi', 'kimi'),
('33ca0008-0001-0001-0001-000000000004', '33ca7809-d47a-40b0-a9a3-9aa0b0f988b8', 'H8.4: Modificar /Guiones', 'Aceptar content_directives en body. Inyectar patrones detectados en prompt.', 'todo', 'medium', 'kimi', 'kimi');
