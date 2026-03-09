import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { Badge } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Card, CardContent } from "@/components/Card"
import { Dialog, DialogTitle } from "@/components/Dialog"
import { ago } from "@/lib/utils"
import type { Proposal } from "@/types"
import { CheckCircle, XCircle, ExternalLink } from "lucide-react"

interface Props { 
  proposals: Proposal[]
  refresh: () => void 
}

export function Proposals({ proposals, refresh }: Props) {
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null)
  const [reviewNote, setReviewNote] = useState("")

  const pending = proposals.filter(p => p.status === "pending")
  const approved = proposals.filter(p => p.status === "approved")
  const rejected = proposals.filter(p => p.status === "rejected")

  const review = async (id: string, status: string) => {
    await supabase.from("proposals").update({
      status,
      reviewed_by: "matias",
      review_note: reviewNote,
      reviewed_at: new Date().toISOString()
    }).eq("id", id)
    setReviewNote("")
    setSelectedProposal(null)
    refresh()
  }

  const formatDescription = (desc: string) => {
    // Format markdown-like content
    return desc.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} className="font-bold text-stone-900 mt-3 mb-1">{line.replace(/\*\*/g, '')}</div>
      }
      if (line.startsWith('- ')) {
        return <div key={i} className="ml-4 text-sm text-stone-600">• {line.substring(2)}</div>
      }
      if (line.startsWith('  - ')) {
        return <div key={i} className="ml-8 text-sm text-stone-500">◦ {line.substring(4)}</div>
      }
      if (line.includes('http')) {
        return (
          <a key={i} href={line.trim()} target="_blank" rel="noopener" className="text-blue-600 hover:underline text-sm flex items-center gap-1">
            <ExternalLink className="w-3 h-3" /> {line.trim()}
          </a>
        )
      }
      return <div key={i} className="text-sm text-stone-700">{line}</div>
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-900">Proposals</h1>
        <div className="flex gap-2 text-sm">
          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded">{pending.length} pendientes</span>
          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded">{approved.length} aprobadas</span>
        </div>
      </div>

      {pending.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-amber-700 flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
            Pendientes de aprobación ({pending.length})
          </div>
          {pending.map(p => (
            <Card key={p.id} className="border-amber-300 hover:shadow-md transition cursor-pointer" onClick={() => setSelectedProposal(p)}>
              <CardContent>
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold text-stone-900 text-lg">{p.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge value={p.proposed_by} />
                      {p.category && <Badge value={p.category} />}
                      <span className="text-xs text-stone-400 font-mono">{ago(p.created_at)}</span>
                    </div>
                  </div>
                  <Button size="sm" onClick={(e) => { e.stopPropagation(); setSelectedProposal(p) }}>
                    Ver detalle
                  </Button>
                </div>
                <div className="text-sm text-stone-600 line-clamp-3">
                  {p.description?.substring(0, 200)}...
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {pending.length === 0 && (
        <div className="text-center py-12 bg-stone-50 rounded-lg border border-stone-200">
          <div className="text-4xl mb-2">✅</div>
          <div className="text-stone-500 text-sm">Sin proposals pendientes</div>
          <div className="text-stone-400 text-xs mt-1">Todo está aprobado o en progreso</div>
        </div>
      )}

      {approved.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Aprobadas ({approved.length})
          </div>
          {approved.slice(0, 10).map(p => (
            <Card key={p.id} className="border-emerald-200 bg-emerald-50/30">
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-stone-800">{p.title}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{p.category} • {ago(p.created_at)}</div>
                </div>
                <Badge value="approved" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {rejected.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm font-semibold text-stone-500 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            Rechazadas ({rejected.length})
          </div>
          {rejected.slice(0, 5).map(p => (
            <Card key={p.id} className="border-stone-200 bg-stone-50/30 opacity-60">
              <CardContent className="flex items-center justify-between py-3">
                <div>
                  <div className="text-sm font-medium text-stone-600">{p.title}</div>
                  <div className="text-xs text-stone-400 mt-0.5">{p.category} • {ago(p.created_at)}</div>
                </div>
                <Badge value="rejected" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      <Dialog open={!!selectedProposal} onClose={() => setSelectedProposal(null)}>
        {selectedProposal && (
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            <DialogTitle>{selectedProposal.title}</DialogTitle>
            
            <div className="flex items-center gap-2 text-sm">
              <Badge value={selectedProposal.proposed_by} />
              {selectedProposal.category && <Badge value={selectedProposal.category} />}
              <span className="text-stone-400">• {ago(selectedProposal.created_at)}</span>
            </div>

            <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
              <div className="text-sm text-stone-700 space-y-1 max-h-96 overflow-y-auto">
                {formatDescription(selectedProposal.description || "")}
              </div>
            </div>

            {selectedProposal.status === "pending" && (
              <div className="space-y-3">
                <textarea
                  placeholder="Nota de revisión (opcional)..."
                  value={reviewNote}
                  onChange={e => setReviewNote(e.target.value)}
                  className="w-full p-3 border rounded-lg text-sm min-h-[80px]"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => review(selectedProposal.id, "approved")}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" /> Aprobar
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => review(selectedProposal.id, "rejected")}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-1" /> Rechazar
                  </Button>
                </div>
              </div>
            )}

            {selectedProposal.status !== "pending" && (
              <div className="bg-stone-100 p-3 rounded-lg">
                <div className="text-sm font-medium text-stone-700">
                  Estado: <Badge value={selectedProposal.status} />
                </div>
                {selectedProposal.review_note && (
                  <div className="text-sm text-stone-600 mt-1">
                    Nota: {selectedProposal.review_note}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Dialog>
    </div>
  )
}
