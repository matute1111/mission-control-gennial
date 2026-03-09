import { useState, useEffect } from "react"
import { Sheet } from "./Sheet"
import { Badge } from "./Badge"
import { Button } from "./Button"
import { Card } from "./Card"
import { Textarea } from "./Textarea"
import { Input } from "./Input"
import { supabase } from "@/lib/supabase"
import type { Feature, Task, FeatureUpdate, Project } from "@/types"
import { 
  Folder, 
  CheckCircle2,
  AlertCircle,
  Target,
  TrendingUp,
  Clock,
  Activity,
  Plus,
  Edit3,
  Save,
  CheckSquare,
  ChevronRight,
  Link as LinkIcon
} from "lucide-react"

interface FeatureDetailSheetProps {
  feature: Feature | null
  project: Project | null
  tasks: Task[]
  onClose: () => void
  onUpdate?: () => void
}

export function FeatureDetailSheet({ feature, project, tasks, onClose, onUpdate }: FeatureDetailSheetProps) {
  const [updates, setUpdates] = useState<FeatureUpdate[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [description, setDescription] = useState(feature?.description || "")
  const [currentStatus, setCurrentStatus] = useState(feature?.current_status || "")
  const [newUpdate, setNewUpdate] = useState("")
  const [updateType, setUpdateType] = useState<FeatureUpdate['update_type']>('progress')
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'updates'>('overview')

  // Get tasks for this feature
  const featureTasks = feature 
    ? tasks.filter(t => t.feature_id === feature.id && !t.archived_at)
    : []

  const completedTasks = featureTasks.filter(t => t.status === 'done').length
  const progress = featureTasks.length > 0 
    ? Math.round((completedTasks / featureTasks.length) * 100)
    : feature?.progress || 0

  useEffect(() => {
    if (feature) {
      setDescription(feature.description || "")
      setCurrentStatus(feature.current_status || "")
      fetchUpdates()
    }
  }, [feature])

  const fetchUpdates = async () => {
    if (!feature) return
    const { data } = await supabase
      .from("feature_updates")
      .select("*")
      .eq("feature_id", feature.id)
      .order("created_at", { ascending: false })
    if (data) setUpdates(data)
  }

  const saveFeature = async () => {
    if (!feature) return
    await supabase
      .from("features")
      .update({ 
        description, 
        current_status: currentStatus,
        updated_at: new Date().toISOString()
      })
      .eq("id", feature.id)
    setIsEditing(false)
    onUpdate?.()
  }

  const addUpdate = async () => {
    if (!feature || !newUpdate.trim()) return
    await supabase.from("feature_updates").insert({
      feature_id: feature.id,
      update_type: updateType,
      content: newUpdate,
      created_by: "matias"
    })
    setNewUpdate("")
    fetchUpdates()
    onUpdate?.()
  }

  const getScore = () => (feature?.impact || 1) * (feature?.urgency || 1)

  const getScoreColor = (score: number) => {
    if (score >= 20) return 'text-red-600 bg-red-50'
    if (score >= 15) return 'text-orange-600 bg-orange-50'
    if (score >= 10) return 'text-amber-600 bg-amber-50'
    return 'text-stone-600 bg-stone-100'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
      case 'in_progress': return <Activity className="w-4 h-4 text-blue-500" />
      case 'blocked': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-stone-400" />
    }
  }

  if (!feature) return null

  return (
    <Sheet open={!!feature} onClose={onClose} title={feature.name}>
      <div className="space-y-6">
        {/* Header Info */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Folder className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-stone-500">
                {project?.name || 'Proyecto no encontrado'}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge value={feature.status} />
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getScoreColor(getScore())}`}>
                Impact×Urgency: {feature.impact || 1}×{feature.urgency || 1} = {getScore()}
              </span>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => isEditing ? saveFeature() : setIsEditing(true)}
            className="flex items-center gap-1"
          >
            {isEditing ? <><Save className="w-4 h-4" /> Guardar</> : <><Edit3 className="w-4 h-4" /> Editar</>}
          </Button>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-stone-500">Progreso</span>
            <span className="font-medium text-stone-900">{progress}%</span>
          </div>
          <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-stone-400 mt-1">
            <span>{completedTasks} de {featureTasks.length} tareas completadas</span>
            {feature.start_date && (
              <span>Inicio: {new Date(feature.start_date).toLocaleDateString('es-AR')}</span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-stone-200">
          {[
            { key: 'overview', label: 'Visión General', icon: Target },
            { key: 'tasks', label: `Tareas (${featureTasks.length})`, icon: CheckSquare },
            { key: 'updates', label: `Updates (${updates.length})`, icon: Activity },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition border-b-2 -mb-px ${
                activeTab === tab.key 
                  ? 'border-amber-500 text-amber-600' 
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase">Descripción</label>
              {isEditing ? (
                <Textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              ) : (
                <p className="text-sm text-stone-700 mt-1">
                  {feature.description || 'Sin descripción'}
                </p>
              )}
            </div>

            {/* Current Status */}
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase">Estado Actual</label>
              {isEditing ? (
                <Textarea 
                  value={currentStatus} 
                  onChange={e => setCurrentStatus(e.target.value)}
                  className="mt-1"
                  rows={2}
                  placeholder="¿Qué está pasando ahora?"
                />
              ) : (
                <div className="mt-1">
                  {feature.current_status ? (
                    <p className="text-sm text-amber-700 bg-amber-50 p-2 rounded">
                      ▶️ {feature.current_status}
                    </p>
                  ) : (
                    <p className="text-sm text-stone-400 italic">Sin estado actual</p>
                  )}
                </div>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-stone-500 uppercase">Fecha Inicio</label>
                <p className="text-sm text-stone-700 mt-1">
                  {feature.start_date 
                    ? new Date(feature.start_date).toLocaleDateString('es-AR')
                    : 'No definida'
                  }
                </p>
              </div>
              <div>
                <label className="text-xs font-medium text-stone-500 uppercase">Fecha Objetivo</label>
                <p className="text-sm text-stone-700 mt-1">
                  {feature.target_end_date 
                    ? new Date(feature.target_end_date).toLocaleDateString('es-AR')
                    : 'No definida'
                  }
                </p>
              </div>
            </div>

            {/* URLs */}
            {(feature.github_url || feature.vercel_url || feature.supabase_url) && (
              <div>
                <label className="text-xs font-medium text-stone-500 uppercase">Links</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {feature.github_url && (
                    <a href={feature.github_url} target="_blank" rel="noopener" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      <LinkIcon className="w-3 h-3" /> GitHub
                    </a>
                  )}
                  {feature.vercel_url && (
                    <a href={feature.vercel_url} target="_blank" rel="noopener" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      <LinkIcon className="w-3 h-3" /> Vercel
                    </a>
                  )}
                  {feature.supabase_url && (
                    <a href={feature.supabase_url} target="_blank" rel="noopener" className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                      <LinkIcon className="w-3 h-3" /> Supabase
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-2">
            {featureTasks.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8">Sin tareas</p>
            ) : (
              featureTasks.sort((a, b) => ((b.impact || 1) * (b.urgency || 1)) - ((a.impact || 1) * (a.urgency || 1))).map(task => (
                <div 
                  key={task.id}
                  className="flex items-center gap-3 p-3 bg-stone-50 rounded-lg hover:bg-stone-100 transition"
                >
                  {getStatusIcon(task.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900 truncate">{task.title}</p>
                    <p className="text-xs text-stone-500">
                      {task.status} • Score: {(task.impact || 1) * (task.urgency || 1)}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-300" />
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-4">
            {/* Add Update */}
            <div className="bg-stone-50 p-3 rounded-lg">
              <label className="text-xs font-medium text-stone-500 uppercase">Nuevo Update</label>
              <div className="flex gap-2 mt-2">
                <select 
                  value={updateType}
                  onChange={e => setUpdateType(e.target.value as any)}
                  className="text-sm border border-stone-200 rounded px-2 py-1"
                >
                  <option value="progress">Progreso</option>
                  <option value="milestone">Milestone</option>
                  <option value="blocker">Bloqueo</option>
                  <option value="note">Nota</option>
                </select>
              </div>
              <Textarea 
                value={newUpdate}
                onChange={e => setNewUpdate(e.target.value)}
                placeholder="¿Qué pasó?"
                className="mt-2 text-sm"
                rows={2}
              />
              <Button 
                size="sm" 
                onClick={addUpdate}
                className="mt-2"
                disabled={!newUpdate.trim()}
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
            </div>

            {/* Updates List */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {updates.length === 0 ? (
                <p className="text-sm text-stone-400 text-center py-4">Sin updates</p>
              ) : (
                updates.map(update => (
                  <div key={update.id} className="p-3 border-l-2 border-stone-200 hover:border-amber-300 transition">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge value={update.update_type} />
                      <span className="text-xs text-stone-400">
                        {new Date(update.created_at).toLocaleDateString('es-AR')}
                      </span>
                    </div>
                    <p className="text-sm text-stone-700">{update.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Sheet>
  )
}
