'use client'

import { useQuery } from '@tanstack/react-query'
import { Users, Building2, Bell, TrendingUp } from 'lucide-react'
import { formatNumber } from '../../utils/format'
import { createClientSupabase } from '../../utils/supabase-client'
import { StatCard } from '../ui/stat-card'

interface DashboardStatsProps {
  userId: string
}

export function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = createClientSupabase()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: async () => {
      try {
        // Get contact count
        const { count: contactCount, error: contactError } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })

        // Get property count
        const { count: propertyCount, error: propertyError } = await supabase
          .from('properties_offmarket')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)

        // Get unread alerts count for user
        const { count: unreadAlertCount, error: alertError } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)

        // Log any errors but continue with defaults
        if (contactError) console.error('Contact query error:', contactError)
        if (propertyError) console.error('Property query error:', propertyError)
        if (alertError) console.error('Alert query error:', alertError)

        return {
          totalContacts: contactCount || 0,
          totalProperties: propertyCount || 0,
          unreadAlerts: unreadAlertCount || 0,
          dataAccuracy: 95.0,
        }
      } catch (err) {
        console.error('Dashboard stats error:', err)
        // Return default values if queries fail
        return {
          totalContacts: 0,
          totalProperties: 0,
          unreadAlerts: 0,
          dataAccuracy: 95.0,
        }
      }
    },
    // Add retry and stale time options
    retry: 1,
    staleTime: 30 * 1000, // 30 seconds
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-background-card rounded-lg p-6 shadow-sm">
            <div className="flex flex-col">
              {/* Row 1: Label and Icon skeleton */}
              <div className="flex items-center justify-between mb-4">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="w-14 h-14 bg-gray-100 rounded-lg animate-pulse" />
              </div>
              
              {/* Row 2: Value skeleton */}
              <div className="mb-2">
                <div className="h-10 w-20 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <div className="bg-red-500 text-white p-4">TEST CARD</div>
      <StatCard
        title="Total Contacts"
        value={formatNumber(stats?.totalContacts || 0)}
        icon={<Users className="h-6 w-6" />}
        variant="default"
      />
      
      <StatCard
        title="Total Properties"
        value={formatNumber(stats?.totalProperties || 0)}
        icon={<Building2 className="h-6 w-6" />}
        variant="success"
      />
      
      <StatCard
        title="Unread Alerts"
        value={formatNumber(stats?.unreadAlerts || 0)}
        icon={<Bell className="h-6 w-6" />}
        variant="warning"
      />
      
      <StatCard
        title="Data Accuracy"
        value={`${stats?.dataAccuracy || 0}%`}
        icon={<TrendingUp className="h-6 w-6" />}
        variant="success"
        trend={{
          value: 2.5,
          label: 'from last month'
        }}
      />
    </div>
  )
}