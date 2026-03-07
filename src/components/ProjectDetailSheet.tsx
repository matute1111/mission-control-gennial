import { useState, useEffect } from "react"
import { Sheet } from "./Sheet"
import { Badge } from "./Badge"
import { Button } from "./Button"
import { Card } from "./Card"
import { Textarea } from "./Textarea"
import { supabase } from "@/lib/supabase"
import type { Project, Task, ProjectUpdate } from "@/types"
import { 
  ExternalLink, 
  Github, 
  FileText, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  Target,
  TrendingUp,
  Link as LinkIcon,
  Folder,
  FolderOpen,
  Edit3,
  Save,
  BookOpen,
  Map,
  Activity,
  Plus
} from "lucide-react"

interface ProjectDetailSheetProps {
  project: Project | null
  tasks: Task[]
  projects?: Project[]  // Todos los proyectos para mostrar jerarquía
  onClose: () => void
  onUpdate?: () => void
}

export function ProjectDetailSheet({ project, tasks, projects = [], onClose, onUpdate }: ProjectDetailSheetProps) {
  const [updates, setUpdates] = useState<ProjectUpdate[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [brief, setBrief] = useState(project?.brief || "")
  const [roadmap, setRoadmap] = useState(project?.roadmap || "")
  const [currentStatus, setCurrentStatus] = useState(project?.current_status || "")
  const [newUpdate, setNewUpdate] = useState("")
  const [updateType, setUpdateType] = useState<ProjectUpdate['update_type']>('progress')
  const [childProjects, setChildProjects] = useState<Project[]>([])

  // Encontrar proyecto padre si existe
  const parentProject = project?.parent_macro_id 
    ? projects.find(p => p.id === project.parent_macro_id)
    : null

  useEffect(() => {
    if (project) {
      setBrief(project.brief || "")
      setRoadmap(project.roadmap || "")
      setCurrentStatus(project.current_status || "")
      fetchUpdates()
      
      // Si es macro proyecto, obtener sus sub-proyectos
      if (project.is_macro === true) {
        const children = projects.filter(p => p.parent_macro_id === project.id)
        setChildProjects(children)
      } else {
        setChildProjects([])
      }
    }
  }, [project, projects])

  const fetchUpdates = async () => {
    if (!project) return
    const { data } = await supabase
      .from("project_updates")
      .select("*")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false })
    if (data) setUpdates(data)
  }

  const saveBrief = async () => {
    if (!project) return
    await supabase
      .from("projects")
      .update({ brief, roadmap, current_status: currentStatus })
      .eq("id", project.id)
    setIsEditing(false)
    onUpdate?.()
  }

  const addUpdate = async () => {
    if (!project || !newUpdate.trim()) return
    await supabase.from("project_updates").insert({
      project_id: project.id,
      update_type: updateType,
      content: newUpdate,
      created_by: "matias"
    })
    setNewUpdate("")
    fetchUpdates()
    onUpdate?.() // Refresca la lista de proyectos para mostrar el último update
  }

  if (!project) return null

  const projectTasks = tasks.filter(t => t.project_id === project.id)
  const completedTasks = projectTasks.filter(t => t.status === "done")
  const progress = projectTasks.length > 0 
    ? Math.round((completedTasks.length / projectTasks.length) * 100) 
    : 0

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A"
    return new Date(dateStr).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-700"
      case "archived": return "bg-stone-100 text-stone-700"
      case "cancelled": return "bg-red-100 text-red-700"
      default: return "bg-stone-100 text-stone-700"
    }
  }

  const getUpdateTypeColor = (type: string) => {
    switch (type) {
      case 'milestone': return 'bg-emerald-100 text-emerald-700'
      case 'blocker': return 'bg-red-100 text-red-700'
      case 'decision': return 'bg-blue-100 text-blue-700'
      case 'progress': return 'bg-amber-100 text-amber-700'
      case 'note': return 'bg-stone-100 text-stone-700'
      default: return 'bg-stone-100 text-stone-700'
    }
  }

  return (
    <Sheet open={!!project} onClose={onClose} title="📋 Brief del Proyecto">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Folder className="w-5 h-5 text-stone-400" />
              <h3 className="text-xl font-bold text-stone-900">{project.name}</h3>
            </div>
            <p className="text-sm text-stone-500">ID: {project.id.slice(0, 8)}...</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
            {project.status}
          </span>
        </div>

        {/* JERARQUÍA - Macro/Sub-proyectos */}
        {(parentProject || childProjects.length > 0) && (
          <Card className="bg-violet-50 border-violet-100">
            <div className="flex items-center gap-2 mb-3">
              <FolderOpen className="w-5 h-5 text-violet-600" />
              <h4 className="text-sm font-semibold text-violet-900">🗂️ Jerarquía</h4>
            </div>
            
            {/* Si es feature, mostrar macro padre */}
            {parentProject && (
              <div className="mb-3">
                <p className="text-xs text-violet-600 mb-1">Feature de:</p>
                <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-violet-200">
                  <FolderOpen className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium text-stone-800">{parentProject.name}</span>
                  <Badge value={parentProject.status} />
                </div>
              </div>
            )}
            
            {/* Si es macro, mostrar features */}
            {childProjects.length > 0 && (
              <div>
                <p className="text-xs text-violet-600 mb-1">Features ({childProjects.length}):</p>
                <div className="space-y-2">
                  {childProjects.map(child => {
                    const childTaskCount = tasks.filter(t => t.project_id === child.id).length
                    return (
                      <div key={child.id} className="flex items-center justify-between p-2 bg-white rounded-lg border border-violet-200">
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4 text-amber-500" />
                          <span className="text-sm text-stone-700">{child.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {childTaskCount > 0 && (
                            <span className="text-xs text-stone-400">{childTaskCount} tareas</span>
                          )}
                          <Badge value={child.status} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </Card>
        )}

        {/* BRIEF - Resumen General */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-900">📝 BRIEF - Resumen General</h4>
            </div>
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="p-1 hover:bg-blue-100 rounded transition"
            >
              {isEditing ? <Save className="w-4 h-4 text-blue-600" /> : <Edit3 className="w-4 h-4 text-blue-600" />}
            </button>
          </div>
          
          {isEditing ? (
            <div className="space-y-3">
              <Textarea 
                placeholder="Resumen general del proyecto..."
                value={brief}
                onChange={e => setBrief(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <Button size="sm" onClick={saveBrief} className="w-full">
                <Save className="w-4 h-4 mr-1" /> Guardar Brief
              </Button>
            </div>
          ) : (
            <p className="text-sm text-blue-800 whitespace-pre-wrap">
              {brief || "Sin brief aún. Edita para agregar el resumen general del proyecto."}
            </p>
          )}
        </Card>

        {/* ROADMAP - Qué va a pasar */}
        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-5 h-5 text-emerald-600" />
            <h4 className="text-sm font-semibold text-emerald-900">🗺️ ROADMAP - Qué va a pasar</h4>
          </div>
          
          {isEditing ? (
            <Textarea 
              placeholder="1. Fase 1: ...\n2. Fase 2: ...\n3. Fase 3: ..."
              value={roadmap}
              onChange={e => setRoadmap(e.target.value)}
              className="min-h-[100px] text-sm"
            />
          ) : (
            <div className="text-sm text-emerald-800 whitespace-pre-wrap">
              {roadmap ? (
                <div className="space-y-2">
                  {roadmap.split('\n').map((line, i) => line.trim() && (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{line.replace(/^[-•\d.)\s]+/, '')}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-emerald-600 italic">Sin roadmap definido. Edita para agregar el plan.</p>
              )}
            </div>
          )}
        </Card>

        {/* CURRENT STATUS - Qué se está haciendo ahora */}
        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <Activity className="w-5 h-5 text-amber-600" />
            <h4 className="text-sm font-semibold text-amber-900">▶️ ESTADO ACTUAL - Qué se está haciendo</h4>
          </div>
          
          {isEditing ? (
            <Textarea 
              placeholder="Ahora mismo estamos trabajando en..."
              value={currentStatus}
              onChange={e => setCurrentStatus(e.target.value)}
              className="min-h-[60px] text-sm"
            />
          ) : (
            <p className="text-sm text-amber-800 whitespace-pre-wrap">
              {currentStatus || "No hay estado actual definido. Edita para indicar qué se está haciendo ahora."}
            </p>
          )}
        </Card>

        {/* HISTORIAL - Qué se fue haciendo */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-500" />
              <h4 className="text-sm font-semibold text-stone-700">📜 HISTORIAL - Qué se fue haciendo</h4>
            </div>
            <span className="text-xs text-stone-400">{updates.length} actualizaciones</span>
          </div>

          {/* Agregar nueva actualización */}
          <div className="mb-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
            <div className="flex gap-2 mb-2">
              <select 
                value={updateType}
                onChange={e => setUpdateType(e.target.value as ProjectUpdate['update_type'])}
                className="text-xs border rounded px-2 py-1 bg-white"
              >
                <option value="progress">🟡 Progreso</option>
                <option value="milestone">🟢 Hitos</option>
                <option value="blocker">🔴 Bloqueo</option>
                <option value="decision">🔵 Decisión</option>
                <option value="note">⚪ Nota</option>
              </select>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newUpdate}
                onChange={e => setNewUpdate(e.target.value)}
                placeholder="Agregar actualización..."
                className="flex-1 text-sm border rounded px-3 py-2"
                onKeyDown={e => e.key === 'Enter' && addUpdate()}
              />
              <Button size="sm" onClick={addUpdate}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Lista de actualizaciones */}
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {updates.map(update => (
              <div key={update.id} className="flex items-start gap-3 p-3 bg-white border border-stone-100 rounded-lg">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getUpdateTypeColor(update.update_type)}`}>
                  {update.update_type}
                </span>
                <div className="flex-1">
                  <p className="text-sm text-stone-700">{update.content}</p>
                  <p className="text-xs text-stone-400 mt-1">
                    {formatDate(update.created_at)} • {update.created_by}
                  </p>
                </div>
              </div>
            ))}
            {updates.length === 0 && (
              <p className="text-center text-sm text-stone-400 py-4">
                Sin actualizaciones aún. Agrega la primera arriba.
              </p>
            )}
          </div>
        </div>

        {/* Progreso */}
        <Card>
          <h4 className="text-sm font-medium text-stone-700 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Progreso del Proyecto
          </h4>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-stone-600">Completado</span>
              <span className="font-medium text-stone-900">{progress}%</span>
            </div>
            <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-3 bg-stone-50 rounded-lg">
              <p className="text-2xl font-bold text-stone-900">{projectTasks.length}</p>
              <p className="text-xs text-stone-500">Tareas</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-700">{completedTasks.length}</p>
              <p className="text-xs text-emerald-600">Hechas</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-700">{projectTasks.filter(t => t.status === "blocked").length}</p>
              <p className="text-xs text-amber-600">Bloqueadas</p>
            </div>
          </div>
        </Card>

        {/* Links configurados */}
        {(project.github_url || project.vercel_url || project.docs_url) && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-3">🔗 Links del Proyecto</h4>
            <div className="grid grid-cols-1 gap-2">
              {project.github_url && (
                <a href={project.github_url} target="_blank" rel="noopener noreferrer" 
                   className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-lg hover:border-stone-300 transition">
                  <Github className="w-5 h-5 text-stone-700" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-700">GitHub</p>
                    <p className="text-xs text-stone-400 truncate">{project.github_url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-300" />
                </a>
              )}
              {project.vercel_url && (
                <a href={project.vercel_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-lg hover:border-stone-300 transition">
                  <ExternalLink className="w-5 h-5 text-black" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-700">Vercel</p>
                    <p className="text-xs text-stone-400 truncate">{project.vercel_url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-300" />
                </a>
              )}
              {project.docs_url && (
                <a href={project.docs_url} target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-lg hover:border-stone-300 transition">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-700">Documentación</p>
                    <p className="text-xs text-stone-400 truncate">{project.docs_url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-300" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Recursos y Herramientas */}
        <div className="pt-4 border-t border-stone-100">
          <h4 className="text-sm font-medium text-stone-700 mb-3">🛠️ Recursos y Herramientas</h4>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://github.com/matute1111"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition"
            >
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Supabase</span>
            </a>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Vercel</span>
            </a>
            <a
              href="https://my.blotato.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Blotato</span>
            </a>
          </div>
        </div>

        {/* API Keys */}
        <div className="pt-4 border-t border-stone-100">
          <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" />
            API Keys Guardadas
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-amber-800">Supabase</span>
                <span className="text-xs text-amber-600">(oculto)</span>
              </div>
              <a 
                href="https://supabase.com/dashboard/project/_/settings/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-amber-700 hover:underline"
              >
                Ver en Dashboard →
              </a>
            </div>
            <div className="flex items-center justify-between p-2 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-blue-800">Blotato</span>
                <span className="text-xs text-blue-600">(oculto)</span>
              </div>
              <a 
                href="https://my.blotato.com/settings"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-700 hover:underline"
              >
                Ver en Dashboard →
              </a>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            Las API keys se gestionan en los dashboards correspondientes por seguridad.
          </p>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4 border-t border-stone-100">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cerrar
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
