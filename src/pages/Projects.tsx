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
import { Plus, Activity, Folder, FolderOpen, ChevronRight } from "lucide-react"

interface Props { projects: Project[]; tasks: Task[]; refresh: () => void }

export function Projects({ projects, tasks, refresh }: Props) {
  const [filter, setFilter] = useState("all")
  const [show, setShow] = useState(false)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [prio, setPrio] = useState("medium")
  const [projectType, setProjectType] = useState<'macro' | 'feature'>('feature')
  const [parentProjectId, setParentProjectId] = useState("")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [latestUpdates, setLatestUpdates] = useState<Record<string, ProjectUpdate>>({})
  const [expandedMacros, setExpandedMacros] = useState<Set<string>>(new Set())

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

  // Separar proyectos macro y features
  const macroProjects = projects.filter(p => p.project_type === 'macro' || !p.parent_project_id)
  const featureProjects = projects.filter(p => p.parent_project_id || p.project_type === 'feature')
  
  // Filtrar según status
  const filteredMacros = filter === "all" ? macroProjects : macroProjects.filter(p => p.status === filter)
  
  const tabs = ["all", "active", "paused", "done", "cancelled"]

  const create = async () => {
    if (!name.trim()) return
    await supabase.from("projects").insert({ 
      name, 
      description: desc, 
      priority: prio, 
      created_by: "matias",
      project_type: projectType,
      parent_project_id: parentProjectId || null
    })
    setName(""); setDesc(""); setPrio("medium"); setProjectType('feature'); setParentProjectId(""); setShow(false); refresh()
  }

  const complete = async (id: string) => {
    await supabase.from("projects").update({ status: "done" }).eq("id", id); refresh()
  }

  const toggleMacro = (macroId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newExpanded = new Set(expandedMacros)
    if (newExpanded.has(macroId)) {
      newExpanded.delete(macroId)
    } else {
      newExpanded.add(macroId)
    }
    setExpandedMacros(newExpanded)
  }

  const renderProjectStatus = (p: Project) => {
    const lastUpdate = latestUpdates[p.id]
    const hasStatus = p.current_status || lastUpdate
    
    if (hasStatus) {
      return (
        <div className="mt-1 flex items-start gap-2">
          <Activity className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            {p.current_status ? (
              <p className="text-xs text-amber-700 truncate">
                ▶️ {p.current_status}
              </p>
            ) : lastUpdate ? (
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] px-1 py-0.5 rounded ${
                  lastUpdate.update_type === 'milestone' ? 'bg-emerald-100 text-emerald-700' :
                  lastUpdate.update_type === 'blocker' ? 'bg-red-100 text-red-700' :
                  lastUpdate.update_type === 'decision' ? 'bg-blue-100 text-blue-700' :
                  lastUpdate.update_type === 'progress' ? 'bg-amber-100 text-amber-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  {lastUpdate.update_type}
                </span>
                <p className="text-xs text-stone-500 truncate">
                  {lastUpdate.content}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      )
    }
    
    if (p.description) {
      return (
        <div className="mt-1 text-xs text-stone-400 truncate max-w-xl">
          {p.description}
        </div>
      )
    }
    
    return null
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

      <Card className="divide-y divide-stone-50 overflow-hidden">
        {filteredMacros.length === 0 && <div className="px-4 sm:px-5 py-8 text-center text-stone-400 text-sm">Sin proyectos</div>}
        
        {filteredMacros.map(macro => {
          const macroFeatures = featureProjects.filter(m => m.parent_project_id === macro.id)
          const isExpanded = expandedMacros.has(macro.id)
          const macroTasks = tasks.filter(t => t.project_id === macro.id)
          const macroProgress = macroTasks.length > 0 
            ? Math.round((macroTasks.filter(t => t.status === "done").length / macroTasks.length) * 100)
            : 0
          
          return (
            <div key={macro.id} className="bg-stone-50/50">
              {/* MACRO PROYECTO */}
              <div 
                className="px-5 py-4 hover:bg-stone-100 transition cursor-pointer border-l-4 border-blue-400"
                onClick={() => setSelectedProject(macro)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => toggleMacro(macro.id, e)}
                      className="p-1 hover:bg-stone-200 rounded transition"
                    >
                      <ChevronRight className={cn("w-4 h-4 text-stone-400 transition-transform", isExpanded && "rotate-90")} />
                    </button>
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold text-stone-900">{macro.name}</div>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <span>Macro Proyecto</span>
                          {macroFeatures.length > 0 && (
                            <span>• {macroFeatures.length} features</span>
                          )}
                          {macroTasks.length > 0 && (
                            <span>• {macroProgress}% tasks</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <Badge value={macro.status} />
                    <Badge value={macro.priority} />
                    {macro.status === "active" && (
                      <Button variant="ghost" size="sm" onClick={() => complete(macro.id)} className="text-emerald-600">Completar</Button>
                    )}
                  </div>
                </div>
                
                {renderProjectStatus(macro)}
              </div>
              
              {/* FEATURES (hijos del macro) */}
              {isExpanded && macroFeatures.length > 0 && (
                <div className="bg-white">
                  {macroFeatures.map(micro => {
                    const microTasks = tasks.filter(t => t.project_id === micro.id)
                    const microProgress = microTasks.length > 0
                      ? Math.round((microTasks.filter(t => t.status === "done").length / microTasks.length) * 100)
                      : 0
                    
                    return (
                      <div 
                        key={micro.id}
                        className="px-5 py-3 pl-16 hover:bg-stone-50 transition cursor-pointer border-l-4 border-transparent hover:border-amber-300"
                        onClick={() => setSelectedProject(micro)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-amber-500" />
                            <div>
                              <div className="font-medium text-stone-800">{micro.name}</div>
                              <div className="flex items-center gap-2 text-xs text-stone-400">
                                <span>Feature</span>
                                {microTasks.length > 0 && (
                                  <span>• {microTasks.length} tareas ({microProgress}%)</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                            <Badge value={micro.status} />
                            <Badge value={micro.priority} />
                            {micro.status === "active" && (
                              <Button variant="ghost" size="sm" onClick={() => complete(micro.id)} className="text-emerald-600">Completar</Button>
                            )}
                          </div>
                        </div>
                        
                        {renderProjectStatus(micro)}
                      </div>
                    )
                  })}
                </div>
              )}
              
              {isExpanded && macroFeatures.length === 0 && (
                <div className="px-5 py-3 pl-16 text-xs text-stone-400 italic">
                  Sin features
                </div>
              )}
            </div>
          )
        })}
        
        {/* Features sin macro padre (huérfanos) */}
        {featureProjects.filter(m => !m.parent_project_id).map(micro => (
          <div 
            key={micro.id}
            className="px-5 py-4 hover:bg-stone-50 transition cursor-pointer"
            onClick={() => setSelectedProject(micro)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="w-4 h-4 text-stone-400" />
                <div>
                  <div className="font-medium text-stone-900">{micro.name}</div>
                  <div className="text-xs text-stone-400">Sin macro proyecto</div>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <Badge value={micro.status} />
                <Badge value={micro.priority} />
                {micro.status === "active" && (
                  <Button variant="ghost" size="sm" onClick={() => complete(micro.id)} className="text-emerald-600">Completar</Button>
                )}
              </div>
            </div>
            
            {renderProjectStatus(micro)}
          </div>
        ))}
      </Card>

      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>Nuevo proyecto</DialogTitle>
        <div className="space-y-3">
          <Input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
          <Textarea placeholder="Descripcion" value={desc} onChange={e => setDesc(e.target.value)} />
          
          <div className="grid grid-cols-2 gap-3">
            <Select value={prio} onChange={e => setPrio(e.target.value)}>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            
            <Select value={projectType} onChange={e => setProjectType(e.target.value as 'macro' | 'feature')}>
              <option value="feature">Feature</option>
              <option value="macro">Macro Proyecto</option>
            </Select>
          </div>
          
          {projectType === 'feature' && (
            <Select value={parentProjectId} onChange={e => setParentProjectId(e.target.value)}>
              <option value="">Sin macro proyecto</option>
              {macroProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </Select>
          )}
          
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShow(false)}>Cancelar</Button>
            <Button onClick={create}>Crear</Button>
          </div>
        </div>
      </Dialog>

      <ProjectDetailSheet 
        project={selectedProject}
        tasks={tasks}
        projects={projects}
        onClose={() => setSelectedProject(null)}
        onUpdate={refresh}
      />
    </div>
  )
}
