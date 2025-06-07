// HubSpot OAuth helper functions

const params = new URLSearchParams({
  client_id: process.env.HUBSPOT_CLIENT_ID!,
  redirect_uri: process.env.HUBSPOT_REDIRECT_URI!,
  scope: [
    "crm.export",
    "crm.import",
    "crm.lists.read",
    "crm.lists.write",
    "crm.objects.contacts.read",
    "crm.objects.contacts.write",
    "oauth"
  ].join(" ")
});

export const HUBSPOT_AUTHORIZE_URL =
  `https://app-na2.hubspot.com/oauth/authorize?${params.toString()}`;

// Helper to get HubSpot authorization URL with optional state parameter
export function getHubSpotAuthUrl(state?: string) {
  const authParams = new URLSearchParams(params);
  if (state) {
    authParams.append('state', state);
  }
  return `https://app-na2.hubspot.com/oauth/authorize?${authParams.toString()}`;
}