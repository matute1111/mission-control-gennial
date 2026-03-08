-- MIGRACIÓN: Nuevo Sistema de Prioridades (Impact × Urgency)
-- Fecha: 2026-03-08
-- Aplica a: highlight_projects, highlight_events

-- ============================================
-- 1. CAMBIOS EN TABLA highlight_events (Tasks/Features)
-- ============================================

-- Agregar columna impact (1-5)
ALTER TABLE highlight_events 
ADD COLUMN IF NOT EXISTS impact integer 
CHECK (impact BETWEEN 1 AND 5);

-- Agregar columna urgency (1-5)
ALTER TABLE highlight_events 
ADD COLUMN IF NOT EXISTS urgency integer 
CHECK (urgency BETWEEN 1 AND 5);

-- Agregar columna priority_score calculada
ALTER TABLE highlight_events 
ADD COLUMN IF NOT EXISTS priority_score integer 
GENERATED ALWAYS AS (
  CASE
    WHEN status = 'critical' THEN 25
    WHEN impact IS NOT NULL AND urgency IS NOT NULL THEN impact * urgency
    ELSE 6  -- Default: 2×3 = 6 (medium)
  END
) STORED;

-- ============================================
-- 2. CAMBIOS EN TABLA highlight_projects (Proyectos)
-- ============================================

-- Agregar columna impact (1-5)
ALTER TABLE highlight_projects 
ADD COLUMN IF NOT EXISTS impact integer 
CHECK (impact BETWEEN 1 AND 5);

-- Agregar columna urgency (1-5)
ALTER TABLE highlight_projects 
ADD COLUMN IF NOT EXISTS urgency integer 
CHECK (urgency BETWEEN 1 AND 5);

-- Agregar columna strategic_value (core, supporting, experimental)
ALTER TABLE highlight_projects 
ADD COLUMN IF NOT EXISTS strategic_value text 
DEFAULT 'supporting'
CHECK (strategic_value IN ('core', 'supporting', 'experimental'));

-- Agregar columna priority_score calculada
ALTER TABLE highlight_projects 
ADD COLUMN IF NOT EXISTS priority_score integer 
GENERATED ALWAYS AS (
  CASE
    WHEN metadata->>'priority' = 'critical' THEN 25
    WHEN impact IS NOT NULL AND urgency IS NOT NULL THEN impact * urgency
    ELSE 6  -- Default: 2×3 = 6 (medium)
  END
) STORED;

-- ============================================
-- 3. ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_events_priority_score 
ON highlight_events(priority_score DESC);

CREATE INDEX IF NOT EXISTS idx_events_impact_urgency 
ON highlight_events(impact, urgency);

CREATE INDEX IF NOT EXISTS idx_projects_priority_score 
ON highlight_projects(priority_score DESC);

CREATE INDEX IF NOT EXISTS idx_projects_strategic_value 
ON highlight_projects(strategic_value);

-- ============================================
-- 4. MIGRACIÓN DE DATOS EXISTENTES
-- ============================================

-- Migrar highlight_events (tasks/features) basado en metadata.priority
UPDATE highlight_events 
SET 
  impact = CASE 
    WHEN metadata->>'priority' = 'critical' THEN 5
    WHEN metadata->>'priority' = 'high' THEN 4
    WHEN metadata->>'priority' = 'medium' THEN 3
    WHEN metadata->>'priority' = 'low' THEN 2
    ELSE 3  -- Default medium
  END,
  urgency = CASE 
    WHEN metadata->>'priority' = 'critical' THEN 5
    WHEN metadata->>'priority' = 'high' THEN 4
    WHEN metadata->>'priority' = 'medium' THEN 3
    WHEN metadata->>'priority' = 'low' THEN 2
    ELSE 3  -- Default medium
  END
WHERE impact IS NULL OR urgency IS NULL;

-- Migrar highlight_projects (proyectos)
UPDATE highlight_projects 
SET 
  impact = CASE 
    WHEN metadata->>'priority' = 'critical' THEN 5
    WHEN metadata->>'priority' = 'high' THEN 4
    WHEN metadata->>'priority' = 'medium' THEN 3
    WHEN metadata->>'priority' = 'low' THEN 2
    ELSE 3  -- Default medium
  END,
  urgency = CASE 
    WHEN metadata->>'priority' = 'critical' THEN 5
    WHEN metadata->>'priority' = 'high' THEN 4
    WHEN metadata->>'priority' = 'medium' THEN 3
    WHEN metadata->>'priority' = 'low' THEN 2
    ELSE 3  -- Default medium
  END,
  strategic_value = COALESCE(
    metadata->>'strategic_value',
    CASE 
      WHEN name ILIKE '%highlights%' OR name ILIKE '%wow%' THEN 'core'
      WHEN name ILIKE '%autonomia%' OR name ILIKE '%mission%' THEN 'supporting'
      ELSE 'experimental'
    END
  )
WHERE impact IS NULL OR urgency IS NULL;

-- ============================================
-- 5. VERIFICACIÓN
-- ============================================

-- Verificar counts
SELECT 
  'highlight_events' as table_name,
  COUNT(*) as total,
  COUNT(impact) as with_impact,
  COUNT(urgency) as with_urgency,
  COUNT(priority_score) as with_score
FROM highlight_events
UNION ALL
SELECT 
  'highlight_projects' as table_name,
  COUNT(*) as total,
  COUNT(impact) as with_impact,
  COUNT(urgency) as with_urgency,
  COUNT(priority_score) as with_score
FROM highlight_projects;

-- Verificar distribución de scores
SELECT 
  'events' as source,
  priority_score,
  COUNT(*)
FROM highlight_events
GROUP BY priority_score
ORDER BY priority_score DESC
LIMIT 10;
