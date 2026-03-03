import { cn } from "@/lib/utils"
import { SelectHTMLAttributes, forwardRef } from "react"

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn("w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400", className)}
      {...props}
    />
  )
)
Select.displayName = "Select"
