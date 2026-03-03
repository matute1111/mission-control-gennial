import { supabase } from "@/lib/supabase"
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
