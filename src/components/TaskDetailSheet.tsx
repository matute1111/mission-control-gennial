import { Sheet } from "./Sheet"
import { Badge } from "./Badge"
import { Button } from "./Button"
import { Card } from "./Card"
import type { Task, Project } from "@/types"
import { 
  ExternalLink, 
  Github, 
  FileText, 
  Clock, 
  User, 
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  Key
} from "lucide-react"

interface TaskDetailSheetProps {
  task: Task | null
  project: Project | null
  onClose: () => void
}

export function TaskDetailSheet({ task, project, onClose }: TaskDetailSheetProps) {
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

  return (
    <Sheet open={!!task} onClose={onClose} title="Detalle de Tarea">
      <div className="space-y-6">
        {/* Header con estado */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-stone-900">{task.title}</h3>
            {project && (
              <p className="text-sm text-stone-500 mt-1">
                Proyecto: <span className="font-medium text-stone-700">{project.name}</span>
              </p>
            )}
          </div>
          <Badge value={task.status} />
        </div>

        {/* Descripción */}
        {task.description && (
          <Card className="bg-stone-50">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-stone-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-stone-700 mb-2">Descripción</h4>
                <p className="text-sm text-stone-600 whitespace-pre-wrap">{task.description}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Links encontrados */}
        {allUrls.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Links del Proyecto
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

        {/* Resultado */}
        {task.result && (
          <Card className="bg-emerald-50 border-emerald-100">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-emerald-800 mb-2">Resultado</h4>
                <p className="text-sm text-emerald-700 whitespace-pre-wrap">{task.result}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Info de bloqueo */}
        {task.blocked_reason && (
          <Card className="bg-red-50 border-red-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800 mb-2">Motivo de Bloqueo</h4>
                <p className="text-sm text-red-700">{task.blocked_reason}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <div className="flex items-center gap-2 text-sm text-stone-500">
              <User className="w-4 h-4" />
              <span>Asignado a</span>
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

        {/* Links directos a recursos comunes */}
        <div className="pt-4 border-t border-stone-100">
          <h4 className="text-sm font-medium text-stone-700 mb-3">Recursos del Proyecto</h4>
          <div className="grid grid-cols-2 gap-2">
            <a
              href="https://github.com/matute1111/animania-audio-vision"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Animania</span>
            </a>
            <a
              href="https://github.com/matute1111/mission-control-gennial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition"
            >
              <Github className="w-4 h-4" />
              <span>GitHub Mission Control</span>
            </a>
            <a
              href="https://supabase.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition"
            >
              <Key className="w-4 h-4" />
              <span>Supabase Dashboard</span>
            </a>
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 text-sm text-stone-600 hover:bg-stone-50 rounded-lg transition"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Vercel Dashboard</span>
            </a>
          </div>
        </div>

        {/* API Keys (solo referencia, no los valores reales) */}
        <div className="pt-4 border-t border-stone-100">
          <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
            <Key className="w-4 h-4" />
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
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cerrar
          </Button>
          {task.status !== "done" && (
            <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700">
              Marcar Completado
            </Button>
          )}
        </div>
      </div>
    </Sheet>
  )
}
