import { cn } from "@/lib/utils"
import type { Page, User } from "@/types"
import { LayoutDashboard, FolderKanban, CheckSquare, MessageCircle, Activity, LogOut, Menu, X, Bot, Mail, Linkedin, Github, Briefcase } from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  page: Page
  setPage: (p: Page) => void
  user: User
  counts: { projects: number; tasks: number; proposals: number; crm?: number }
  onLogout: () => void
}

const NAV: { key: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "projects", label: "Proyectos", icon: FolderKanban },
  { key: "tasks", label: "Tareas", icon: CheckSquare },
  { key: "proposals", label: "Proposals", icon: MessageCircle },
  { key: "crm", label: "CRM", icon: Briefcase },
  { key: "activity", label: "Actividad", icon: Activity },
]

export function Sidebar({ page, setPage, user, counts, onLogout }: SidebarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const countMap: Partial<Record<Page, { n: number; alert?: boolean }>> = {
    projects: { n: counts.projects },
    tasks: { n: counts.tasks },
    proposals: { n: counts.proposals, alert: counts.proposals > 0 },
    crm: { n: counts.crm || 0, alert: (counts.crm || 0) > 0 },
  }

  // Mobile bottom navigation
  const MobileNav = () => (
    <>
      {/* Mobile Header */}
      <div className="sm:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-stone-200 z-40 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white font-bold text-xs">G</div>
          <span className="text-stone-900 font-semibold text-sm">Mission Control</span>
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-stone-600 hover:text-stone-900"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-0 top-14 bg-white z-30 p-4">
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
                    page === n.key ? "bg-stone-100 text-stone-900 font-medium" : "hover:bg-stone-100 hover:text-stone-900"
                  )}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="w-5 h-5" />
                    {n.label}
                  </span>
                  {c && c.n > 0 && (
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", c.alert ? "bg-red-100 text-red-600" : "bg-stone-200 text-stone-600")}>
                      {c.n}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
          {/* Agente Mobile */}
          <div className="mt-6 pt-4 border-t border-stone-200">
            <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3 px-4">
              Agente
            </div>
            <div className="mx-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-4 border border-indigo-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-stone-900 text-sm font-semibold">Kimi</div>
                  <div className="text-stone-500 text-xs">AI Agent • v2.5</div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="text-xs px-2 py-1 bg-white text-stone-600 rounded border border-stone-200">22+ skills</span>
                <span className="text-xs px-2 py-1 bg-white text-stone-600 rounded border border-stone-200">Muses</span>
                <span className="text-xs px-2 py-1 bg-white text-stone-600 rounded border border-stone-200">GitHub</span>
              </div>
              
              <div className="flex items-center gap-2 pt-3 border-t border-stone-200">
                <a href="mailto:kimi@gennial.ai" className="p-2 rounded bg-white hover:bg-stone-100 transition border border-stone-200" title="Email: kimi@gennial.ai">
                  <Mail className="w-4 h-4 text-stone-600" />
                </a>
                <a href="https://linkedin.com/in/kimi-gennial" target="_blank" rel="noopener" className="p-2 rounded bg-white hover:bg-stone-100 transition border border-stone-200" title="LinkedIn">
                  <Linkedin className="w-4 h-4 text-stone-600" />
                </a>
                <a href="https://github.com/gennial" target="_blank" rel="noopener" className="p-2 rounded bg-white hover:bg-stone-100 transition border border-stone-200" title="GitHub">
                  <Github className="w-4 h-4 text-stone-600" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-stone-200">
            <div className="flex items-center gap-3 px-4">
              <div className="w-8 h-8 rounded-full bg-stone-200 flex items-center justify-center text-sm font-medium text-stone-700">
                {user?.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-stone-900 text-sm font-medium">{user?.name}</div>
                <div className="text-stone-500 text-xs">{user?.role}</div>
              </div>
              <button onClick={onLogout} className="p-2 text-stone-400 hover:text-stone-600">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-stone-200 z-40 flex items-center justify-around px-2 shadow-sm">
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
                isActive ? "text-amber-500" : "text-stone-500 hover:text-stone-900"
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
    <div className="hidden sm:flex w-56 bg-white text-stone-600 flex-col min-h-screen border-r border-stone-200 shrink-0 shadow-sm">
      <div className="px-4 py-5 flex items-center gap-3 border-b border-stone-200">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-red-500 flex items-center justify-center text-white font-bold text-sm">G</div>
        <div>
          <div className="text-stone-900 font-semibold text-sm leading-tight">Mission Control</div>
          <div className="text-stone-500 text-[10px]">gennial.ai</div>
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
                page === n.key ? "bg-stone-100 text-stone-900 font-medium" : "hover:bg-stone-100 hover:text-stone-900"
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className="w-4 h-4" />
                {n.label}
              </span>
              {c && c.n > 0 && (
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", c.alert ? "bg-red-100 text-red-600" : "bg-stone-200 text-stone-600")}>
                  {c.n}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Agente Section */}
      <div className="px-3 py-3 border-t border-stone-200">
        <div className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-2 px-1">
          Agente
        </div>
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-100">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-stone-900 text-xs font-semibold">Kimi</div>
              <div className="text-stone-500 text-[9px]">AI Agent • v2.5</div>
            </div>
          </div>
          
          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-2">
            <span className="text-[9px] px-1.5 py-0.5 bg-white text-stone-600 rounded border border-stone-200">22+ skills</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-white text-stone-600 rounded border border-stone-200">Muses</span>
            <span className="text-[9px] px-1.5 py-0.5 bg-white text-stone-600 rounded border border-stone-200">GitHub</span>
          </div>
          
          {/* Accesos */}
          <div className="flex items-center gap-2 pt-2 border-t border-stone-200">
            <a href="mailto:kimi@gennial.ai" className="p-1.5 rounded bg-white hover:bg-stone-100 transition border border-stone-200" title="Email">
              <Mail className="w-3 h-3 text-stone-600" />
            </a>
            <a href="https://linkedin.com/in/kimi-gennial" target="_blank" rel="noopener" className="p-1.5 rounded bg-white hover:bg-stone-100 transition border border-stone-200" title="LinkedIn">
              <Linkedin className="w-3 h-3 text-stone-600" />
            </a>
            <a href="https://github.com/gennial" target="_blank" rel="noopener" className="p-1.5 rounded bg-white hover:bg-stone-100 transition border border-stone-200" title="GitHub">
              <Github className="w-3 h-3 text-stone-600" />
            </a>
          </div>
        </div>
      </div>

      <div className="px-3 py-3 border-t border-stone-200">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-stone-200 flex items-center justify-center text-xs font-medium text-stone-700">
            {user?.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-stone-900 text-xs font-medium truncate">{user?.name}</div>
            <div className="text-stone-500 text-[10px] truncate">{user?.role}</div>
          </div>
          <button onClick={onLogout} className="text-stone-400 hover:text-stone-600">
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
