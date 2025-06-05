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
  return (
    <div style={{ 
      backgroundColor: 'white', 
      border: '2px solid red', 
      padding: '20px',
      borderRadius: '8px'
    }}>
      <h3 style={{ color: 'black', fontSize: '20px', marginBottom: '10px' }}>
        {title || 'NO TITLE'}
      </h3>
      <p style={{ color: 'black', fontSize: '36px', fontWeight: 'bold' }}>
        {value || 'NO VALUE'}
      </p>
      <div style={{ color: 'red' }}>
        VARIANT: {variant}
      </div>
    </div>
  )
}