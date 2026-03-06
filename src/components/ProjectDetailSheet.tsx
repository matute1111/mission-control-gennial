import { Sheet } from "./Sheet"
import { Badge } from "./Badge"
import { Button } from "./Button"
import { Card } from "./Card"
import type { Project, Task } from "@/types"
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
  Folder
} from "lucide-react"

interface ProjectDetailSheetProps {
  project: Project | null
  tasks: Task[]
  onClose: () => void
}

export function ProjectDetailSheet({ project, tasks, onClose }: ProjectDetailSheetProps) {
  if (!project) return null

  const projectTasks = tasks.filter(t => t.project_id === project.id)
  const completedTasks = projectTasks.filter(t => t.status === "done")
  const progress = projectTasks.length > 0 
    ? Math.round((completedTasks.length / projectTasks.length) * 100) 
    : 0

  // Extraer URLs de la descripción
  const extractUrls = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return text?.match(urlRegex) || []
  }

  const urls = extractUrls(project.description || "")

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-100 text-emerald-700"
      case "archived": return "bg-stone-100 text-stone-700"
      case "cancelled": return "bg-red-100 text-red-700"
      default: return "bg-stone-100 text-stone-700"
    }
  }

  return (
    <Sheet open={!!project} onClose={onClose} title="Detalle de Proyecto">
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

        {/* Descripción */}
        {project.description && (
          <Card className="bg-stone-50">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-stone-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-stone-700 mb-2">Descripción</h4>
                <p className="text-sm text-stone-600 whitespace-pre-wrap">{project.description}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Links del proyecto */}
        {urls.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Links del Proyecto
            </h4>
            <div className="space-y-2">
              {urls.map((url, idx) => {
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
              <p className="text-xs text-stone-500">Tareas Total</p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-lg">
              <p className="text-2xl font-bold text-emerald-700">{completedTasks.length}</p>
              <p className="text-xs text-emerald-600">Completadas</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-lg">
              <p className="text-2xl font-bold text-amber-700">{projectTasks.filter(t => t.status === "blocked").length}</p>
              <p className="text-xs text-amber-600">Bloqueadas</p>
            </div>
          </div>
        </Card>

        {/* Lista de tareas */}
        {projectTasks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-stone-700 mb-3">Tareas del Proyecto</h4>
            <div className="space-y-2">
              {projectTasks.slice(0, 5).map(task => (
                <div 
                  key={task.id}
                  className="flex items-center justify-between p-3 bg-white border border-stone-100 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {task.status === "done" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : task.status === "blocked" ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <Target className="w-4 h-4 text-stone-400" />
                    )}
                    <span className={`text-sm ${task.status === "done" ? "text-stone-400 line-through" : "text-stone-700"}`}>
                      {task.title}
                    </span>
                  </div>
                  <Badge value={task.status} />
                </div>
              ))}
              {projectTasks.length > 5 && (
                <p className="text-xs text-stone-400 text-center py-2">
                  +{projectTasks.length - 5} tareas más...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="space-y-2 text-sm pt-4 border-t border-stone-100">
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Creado
            </span>
            <span className="text-stone-700">{formatDate(project.created_at)}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-stone-100">
            <span className="text-stone-500">Última actualización</span>
            <span className="text-stone-700">{formatDate(project.updated_at)}</span>
          </div>
        </div>

        {/* Links directos a recursos */}
        <div className="pt-4 border-t border-stone-100">
          <h4 className="text-sm font-medium text-stone-700 mb-3">Recursos Rápidos</h4>
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

        {/* Acciones */}
        <div className="flex gap-3 pt-4">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cerrar
          </Button>
        </div>
      </div>
    </Sheet>
  )
}
