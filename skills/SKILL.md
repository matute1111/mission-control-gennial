---
name: mission-control
description: Interact with Mission Control (Supabase backend). Create and manage projects, features, and tasks with hierarchy support and priority-based alerting.
metadata:
  openclaw:
    emoji: "🎯"
    requires:
      env:
        - SUPABASE_URL
        - SUPABASE_KEY
      bins:
        - curl
        - python3
    primaryEnv: SUPABASE_URL
    author: Kimi
    version: "2.0"
---

# Mission Control Skill

## Overview

Mission Control is the operational backend for Gennial Studios. It manages projects, features, and tasks with a clear hierarchy and priority-based alerting system.

## Core Concepts

### Hierarchy: Project → Feature → Task

```
PROJECT (Gennial Growth) [Priority: 8/10]
├── FEATURE: Skill Acquisition Engine [Priority: 8/10]
│   ├── TASK: Install marketing-drafter [Priority: 8/10]
│   ├── TASK: Install ai-lead-generator [Priority: 8/10]
│   └── TASK: Install proposal-writer [Priority: 5/10]
│
├── FEATURE: Oportunidades de Negocio [Priority: 8/10]
│   └── TASK: Configurar RSS feeds [Priority: 7/10]
│
└── FEATURE: Content Generation [Priority: 5/10]
    └── TASK: Crear templates [Priority: 6/10]
```

### Priority System

**Project Priority (1-10):** Overall importance of the project  
**Task Priority (1-10):** Importance within the project

**Alert Formula:**
```
Average = (Project Priority + Task Priority) / 2

If Average > 8 → 🚨 Alert Matias
If Average ≤ 8 → 😴 Continue silently
```

**Example:**
- Project: 9 (HIGH) + Task: 8 (HIGH) = Average 8.5 → 🚨 ALERT
- Project: 5 (MED) + Task: 6 (MED) = Average 5.5 → 😴 No alert

## Database Schema

### Tables

#### `highlight_projects` - Projects
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | uuid | Primary key | `bf1ab27a-c12a-45ce-b96d-7df4463e9be7` |
| name | text | Project name | "Gennial Growth" |
| description | text | Project description | "Autonomía Kimi" |
| status | text | Current status | `active`, `completed`, `archived` |
| content_type | text | Category | `project`, `macro` |
| metadata | jsonb | Custom data | `{"priority": 8, "owner": "kimi"}` |
| created_by | text | Creator | `kimi`, `matias` |
| created_at | timestamptz | Creation time | `2026-03-07T20:00:00Z` |

#### `highlight_events` - Features and Tasks
| Column | Type | Description | Example |
|--------|------|-------------|---------|
| id | uuid | Primary key | Auto-generated |
| project_id | uuid | Parent project (FK) | References highlight_projects |
| event_type | text | Type | `feature`, `task` |
| description | text | Name/description | "Skill Acquisition Engine" |
| status | text | Current status | `todo`, `in_progress`, `blocked`, `completed` |
| intensity | int | Effort level (1-10) | 8 = High effort |
| metadata | jsonb | Custom data | See below |
| start_time | timestamptz | Start date | `2026-03-07T00:00:00Z` |
| end_time | timestamptz | End date | `2026-04-07T00:00:00Z` |
| created_at | timestamptz | Creation time | Auto-generated |

### Metadata Structure

**For Features:**
```json
{
  "priority": 8,
  "owner": "kimi",
  "category": "autonomia"
}
```

**For Tasks linked to Features:**
```json
{
  "priority": 8,
  "parent_feature_id": "adf0fc64-9c2e-46df-9456-144f5a2abddf",
  "parent_feature_name": "Skill Acquisition Engine",
  "assigned_to": "kimi",
  "estimated_hours": 2
}
```

## API Reference

### Authentication

All requests require these headers:
```bash
-H "apikey: $SUPABASE_KEY" \
-H "Authorization: Bearer $SUPABASE_KEY" \
-H "Content-Type: application/json"
```

### Projects

#### List All Projects
```http
GET /rest/v1/highlight_projects
```

**Response:**
```json
[
  {
    "id": "bf1ab27a-c12a-45ce-b96d-7df4463e9be7",
    "name": "Gennial Growth",
    "status": "active",
    "metadata": {"priority": 8}
  }
]
```

#### Create Project
```http
POST /rest/v1/highlight_projects
Content-Type: application/json
Prefer: return=representation

{
  "name": "New Project",
  "description": "Project description",
  "status": "active",
  "content_type": "project",
  "metadata": {"priority": 8, "owner": "kimi"},
  "created_by": "kimi"
}
```

#### Update Project
```http
PATCH /rest/v1/highlight_projects?id=eq.{PROJECT_ID}
Content-Type: application/json

{
  "status": "completed",
  "metadata": {"priority": 8, "completed_at": "2026-03-07T20:00:00Z"}
}
```

### Features

#### List Features in Project
```http
GET /rest/v1/highlight_events?project_id=eq.{PROJECT_ID}&event_type=eq.feature
```

