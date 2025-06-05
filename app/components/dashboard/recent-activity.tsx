'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatRelativeTime } from '@/utils/format'
import { Users, Building2, Bell } from 'lucide-react'

// Placeholder data - will be replaced with real data
const activities = [
  {
    id: '1',
    type: 'contact' as const,
    title: 'New contact added',
    description: 'John Doe was synced from HubSpot',
    timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
  },
  {
    id: '2',
    type: 'property' as const,
    title: 'Property matched',
    description: '123 Main St matched with contact Jane Smith',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: '3',
    type: 'alert' as const,
    title: 'Alert triggered',
    description: 'High-value property alert for lead in Chicago',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
]

const activityIcons = {
  contact: Users,
  property: Building2,
  alert: Bell,
}

const activityColors = {
  contact: 'default',
  property: 'success',
  alert: 'warning',
} as const

export function RecentActivity() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <div className="min-h-[200px] flex items-center justify-center p-4">
              <p className="text-gray-500 text-center">
                No recent activity to display
              </p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = activityIcons[activity.type]
              return (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="p-2.5 rounded-lg bg-background flex items-center justify-center shadow-sm">
                    <Icon className="h-5 w-5 text-foreground-secondary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground uppercase text-sm">
                        {activity.title}
                      </p>
                      <Badge variant={activityColors[activity.type]} size="sm">
                        {activity.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground-secondary font-normal">
                      {activity.description}
                    </p>
                    <p className="text-xs text-foreground-muted font-light">
                      {formatRelativeTime(activity.timestamp)}
                    </p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}