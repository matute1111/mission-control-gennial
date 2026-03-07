-- Add Mission Control as macro project
INSERT INTO projects (id, name, description, status, type, is_macro, parent_macro_id, priority, brief, roadmap, current_status, created_by)
VALUES (
  '31111111-1111-1111-1111-111111111111',
  'Mission Control',
  'CEREBRO EXTERNO - Sistema de gestion de proyectos',
  'active',
  'internal',
  true,
  null,
  'critical',
  '"Mission Control es mi cerebro externo. Disenado para amnesia-proof."',
  '"FASE 1: Estructura. FASE 2: Briefs. FASE 3: Trazabilidad. FASE 4: Timeline"',
  '"Task Updates implementado con 14 entries"',
  'kimi'
);

INSERT INTO project_updates (project_id, update_type, content, created_by) VALUES
('31111111-1111-1111-1111-111111111111', 'milestone', 'FASE 1: Estructura jerarquica', 'kimi'),
('31111111-1111-1111-1111-111111111111', 'milestone', 'FASE 2: Briefs editables', 'kimi'),
('31111111-1111-1111-1111-111111111111', 'milestone', 'FASE 3: Trazabilidad completa', 'kimi'),
('31111111-1111-1111-1111-111111111111', 'milestone', 'FASE 4: Task Updates timeline', 'kimi');
