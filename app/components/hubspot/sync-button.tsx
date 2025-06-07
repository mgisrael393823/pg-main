'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/providers/toast-provider'
import { RefreshCw } from 'lucide-react'
import { formatRelativeTime } from '@/utils/format'

interface SyncStatus {
  lastSync: string | null
  inProgress: boolean
  recentSyncs: Array<{
    id: string
    status: string
    completed_at: string | null
    records_created: number
    records_updated: number
    records_failed: number
  }>
}

export function HubSpotSyncButton() {
  const queryClient = useQueryClient()
  const { addToast } = useToast()

  // Get sync status
  const { data: syncStatus } = useQuery<SyncStatus>({
    queryKey: ['hubspot-sync-status'],
    queryFn: async () => {
      const response = await fetch('/api/contacts/sync')
      if (!response.ok) throw new Error('Failed to fetch sync status')
      return response.json()
    },
    refetchInterval: 5000, // Poll every 5 seconds
  })

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/contacts/sync', {
        method: 'POST',
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sync failed')
      }
      
      return response.json()
    },
    onSuccess: (data) => {
      addToast({
        type: 'success',
        title: 'Sync completed',
        description: `Created: ${data.created}, Updated: ${data.updated}`,
      })
      
      // Refresh queries
      queryClient.invalidateQueries({ queryKey: ['hubspot-sync-status'] })
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
    onError: (error) => {
      addToast({
        type: 'error',
        title: 'Sync failed',
        description: error instanceof Error ? error.message : 'Unknown error',
      })
    },
  })

  const isLoading = syncMutation.isPending

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="outline"
        onClick={() => syncMutation.mutate()}
        disabled={isLoading}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
        {isLoading ? 'Syncing...' : 'Sync HubSpot'}
      </Button>
      
      {syncStatus?.lastSync && (
        <p className="text-sm text-foreground-secondary">
          Last synced {formatRelativeTime(syncStatus.lastSync)}
        </p>
      )}
    </div>
  )
}