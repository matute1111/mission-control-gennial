#!/usr/bin/env python3
"""Generate all Mission Control React components."""
import os

SRC = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src")
COMP = os.path.join(SRC, "components")
PAGES = os.path.join(SRC, "pages")

os.makedirs(COMP, exist_ok=True)
os.makedirs(PAGES, exist_ok=True)

# ─── Badge Component (shadcn-style) ───
open(os.path.join(COMP, "Badge.tsx"), "w").write('''import { cn } from "@/lib/utils"
import { STATUS_COLORS } from "@/types"

interface BadgeProps {
  value: string
  className?: string
}

export function Badge({ value, className }: BadgeProps) {
  const color = STATUS_COLORS[value] || "bg-stone-100 text-stone-600"
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", color, className)}>
      {value}
    </span>
  )
}
''')

# ─── Button Component (shadcn-style) ───
open(os.path.join(COMP, "Button.tsx"), "w").write('''import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "icon"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50"
    const variants: Record<string, string> = {
      default: "bg-stone-900 text-white hover:bg-stone-800",
      outline: "border border-stone-200 bg-white hover:bg-stone-50 text-stone-800",
      ghost: "hover:bg-stone-100 text-stone-600",
      destructive: "bg-red-100 text-red-700 hover:bg-red-200",
    }
    const sizes: Record<string, string> = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      icon: "h-8 w-8",
    }
    return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  }
)
Button.displayName = "Button"
''')

# ─── Card Component (shadcn-style) ───
open(os.path.join(COMP, "Card.tsx"), "w").write('''import { cn } from "@/lib/utils"
import { HTMLAttributes } from "react"

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("bg-white rounded-xl border border-stone-200 shadow-sm", className)} {...props} />
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4 border-b border-stone-100", className)} {...props} />
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 py-4", className)} {...props} />
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-semibold text-sm text-stone-800", className)} {...props} />
}
''')

# ─── Dialog Component (shadcn-style) ───
open(os.path.join(COMP, "Dialog.tsx"), "w").write('''import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface DialogProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function Dialog({ open, onClose, children }: DialogProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}

export function DialogTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn("font-bold text-lg mb-4", className)} {...props} />
}
''')

# ─── Input Component (shadcn-style) ───
open(os.path.join(COMP, "Input.tsx"), "w").write('''import { cn } from "@/lib/utils"
import { InputHTMLAttributes, forwardRef } from "react"

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400", className)}
      {...props}
    />
  )
)
Input.displayName = "Input"
''')

# ─── Select Component ───
open(os.path.join(COMP, "Select.tsx"), "w").write('''import { cn } from "@/lib/utils"
import { SelectHTMLAttributes, forwardRef } from "react"

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400", className)}
      {...props}
    />
  )
)
Select.displayName = "Select"
''')

# ─── Textarea Component ───
open(os.path.join(COMP, "Textarea.tsx"), "w").write('''import { cn } from "@/lib/utils"
import { TextareaHTMLAttributes, forwardRef } from "react"

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 h-20 resize-none", className)}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"
''')

