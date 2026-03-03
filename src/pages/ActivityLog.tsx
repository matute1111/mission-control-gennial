import { Badge } from "@/components/Badge"
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
