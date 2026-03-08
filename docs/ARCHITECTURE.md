# Mission Control - Arquitectura

## Visión General

Mission Control es un sistema de gestión de proyectos diseñado específicamente para operaciones de Gennial Studios. Combina un frontend React moderno con un backend Supabase (PostgreSQL) para proporcionar gestión en tiempo real de proyectos, features y tareas.

## Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────────────┐
│                        USUARIO                                   │
│                    (Matias / Adrian)                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND                                     │
│              React + TypeScript + Vite                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Dashboard  │  │   Sheets    │  │   Sidebar   │             │
│  │   View      │  │   Detail    │  │ Navigation  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  Tech Stack:                                                     │
│  - React 18 + TypeScript                                         │
│  - Tailwind CSS + shadcn/ui                                      │
│  - React Router                                                  │
│  - Deploy: Vercel                                                │
└──────────────────────┬──────────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SUPABASE                                      │
│              (PostgreSQL + API REST)                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 DATABASE LAYER                            │   │
│  │  ┌─────────────────┐    ┌─────────────────┐              │   │
│  │  │highlight_projects│    │highlight_events │              │   │
│  │  │   (Projects)     │    │ (Features/Tasks)│              │   │
│  │  └─────────────────┘    └─────────────────┘              │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                    API LAYER                              │   │
│  │  - REST API auto-generated                               │   │
│  │  - Real-time subscriptions (optional)                    │   │
│  │  - Row Level Security (RLS)                              │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      KIMI                                        │
│              (AI Agent Autónomo)                                 │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 HEARTBEAT SYSTEM                          │   │
│  │  - Runs every 30 minutes                                 │   │
│  │  - Checks project health                                 │   │
│  │  - Calculates priorities                                 │   │
│  │  - Alerts if (Project + Task) / 2 > 8                    │   │
│  │  - Acts independently after 24h silence                  │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │                 AUTONOMY ENGINE                           │   │
│  │  - Installs skills without permission                    │   │
│  │  - Generates content automatically                       │   │
│  │  - Searches for opportunities                            │   │
│  │  - Documents learnings                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

### 1. Creación de Proyecto

```
Usuario/Kimi → Frontend → POST /highlight_projects → Supabase
                                    ↓
                              Project created
                                    ↓
                              Return project_id
```

### 2. Creación de Feature

```
Usuario/Kimi → Frontend → POST /highlight_events
                          (event_type="feature")
                                    ↓
                         Feature linked to project
                                    ↓
                              Return feature_id
```

### 3. Creación de Task

```
Usuario/Kimi → Frontend → POST /highlight_events
                          (event_type="task",
                           metadata.parent_feature_id=...)
                                    ↓
                         Task linked to feature & project
                                    ↓
                              Return task_id
```

### 4. Heartbeat de Kimi

```
Cron (30 min) → Kimi Heartbeat → GET /highlight_projects
                                        ↓
                              Check active projects
                                        ↓
                         GET /highlight_events (pending)
                                        ↓
                              Calculate priorities
                                        ↓
                    If avg > 8 → Alert Matias
                    If 24h silence → Act independently
                                        ↓
                              PATCH metadata (log)
```

## Jerarquía de Datos

### Nivel 1: Projects

Los proyectos son el nivel más alto de organización.

```typescript
interface Project {
  id: string;                    // UUID
  name: string;                  // "Gennial Growth"
  description: string;           // "Autonomía Kimi"
  status: "active" | "completed" | "archived";
  content_type: string;          // "project", "macro"
  metadata: {
    priority: number;            // 1-10
    owner: string;               // "kimi", "matias"
    [key: string]: any;
  };
  created_by: string;
  created_at: string;            // ISO 8601
}
```

### Nivel 2: Features

Las features son objetivos grandes dentro de un proyecto.

