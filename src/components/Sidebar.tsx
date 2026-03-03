import { cn } from "@/lib/utils"
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
