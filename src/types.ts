export type Page = "dashboard" | "projects" | "tasks" | "proposals" | "activity"

export type User = {
  email: string
  name: string
  role: string
} | null

export interface Project {
  id: string
  name: string
  description: string
  status: string
  phase: string
  priority: string
  created_by: string
  created_at: string
  updated_at: string
  brief?: string           // Resumen general del proyecto
  roadmap?: string         // Qué va a pasar / plan
  current_status?: string  // Estado actual / qué se está haciendo ahora
  github_url?: string      // URL del repo
  vercel_url?: string      // URL del deploy
  docs_url?: string        // URL de documentación
  parent_project_id?: string | null  // ID del proyecto padre (macro proyecto)
  project_type?: 'macro' | 'feature' // Tipo: macro (contiene features) o feature (tiene tasks)
}

export interface Task {
  id: string
  project_id: string
  title: string
  description: string
  status: string
  priority: string
  assigned_to: string
  result: string
  blocked_reason: string
  created_by: string
  created_at: string
  updated_at: string
  // Campos de ejecución detallada
  assigned_agent?: string        // Quién lo hizo: 'kimi', 'subagent-xyz', etc.
  agent_profile?: string         // Perfil: 'frontend', 'backend', 'research', 'devops', etc.
  model_used?: string            // Modelo: 'kimi-k2.5', 'claude-sonnet-4.5', etc.
  execution_log?: string         // Log detallado de pasos ejecutados
  subagent_id?: string           // ID del subagente si aplica
  technical_details?: string     // Detalles técnicos de la implementación
  blockers_encountered?: string  // Bloqueantes encontrados durante ejecución
  solution_applied?: string      // Solución aplicada a los bloqueantes
  time_spent_minutes?: number    // Tiempo gastado en minutos
  tools_used?: string[]          // Herramientas usadas: ['git', 'vercel', 'supabase', etc.]
  files_modified?: string[]      // Archivos modificados
  deployment_url?: string        // URL del deploy si aplica
  pr_url?: string                // URL del PR si aplica
}

export interface Proposal {
  id: string
  title: string
  description: string
  category: string
  proposed_by: string
  status: string
  review_note: string
  reviewed_by: string
  created_at: string
}

export interface Activity {
  id: string
  agent: string
  action: string
  reasoning: string
  result: string
  created_at: string
}

export interface ProjectUpdate {
  id: string
  project_id: string
  update_type: 'milestone' | 'blocker' | 'decision' | 'progress' | 'note'
  content: string
  created_by: string
  created_at: string
}

export const USERS: Record<string, { name: string; role: string; pass: string }> = {
  "matias@gennial.ai": { name: "Matias", role: "Chief AI Officer", pass: "gennial2026" },
  "adrian@gennial.ai": { name: "Adrian", role: "CEO", pass: "gennial2026" },
}

export const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-800",
  done: "bg-emerald-100 text-emerald-800",
  approved: "bg-emerald-100 text-emerald-800",
  pending: "bg-amber-100 text-amber-800",
  in_progress: "bg-blue-100 text-blue-800",
  assigned: "bg-violet-100 text-violet-800",
  review: "bg-violet-100 text-violet-800",
  blocked: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
  critical: "bg-red-100 text-red-800",
  high: "bg-orange-100 text-orange-800",
  medium: "bg-amber-100 text-amber-800",
  low: "bg-stone-100 text-stone-600",
  kimi: "bg-yellow-100 text-yellow-800",
  matias: "bg-blue-100 text-blue-800",
  adrian: "bg-violet-100 text-violet-800",
  system: "bg-stone-100 text-stone-600",
  paused: "bg-stone-100 text-stone-600",
  cancelled: "bg-stone-100 text-stone-600",
}
