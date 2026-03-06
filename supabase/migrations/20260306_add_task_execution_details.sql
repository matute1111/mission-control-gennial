-- Agregar campos de ejecución detallada a la tabla tasks

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
END $$;

-- Comentarios para documentación
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
