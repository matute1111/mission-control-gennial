import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export function Sheet({ open, onClose, children, title }: SheetProps) {
  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Sheet */}
      <div className={cn(
        "fixed right-0 top-0 h-full w-full max-w-xl bg-white shadow-2xl z-50",
        "transform transition-transform duration-300 ease-in-out",
        "flex flex-col"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          {title && <h2 className="text-lg font-semibold text-stone-900">{title}</h2>}
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition ml-auto"
          >
            <X className="w-5 h-5 text-stone-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </>
  )
}
