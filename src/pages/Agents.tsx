import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"
import { Badge } from "@/components/Badge"
import { cn } from "@/lib/utils"
import { Cpu, Code2, Database, TrendingUp, Activity, Clock } from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  specialty: string
  status: "active" | "busy" | "idle"
  lastActivity: string
  icon: typeof Cpu
  color: string
}

const AGENTS: Agent[] = [
  {
    id: "ai-engineer",
    name: "AI Engineer",
    description: "AI APIs, video pipeline, model evaluation",
    specialty: "ML/AI",
    status: "active",
    lastActivity: "Hace 5 min",
    icon: Cpu,
    color: "from-violet-500 to-purple-600",
  },
  {
    id: "frontend-dev",
    name: "Frontend Dev",
    description: "React components, UI, Vercel deploy",
    specialty: "Frontend",
    status: "active",
    lastActivity: "Hace 12 min",
    icon: Code2,
    color: "from-blue-500 to-cyan-600",
  },
  {
    id: "backend-architect",
    name: "Backend Architect",
    description: "Supabase, n8n workflows, architecture",
    specialty: "Backend",
    status: "busy",
    lastActivity: "Hace 2 horas",
    icon: Database,
    color: "from-emerald-500 to-teal-600",
  },
  {
    id: "growth-hacker",
    name: "Growth Hacker",
    description: "LinkedIn outreach, CRM research, leads",
    specialty: "Growth",
    status: "active",
    lastActivity: "Hace 30 min",
    icon: TrendingUp,
    color: "from-amber-500 to-orange-600",
  },
]

const STATUS_CONFIG = {
  active: { label: "Activo", color: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
  busy: { label: "Ocupado", color: "bg-amber-100 text-amber-800", dot: "bg-amber-500" },
  idle: { label: "Inactivo", color: "bg-stone-100 text-stone-600", dot: "bg-stone-400" },
}

export function Agents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-stone-900">Agentes</h1>
          <p className="text-sm text-stone-500 mt-1">Claude Code specialists</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <Activity className="w-4 h-4" />
          <span>4 agentes disponibles</span>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {AGENTS.map((agent) => {
          const Icon = agent.icon
          const status = STATUS_CONFIG[agent.status]
          
          return (
            <Card key={agent.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shrink-0", agent.color)}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold text-stone-900">{agent.name}</h3>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", status.color)}>
                        <span className={cn("inline-block w-1.5 h-1.5 rounded-full mr-1", status.dot)} />
                        {status.label}
                      </span>
                    </div>
                    
                    <p className="text-sm text-stone-600 mt-1">{agent.description}</p>
                    
                    <div className="flex items-center gap-3 mt-3">
                      <Badge value={agent.specialty} />
                      <div className="flex items-center gap-1 text-xs text-stone-400">
                        <Clock className="w-3 h-3" />
                        <span>{agent.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {AGENTS.filter(a => a.status === "active").length}
              </div>
              <div className="text-xs text-stone-500 mt-1">Activos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-amber-600">
                {AGENTS.filter(a => a.status === "busy").length}
              </div>
              <div className="text-xs text-stone-500 mt-1">Ocupados</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-stone-600">
                {AGENTS.filter(a => a.status === "idle").length}
              </div>
              <div className="text-xs text-stone-500 mt-1">Inactivos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
