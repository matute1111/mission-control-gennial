-- Agregar soporte para jerarquía de proyectos (macro/micro)

-- Agregar columna para el tipo de proyecto
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'project_type') THEN
        ALTER TABLE projects ADD COLUMN project_type VARCHAR(10) DEFAULT 'micro' CHECK (project_type IN ('macro', 'micro'));
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
COMMENT ON COLUMN projects.project_type IS 'Tipo de proyecto: macro (contiene sub-proyectos) o micro (tiene tareas)';
COMMENT ON COLUMN projects.parent_project_id IS 'ID del proyecto padre (macro) al que pertenece este sub-proyecto';

-- Actualizar proyectos existentes que no tengan parent para que sean tipo 'macro' por defecto
-- (asumiendo que si no tienen padre son proyectos principales)
UPDATE projects SET project_type = 'macro' WHERE parent_project_id IS NULL AND project_type IS NULL;
UPDATE projects SET project_type = 'micro' WHERE parent_project_id IS NOT NULL AND project_type IS NULL;
