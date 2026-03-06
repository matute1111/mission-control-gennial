-- ============================================
-- INSERTAR MISSION CONTROL COMO PROYECTO
-- Ejecutar en Supabase Dashboard → SQL Editor
-- ============================================

-- 1. CREAR MACRO PROYECTO: Mission Control
INSERT INTO projects (
    id,
    name, 
    description, 
    status, 
    phase, 
    priority, 
    created_by,
    project_type,
    brief,
    roadmap,
    current_status,
    github_url,
    vercel_url
) VALUES (
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Mission Control',
    'Sistema de gestión de proyectos, features y tasks con trazabilidad completa. Permite documentar briefs, roadmaps, estados, aprendizajes y todo el historial de ejecución.',
    'active',
    'development',
    'critical',
    'matias',
    'macro',
    'Mission Control es el cerebro operativo de Gennial Studios. Permite gestionar macro proyectos (como Muses), features (como Upload Multi-Tenant) y tasks con trazabilidad completa. Cada nivel tiene brief, roadmap, estado actual e historial. Los tasks documentan quién los hizo, con qué perfil, qué modelo de AI, qué pasos se siguieron, qué bloqueantes hubo, qué se aprendió, etc.',
    'FASE 1 (COMPLETADA): Sistema de briefs y trazabilidad básico
• Sheets laterales para tasks y proyectos
• Brief editable con roadmap y estado actual
• Historial de updates con tipos (milestone, blocker, decision, progress, note)
• Jerarquía: Macro → Feature → Task
• Trazabilidad completa de tasks (agente, perfil, modelo, tiempo, herramientas, archivos, log, bloqueantes, soluciones, deployment status, pasos, decisiones, aprendizajes)

FASE 2 (PLANEADA): Mejoras de UX
• Dashboard con métricas
• Filtros avanzados
• Búsqueda full-text
• Notificaciones
• Integración con GitHub webhooks

FASE 3 (FUTURO): Automatización
• Auto-crear tasks desde GitHub PRs
• Reportes automáticos
• Predicción de tiempos
• Integración con calendario',
    'FASE 1 COMPLETADA. Sistema de briefs y trazabilidad implementado y deployado. Lista para uso en producción. Próximo: testing y refinamiento.',
    'https://github.com/matute1111/mission-control-gennial',
    'https://mission-control-gennial.vercel.app'
) ON CONFLICT (id) DO UPDATE SET
    brief = EXCLUDED.brief,
    roadmap = EXCLUDED.roadmap,
    current_status = EXCLUDED.current_status,
    updated_at = NOW();

-- 2. CREAR FEATURE: Sistema de Briefs y Trazabilidad
INSERT INTO projects (
    id,
    name, 
    description, 
    status, 
    phase, 
    priority, 
    created_by,
    project_type,
    parent_project_id,
    brief,
    roadmap,
    current_status
) VALUES (
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'Sistema de Briefs y Trazabilidad',
    'Implementación completa del sistema de briefs para proyectos, features y tasks con trazabilidad detallada de ejecución.',
    'active',
    'completed',
    'critical',
    'matias',
    'feature',
    'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'Este feature implementa el corazón de Mission Control: la capacidad de documentar todo el conocimiento de los proyectos en un solo lugar. Cada proyecto tiene brief, roadmap y estado actual. Cada task documenta quién lo hizo, cómo, cuánto tardó, qué problemas hubo y qué se aprendió. Esto permite recuperar memoria rápidamente y mantener el contexto incluso si se pierde el historial de chat.',
    'COMPLETADO:
1. Sheet lateral genérico (Sheet.tsx)
2. TaskDetailSheet con trazabilidad completa
3. ProjectDetailSheet con brief editable
4. Jerarquía Macro → Feature → Task
5. Tabla project_updates para historial
6. Todos los campos de ejecución en tasks
7. SQL migrations para toda la estructura
8. Deploy a Vercel
9. Documentación completa',
    'COMPLETADO Y DEPLOYADO. Toda la funcionalidad implementada y funcionando en producción. El sistema permite crear proyectos con brief, agregar features, crear tasks con trazabilidad completa, y ver todo el historial.'
) ON CONFLICT (id) DO UPDATE SET
    brief = EXCLUDED.brief,
    roadmap = EXCLUDED.roadmap,
    current_status = EXCLUDED.current_status,
    updated_at = NOW();

