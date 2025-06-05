'use client'

import { useQuery } from '@tanstack/react-query'
import { Users, Building2, Bell, TrendingUp } from 'lucide-react'
import { formatNumber } from '@/utils/format'
import { createClientSupabase } from '@/utils/supabase-client'

interface DashboardStatsProps {
  userId: string
}

export function DashboardStats({ userId }: DashboardStatsProps) {
  const supabase = createClientSupabase()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats', userId],
    queryFn: async () => {
      try {
        const { count: contactCount, error: contactError } = await supabase
          .from('contacts')
          .select('*', { count: 'exact', head: true })

        const { count: propertyCount, error: propertyError } = await supabase
          .from('properties_offmarket')
          .select('*', { count: 'exact', head: true })
          .eq('is_active', true)

        const { count: unreadAlertCount, error: alertError } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)

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
        return {
          totalContacts: 0,
          totalProperties: 0,
          unreadAlerts: 0,
          dataAccuracy: 95.0,
        }
      }
    },
    retry: 1,
    staleTime: 30 * 1000,
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 h-40 shadow-sm animate-pulse">
            <div className="flex items-start justify-between mb-8">
              <div className="h-4 w-32 bg-neutral-medium/10 rounded" />
              <div className="h-8 w-8 bg-neutral-medium/10 rounded" />
            </div>
            <div className="h-10 w-20 bg-neutral-medium/10 rounded" />
          </div>
        ))}
      </div>
    )
  }

  const statCards = [
    {
      title: 'TOTAL CONTACTS',
      value: formatNumber(stats?.totalContacts || 0),
      icon: Users,
      iconColor: 'text-primary',
    },
    {
      title: 'TOTAL PROPERTIES',
      value: formatNumber(stats?.totalProperties || 0),
      icon: Building2,
      iconColor: 'text-primary',
    },
    {
      title: 'UNREAD ALERTS',
      value: formatNumber(stats?.unreadAlerts || 0),
      icon: Bell,
      iconColor: 'text-warning',
    },
    {
      title: 'DATA ACCURACY',
      value: `${stats?.dataAccuracy || 0}%`,
      icon: TrendingUp,
      iconColor: 'text-primary',
      subtitle: '2.5% from last month',
    },
  ]

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon
        return (
          <div key={index} className="bg-white rounded-lg p-6 h-40 shadow-sm">
            <div className="flex items-start justify-between mb-8">
              <h3 className="text-xs font-medium tracking-wider text-neutral-medium uppercase">
                {stat.title}
              </h3>
              <Icon className={`h-8 w-8 ${stat.iconColor}`} />
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">
                {stat.value}
              </div>
              {stat.subtitle && (
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-3 w-3 text-success mr-1" />
                  <p className="text-xs text-neutral-medium">
                    {stat.subtitle}
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
