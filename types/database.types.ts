export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string | null
          role: 'admin' | 'agent' | 'viewer'
          hubspot_user_id: string | null
          is_active: boolean
          last_login: string | null
          preferences: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          full_name?: string | null
          role?: 'admin' | 'agent' | 'viewer'
          hubspot_user_id?: string | null
          is_active?: boolean
          last_login?: string | null
          preferences?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string | null
          role?: 'admin' | 'agent' | 'viewer'
          hubspot_user_id?: string | null
          is_active?: boolean
          last_login?: string | null
          preferences?: Json | null
        }
      }
      contacts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          hubspot_id: string
          email: string | null
          first_name: string | null
          last_name: string | null
          phone: string | null
          company: string | null
          job_title: string | null
          lifecycle_stage: string | null
          lead_status: string | null
          last_activity_date: string | null
          properties: Json | null
          sync_status: 'pending' | 'synced' | 'error'
          sync_error: string | null
          last_sync_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          hubspot_id: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          lifecycle_stage?: string | null
          lead_status?: string | null
          last_activity_date?: string | null
          properties?: Json | null
          sync_status?: 'pending' | 'synced' | 'error'
          sync_error?: string | null
          last_sync_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          hubspot_id?: string
          email?: string | null
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          company?: string | null
          job_title?: string | null
          lifecycle_stage?: string | null
          lead_status?: string | null
          last_activity_date?: string | null
          properties?: Json | null
          sync_status?: 'pending' | 'synced' | 'error'
          sync_error?: string | null
          last_sync_at?: string | null
        }
      }
      properties_offmarket: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          address: string
          city: string
          state: string
          zip_code: string
          county: string
          property_type: string
          bedrooms: number | null
          bathrooms: number | null
          square_feet: number | null
          lot_size: number | null
          year_built: number | null
          estimated_value: number | null
          tax_assessed_value: number | null
          annual_taxes: number | null
          owner_name: string | null
          owner_phone: string | null
          owner_email: string | null
          mailing_address: string | null
          equity_estimate: number | null
          mortgage_balance: number | null
          last_sale_date: string | null
          last_sale_price: number | null
          latitude: number | null
          longitude: number | null
          propstream_id: string | null
          cook_county_pin: string | null
          enrichment_status: 'pending' | 'enriched' | 'error'
          enrichment_data: Json | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          address: string
          city: string
          state: string
          zip_code: string
          county: string
          property_type: string
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: number | null
          year_built?: number | null
          estimated_value?: number | null
          tax_assessed_value?: number | null
          annual_taxes?: number | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_email?: string | null
          mailing_address?: string | null
          equity_estimate?: number | null
          mortgage_balance?: number | null
          last_sale_date?: string | null
          last_sale_price?: number | null
          latitude?: number | null
          longitude?: number | null
          propstream_id?: string | null
          cook_county_pin?: string | null
          enrichment_status?: 'pending' | 'enriched' | 'error'
          enrichment_data?: Json | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          address?: string
          city?: string
          state?: string
          zip_code?: string
          county?: string
          property_type?: string
          bedrooms?: number | null
          bathrooms?: number | null
          square_feet?: number | null
          lot_size?: number | null
          year_built?: number | null
          estimated_value?: number | null
          tax_assessed_value?: number | null
          annual_taxes?: number | null
          owner_name?: string | null
          owner_phone?: string | null
          owner_email?: string | null
          mailing_address?: string | null
          equity_estimate?: number | null
          mortgage_balance?: number | null
          last_sale_date?: string | null
          last_sale_price?: number | null
          latitude?: number | null
          longitude?: number | null
          propstream_id?: string | null
          cook_county_pin?: string | null
          enrichment_status?: 'pending' | 'enriched' | 'error'
          enrichment_data?: Json | null
          is_active?: boolean
        }
      }
      contacts_properties: {
        Row: {
          id: string
          created_at: string
          contact_id: string
          property_id: string
          relationship_type: 'owner' | 'interested' | 'past_owner' | 'lead'
          confidence_score: number | null
          match_criteria: Json | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          contact_id: string
          property_id: string
          relationship_type: 'owner' | 'interested' | 'past_owner' | 'lead'
          confidence_score?: number | null
          match_criteria?: Json | null
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          contact_id?: string
          property_id?: string
          relationship_type?: 'owner' | 'interested' | 'past_owner' | 'lead'
          confidence_score?: number | null
          match_criteria?: Json | null
          is_active?: boolean
        }
      }
      cel_rules: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          name: string
          description: string | null
          cel_expression: string
          is_active: boolean
          priority: number
          alert_frequency: 'immediate' | 'daily' | 'weekly'
          last_triggered: string | null
          trigger_count: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          name: string
          description?: string | null
          cel_expression: string
          is_active?: boolean
          priority?: number
          alert_frequency?: 'immediate' | 'daily' | 'weekly'
          last_triggered?: string | null
          trigger_count?: number
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          name?: string
          description?: string | null
          cel_expression?: string
          is_active?: boolean
          priority?: number
          alert_frequency?: 'immediate' | 'daily' | 'weekly'
          last_triggered?: string | null
          trigger_count?: number
        }
      }
      alerts: {
        Row: {
          id: string
          created_at: string
          rule_id: string
          contact_id: string | null
          property_id: string | null
          alert_type: 'contact_property_match' | 'property_update' | 'new_contact' | 'custom'
          message: string
          severity: 'low' | 'medium' | 'high' | 'critical'
          is_read: boolean
          read_at: string | null
          metadata: Json | null
        }
        Insert: {
          id?: string
          created_at?: string
          rule_id: string
          contact_id?: string | null
          property_id?: string | null
          alert_type: 'contact_property_match' | 'property_update' | 'new_contact' | 'custom'
          message: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          is_read?: boolean
          read_at?: string | null
          metadata?: Json | null
        }
        Update: {
          id?: string
          created_at?: string
          rule_id?: string
          contact_id?: string | null
          property_id?: string | null
          alert_type?: 'contact_property_match' | 'property_update' | 'new_contact' | 'custom'
          message?: string
          severity?: 'low' | 'medium' | 'high' | 'critical'
          is_read?: boolean
          read_at?: string | null
          metadata?: Json | null
        }
      }
      audit_logs: {
        Row: {
          id: string
          created_at: string
          user_id: string | null
          action: string
          table_name: string | null
          record_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id?: string | null
          action: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string | null
          action?: string
          table_name?: string | null
          record_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}