import { useState, useEffect } from "react"
import { Sheet } from "./Sheet"
import { Badge } from "./Badge"
import { AssigneeBadge } from "./AssigneeBadge"
import { Button } from "./Button"
import { Card } from "./Card"
import type { Task, Project, TaskUpdate } from "@/types"
import { supabase } from "@/lib/supabase"
import { 
  ExternalLink, 
  Github, 
  FileText, 
  Clock, 
  User, 
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Key,
  Cpu,
  Wrench,
  Clock3,
  FileCode,
  GitBranch,
  Globe,
  Bot,
  Terminal,
  Bug,
  Lightbulb,
  Layers,
  BookOpen,
  History,
  ArrowRight,
  Plus
} from "lucide-react"

interface TaskDetailSheetProps {
  task: Task | null
  project: Project | null
  onClose: () => void
}

export function TaskDetailSheet({ task, project, onClose }: TaskDetailSheetProps) {
  const [taskUpdates, setTaskUpdates] = useState<TaskUpdate[]>([])
  const [loadingUpdates, setLoadingUpdates] = useState(false)

  useEffect(() => {
    if (!task?.id) {
      setTaskUpdates([])
      return
    }
    setLoadingUpdates(true)
    supabase
      .from("task_updates")
      .select("*")
      .eq("task_id", task.id)
      .order("event_date", { ascending: true })
      .then(({ data }) => {
        setTaskUpdates(data || [])
        setLoadingUpdates(false)
      })
  }, [task?.id])

  if (!task) return null

  // Extraer URLs de la descripción o resultado
  const extractUrls = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text?.match(urlRegex) || []
  }

  const urls = extractUrls(task.description || "")
  const resultUrls = extractUrls(task.result || "")
  const allUrls = [...urls, ...resultUrls]

  // Detectar tipo de URL
  const getUrlType = (url: string) => {
    if (url.includes("github.com")) return { icon: Github, label: "GitHub", color: "text-gray-700" }
    if (url.includes("vercel.app") || url.includes("vercel.com")) return { icon: ExternalLink, label: "Vercel", color: "text-black" }
    if (url.includes("supabase.com")) return { icon: ExternalLink, label: "Supabase", color: "text-emerald-600" }
    if (url.includes("lovable.dev")) return { icon: ExternalLink, label: "Lovable", color: "text-purple-600" }
    if (url.includes("docs.google.com")) return { icon: FileText, label: "Documento", color: "text-blue-600" }
    return { icon: LinkIcon, label: "Link", color: "text-stone-600" }
  }

  // Formatear fecha
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

  // Formatear tiempo
  const formatTime = (minutes?: number) => {
    if (!minutes) return "N/A"
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  return (
    <Sheet open={!!task} onClose={onClose} title="📋 Detalle de Tarea">
      <div className="space-y-6">
        {/* Header con estado */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900">{task.title}</h3>
            {project && (
              <p className="text-sm text-stone-500 mt-1">
                Feature: <span className="font-medium text-stone-700">{project.name}</span>
              </p>
            )}
          </div>
          <Badge value={task.status} />
        </div>

        {/* TIMELINE DE SEGUIMIENTO */}
        {taskUpdates.length > 0 && (
          <Card className="bg-gradient-to-br from-sky-50 to-indigo-50 border-sky-200">
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-sky-600" />
              <h4 className="text-sm font-semibold text-sky-900">📅 Seguimiento</h4>
              <span className="ml-auto text-xs text-sky-500 bg-sky-100 px-2 py-0.5 rounded-full">
                {taskUpdates.length} {taskUpdates.length === 1 ? 'entrada' : 'entradas'}
              </span>
            </div>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-sky-200" />
              <div className="space-y-4">
                {taskUpdates.map((update, i) => (
                  <div key={update.id} className="relative flex gap-4">
                    {/* Dot */}
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                      i === taskUpdates.length - 1 
                        ? 'bg-sky-500 text-white' 
                        : 'bg-white border-2 border-sky-300 text-sky-500'
                    }`}>
                      <span className="text-[10px] font-bold">{i + 1}</span>
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-1">
                      <p className="text-xs text-sky-500 font-medium mb-0.5">
                        {new Date(update.event_date).toLocaleDateString("es-AR", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                        {" · "}
                        {new Date(update.event_date).toLocaleTimeString("es-AR", {
                          hour: "2-digit", minute: "2-digit"
                        })}
                        {update.created_by && (
                          <span className="ml-2 text-sky-400">por {update.created_by}</span>
                        )}
                      </p>
                      <p className="text-sm text-stone-800">{update.description}</p>
                      {update.outcome && (
                        <div className="flex items-start gap-1.5 mt-1">
                          <ArrowRight className="w-3 h-3 text-sky-400 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-sky-700 italic">{update.outcome}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        )}
        {loadingUpdates && (
          <div className="text-center py-2">
            <span className="text-xs text-stone-400">Cargando seguimiento...</span>
          </div>
        )}

        {/* INFO DE EJECUCIÓN - Quién lo hizo */}
        <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-100">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5 text-violet-600" />
            <h4 className="text-sm font-semibold text-violet-900">🤖 Agente de Ejecución</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {/* Quién lo hizo */}
            <div className="p-2 bg-white rounded-lg border border-violet-200">
              <p className="text-xs text-violet-600 mb-1">Encargado</p>
              <div className="mt-1">
                <AssigneeBadge assignedTo={task.assigned_to} assignedAgent={task.assigned_agent} size="md" />
              </div>
              {task.subagent_id && (
                <p className="text-xs text-stone-400 mt-1">ID: {task.subagent_id}</p>
              )}
            </div>
            
            {/* Perfil */}
            <div className="p-2 bg-white rounded-lg border border-violet-200">
              <p className="text-xs text-violet-600 mb-1">Perfil</p>
              <p className="text-sm font-medium text-stone-800">
                {task.agent_profile || "General"}
              </p>
            </div>
            
            {/* Modelo usado */}
            <div className="p-2 bg-white rounded-lg border border-violet-200">
              <p className="text-xs text-violet-600 mb-1">Modelo AI</p>
              <p className="text-sm font-medium text-stone-800">
                {task.model_used || "No especificado"}
              </p>
            </div>
            
            {/* Tiempo */}
            <div className="p-2 bg-white rounded-lg border border-violet-200">
              <p className="text-xs text-violet-600 mb-1">Tiempo</p>
              <p className="text-sm font-medium text-stone-800">
                {formatTime(task.time_spent_minutes)}
              </p>
            </div>
          </div>
        </Card>

        {/* Herramientas usadas */}
        {task.tools_used && task.tools_used.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
              <Wrench className="w-4 h-4" />
              🛠️ Herramientas Usadas
            </h4>
            <div className="flex flex-wrap gap-2">
              {task.tools_used.map((tool, i) => (
                <span key={i} className="px-2 py-1 bg-stone-100 text-stone-700 text-xs rounded-full">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Archivos modificados */}
        {task.files_modified && task.files_modified.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-2 flex items-center gap-2">
              <FileCode className="w-4 h-4" />
              📁 Archivos Modificados
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto bg-stone-50 rounded-lg p-2">
              {task.files_modified.map((file, i) => (
                <div key={i} className="text-xs text-stone-600 font-mono flex items-center gap-2">
                  <GitBranch className="w-3 h-3 text-stone-400" />
                  {file}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Descripción original */}
        {task.description && (
          <Card className="bg-stone-50">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-stone-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-stone-700 mb-2">📝 Descripción Original</h4>
                <p className="text-sm text-stone-600 whitespace-pre-wrap">{task.description}</p>
              </div>
            </div>
          </Card>
        )}

        {/* EXECUTION LOG - Qué se hizo */}
        {task.execution_log && (
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <div className="flex items-start gap-3">
              <Terminal className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-emerald-900 mb-2">⚡ Log de Ejecución</h4>
                <div className="text-sm text-emerald-800 whitespace-pre-wrap font-mono text-xs bg-white/50 p-3 rounded-lg">
                  {task.execution_log}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Detalles técnicos */}
        {task.technical_details && (
          <Card className="bg-blue-50 border-blue-100">
            <div className="flex items-start gap-3">
              <Cpu className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-2">🔧 Detalles Técnicos</h4>
                <p className="text-sm text-blue-800 whitespace-pre-wrap">{task.technical_details}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Bloqueantes y soluciones */}
        {(task.blockers_encountered || task.blocked_reason) && (
          <Card className="bg-red-50 border-red-100">
            <div className="flex items-start gap-3">
              <Bug className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-red-900 mb-2">🚧 Bloqueantes Encontrados</h4>
                <p className="text-sm text-red-800 whitespace-pre-wrap">
                  {task.blockers_encountered || task.blocked_reason}
                </p>
              </div>
            </div>
          </Card>
        )}

        {task.solution_applied && (
          <Card className="bg-amber-50 border-amber-100">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-amber-900 mb-2">💡 Solución Aplicada</h4>
                <p className="text-sm text-amber-800 whitespace-pre-wrap">{task.solution_applied}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Resultado */}
        {task.result && (
          <Card className="bg-emerald-50 border-emerald-100">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-emerald-900 mb-2">✅ Resultado</h4>
                <p className="text-sm text-emerald-800 whitespace-pre-wrap">{task.result}</p>
              </div>
            </div>
          </Card>
        )}

        {/* DEPLOYMENT STATUS */}
        {task.deployment_status && (
          <Card className={`
            ${task.deployment_status === 'deployed' ? 'bg-emerald-50 border-emerald-200' :
              task.deployment_status === 'partial' ? 'bg-amber-50 border-amber-200' :
              task.deployment_status === 'failed' ? 'bg-red-50 border-red-200' :
              task.deployment_status === 'pending' ? 'bg-blue-50 border-blue-200' :
              'bg-stone-50 border-stone-200'}
          `}>
            <div className="flex items-center gap-2 mb-2">
              <Globe className={`w-5 h-5 ${
                task.deployment_status === 'deployed' ? 'text-emerald-600' :
                task.deployment_status === 'partial' ? 'text-amber-600' :
                task.deployment_status === 'failed' ? 'text-red-600' :
                task.deployment_status === 'pending' ? 'text-blue-600' :
                'text-stone-600'
              }`} />
              <h4 className="text-sm font-semibold text-stone-900">🚀 Estado del Deployment</h4>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.deployment_status === 'deployed' ? 'bg-emerald-100 text-emerald-800' :
                task.deployment_status === 'partial' ? 'bg-amber-100 text-amber-800' :
                task.deployment_status === 'failed' ? 'bg-red-100 text-red-800' :
                task.deployment_status === 'pending' ? 'bg-blue-100 text-blue-800' :
                'bg-stone-100 text-stone-600'
              }`}>
                {task.deployment_status === 'deployed' ? '✅ Deployado' :
                 task.deployment_status === 'partial' ? '⚠️ Parcial' :
                 task.deployment_status === 'failed' ? '❌ Falló' :
                 task.deployment_status === 'pending' ? '⏳ Pendiente' :
                 '➖ No requerido'}
              </span>
              {task.deployment_url && (
                <a href={task.deployment_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                  Ver deploy →
                </a>
              )}
            </div>
          </Card>
        )}

        {/* PASOS EJECUTADOS - Cronología */}
        {task.steps_taken && task.steps_taken.length > 0 && (
          <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-indigo-600" />
              <h4 className="text-sm font-semibold text-indigo-900">📝 Pasos Ejecutados (Cronología)</h4>
            </div>
            <div className="space-y-2">
              {task.steps_taken.map((step, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full">
                    {i + 1}
                  </span>
                  <p className="text-sm text-indigo-800 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* DECISIONES TOMADAS */}
        {task.decisions_made && task.decisions_made.length > 0 && (
          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 border-cyan-100">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-cyan-600" />
              <h4 className="text-sm font-semibold text-cyan-900">💭 Decisiones Tomadas</h4>
            </div>
            <div className="space-y-2">
              {task.decisions_made.map((decision, i) => (
                <div key={i} className="flex items-start gap-2 p-2 bg-white/50 rounded-lg">
                  <span className="text-cyan-500 font-bold">•</span>
                  <p className="text-sm text-cyan-800">{decision}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* APRENDIZAJES */}
        {task.learnings && (
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-amber-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-amber-900 mb-2">📚 Aprendizajes</h4>
                <p className="text-sm text-amber-800 whitespace-pre-wrap">{task.learnings}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Links encontrados */}
        {allUrls.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              🔗 Links
            </h4>
            <div className="space-y-2">
              {allUrls.map((url, idx) => {
                const { icon: Icon, label, color } = getUrlType(url)
                return (
                  <a
                    key={idx}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-lg hover:border-stone-300 hover:bg-stone-50 transition group"
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-700">{label}</p>
                      <p className="text-xs text-stone-400 truncate">{url}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-stone-300 group-hover:text-stone-500" />
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* URLs específicas del task */}
        {(task.deployment_url || task.pr_url) && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              🚀 Deploys y PRs
            </h4>
            <div className="space-y-2">
              {task.deployment_url && (
                <a
                  href={task.deployment_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg hover:border-emerald-300 transition"
                >
                  <Globe className="w-5 h-5 text-emerald-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-emerald-800">Deployment</p>
                    <p className="text-xs text-emerald-600 truncate">{task.deployment_url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-emerald-400" />
                </a>
              )}
              {task.pr_url && (
                <a
                  href={task.pr_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-violet-50 border border-violet-200 rounded-lg hover:border-violet-300 transition"
                >
                  <GitBranch className="w-5 h-5 text-violet-600" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-violet-800">Pull Request</p>
                    <p className="text-xs text-violet-600 truncate">{task.pr_url}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-violet-400" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <User className="w-4 h-4" />
              <span>Asignado</span>
            </div>
            <p className="text-sm font-medium text-stone-900 mt-1">
              {task.assigned_to || "Sin asignar"}
            </p>
          </Card>
          
          <Card>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <Clock className="w-4 h-4" />
              <span>Prioridad</span>
            </div>
            <p className="text-sm font-medium text-stone-900 mt-1">
              <Badge value={task.priority} />
            </p>
          </Card>
        </div>

        {/* Fechas */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Creado</span>
            <span className="text-stone-700">{formatDate(task.created_at)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Última actualización</span>
            <span className="text-stone-700">{formatDate(task.updated_at)}</span>
          </div>
        </div>

        {/* Recursos */}
        <div className="pt-4 border-t border-stone-100">
          <h4 className="text-sm font-medium text-stone-700 mb-3">🛠️ Recursos del Proyecto</h4>
          <div className="grid grid-cols-2 gap-2">
            <a href="https://github.com/matute1111/animania-audio-vision" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition">
              <Github className="w-4 h-4" />
              <span>GitHub</span>
            </a>
            <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition">
              <Key className="w-4 h-4" />
              <span>Supabase</span>
            </a>
            <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition">
              <ExternalLink className="w-4 h-4" />
              <span>Vercel</span>
            </a>
          </div>
        </div>

        {/* API Keys */}
        <div className="pt-4 border-t border-stone-100">
          <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
            <Key className="w-4 h-4" />
            API Keys
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-amber-50 rounded-lg border border-amber-100">
              <span className="text-sm text-amber-800">Supabase</span>
              <a href="https://supabase.com/dashboard/project/_/settings/api" target="_blank" rel="noopener noreferrer" className="text-xs text-amber-700 hover:underline">Ver →</a>
            </div>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">Cerrar</Button>
          {task.status !== "done" && (
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">Marcar Completado</Button>
          )}
        </div>
      </div>
    </Sheet>
  )
}
