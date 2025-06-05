import { createServiceSupabase } from '@/utils/supabase-server'

export interface HubSpotContact {
  id: string
  properties: {
    email?: string
    firstname?: string
    lastname?: string
    phone?: string
    company?: string
    jobtitle?: string
    lifecyclestage?: string
    hs_lead_status?: string
    lastmodifieddate?: string
    createdate?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
  archived: boolean
}

export interface HubSpotListResponse<T> {
  results: T[]
  paging?: {
    next?: {
      after: string
      link: string
    }
  }
}

export class HubSpotClient {
  private accessToken: string
  private baseUrl = 'https://api.hubapi.com'

  constructor(accessToken: string) {
    this.accessToken = accessToken
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`HubSpot API error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // Contacts API
  async getContacts(
    limit = 100,
    after?: string,
    properties?: string[]
  ): Promise<HubSpotListResponse<HubSpotContact>> {
    const params = new URLSearchParams({
      limit: limit.toString(),
    })

    if (after) params.append('after', after)
    
    if (properties && properties.length > 0) {
      properties.forEach(prop => params.append('properties', prop))
    } else {
      // Default properties to fetch
      const defaultProps = [
        'email', 'firstname', 'lastname', 'phone', 'company',
        'jobtitle', 'lifecyclestage', 'hs_lead_status',
        'lastmodifieddate', 'createdate'
      ]
      defaultProps.forEach(prop => params.append('properties', prop))
    }

    return this.request<HubSpotListResponse<HubSpotContact>>(
      `/crm/v3/objects/contacts?${params}`
    )
  }

  async getContact(contactId: string): Promise<HubSpotContact> {
    return this.request<HubSpotContact>(`/crm/v3/objects/contacts/${contactId}`)
  }

  async createContact(properties: Record<string, any>): Promise<HubSpotContact> {
    return this.request<HubSpotContact>('/crm/v3/objects/contacts', {
      method: 'POST',
      body: JSON.stringify({ properties }),
    })
  }

  async updateContact(
    contactId: string,
    properties: Record<string, any>
  ): Promise<HubSpotContact> {
    return this.request<HubSpotContact>(`/crm/v3/objects/contacts/${contactId}`, {
      method: 'PATCH',
      body: JSON.stringify({ properties }),
    })
  }

  async deleteContact(contactId: string): Promise<void> {
    await this.request(`/crm/v3/objects/contacts/${contactId}`, {
      method: 'DELETE',
    })
  }

  // Search API
  async searchContacts(
    filters: Array<{
      propertyName: string
      operator: string
      value: string
    }>,
    limit = 100
  ): Promise<HubSpotListResponse<HubSpotContact>> {
    const body = {
      filterGroups: [{
        filters,
      }],
      limit,
      properties: [
        'email', 'firstname', 'lastname', 'phone', 'company',
        'jobtitle', 'lifecyclestage', 'hs_lead_status',
        'lastmodifieddate', 'createdate'
      ],
    }

    return this.request<HubSpotListResponse<HubSpotContact>>(
      '/crm/v3/objects/contacts/search',
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    )
  }

  // Batch operations
  async batchCreateContacts(
    contacts: Array<{ properties: Record<string, any> }>
  ): Promise<{ results: HubSpotContact[] }> {
    return this.request('/crm/v3/objects/contacts/batch/create', {
      method: 'POST',
      body: JSON.stringify({ inputs: contacts }),
    })
  }

  async batchUpdateContacts(
    contacts: Array<{ id: string; properties: Record<string, any> }>
  ): Promise<{ results: HubSpotContact[] }> {
    return this.request('/crm/v3/objects/contacts/batch/update', {
      method: 'POST',
      body: JSON.stringify({ inputs: contacts }),
    })
  }
}

// Helper to get HubSpot client for a user
export async function getHubSpotClient(userId: string): Promise<HubSpotClient | null> {
  const supabase = createServiceSupabase()
  
  const { data: integration } = await supabase
    .from('integrations')
    .select('*')
    .eq('user_id', userId)
    .eq('provider', 'hubspot')
    .eq('is_active', true)
    .single()

  if (!integration) {
    return null
  }

  // Check if token needs refresh
  if (integration.expires_at && new Date(integration.expires_at) < new Date()) {
    // TODO: Implement token refresh
    console.warn('HubSpot token expired, needs refresh')
  }

  return new HubSpotClient(integration.access_token)
}