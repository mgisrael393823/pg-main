"use client"

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
  trend,
}: StatCardProps) {
  const variantStyles = {
    default: '',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
  }

  return (
    <div
      className={clsx(
        'rounded-lg border border-border p-6 space-y-2',
        variantStyles[variant]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{title || 'NO TITLE'}</span>
        <div className="w-6 h-6 text-inherit">{icon}</div>
      </div>
      <p className="text-3xl font-semibold">{value || 'NO VALUE'}</p>
      {trend && (
        <div className="flex items-center text-sm text-foreground-secondary">
          {trend.value >= 0 ? (
            <TrendingUp className="h-4 w-4 mr-1" />
          ) : (
            <TrendingDown className="h-4 w-4 mr-1" />
          )}
          <span>{trend.value}%</span>
          <span className="ml-1">{trend.label}</span>
        </div>
      )}
    </div>
  )
}