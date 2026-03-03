import { cn } from "@/lib/utils"
import { STATUS_COLORS } from "@/types"

interface BadgeProps {
  value: string
  className?: string
}

export function Badge({ value, className }: BadgeProps) {
  const color = STATUS_COLORS[value] || "bg-stone-100 text-stone-600"
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", color, className)}>
      {value}
    </span>
  )
}
