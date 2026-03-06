import { cn } from "@/lib/utils"
import type { Page, User } from "@/types"
import { LayoutDashboard, FolderKanban, CheckSquare, MessageCircle, Activity, LogOut, Menu, X } from "lucide-react"
import { useState } from "react"

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const countMap: Partial<Record<Page, { n: number; alert?: boolean }>> = {
    projects: { n: counts.projects },
    tasks: { n: counts.tasks },
    proposals: { n: counts.proposals, alert: counts.proposals > 0 },
  }

  // Mobile bottom navigation
  const MobileNav = () => (
    <>
      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 h-14 bg-stone-950 border-b border-stone-800 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white font-bold text-xs">G</div>
          <span className="text-stone-100 font-semibold text-sm">Mission Control</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-stone-400 hover:text-stone-200"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 top-14 bg-stone-950 z-30 p-4">
          <nav className="space-y-1">
            {NAV.map(n => {
              const c = countMap[n.key]
              const Icon = n.icon
              return (
                <button
                  key={n.key}
                  onClick={() => {
                    setPage(n.key)
                    setMobileMenuOpen(false)
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition",
                    page === n.key ? "bg-stone-800 text-stone-100 font-medium" : "hover:bg-stone-900 hover:text-stone-300"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {n.label}
                  </span>
                  {c && c.n > 0 && (
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", c.alert ? "bg-red-500/20 text-red-400" : "bg-stone-800 text-stone-500")}>
                      {c.n}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
          <div className="mt-6 pt-4 border-t border-stone-800">
            <div className="flex items-center gap-3 px-4">
              <div className="w-8 h-8 rounded-full bg-stone-800 flex items-center justify-center text-sm font-medium text-stone-300">
                {user?.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-stone-300 text-sm font-medium">{user?.name}</div>
                <div className="text-stone-600 text-xs">{user?.role}</div>
              </div>
              <button onClick={onLogout} className="p-2 text-stone-600 hover:text-stone-400">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-stone-950 border-t border-stone-800 z-40 flex items-center justify-around px-2">
        {NAV.map(n => {
          const c = countMap[n.key]
          const Icon = n.icon
          const isActive = page === n.key
          return (
            <button
              key={n.key}
              onClick={() => setPage(n.key)}
              className={cn(
                "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition min-w-[64px]",
                isActive ? "text-amber-400" : "text-stone-500 hover:text-stone-300"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {c && c.n > 0 && c.alert && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </div>
              <span className="text-[10px] mt-1 font-medium">{n.label}</span>
            </button>
          )
        })}
      </div>
    </>
  )

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden sm:flex w-56 bg-stone-950 text-stone-400 flex-col min-h-screen border-r border-stone-800 shrink-0">
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

  return (
    <>
      <MobileNav />
      <DesktopSidebar />
    </>
  )
}
