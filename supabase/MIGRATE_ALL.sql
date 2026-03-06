-- ============================================
-- MIGRATIONS PARA MISSION CONTROL
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================

-- ============================================
-- MIGRATION 1: Project Brief y Updates
-- ============================================

-- Tabla para historial de actualizaciones de proyectos
CREATE TABLE IF NOT EXISTS project_updates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    update_type VARCHAR(20) NOT NULL CHECK (update_type IN ('milestone', 'blocker', 'decision', 'progress', 'note')),
    content TEXT NOT NULL,
    created_by VARCHAR(50) NOT NULL DEFAULT 'system',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsqueda rápida por proyecto
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);

-- Índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_project_updates_created_at ON project_updates(created_at DESC);

-- Comentarios para documentación
COMMENT ON TABLE project_updates IS 'Historial de actualizaciones, hitos y decisiones de cada proyecto';
COMMENT ON COLUMN project_updates.update_type IS 'Tipo: milestone, blocker, decision, progress, note';
COMMENT ON COLUMN project_updates.content IS 'Contenido de la actualización';

-- Agregar columnas nuevas a projects si no existen
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'brief') THEN
        ALTER TABLE projects ADD COLUMN brief TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'roadmap') THEN
        ALTER TABLE projects ADD COLUMN roadmap TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'current_status') THEN
        ALTER TABLE projects ADD COLUMN current_status TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'github_url') THEN
        ALTER TABLE projects ADD COLUMN github_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'vercel_url') THEN
        ALTER TABLE projects ADD COLUMN vercel_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'docs_url') THEN
        ALTER TABLE projects ADD COLUMN docs_url TEXT;
    END IF;
END $$;

-- Comentarios para las nuevas columnas
COMMENT ON COLUMN projects.brief IS 'Resumen general del proyecto (brief)';
COMMENT ON COLUMN projects.roadmap IS 'Plan/roadmap de qué va a pasar';
COMMENT ON COLUMN projects.current_status IS 'Estado actual - qué se está haciendo ahora';
COMMENT ON COLUMN projects.github_url IS 'URL del repositorio GitHub';
COMMENT ON COLUMN projects.vercel_url IS 'URL del deploy en Vercel';
COMMENT ON COLUMN projects.docs_url IS 'URL de documentación';

-- ============================================
-- MIGRATION 2: Jerarquía de Proyectos
-- ============================================

-- Agregar columna para el tipo de proyecto
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'project_type') THEN
        ALTER TABLE projects ADD COLUMN project_type VARCHAR(10) DEFAULT 'feature' CHECK (project_type IN ('macro', 'feature'));
    END IF;
END $$;

-- Agregar columna para referencia al proyecto padre
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'parent_project_id') THEN
        ALTER TABLE projects ADD COLUMN parent_project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Crear índice para búsqueda eficiente de sub-proyectos
CREATE INDEX IF NOT EXISTS idx_projects_parent_id ON projects(parent_project_id);

-- Crear índice para filtrar por tipo
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(project_type);

-- Comentarios para documentación
COMMENT ON COLUMN projects.project_type IS 'Tipo de proyecto: macro (contiene features) o feature (tiene tareas)';
COMMENT ON COLUMN projects.parent_project_id IS 'ID del proyecto padre (macro) al que pertenece este feature';

-- Actualizar proyectos existentes que no tengan parent para que sean tipo 'macro' por defecto
-- (asumiendo que si no tienen padre son proyectos principales)
UPDATE projects SET project_type = 'macro' WHERE parent_project_id IS NULL AND project_type IS NULL;
UPDATE projects SET project_type = 'feature' WHERE parent_project_id IS NOT NULL AND project_type IS NULL;

-- ============================================
-- MIGRATION 3: Task Execution Details
-- ============================================

