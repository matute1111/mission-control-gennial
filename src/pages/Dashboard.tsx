import { Badge } from "@/components/Badge"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/Card"
import { ago } from "@/lib/utils"
import type { Project, Feature, Task, Proposal, Activity } from "@/types"

interface Props {
  projects: Project[]
  features: Feature[]
  tasks: Task[]
  proposals: Proposal[]
  activities: Activity[]
}

export function Dashboard({ projects, features, tasks, proposals, activities }: Props) {
  const active = projects.filter(p => p.status === "active").length
  const activeFeatures = features.filter(f => f.status === "in_progress").length
  const pending = tasks.filter(t => t.status === "todo" || t.status === "in_progress" || t.status === "blocked").length
  const done = tasks.filter(t => t.status === "done").length
  const rate = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0
  const pendingP = proposals.filter(p => p.status === "pending").length
  
  // Critical tasks (impact × urgency >= 20)
  const criticalTasks = tasks.filter(t => (t.impact || 1) * (t.urgency || 1) >= 20)

  const kpis = [
    { l: "Proyectos activos", v: active, c: "text-emerald-600" },
    { l: "Features en progreso", v: activeFeatures, c: "text-amber-600" },
    { l: "Tareas críticas", v: criticalTasks.length, c: criticalTasks.length > 0 ? "text-red-600" : "text-stone-600" },
    { l: "Completion rate", v: `${rate}%`, c: "text-blue-600" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-stone-900">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.l}>
            <CardContent>
              <div className="text-stone-500 text-xs font-medium mb-1">{k.l}</div>
              <div className={`text-2xl font-bold ${k.c}`}>{k.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Actividad reciente</CardTitle></CardHeader>
        <div className="divide-y divide-stone-50">
          {activities.slice(0, 15).map(a => (
            <div key={a.id} className="px-5 py-3 flex items-start gap-3">
              <Badge value={a.actor} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-stone-800">{a.action}</div>
                {a.detail && <div className="text-xs text-stone-500 mt-0.5 truncate">{a.detail}</div>}
              </div>
              <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap">{ago(a.created_at)}</span>
            </div>
          ))}
          {activities.length === 0 && <div className="px-5 py-8 text-center text-stone-400 text-sm">Sin actividad</div>}
        </div>
      </Card>
    </div>
  )
}
