import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Dialog, DialogTitle } from "@/components/Dialog"
import { Input } from "@/components/Input"
import { Textarea } from "@/components/Textarea"
import { Select } from "@/components/Select"
import { cn, ago } from "@/lib/utils"
import type { Project } from "@/types"
import { Plus } from "lucide-react"

interface Props { projects: Project[]; refresh: () => void }

export function Projects({ projects, refresh }: Props) {
  const [filter, setFilter] = useState("all")
  const [show, setShow] = useState(false)
  const [name, setName] = useState("")
  const [desc, setDesc] = useState("")
  const [prio, setPrio] = useState("medium")

  const filtered = filter === "all" ? projects : projects.filter(p => p.status === filter)
  const tabs = ["all", "active", "paused", "done", "cancelled"]

  const create = async () => {
    if (!name.trim()) return
    await supabase.from("projects").insert({ name, description: desc, priority: prio, created_by: "matias" })
    setName(""); setDesc(""); setPrio("medium"); setShow(false); refresh()
  }

  const complete = async (id: string) => {
    await supabase.from("projects").update({ status: "done" }).eq("id", id); refresh()
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

      <Card className="divide-y divide-stone-50">
        {filtered.map(p => (
          <div key={p.id} className="px-5 py-3 flex items-center justify-between hover:bg-stone-50 transition">
            <div>
              <div className="font-medium text-stone-900">{p.name}</div>
              {p.description && <div className="text-xs text-stone-500 truncate max-w-md mt-0.5">{p.description}</div>}
            </div>
            <div className="flex items-center gap-2">
              <Badge value={p.status} />
              <Badge value={p.priority} />
              <span className="text-[10px] text-stone-400 font-mono">{ago(p.created_at)}</span>
              {p.status === "active" && (
                <Button variant="ghost" size="sm" onClick={() => complete(p.id)} className="text-emerald-600">Completar</Button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="px-5 py-8 text-center text-stone-400 text-sm">Sin proyectos</div>}
      </Card>

      <Dialog open={show} onClose={() => setShow(false)}>
        <DialogTitle>Nuevo proyecto</DialogTitle>
        <div className="space-y-3">
          <Input placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} />
          <Textarea placeholder="Descripcion" value={desc} onChange={e => setDesc(e.target.value)} />
          <Select value={prio} onChange={e => setPrio(e.target.value)}>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Select>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="ghost" onClick={() => setShow(false)}>Cancelar</Button>
            <Button onClick={create}>Crear</Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
