'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { HubSpotSyncButton } from '@/components/hubspot/sync-button'

interface ContactPageActionsProps {
  hasHubSpotConnected: boolean
}

export function ContactPageActions({ hasHubSpotConnected }: ContactPageActionsProps) {
  const router = useRouter()

  return (
    <>
      {hasHubSpotConnected && <HubSpotSyncButton />}
      <Button onClick={() => router.push('/upload')}>
        <Upload className="h-4 w-4 mr-2" />
        Import CSV
      </Button>
    </>
  )
}