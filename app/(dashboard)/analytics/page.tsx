import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, Building2, Clock } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'Analytics - PorterGoldberg MVP',
  description: 'Real estate prospecting analytics',
}

export default function AnalyticsPage() {
  // Using the same stat card structure as dashboard
  const statCards = [
    {
      title: 'CONVERSION RATE',
      value: '0%',
      icon: TrendingUp,
      iconColor: 'text-success',
    },
    {
      title: 'ACTIVE LEADS',
      value: '0',
      icon: Users,
      iconColor: 'text-primary',
    },
    {
      title: 'PROPERTIES MATCHED',
      value: '0',
      icon: Building2,
      iconColor: 'text-primary',
    },
    {
      title: 'TIME SAVED',
      value: '0 hrs',
      icon: Clock,
      iconColor: 'text-warning',
    },
  ]

  return (
    <div className="h-full p-8">
      <PageHeader
        title="Analytics"
        description="Track your prospecting performance and ROI"
      />

      <div className="space-y-6">
        {/* Stats Grid - Same structure as dashboard */}
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
                <div className="text-4xl font-bold text-primary">
                  {stat.value}
                </div>
              </div>
            )
          })}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Performance Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-neutral-medium mx-auto mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">
                No Data Available Yet
              </h3>
              <p className="text-neutral-medium max-w-md mx-auto">
                Start importing contacts and properties to see your analytics
                and track your prospecting performance.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
