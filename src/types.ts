export type Page = "dashboard" | "projects" | "tasks" | "proposals" | "crm" | "activity"

export type User = {
  email: string
  name: string
  role: string
} | null

// Nuevo schema: 12 tablas, hierarchy projects → features → tasks

export interface Project {
  id: string
  name: string
  description: string
  status: 'active' | 'completed' | 'paused' | 'archived'
  current_status?: string
  // Priority system: impact × urgency (1-25)
  impact?: number  // 1-5
  urgency?: number  // 1-5
  strategic_value?: 'core' | 'supporting' | 'experimental'
  // URLs
  github_url?: string
  vercel_url?: string
  supabase_url?: string
  docs_url?: string
  extra_urls?: { label: string; url: string }[]
  // Content
  brief?: string
  roadmap?: string | any[]
  // Meta
  created_by: string
  created_at: string
  updated_at: string
  archived_at?: string | null
}

export interface Feature {
  id: string
  project_id: string
  name: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed' | 'paused' | 'archived'
  current_status?: string
  // Priority
  impact?: number  // 1-5
  urgency?: number  // 1-5
  progress?: number  // 0-100
  // URLs
  github_url?: string
  vercel_url?: string
  supabase_url?: string
  extra_urls?: { label: string; url: string }[]
  // Dates
  start_date?: string
  target_end_date?: string
  actual_end_date?: string
  // Meta
  created_by: string
  created_at: string
  updated_at: string
  archived_at?: string | null
}

export interface Task {
  id: string
  feature_id: string  // FK a features (no project_id directo)
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'done' | 'blocked' | 'archived'
  // Priority
  impact?: number  // 1-5
  urgency?: number  // 1-5
  // Assignment
  assigned_to?: string
  assigned_agent?: string
  agent_profile?: string
  model_used?: string
  // Execution
  result?: string
  steps_taken?: string[]
  decisions_made?: string
  learnings?: string
  blockers_encountered?: string
  solution_applied?: string
  tools_used?: string[]
  files_modified?: string[]
  time_spent_minutes?: number
  deployment_status?: 'deployed' | 'partial' | 'failed' | 'pending' | 'not_required'
  // Dates
  due_date?: string
  created_by: string
  created_at: string
  updated_at: string
  archived_at?: string | null
}

export interface Proposal {
  id: string
  title: string
  description?: string
  category?: string
  proposed_by: string
  status: 'pending' | 'approved' | 'rejected' | 'deferred'
  reviewed_by?: string
  review_note?: string
  reviewed_at?: string
  // Optional links
  project_id?: string
  feature_id?: string
  created_by: string
  created_at: string
  updated_at: string
  archived_at?: string | null
}

export interface Skill {
  id: string
  name: string
  description?: string
  version?: string
  source?: 'clawhub' | 'custom' | 'builtin'
  status: 'active' | 'disabled' | 'uninstalled'
  install_path?: string
  config?: Record<string, any>
  installed_by?: string
  installed_at?: string
  created_at: string
  updated_at: string
  archived_at?: string | null
}

export interface Decision {
  id: string
  project_id?: string
  feature_id?: string
  task_id?: string
  category?: 'learning' | 'error' | 'pivot' | 'tradeoff' | 'optimization' | 'rollback'
  decision: string
  reasoning?: string
  alternatives_evaluated?: string
  outcome?: string
  decided_by: string
  created_at: string
  archived_at?: string | null
}

// Updates / Logs

export interface ProjectUpdate {
  id: string
  project_id: string
  update_type: 'milestone' | 'blocker' | 'progress' | 'note'
  content: string
  created_by: string
  created_at: string
  archived_at?: string | null
}

export interface FeatureUpdate {
  id: string
  feature_id: string
  update_type: 'milestone' | 'blocker' | 'progress' | 'note'
  content: string
  created_by: string
  created_at: string
  archived_at?: string | null
}

export interface TaskUpdate {
  id: string
  task_id: string
  update_type: 'progress' | 'blocker' | 'note'
  content: string
  outcome?: string
  created_by: string
  created_at: string
  archived_at?: string | null
}

export interface ProposalUpdate {
  id: string
  proposal_id: string
  update_type: 'comment' | 'status_change' | 'feedback'
  content: string
  created_by: string
  created_at: string
  archived_at?: string | null
}

export interface SkillUpdate {
  id: string
  skill_id: string
  update_type: 'installed' | 'updated' | 'disabled' | 'uninstalled' | 'config_change'
  content: string
  version?: string
  created_by: string
  created_at: string
  archived_at?: string | null
}

export interface Activity {
  id: string
  actor: string  // antes 'agent'
  action: string
  detail?: string  // antes 'reasoning'
  result?: string
  model_used?: string
  session_id?: string
  created_at: string
  archived_at?: string | null
}

// Auth users
export const USERS: Record<string, { name: string; role: string; pass: string }> = {
  "matias@gennial.ai": { name: "Matias", role: "Chief AI Officer", pass: "gennial2026" },
  "adrian@gennial.ai": { name: "Adrian", role: "CEO", pass: "gennial2026" },
}

// CRM Types

