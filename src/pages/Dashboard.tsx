import { Badge } from "@/components/Badge"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/Card"
import { Button } from "@/components/Button"
import { ago, cn } from "@/lib/utils"
import type { Project, Feature, Task, Proposal, Activity, CRMCompany, CRMDeal } from "@/types"
import { useEffect, useState } from "react"

interface Props {
  projects: Project[]
  features: Feature[]
  tasks: Task[]
  proposals: Proposal[]
  activities: Activity[]
  companies: CRMCompany[]
  deals: CRMDeal[]
}

export function Dashboard({ projects, features, tasks, proposals, activities, companies, deals }: Props) {
  const [loading, setLoading] = useState(true)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Simulate loading state for skeleton screens
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800)
    // Check if first visit
    const hasVisited = localStorage.getItem('mc-dashboard-visited')
    if (!hasVisited) {
      setShowOnboarding(true)
      localStorage.setItem('mc-dashboard-visited', 'true')
    }
    return () => clearTimeout(timer)
  }, [])

  const active = projects.filter(p => p.status === "active").length
  const activeFeatures = features.filter(f => f.status === "in_progress").length
  const pending = tasks.filter(t => t.status === "todo" || t.status === "in_progress" || t.status === "blocked").length
  const done = tasks.filter(t => t.status === "done").length
  const rate = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0
  const pendingP = proposals.filter(p => p.status === "pending").length

  // Critical tasks (impact × urgency >= 20)
  const criticalTasks = tasks.filter(t => (t.impact || 1) * (t.urgency || 1) >= 20)

  // CRM stats
  const activeDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost' && d.stage !== 'archived').length
  const pipelineValue = deals
    .filter(d => d.stage !== 'won' && d.stage !== 'lost' && d.stage !== 'archived')
    .reduce((sum, d) => sum + (d.value_amount_max || d.value_amount_min || 0), 0)
  const wonValue = deals
    .filter(d => d.stage === 'won')
    .reduce((sum, d) => sum + (d.value_amount_max || d.value_amount_min || 0), 0)

  // Skeleton components
  const SkeletonKpi = () => (
    <Card>
      <CardContent className="animate-pulse">
        <div className="h-3 bg-stone-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-stone-200 rounded w-16"></div>
      </CardContent>
    </Card>
  )

  const SkeletonActivity = () => (
    <div className="px-5 py-3 flex items-start gap-3 animate-pulse">
      <div className="w-8 h-5 bg-stone-200 rounded"></div>
      <div className="flex-1">
        <div className="h-4 bg-stone-200 rounded w-32 mb-1"></div>
        <div className="h-3 bg-stone-200 rounded w-48"></div>
      </div>
    </div>
  )

  const kpis = [
    { l: "Proyectos activos", v: active, c: "text-emerald-600" },
    { l: "Features en progreso", v: activeFeatures, c: "text-amber-600" },
    { l: "Tareas críticas", v: criticalTasks.length, c: criticalTasks.length > 0 ? "text-red-600" : "text-stone-600" },
    { l: "Completion rate", v: `${rate}%`, c: "text-blue-600" },
  ]

  const crmKpis = [
    { l: "Empresas", v: companies.length, c: "text-stone-600" },
    { l: "Deals activos", v: activeDeals, c: "text-violet-600" },
    { l: "Pipeline", v: `$${(pipelineValue / 1000).toFixed(0)}k`, c: "text-amber-600" },
    { l: "Ganado", v: `$${(wonValue / 1000).toFixed(0)}k`, c: "text-emerald-600" },
  ]

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="text-sm text-stone-500 flex items-center gap-2">
        <span className="font-medium text-stone-900">Dashboard</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-900">Dashboard</h1>
        {criticalTasks.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-1.5 rounded-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            {criticalTasks.length} tarea{criticalTasks.length > 1 ? 's' : ''} crítica{criticalTasks.length > 1 ? 's' : ''}
          </div>
        )}
      </div>

      {/* KPIs with loading state */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {loading ? (
          <>
            <SkeletonKpi />
            <SkeletonKpi />
            <SkeletonKpi />
            <SkeletonKpi />
          </>
        ) : (
          kpis.map(k => (
            <Card key={k.l} className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent>
                <div className="text-stone-500 text-xs font-medium mb-1 group-hover:text-stone-700 transition-colors">{k.l}</div>
                <div className={`text-2xl font-bold ${k.c}`}>{k.v}</div>
                {k.l === "Completion rate" && (
                  <div className="mt-2 h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${rate}%` }}
                    ></div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* CRM Section */}
      <div>
        <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wider mb-3">CRM</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {loading ? (
            <>
              <SkeletonKpi />
              <SkeletonKpi />
              <SkeletonKpi />
              <SkeletonKpi />
            </>
          ) : (
            crmKpis.map(k => (
              <Card key={k.l} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent>
                  <div className="text-stone-500 text-xs font-medium mb-1">{k.l}</div>
                  <div className={`text-2xl font-bold ${k.c}`}>{k.v}</div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {!loading && (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => window.location.href = '/tasks'}>
            📝 Ver tareas
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.location.href = '/projects'}>
            📁 Ver proyectos
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.location.href = '/crm'}>
            💼 Ver CRM
          </Button>
        </div>
      )}

      {/* Activity Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Actividad reciente</CardTitle>
            {!loading && activities.length > 0 && (
              <span className="text-xs text-stone-400">{activities.length} total</span>
            )}
          </div>
        </CardHeader>
        <div className="divide-y divide-stone-50">
          {loading ? (
            <>
              <SkeletonActivity />
              <SkeletonActivity />
              <SkeletonActivity />
              <SkeletonActivity />
              <SkeletonActivity />
            </>
          ) : activities.slice(0, 15).map(a => (
            <div key={a.id} className="px-5 py-3 flex items-start gap-3 hover:bg-stone-50 transition-colors">
              <Badge value={a.actor} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-stone-800">{a.action}</div>
                {a.detail && <div className="text-xs text-stone-500 mt-0.5 truncate">{a.detail}</div>}
              </div>
              <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap" title={a.created_at}>
                {ago(a.created_at)}
              </span>
            </div>
          ))}
          {!loading && activities.length === 0 && (
            <div className="px-5 py-12 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-stone-600 font-medium mb-1">Sin actividad reciente</p>
              <p className="text-sm text-stone-400 mb-4">Cuando empieces a trabajar, verás el registro aquí</p>
              <Button size="sm" onClick={() => window.location.href = '/tasks'}>Crear primera tarea</Button>
            </div>
          )}
        </div>
      </Card>

      {/* Onboarding Tooltip */}
      {showOnboarding && (
        <div className="fixed bottom-4 right-4 bg-stone-900 text-white p-4 rounded-lg shadow-xl max-w-sm z-50 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-start gap-3">
            <div className="text-2xl">👋</div>
            <div>
              <p className="font-medium mb-1">¡Bienvenido a Mission Control!</p>
              <p className="text-sm text-stone-300 mb-3">Aquí puedes gestionar proyectos, tareas y ver el estado de todo.</p>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setShowOnboarding(false)}>Entendido</Button>
                <Button size="sm" variant="ghost" onClick={() => { localStorage.setItem('mc-onboarding-complete', 'true'); setShowOnboarding(false); }}>
                  No mostrar más
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
