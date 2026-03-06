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
