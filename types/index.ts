import { Database } from './database.types'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type User = Tables<'users'>
export type Contact = Tables<'contacts'>
export type Property = Tables<'properties_offmarket'>
export type ContactProperty = Tables<'contacts_properties'>
export type CelRule = Tables<'cel_rules'>
export type Alert = Tables<'alerts'>
export type AuditLog = Tables<'audit_logs'>

export interface ContactWithProperties extends Contact {
  properties: ContactProperty[]
}

export interface PropertyWithContacts extends Property {
  contacts: ContactProperty[]
}

export interface AlertWithRelations extends Alert {
  rule?: CelRule
  contact?: Contact
  property?: Property
}

export interface PropertySearchFilters {
  city?: string
  state?: string
  county?: string
  propertyType?: string
  minValue?: number
  maxValue?: number
  minBedrooms?: number
  maxBedrooms?: number
  minBathrooms?: number
  maxBathrooms?: number
  minSquareFeet?: number
  maxSquareFeet?: number
  minYearBuilt?: number
  maxYearBuilt?: number
  ownerName?: string
  hasEquity?: boolean
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
}

export interface ContactSearchFilters {
  name?: string
  email?: string
  company?: string
  lifecycleStage?: string
  leadStatus?: string
  lastActivityAfter?: string
  lastActivityBefore?: string
}

export interface HubSpotContact {
  id: string
  properties: {
    email?: string
    firstname?: string
    lastname?: string
    phone?: string
    company?: string
    jobtitle?: string
    hs_lead_status?: string
    lifecyclestage?: string
    lastmodifieddate?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
  archived: boolean
}

export interface PropStreamProperty {
  address: string
  city: string
  state: string
  zipCode: string
  county: string
  propertyType: string
  bedrooms?: number
  bathrooms?: number
  squareFeet?: number
  lotSize?: number
  yearBuilt?: number
  estimatedValue?: number
  taxAssessedValue?: number
  annualTaxes?: number
  ownerName?: string
  ownerPhone?: string
  ownerEmail?: string
  mailingAddress?: string
  equityEstimate?: number
  mortgageBalance?: number
  lastSaleDate?: string
  lastSalePrice?: number
  latitude?: number
  longitude?: number
  propstreamId?: string
}

export interface CookCountyProperty {
  pin: string
  address: string
  taxYear: number
  assessedValue: number
  exemptions: Array<{
    code: string
    amount: number
  }>
  taxBill: {
    total: number
    installments: Array<{
      number: number
    amount: number
      dueDate: string
    }>
  }
  characteristics: {
    propertyClass: string
    landSquareFeet?: number
    buildingSquareFeet?: number
    yearBuilt?: number
    bedrooms?: number
    bathrooms?: number
  }
}

export interface MapBounds {
  north: number
  south: number
  east: number
  west: number
}

export interface GeocodeResult {
  latitude: number
  longitude: number
  formattedAddress: string
  confidence: number
}

export interface AlertRule {
  id: string
  name: string
  description?: string
  celExpression: string
  isActive: boolean
  priority: number
  alertFrequency: 'immediate' | 'daily' | 'weekly'
  lastTriggered?: string
  triggerCount: number
}

export interface DashboardStats {
  totalContacts: number
  totalProperties: number
  totalAlerts: number
  unreadAlerts: number
  recentActivity: Array<{
    id: string
    type: 'contact' | 'property' | 'alert'
    title: string
    description: string
    timestamp: string
  }>
  performanceMetrics: {
    avgResponseTime: number
    dataAccuracy: number
    systemUptime: number
    userSatisfaction: number
  }
}

export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  status: number
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export type SortDirection = 'asc' | 'desc'

export interface SortConfig {
  field: string
  direction: SortDirection
}

export interface FilterConfig {
  field: string
  operator: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'contains' | 'starts_with' | 'ends_with'
  value: any
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system'
  notifications: {
    email: boolean
    push: boolean
    frequency: 'immediate' | 'daily' | 'weekly'
  }
  dashboard: {
    defaultView: 'grid' | 'list'
    itemsPerPage: number
    showMetrics: boolean
  }
  map: {
    defaultZoom: number
    defaultCenter: {
      lat: number
      lng: number
    }
    preferredLayer: 'satellite' | 'street' | 'terrain'
  }
}