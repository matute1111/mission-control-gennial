import { cn } from "@/lib/utils"
import { TextareaHTMLAttributes, forwardRef } from "react"

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn("w-full px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:border-stone-400 h-20 resize-none", className)}
      {...props}
    />
  )
)
Textarea.displayName = "Textarea"
