import { ReactNode } from 'react'
import { clsx } from 'clsx'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  icon: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error'
  trend?: {
    value: number
    label: string
  }
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  variant = 'default',
  trend 
}: StatCardProps) {
  const iconColors = {
    default: 'bg-accent-tertiary/20 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  }

  const trendColor = trend?.value && trend.value > 0 ? 'text-success' : 'text-error'

  return (
    <div className="card hover:shadow-md transition-all duration-200">
      <div className="flex flex-col">
        {/* Row 1: Label and Icon */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-neutral-medium uppercase tracking-wider">
            {title}
          </h3>
          <div className={clsx(
            'w-14 h-14 rounded-lg flex items-center justify-center',
            iconColors[variant]
          )}>
            {icon}
          </div>
        </div>
        
        {/* Row 2: Value */}
        <div className="mb-2">
          <p className="text-3xl font-bold text-primary">
            {value}
          </p>
        </div>

        {/* Row 3: Trend (if provided) */}
        {trend && (
          <div className="flex items-center gap-1">
            {trend.value > 0 ? (
              <TrendingUp className={clsx('h-4 w-4', trendColor)} />
            ) : (
              <TrendingDown className={clsx('h-4 w-4', trendColor)} />
            )}
            <span className={clsx('text-sm font-medium', trendColor)}>
              {Math.abs(trend.value)}%
            </span>
            <span className="text-sm text-neutral-medium">
              {trend.label}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}