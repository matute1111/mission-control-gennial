-- ============================================
-- SQL LIMPIO PARA MISSION CONTROL
-- Ejecutar todo de una vez en SQL Editor
-- ============================================

-- Eliminar tablas si existen (para empezar limpio)
DROP TABLE IF EXISTS project_updates CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS proposals CASCADE;
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS projects CASCADE;

-- 1. TABLA PROJECTS
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    phase TEXT DEFAULT 'backlog',
    priority TEXT DEFAULT 'medium',
    created_by TEXT NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    brief TEXT,
    roadmap TEXT,
    current_status TEXT,
    github_url TEXT,
    vercel_url TEXT,
    docs_url TEXT,
    project_type TEXT DEFAULT 'feature',
    parent_project_id UUID REFERENCES projects(id) ON DELETE SET NULL
);

-- 2. TABLA PROJECT_UPDATES
CREATE TABLE project_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    update_type TEXT NOT NULL,
    content TEXT NOT NULL,
    created_by TEXT NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA TASKS
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES projects(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'pending',
    priority TEXT DEFAULT 'medium',
    assigned_to TEXT,
    result TEXT,
    blocked_reason TEXT,
    created_by TEXT NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_agent TEXT,
    agent_profile TEXT,
    model_used TEXT,
    execution_log TEXT,
    subagent_id TEXT,
    technical_details TEXT,
    blockers_encountered TEXT,
    solution_applied TEXT,
    time_spent_minutes INTEGER,
    tools_used TEXT[] DEFAULT '{}',
    files_modified TEXT[] DEFAULT '{}',
    deployment_url TEXT,
    pr_url TEXT,
    deployment_status TEXT,
    learnings TEXT,
    steps_taken TEXT[] DEFAULT '{}',
    decisions_made TEXT[] DEFAULT '{}'
);

-- 4. TABLA PROPOSALS
CREATE TABLE proposals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    proposed_by TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    review_note TEXT,
    reviewed_by TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABLA ACTIVITY_LOG
CREATE TABLE activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent TEXT NOT NULL,
    action TEXT NOT NULL,
    reasoning TEXT,
    result TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX idx_projects_parent ON projects(parent_project_id);
CREATE INDEX idx_projects_type ON projects(project_type);
CREATE INDEX idx_project_updates_project ON project_updates(project_id);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_status ON tasks(status);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all" ON projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON project_updates FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON proposals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all" ON activity_log FOR ALL USING (true) WITH CHECK (true);

-- ============================================
-- INSERTAR MACRO PROYECTOS PRIMERO
-- ============================================

INSERT INTO projects (id, name, description, status, phase, priority, created_by, project_type, brief, roadmap, current_status, github_url, vercel_url) VALUES
('12222222-2222-2222-2222-222222222222', 'Mission Control', 'Sistema de gestión de proyectos, features y tasks con trazabilidad completa.', 'active', 'production', 'critical', 'matias', 'macro', 'Mission Control es el sistema de gestión de proyectos de Gennial Studios. Permite gestionar macro proyectos, features y tasks con trazabilidad completa.', 'FASE 1 COMPLETADA: Sistema de briefs, jerarquía Macro-Feature-Task, trazabilidad completa.', 'FASE 1 COMPLETADA Y DEPLOYADA. Funcionando en producción.', 'https://github.com/matute1111/mission-control-gennial', 'https://mission-control-gennial.vercel.app'),

('11111111-1111-1111-1111-111111111111', 'Muses (Animania)', 'Plataforma de producción de contenido AI para Gennial Studios.', 'active', 'production', 'critical', 'matias', 'macro', 'Muses es la plataforma principal de Gennial Studios.', 'Upload Multi-Tenant 95% completado. Comentarista AI en planificación.', 'Upload 95% completado. Bug pendiente de IDs.', 'https://github.com/matute1111/muses', 'https://muses.gennial.ai'),

