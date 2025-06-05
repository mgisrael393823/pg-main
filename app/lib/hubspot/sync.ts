import { HubSpotClient, HubSpotContact, getHubSpotClient } from '@/lib/hubspot/client'
import { createServiceSupabase } from '@/utils/supabase-server'
import type { Contact } from '@/types/index'

export interface SyncResult {
  success: boolean
  created: number
  updated: number
  failed: number
  errors: string[]
}

export class HubSpotSyncService {
  private client: HubSpotClient
  private supabase: ReturnType<typeof createServiceSupabase>
  private userId: string

  constructor(client: HubSpotClient, userId: string) {
    this.client = client
    this.supabase = createServiceSupabase()
    this.userId = userId
  }

  async syncContacts(): Promise<SyncResult> {
    const result: SyncResult = {
      success: true,
      created: 0,
      updated: 0,
      failed: 0,
      errors: [],
    }

    try {
      // Get last sync timestamp
      const { data: lastSync } = await this.supabase
        .from('sync_logs')
        .select('completed_at')
        .eq('user_id', this.userId)
        .eq('provider', 'hubspot')
        .eq('sync_type', 'contacts')
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(1)
        .single()

      let after: string | undefined
      let hasMore = true
      const batchSize = 100

      while (hasMore) {
        try {
          // Fetch contacts from HubSpot
          const response = await this.client.getContacts(batchSize, after)
          
          if (response.results.length === 0) {
            hasMore = false
            break
          }

          // Process contacts in batches
          await this.processBatch(response.results, result, lastSync?.completed_at)

          // Check for more pages
          if (response.paging?.next) {
            after = response.paging.next.after
          } else {
            hasMore = false
          }

          // Add a small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100))
        } catch (error) {
          result.errors.push(`Batch error: ${error instanceof Error ? error.message : 'Unknown error'}`)
          result.success = false
          hasMore = false
        }
      }

      // Log sync completion
      await this.supabase
        .from('sync_logs')
        .insert({
          user_id: this.userId,
          provider: 'hubspot',
          sync_type: 'contacts',
          status: result.success ? 'completed' : 'failed',
          records_processed: result.created + result.updated,
          records_created: result.created,
          records_updated: result.updated,
          records_failed: result.failed,
          error_messages: result.errors.length > 0 ? result.errors : null,
          completed_at: new Date().toISOString(),
        })

    } catch (error) {
      result.success = false
      result.errors.push(error instanceof Error ? error.message : 'Unknown error')
    }

    return result
  }

  private async processBatch(
    hubspotContacts: HubSpotContact[],
    result: SyncResult,
    lastSyncTime?: string
  ): Promise<void> {
    for (const hubspotContact of hubspotContacts) {
      try {
        // Skip if not modified since last sync (unless full sync)
        if (lastSyncTime && hubspotContact.properties.lastmodifieddate) {
          const modifiedDate = new Date(hubspotContact.properties.lastmodifieddate)
          const lastSync = new Date(lastSyncTime)
          if (modifiedDate <= lastSync) {
            continue
          }
        }

        // Check if contact exists
        const { data: existingContact } = await this.supabase
          .from('contacts')
          .select('id')
          .eq('hubspot_id', hubspotContact.id)
          .single()

        const contactData = {
          hubspot_id: hubspotContact.id,
          email: hubspotContact.properties.email || null,
          first_name: hubspotContact.properties.firstname || null,
          last_name: hubspotContact.properties.lastname || null,
          phone: hubspotContact.properties.phone || null,
          company: hubspotContact.properties.company || null,
          job_title: hubspotContact.properties.jobtitle || null,
          lifecycle_stage: hubspotContact.properties.lifecyclestage || null,
          lead_status: hubspotContact.properties.hs_lead_status || null,
          last_activity_date: hubspotContact.properties.lastmodifieddate 
            ? new Date(hubspotContact.properties.lastmodifieddate).toISOString()
            : null,
          properties: hubspotContact.properties,
          sync_status: 'synced' as const,
          last_sync_at: new Date().toISOString(),
          sync_error: null,
        }

        if (existingContact) {
          // Update existing contact
          const { error } = await this.supabase
            .from('contacts')
            .update(contactData)
            .eq('id', existingContact.id)

          if (error) throw error
          result.updated++
        } else {
          // Create new contact
          const { error } = await this.supabase
            .from('contacts')
            .insert(contactData)

          if (error) throw error
          result.created++
        }

      } catch (error) {
        result.failed++
        result.errors.push(
          `Failed to sync contact ${hubspotContact.id}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        )
      }
    }
  }

  async syncSingleContact(hubspotId: string): Promise<Contact | null> {
    try {
      const hubspotContact = await this.client.getContact(hubspotId)
      
      const contactData = {
        hubspot_id: hubspotContact.id,
        email: hubspotContact.properties.email || null,
        first_name: hubspotContact.properties.firstname || null,
        last_name: hubspotContact.properties.lastname || null,
        phone: hubspotContact.properties.phone || null,
        company: hubspotContact.properties.company || null,
        job_title: hubspotContact.properties.jobtitle || null,
        lifecycle_stage: hubspotContact.properties.lifecyclestage || null,
        lead_status: hubspotContact.properties.hs_lead_status || null,
        last_activity_date: hubspotContact.properties.lastmodifieddate 
          ? new Date(hubspotContact.properties.lastmodifieddate).toISOString()
          : null,
        properties: hubspotContact.properties,
        sync_status: 'synced' as const,
        last_sync_at: new Date().toISOString(),
        sync_error: null,
      }

      const { data, error } = await this.supabase
        .from('contacts')
        .upsert(contactData, {
          onConflict: 'hubspot_id',
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Failed to sync single contact:', error)
      return null
    }
  }
}

// Create and export sync service for a user
export async function createHubSpotSyncService(
  userId: string
): Promise<HubSpotSyncService | null> {
  const client = await getHubSpotClient(userId)
  if (!client) return null
  
  return new HubSpotSyncService(client, userId)
}