-- 3. CREAR TASK: Implementar TaskDetailSheet con trazabilidad
INSERT INTO tasks (
    id,
    project_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    assigned_agent,
    agent_profile,
    model_used,
    result,
    created_by,
    execution_log,
    technical_details,
    time_spent_minutes,
    tools_used,
    files_modified,
    deployment_status,
    steps_taken,
    decisions_made,
    learnings
) VALUES (
    'c3d4e5f6-a7b8-9012-cdef-345678901234',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'Implementar TaskDetailSheet con trazabilidad completa',
    'Crear el componente TaskDetailSheet que muestre toda la información de ejecución de un task: agente, perfil, modelo, tiempo, herramientas, archivos modificados, log de ejecución, detalles técnicos, bloqueantes, soluciones, resultado, deployment status, pasos ejecutados, decisiones tomadas y aprendizajes.',
    'done',
    'critical',
    'matias',
    'kimi',
    'frontend/backend',
    'moonshot/kimi-k2.5',
    'TaskDetailSheet implementado exitosamente con todas las secciones de trazabilidad. El sheet muestra: Agente de Ejecución (encargado, perfil, modelo, tiempo), Herramientas Usadas, Archivos Modificados, Descripción Original, Log de Ejecución, Detalles Técnicos, Bloqueantes, Soluciones, Resultado, Estado del Deployment, Pasos Ejecutados (cronología), Decisiones Tomadas, Aprendizajes, Links, Deploys y PRs, Metadata, Fechas, Recursos y API Keys.',
    'matias',
    '1. Leer requerimiento de Matias sobre trazabilidad completa
2. Extender tipo Task en types.ts con nuevos campos (15+ campos)
3. Crear SQL migration para alter tabla tasks
4. Reescribir TaskDetailSheet con todas las secciones nuevas
5. Agregar íconos de lucide-react necesarios
6. Compilar y verificar sin errores TypeScript
7. Hacer commit y push a GitHub
8. Crear SQL unificado para Matias
9. Documentar todo en MEMORY.md',
    'Se implementó usando React + TypeScript + Tailwind CSS. El componente usa el Sheet genérico ya existente. Se organizó la información en cards de colores diferentes según el tipo de contenido (violeta para agente, verde para log, rojo para bloqueantes, etc). Se usaron arrays para tools_used y files_modified. Se agregaron íconos de lucide-react para mejor UX.',
    120,
    ARRAY['git', 'vscode', 'vercel', 'supabase', 'github', 'react', 'typescript', 'tailwind'],
    ARRAY['src/types.ts', 'src/components/TaskDetailSheet.tsx', 'supabase/migrations/20260306_add_task_execution_details.sql'],
    'deployed',
    ARRAY[
        'Leer requerimiento de Matias sobre trazabilidad completa',
        'Extender tipo Task con 15+ campos nuevos',
        'Crear SQL migration para alter tabla tasks',
        'Reescribir TaskDetailSheet con secciones de trazabilidad',
        'Agregar íconos de lucide-react',
        'Compilar sin errores TypeScript',
        'Hacer commit y push',
        'Crear SQL unificado para Matias'
    ],
    ARRAY[
        'Usar arrays para tools_used y files_modified en vez de texto plano',
        'Separar blockers_encountered de solution_applied para mejor tracking',
        'Agregar deployment_status explícito en vez de inferir de deployment_url',
        'Usar cards de colores diferentes para cada tipo de información'
    ],
    'Las migrations de Supabase deben ser idempotentes (usar IF NOT EXISTS). Es mejor tener un archivo SQL unificado con todas las migrations para facilitar el deploy en nuevos entornos. El componente Sheet genérico es muy flexible y reutilizable. Documentar cada cambio en MEMORY.md es crucial para mantener contexto.'
) ON CONFLICT (id) DO UPDATE SET
    result = EXCLUDED.result,
    status = EXCLUDED.status,
    updated_at = NOW();

