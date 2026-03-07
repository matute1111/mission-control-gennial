-- ============================================
-- SQL COMPLETO PARA MISSION CONTROL
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================

-- 1. TABLA PROJECTS
CREATE TABLE IF NOT EXISTS projects (
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
    project_type TEXT DEFAULT 'feature' CHECK (project_type IN ('macro', 'feature')),
    parent_project_id UUID REFERENCES projects(id) ON DELETE SET NULL
);

-- 2. TABLA PROJECT_UPDATES
CREATE TABLE IF NOT EXISTS project_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    update_type TEXT NOT NULL CHECK (update_type IN ('milestone', 'blocker', 'decision', 'progress', 'note')),
    content TEXT NOT NULL,
    created_by TEXT NOT NULL DEFAULT 'system',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABLA TASKS
CREATE TABLE IF NOT EXISTS tasks (
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
    deployment_status TEXT CHECK (deployment_status IN ('deployed', 'partial', 'failed', 'pending', 'not_required')),
    learnings TEXT,
    steps_taken TEXT[] DEFAULT '{}',
    decisions_made TEXT[] DEFAULT '{}'
);

-- 4. TABLA PROPOSALS
CREATE TABLE IF NOT EXISTS proposals (
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
CREATE TABLE IF NOT EXISTS activity_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent TEXT NOT NULL,
    action TEXT NOT NULL,
    reasoning TEXT,
    result TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ÍNDICES
CREATE INDEX IF NOT EXISTS idx_projects_parent ON projects(parent_project_id);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);
CREATE INDEX IF NOT EXISTS idx_project_updates_project ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- POLÍTICAS RLS (Row Level Security)
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
-- INSERTAR DATOS DE PROYECTOS
-- ============================================

