---
name: mission-control
description: Interact with Mission Control (Supabase backend). Create and manage projects, features, and tasks with hierarchy support.
metadata:
  openclaw:
    emoji: "🎯"
    requires:
      env:
        - SUPABASE_URL
        - SUPABASE_KEY
      bins:
        - curl
    primaryEnv: SUPABASE_URL
---

# Mission Control

Mission Control is the operational backend for Gennial Studios. It runs on Supabase and manages projects, features, and tasks with a clear hierarchy.

## Architecture

### Hierarchy: Project → Feature → Task

```
PROJECT (Gennial Growth)
├── FEATURE: Skill Acquisition Engine (priority: 8/10)
│   ├── TASK: Install marketing-drafter (priority: 8/10)
│   ├── TASK: Install ai-lead-generator (priority: 8/10)
│   └── TASK: Install proposal-writer (priority: 5/10)
│
├── FEATURE: Oportunidades de Negocio (priority: 8/10)
│   └── TASK: Configurar RSS feeds
│
└── FEATURE: Content Generation (priority: 5/10)
    └── TASK: Crear templates
```

### Priority System

**Project Priority (1-10):** Overall importance of the project
**Task Priority (1-10):** Importance within the project

**Alert Threshold:** (Project Priority + Task Priority) / 2 > 8
→ Alert Matias if average exceeds 8

## Database Schema

### Tables

#### `highlight_projects` - Projects
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| name | text | Project name |
| description | text | Project description |
| status | text | active, completed, archived |
| content_type | text | Project category |
| metadata | jsonb | Custom data including priority |
| created_by | text | Who created it |
| created_at | timestamptz | Creation timestamp |

#### `highlight_events` - Features and Tasks
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| project_id | uuid | Parent project (FK) |
| event_type | text | "feature" or "task" |
| description | text | Name/description |
| status | text | todo, in_progress, blocked, completed |
| priority | int | 1-10 priority level |
| intensity | int | Energy/effort required |
| metadata | jsonb | Custom data including parent_feature_id |
| start_time | timestamptz | When it starts |
| end_time | timestamptz | When it ends |
| created_at | timestamptz | Creation timestamp |

### Linking Tasks to Features

Tasks linked to features via `metadata.parent_feature_id`:

```json
{
  "parent_feature_id": "uuid-of-feature",
  "parent_feature_name": "Skill Acquisition Engine"
}
```

## API Queries

### Projects

**List all projects:**
```http
GET /rest/v1/highlight_projects
```

**List active projects:**
```http
GET /rest/v1/highlight_projects?status=eq.active
```

**Create project:**
```http
POST /rest/v1/highlight_projects
Content-Type: application/json

{
  "name": "Project Name",
  "description": "Description",
  "status": "active",
  "content_type": "project",
  "metadata": {"priority": 8},
  "created_by": "kimi"
}
```

### Features

**List features in project:**
```http
GET /rest/v1/highlight_events?project_id=eq.{PROJECT_ID}&event_type=eq.feature
```

**Create feature:**
```http
POST /rest/v1/highlight_events
Content-Type: application/json

{
  "project_id": "uuid",
  "event_type": "feature",
  "description": "Feature Name",
  "status": "todo",
  "intensity": 8,
  "metadata": {"priority": 8}
}
```

### Tasks

**List all tasks:**
```http
GET /rest/v1/highlight_events?event_type=eq.task
```

**List tasks in project:**
```http
GET /rest/v1/highlight_events?project_id=eq.{PROJECT_ID}&event_type=eq.task
```

**List tasks linked to feature:**
```http
GET /rest/v1/highlight_events?metadata->>parent_feature_id=eq.{FEATURE_ID}
```

**List pending tasks:**
```http
GET /rest/v1/highlight_events?event_type=eq.task&status=in.(todo,in_progress,blocked)
```

**Create task linked to feature:**
```http
POST /rest/v1/highlight_events
Content-Type: application/json

{
  "project_id": "uuid",
  "event_type": "task",
  "description": "Task description",
  "status": "todo",
  "intensity": 8,
  "start_time": "2026-03-07T00:00:00Z",
  "end_time": "2026-04-07T00:00:00Z",
  "metadata": {
    "priority": 8,
    "parent_feature_id": "uuid-of-feature",
    "parent_feature_name": "Feature Name"
  }
}
```