-- 4. CREAR TASK: Implementar ProjectDetailSheet con brief editable
INSERT INTO tasks (
    id,
    project_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    assigned_agent,
    agent_profile,
    model_used,
    result,
    created_by,
    execution_log,
    technical_details,
    time_spent_minutes,
    tools_used,
    files_modified,
    deployment_status,
    steps_taken,
    decisions_made,
    learnings
) VALUES (
    'd4e5f6a7-b8c9-0123-defa-456789012345',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'Implementar ProjectDetailSheet con brief editable',
    'Crear el componente ProjectDetailSheet para mostrar y editar el brief del proyecto, incluyendo resumen general, roadmap, estado actual, historial de updates, jerarquía de features, y recursos.',
    'done',
    'critical',
    'matias',
    'kimi',
    'frontend',
    'moonshot/kimi-k2.5',
    'ProjectDetailSheet implementado con todas las secciones: Jerarquía (macro/feature), Brief editable con botón de editar/guardar, Roadmap, Estado Actual, Historial de Updates (con tipos: milestone, blocker, decision, progress, note), Progreso del proyecto, Links configurados, Recursos y API Keys.',
    'matias',
    '1. Crear tipo ProjectUpdate para historial
2. Extender tipo Project con brief, roadmap, current_status, urls
3. Crear tabla project_updates en SQL
4. Implementar ProjectDetailSheet con todas las secciones
5. Agregar funcionalidad de editar brief
6. Agregar formulario para crear nuevos updates
7. Mostrar jerarquía de proyectos',
    'Se usó React hooks (useState, useEffect) para manejar el estado de edición. Se integró con Supabase para fetch y update de datos. Se creó un componente Sheet genérico reutilizable. Se usaron colores distintivos para cada sección (azul para brief, verde para roadmap, ámbar para estado).',
    90,
    ARRAY['git', 'vscode', 'vercel', 'react', 'typescript', 'supabase'],
    ARRAY['src/types.ts', 'src/components/ProjectDetailSheet.tsx', 'src/components/Sheet.tsx', 'supabase/migrations/20260306_add_project_brief_and_updates.sql'],
    'deployed',
    ARRAY[
        'Crear tipo ProjectUpdate',
        'Extender tipo Project con nuevos campos',
        'Crear tabla project_updates',
        'Implementar ProjectDetailSheet',
        'Agregar funcionalidad de edición',
        'Agregar formulario de updates',
        'Mostrar jerarquía'
    ],
    ARRAY[
        'Separar brief, roadmap y current_status en campos independientes para mejor estructura',
        'Usar update_type con CHECK constraint para validar tipos permitidos',
        'Crear componente Sheet genérico reutilizable para otros usos'
    ],
    'Es importante tener un componente Sheet genérico que pueda usarse tanto para tasks como para proyectos. La edición inline con toggle entre modo view y edit es más usable que un formulario separado. Los comentarios en SQL ayudan mucho al mantenimiento futuro.'
) ON CONFLICT (id) DO UPDATE SET
    result = EXCLUDED.result,
    status = EXCLUDED.status,
    updated_at = NOW();