# ─── Sidebar ───
open(os.path.join(COMP, "Sidebar.tsx"), "w").write('''import { cn } from "@/lib/utils"
import type { Page, User } from "@/types"
import { LayoutDashboard, FolderKanban, CheckSquare, MessageCircle, Activity, LogOut } from "lucide-react"

interface SidebarProps {
  page: Page
  setPage: (p: Page) => void
  user: User
  counts: { projects: number; tasks: number; proposals: number }
  onLogout: () => void
}

const NAV: { key: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Proyectos", icon: FolderKanban },
  { key: "tasks", label: "Tareas", icon: CheckSquare },
  { key: "proposals", label: "Proposals", icon: MessageCircle },
  { key: "activity", label: "Actividad", icon: Activity },
]

export function Sidebar({ page, setPage, user, counts, onLogout }: SidebarProps) {
  const countMap: Partial<Record<Page, { n: number; alert?: boolean }>> = {
    projects: { n: counts.projects },
    tasks: { n: counts.tasks },
    proposals: { n: counts.proposals, alert: counts.proposals > 0 },
  }

  return (
    <div className="w-56 bg-stone-950 text-stone-400 flex flex-col min-h-screen border-r border-stone-800 shrink-0">
      <div className="px-4 py-5 flex items-center gap-3 border-b border-stone-800">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">G</div>
        <div>
          <div className="text-stone-100 font-semibold text-sm leading-tight">Mission Control</div>
          <div className="text-stone-600 text-[10px]">gennial.ai</div>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {NAV.map(n => {
          const c = countMap[n.key]
          const Icon = n.icon
          return (
            <button
              key={n.key}
              onClick={() => setPage(n.key)}
              className={cn(
                "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition",
                page === n.key ? "bg-stone-800 text-stone-100 font-medium" : "hover:bg-stone-900 hover:text-stone-300"
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {n.label}
              </span>
              {c && c.n > 0 && (
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", c.alert ? "bg-red-500/20 text-red-400" : "bg-stone-800 text-stone-500")}>
                  {c.n}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-stone-800 flex items-center justify-center text-xs font-medium text-stone-300">
            {user?.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-stone-300 text-xs font-medium truncate">{user?.name}</div>
            <div className="text-stone-600 text-[10px] truncate">{user?.role}</div>
          </div>
          <button onClick={onLogout} className="text-stone-600 hover:text-stone-400">
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
''')

# ─── Login Page ───
open(os.path.join(PAGES, "Login.tsx"), "w").write('''import { useState } from "react"
import { Input } from "@/components/Input"
import { Button } from "@/components/Button"
import { USERS } from "@/types"
import type { User } from "@/types"

interface LoginProps { onLogin: (u: User) => void }

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [err, setErr] = useState("")

  const login = () => {
    const u = USERS[email]
    if (u && u.pass === pass) onLogin({ email, name: u.name, role: u.role })
    else setErr("Credenciales incorrectas")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950">
      <div className="w-full max-w-sm p-8 bg-stone-900 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">G</div>
          <div>
            <div className="text-white font-semibold text-lg">Mission Control</div>
            <div className="text-stone-500 text-xs">gennial.ai</div>
          </div>
        </div>
        <div className="space-y-4">
          <Input
            className="bg-stone-800 border-stone-700 text-white placeholder-stone-500 focus:border-amber-500"
            placeholder="Email" value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
          <Input
            className="bg-stone-800 border-stone-700 text-white placeholder-stone-500 focus:border-amber-500"
            placeholder="Password" type="password" value={pass}
            onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()}
          />
          {err && <div className="text-red-400 text-xs">{err}</div>}
          <Button className="w-full py-3 bg-gradient-to-r from-amber-500 to-red-500 hover:opacity-90" onClick={login}>
            Entrar
          </Button>
        </div>
      </div>
    </div>
  )
}
''')

# ─── Dashboard Page ───
open(os.path.join(PAGES, "Dashboard.tsx"), "w").write('''import { Badge } from "@/components/Badge"
import { Card, CardHeader, CardContent, CardTitle } from "@/components/Card"
import { ago } from "@/lib/utils"
import type { Project, Task, Proposal, Activity } from "@/types"

interface Props {
  projects: Project[]
  tasks: Task[]
  proposals: Proposal[]
  activities: Activity[]
}

export function Dashboard({ projects, tasks, proposals, activities }: Props) {
  const active = projects.filter(p => p.status === "active").length
  const pending = tasks.filter(t => t.status === "pending").length
  const done = tasks.filter(t => t.status === "done").length
  const rate = tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0
  const pendingP = proposals.filter(p => p.status === "pending").length

  const kpis = [
    { l: "Proyectos activos", v: active, c: "text-emerald-600" },
    { l: "Tareas pendientes", v: pending, c: "text-amber-600" },
    { l: "Completion rate", v: `${rate}%`, c: "text-blue-600" },
    { l: "Proposals pendientes", v: pendingP, c: pendingP > 0 ? "text-red-600" : "text-stone-600" },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-stone-900">Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        {kpis.map(k => (
          <Card key={k.l}>
            <CardContent>
              <div className="text-stone-500 text-xs font-medium mb-1">{k.l}</div>
              <div className={`text-2xl font-bold ${k.c}`}>{k.v}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Actividad reciente</CardTitle></CardHeader>
        <div className="divide-y divide-stone-50">
          {activities.slice(0, 15).map(a => (
            <div key={a.id} className="px-5 py-3 flex items-start gap-3">
              <Badge value={a.agent} />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-stone-800">{a.action}</div>
                {a.reasoning && <div className="text-xs text-stone-500 mt-0.5 truncate">{a.reasoning}</div>}
              </div>
              <span className="text-[10px] text-stone-400 font-mono whitespace-nowrap">{ago(a.created_at)}</span>
            </div>
          ))}
          {activities.length === 0 && <div className="px-5 py-8 text-center text-stone-400 text-sm">Sin actividad</div>}
        </div>
      </Card>
    </div>
  )
}
''')

