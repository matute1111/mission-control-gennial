import { cn } from "@/lib/utils"
import { InputHTMLAttributes, forwardRef } from "react"

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn("w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 focus:ring-1 focus:ring-stone-400", className)}
      {...props}
    />
  )
)
Input.displayName = "Input"
