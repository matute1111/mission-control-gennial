import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive"
  size?: "default" | "sm" | "icon"
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const base = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none disabled:opacity-50"
    const variants: Record<string, string> = {
      default: "bg-stone-900 text-white hover:bg-stone-800",
      outline: "border border-stone-200 bg-white hover:bg-stone-50 text-stone-800",
      ghost: "hover:bg-stone-100 text-stone-600",
      destructive: "bg-red-100 text-red-700 hover:bg-red-200",
    }
    const sizes: Record<string, string> = {
      default: "px-4 py-2 text-sm",
      sm: "px-3 py-1.5 text-xs",
      icon: "h-8 w-8",
    }
    return <button ref={ref} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  }
)
Button.displayName = "Button"
