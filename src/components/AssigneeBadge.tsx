import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"

interface AssigneeBadgeProps {
  assignedTo?: string | null
  assignedAgent?: string | null
  size?: "sm" | "md"
  className?: string
}

export function AssigneeBadge({ assignedTo, assignedAgent, size = "sm", className }: AssigneeBadgeProps) {
  const executor = assignedAgent || assignedTo || "sin asignar"
  const isKimi = executor.toLowerCase() === "kimi"
  const isMatias = executor.toLowerCase().includes("matias") || executor.toLowerCase().includes("mati")

  const iconSize = size === "sm" ? "w-3 h-3" : "w-4 h-4"
  const textSize = size === "sm" ? "text-[10px]" : "text-xs"
  const padding = size === "sm" ? "px-1.5 py-0.5" : "px-2 py-1"

  if (isKimi) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        "bg-violet-100 text-violet-700 border border-violet-200",
        padding, textSize, className
      )}>
        <Bot className={iconSize} />
        Kimi
      </span>
    )
  }

  if (isMatias) {
    return (
      <span className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        "bg-emerald-100 text-emerald-700 border border-emerald-200",
        padding, textSize, className
      )}>
        <User className={iconSize} />
        Matias
      </span>
    )
  }

  return (
    <span className={cn(
      "inline-flex items-center gap-1 rounded-full font-medium",
      "bg-stone-100 text-stone-600 border border-stone-200",
      padding, textSize, className
    )}>
      <User className={iconSize} />
      {executor}
    </span>
  )
}
