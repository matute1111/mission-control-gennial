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
PROJECT (Gennial Growth) [Score: 24]
├── strategic_value: core
├── impact: 4, urgency: 5, score: 20
│
├── FEATURE: Skill Acquisition Engine [Score: 20]
│   ├── impact: 4, urgency: 5
│   │
│   └── TASK: Install marketing-drafter [Score: 20]
│       ├── impact: 4, urgency: 5
│       └── status: todo
│
└── FEATURE: Oportunidades de Negocio [Score: 16]
    ├── impact: 4, urgency: 4
    └── TASK: Configurar RSS feeds [Score: 12]
        ├── impact: 3, urgency: 4
        └── status: in_progress
```

### Priority System (Impact × Urgency)

**Two-dimensional scoring:**

| Dimension | Range | Description |
|-----------|-------|-------------|
| **Impact** | 1-5 | How much it moves the needle |
| **Urgency** | 1-5 | How soon it needs to be done |

**Score Formula:**
```
Score = Impact × Urgency

Range: 1 (minimum) to 25 (maximum)
```

**Critical Override:**
- If `priority = 'critical'` → Score = 25 (regardless of calculation)

**For Projects - Additional Field:**
- **strategic_value**: `core` | `supporting` | `experimental`
- Used as tie-breaker when scores are equal
- Order: `core` > `supporting` > `experimental`

### Impact Scale (1-5)

| Value | Meaning | Example |
|-------|---------|---------|
| 5 | Unlocks external deliverable or client presentation | Demo WoMM ready for meeting |
| 4 | Advances core project in critical phase | Video pipeline working end-to-end |
| 3 | Significant internal operational improvement | Heartbeat with complete fields |
| 2 | Minor fix or improvement without external dependencies | UI component refactor |
| 1 | Cosmetic, internal documentation, nice-to-have | README typo fix |

### Urgency Scale (1-5)

| Value | Meaning | Time Criteria |
|-------|---------|---------------|
| 5 | Deadline in less than 24 hours | Meeting tomorrow, demo in 2 hours |
| 4 | Deadline in less than 72 hours | This week, client waiting |
| 3 | Deadline in less than 2 weeks | Active sprint, pressure exists |
| 2 | Deadline in less than 1 month | Active backlog, no immediate pressure |
| 1 | No deadline defined | Indefinite backlog |

### Strategic Value (Projects only)

| Value | Meaning | Example |
|-------|---------|---------|
| `core` | Central to presentation or main deliverable | WoMM, 6-week presentation |
| `supporting` | Enables or improves a core project | Mission Control, OpenClaw config |
| `experimental` | Exploration without external commitment | Cliffy, model testing |

### Color Coding (Frontend)

| Score Range | Color | Priority |
|-------------|-------|----------|
| 20-25 | 🔴 Red | Critical |
| 12-19 | 🟠 Orange | High |
| 6-11 | 🟡 Yellow | Medium |
| 1-5 | ⚪ Gray | Low |

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
| **impact** | int | Impact 1-5 | 4 |
| **urgency** | int | Urgency 1-5 | 5 |
| **priority_score** | int | Computed: impact × urgency | 20 |
| **strategic_value** | text | `core`, `supporting`, `experimental` | `supporting` |
| metadata | jsonb | Custom data | `{"owner": "kimi"}` |
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
| **impact** | int | Impact 1-5 | 4 |
| **urgency** | int | Urgency 1-5 | 5 |
| **priority_score** | int | Computed: impact × urgency | 20 |
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

def get_critical_tasks(threshold=20):
    """Get tasks with priority_score >= threshold."""
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    
    # Get all pending tasks with score >= threshold
    r = requests.get(
        f"{SUPABASE_URL}/rest/v1/highlight_events?"
        f"event_type=eq.task&"
        f"status=in.(todo,in_progress,blocked)&"
        f"priority_score=gte.{threshold}&"
        f"order=priority_score.desc",
        headers=headers
    )
    
    if r.status_code == 200:
        return r.json()
    
    return []

def create_project_with_priority(name, description, impact, urgency, strategic_value="supporting"):
    """Create a project with impact and urgency."""
    data = {
        "name": name,
        "description": description,
        "status": "active",
        "content_type": "project",
        "impact": impact,
        "urgency": urgency,
        "strategic_value": strategic_value,
        "metadata": {"owner": "kimi"},
        "created_by": "kimi"
    }
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/highlight_projects",
        headers=headers,
        json=data
    )
    return r.json()[0] if r.status_code == 201 else None

def create_task_with_priority(project_id, description, impact, urgency, parent_feature_id=None):
    """Create a task with impact and urgency."""
    data = {
        "project_id": project_id,
        "event_type": "task",
        "description": description,
        "status": "todo",
        "impact": impact,
        "urgency": urgency,
        "metadata": {
            "assigned_to": "kimi",
            "parent_feature_id": parent_feature_id
        }
    }
    r = requests.post(
        f"{SUPABASE_URL}/rest/v1/highlight_events",
        headers=headers,
        json=data
    )
    return r.json()[0] if r.status_code == 201 else None

# Example usage
if __name__ == "__main__":
    # Create project with priority (impact × urgency)
    # impact=4, urgency=5 → score=20 (high priority)
    project = create_project_with_priority(
        name="Gennial Growth",
        description="Autonomía Kimi",
        impact=4,
        urgency=5,
        strategic_value="supporting"
    )
    
    # Create feature with priority
    feature = create_task_with_priority(
        project_id=project["id"],
        description="Skill Acquisition Engine",
        impact=4,
        urgency=5
    )
    
    # Create task with priority
    # impact=4, urgency=5 → score=20 (will alert if ≥20)
    task = create_task_with_priority(
        project_id=project["id"],
        description="Install marketing-drafter skill",
        impact=4,
        urgency=5,
        parent_feature_id=feature["id"]
    )
    
    print(f"Created task with score: {task['priority_score']}")
    
    # Get critical tasks (score ≥ 20)
    critical = get_critical_tasks(threshold=20)
    print(f"Critical tasks: {len(critical)}")
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
2. **Finds critical tasks** - priority_score ≥ 20 (or status = 'critical')
3. **Decides to alert** - Only if score ≥ 20
4. **Orders tasks** - By score desc, then strategic_value, then created_at
5. **Acts independently** - If Matias doesn't respond in 24h

### Alert Logic (Impact × Urgency)

```python
def should_alert(task):
    """Determine if Matias should be alerted."""
    # Critical override
    if task.get("status") == "critical":
        return True, "Critical status override"
    
    # Score-based alert (≥ 20)
    task_score = task.get("priority_score", 0)
    if task_score >= 20:
        return True, f"Score {task_score} ≥ 20"
    
    return False, f"Score {task_score} < 20"

