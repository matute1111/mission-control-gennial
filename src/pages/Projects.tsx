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
import { FeatureDetailSheet } from "@/components/FeatureDetailSheet"
import { cn, ago } from "@/lib/utils"
import type { Project, Feature, Task, ProjectUpdate } from "@/types"
import { Plus, Activity, Folder, FolderOpen, ChevronRight, Target } from "lucide-react"

interface Props { 
  projects: Project[]
  features: Feature[]
  tasks: Task[]
  refresh: () => void 
}

export function Projects({ projects, features, tasks, refresh }: Props) {
  const [filter, setFilter] = useState("all")
  const [show, setShow] = useState(false)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [impact, setImpact] = useState(3)
  const [urgency, setUrgency] = useState(3)
  const [strategicValue, setStrategicValue] = useState<'core' | 'supporting' | 'experimental'>('supporting')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null)
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

  // Features por proyecto
  const getFeaturesByProject = (projectId: string) => {
    return features.filter(f => f.project_id === projectId && !f.archived_at)
  }

  // Tasks por feature
  const getTasksByFeature = (featureId: string) => {
    return tasks.filter(t => t.feature_id === featureId && !t.archived_at)
  }

  // Filtrar proyectos
  const filteredProjects = filter === "all" 
    ? projects 
    : projects.filter(p => p.status === filter)
  
  const tabs = ["all", "active", "completed", "paused"]

  const create = async () => {
    if (!name.trim()) return
    
    const { error } = await supabase.from("projects").insert({ 
      name, 
      description: desc, 
      impact,
      urgency,
      strategic_value: strategicValue,
      status: 'active',
      created_by: "matias",
    })
    
    if (error) {
      console.error("Error creating project:", error)
      return
    }
    
    setName("")
    setDesc("")
    setImpact(3)
    setUrgency(3)
    setStrategicValue('supporting')
    setShow(false)
    refresh()
  }

  const archiveProject = async (id: string) => {
    await supabase.rpc('archive_record', { p_table: 'projects', p_id: id })
    refresh()
  }

  const toggleMacro = (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newExpanded = new Set(expandedMacros)
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId)
    } else {
      newExpanded.add(projectId)
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

  const getProjectScore = (p: Project) => (p.impact || 1) * (p.urgency || 1)

  const getScoreColor = (score: number) => {
    if (score >= 20) return 'text-red-600 bg-red-50'
    if (score >= 15) return 'text-orange-600 bg-orange-50'
    if (score >= 10) return 'text-amber-600 bg-amber-50'
    return 'text-stone-600 bg-stone-100'
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
        {filteredProjects.length === 0 && <div className="px-4 sm:px-5 py-8 text-center text-stone-400 text-sm">Sin proyectos</div>}
        
        {filteredProjects.sort((a, b) => getProjectScore(b) - getProjectScore(a)).map(project => {
          const projectFeatures = getFeaturesByProject(project.id)
          const isExpanded = expandedMacros.has(project.id)
          const score = getProjectScore(project)
          const projectTasks = projectFeatures.flatMap(f => getTasksByFeature(f.id))
          const projectProgress = projectTasks.length > 0 
            ? Math.round((projectTasks.filter(t => t.status === "done").length / projectTasks.length) * 100)
            : 0
          
          return (
            <div key={project.id} className="bg-stone-50/50">
              {/* PROYECTO */}
              <div 
                className="px-5 py-4 hover:bg-stone-100 transition cursor-pointer border-l-4 border-blue-400"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => toggleMacro(project.id, e)}
                      className="p-1 hover:bg-stone-200 rounded transition"
                    >
                      <ChevronRight className={cn("w-4 h-4 text-stone-400 transition-transform", isExpanded && "rotate-90")} />
                    </button>
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-semibold text-stone-900">{project.name}</div>
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium", getScoreColor(score))}>
                            {project.impact || 1}×{project.urgency || 1} = {score}
                          </span>
                          {project.strategic_value && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-purple-100 text-purple-700">
                              {project.strategic_value}
                            </span>
                          )}
                          {projectFeatures.length > 0 && (
                            <span>• {projectFeatures.length} features</span>
                          )}
                          {projectTasks.length > 0 && (
                            <span>• {projectProgress}% tasks</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                    <Badge value={project.status} />
                    {project.status !== "archived" && (
                      <Button variant="ghost" size="sm" onClick={() => archiveProject(project.id)} className="text-stone-400 hover:text-red-600">
                        Archivar
                      </Button>
                    )}
                  </div>
                </div>
                
                {renderProjectStatus(project)}
              </div>
              
              {/* FEATURES */}
              {isExpanded && projectFeatures.length > 0 && (
                <div className="bg-white">
                  {projectFeatures.sort((a, b) => ((b.impact || 1) * (b.urgency || 1)) - ((a.impact || 1) * (a.urgency || 1))).map(feature => {
                    const featureTasks = getTasksByFeature(feature.id)
                    const featureProgress = featureTasks.length > 0
                      ? Math.round((featureTasks.filter(t => t.status === "done").length / featureTasks.length) * 100)
                      : 0
                    const featureScore = (feature.impact || 1) * (feature.urgency || 1)
                    
                    return (
                      <div 
                        key={feature.id}
                        className="px-5 py-3 pl-16 hover:bg-stone-50 transition cursor-pointer border-l-4 border-transparent hover:border-amber-300"
                        onClick={() => setSelectedFeature(feature)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Folder className="w-4 h-4 text-amber-500" />
                            <div>
                              <div className="font-medium text-stone-800">{feature.name}</div>
                              <div className="flex items-center gap-2 text-xs text-stone-400">
                                <span className={cn("px-1 rounded text-[10px]", getScoreColor(featureScore))}>
                                  {feature.impact || 1}×{feature.urgency || 1}
                                </span>
                                {featureTasks.length > 0 && (
                                  <span>• {featureTasks.length} tareas ({featureProgress}%)</span>
                                )}
                                {feature.progress !== undefined && feature.progress > 0 && (
                                  <span>• progreso: {feature.progress}%</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge value={feature.status} />
                          </div>
                        </div>
                        
                        {feature.current_status && (
                          <div className="mt-1 text-xs text-amber-600 truncate">
                            ▶️ {feature.current_status}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
              
              {isExpanded && projectFeatures.length === 0 && (
                <div className="px-5 py-3 pl-16 text-xs text-stone-400 italic">
                  Sin features
                </div>
              )}
            </div>
          )
        })}
      </Card>

      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>Nuevo proyecto</DialogTitle>
        <div className="space-y-3">
          <Input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
          <Textarea placeholder="Descripcion" value={desc} onChange={e => setDesc(e.target.value)} />
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-500">Impact (1-5)</label>
              <Select value={impact.toString()} onChange={e => setImpact(parseInt(e.target.value))}>
                <option value="1">1 - Negligible</option>
                <option value="2">2 - Minor</option>
                <option value="3">3 - Moderate</option>
                <option value="4">4 - Significant</option>
                <option value="5">5 - Game-changer</option>
              </Select>
            </div>
            
            <div>
              <label className="text-xs text-stone-500">Urgency (1-5)</label>
              <Select value={urgency.toString()} onChange={e => setUrgency(parseInt(e.target.value))}>
                <option value="1">1 - Whenever</option>
                <option value="2">2 - This month</option>
                <option value="3">3 - This week</option>
                <option value="4">4 - Next 48h</option>
                <option value="5">5 - Today</option>
              </Select>
            </div>
          </div>
          
          <div>
            <label className="text-xs text-stone-500">Strategic Value</label>
            <Select value={strategicValue} onChange={e => setStrategicValue(e.target.value as any)}>
              <option value="core">Core</option>
              <option value="supporting">Supporting</option>
              <option value="experimental">Experimental</option>
            </Select>
          </div>
          
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShow(false)}>Cancelar</Button>
            <Button onClick={create}>Crear</Button>
          </div>
        </div>
      </Dialog>

      <ProjectDetailSheet 
        project={selectedProject}
        features={features}
        tasks={tasks}
        onClose={() => setSelectedProject(null)}
        onUpdate={refresh}
      />

      <FeatureDetailSheet
        feature={selectedFeature}
        project={selectedFeature ? projects.find(p => p.id === selectedFeature.project_id) || null : null}
        tasks={tasks}
        onClose={() => setSelectedFeature(null)}
        onUpdate={refresh}
      />
    </div>
  )
}
