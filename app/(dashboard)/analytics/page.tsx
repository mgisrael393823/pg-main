import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, Building2 } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'Analytics - PorterGoldberg MVP',
  description: 'Real estate prospecting analytics',
}

export default function AnalyticsPage() {
  return (
    <div className="h-full">
      <PageHeader
        title="Analytics"
        description="Track your prospecting performance and ROI"
      />

      <div className="space-y-6">

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-secondary">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  0%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-secondary">
                  Active Leads
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  0
                </p>
              </div>
              <Users className="h-8 w-8 text-accent-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-secondary">
                  Properties Matched
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  0
                </p>
              </div>
              <Building2 className="h-8 w-8 text-accent-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground-secondary">
                  Time Saved
                </p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  0 hrs
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No Data Available Yet
            </h3>
            <p className="text-foreground-secondary max-w-md mx-auto">
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