DO $$
BEGIN
    -- Quién lo hizo (agente/subagente)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'assigned_agent') THEN
        ALTER TABLE tasks ADD COLUMN assigned_agent VARCHAR(100);
    END IF;

    -- Perfil del agente
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'agent_profile') THEN
        ALTER TABLE tasks ADD COLUMN agent_profile VARCHAR(50);
    END IF;

    -- Modelo AI usado
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'model_used') THEN
        ALTER TABLE tasks ADD COLUMN model_used VARCHAR(100);
    END IF;

    -- Log de ejecución detallado
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'execution_log') THEN
        ALTER TABLE tasks ADD COLUMN execution_log TEXT;
    END IF;

    -- ID del subagente
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'subagent_id') THEN
        ALTER TABLE tasks ADD COLUMN subagent_id VARCHAR(100);
    END IF;

    -- Detalles técnicos
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'technical_details') THEN
        ALTER TABLE tasks ADD COLUMN technical_details TEXT;
    END IF;

    -- Bloqueantes encontrados
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'blockers_encountered') THEN
        ALTER TABLE tasks ADD COLUMN blockers_encountered TEXT;
    END IF;

    -- Solución aplicada
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'solution_applied') THEN
        ALTER TABLE tasks ADD COLUMN solution_applied TEXT;
    END IF;

    -- Tiempo gastado en minutos
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'time_spent_minutes') THEN
        ALTER TABLE tasks ADD COLUMN time_spent_minutes INTEGER;
    END IF;

    -- Herramientas usadas (array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'tools_used') THEN
        ALTER TABLE tasks ADD COLUMN tools_used TEXT[] DEFAULT '{}';
    END IF;

    -- Archivos modificados (array)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'files_modified') THEN
        ALTER TABLE tasks ADD COLUMN files_modified TEXT[] DEFAULT '{}';
    END IF;

    -- URL del deploy
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'deployment_url') THEN
        ALTER TABLE tasks ADD COLUMN deployment_url TEXT;
    END IF;

    -- URL del PR
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'pr_url') THEN
        ALTER TABLE tasks ADD COLUMN pr_url TEXT;
    END IF;

    -- Estado del deployment
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'deployment_status') THEN
        ALTER TABLE tasks ADD COLUMN deployment_status VARCHAR(20) CHECK (deployment_status IN ('deployed', 'partial', 'failed', 'pending', 'not_required'));
    END IF;

    -- Aprendizajes
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'learnings') THEN
        ALTER TABLE tasks ADD COLUMN learnings TEXT;
    END IF;

    -- Pasos ejecutados (cronología)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'steps_taken') THEN
        ALTER TABLE tasks ADD COLUMN steps_taken TEXT[] DEFAULT '{}';
    END IF;

    -- Decisiones tomadas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tasks' AND column_name = 'decisions_made') THEN
        ALTER TABLE tasks ADD COLUMN decisions_made TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Comentarios para las nuevas columnas
COMMENT ON COLUMN tasks.assigned_agent IS 'Agente que ejecutó la tarea (ej: kimi, subagent-xyz)';
COMMENT ON COLUMN tasks.agent_profile IS 'Perfil del agente (ej: frontend, backend, research, devops)';
COMMENT ON COLUMN tasks.model_used IS 'Modelo de AI usado (ej: kimi-k2.5, claude-sonnet-4.5)';
COMMENT ON COLUMN tasks.execution_log IS 'Log detallado de pasos ejecutados';
COMMENT ON COLUMN tasks.subagent_id IS 'ID del subagente si fue usado';
COMMENT ON COLUMN tasks.technical_details IS 'Detalles técnicos de la implementación';
COMMENT ON COLUMN tasks.blockers_encountered IS 'Bloqueantes encontrados durante ejecución';
COMMENT ON COLUMN tasks.solution_applied IS 'Solución aplicada a los bloqueantes';
COMMENT ON COLUMN tasks.time_spent_minutes IS 'Tiempo gastado en minutos';
COMMENT ON COLUMN tasks.tools_used IS 'Array de herramientas usadas (git, vercel, supabase, etc)';
COMMENT ON COLUMN tasks.files_modified IS 'Array de archivos modificados';
COMMENT ON COLUMN tasks.deployment_url IS 'URL del deployment si aplica';
COMMENT ON COLUMN tasks.pr_url IS 'URL del Pull Request si aplica';
COMMENT ON COLUMN tasks.deployment_status IS 'Estado del deploy: deployed, partial, failed, pending, not_required';
COMMENT ON COLUMN tasks.learnings IS 'Aprendizajes obtenidos durante la ejecución del task';
COMMENT ON COLUMN tasks.steps_taken IS 'Array de pasos ejecutados (cronología de acciones)';
COMMENT ON COLUMN tasks.decisions_made IS 'Array de decisiones tomadas durante ejecución';

-- ============================================
-- ¡MIGRATIONS COMPLETADAS!
-- ============================================
