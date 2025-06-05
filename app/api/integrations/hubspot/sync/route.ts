import { NextResponse } from 'next/server'
import { createServerSupabase } from '@/utils/supabase-server'
import { createHubSpotSyncService } from '@/lib/hubspot/sync'

export async function POST() {
  try {
    const supabase = createServerSupabase()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has HubSpot integration
    const { data: integration } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'hubspot')
      .eq('is_active', true)
      .single()

    if (!integration) {
      return NextResponse.json(
        { error: 'HubSpot not connected' },
        { status: 400 }
      )
    }

    // Check for ongoing sync
    const { data: ongoingSync } = await supabase
      .from('sync_logs')
      .select('id')
      .eq('user_id', user.id)
      .eq('provider', 'hubspot')
      .eq('status', 'started')
      .single()

    if (ongoingSync) {
      return NextResponse.json(
        { error: 'Sync already in progress' },
        { status: 409 }
      )
    }

    // Start sync log
    const { data: syncLog } = await supabase
      .from('sync_logs')
      .insert({
        user_id: user.id,
        provider: 'hubspot',
        sync_type: 'contacts',
        status: 'started',
      })
      .select()
      .single()

    // Create sync service
    const syncService = await createHubSpotSyncService(user.id)
    if (!syncService) {
      await supabase
        .from('sync_logs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          error_messages: ['Failed to create sync service'],
        })
        .eq('id', syncLog.id)

      return NextResponse.json(
        { error: 'Failed to initialize sync' },
        { status: 500 }
      )
    }

    // Perform sync (in production, this should be a background job)
    const result = await syncService.syncContacts()

    // Update sync log with results
    await supabase
      .from('sync_logs')
      .update({
        status: result.success ? 'completed' : 'failed',
        completed_at: new Date().toISOString(),
        records_processed: result.created + result.updated,
        records_created: result.created,
        records_updated: result.updated,
        records_failed: result.failed,
        error_messages: result.errors.length > 0 ? result.errors : null,
      })
      .eq('id', syncLog.id)

    return NextResponse.json({
      success: result.success,
      syncId: syncLog.id,
      created: result.created,
      updated: result.updated,
      failed: result.failed,
      errors: result.errors,
    })

  } catch (error) {
    console.error('Sync API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Get sync status
export async function GET() {
  try {
    const supabase = createServerSupabase()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get recent sync logs
    const { data: syncLogs } = await supabase
      .from('sync_logs')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'hubspot')
      .order('created_at', { ascending: false })
      .limit(10)

    // Get last successful sync
    const lastSync = syncLogs?.find(log => log.status === 'completed')

    // Check if sync is in progress
    const inProgress = syncLogs?.some(log => log.status === 'started')

    return NextResponse.json({
      lastSync: lastSync?.completed_at || null,
      inProgress,
      recentSyncs: syncLogs || [],
    })

  } catch (error) {
    console.error('Sync status error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}