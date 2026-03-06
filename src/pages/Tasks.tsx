import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Dialog, DialogTitle } from "@/components/Dialog"
import { Input } from "@/components/Input"
import { Textarea } from "@/components/Textarea"
import { Select } from "@/components/Select"
import { TaskDetailSheet } from "@/components/TaskDetailSheet"
import { cn, ago } from "@/lib/utils"
import type { Task, Project } from "@/types"
import { Plus } from "lucide-react"

interface Props { tasks: Task[]; projects: Project[]; refresh: () => void }

export function Tasks({ tasks, projects, refresh }: Props) {
  const [filter, setFilter] = useState("all")
  const [show, setShow] = useState(false)
  const [title, setTitle] = useState("")
  const [desc, setDesc] = useState("")
  const [projId, setProjId] = useState("")
  const [prio, setPrio] = useState("medium")
  const [assignee, setAssignee] = useState("kimi")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter)
  const tabs = ["all", "pending", "in_progress", "blocked", "review", "done"]
  const projName = (id: string) => projects.find(p => p.id === id)?.name || ""

  const create = async () => {
    if (!title.trim()) return
    await supabase.from("tasks").insert({
      title, description: desc, project_id: projId || null,
      priority: prio, assigned_to: assignee, created_by: "matias"
    })
    setTitle(""); setDesc(""); setProjId(""); setPrio("medium"); setAssignee("kimi"); setShow(false); refresh()
  }

  const claim = async (id: string) => {
    await supabase.from("tasks").update({ assigned_to: "matias", status: "in_progress" }).eq("id", id); refresh()
  }

  const complete = async (id: string) => {
    await supabase.from("tasks").update({ status: "done" }).eq("id", id); refresh()
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
            {t === "all" ? "Todas" : t.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <Card className="hidden sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 text-stone-500 text-xs">
              <th className="text-left px-5 py-3 font-medium">Tarea</th>
              <th className="text-left px-3 py-3 font-medium">Proyecto</th>
              <th className="text-left px-3 py-3 font-medium">Estado</th>
              <th className="text-left px-3 py-3 font-medium">Prioridad</th>
              <th className="text-left px-3 py-3 font-medium">Asignado</th>
              <th className="px-3 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-50">
            {filtered.map(t => (
              <tr 
                key={t.id} 
                className="hover:bg-stone-50 transition cursor-pointer"
                onClick={() => setSelectedTask(t)}
              >
                <td className="px-5 py-3">
                  <div className="font-medium text-stone-900">{t.title}</div>
                  {t.description && <div className="text-xs text-stone-500 mt-0.5 truncate max-w-xs">{t.description}</div>}
                  {t.blocked_reason && <div className="text-xs text-red-500 mt-0.5">{t.blocked_reason}</div>}
                </td>
                <td className="px-3 py-3 text-stone-500 text-xs">{projName(t.project_id)}</td>
                <td className="px-3 py-3"><Badge value={t.status} /></td>
                <td className="px-3 py-3"><Badge value={t.priority} /></td>
                <td className="px-3 py-3"><Badge value={t.assigned_to || "pending"} /></td>
                <td className="px-3 py-3 text-right space-x-1" onClick={e => e.stopPropagation()}>
                  {t.status === "pending" && <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => claim(t.id)}>Tomar</Button>}
                  {["pending", "in_progress", "review"].includes(t.status) && <Button variant="ghost" size="sm" className="text-emerald-600" onClick={() => complete(t.id)}>Completar</Button>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-stone-400">Sin tareas</td></tr>}
          </tbody>
        </table>
      </Card>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-3">
        {filtered.map(t => (
          <Card 
            key={t.id}
            className="p-4 cursor-pointer hover:bg-stone-50 transition"
            onClick={() => setSelectedTask(t)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="font-medium text-stone-900 flex-1 pr-2">{t.title}</div>
              <Badge value={t.status} />
            </div>
            {t.description && <div className="text-xs text-stone-500 mb-2 line-clamp-2">{t.description}</div>}
            {t.blocked_reason && <div className="text-xs text-red-500 mb-2">{t.blocked_reason}</div>}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-stone-500">{projName(t.project_id) || "Sin proyecto"}</span>
                <Badge value={t.priority} />
              </div>
              <span className="text-stone-400">{t.assigned_to || "pending"}</span>
            </div>
            <div className="flex gap-2 mt-3" onClick={e => e.stopPropagation()}>
              {t.status === "pending" && <Button variant="outline" size="sm" className="flex-1 text-blue-600" onClick={() => claim(t.id)}>Tomar</Button>}
              {["pending", "in_progress", "review"].includes(t.status) && <Button variant="outline" size="sm" className="flex-1 text-emerald-600" onClick={() => complete(t.id)}>Completar</Button>}
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-center text-stone-400 py-8">Sin tareas</div>}
      </div>

      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>Nueva tarea</DialogTitle>
        <div className="space-y-3">
          <Input placeholder="Titulo" value={title} onChange={e => setTitle(e.target.value)} />
          <Textarea placeholder="Descripcion" value={desc} onChange={e => setDesc(e.target.value)} />
          <Select value={projId} onChange={e => setProjId(e.target.value)}>
            <option value="">Sin proyecto</option>
            {projects.filter(p => p.status === "active").map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <div className="grid grid-cols-2 gap-3">
            <Select value={prio} onChange={e => setPrio(e.target.value)}>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </Select>
            <Select value={assignee} onChange={e => setAssignee(e.target.value)}>
              <option value="kimi">Kimi</option>
              <option value="matias">Matias</option>
              <option value="adrian">Adrian</option>
            </Select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShow(false)}>Cancelar</Button>
            <Button onClick={create}>Crear</Button>
          </div>
        </div>
      </Dialog>

      <TaskDetailSheet 
        task={selectedTask} 
        project={selectedTask ? projects.find(p => p.id === selectedTask.project_id) || null : null}
        onClose={() => setSelectedTask(null)} 
      />
    </div>
  )
}
