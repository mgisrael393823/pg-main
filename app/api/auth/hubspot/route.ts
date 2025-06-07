import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.HUBSPOT_CLIENT_ID!
  const redirectUri = process.env.HUBSPOT_REDIRECT_URI!
  const scope = 'contacts'

  const url = new URL('https://app.hubspot.com/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('scope', scope)
  url.searchParams.set('response_type', 'code')

  return NextResponse.redirect(url.toString())
}

