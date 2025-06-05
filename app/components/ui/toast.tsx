'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react'
import type { ToastMessage } from '@/components/providers/toast-provider'

interface ToastProps extends ToastMessage {
  onClose: () => void
}

export function Toast({ type, title, description, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 150) // Wait for animation to complete
  }

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const Icon = icons[type]

  const colorClasses = {
    success: 'border-success/20 bg-success/10 text-success',
    error: 'border-error/20 bg-error/10 text-error',
    warning: 'border-warning/20 bg-warning/10 text-warning',
    info: 'border-border-accent/20 bg-accent-primary/10 text-accent-primary',
  }

  return (
    <div
      className={`
        relative flex w-full max-w-sm items-start space-x-3 rounded-lg border p-4 shadow-md backdrop-blur-sm
        transition-all duration-150 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${colorClasses[type]}
      `}
    >
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && (
          <p className="text-sm text-foreground-secondary">{description}</p>
        )}
      </div>

      <button
        onClick={handleClose}
        className="flex-shrink-0 rounded-full p-1 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}