import { useState, useEffect, useCallback } from "react"
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
        {page === "projects" && <Projects projects={projects} tasks={tasks} refresh={fetchAll} />}
        {page === "tasks" && <Tasks tasks={tasks} projects={projects} refresh={fetchAll} />}
        {page === "proposals" && <Proposals proposals={proposals} refresh={fetchAll} />}
        {page === "activity" && <ActivityLog activities={activities} />}
      </main>
    </div>
  )
}