# ─── Projects Page ───
open(os.path.join(PAGES, "Projects.tsx"), "w").write('''import { useState } from "react"
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
''')

# ─── Tasks Page ───
open(os.path.join(PAGES, "Tasks.tsx"), "w").write('''import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Dialog, DialogTitle } from "@/components/Dialog"
import { Input } from "@/components/Input"
import { Textarea } from "@/components/Textarea"
import { Select } from "@/components/Select"
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

      <Card>
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
              <tr key={t.id} className="hover:bg-stone-50 transition">
                <td className="px-5 py-3">
                  <div className="font-medium text-stone-900">{t.title}</div>
                  {t.description && <div className="text-xs text-stone-500 mt-0.5 truncate max-w-xs">{t.description}</div>}
                  {t.blocked_reason && <div className="text-xs text-red-500 mt-0.5">{t.blocked_reason}</div>}
                </td>
                <td className="px-3 py-3 text-stone-500 text-xs">{projName(t.project_id)}</td>
                <td className="px-3 py-3"><Badge value={t.status} /></td>
                <td className="px-3 py-3"><Badge value={t.priority} /></td>
                <td className="px-3 py-3"><Badge value={t.assigned_to || "pending"} /></td>
                <td className="px-3 py-3 text-right space-x-1">
                  {t.status === "pending" && <Button variant="ghost" size="sm" className="text-blue-600" onClick={() => claim(t.id)}>Tomar</Button>}
                  {["pending", "in_progress", "review"].includes(t.status) && <Button variant="ghost" size="sm" className="text-emerald-600" onClick={() => complete(t.id)}>Completar</Button>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-8 text-center text-stone-400">Sin tareas</td></tr>}
          </tbody>
        </table>
      </Card>

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
    </div>
  )
}
''')

# ─── Proposals Page ───
open(os.path.join(PAGES, "Proposals.tsx"), "w").write('''import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Card, CardContent } from "@/components/Card"
import { ago } from "@/lib/utils"
import type { Proposal } from "@/types"

interface Props { proposals: Proposal[]; refresh: () => void }

export function Proposals({ proposals, refresh }: Props) {
  const pending = proposals.filter(p => p.status === "pending")
  const reviewed = proposals.filter(p => p.status !== "pending")

  const review = async (id: string, status: string) => {
    await supabase.from("proposals").update({
      status, reviewed_by: "matias", review_note: "",
      reviewed_at: new Date().toISOString()
    }).eq("id", id)
    refresh()
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-stone-900">Proposals</h1>

      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-stone-600">Pendientes de aprobacion</div>
          {pending.map(p => (
            <Card key={p.id} className="border-amber-200">
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-semibold text-stone-900">{p.title || p.category}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge value={p.proposed_by} />
                      <Badge value={p.category} />
                      <span className="text-xs text-stone-400 font-mono">{ago(p.created_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-stone-700 mb-4 whitespace-pre-wrap">{p.description}</div>
                <div className="flex gap-2">
                  <Button onClick={() => review(p.id, "approved")} className="bg-emerald-600 hover:bg-emerald-700">Aprobar</Button>
                  <Button variant="destructive" onClick={() => review(p.id, "rejected")}>Rechazar</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pending.length === 0 && <div className="text-center py-12 text-stone-400 text-sm">Sin proposals pendientes</div>}

      {reviewed.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-stone-600">Historial</div>
          {reviewed.slice(0, 20).map(p => (
            <Card key={p.id}>
              <CardContent className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-stone-800">{p.title || p.category}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{p.description?.substring(0, 80)}</div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge value={p.status} />
                  <span className="text-xs text-stone-400 font-mono">{ago(p.created_at)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
''')

