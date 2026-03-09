import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/Button"
import { Input } from "@/components/Input"
import { Dialog, DialogTitle } from "@/components/Dialog"
import { Badge } from "@/components/Badge"
import { CompanyDetailSheet } from "@/components/CompanyDetailSheet"
import { Building2, Users, DollarSign, Plus, Search, Globe, MapPin } from "lucide-react"
import type { CRMCompany, CRMContact, CRMDeal, CRMUpdate, CRMActivity } from "@/types"
import { getPriorityScore, STATUS_COLORS } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/Card"

interface CRMProps {
  companies: CRMCompany[]
  contacts: CRMContact[]
  deals: CRMDeal[]
  updates: CRMUpdate[]
  activities: CRMActivity[]
  refresh: () => void
}

export function CRM({ companies, contacts, deals, updates, activities, refresh }: CRMProps) {
  const [activeTab, setActiveTab] = useState<"companies" | "deals">("companies")
  const [search, setSearch] = useState("")
  const [showNewCompany, setShowNewCompany] = useState(false)
  const [newCompany, setNewCompany] = useState({ name: "", website: "", industry: "", location: "", country: "" })
  const [selectedCompany, setSelectedCompany] = useState<CRMCompany | null>(null)

  const filteredCompanies = companies.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.industry?.toLowerCase().includes(search.toLowerCase()) ||
    c.location?.toLowerCase().includes(search.toLowerCase())
  )

  const filteredDeals = deals.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase())
  )

  const createCompany = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from("crm_companies").insert({
      ...newCompany,
      status: "prospect",
      created_by: user?.email || "unknown"
    })
    setShowNewCompany(false)
    setNewCompany({ name: "", website: "", industry: "", location: "", country: "" })
    refresh()
  }

  const getCompanyContacts = (companyId: string) => contacts.filter(c => c.company_id === companyId)
  const getCompanyDeals = (companyId: string) => deals.filter(d => d.company_id === companyId)

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

  const getDealStageColor = (stage: string) => {
    const colors: Record<string, string> = {
      lead: "bg-stone-100 text-stone-600",
      qualified: "bg-blue-100 text-blue-700",
      meeting_scheduled: "bg-violet-100 text-violet-700",
      proposal_sent: "bg-amber-100 text-amber-700",
      negotiation: "bg-purple-100 text-purple-700",
      won: "bg-emerald-100 text-emerald-700",
      lost: "bg-red-100 text-red-700",
    }
    return colors[stage] || "bg-stone-100 text-stone-600"
  }

  const totalPipelineValue = deals
    .filter(d => d.stage !== 'won' && d.stage !== 'lost' && d.stage !== 'archived')
    .reduce((sum, d) => sum + (d.value_amount_max || d.value_amount_min || 0), 0)

  const wonDealsValue = deals
    .filter(d => d.stage === 'won')
    .reduce((sum, d) => sum + (d.value_amount_max || d.value_amount_min || 0), 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">CRM</h1>
          <p className="text-stone-500 text-sm mt-1">Clientes, inversores y deals</p>
        </div>
        <Button onClick={() => setShowNewCompany(true)} className="bg-amber-500 hover:bg-amber-600 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Nueva Empresa
        </Button>
      </div>

      {/* Dialog para nueva empresa */}
      <Dialog open={showNewCompany} onClose={() => setShowNewCompany(false)}>
        <DialogTitle>Agregar Empresa</DialogTitle>
        <div className="space-y-3">
          <Input 
            placeholder="Nombre *" 
            value={newCompany.name} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCompany({...newCompany, name: e.target.value})} 
          />
          <Input 
            placeholder="Website" 
            value={newCompany.website} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCompany({...newCompany, website: e.target.value})} 
          />
          <Input 
            placeholder="Industria" 
            value={newCompany.industry} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCompany({...newCompany, industry: e.target.value})} 
          />
          <Input 
            placeholder="Ciudad" 
            value={newCompany.location} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCompany({...newCompany, location: e.target.value})} 
          />
          <Input 
            placeholder="País" 
            value={newCompany.country} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCompany({...newCompany, country: e.target.value})} 
          />
          <Button 
            onClick={createCompany} 
            className="w-full bg-amber-500 hover:bg-amber-600 text-white" 
            disabled={!newCompany.name}
          >
            Crear Empresa
          </Button>
        </div>
      </Dialog>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
              <Building2 className="w-4 h-4" />
              Empresas
            </div>
            <div className="text-2xl font-semibold text-stone-900">{companies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
              <Users className="w-4 h-4" />
              Contactos
            </div>
            <div className="text-2xl font-semibold text-stone-900">{contacts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
              <DollarSign className="w-4 h-4" />
              Pipeline
            </div>
            <div className="text-2xl font-semibold text-stone-900">${(totalPipelineValue / 1000).toFixed(0)}k</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
              <DollarSign className="w-4 h-4" />
              Ganado
            </div>
            <div className="text-2xl font-semibold text-emerald-600">${(wonDealsValue / 1000).toFixed(0)}k</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <Input 
          placeholder="Buscar empresas, deals..." 
          className="pl-10"
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab("companies")}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
            activeTab === "companies" 
              ? "border-amber-500 text-amber-600" 
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          <Building2 className="w-4 h-4 inline mr-2" />
          Empresas ({filteredCompanies.length})
        </button>
        <button
          onClick={() => setActiveTab("deals")}
          className={`px-4 py-2 text-sm font-medium transition border-b-2 ${
            activeTab === "deals" 
              ? "border-amber-500 text-amber-600" 
              : "border-transparent text-stone-500 hover:text-stone-700"
          }`}
        >
          <DollarSign className="w-4 h-4 inline mr-2" />
          Deals ({filteredDeals.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === "companies" && (
        <div className="grid gap-3">
          {filteredCompanies.map(company => {
            const companyContacts = getCompanyContacts(company.id)
            const companyDeals = getCompanyDeals(company.id)
            const score = getPriorityScore(company.impact, company.urgency)
            return (
              <Card key={company.id} className="cursor-pointer hover:border-amber-300 transition" onClick={() => setSelectedCompany(company)}>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-stone-900">{company.name}</h3>
                        <Badge value={company.status} />
                        {score >= 20 && <Badge value={`Score: ${score}`} />}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-stone-500 flex-wrap">
                        {company.industry && <span>{company.industry}</span>}
                        {company.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {company.location}{company.country && `, ${company.country}`}
                          </span>
                        )}
                        {company.website && (
                          <a href={`https://${company.website}`} target="_blank" rel="noopener" className="flex items-center gap-1 hover:text-amber-600">
                            <Globe className="w-3 h-3" />
                            {company.website}
                          </a>
                        )}
                      </div>
                      {company.pain_points && (
                        <p className="text-sm text-stone-600 mt-2">{company.pain_points}</p>
                      )}
                      {company.opportunities && (
                        <p className="text-sm text-emerald-600 mt-1">{company.opportunities}</p>
                      )}
                    </div>
                    <div className="text-right text-sm text-stone-500">
                      <div>{companyContacts.length} contactos</div>
                      <div>{companyDeals.length} deals</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {filteredCompanies.length === 0 && (
            <div className="text-center py-12 text-stone-500">
              <Building2 className="w-12 h-12 mx-auto mb-4 text-stone-300" />
              <p>No hay empresas registradas</p>
            </div>
          )}
        </div>
      )}

      {activeTab === "deals" && (
        <div className="grid gap-3">
          {filteredDeals.map(deal => {
            const company = companies.find(c => c.id === deal.company_id)
            const score = getPriorityScore(deal.impact, deal.urgency)
            return (
              <Card key={deal.id}>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-stone-900">{deal.title}</h3>
                        <Badge value={deal.stage} />
                        {score >= 20 && <Badge value={`Score: ${score}`} />}
                      </div>
                      <div className="text-sm text-stone-500">
                        {company ? company.name : 'Empresa desconocida'}
                      </div>
                      {deal.description && (
                        <p className="text-sm text-stone-600 mt-2">{deal.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        {(deal.value_amount_min || deal.value_amount_max) && (
                          <span className="font-medium text-stone-900">
                            ${deal.value_amount_min?.toLocaleString() || 0} - ${deal.value_amount_max?.toLocaleString() || 0}
                            {deal.value_period && <span className="text-stone-500">/{deal.value_period}</span>}
                          </span>
                        )}
                        {deal.expected_close_date && (
                          <span className="text-stone-500">
                            {new Date(deal.expected_close_date).toLocaleDateString('es-AR')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
          {filteredDeals.length === 0 && (
            <div className="text-center py-12 text-stone-500">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-stone-300" />
              <p>No hay deals registrados</p>
            </div>
          )}
        </div>
      )}

      <CompanyDetailSheet
        company={selectedCompany}
        onClose={() => setSelectedCompany(null)}
        onUpdate={refresh}
      />
    </div>
  )
}
