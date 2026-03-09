import { useState, useEffect } from "react"
import { Sheet } from "./Sheet"
import { Badge } from "./Badge"
import { Button } from "./Button"
import { Card } from "./Card"
import { Textarea } from "./Textarea"
import { Input } from "./Input"
import { supabase } from "@/lib/supabase"
import type { CRMCompany, CRMContact, CRMDeal, CRMActivity, CRMUpdate } from "@/types"
import { getPriorityScore, getPriorityColor } from "@/types"
import { 
  Building2, 
  Users, 
  DollarSign, 
  Activity,
  Plus,
  Edit3,
  Save,
  Globe,
  MapPin,
  Target,
  TrendingUp,
  Mail,
  Phone,
  Linkedin,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Briefcase
} from "lucide-react"

interface CompanyDetailSheetProps {
  company: CRMCompany | null
  onClose: () => void
  onUpdate?: () => void
}

export function CompanyDetailSheet({ company, onClose, onUpdate }: CompanyDetailSheetProps) {
  const [contacts, setContacts] = useState<CRMContact[]>([])
  const [deals, setDeals] = useState<CRMDeal[]>([])
  const [activities, setActivities] = useState<CRMActivity[]>([])
  const [updates, setUpdates] = useState<CRMUpdate[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'contacts' | 'deals' | 'activity' | 'updates'>('overview')
  const [isEditing, setIsEditing] = useState(false)
  
  // Edit fields
  const [description, setDescription] = useState(company?.description || "")
  const [painPoints, setPainPoints] = useState(company?.pain_points || "")
  const [opportunities, setOpportunities] = useState(company?.opportunities || "")
  const [researchNotes, setResearchNotes] = useState(company?.research_notes || {})
  const [currentStatus, setCurrentStatus] = useState(company?.status || "prospect")

  useEffect(() => {
    if (company) {
      setDescription(company.description || "")
      setPainPoints(company.pain_points || "")
      setOpportunities(company.opportunities || "")
      setResearchNotes(company.research_notes || {})
      setCurrentStatus(company.status)
      fetchAllData()
    }
  }, [company])

  const fetchAllData = async () => {
    if (!company) return
    
    const [contactsRes, dealsRes, activitiesRes, updatesRes] = await Promise.all([
      supabase.from("crm_contacts").select("*").eq("company_id", company.id).is("archived_at", null),
      supabase.from("crm_deals").select("*").eq("company_id", company.id).is("archived_at", null),
      supabase.from("crm_activities").select("*").eq("company_id", company.id).is("archived_at", null).order("created_at", { ascending: false }),
      supabase.from("crm_updates").select("*").eq("company_id", company.id).is("archived_at", null).order("created_at", { ascending: false })
    ])
    
    if (contactsRes.data) setContacts(contactsRes.data)
    if (dealsRes.data) setDeals(dealsRes.data)
    if (activitiesRes.data) setActivities(activitiesRes.data)
    if (updatesRes.data) setUpdates(updatesRes.data)
  }

  const saveCompany = async () => {
    if (!company) return
    await supabase.from("crm_companies").update({
      description,
      pain_points: painPoints,
      opportunities,
      research_notes: researchNotes,
      status: currentStatus,
      updated_at: new Date().toISOString()
    }).eq("id", company.id)
    setIsEditing(false)
    onUpdate?.()
  }

  const getScore = () => getPriorityScore(company?.impact, company?.urgency)
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      prospect: "bg-stone-100 text-stone-600",
      qualified: "bg-blue-100 text-blue-700",
      contacted: "bg-amber-100 text-amber-700",
      negotiation: "bg-purple-100 text-purple-700",
      won: "bg-emerald-100 text-emerald-700",
      lost: "bg-red-100 text-red-700",
    }
    return colors[status] || "bg-stone-100 text-stone-600"
  }

  const totalPipeline = deals
    .filter(d => d.stage !== 'won' && d.stage !== 'lost')
    .reduce((sum, d) => sum + (d.value_amount_max || d.value_amount_min || 0), 0)

  const wonValue = deals
    .filter(d => d.stage === 'won')
    .reduce((sum, d) => sum + (d.value_amount_max || d.value_amount_min || 0), 0)

  if (!company) return null

  return (
    <Sheet open={!!company} onClose={onClose} title={company.name}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <Badge value={company.status} />
              {company.deal_potential && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  company.deal_potential === 'high' ? 'bg-emerald-100 text-emerald-700' :
                  company.deal_potential === 'medium' ? 'bg-amber-100 text-amber-700' :
                  'bg-stone-100 text-stone-600'
                }`}>
                  Potential: {company.deal_potential}
                </span>
              )}
              {getScore() >= 20 && (
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(getScore())}`}>
                  Score: {getScore()}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-stone-500 flex-wrap">
              {company.industry && <span>{company.industry}</span>}
              {company.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {company.location}{company.country && `, ${company.country}`}
                </span>
              )}
              {company.company_size && (
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {company.company_size} empleados
                </span>
              )}
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => isEditing ? saveCompany() : setIsEditing(true)}
          >
            {isEditing ? <><Save className="w-4 h-4 mr-1" /> Guardar</> : <><Edit3 className="w-4 h-4 mr-1" /> Editar</>}
          </Button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-stone-50 p-3 rounded-lg text-center">
            <Users className="w-4 h-4 mx-auto mb-1 text-stone-400" />
            <div className="text-lg font-semibold text-stone-900">{contacts.length}</div>
            <div className="text-xs text-stone-500">Contactos</div>
          </div>
          <div className="bg-stone-50 p-3 rounded-lg text-center">
            <Briefcase className="w-4 h-4 mx-auto mb-1 text-stone-400" />
            <div className="text-lg font-semibold text-stone-900">{deals.length}</div>
            <div className="text-xs text-stone-500">Deals</div>
          </div>
          <div className="bg-stone-50 p-3 rounded-lg text-center">
            <DollarSign className="w-4 h-4 mx-auto mb-1 text-stone-400" />
            <div className="text-lg font-semibold text-stone-900">${(totalPipeline / 1000).toFixed(0)}k</div>
            <div className="text-xs text-stone-500">Pipeline</div>
          </div>
          <div className="bg-stone-50 p-3 rounded-lg text-center">
            <Activity className="w-4 h-4 mx-auto mb-1 text-stone-400" />
            <div className="text-lg font-semibold text-stone-900">{activities.length}</div>
            <div className="text-xs text-stone-500">Actividades</div>
          </div>
        </div>

        {/* Links */}
        {(company.website || company.linkedin_url) && (
          <div className="flex gap-3">
            {company.website && (
              <a href={`https://${company.website}`} target="_blank" rel="noopener" 
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <Globe className="w-4 h-4" /> {company.website}
              </a>
            )}
            {company.linkedin_url && (
              <a href={`https://${company.linkedin_url}`} target="_blank" rel="noopener"
                className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-stone-200 overflow-x-auto">
          {[
            { key: 'overview', label: 'General', icon: Building2 },
            { key: 'contacts', label: `Contactos (${contacts.length})`, icon: Users },
            { key: 'deals', label: `Deals (${deals.length})`, icon: DollarSign },
            { key: 'activity', label: `Actividad (${activities.length})`, icon: Activity },
            { key: 'updates', label: `Historial (${updates.length})`, icon: TrendingUp },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.key 
                  ? 'border-amber-500 text-amber-600' 
                  : 'border-transparent text-stone-500 hover:text-stone-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Description */}
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase">Descripción</label>
              {isEditing ? (
                <Textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1" rows={3} />
              ) : (
                <p className="text-sm text-stone-700 mt-1">{company.description || 'Sin descripción'}</p>
              )}
            </div>

            {/* Pain Points */}
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase">Pain Points</label>
              {isEditing ? (
                <Textarea value={painPoints} onChange={e => setPainPoints(e.target.value)} className="mt-1" rows={2} placeholder="Problemas identificados..." />
              ) : (
                <p className="text-sm text-red-600 bg-red-50 p-2 rounded mt-1">{company.pain_points || 'No identificados'}</p>
              )}
            </div>

            {/* Opportunities */}
            <div>
              <label className="text-xs font-medium text-stone-500 uppercase">Oportunidades</label>
              {isEditing ? (
                <Textarea value={opportunities} onChange={e => setOpportunities(e.target.value)} className="mt-1" rows={2} placeholder="Oportunidades de negocio..." />
              ) : (
                <p className="text-sm text-emerald-600 bg-emerald-50 p-2 rounded mt-1">{company.opportunities || 'No identificadas'}</p>
              )}
            </div>

            {/* Research Notes */}
            {company.research_notes && Object.keys(company.research_notes).length > 0 && (
              <div>
                <label className="text-xs font-medium text-stone-500 uppercase">Notas de Investigación</label>
                <div className="mt-1 space-y-1">
                  {Object.entries(company.research_notes as Record<string, any>).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="font-medium text-stone-700">{key}:</span>{' '}
                      <span className="text-stone-600">{typeof value === 'string' ? value : JSON.stringify(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="space-y-2">
            {contacts.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8">Sin contactos registrados</p>
            ) : (
              contacts.map(contact => (
                <div key={contact.id} className="flex items-start gap-3 p-3 bg-stone-50 rounded-lg">
                  <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-medium text-sm">
                    {contact.first_name[0]}{contact.last_name?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-stone-900">{contact.first_name} {contact.last_name}</span>
                      {contact.is_decision_maker && (
                        <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Decision Maker</span>
                      )}
                    </div>
                    <p className="text-sm text-stone-500">{contact.job_title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
                      {contact.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {contact.email}</span>}
                      {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {contact.phone}</span>}
                      {contact.linkedin_url && (
                        <a href={`https://${contact.linkedin_url}`} target="_blank" rel="noopener" className="text-blue-600 hover:underline flex items-center gap-1">
                          <Linkedin className="w-3 h-3" /> LinkedIn
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="space-y-2">
            {deals.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8">Sin deals registrados</p>
            ) : (
              deals.map(deal => (
                <div key={deal.id} className="p-3 bg-stone-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-stone-900">{deal.title}</span>
                    <Badge value={deal.stage} />
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-stone-500">
                    {(deal.value_amount_min || deal.value_amount_max) && (
                      <span className="font-medium text-stone-900">
                        ${deal.value_amount_min?.toLocaleString() || 0} - ${deal.value_amount_max?.toLocaleString() || 0}
                        {deal.value_period && <span className="text-stone-500">/{deal.value_period}</span>}
                      </span>
                    )}
                    {deal.probability && <span>{deal.probability}% prob</span>}
                    {deal.expected_close_date && (
                      <span>Cierra: {new Date(deal.expected_close_date).toLocaleDateString('es-AR')}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-2">
            {activities.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8">Sin actividades registradas</p>
            ) : (
              activities.map(activity => (
                <div key={activity.id} className="p-3 border-l-2 border-stone-200 hover:border-amber-300 transition">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge value={activity.activity_type} />
                    <span className="text-xs text-stone-400">
                      {new Date(activity.created_at).toLocaleDateString('es-AR')}
                    </span>
                    {activity.direction && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                        activity.direction === 'outbound' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {activity.direction}
                      </span>
                    )}
                  </div>
                  {activity.subject && <p className="font-medium text-sm text-stone-800">{activity.subject}</p>}
                  <p className="text-sm text-stone-600">{activity.content}</p>
                  {activity.result && (
                    <p className="text-xs text-stone-500 mt-1">Resultado: {activity.result}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-2">
            {updates.length === 0 ? (
              <p className="text-sm text-stone-400 text-center py-8">Sin historial registrado</p>
            ) : (
              updates.map(update => (
                <div key={update.id} className="p-3 border-l-2 border-stone-200 hover:border-amber-300 transition">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge value={update.update_type} />
                    <span className="text-xs text-stone-400">
                      {new Date(update.created_at).toLocaleDateString('es-AR')}
                    </span>
                  </div>
                  <p className="text-sm text-stone-700">{update.content}</p>
                  {update.outcome && <p className="text-xs text-stone-500 mt-1">Resultado: {update.outcome}</p>}
                  {update.next_action && (
                    <p className="text-xs text-amber-600 mt-1">Próxima acción: {update.next_action}</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Sheet>
  )
}
