'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/providers/toast-provider'
import { Link2 } from 'lucide-react'

export function ConnectHubSpotButton() {
  const [isConnecting, setIsConnecting] = useState(false)
  const { addToast } = useToast()

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      
      // Redirect to HubSpot OAuth flow
      window.location.href = '/api/auth/hubspot'
    } catch (error) {
      setIsConnecting(false)
      addToast({
        type: 'error',
        title: 'Connection failed',
        description: 'Failed to initiate HubSpot connection',
      })
    }
  }

  return (
    <Button
      onClick={handleConnect}
      disabled={isConnecting}
      loading={isConnecting}
    >
      <Link2 className="h-4 w-4 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect HubSpot Account'}
    </Button>
  )
}