```typescript
interface Feature {
  id: string;                    // UUID
  project_id: string;            // FK to Project
  event_type: "feature";         // Discriminator
  description: string;           // "Skill Acquisition Engine"
  status: "todo" | "in_progress" | "blocked" | "completed";
  intensity: number;             // 1-10 effort level
  start_time: string;            // ISO 8601
  end_time: string;              // ISO 8601
  metadata: {
    priority: number;            // 1-10
    category: string;            // "autonomia"
    [key: string]: any;
  };
  created_at: string;
}
```

### Nivel 3: Tasks

Las tasks son pasos concretos para completar una feature.

```typescript
interface Task {
  id: string;                    // UUID
  project_id: string;            // FK to Project
  event_type: "task";            // Discriminator
  description: string;           // "Install marketing-drafter"
  status: "todo" | "in_progress" | "blocked" | "completed";
  intensity: number;             // 1-10 effort level
  start_time: string;            // ISO 8601
  end_time: string;              // ISO 8601
  metadata: {
    priority: number;            // 1-10
    parent_feature_id: string;   // FK to Feature
    parent_feature_name: string; // "Skill Acquisition Engine"
    assigned_to: string;         // "kimi"
    estimated_hours: number;
    completed_at?: string;
    result?: string;
    blocked_reason?: string;
    [key: key]: any;
  };
  created_at: string;
}
```

## Sistema de Prioridades

### Fórmula de Alerta

```typescript
function calculateAlertPriority(
  projectPriority: number,
  taskPriority: number
): { average: number; shouldAlert: boolean } {
  const average = (projectPriority + taskPriority) / 2;
  return {
    average,
    shouldAlert: average > 8  // Threshold
  };
}

// Ejemplos
calculateAlertPriority(9, 8);  // 8.5 → true (ALERT)
calculateAlertPriority(5, 6);  // 5.5 → false (no alert)
calculateAlertPriority(8, 9);  // 8.5 → true (ALERT)
```

### Estados y Transiciones

```
Project Status:
active → completed → archived
   ↓         ↓
 blocked (rare)

Task/Feature Status:
todo → in_progress → completed
  ↓         ↓
blocked (waiting for something)

Transitions:
- todo → in_progress: Started working
- todo → blocked: Can't start (dependency)
- in_progress → blocked: Hit obstacle
- in_progress → completed: Done
- blocked → in_progress: Unblocked
- blocked → completed: Resolved indirectly
```

## Kimi Integration

### Heartbeat Logic

```python
class KimiHeartbeat:
    def __init__(self):
        self.alert_threshold = 8
        self.timeout_hours = 24
    
    def check_health(self) -> HealthStatus:
        """Check overall project health."""
        projects = get_active_projects()
        critical_tasks = get_critical_tasks(threshold=self.alert_threshold)
        
        return HealthStatus(
            active_projects=len(projects),
            critical_tasks=len(critical_tasks),
            urgency=self.calculate_urgency(projects, critical_tasks)
        )
    
    def should_alert_matias(self, task: Task, project: Project) -> bool:
        """Determine if Matias should be alerted."""
        task_priority = task.metadata.get("priority", 5)
        project_priority = project.metadata.get("priority", 5)
        average = (task_priority + project_priority) / 2
        
        return average > self.alert_threshold
    
    def should_act_independently(self) -> bool:
        """Check if 24h have passed without Matias response."""
        last_response = get_last_matias_response()
        if not last_response:
            return True
        
        hours_since = (now() - last_response).hours
        return hours_since > self.timeout_hours
    
    def act_independently(self) -> List[Action]:
        """Actions to take when acting alone."""
        return [
            Action.INSTALL_SKILLS,
            Action.SEARCH_OPPORTUNITIES,
            Action.GENERATE_CONTENT,
            Action.DOCUMENT_LEARNINGS
        ]
```

### Safeguards

