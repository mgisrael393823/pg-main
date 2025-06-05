import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/utils/supabase-server'

const HUBSPOT_CLIENT_ID = process.env.HUBSPOT_CLIENT_ID!
const HUBSPOT_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/hubspot/callback`

// HubSpot OAuth scopes needed for contact management
const SCOPES = [
  'crm.objects.contacts.read',
  'crm.objects.contacts.write',
  'crm.schemas.contacts.read',
  'crm.objects.companies.read',
  'crm.objects.deals.read',
]

export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated
    const supabase = createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Generate state parameter for CSRF protection
    const state = Buffer.from(JSON.stringify({
      userId: user.id,
      timestamp: Date.now(),
    })).toString('base64')

    // Store state in database for verification
    await supabase
      .from('auth_states')
      .insert({
        state,
        user_id: user.id,
        provider: 'hubspot',
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
      })

    // Build HubSpot OAuth URL
    const authUrl = new URL('https://app.hubspot.com/oauth/authorize')
    authUrl.searchParams.append('client_id', HUBSPOT_CLIENT_ID)
    authUrl.searchParams.append('redirect_uri', HUBSPOT_REDIRECT_URI)
    authUrl.searchParams.append('scope', SCOPES.join(' '))
    authUrl.searchParams.append('state', state)

    return NextResponse.redirect(authUrl.toString())
  } catch (error) {
    console.error('HubSpot auth error:', error)
    return NextResponse.redirect(new URL('/settings?error=auth_failed', request.url))
  }
}