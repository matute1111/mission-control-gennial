import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/Badge"
import { AssigneeBadge } from "@/components/AssigneeBadge"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Dialog, DialogTitle } from "@/components/Dialog"
import { Input } from "@/components/Input"
import { Textarea } from "@/components/Textarea"
import { Select } from "@/components/Select"
import { TaskDetailSheet } from "@/components/TaskDetailSheet"
import { cn, ago } from "@/lib/utils"
import type { Task, Feature, Project } from "@/types"
import { Plus, Loader2, Search, Undo2, Keyboard } from "lucide-react"

interface Props { tasks: Task[]; features: Feature[]; projects: Project[]; refresh: () => void }

export function Tasks({ tasks, features, projects, refresh }: Props) {
  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [featureId, setFeatureId] = useState("")
  const [impact, setImpact] = useState(3)
  const [urgency, setUrgency] = useState(3)
  const [assignee, setAssignee] = useState("kimi")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [confirmComplete, setConfirmComplete] = useState<string | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error', undo?: () => void} | null>(null)
  const [showShortcuts, setShowShortcuts] = useState(false)
  const [lastAction, setLastAction] = useState<{type: string, data: any, undo: () => void} | null>(null)

  const filtered = tasks.filter(t => {
    const matchesFilter = filter === "all" || t.status === filter
    const matchesSearch = !search || 
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
    return matchesFilter && matchesSearch
  })
  const tabs = ["all", "todo", "in_progress", "blocked", "done"]
  
  const getFeatureName = (id: string) => features.find(f => f.id === id)?.name || ""
  const getProjectName = (featureId: string) => {
    const feature = features.find(f => f.id === featureId)
    if (!feature) return ""
    return projects.find(p => p.id === feature.project_id)?.name || ""
  }

  const showToast = (message: string, type: 'success' | 'error' = 'success', undo?: () => void) => {
    setToast({ message, type, undo })
    setTimeout(() => setToast(null), 5000)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + K = focus search
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[placeholder*="Buscar"]')?.focus()
      }
      // Ctrl/Cmd + N = new task
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault()
        setShow(true)
      }
      // Ctrl/Cmd + / = show shortcuts
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        setShowShortcuts(true)
      }
      // Escape = close dialogs
      if (e.key === 'Escape') {
        if (show) setShow(false)
        if (confirmComplete) setConfirmComplete(null)
        if (selectedTask) setSelectedTask(null)
        if (showShortcuts) setShowShortcuts(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [show, confirmComplete, selectedTask, showShortcuts])

  const create = async () => {
    if (!title.trim()) return
    setLoading('create')
    try {
      await supabase.from("tasks").insert({
        title, 
        description: desc, 
        feature_id: featureId || null,
        impact,
        urgency,
        assigned_to: assignee, 
        status: "todo",
        created_by: "matias"
      })
      setTitle(""); setDesc(""); setFeatureId(""); setImpact(3); setUrgency(3); setAssignee("kimi"); setShow(false)
      showToast('Tarea creada exitosamente')
      refresh()
    } catch (e) {
      showToast('Error al crear tarea', 'error')
    } finally {
      setLoading(null)
    }
  }

  const claim = async (id: string) => {
    setLoading(`claim-${id}`)
    try {
      await supabase.from("tasks").update({ assigned_to: "matias", status: "in_progress" }).eq("id", id)
      showToast('Tarea asignada a ti')
      refresh()
    } catch (e) {
      showToast('Error al asignar tarea', 'error')
    } finally {
      setLoading(null)
    }
  }

  const complete = async (id: string) => {
    const task = tasks.find(t => t.id === id)
    if (!task) return
    
    setLoading(`complete-${id}`)
    try {
      await supabase.from("tasks").update({ status: "done" }).eq("id", id)
      
      // Store for undo
      const undo = async () => {
        await supabase.from("tasks").update({ status: task.status }).eq("id", id)
        showToast('Acción deshecha')
        refresh()
      }
      
      setLastAction({ type: 'complete', data: task, undo })
      showToast('Tarea completada', 'success', undo)
      refresh()
    } catch (e) {
      showToast('Error al completar tarea', 'error')
    } finally {
      setLoading(null)
      setConfirmComplete(null)
    }
  }

  const undoLastAction = useCallback(async () => {
    if (lastAction) {
      await lastAction.undo()
      setLastAction(null)
    }
  }, [lastAction])
  
  const getTaskScore = (t: Task) => (t.impact || 1) * (t.urgency || 1)
  
  const getScoreColor = (score: number) => {
    if (score >= 20) return 'text-red-600 bg-red-50'
    if (score >= 15) return 'text-orange-600 bg-orange-50'
    if (score >= 10) return 'text-amber-600 bg-amber-50'
    return 'text-stone-600 bg-stone-100'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-900">Tareas</h1>
        <Button onClick={() => setShow(true)}><Plus className="w-4 h-4 mr-1" /> Nueva</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 bg-stone-100 p-1 rounded-lg w-fit">
          {tabs.map(t => (
            <button key={t} onClick={() => setFilter(t)} className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition", filter === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700")}>
              {t === "all" ? "Todas" : t === "todo" ? "Por hacer" : t === "in_progress" ? "En progreso" : t === "blocked" ? "Bloqueadas" : "Hechas"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <Input 
              placeholder="Buscar tareas..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 w-full sm:w-64"
            />
          </div>
          {search && (
            <Button variant="ghost" size="sm" onClick={() => setSearch("")}>Limpiar</Button>
          )}
        </div>
      </div>

      <Card className="divide-y divide-stone-50">
        {filtered.sort((a, b) => getTaskScore(b) - getTaskScore(a)).map(t => (
          <div key={t.id} className="px-4 sm:px-5 py-3 hover:bg-stone-50 transition cursor-pointer" onClick={() => setSelectedTask(t)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="group relative">
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium cursor-help", getScoreColor(getTaskScore(t)))}>
                      {t.impact || 1}×{t.urgency || 1}
                    </span>
                    <div className="absolute hidden group-hover:block z-10 bg-stone-800 text-white text-[10px] rounded px-2 py-1 -top-7 left-0 whitespace-nowrap">
                      Impacto {t.impact || 1} × Urgencia {t.urgency || 1} = {getTaskScore(t)}
                    </div>
                  </div>
                  <span className="font-medium text-stone-900 truncate">{t.title}</span>
                </div>
                {t.description && <div className="text-xs text-stone-500 truncate mt-0.5">{t.description}</div>}
                <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                  <span>{getProjectName(t.feature_id)}</span>
                  <span>→</span>
                  <span>{getFeatureName(t.feature_id)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                <Badge value={t.status} />
                <AssigneeBadge assignedTo={t.assigned_to} assignedAgent={t.assigned_agent} />
                {t.status !== "done" && (
                  <>
                    {!t.assigned_to || t.assigned_to === "kimi" ? (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => claim(t.id)} 
                        disabled={loading === `claim-${t.id}`}
                        className="text-amber-600"
                      >
                        {loading === `claim-${t.id}` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : 'Tomar'}
                      </Button>
                    ) : null}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setConfirmComplete(t.id)} 
                      disabled={loading === `complete-${t.id}`}
                      className="text-emerald-600"
                    >
                      {loading === `complete-${t.id}` ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : 'Completar'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="px-4 sm:px-5 py-12 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-stone-600 font-medium mb-1">
              {search ? `No se encontraron tareas para "${search}"` : filter === 'all' ? 'No hay tareas aún' : `No hay tareas ${filter === 'todo' ? 'por hacer' : filter === 'in_progress' ? 'en progreso' : filter === 'blocked' ? 'bloqueadas' : 'hechas'}`}
            </p>
            <p className="text-sm text-stone-400 mb-4">
              {search 
                ? 'Prueba con otros términos de búsqueda' 
                : filter === 'all' 
                  ? 'Crea tu primera tarea para empezar' 
                  : 'Prueba con otro filtro o crea una nueva'}
            </p>
            {!search && <Button onClick={() => setShow(true)} size="sm"><Plus className="w-4 h-4 mr-1" /> Crear tarea</Button>}
          </div>
        )}
      </Card>

      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>Nueva tarea</DialogTitle>
        <div className="space-y-3">
          <Input placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Descripción" value={desc} onChange={e => setDesc(e.target.value)} />
          
          <Select value={featureId} onChange={e => setFeatureId(e.target.value)}>
            <option value="">Seleccionar feature</option>
            {features.map(f => (
              <option key={f.id} value={f.id}>
                {getProjectName(f.id)} → {f.name}
              </option>
            ))}
          </Select>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-stone-500">Impact (1-5)</label>
              <Select value={impact.toString()} onChange={e => setImpact(parseInt(e.target.value))}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Select>
            </div>
            <div>
              <label className="text-xs text-stone-500">Urgency (1-5)</label>
              <Select value={urgency.toString()} onChange={e => setUrgency(parseInt(e.target.value))}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </Select>
            </div>
          </div>
          
          <Select value={assignee} onChange={e => setAssignee(e.target.value)}>
            <option value="kimi">kimi</option>
            <option value="matias">matias</option>
            <option value="adrian">adrian</option>
          </Select>
          
          {!title.trim() && (
            <p className="text-xs text-red-500">El título es obligatorio</p>
          )}
          
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShow(false)}>Cancelar</Button>
            <Button onClick={create} disabled={!title.trim() || loading === 'create'}>
              {loading === 'create' ? (
                <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Creando...</>
              ) : 'Crear'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Confirmación para completar tarea */}
      <Dialog open={!!confirmComplete} onClose={() => setConfirmComplete(null)}>
        <DialogTitle>¿Completar tarea?</DialogTitle>
        <div className="space-y-4">
          <p className="text-sm text-stone-600">
            Esta acción marcará la tarea como completada. ¿Estás seguro?
          </p>
          <div className="flex gap-2 justify-end">
            <Button variant="ghost" onClick={() => setConfirmComplete(null)}>Cancelar</Button>
            <Button onClick={() => confirmComplete && complete(confirmComplete)} className="bg-emerald-600 hover:bg-emerald-700">
              {loading === `complete-${confirmComplete}` ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : 'Confirmar'}
            </Button>
          </div>
        </div>
      </Dialog>

      {/* Toast notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white text-sm z-50 animate-in fade-in slide-in-from-bottom-4 flex items-center gap-3 ${
          toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
        }`}>
          <span>{toast.message}</span>
          {toast.undo && (
            <button 
              onClick={() => { toast.undo?.(); setToast(null); }}
              className="flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
            >
              <Undo2 className="w-3 h-3" />
              Deshacer
            </button>
          )}
        </div>
      )}

      {/* Keyboard Shortcuts Dialog */}
      <Dialog open={showShortcuts} onClose={() => setShowShortcuts(false)}>
        <DialogTitle>Atajos de teclado</DialogTitle>
        <div className="space-y-3 py-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">Buscar tareas</span>
            <kbd className="px-2 py-1 bg-stone-100 rounded text-xs font-mono">Ctrl + K</kbd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">Nueva tarea</span>
            <kbd className="px-2 py-1 bg-stone-100 rounded text-xs font-mono">Ctrl + N</kbd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">Ver atajos</span>
            <kbd className="px-2 py-1 bg-stone-100 rounded text-xs font-mono">Ctrl + /</kbd>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600">Cerrar diálogo</span>
            <kbd className="px-2 py-1 bg-stone-100 rounded text-xs font-mono">Esc</kbd>
          </div>
          <div className="pt-2 border-t">
            <p className="text-xs text-stone-400">Los atajos funcionan en cualquier página</p>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button onClick={() => setShowShortcuts(false)}>Entendido</Button>
        </div>
      </Dialog>

      {/* Keyboard shortcut hint */}
      <button 
        onClick={() => setShowShortcuts(true)}
        className="fixed bottom-4 left-4 p-2 text-stone-400 hover:text-stone-600 bg-white border border-stone-200 rounded-full shadow-sm hover:shadow transition-all z-40"
        title="Ver atajos de teclado (Ctrl + /)"
      >
        <Keyboard className="w-4 h-4" />
      </button>

      <TaskDetailSheet task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  )
}