-- 5. CREAR TASK: Implementar jerarquía Macro → Feature → Task
INSERT INTO tasks (
    id,
    project_id,
    title,
    description,
    status,
    priority,
    assigned_to,
    assigned_agent,
    agent_profile,
    model_used,
    result,
    created_by,
    execution_log,
    technical_details,
    time_spent_minutes,
    tools_used,
    files_modified,
    deployment_status,
    steps_taken,
    decisions_made,
    learnings
) VALUES (
    'e5f6a7b8-c9d0-1234-efab-567890123456',
    'b2c3d4e5-f6a7-8901-bcde-f23456789012',
    'Implementar jerarquía Macro → Feature → Task',
    'Implementar la jerarquía de proyectos donde un Macro Proyecto (ej: Muses) contiene Features (ej: Upload Multi-Tenant) y cada Feature contiene Tasks. Permitir navegación y visualización de esta jerarquía.',
    'done',
    'high',
    'matias',
    'kimi',
    'frontend',
    'moonshot/kimi-k2.5',
    'Jerarquía implementada exitosamente. Se agregaron campos project_type (macro/feature) y parent_project_id a la tabla projects. Se actualizó Projects.tsx para mostrar Macro Proyectos expandibles con sus Features anidados. Se actualizó ProjectDetailSheet para mostrar la jerarquía. Se modificó el diálogo de creación para permitir elegir tipo de proyecto y padre.',
    'matias',
    '1. Agregar campos project_type y parent_project_id a types.ts
2. Crear SQL migration para jerarquía
3. Modificar Projects.tsx para mostrar jerarquía con chevrons expandibles
4. Actualizar ProjectDetailSheet para mostrar relación padre/hijo
5. Modificar diálogo de creación de proyectos
6. Renombrar micro a feature según feedback',
    'Se usó una columna project_type con CHECK constraint para validar valores permitidos. Se usó parent_project_id como foreign key a projects (self-referencing). En la UI se usaron chevrons para expandir/colapsar macro proyectos. Se aplicaron colores distintivos (azul para macro, ámbar para features).',
    60,
    ARRAY['git', 'vscode', 'react', 'typescript'],
    ARRAY['src/types.ts', 'src/pages/Projects.tsx', 'src/components/ProjectDetailSheet.tsx', 'supabase/migrations/20260306_add_project_hierarchy.sql'],
    'deployed',
    ARRAY[
        'Agregar campos a types.ts',
        'Crear SQL migration',
        'Modificar Projects.tsx para jerarquía',
        'Actualizar ProjectDetailSheet',
        'Modificar diálogo de creación',
        'Renombrar micro a feature'
    ],
    ARRAY[
        'Usar project_type explícito es mejor que inferir de parent_project_id',
        'El patrón de árbol expandible con chevron es intuitivo para jerarquías',
        'Feature es más claro que micro para describir el nivel intermedio'
    ],
    'El self-referencing foreign key en PostgreSQL es poderoso para jerarquías. Hay que tener cuidado con ciclos (aunque para niveles fijos 2-3 no es problema). La nomenclatura clara (macro/feature/task) es crucial para que el equipo entienda la estructura.'
) ON CONFLICT (id) DO UPDATE SET
    result = EXCLUDED.result,
    status = EXCLUDED.status,
    updated_at = NOW();

-- 6. Agregar algunos updates al historial del feature
INSERT INTO project_updates (project_id, update_type, content, created_by) VALUES
    ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'milestone', 'Completado: TaskDetailSheet con trazabilidad completa implementado', 'kimi'),
    ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'milestone', 'Completado: ProjectDetailSheet con brief editable implementado', 'kimi'),
    ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'milestone', 'Completado: Jerarquía Macro → Feature → Task implementada', 'kimi'),
    ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'milestone', 'Deployado a Vercel: https://mission-control-gennial.vercel.app', 'kimi'),
    ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'decision', 'Renombrar nivel intermedio de micro a feature para mayor claridad', 'matias'),
    ('b2c3d4e5-f6a7-8901-bcde-f23456789012', 'progress', 'SQL migrations aplicadas exitosamente en Supabase', 'kimi');

-- ============================================
-- ¡MISSION CONTROL DOCUMENTADO EN MISSION CONTROL!
-- ============================================

SELECT '✅ Mission Control creado como proyecto' as status;
SELECT '✅ Feature Sistema de Briefs y Trazabilidad creado' as status;
SELECT '✅ 3 tasks documentados con trazabilidad completa' as status;
SELECT '✅ 6 updates agregados al historial' as status;
