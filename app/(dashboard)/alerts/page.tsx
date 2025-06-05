import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bell, Plus, Filter } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'Alerts - PorterGoldberg MVP',
  description: 'Manage your property alerts',
}

export default function AlertsPage() {
  return (
    <div className="h-full p-8">
      <PageHeader
        title="Alerts"
        description="Configure intelligent alerts for property matches"
        actions={
          <>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Alert Rule
            </Button>
          </>
        }
      />

      <div className="space-y-6">

      <Card>
        <CardHeader>
          <CardTitle>Alert Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-neutral-medium mx-auto mb-4" />
            <h3 className="text-lg font-medium text-primary mb-2">
              No Alert Rules Yet
            </h3>
            <p className="text-neutral-medium mb-6 max-w-md mx-auto">
              Create alert rules to get notified when properties match your
              criteria or when contacts show interest.
            </p>
            <Button>
              Create Your First Rule
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}