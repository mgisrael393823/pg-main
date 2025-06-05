// Fixed page structure for all pages
import { Metadata } from 'next'
import { createServerSupabase } from '@/utils/supabase-server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users } from 'lucide-react'
import { ConnectHubSpotButton } from '@/components/hubspot/connect-button'
import { ContactList } from '@/components/contacts/contact-list'
import { PageHeader } from '@/components/layout/page-header'
import { ContactPageActions } from '@/components/contacts/contact-page-actions'

export const metadata: Metadata = {
  title: 'Contacts - PorterGoldberg MVP',
  description: 'Manage your HubSpot contacts',
}

export default async function ContactsPage() {
  const supabase = createServerSupabase()
  
  const { data: { user } } = await supabase.auth.getUser()
  const { data: integration } = await supabase
    .from('integrations')
    .select('*')
    .eq('user_id', user?.id || '')
    .eq('provider', 'hubspot')
    .eq('is_active', true)
    .single()

  const hasHubSpotConnected = !!integration

  return (
    <div className="h-full p-8">
      <PageHeader
        title="Contacts"
        description="Manage and sync your HubSpot contacts"
        actions={<ContactPageActions hasHubSpotConnected={hasHubSpotConnected} />}
      />

      <div className="space-y-6">
        {!hasHubSpotConnected ? (
          <Card>
            <CardHeader>
              <CardTitle>HubSpot Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-neutral-medium mx-auto mb-4" />
                <h3 className="text-lg font-medium text-primary mb-2">
                  Connect HubSpot to Get Started
                </h3>
                <p className="text-neutral-medium mb-6 max-w-md mx-auto">
                  Sync your contacts from HubSpot to start matching them with properties
                  and creating intelligent alerts.
                </p>
                <ConnectHubSpotButton />
              </div>
            </CardContent>
          </Card>
        ) : (
          <ContactList />
        )}
      </div>
    </div>
  )
}
