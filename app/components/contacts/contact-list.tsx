'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { createClientSupabase } from '@/utils/supabase-client'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  User,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react'
import { formatDate, formatPhoneNumber, capitalize } from '@/utils/format'
import type { Contact } from '@/types/index'

interface ContactListProps {
  initialContacts?: Contact[]
}

export function ContactList({ initialContacts = [] }: ContactListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25
  
  const supabase = createClientSupabase()

  const { data, isLoading, error } = useQuery({
    queryKey: ['contacts', searchTerm, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('contacts')
        .select('*', { count: 'exact' })
        .order('last_activity_date', { ascending: false, nullsFirst: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)

      if (searchTerm) {
        query = query.or(`email.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%`)
      }

      const { data: contacts, count, error } = await query
      
      if (error) throw error

      return {
        contacts: contacts || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      }
    },
    initialData: initialContacts.length > 0 ? {
      contacts: initialContacts,
      totalCount: initialContacts.length,
      totalPages: 1,
    } : undefined,
  })

  const getLifecycleColor = (stage?: string | null) => {
    switch (stage) {
      case 'customer': return 'success'
      case 'opportunity': return 'warning'
      case 'lead': return 'default'
      default: return 'neutral'
    }
  }

  const getLeadStatusColor = (status?: string | null) => {
    switch (status) {
      case 'new': return 'default'
      case 'open': return 'warning'
      case 'in_progress': return 'warning'
      case 'open_deal': return 'success'
      case 'unqualified': return 'error'
      default: return 'neutral'
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-error">Failed to load contacts</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted" />
          <Input
            placeholder="Search by name, email, or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Contact List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-20 animate-pulse bg-secondary rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {data?.contacts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <User className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                <p className="text-foreground-secondary">
                  {searchTerm ? 'No contacts found matching your search' : 'No contacts synced yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {data?.contacts.map((contact) => (
                <Card key={contact.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium text-foreground">
                            {contact.first_name || contact.last_name
                              ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
                              : 'Unnamed Contact'}
                          </h3>
                          {contact.lifecycle_stage && (
                            <Badge variant={getLifecycleColor(contact.lifecycle_stage)} size="sm">
                              {capitalize(contact.lifecycle_stage)}
                            </Badge>
                          )}
                          {contact.lead_status && (
                            <Badge variant={getLeadStatusColor(contact.lead_status)} size="sm">
                              {contact.lead_status.split('_').map(capitalize).join(' ')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-foreground-secondary">
                          {contact.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{contact.email}</span>
                            </div>
                          )}
                          {contact.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{formatPhoneNumber(contact.phone)}</span>
                            </div>
                          )}
                          {contact.company && (
                            <div className="flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              <span>{contact.company}</span>
                            </div>
                          )}
                        </div>

                        {contact.job_title && (
                          <p className="text-sm text-foreground-muted">{contact.job_title}</p>
                        )}
                      </div>

                      <div className="text-right text-sm text-foreground-muted">
                        {contact.last_activity_date && (
                          <p>Last active: {formatDate(contact.last_activity_date)}</p>
                        )}
                        <Badge 
                          variant={contact.sync_status === 'synced' ? 'success' : 'neutral'} 
                          size="sm"
                          className="mt-1"
                        >
                          {contact.sync_status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-foreground-secondary">
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.totalCount)} of {data.totalCount} contacts
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(data.totalPages, prev + 1))}
                  disabled={currentPage === data.totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}