('13333333-3333-3333-3333-333333333333', 'WOW', 'Información del proyecto pendiente.', 'active', 'planning', 'high', 'matias', 'macro', 'Información pendiente de Matias.', 'Pendiente.', 'Esperando información.', NULL, NULL);

-- ============================================
-- INSERTAR FEATURES (con parent_project_id)
-- ============================================

INSERT INTO projects (id, name, description, status, phase, priority, created_by, project_type, parent_project_id, brief, roadmap, current_status) VALUES
('22222222-2222-2222-2222-222222222222', 'Sistema de Briefs y Trazabilidad', 'Implementación del sistema de briefs y trazabilidad completa.', 'active', 'completed', 'critical', 'matias', 'feature', '12222222-2222-2222-2222-222222222222', 'Este feature implementa el corazón de Mission Control.', 'COMPLETADO: Sheets, briefs, jerarquía, trazabilidad de tasks.', 'COMPLETADO Y DEPLOYADO.'),

('21111111-1111-1111-1111-111111111111', 'Upload Multi-Tenant', 'Sistema de upload a múltiples plataformas.', 'active', 'production', 'critical', 'matias', 'feature', '11111111-1111-1111-1111-111111111111', 'Sistema de upload multi-plataforma.', '19 tareas completadas. Bug pendiente de IDs.', '95% completado. Bug crítico pendiente.'),

('21211111-1111-1111-1111-111111111111', 'Comentarista AI', 'Sistema que genera comentarios de voz AI para videos.', 'active', 'planning', 'high', 'matias', 'feature', '11111111-1111-1111-1111-111111111111', 'Pipeline automatizado de comentarista AI.', '7 hitos definidos. Arquitectura completa.', 'Fase de planificación completada.'),

('23333333-3333-3333-3333-333333333333', 'AI Video Highlights', 'Pipeline de highlights con efectos y comentarista AI.', 'active', 'planning', 'high', 'matias', 'feature', '13333333-3333-3333-3333-333333333333', 'Mismo proyecto que Comentarista AI.', '7 hitos definidos.', 'Pendiente confirmación.');

-- ============================================
-- INSERTAR TAREAS
-- ============================================

INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, assigned_agent, agent_profile, model_used, result, created_by, time_spent_minutes, tools_used, files_modified, deployment_status, steps_taken, decisions_made, learnings, blockers_encountered, solution_applied) VALUES
('31111111-1111-1111-1111-111111111111', '21111111-1111-1111-1111-111111111111', 'Extender schema celula_configuracion', 'Modificar tabla de configuración de células.', 'done', 'high', 'matias', 'kimi', 'backend', 'moonshot/kimi-k2.5', 'Schema extendido.', 'matias', 60, ARRAY['supabase', 'sql'], ARRAY['supabase/migrations/20260305_add_upload_config.sql'], 'deployed', ARRAY['Analizar schema', 'Agregar campo upload_mode', 'Crear tabla upload_logs'], ARRAY['Usar CHECK constraint'], 'Las migraciones deben ser idempotentes.', NULL, NULL),

('31111111-1111-1111-1111-111111111112', '21111111-1111-1111-1111-111111111111', 'Crear Edge Function upload-direct', 'Desarrollar Edge Function para uploads.', 'done', 'high', 'matias', 'kimi', 'backend', 'moonshot/kimi-k2.5', 'Edge Function implementada.', 'matias', 180, ARRAY['supabase', 'deno', 'blotato-api'], ARRAY['supabase/functions/upload-direct/index.ts'], 'deployed', ARRAY['Crear estructura base', 'Integrar con Blotato API'], ARRAY['Usar header blotato-api-key'], 'Blotato usa header especial.', 'Error 401 al llamar Blotato API.', 'Cambiar a header blotato-api-key.'),

