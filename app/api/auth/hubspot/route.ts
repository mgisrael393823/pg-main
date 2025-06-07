import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.HUBSPOT_CLIENT_ID
  const redirectUri = process.env.HUBSPOT_REDIRECT_URI
  
  // Debug logging for production
  console.log('HubSpot OAuth Debug:', {
    clientId: clientId ? 'Set' : 'Missing',
    redirectUri: redirectUri ? 'Set' : 'Missing',
    nodeEnv: process.env.NODE_ENV
  })
  
  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { 
        error: 'Missing configuration',
        clientId: clientId ? 'Set' : 'Missing',
        redirectUri: redirectUri ? 'Set' : 'Missing'
      },
      { status: 500 }
    )
  }
  
  const scopes = [
    "crm.export",
    "crm.import",
    "crm.lists.read",
    "crm.lists.write",
    "crm.objects.contacts.read",
    "crm.objects.contacts.write",
    "oauth"
  ]

  const url = new URL('https://app-na2.hubspot.com/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('redirect_uri', redirectUri)
  url.searchParams.set('scope', scopes.join(' '))

  return NextResponse.redirect(url.toString())
}

