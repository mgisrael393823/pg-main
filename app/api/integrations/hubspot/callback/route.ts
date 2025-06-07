import { NextResponse } from 'next/server'
import { createServiceSupabase, createServerSupabase } from '@/utils/supabase-server'

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors() })
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400, headers: cors() })
  }

  const redirectUri = process.env.HUBSPOT_REDIRECT_URI!
  const clientId = process.env.HUBSPOT_CLIENT_ID!
  const clientSecret = process.env.HUBSPOT_CLIENT_SECRET!

  const tokenRes = await fetch('https://api.hubapi.com/oauth/v1/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    }),
  })

  if (!tokenRes.ok) {
    const text = await tokenRes.text()
    return NextResponse.json({ error: text }, { status: 400, headers: cors() })
  }

  const tokens = await tokenRes.json()

  const supabase = createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors() })
  }

  const service = createServiceSupabase()
  await service.from('integrations').upsert({
    user_id: user.id,
    provider: 'hubspot',
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    is_active: true,
  }, { onConflict: 'user_id,provider' })

  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/contacts`)
}