# ─── Activity Page ───
open(os.path.join(PAGES, "ActivityLog.tsx"), "w").write('''import { Badge } from "@/components/Badge"
import { Card } from "@/components/Card"
import { ago } from "@/lib/utils"
import type { Activity } from "@/types"

interface Props { activities: Activity[] }

export function ActivityLog({ activities }: Props) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold text-stone-900">Actividad</h1>
      <Card className="divide-y divide-stone-50">
        {activities.map(a => (
          <div key={a.id} className="px-5 py-4">
            <div className="flex items-center gap-2 mb-1">
              <Badge value={a.agent} />
              <span className="text-sm font-medium text-stone-800">{a.action}</span>
              <span className="text-[10px] text-stone-400 font-mono ml-auto">{ago(a.created_at)}</span>
            </div>
            {a.reasoning && <div className="text-xs text-stone-500 ml-16">{a.reasoning}</div>}
            {a.result && <div className="text-xs text-emerald-600 ml-16 mt-0.5">{a.result}</div>}
          </div>
        ))}
        {activities.length === 0 && <div className="px-5 py-12 text-center text-stone-400 text-sm">Sin actividad</div>}
      </Card>
    </div>
  )
}
''')

# ─── App.tsx (main router) ───
open(os.path.join(SRC, "App.tsx"), "w").write('''import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Sidebar } from "@/components/Sidebar"
import { Login } from "@/pages/Login"
import { Dashboard } from "@/pages/Dashboard"
import { Projects } from "@/pages/Projects"
import { Tasks } from "@/pages/Tasks"
import { Proposals } from "@/pages/Proposals"
import { ActivityLog } from "@/pages/ActivityLog"
import type { Page, User, Project, Task, Proposal, Activity } from "@/types"

export default function App() {
  const [user, setUser] = useState<User>(() => {
    const s = sessionStorage.getItem("mc_user")
    return s ? JSON.parse(s) : null
  })
  const [page, setPage] = useState<Page>("dashboard")
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  const fetchAll = useCallback(async () => {
    const [p, t, pr, a] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("tasks").select("*").order("created_at", { ascending: false }),
      supabase.from("proposals").select("*").order("created_at", { ascending: false }),
      supabase.from("activity_log").select("*").order("created_at", { ascending: false }).limit(50),
    ])
    if (p.data) setProjects(p.data)
    if (t.data) setTasks(t.data)
    if (pr.data) setProposals(pr.data)
    if (a.data) setActivities(a.data)
  }, [])

  useEffect(() => {
    if (!user) return
    fetchAll()
    const i = setInterval(fetchAll, 15000)
    return () => clearInterval(i)
  }, [user, fetchAll])

  const login = (u: User) => {
    setUser(u)
    sessionStorage.setItem("mc_user", JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("mc_user")
  }

  if (!user) return <Login onLogin={login} />

  const counts = {
    projects: projects.filter(p => p.status === "active").length,
    tasks: tasks.filter(t => t.status === "pending").length,
    proposals: proposals.filter(p => p.status === "pending").length,
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar page={page} setPage={setPage} user={user} counts={counts} onLogout={logout} />
      <main className="flex-1 p-8 overflow-auto max-h-screen">
        {page === "dashboard" && <Dashboard projects={projects} tasks={tasks} proposals={proposals} activities={activities} />}
        {page === "projects" && <Projects projects={projects} refresh={fetchAll} />}
        {page === "tasks" && <Tasks tasks={tasks} projects={projects} refresh={fetchAll} />}
        {page === "proposals" && <Proposals proposals={proposals} refresh={fetchAll} />}
        {page === "activity" && <ActivityLog activities={activities} />}
      </main>
    </div>
  )
}
''')

print("All components generated successfully!")
print(f"  Components: {len(os.listdir(COMP))} files in src/components/")
print(f"  Pages: {len(os.listdir(PAGES))} files in src/pages/")
print(f"  App.tsx: src/App.tsx")