export interface CRMCompany {
  id: string
  name: string
  website?: string
  linkedin_url?: string
  instagram_handle?: string
  location?: string
  country?: string
  industry?: string
  company_size?: '10-50' | '50-200' | '200-1000' | '1000+'
  description?: string
  research_notes?: any
  pain_points?: string
  opportunities?: string
  impact?: number
  urgency?: number
  deal_potential?: 'high' | 'medium' | 'low'
  status: 'prospect' | 'qualified' | 'contacted' | 'negotiation' | 'won' | 'lost' | 'archived'
  source?: 'linkedin' | 'referral' | 'event' | 'outbound'
  created_by: string
  created_at: string
  updated_at: string
  archived_at?: string | null
}

export interface CRMContact {
  id: string
  company_id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  linkedin_url?: string
  job_title?: string
  seniority?: 'c-level' | 'vp' | 'director' | 'manager' | 'individual'
  department?: 'marketing' | 'sales' | 'product' | 'operations' | 'executive'
  is_decision_maker?: boolean
  influence_level?: number
  bio?: string
  interests?: any
  recent_posts?: string
  last_contact_date?: string
  contact_count?: number
  response_rate?: 'high' | 'medium' | 'low' | 'none'
  impact?: number
  urgency?: number
  created_by: string
  created_at: string
  archived_at?: string | null
}

export interface CRMDeal {
  id: string
  company_id: string
  primary_contact_id?: string
  title: string
  description?: string
  deal_type: 'client' | 'investor' | 'partner' | 'other'
  value_currency?: string
  value_amount_min?: number
  value_amount_max?: number
  value_period?: 'one-time' | 'monthly' | 'yearly'
  stage: 'lead' | 'qualified' | 'meeting_scheduled' | 'proposal_sent' | 'negotiation' | 'won' | 'lost' | 'archived'
  probability?: number
  expected_close_date?: string
  actual_close_date?: string
  impact?: number
  urgency?: number
  assigned_to?: string
  created_by: string
  created_at: string
  archived_at?: string | null
}

export interface CRMUpdate {
  id: string
  company_id?: string
  contact_id?: string
  deal_id?: string
  update_type: 'research' | 'outreach_sent' | 'response_received' | 'meeting_scheduled' | 'meeting_completed' | 'proposal_sent' | 'proposal_viewed' | 'negotiation' | 'objection' | 'follow_up' | 'status_change' | 'note'
  content: string
  outcome?: string
  email_opened?: boolean
  email_clicked?: boolean
  linkedin_post_interaction?: 'liked' | 'commented' | 'shared' | 'none'
  next_action?: string
  next_action_date?: string
  created_by: string
  created_at: string
  archived_at?: string | null
}

export interface CRMActivity {
  id: string
  company_id?: string
  contact_id?: string
  deal_id?: string
  activity_type: 'email' | 'linkedin_message' | 'linkedin_comment' | 'call' | 'video_call' | 'meeting' | 'event' | 'other'
  direction?: 'outbound' | 'inbound'
  subject?: string
  content?: string
  notes?: string
  status?: 'scheduled' | 'completed' | 'cancelled' | 'no_show'
  result?: 'positive' | 'neutral' | 'negative' | 'no_response'
  follow_up_needed?: boolean
  follow_up_date?: string
  created_by: string
  created_at: string
  archived_at?: string | null
}

// Learnings Type
export interface Learning {
  id: string
  title: string
  category: 'what_worked' | 'what_didnt_work' | 'insight' | 'mistake'
  source_type: 'task' | 'project' | 'experiment' | 'conversation' | 'research' | 'other'
  source_id?: string
  content: string
  context?: string
  tags?: string[]
  actionable: boolean
  action_items?: string[]
  replicable: boolean
  applicable_to?: string[]
  impact_score?: number
  created_by: string
  created_at: string
  archived_at?: string | null
}

// Priority score calculation: impact × urgency (1-25)
export function getPriorityScore(impact?: number, urgency?: number): number {
  return (impact || 1) * (urgency || 1)
}

export function getPriorityColor(score: number): string {
  if (score >= 20) return 'bg-red-100 text-red-800'      // Critical
  if (score >= 15) return 'bg-orange-100 text-orange-800' // High
  if (score >= 10) return 'bg-amber-100 text-amber-800'   // Medium
  return 'bg-stone-100 text-stone-600'                    // Low
}

export function getStrategicValueColor(value?: string): string {
  switch (value) {
    case 'core': return 'bg-purple-100 text-purple-800'
    case 'supporting': return 'bg-blue-100 text-blue-800'
    case 'experimental': return 'bg-stone-100 text-stone-600'
    default: return 'bg-stone-100 text-stone-600'
  }
}

export const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  completed: "bg-emerald-100 text-emerald-800",
  done: "bg-emerald-100 text-emerald-800",
  approved: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  assigned: "bg-violet-100 text-violet-800",
  review: "bg-violet-100 text-violet-800",
  blocked: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
  deferred: "bg-stone-100 text-stone-600",
  todo: "bg-stone-100 text-stone-600",
  paused: "bg-stone-100 text-stone-600",
  cancelled: "bg-stone-100 text-stone-600",
  archived: "bg-stone-100 text-stone-600",
  // Legacy priority colors (para backward compat)
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-stone-100 text-stone-600",
  // Users
  kimi: "bg-yellow-100 text-yellow-800",
  matias: "bg-blue-100 text-blue-800",
  adrian: "bg-violet-100 text-violet-800",
  system: "bg-stone-100 text-stone-600",
}
