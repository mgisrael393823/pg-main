// Currency formatting
export const formatCurrency = (
  amount: number | null | undefined,
  options?: Intl.NumberFormatOptions
): string => {
  if (amount === null || amount === undefined) return 'N/A'
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options,
  }).format(amount)
}

// Number formatting
export const formatNumber = (
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions
): string => {
  if (value === null || value === undefined) return 'N/A'
  
  return new Intl.NumberFormat('en-US', options).format(value)
}

// Date formatting
export const formatDate = (
  date: string | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return 'N/A'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(dateObj)
}

// Relative time formatting (e.g., "2 hours ago")
export const formatRelativeTime = (date: string | Date | null | undefined): string => {
  if (!date) return 'N/A'
  
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)
  
  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  
  return formatDate(dateObj)
}

// Phone number formatting
export const formatPhoneNumber = (phone: string | null | undefined): string => {
  if (!phone) return 'N/A'
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '')
  
  // Handle different lengths
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`
  }
  
  return phone // Return original if we can't format
}

// Address formatting
export const formatAddress = (
  address?: string | null,
  city?: string | null,
  state?: string | null,
  zipCode?: string | null
): string => {
  const parts = [address, city, state, zipCode].filter(Boolean)
  return parts.length > 0 ? parts.join(', ') : 'N/A'
}

// Name formatting
export const formatName = (
  firstName?: string | null,
  lastName?: string | null
): string => {
  const parts = [firstName, lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : 'N/A'
}

// Percentage formatting
export const formatPercentage = (
  value: number | null | undefined,
  options?: Intl.NumberFormatOptions
): string => {
  if (value === null || value === undefined) return 'N/A'
  
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
    ...options,
  }).format(value / 100)
}

// File size formatting
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Truncate text
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

// Capitalize first letter
export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Format property type
export const formatPropertyType = (type: string | null | undefined): string => {
  if (!type) return 'N/A'
  return type
    .split('_')
    .map(word => capitalize(word))
    .join(' ')
}

// Format sync status
export const formatSyncStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: 'Pending',
    synced: 'Synced',
    error: 'Error',
    enriched: 'Enriched',
  }
  
  return statusMap[status] || capitalize(status)
}

// Format confidence score
export const formatConfidence = (score: number | null | undefined): string => {
  if (score === null || score === undefined) return 'N/A'
  return formatPercentage(score * 100)
}