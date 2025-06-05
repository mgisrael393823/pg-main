import { Metadata } from 'next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Upload, Users } from 'lucide-react'
import { PropStreamCSVUpload } from '@/components/propstream/csv-upload'
import { ConnectHubSpotButton } from '@/components/hubspot/connect-button'
import { PageHeader } from '@/components/layout/page-header'

export const metadata: Metadata = {
  title: 'Import Data - PorterGoldberg MVP',
  description: 'Import contacts and properties',
}

export default function UploadPage() {
  return (
    <div className="h-full">
      <PageHeader
        title="Import Data"
        description="Import contacts from HubSpot or properties from PropStream"
      />

      <div className="space-y-6">

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Import Contacts
            </CardTitle>
            <CardDescription>
              Connect your HubSpot account or upload a CSV file
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-8 w-8 text-foreground-muted mx-auto mb-3" />
                <p className="text-sm text-foreground-secondary mb-2">
                  Drag and drop your CSV file here, or click to browse
                </p>
                <p className="text-xs text-foreground-muted">
                  Supported formats: CSV, XLSX (Max 50MB)
                </p>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-background px-2 text-foreground-muted">Or</span>
                </div>
              </div>
              <ConnectHubSpotButton />
            </div>
          </CardContent>
        </Card>

        <PropStreamCSVUpload />
      </div>
      </div>
    </div>
  )
}