// Application constants

// API endpoints
export const API_ENDPOINTS = {
  CONTACTS: '/api/contacts',
  PROPERTIES: '/api/properties',
  ALERTS: '/api/alerts',
  RULES: '/api/rules',
  DASHBOARD: '/api/dashboard',
  UPLOAD: '/api/upload',
  HUBSPOT: '/api/integrations/hubspot',
  PROPSTREAM: '/api/integrations/propstream',
  COOK_COUNTY: '/api/integrations/cook-county',
} as const

// Route paths
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CONTACTS: '/contacts',
  PROPERTIES: '/properties',
  ALERTS: '/alerts',
  ANALYTICS: '/analytics',
} as const

// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  AGENT: 'agent',
  VIEWER: 'viewer',
} as const

// Sync statuses
export const SYNC_STATUSES = {
  PENDING: 'pending',
  SYNCED: 'synced',
  ERROR: 'error',
} as const

// Enrichment statuses
export const ENRICHMENT_STATUSES = {
  PENDING: 'pending',
  ENRICHED: 'enriched',
  ERROR: 'error',
} as const

// Relationship types
export const RELATIONSHIP_TYPES = {
  OWNER: 'owner',
  INTERESTED: 'interested',
  PAST_OWNER: 'past_owner',
  LEAD: 'lead',
} as const

// Alert frequencies
export const ALERT_FREQUENCIES = {
  IMMEDIATE: 'immediate',
  DAILY: 'daily',
  WEEKLY: 'weekly',
} as const

// Alert types
export const ALERT_TYPES = {
  CONTACT_PROPERTY_MATCH: 'contact_property_match',
  PROPERTY_UPDATE: 'property_update',
  NEW_CONTACT: 'new_contact',
  CUSTOM: 'custom',
} as const

// Alert severities
export const ALERT_SEVERITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const

// Property types
export const PROPERTY_TYPES = [
  'Single Family',
  'Condo',
  'Townhouse',
  'Multi-Family',
  'Vacant Land',
  'Commercial',
  'Industrial',
  'Other',
] as const

// Lifecycle stages
export const LIFECYCLE_STAGES = [
  'subscriber',
  'lead',
  'marketingqualifiedlead',
  'salesqualifiedlead',
  'opportunity',
  'customer',
  'evangelist',
  'other',
] as const

// Lead statuses
export const LEAD_STATUSES = [
  'new',
  'open',
  'in_progress',
  'open_deal',
  'unqualified',
  'attempted_to_contact',
  'connected',
  'bad_timing',
] as const

// US States
export const US_STATES = [
  { code: 'AL', name: 'Alabama' },
  { code: 'AK', name: 'Alaska' },
  { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },
  { code: 'CA', name: 'California' },
  { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },
  { code: 'DE', name: 'Delaware' },
  { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },
  { code: 'HI', name: 'Hawaii' },
  { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },
  { code: 'IN', name: 'Indiana' },
  { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },
  { code: 'KY', name: 'Kentucky' },
  { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },
  { code: 'MD', name: 'Maryland' },
  { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },
  { code: 'MN', name: 'Minnesota' },
  { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },
  { code: 'MT', name: 'Montana' },
  { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },
  { code: 'NH', name: 'New Hampshire' },
  { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },
  { code: 'NY', name: 'New York' },
  { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },
  { code: 'OH', name: 'Ohio' },
  { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },
  { code: 'PA', name: 'Pennsylvania' },
  { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },
  { code: 'SD', name: 'South Dakota' },
  { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },
  { code: 'UT', name: 'Utah' },
  { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },
  { code: 'WA', name: 'Washington' },
  { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },
  { code: 'WY', name: 'Wyoming' },
] as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 25,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const

// File upload
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 50,
  ALLOWED_TYPES: ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
  CHUNK_SIZE: 1000, // Number of rows to process at once
} as const

// Map configuration
export const MAP_CONFIG = {
  DEFAULT_ZOOM: 10,
  DEFAULT_CENTER: {
    lat: 41.8781, // Chicago
    lng: -87.6298,
  },
  MAX_ZOOM: 18,
  MIN_ZOOM: 3,
} as const

// Performance metrics targets
export const PERFORMANCE_TARGETS = {
  AGENT_ADOPTION: 0.7, // 70%
  DATA_ACCURACY: 0.95, // 95%
  PAGE_LOAD_TIME: 2000, // 2 seconds in ms
  SYSTEM_UPTIME: 0.99, // 99%
  USER_SATISFACTION: 4.0, // out of 5.0
} as const

// Feature flags
export const FEATURE_FLAGS = {
  ENABLE_ANALYTICS: process.env.NEXT_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_OFFLINE_MODE: process.env.NEXT_PUBLIC_ENABLE_OFFLINE_MODE === 'true',
  ENABLE_DEBUG_MODE: process.env.NEXT_PUBLIC_ENABLE_DEBUG_MODE === 'true',
} as const

// Rate limiting
export const RATE_LIMITS = {
  API_REQUESTS_PER_MINUTE: 100,
  FILE_UPLOADS_PER_HOUR: 10,
  SEARCH_REQUESTS_PER_MINUTE: 30,
} as const

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  USER_SESSION: 3600, // 1 hour
  DASHBOARD_STATS: 300, // 5 minutes
  SEARCH_RESULTS: 60, // 1 minute
  STATIC_DATA: 86400, // 24 hours
} as const

// Validation limits
export const VALIDATION_LIMITS = {
  MAX_NAME_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 500,
  MAX_ADDRESS_LENGTH: 200,
  MAX_EMAIL_LENGTH: 254,
  MAX_PHONE_LENGTH: 20,
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,
} as const