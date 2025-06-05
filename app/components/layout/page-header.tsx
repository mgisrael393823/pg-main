import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-primary">{title}</h1>
          {description && (
            <p className="text-sm text-neutral-medium mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
    </div>
  )
}