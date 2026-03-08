import { useState, useEffect } from "react"
import { Sheet } from "./Sheet"
import { Badge } from "./Badge"
import { AssigneeBadge } from "./AssigneeBadge"
import { Button } from "./Button"
import { Card } from "./Card"
import type { Task, Feature, TaskUpdate } from "@/types"
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
  onClose: () => void
}

export function TaskDetailSheet({ task, onClose }: TaskDetailSheetProps) {
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
      .order("created_at", { ascending: true })
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

  const priorityScore = (task.impact || 1) * (task.urgency || 1)

  return (
    <Sheet open={!!task} onClose={onClose} title="📋 Detalle de Tarea">
      <div className="space-y-6">
        {/* Header con estado y prioridad */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900">{task.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                priorityScore >= 20 ? 'bg-red-100 text-red-700' :
                priorityScore >= 15 ? 'bg-orange-100 text-orange-700' :
                priorityScore >= 10 ? 'bg-amber-100 text-amber-700' :
                'bg-stone-100 text-stone-600'
              }`}>
                {task.impact || 1}×{task.urgency || 1} = {priorityScore}
              </span>
              <Badge value={task.status} />
            </div>
          </div>
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
              <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-sky-200" />
              <div className="space-y-4">
                {taskUpdates.map((update, i) => (
                  <div key={update.id} className="relative flex gap-4">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                      i === taskUpdates.length - 1 
                        ? 'bg-sky-500 text-white' 
                        : 'bg-white border-2 border-sky-300 text-sky-500'
                    }`}>
                      <span className="text-[10px] font-bold">{i + 1}</span>
                    </div>
                    <div className="flex-1 pb-1">
                      <p className="text-xs text-sky-500 font-medium mb-0.5">
                        {new Date(update.created_at).toLocaleDateString("es-AR", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                        {" · "}
                        {new Date(update.created_at).toLocaleTimeString("es-AR", {
                          hour: "2-digit", minute: "2-digit"
                        })}
                        {update.created_by && (
                          <span className="ml-2 text-sky-400">por {update.created_by}</span>
                        )}
                      </p>
                      <p className="text-sm text-stone-800">{update.content}</p>
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
            <div className="p-2 bg-white rounded-lg border border-violet-200">
              <p className="text-xs text-violet-600 mb-1">Encargado</p>
              <div className="mt-1">
                <AssigneeBadge assignedTo={task.assigned_to} assignedAgent={task.assigned_agent} size="md" />
              </div>
            </div>
            
            <div className="p-2 bg-white rounded-lg border border-violet-200">
              <p className="text-xs text-violet-600 mb-1">Perfil</p>
              <p className="text-sm font-medium text-stone-700 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-violet-500" />
                {task.agent_profile || "General"}
              </p>
            </div>
            
            {task.model_used && (
              <div className="p-2 bg-white rounded-lg border border-violet-200">
                <p className="text-xs text-violet-600 mb-1">Modelo AI</p>
                <p className="text-sm font-medium text-stone-700">{task.model_used}</p>
              </div>
            )}
            
            <div className="p-2 bg-white rounded-lg border border-violet-200">
              <p className="text-xs text-violet-600 mb-1">Tiempo</p>
              <p className="text-sm font-medium text-stone-700 flex items-center gap-1">
                <Clock3 className="w-3 h-3 text-violet-500" />
                {formatTime(task.time_spent_minutes)}
              </p>
            </div>
          </div>
        </Card>

        {/* HERRAMIENTAS Y FILES */}
        {(task.tools_used?.length || task.files_modified?.length) && (
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-5 h-5 text-amber-600" />
              <h4 className="text-sm font-semibold text-amber-900">🛠️ Herramientas y Archivos</h4>
            </div>
            
            {task.tools_used?.length ? (
              <div className="mb-3">
                <p className="text-xs text-amber-600 mb-1">Herramientas utilizadas</p>
                <div className="flex flex-wrap gap-1.5">
                  {task.tools_used.map((tool, i) => (
                    <span key={i} className="text-xs px-2 py-1 bg-white rounded border border-amber-200 text-amber-700">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            
            {task.files_modified?.length ? (
              <div>
                <p className="text-xs text-amber-600 mb-1">Archivos modificados</p>
                <div className="space-y-1">
                  {task.files_modified.map((file, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-stone-600">
                      <FileCode className="w-3 h-3 text-amber-500 flex-shrink-0" />
                      <span className="font-mono truncate">{file}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </Card>
        )}

        {/* RESULTADO */}
        {task.result && (
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h4 className="text-sm font-semibold text-emerald-900">✅ Resultado</h4>
            </div>
            <p className="text-sm text-emerald-800 whitespace-pre-wrap">{task.result}</p>
          </Card>
        )}

        {/* BLOQUEOS Y SOLUCIONES */}
        {task.blockers_encountered && (
          <Card className="bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <h4 className="text-sm font-semibold text-red-900">🚧 Bloqueos Encontrados</h4>
            </div>
            <p className="text-sm text-red-800 whitespace-pre-wrap">{task.blockers_encountered}</p>
            
            {task.solution_applied && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-xs text-red-600 mb-1">✓ Solución aplicada</p>
                <p className="text-sm text-emerald-700">{task.solution_applied}</p>
              </div>
            )}
          </Card>
        )}

        {/* DECISIONES Y APRENDIZAJES */}
        {(task.decisions_made || task.learnings) && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h4 className="text-sm font-semibold text-blue-900">📚 Decisiones y Aprendizajes</h4>
            </div>
            
            {task.decisions_made && (
              <div className="mb-3">
                <p className="text-xs text-blue-600 mb-1">Decisiones tomadas</p>
                <p className="text-sm text-blue-800">{task.decisions_made}</p>
              </div>
            )}
            
            {task.learnings && (
              <div className="pt-3 border-t border-blue-200">
                <p className="text-xs text-blue-600 mb-1">💡 Aprendizajes</p>
                <p className="text-sm text-blue-800">{task.learnings}</p>
              </div>
            )}
          </Card>
        )}

        {/* PASOS EJECUTADOS */}
        {task.steps_taken?.length ? (
          <Card className="bg-gradient-to-br from-stone-50 to-gray-50 border-stone-200">
            <div className="flex items-center gap-2 mb-3">
              <Layers className="w-5 h-5 text-stone-600" />
              <h4 className="text-sm font-semibold text-stone-900">📋 Pasos Ejecutados</h4>
            </div>
            <div className="space-y-2">
              {task.steps_taken.map((step: string, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-stone-200 text-stone-600 text-xs flex items-center justify-center font-medium">
                    {i + 1}
                  </span>
                  <p className="text-sm text-stone-700">{step}</p>
                </div>
              ))}
            </div>
          </Card>
        ) : null}

        {/* DESCRIPCIÓN ORIGINAL */}
        {task.description && (
          <Card>
            <h4 className="text-sm font-medium text-stone-700 mb-3">📝 Descripción Original</h4>
            <p className="text-sm text-stone-600 whitespace-pre-wrap">{task.description}</p>
          </Card>
        )}

        {/* LINKS DETECTADOS */}
        {allUrls.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-3">🔗 Links Detectados</h4>
            <div className="space-y-2">
              {allUrls.map((url, i) => {
                const { icon: Icon, label, color } = getUrlType(url)
                return (
                  <a
                    key={i}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-white border border-stone-200 rounded-lg hover:border-stone-300 transition"
                  >
                    <Icon className={`w-5 h-5 ${color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-stone-700">{label}</p>
                      <p className="text-xs text-stone-400 truncate">{url}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-stone-300" />
                  </a>
                )
              })}
            </div>
          </div>
        )}

        {/* METADATA */}
        <div className="pt-4 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <div className="flex items-center gap-4">
              <span>ID: {task.id.slice(0, 8)}...</span>
              <span>Creado: {formatDate(task.created_at)}</span>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </Sheet>
  )
}
