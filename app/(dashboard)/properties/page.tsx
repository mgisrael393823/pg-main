import { Metadata } from 'next'
import { createServerSupabase } from '@/utils/supabase-server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2 } from 'lucide-react'
import { PropertyList } from '@/components/properties/property-list'
import { PageHeader } from '@/components/layout/page-header'
import { PropertyPageActions, UploadButton } from '@/components/properties/property-page-actions'

export const metadata: Metadata = {
  title: 'Properties - PorterGoldberg MVP',
  description: 'Manage off-market properties',
}

export default async function PropertiesPage() {
  const supabase = createServerSupabase()
  
  // Check if user has properties
  const { count } = await supabase
    .from('properties_offmarket')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const hasProperties = (count || 0) > 0

  return (
    <div className="h-full p-8">
      <PageHeader
        title="Properties"
        description="Manage off-market properties from PropStream"
        actions={<PropertyPageActions />}
      />

      <div className="space-y-6">

      {!hasProperties ? (
        <Card>
          <CardHeader>
            <CardTitle>PropStream Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-neutral-medium mx-auto mb-4" />
              <h3 className="text-lg font-medium text-primary mb-2">
                Import Property Data
              </h3>
              <p className="text-neutral-medium mb-6 max-w-md mx-auto">
                Upload your PropStream CSV file to import off-market properties
                and start matching them with your contacts.
              </p>
              <UploadButton />
            </div>
          </CardContent>
        </Card>
      ) : (
        <PropertyList />
      )}
      </div>
    </div>
  )
}