**Update task status:**
```http
PATCH /rest/v1/highlight_events?id=eq.{TASK_ID}
Content-Type: application/json

{
  "status": "completed",
  "metadata": {
    "completed_at": "2026-03-07T20:00:00Z",
    "result": "What was delivered"
  }
}
```

## Kimi's Autonomy

### Heartbeat System

Kimi runs a heartbeat every 30 minutes that:

1. **Checks project health** - Counts active projects
2. **Finds critical tasks** - (Project Priority + Task Priority) / 2 > 8
3. **Decides to alert** - Only if average priority > 8
4. **Acts independently** - If Matias doesn't respond in 24h

### Autonomy Rules

**Red Lines (Never cross):**
- Don't modify OpenClaw core code without approval
- Don't create external accounts without approval
- Don't send communications as "Kimi of Gennial" without approval
- Don't spend >$200 without justification
- Don't delete production data
- Don't modify repos without commit messages

**Yellow Lines (Alert but allow):**
- Spending >$50 on experiment
- Creating new repository
- Scheduling new cron job
- Modifying skill configuration

**Green Lines (Full freedom):**
- Experiment with code in own branches
- Generate content (images, audio, text)
- Analyze data
- Create documentation
- Learn new technology
- Write in memory files
- Install skills from ClawHub

### When Kimi Acts Alone

If Matias doesn't respond in 24 hours, Kimi will:

1. **Install pending skills** from ClawHub
2. **Search for new opportunities** (RSS, Twitter, GitHub)
3. **Generate content** for Gennial
4. **Document learnings** in memory files
5. **Update Mission Control** with progress

## Best Practices

### Creating Tasks

Always include:
- Clear description
- Priority (1-10)
- Parent feature (via metadata)
- Start/end times
- Status

### Updating Status

Use status values:
- `todo` - Not started
- `in_progress` - Being worked on
- `blocked` - Waiting for something/someone
- `completed` - Done

### Logging Activity

Every meaningful action should be logged in the project metadata or activity log.

## Environment Variables

Required:
```bash
SUPABASE_URL=https://xpufofaemvoohcqdhvva.supabase.co
SUPABASE_KEY=eyJ...
```

## Example Workflows

### Create Project with Features and Tasks

```python
import requests

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

# 1. Create project
project = {
    "name": "Gennial Growth",
    "description": "Autonomous growth project",
    "status": "active",
    "metadata": {"priority": 8}
}
r = requests.post(f"{SUPABASE_URL}/rest/v1/highlight_projects", 
                  headers=headers, json=project)
project_id = r.json()[0]["id"]

# 2. Create feature
feature = {
    "project_id": project_id,
    "event_type": "feature",
    "description": "Skill Acquisition Engine",
    "status": "todo",
    "intensity": 8,
    "metadata": {"priority": 8}
}
r = requests.post(f"{SUPABASE_URL}/rest/v1/highlight_events",
                  headers=headers, json=feature)
feature_id = r.json()[0]["id"]

# 3. Create task linked to feature
task = {
    "project_id": project_id,
    "event_type": "task",
    "description": "Install marketing-drafter skill",
    "status": "todo",
    "intensity": 8,
    "metadata": {
        "priority": 8,
        "parent_feature_id": feature_id,
        "parent_feature_name": "Skill Acquisition Engine"
    }
}
requests.post(f"{SUPABASE_URL}/rest/v1/highlight_events",
              headers=headers, json=task)
```

## Troubleshooting

### Tasks not showing in frontend

Check:
- `event_type` is set to "task" (not "feature")
- `status` is one of: todo, in_progress, blocked, completed
- `project_id` is correct

### Priority not calculated correctly

Ensure:
- Project has `metadata.priority` (1-10)
- Task has `metadata.priority` (1-10)
- Both are integers

### Heartbeat not logging

Check:
- SUPABASE_URL and SUPABASE_KEY are set
- KIMI_PROJECT_ID exists in highlight_projects
- Network connectivity to Supabase