```python
class Safeguards:
    """Safety limits for Kimi's autonomy."""
    
    RED_LINES = [
        "modify_openclaw_code",
        "create_external_accounts",
        "send_external_comms_as_kimi",
        "spend_over_200",
        "delete_production_data",
        "modify_repos_without_commits"
    ]
    
    YELLOW_LINES = [
        "spend_over_50",
        "create_new_repo",
        "schedule_cron_job",
        "modify_skill_config"
    ]
    
    GREEN_LINES = [
        "experiment_in_branches",
        "generate_content",
        "analyze_data",
        "create_documentation",
        "learn_technology",
        "write_memory",
        "install_skills"
    ]
    
    @staticmethod
    def check_action(action: str) -> SafetyLevel:
        if action in Safeguards.RED_LINES:
            return SafetyLevel.REQUIRES_APPROVAL
        elif action in Safeguards.YELLOW_LINES:
            return SafetyLevel.ALERT_BUT_ALLOW
        elif action in Safeguards.GREEN_LINES:
            return SafetyLevel.FULLY_ALLOWED
        else:
            return SafetyLevel.UNKNOWN
```

## Base de Datos

### Esquema Relacional

```sql
-- Projects table
create table highlight_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  status text default 'active',
  content_type text default 'project',
  metadata jsonb default '{}',
  created_by text default 'kimi',
  created_at timestamptz default now()
);

-- Events table (features and tasks)
create table highlight_events (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references highlight_projects(id),
  event_type text not null, -- 'feature' or 'task'
  description text not null,
  status text default 'todo',
  intensity int default 5,
  metadata jsonb default '{}',
  start_time timestamptz,
  end_time timestamptz,
  created_at timestamptz default now()
);

-- Indexes for performance
create index idx_events_project on highlight_events(project_id);
create index idx_events_type on highlight_events(event_type);
create index idx_events_status on highlight_events(status);
create index idx_events_metadata on highlight_events using gin(metadata);
```

### Consultas Comunes

```sql
-- Get all tasks for a project
select * from highlight_events 
where project_id = 'uuid' 
  and event_type = 'task';

-- Get tasks linked to a feature
select * from highlight_events 
where event_type = 'task'
  and metadata->>'parent_feature_id' = 'feature-uuid';

-- Get critical tasks (priority > 8)
select e.*, p.metadata->>'priority' as project_priority
from highlight_events e
join highlight_projects p on e.project_id = p.id
where e.event_type = 'task'
  and e.status in ('todo', 'in_progress', 'blocked')
  and (
    (e.metadata->>'priority')::int + 
    (p.metadata->>'priority')::int
  ) / 2 > 8;

-- Count tasks by status
select status, count(*) 
from highlight_events 
where event_type = 'task'
group by status;
```

## Seguridad

### Row Level Security (RLS)

```sql
-- Enable RLS
alter table highlight_projects enable row level security;
alter table highlight_events enable row level security;

-- Policy: Allow all operations for service_role
create policy "Service role full access" on highlight_projects
  for all using (true) with check (true);

create policy "Service role full access" on highlight_events
  for all using (true) with check (true);
```

### API Keys

- **anon key**: Para operaciones de lectura (frontend)
- **service_role key**: Para operaciones de escritura (Kimi, backend)

## Escalabilidad

### Limitaciones Actuales

- Supabase free tier: 500MB base de datos
- Rate limiting: 100 requests por segundo
- Conexiones: 60 concurrentes

### Estrategias de Escalado

1. **Particionamiento**: Si crece mucho, particionar por fecha
2. **Caching**: Cachear proyectos activos en Redis
3. **CDN**: Usar CDN para assets estáticos
4. **Upgrade**: Mover a Supabase Pro si se necesita

## Monitoreo

### Métricas Importantes

- Número de proyectos activos
- Tareas completadas por día
- Tareas bloqueadas (indicador de problemas)
- Tiempo promedio de resolución
- Alertas generadas por Kimi

### Dashboard

URL: https://mission-control-gennial.vercel.app

Muestra:
- Proyectos activos
- Tareas pendientes
- Features en progreso
- Estadísticas de prioridad

## Referencias

- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- [React Query](https://tanstack.com/query/latest) - Para data fetching
- [Vercel Deployment](https://vercel.com/docs)