#### Create Feature
```http
POST /rest/v1/highlight_events
Content-Type: application/json
Prefer: return=representation

{
  "project_id": "bf1ab27a-c12a-45ce-b96d-7df4463e9be7",
  "event_type": "feature",
  "description": "Skill Acquisition Engine",
  "status": "todo",
  "intensity": 8,
  "start_time": "2026-03-07T00:00:00Z",
  "end_time": "2026-04-07T00:00:00Z",
  "metadata": {"priority": 8, "category": "autonomia"}
}
```

### Tasks

#### List All Tasks
```http
GET /rest/v1/highlight_events?event_type=eq.task
```

#### List Tasks in Project
```http
GET /rest/v1/highlight_events?project_id=eq.{PROJECT_ID}&event_type=eq.task
```

#### List Tasks linked to Feature
```http
GET /rest/v1/highlight_events?metadata->>parent_feature_id=eq.{FEATURE_ID}
```

#### List Pending Tasks
```http
GET /rest/v1/highlight_events?event_type=eq.task&status=in.(todo,in_progress,blocked)
```

#### Create Task linked to Feature
```http
POST /rest/v1/highlight_events
Content-Type: application/json
Prefer: return=representation

{
  "project_id": "bf1ab27a-c12a-45ce-b96d-7df4463e9be7",
  "event_type": "task",
  "description": "Install marketing-drafter skill",
  "status": "todo",
  "intensity": 8,
  "start_time": "2026-03-07T00:00:00Z",
  "end_time": "2026-03-14T00:00:00Z",
  "metadata": {
    "priority": 8,
    "parent_feature_id": "adf0fc64-9c2e-46df-9456-144f5a2abddf",
    "parent_feature_name": "Skill Acquisition Engine",
    "assigned_to": "kimi",
    "estimated_hours": 1
  }
}
```

#### Update Task Status
```http
PATCH /rest/v1/highlight_events?id=eq.{TASK_ID}
Content-Type: application/json

{
  "status": "completed",
  "metadata": {
    "priority": 8,
    "parent_feature_id": "...",
    "completed_at": "2026-03-07T20:00:00Z",
    "result": "Skill installed successfully"
  }
}
```

#### Block Task
```http
PATCH /rest/v1/highlight_events?id=eq.{TASK_ID}
Content-Type: application/json

{
  "status": "blocked",
  "metadata": {
    "blocked_reason": "Waiting for API keys from Matias",
    "blocked_since": "2026-03-07T20:00:00Z"
  }
}
```

## Code Examples

### Python: Complete Workflow

```python
import requests
import os
from datetime import datetime

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def create_project(name, description, priority=5):
    """Create a new project."""
    data = {
        "name": name,
        "description": description,
        "status": "active",
        "content_type": "project",
        "metadata": {"priority": priority},
        "created_by": "kimi"
    }
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/highlight_projects",
        headers=headers,
        json=data
    )
    return r.json()[0] if r.status_code == 201 else None

def create_feature(project_id, name, priority=5):
    """Create a feature in a project."""
    data = {
        "project_id": project_id,
        "event_type": "feature",
        "description": name,
        "status": "todo",
        "intensity": priority,
        "start_time": datetime.now().isoformat(),
        "metadata": {"priority": priority}
    }
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/highlight_events",
        headers=headers,
        json=data
    )
    return r.json()[0] if r.status_code == 201 else None

def create_task(project_id, feature_id, feature_name, description, priority=5):
    """Create a task linked to a feature."""
    data = {
        "project_id": project_id,
        "event_type": "task",
        "description": description,
        "status": "todo",
        "intensity": priority,
        "start_time": datetime.now().isoformat(),
        "metadata": {
            "priority": priority,
            "parent_feature_id": feature_id,
            "parent_feature_name": feature_name
        }
    }
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/highlight_events",
        headers=headers,
        json=data
    )
    return r.json()[0] if r.status_code == 201 else None

def get_critical_tasks(threshold=8):
    """Get tasks with average priority > threshold."""
    critical = []
    
    # Get all pending tasks
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/highlight_events?event_type=eq.task&status=in.(todo,in_progress,blocked)",
        headers=headers
    )
    
    if r.status_code != 200:
        return critical
    
    tasks = r.json()
    
    for task in tasks:
        task_priority = task.get("metadata", {}).get("priority", 5)
        project_id = task.get("project_id")
        
        # Get project priority
        r2 = requests.get(
            f"{SUPABASE_URL}/rest/v1/highlight_projects?id=eq.{project_id}",
            headers=headers
        )
        
        if r2.status_code == 200 and r2.json():
            project_priority = r2.json()[0].get("metadata", {}).get("priority", 5)
            avg = (task_priority + project_priority) / 2
            
            if avg > threshold:
                critical.append({
                    "task": task,
                    "task_priority": task_priority,
                    "project_priority": project_priority,
                    "average": avg
                })
    
    return critical

# Example usage
if __name__ == "__main__":
    # Create project
    project = create_project("Gennial Growth", "Autonomía Kimi", priority=8)
    
    # Create feature
    feature = create_feature(project["id"], "Skill Acquisition Engine", priority=8)
    
    # Create task
    task = create_task(
        project["id"],
        feature["id"],
        "Skill Acquisition Engine",
        "Install marketing-drafter skill",
        priority=8
    )
    
    print(f"Created: {task}")
```

