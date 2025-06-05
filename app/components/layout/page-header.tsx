import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-primary truncate">{title}</h1>
          {description && (
            <p className="text-sm text-neutral-medium mt-1">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex gap-2 sm:gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  )
}