import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { User, Key, Bell } from 'lucide-react'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'Settings - PorterGoldberg MVP',
  description: 'Manage your account settings',
}

export default function SettingsPage() {
  return (
    <div className="h-full p-6">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences"
      />

      <div className="space-y-6">

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter your full name" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="your@email.com" className="mt-1" disabled />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select id="role" className="mt-1" disabled>
                <option>Agent</option>
              </Select>
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              API Integrations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hubspot">HubSpot Private App Token</Label>
              <Input 
                id="hubspot" 
                type="password" 
                placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" 
                className="mt-1" 
              />
            </div>
            <div>
              <Label htmlFor="propstream">PropStream API Key</Label>
              <Input 
                id="propstream" 
                type="password" 
                placeholder="Enter your PropStream API key" 
                className="mt-1" 
              />
            </div>
            <Button>Save API Keys</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary">Email Notifications</p>
                <p className="text-sm text-neutral-medium">
                  Receive alerts via email
                </p>
              </div>
              <input type="checkbox" className="h-5 w-5 rounded-full" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-primary">Alert Frequency</p>
                <p className="text-sm text-neutral-medium">
                  How often to receive alert summaries
                </p>
              </div>
              <Select className="w-32">
                <option>Immediate</option>
                <option>Daily</option>
                <option>Weekly</option>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  )
}