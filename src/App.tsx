import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabase"
import { Sidebar } from "@/components/Sidebar"
import { Login } from "@/pages/Login"
import { Dashboard } from "@/pages/Dashboard"
import { Projects } from "@/pages/Projects"
import { Tasks } from "@/pages/Tasks"
import { Proposals } from "@/pages/Proposals"
import { CRM } from "@/pages/CRM"
import { Documents } from "@/pages/Documents"
import { Backoffice } from "@/pages/Backoffice"
import { ActivityLog } from "@/pages/ActivityLog"
import LinkedInDashboard from "@/pages/LinkedInDashboard"
import { Agents } from "@/pages/Agents"
import type { Page, User, Project, Feature, Task, Proposal, Activity, CRMCompany, CRMContact, CRMDeal, CRMUpdate, CRMActivity } from "@/types"

export default function App() {
  const [user, setUser] = useState<User | null>(() => {
    const s = sessionStorage.getItem("mc_user")
    return s ? JSON.parse(s) : null
  })
  const [page, setPage] = useState<Page>("dashboard")
  const [projects, setProjects] = useState<Project[]>([])
  const [features, setFeatures] = useState<Feature[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [companies, setCompanies] = useState<CRMCompany[]>([])
  const [contacts, setContacts] = useState<CRMContact[]>([])
  const [deals, setDeals] = useState<CRMDeal[]>([])
  const [crmUpdates, setCrmUpdates] = useState<CRMUpdate[]>([])
  const [crmActivities, setCrmActivities] = useState<CRMActivity[]>([])

  const fetchAll = useCallback(async () => {
    const [p, f, t, pr, a, comp, cont, d, cu, ca] = await Promise.all([
      supabase.from("projects").select("*").is("archived_at", null).order("urgency", { ascending: false }),
      supabase.from("features").select("*").is("archived_at", null).order("urgency", { ascending: false }),
      supabase.from("tasks").select("*").is("archived_at", null).order("urgency", { ascending: false }),
      supabase.from("proposals").select("*").is("archived_at", null).order("created_at", { ascending: false }),
      supabase.from("activity_log").select("*").is("archived_at", null).order("created_at", { ascending: false }).limit(50),
      supabase.from("crm_companies").select("*").is("archived_at", null).order("impact", { ascending: false }),
      supabase.from("crm_contacts").select("*").is("archived_at", null),
      supabase.from("crm_deals").select("*").is("archived_at", null).order("impact", { ascending: false }),
      supabase.from("crm_updates").select("*").is("archived_at", null).order("created_at", { ascending: false }).limit(50),
      supabase.from("crm_activities").select("*").is("archived_at", null).order("created_at", { ascending: false }).limit(50),
    ])
    if (p.data) setProjects(p.data)
    if (f.data) setFeatures(f.data)
    if (t.data) setTasks(t.data)
    if (pr.data) setProposals(pr.data)
    if (a.data) setActivities(a.data)
    if (comp.data) setCompanies(comp.data)
    if (cont.data) setContacts(cont.data)
    if (d.data) setDeals(d.data)
    if (cu.data) setCrmUpdates(cu.data)
    if (ca.data) setCrmActivities(ca.data)
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

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    sessionStorage.removeItem("mc_user")
  }

  if (!user) return <Login onLogin={login} />

  // Calculate counts with new schema
  const activeProjects = projects.filter(p => p.status === "active")
  const activeFeatures = features.filter(f => f.status === "in_progress")
  const pendingTasks = tasks.filter(t => t.status === "todo" || t.status === "in_progress" || t.status === "blocked")
  const pendingProposals = proposals.filter(p => p.status === "pending")
  const activeDeals = deals.filter(d => d.stage !== 'won' && d.stage !== 'lost' && d.stage !== 'archived')
  
  // Critical items (impact × urgency >= 20)
  const criticalTasks = pendingTasks.filter(t => (t.impact || 1) * (t.urgency || 1) >= 20)

  const counts = {
    projects: activeProjects.length,
    tasks: pendingTasks.length,
    proposals: pendingProposals.length,
    crm: activeDeals.length,
    critical: criticalTasks.length,
  }

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar page={page} setPage={setPage} user={user} counts={counts} onLogout={logout} />
      <main className="flex-1 pt-16 sm:pt-0 pb-20 sm:pb-0 p-4 sm:p-8 overflow-auto max-h-screen">
        {page === "dashboard" && <Dashboard projects={projects} features={features} tasks={tasks} proposals={proposals} activities={activities} companies={companies} deals={deals} />}
        {page === "projects" && <Projects projects={projects} features={features} tasks={tasks} refresh={fetchAll} />}
        {page === "tasks" && <Tasks tasks={tasks} features={features} projects={projects} refresh={fetchAll} />}
        {page === "proposals" && <Proposals proposals={proposals} refresh={fetchAll} />}
        {page === "crm" && <CRM companies={companies} contacts={contacts} deals={deals} updates={crmUpdates} activities={crmActivities} refresh={fetchAll} />}
        {page === "documents" && <Documents />}
        {page === "backoffice" && <Backoffice currentUser={user} />}
        {page === "activity" && <ActivityLog activities={activities} />}
        {page === "linkedin" && <LinkedInDashboard />}
        {page === "agents" && <Agents />}
      </main>
    </div>
  )
}
