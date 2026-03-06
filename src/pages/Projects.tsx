import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Dialog, DialogTitle } from "@/components/Dialog"
import { Input } from "@/components/Input"
import { Textarea } from "@/components/Textarea"
import { Select } from "@/components/Select"
import { ProjectDetailSheet } from "@/components/ProjectDetailSheet"
import { cn, ago } from "@/lib/utils"
import type { Project, Task, ProjectUpdate } from "@/types"
import { Plus, Activity } from "lucide-react"

interface Props { projects: Project[]; tasks: Task[]; refresh: () => void }

export function Projects({ projects, tasks, refresh }: Props) {
  const [filter, setFilter] = useState("all")
  const [show, setShow] = useState(false)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [prio, setPrio] = useState("medium")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [latestUpdates, setLatestUpdates] = useState<Record<string, ProjectUpdate>>({})

  // Fetch últimos updates de todos los proyectos
  useEffect(() => {
    const fetchLatestUpdates = async () => {
      if (projects.length === 0) return
      
      const projectIds = projects.map(p => p.id)
      const { data } = await supabase
        .from("project_updates")
        .select("*")
        .in("project_id", projectIds)
        .order("created_at", { ascending: false })
      
      if (data) {
        // Tomar solo el más reciente de cada proyecto
        const updatesByProject: Record<string, ProjectUpdate> = {}
        data.forEach(update => {
          if (!updatesByProject[update.project_id]) {
            updatesByProject[update.project_id] = update
          }
        })
        setLatestUpdates(updatesByProject)
      }
    }
    
    fetchLatestUpdates()
  }, [projects])

  const filtered = filter === "all" ? projects : projects.filter(p => p.status === filter)
  const tabs = ["all", "active", "paused", "done", "cancelled"]

  const create = async () => {
    if (!name.trim()) return
    await supabase.from("projects").insert({ name, description: desc, priority: prio, created_by: "matias" })
    setName(""); setDesc(""); setPrio("medium"); setShow(false); refresh()
  }

  const complete = async (id: string) => {
    await supabase.from("projects").update({ status: "done" }).eq("id", id); refresh()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-900">Proyectos</h1>
        <Button onClick={() => setShow(true)}><Plus className="w-4 h-4 mr-1" /> Nuevo</Button>
      </div>

      <div className="flex gap-1 bg-stone-100 p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition", filter === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700")}>
            {t === "all" ? "Todos" : t}
          </button>
        ))}
      </div>

      <Card className="divide-y divide-stone-50">
        {filtered.map(p => {
          const lastUpdate = latestUpdates[p.id]
          const hasStatus = p.current_status || lastUpdate
          
          return (
            <div 
              key={p.id} 
              className="px-5 py-4 hover:bg-stone-50 transition cursor-pointer"
              onClick={() => setSelectedProject(p)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-stone-900">{p.name}</div>
                <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                  <Badge value={p.status} />
                  <Badge value={p.priority} />
                  <span className="text-[10px] text-stone-400 font-mono">{ago(p.created_at)}</span>
                  {p.status === "active" && (
                    <Button variant="ghost" size="sm" onClick={() => complete(p.id)} className="text-emerald-600">Completar</Button>
                  )}
                </div>
              </div>
              
              {/* BRIEF PREVIEW: Qué pasa en el proyecto */}
              {hasStatus && (
                <div className="mt-2 flex items-start gap-2">
                  <Activity className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    {/* Mostrar current_status si existe, sino el último update */}
                    {p.current_status ? (
                      <p className="text-sm text-amber-800 font-medium truncate">
                        ▶️ {p.current_status}
                      </p>
                    ) : lastUpdate ? (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-1.5 py-0.5 rounded ${
                          lastUpdate.update_type === 'milestone' ? 'bg-emerald-100 text-emerald-700' :
                          lastUpdate.update_type === 'blocker' ? 'bg-red-100 text-red-700' :
                          lastUpdate.update_type === 'decision' ? 'bg-blue-100 text-blue-700' :
                          lastUpdate.update_type === 'progress' ? 'bg-amber-100 text-amber-700' :
                          'bg-stone-100 text-stone-600'
                        }`}>
                          {lastUpdate.update_type}
                        </span>
                        <p className="text-sm text-stone-600 truncate">
                          {lastUpdate.content}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
              
              {/* Descripción si no hay status */}
              {!hasStatus && p.description && (
                <div className="mt-1 text-xs text-stone-500 truncate max-w-2xl">
                  {p.description}
                </div>
              )}
            </div>
          )
        })}
        {filtered.length === 0 && <div className="px-5 py-8 text-center text-stone-400 text-sm">Sin proyectos</div>}
      </Card>

      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>Nuevo proyecto</DialogTitle>
        <div className="space-y-3">
          <Input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
          <Textarea placeholder="Descripcion" value={desc} onChange={e => setDesc(e.target.value)} />
          <Select value={prio} onChange={e => setPrio(e.target.value)}>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShow(false)}>Cancelar</Button>
            <Button onClick={create}>Crear</Button>
          </div>
        </div>
      </Dialog>

      <ProjectDetailSheet 
        project={selectedProject}
        tasks={tasks}
        onClose={() => setSelectedProject(null)}
        onUpdate={refresh}
      />
    </div>
  )
}