('31111111-1111-1111-1111-111111111113', '21111111-1111-1111-1111-111111111111', '[BUG] Guardar IDs reales de videos', 'No se guardan IDs reales de videos.', 'blocked', 'critical', 'matias', 'kimi', 'backend', 'moonshot/kimi-k2.5', 'Issue documentado. Esperando decisión.', 'matias', 120, ARRAY['supabase', 'blotato-api'], ARRAY['docs/upload-id-problem.md'], 'not_required', ARRAY['Identificar problema', 'Proponer soluciones'], ARRAY['Opción A: Polling', 'Opción B: Endpoint', 'Opción C: Webhook'], 'Blotato devuelve postSubmissionId.', 'No hay forma de obtener ID real inmediatamente.', NULL),

('32222222-2222-2222-2222-222222222221', '22222222-2222-2222-2222-222222222222', 'Implementar TaskDetailSheet', 'Crear componente TaskDetailSheet con trazabilidad.', 'done', 'critical', 'matias', 'kimi', 'frontend/backend', 'moonshot/kimi-k2.5', 'TaskDetailSheet implementado.', 'matias', 120, ARRAY['git', 'vscode', 'react'], ARRAY['src/components/TaskDetailSheet.tsx'], 'deployed', ARRAY['Extender tipo Task', 'Reescribir componente'], ARRAY['Usar arrays', 'Separar bloqueantes'], 'Documentar cada cambio es crucial.', NULL, NULL),

('32222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'Implementar ProjectDetailSheet', 'Crear componente ProjectDetailSheet.', 'done', 'critical', 'matias', 'kimi', 'frontend', 'moonshot/kimi-k2.5', 'ProjectDetailSheet implementado.', 'matias', 90, ARRAY['git', 'vscode', 'react'], ARRAY['src/components/ProjectDetailSheet.tsx'], 'deployed', ARRAY['Crear tipo ProjectUpdate', 'Implementar Sheet'], ARRAY['Separar campos'], 'Edición inline es más usable.', NULL, NULL),

('32222222-2222-2222-2222-222222222223', '22222222-2222-2222-2222-222222222222', 'Implementar jerarquía Macro → Feature → Task', 'Implementar jerarquía de proyectos.', 'done', 'high', 'matias', 'kimi', 'frontend', 'moonshot/kimi-k2.5', 'Jerarquía implementada.', 'matias', 60, ARRAY['git', 'vscode', 'react'], ARRAY['src/pages/Projects.tsx'], 'deployed', ARRAY['Agregar campos', 'Modificar Projects.tsx'], ARRAY['Usar project_type', 'Feature es más claro'], 'Self-referencing foreign key es poderoso.', NULL, NULL);

-- ============================================
-- INSERTAR UPDATES DE HISTORIAL
-- ============================================

INSERT INTO project_updates (project_id, update_type, content, created_by) VALUES
('21111111-1111-1111-1111-111111111111', 'milestone', 'Schema extendido y tabla upload_logs creada', 'kimi'),
('21111111-1111-1111-1111-111111111111', 'milestone', 'Edge Function upload-direct implementada', 'kimi'),
('21111111-1111-1111-1111-111111111111', 'blocker', 'BUG: No se pueden guardar IDs reales de videos', 'kimi'),
('22222222-2222-2222-2222-222222222222', 'milestone', 'TaskDetailSheet implementado', 'kimi'),
('22222222-2222-2222-2222-222222222222', 'milestone', 'ProjectDetailSheet implementado', 'kimi'),
('22222222-2222-2222-2222-222222222222', 'milestone', 'Jerarquía implementada', 'kimi'),
('22222222-2222-2222-2222-222222222222', 'milestone', 'Deployado a Vercel', 'kimi'),
('22222222-2222-2222-2222-222222222222', 'decision', 'Mission Control = CEREBRO EXTERNO', 'matias');

-- ============================================
-- ¡LISTO!
-- ============================================

SELECT '✅ Tablas creadas' as resultado;
SELECT '✅ 3 Macro Proyectos insertados' as resultado;
SELECT '✅ 4 Features insertados' as resultado;
SELECT '✅ 6 Tareas insertadas' as resultado;
SELECT '✅ 8 Updates de historial insertados' as resultado;
SELECT '🎉 Mission Control listo!' as resultado;
