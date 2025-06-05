'use client'

import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { createClientSupabase } from '../../utils/supabase-client'
import { Card, CardContent } from '../ui/card'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  Search, 
  ChevronLeft,
  ChevronRight,
  Filter,
  Building2
} from 'lucide-react'
import { formatCurrency, formatDate, formatAddress } from '../../utils/format'
import type { Property } from '@/types/index'

interface PropertyListProps {
  initialProperties?: Property[]
}

export function PropertyList({ initialProperties = [] }: PropertyListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 25
  
  const supabase = createClientSupabase()

  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', searchTerm, currentPage],
    queryFn: async () => {
      let query = supabase
        .from('properties_offmarket')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)

      if (searchTerm) {
        query = query.or(`address.ilike.%${searchTerm}%,city.ilike.%${searchTerm}%,owner_name.ilike.%${searchTerm}%`)
      }

      const { data: properties, count, error } = await query
      
      if (error) throw error

      return {
        properties: properties || [],
        totalCount: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
      }
    },
    initialData: initialProperties.length > 0 ? {
      properties: initialProperties,
      totalCount: initialProperties.length,
      totalPages: 1,
    } : undefined,
  })

  const getPropertyTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'single family': return 'default'
      case 'condo': return 'success'
      case 'townhouse': return 'warning'
      case 'multi-family': return 'error'
      default: return 'neutral'
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-error">Failed to load properties</p>
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
            placeholder="Search by address, city, or owner name..."
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

      {/* Property List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="h-24 animate-pulse bg-secondary rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {data?.properties.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Building2 className="h-12 w-12 text-foreground-muted mx-auto mb-4" />
                <p className="text-foreground-secondary">
                  {searchTerm ? 'No properties found matching your search' : 'No properties imported yet'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {data?.properties.map((property) => (
                <Card key={property.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium text-foreground">
                              {property.address}
                            </h3>
                            <p className="text-sm text-foreground-secondary">
                              {formatAddress(null, property.city, property.state, property.zip_code)}
                            </p>
                          </div>
                          <Badge variant={getPropertyTypeColor(property.property_type)} size="sm">
                            {property.property_type}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-foreground-muted">Est. Value</p>
                            <p className="font-medium text-foreground">
                              {formatCurrency(property.estimated_value)}
                            </p>
                          </div>
                          <div>
                            <p className="text-foreground-muted">Property Details</p>
                            <p className="font-medium text-foreground">
                              {property.bedrooms || '-'} bed, {property.bathrooms || '-'} bath
                              {property.square_feet && `, ${property.square_feet.toLocaleString()} sqft`}
                            </p>
                          </div>
                          <div>
                            <p className="text-foreground-muted">Owner</p>
                            <p className="font-medium text-foreground">
                              {property.owner_name || 'Unknown'}
                            </p>
                          </div>
                          <div>
                            <p className="text-foreground-muted">Last Sale</p>
                            <p className="font-medium text-foreground">
                              {property.last_sale_date ? formatDate(property.last_sale_date) : 'N/A'}
                              {property.last_sale_price && ` - ${formatCurrency(property.last_sale_price)}`}
                            </p>
                          </div>
                        </div>

                        {property.equity_estimate && (
                          <div className="flex items-center gap-4 pt-2 border-t border-border">
                            <div className="text-sm">
                              <span className="text-foreground-muted">Equity Estimate: </span>
                              <span className="font-medium text-success">
                                {formatCurrency(property.equity_estimate)}
                              </span>
                            </div>
                            {property.annual_taxes && (
                              <div className="text-sm">
                                <span className="text-foreground-muted">Annual Taxes: </span>
                                <span className="font-medium text-foreground">
                                  {formatCurrency(property.annual_taxes)}
                                </span>
                              </div>
                            )}
                          </div>
                        )}
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
                Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.totalCount)} of {data.totalCount} properties
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