import { Metadata } from 'next'
import { createServerSupabase } from '@/utils/supabase-server'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { RecentActivity } from '@/components/dashboard/recent-activity'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'Dashboard - PorterGoldberg MVP',
  description: 'Real estate prospecting dashboard',
}

export default async function DashboardPage() {
  const supabase = createServerSupabase()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="h-full p-6">
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's an overview of your real estate prospecting activity."
      />

      {/* Main content area */}
      <div className="space-y-6">
        <DashboardStats userId={user?.id || ''} />

        <div className="grid gap-6 lg:grid-cols-2">
        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Recent Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[150px] flex items-center justify-center p-4">
              <p className="text-neutral-medium text-center">
                No contacts synced yet. Connect your HubSpot account to get started.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="h-full">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Recent Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-[150px] flex items-center justify-center p-4">
              <p className="text-neutral-medium text-center">
                No properties imported yet. Upload a PropStream CSV to begin.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

        <RecentActivity />
      </div>
    </div>
  )
}