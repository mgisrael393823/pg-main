import { NextResponse } from 'next/server'
import { createServiceSupabase, createServerSupabase } from '@/utils/supabase-server'
import { createHubSpotSyncService } from '@/lib/hubspot/sync'

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors() })
}

export async function GET(req: Request) {
  const supabase = createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors() })
  }

  const service = createServiceSupabase()
  const { data } = await service
    .from('sync_logs')
    .select('*')
    .eq('user_id', user.id)
    .eq('provider', 'hubspot')
    .eq('sync_type', 'contacts')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  return NextResponse.json({ lastSync: data?.completed_at || null, inProgress: data?.status === 'in_progress' }, { headers: cors() })
}

export async function POST(req: Request) {
  const supabase = createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors() })
  }

  const syncService = await createHubSpotSyncService(user.id)
  if (!syncService) {
    return NextResponse.json({ error: 'HubSpot not connected' }, { status: 400, headers: cors() })
  }

  const result = await syncService.syncContacts()
  return NextResponse.json(result, { headers: cors() })
}