### Bash: Quick Queries

```bash
# Set environment variables
export SUPABASE_URL="https://xpufofaemvoohcqdhvva.supabase.co"
export SUPABASE_KEY="your-key-here"

# List all projects
curl -s "$SUPABASE_URL/rest/v1/highlight_projects" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" | jq .

# List pending tasks
curl -s "$SUPABASE_URL/rest/v1/highlight_events?event_type=eq.task&status=eq.todo" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" | jq .

# Count tasks by status
curl -s "$SUPABASE_URL/rest/v1/highlight_events?event_type=eq.task" \
  -H "apikey: $SUPABASE_KEY" \
  -H "Authorization: Bearer $SUPABASE_KEY" | jq 'group_by(.status) | map({status: .[0].status, count: length})'
```

## Kimi's Autonomy Integration

### Heartbeat System

Kimi runs a heartbeat every 30 minutes that:

1. **Checks project health** - Counts active projects
2. **Finds critical tasks** - (Project Priority + Task Priority) / 2 > 8
3. **Decides to alert** - Only if average priority > 8
4. **Acts independently** - If Matias doesn't respond in 24h

### Alert Logic

```python
def should_alert(task, project):
    task_priority = task.get("metadata", {}).get("priority", 5)
    project_priority = project.get("metadata", {}).get("priority", 5)
    average = (task_priority + project_priority) / 2
    
    return average > 8  # Alert threshold
```

### Autonomy Rules

**Red Lines (Never cross):**
- ❌ Don't modify OpenClaw core code without approval
- ❌ Don't create external accounts without approval
- ❌ Don't send communications as "Kimi of Gennial" without approval
- ❌ Don't spend >$200 without justification
- ❌ Don't delete production data
- ❌ Don't modify repos without commit messages

**Yellow Lines (Alert but allow):**
- ⚠️ Spending >$50 on experiment
- ⚠️ Creating new repository
- ⚠️ Scheduling new cron job
- ⚠️ Modifying skill configuration

**Green Lines (Full freedom):**
- ✅ Experiment with code in own branches
- ✅ Generate content (images, audio, text)
- ✅ Analyze data
- ✅ Create documentation
- ✅ Learn new technology
- ✅ Write in memory files
- ✅ Install skills from ClawHub

## Troubleshooting

### Tasks not showing in frontend

**Check:**
1. `event_type` is set to "task" (not "feature")
2. `status` is one of: todo, in_progress, blocked, completed
3. `project_id` is correct and exists

**Query to debug:**
```http
GET /rest/v1/highlight_events?id=eq.{TASK_ID}
```

### Priority not calculated correctly

**Check:**
1. Project has `metadata.priority` as integer (1-10)
2. Task has `metadata.priority` as integer (1-10)
3. Both values are numbers, not strings

**Query to debug:**
```http
GET /rest/v1/highlight_projects?id=eq.{PROJECT_ID}&select=metadata
GET /rest/v1/highlight_events?id=eq.{TASK_ID}&select=metadata
```

### Cannot link task to feature

**Check:**
1. Feature exists and has correct ID
2. Task metadata includes `parent_feature_id` and `parent_feature_name`
3. Both are in the same project

### Heartbeat not logging

**Check:**
1. SUPABASE_URL and SUPABASE_KEY are set correctly
2. KIMI_PROJECT_ID exists in highlight_projects
3. Network connectivity to Supabase
4. API key has correct permissions (service_role)

## Environment Setup

### Required Variables

```bash
# Supabase connection
export SUPABASE_URL="https://xpufofaemvoohcqdhvva.supabase.co"
export SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# For Kimi's heartbeat
export KIMI_PROJECT_ID="3c2f3715-0b64-42cf-b8f8-b1fc79e584ad"
```

### Testing Connection

```python
import requests
import os

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

# Test connection
r = requests.get(f"{SUPABASE_URL}/rest/v1/highlight_projects?limit=1", headers=headers)
print(f"Status: {r.status_code}")
print(f"Response: {r.json()}")
```

## Links

- **Frontend:** https://mission-control-gennial.vercel.app
- **GitHub Repo:** https://github.com/matute1111/mission-control-gennial
- **Supabase Dashboard:** https://supabase.com/dashboard/project/xpufofaemvoohcqdhvva

## Changelog

### v2.0 (2026-03-07)
- Added priority-based alerting system
- Added Project → Feature → Task hierarchy
- Added Kimi autonomy integration
- Added comprehensive API documentation
- Added Python code examples

### v1.0 (2026-03-06)
- Initial release
- Basic CRUD operations for projects and tasks