def get_next_task():
    """Get the next task to work on."""
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    
    # Query with ordering by priority
    url = f"{SUPABASE_URL}/rest/v1/highlight_events"
    params = {
        "event_type": "eq.task",
        "status": "in.(todo,in_progress,blocked)",
        "order": "priority_score.desc,created_at.asc",
        "limit": 1
    }
    
    r = requests.get(url, headers=headers, params=params)
    if r.status_code == 200 and r.json():
        return r.json()[0]
    return None
```

### When Creating Tasks Without Context

If Kimi doesn't have enough context to assign impact and urgency:

```python
def create_task_with_defaults(project_id, description):
    """Create task with default priority values."""
    data = {
        "project_id": project_id,
        "event_type": "task",
        "description": description,
        "status": "todo",
        "impact": 2,  # Default: low-medium impact
        "urgency": 2,  # Default: no immediate deadline
        "metadata": {
            "assigned_to": "kimi",
            "note": "Defaults assigned by Kimi - insufficient context"
        }
    }
    
    # Log the assignment of defaults
    log_activity(
        action="task_created_with_defaults",
        reasoning="Insufficient context to determine impact/urgency",
        task_description=description
    )
    
    return create_task(data)
```

### When Proposing Priority Changes

If Kimi thinks a task has wrong priority (e.g., low impact but blocks external deliverable):

```python
def propose_priority_change(task_id, current, suggested, reasoning):
    """Create proposal for priority change."""
    proposal = {
        "title": f"Priority adjustment for task {task_id}",
        "description": f"""
Current: impact={current['impact']}, urgency={current['urgency']}, score={current['score']}
Suggested: impact={suggested['impact']}, urgency={suggested['urgency']}, score={suggested['impact'] * suggested['urgency']}

Reasoning: {reasoning}
        """,
        "category": "other",
        "proposed_by": "kimi"
    }
    
    create_proposal(proposal)
    # Do NOT modify task without human approval
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
1. Task/Project has `impact` as integer (1-5)
2. Task/Project has `urgency` as integer (1-5)
3. `priority_score` is computed automatically (impact × urgency)
4. If `status = 'critical'`, score should be 25

**Query to debug:**
```http
GET /rest/v1/highlight_events?id=eq.{TASK_ID}&select=impact,urgency,priority_score
GET /rest/v1/highlight_projects?id=eq.{PROJECT_ID}&select=impact,urgency,strategic_value,priority_score
```

**Manual recalculation:**
```sql
-- Force recalculation of priority_score
UPDATE highlight_events 
SET impact = impact 
WHERE id = 'task-uuid';
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
