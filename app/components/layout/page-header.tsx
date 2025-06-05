import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="h-20 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold uppercase tracking-wide">{title}</h1>
        {description && (
          <p className="text-sm text-gray-600 mt-0.5 font-normal">{description}</p>
        )}
      </div>
      {actions && <div className="flex gap-3">{actions}</div>}
    </div>
  )
}