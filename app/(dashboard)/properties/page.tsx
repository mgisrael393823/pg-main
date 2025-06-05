import { Metadata } from 'next'
import { createServerSupabase } from '@/utils/supabase-server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Building2, Upload, Map } from 'lucide-react'
import { PropertyList } from '@/components/properties/property-list'
import { PageHeader } from '@/components/layout/page-header'

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
    <div className="h-full">
      <PageHeader
        title="Properties"
        description="Manage off-market properties from PropStream"
        actions={
          <>
            <Button variant="outline">
              <Map className="h-4 w-4 mr-2" />
              Map View
            </Button>
            <Button onClick={() => window.location.href = '/upload'}>
              <Upload className="h-4 w-4 mr-2" />
              Upload PropStream CSV
            </Button>
          </>
        }
      />

      <div className="space-y-6">

      {!hasProperties ? (
        <Card>
          <CardHeader>
            <CardTitle>PropStream Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">
                Import Property Data
              </h3>
              <p className="text-foreground-secondary mb-6 max-w-md mx-auto">
                Upload your PropStream CSV file to import off-market properties
                and start matching them with your contacts.
              </p>
              <Button onClick={() => window.location.href = '/upload'}>
                Upload CSV File
              </Button>
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