import { useState } from "react"
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
import { Plus } from "lucide-react"

interface Props { tasks: Task[]; features: Feature[]; projects: Project[]; refresh: () => void }

export function Tasks({ tasks, features, projects, refresh }: Props) {
  const [filter, setFilter] = useState("all")
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [featureId, setFeatureId] = useState("")
  const [impact, setImpact] = useState(3)
  const [urgency, setUrgency] = useState(3)
  const [assignee, setAssignee] = useState("kimi")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter)
  const tabs = ["all", "todo", "in_progress", "blocked", "done"]
  
  const getFeatureName = (id: string) => features.find(f => f.id === id)?.name || ""
  const getProjectName = (featureId: string) => {
    const feature = features.find(f => f.id === featureId)
    if (!feature) return ""
    return projects.find(p => p.id === feature.project_id)?.name || ""
  }

  const create = async () => {
    if (!title.trim()) return
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
    setTitle(""); setDesc(""); setFeatureId(""); setImpact(3); setUrgency(3); setAssignee("kimi"); setShow(false); refresh()
  }

  const claim = async (id: string) => {
    await supabase.from("tasks").update({ assigned_to: "matias", status: "in_progress" }).eq("id", id); refresh()
  }

  const complete = async (id: string) => {
    await supabase.from("tasks").update({ status: "done" }).eq("id", id); refresh()
  }
  
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

      <div className="flex gap-1 bg-stone-100 p-1 rounded-lg w-fit">
        {tabs.map(t => (
          <button key={t} onClick={() => setFilter(t)} className={cn("px-3 py-1.5 rounded-md text-xs font-medium transition", filter === t ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700")}>
            {t === "all" ? "Todas" : t}
          </button>
        ))}
      </div>

      <Card className="divide-y divide-stone-50">
        {filtered.sort((a, b) => getTaskScore(b) - getTaskScore(a)).map(t => (
          <div key={t.id} className="px-4 sm:px-5 py-3 hover:bg-stone-50 transition cursor-pointer" onClick={() => setSelectedTask(t)}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-medium", getScoreColor(getTaskScore(t)))}>
                    {t.impact || 1}×{t.urgency || 1}
                  </span>
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
                <AssigneeBadge name={t.assigned_to} />
                {t.status !== "done" && (
                  <>
                    {!t.assigned_to || t.assigned_to === "kimi" ? (
                      <Button variant="ghost" size="sm" onClick={() => claim(t.id)} className="text-amber-600">Tomar</Button>
                    ) : null}
                    <Button variant="ghost" size="sm" onClick={() => complete(t.id)} className="text-emerald-600">Completar</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="px-4 sm:px-5 py-8 text-center text-stone-400 text-sm">Sin tareas</div>}
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
          
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShow(false)}>Cancelar</Button>
            <Button onClick={create}>Crear</Button>
          </div>
        </div>
      </Dialog>

      <TaskDetailSheet task={selectedTask} onClose={() => setSelectedTask(null)} />
    </div>
  )
}