-- MISSION CONTROL (Macro Proyecto)
INSERT INTO projects (id, name, description, status, phase, priority, created_by, project_type, brief, roadmap, current_status, github_url, vercel_url)
VALUES (
    '12222222-2222-2222-2222-222222222222',
    'Mission Control',
    'Sistema de gestión de proyectos, features y tasks con trazabilidad completa.',
    'active',
    'production',
    'critical',
    'matias',
    'macro',
    'Mission Control es el sistema de gestión de proyectos de Gennial Studios. Permite gestionar macro proyectos, features y tasks con trazabilidad completa.',
    'FASE 1 COMPLETADA: Sistema de briefs, jerarquía Macro-Feature-Task, trazabilidad completa. FASE 2: Dashboard y filtros. FASE 3: Automatización.',
    'FASE 1 COMPLETADA Y DEPLOYADA. Funcionando en producción.',
    'https://github.com/matute1111/mission-control-gennial',
    'https://mission-control-gennial.vercel.app'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Sistema de Briefs (Feature de Mission Control)
INSERT INTO projects (id, name, description, status, phase, priority, created_by, project_type, parent_project_id, brief, roadmap, current_status)
VALUES (
    '22222222-2222-2222-2222-222222222222',
    'Sistema de Briefs y Trazabilidad',
    'Implementación del sistema de briefs y trazabilidad completa.',
    'active',
    'completed',
    'critical',
    'matias',
    'feature',
    '12222222-2222-2222-2222-222222222222',
    'Este feature implementa el corazón de Mission Control.',
    'COMPLETADO: Sheets, briefs, jerarquía, trazabilidad de tasks.',
    'COMPLETADO Y DEPLOYADO.'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- MUSES (Macro Proyecto)
INSERT INTO projects (id, name, description, status, phase, priority, created_by, project_type, brief, roadmap, current_status, github_url, vercel_url)
VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Muses (Animania)',
    'Plataforma de producción de contenido AI para Gennial Studios.',
    'active',
    'production',
    'critical',
    'matias',
    'macro',
    'Muses es la plataforma principal de Gennial Studios.',
    'Upload Multi-Tenant 95% completado. Comentarista AI en planificación.',
    'Upload 95% completado. Bug pendiente de IDs.',
    'https://github.com/matute1111/muses',
    'https://muses.gennial.ai'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Upload Multi-Tenant (Feature de Muses)
INSERT INTO projects (id, name, description, status, phase, priority, created_by, project_type, parent_project_id, brief, roadmap, current_status)
VALUES (
    '21111111-1111-1111-1111-111111111111',
    'Upload Multi-Tenant',
    'Sistema de upload a múltiples plataformas.',
    'active',
    'production',
    'critical',
    'matias',
    'feature',
    '11111111-1111-1111-1111-111111111111',
    'Sistema de upload multi-plataforma.',
    '19 tareas completadas. Bug pendiente de IDs.',
    '95% completado. Bug crítico pendiente.'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- WOW (Macro Proyecto)
INSERT INTO projects (id, name, description, status, phase, priority, created_by, project_type, brief, roadmap, current_status)
VALUES (
    '13333333-3333-3333-3333-333333333333',
    'WOW',
    'Información pendiente.',
    'active',
    'planning',
    'high',
    'matias',
    'macro',
    'Información pendiente de Matias.',
    'Pendiente.',
    'Esperando información.'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- ============================================
-- INSERTAR TAREAS
-- ============================================

-- Task: Implementar TaskDetailSheet
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, assigned_agent, agent_profile, model_used, result, created_by, time_spent_minutes, tools_used, files_modified, deployment_status, steps_taken, decisions_made, learnings)
VALUES (
    '32222222-2222-2222-2222-222222222221',
    '22222222-2222-2222-2222-222222222222',
    'Implementar TaskDetailSheet con trazabilidad',
    'Crear componente TaskDetailSheet.',
    'done',
    'critical',
    'matias',
    'kimi',
    'frontend/backend',
    'moonshot/kimi-k2.5',
    'TaskDetailSheet implementado.',
    'matias',
    120,
    ARRAY['git', 'vscode', 'vercel', 'react'],
    ARRAY['src/components/TaskDetailSheet.tsx'],
    'deployed',
    ARRAY['Extender tipo Task', 'Crear SQL migration', 'Reescribir componente'],
    ARRAY['Usar arrays para campos múltiples', 'Separar bloqueantes de soluciones'],
    'Documentar cada cambio es crucial.'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Task: Implementar ProjectDetailSheet
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, assigned_agent, agent_profile, model_used, result, created_by, time_spent_minutes, tools_used, files_modified, deployment_status, steps_taken, decisions_made, learnings)
VALUES (
    '32222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Implementar ProjectDetailSheet',
    'Crear componente ProjectDetailSheet.',
    'done',
    'critical',
    'matias',
    'kimi',
    'frontend',
    'moonshot/kimi-k2.5',
    'ProjectDetailSheet implementado.',
    'matias',
    90,
    ARRAY['git', 'vscode', 'react'],
    ARRAY['src/components/ProjectDetailSheet.tsx'],
    'deployed',
    ARRAY['Crear tipo ProjectUpdate', 'Extender tipo Project', 'Implementar Sheet'],
    ARRAY['Separar campos para mejor estructura'],
    'Edición inline es más usable.'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Task: Bug IDs reales
INSERT INTO tasks (id, project_id, title, description, status, priority, assigned_to, assigned_agent, agent_profile, model_used, result, created_by, time_spent_minutes, tools_used, deployment_status, steps_taken, decisions_made, learnings, blockers_encountered)
VALUES (
    '31111111-1111-1111-1111-111111111113',
    '21111111-1111-1111-1111-111111111111',
    '[BUG] Guardar IDs reales de videos',
    'No se guardan IDs reales de videos.',
    'blocked',
    'critical',
    'matias',
    'kimi',
    'backend',
    'moonshot/kimi-k2.5',
    'Issue documentado. Esperando decisión.',
    'matias',
    120,
    ARRAY['supabase', 'blotato-api'],
    'not_required',
    ARRAY['Identificar problema', 'Analizar ciclo de vida', 'Proponer soluciones'],
    ARRAY['Opción A: Polling async', 'Opción B: Endpoint separado', 'Opción C: Webhook'],
    'Blotato devuelve postSubmissionId. ID real disponible después.',
    'No hay forma de obtener ID real inmediatamente.'
) ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- ============================================
-- ¡LISTO!
-- ============================================

SELECT '✅ Tablas creadas' as resultado;
SELECT '✅ Proyectos insertados' as resultado;
SELECT '✅ Tareas insertadas' as resultado;
SELECT '🎉 Mission Control listo para usar!' as resultado;
