import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ToastContext = React.createContext({})

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([])

  const toast = React.useCallback(({ title, description, variant = "default" }) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, title, description, variant }])
    
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            variant={t.variant}
            onClose={() => setToasts((prev) => prev.filter((toast) => toast.id !== t.id))}
          >
            <div>
              {t.title && <div className="font-semibold">{t.title}</div>}
              {t.description && <div className="text-sm opacity-90 mt-1">{t.description}</div>}
            </div>
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}

const Toast = ({ children, variant = "default", onClose }) => {
  const variants = {
    default: "bg-background border-border",
    success: "bg-green-50 dark:bg-green-950 border-green-500/50 text-green-900 dark:text-green-100",
    error: "bg-red-50 dark:bg-red-950 border-red-500/50 text-red-900 dark:text-red-100",
    warning: "bg-yellow-50 dark:bg-yellow-950 border-yellow-500/50 text-yellow-900 dark:text-yellow-100",
  }

  return (
    <div
      className={cn(
        "pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all animate-in slide-in-from-top-full",
        variants[variant]
      )}
    >
      {children}
      <button
        onClick={onClose}
        className="absolute right-2 top-2 rounded-md p-1 opacity-70 hover:opacity-100 transition-opacity"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
