import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/utils/supabase-server'

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID!
const HUBSPOT_CLIENT_SECRET = process.env.HUBSPOT_CLIENT_SECRET!
const HUBSPOT_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/hubspot/callback`

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code || !state) {
      return NextResponse.redirect(new URL('/settings?error=invalid_callback', request.url))
    }

    const supabase = createServerSupabase()

    // Verify state parameter
    const { data: authState } = await supabase
      .from('auth_states')
      .select('*')
      .eq('state', state)
      .eq('provider', 'hubspot')
      .gte('expires_at', new Date().toISOString())
      .single()

    if (!authState) {
      return NextResponse.redirect(new URL('/settings?error=invalid_state', request.url))
    }

    // Delete used state
    await supabase
      .from('auth_states')
      .delete()
      .eq('state', state)

    // Exchange code for access token
    const tokenResponse = await fetch('https://api.hubapi.com/oauth/v1/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: HUBSPOT_CLIENT_ID,
        client_secret: HUBSPOT_CLIENT_SECRET,
        redirect_uri: HUBSPOT_REDIRECT_URI,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text()
      console.error('Token exchange failed:', error)
      return NextResponse.redirect(new URL('/settings?error=token_exchange_failed', request.url))
    }

    const tokens = await tokenResponse.json()

    // Get HubSpot account info
    const accountResponse = await fetch('https://api.hubapi.com/oauth/v1/access-tokens/' + tokens.access_token, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`,
      },
    })

    const accountInfo = await accountResponse.json()

    // Store tokens and account info in database
    await supabase
      .from('integrations')
      .upsert({
        user_id: authState.user_id,
        provider: 'hubspot',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        account_id: accountInfo.hub_id?.toString(),
        account_name: accountInfo.hub_domain,
        scopes: accountInfo.scopes,
        metadata: {
          app_id: accountInfo.app_id,
          user_id: accountInfo.user_id,
          token_type: tokens.token_type,
        },
      })

    // Update user profile with HubSpot connection
    await supabase
      .from('users')
      .update({
        hubspot_user_id: accountInfo.user_id?.toString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', authState.user_id)

    return NextResponse.redirect(new URL('/settings?success=hubspot_connected', request.url))
  } catch (error) {
    console.error('HubSpot callback error:', error)
    return NextResponse.redirect(new URL('/settings?error=callback_failed', request.url))
  }
}