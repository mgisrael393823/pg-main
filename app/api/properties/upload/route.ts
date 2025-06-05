import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/utils/supabase-server'
import Papa from 'papaparse'
import { z } from 'zod'
import { FILE_UPLOAD } from '@/utils/constants'

// PropStream CSV field mapping
const FIELD_MAPPING = {
  'Property Address': 'address',
  'Address': 'address',
  'City': 'city',
  'State': 'state',
  'Zip': 'zip_code',
  'Zip Code': 'zip_code',
  'County': 'county',
  'Property Type': 'property_type',
  'Bedrooms': 'bedrooms',
  'Bathrooms': 'bathrooms',
  'Square Feet': 'square_feet',
  'Lot Size': 'lot_size',
  'Year Built': 'year_built',
  'Estimated Value': 'estimated_value',
  'Tax Assessed Value': 'tax_assessed_value',
  'Annual Taxes': 'annual_taxes',
  'Owner Name': 'owner_name',
  'Owner Phone': 'owner_phone',
  'Owner Email': 'owner_email',
  'Mailing Address': 'mailing_address',
  'Equity Estimate': 'equity_estimate',
  'Mortgage Balance': 'mortgage_balance',
  'Last Sale Date': 'last_sale_date',
  'Last Sale Price': 'last_sale_price',
  'Latitude': 'latitude',
  'Longitude': 'longitude',
  'PropStream ID': 'propstream_id',
}

// Schema for validating property data
const propertySchema = z.object({
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zip_code: z.string().min(1),
  county: z.string().min(1),
  property_type: z.string().min(1),
  bedrooms: z.number().optional().nullable(),
  bathrooms: z.number().optional().nullable(),
  square_feet: z.number().optional().nullable(),
  lot_size: z.number().optional().nullable(),
  year_built: z.number().optional().nullable(),
  estimated_value: z.number().optional().nullable(),
  tax_assessed_value: z.number().optional().nullable(),
  annual_taxes: z.number().optional().nullable(),
  owner_name: z.string().optional().nullable(),
  owner_phone: z.string().optional().nullable(),
  owner_email: z.string().email().optional().nullable().or(z.literal('')),
  mailing_address: z.string().optional().nullable(),
  equity_estimate: z.number().optional().nullable(),
  mortgage_balance: z.number().optional().nullable(),
  last_sale_date: z.string().optional().nullable(),
  last_sale_price: z.number().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  propstream_id: z.string().optional().nullable(),
  enrichment_status: z.enum(['pending', 'enriched', 'error']).default('pending'),
  is_active: z.boolean().default(true),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get uploaded file
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > FILE_UPLOAD.MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File size exceeds ${FILE_UPLOAD.MAX_SIZE_MB}MB limit` },
        { status: 400 }
      )
    }

    // Read file content
    const text = await file.text()
    
    // Parse CSV
    const parseResult = Papa.parse(text, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    })

    if (parseResult.errors.length > 0) {
      return NextResponse.json(
        { error: 'CSV parsing failed', details: parseResult.errors },
        { status: 400 }
      )
    }

    const rows = parseResult.data as Record<string, any>[]
    
    if (rows.length === 0) {
      return NextResponse.json(
        { error: 'No data found in CSV' },
        { status: 400 }
      )
    }

    // Process rows in batches
    const batchSize = FILE_UPLOAD.CHUNK_SIZE
    let processed = 0
    let successful = 0
    let failed = 0
    const errors: string[] = []

    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize)
      const validProperties: any[] = []
      const rawRecords: any[] = []

      for (const [index, row] of batch.entries()) {
        const rowNumber = i + index + 2 // +2 for header and 0-based index
        
        try {
          // Map CSV fields to database fields
          const mappedData: any = {}
          for (const [csvField, dbField] of Object.entries(FIELD_MAPPING)) {
            if (row[csvField] !== undefined && row[csvField] !== null && row[csvField] !== '') {
              mappedData[dbField] = row[csvField]
            }
          }

          // Clean and validate data
          if (mappedData.owner_email === '') {
            mappedData.owner_email = null
          }

          // Parse dates
          if (mappedData.last_sale_date) {
            const date = new Date(mappedData.last_sale_date)
            if (!isNaN(date.getTime())) {
              mappedData.last_sale_date = date.toISOString().split('T')[0]
            } else {
              mappedData.last_sale_date = null
            }
          }

          // Validate property data
          const validatedData = propertySchema.parse(mappedData)
          
          // Add metadata to create complete property object
          const propertyWithMetadata = {
            ...validatedData,
            enrichment_status: 'pending' as const,
            is_active: true
          }

          validProperties.push(propertyWithMetadata)
          
          // Store raw data for audit
          rawRecords.push({
            filename: file.name,
            row_number: rowNumber,
            raw_data: row,
            processing_status: 'pending',
          })

        } catch (error) {
          failed++
          const errorMessage = error instanceof z.ZodError 
            ? `Row ${rowNumber}: ${error.errors.map(e => e.message).join(', ')}`
            : `Row ${rowNumber}: Invalid data`
          errors.push(errorMessage)
          
          // Store failed record
          rawRecords.push({
            filename: file.name,
            row_number: rowNumber,
            raw_data: row,
            processing_status: 'error',
            processing_error: errorMessage,
          })
        }
      }

      // Insert valid properties
      if (validProperties.length > 0) {
        const { data: insertedProperties, error: insertError } = await supabase
          .from('properties_offmarket')
          .insert(validProperties)
          .select('id')

        if (insertError) {
          failed += validProperties.length
          errors.push(`Batch insert failed: ${insertError.message}`)
        } else {
          successful += insertedProperties?.length || 0
          
          // Update raw records with processed property IDs
          if (insertedProperties) {
            for (let j = 0; j < insertedProperties.length; j++) {
              const record = rawRecords[j]
              if (record && record.processing_status === 'pending') {
                record.processed_property_id = insertedProperties[j]?.id
                record.processing_status = 'synced'
              }
            }
          }
        }
      }

      // Store raw records
      if (rawRecords.length > 0) {
        await supabase
          .from('properties_offmarket_raw')
          .insert(rawRecords)
      }

      processed += batch.length
    }

    // Log upload
    await supabase
      .from('sync_logs')
      .insert({
        user_id: user.id,
        provider: 'propstream',
        sync_type: 'properties',
        status: failed === rows.length ? 'failed' : 'completed',
        records_processed: processed,
        records_created: successful,
        records_failed: failed,
        error_messages: errors.length > 0 ? errors.slice(0, 100) : null, // Limit errors
        metadata: {
          filename: file.name,
          fileSize: file.size,
          totalRows: rows.length,
        },
        completed_at: new Date().toISOString(),
      })

    return NextResponse.json({
      success: true,
      total: rows.length,
      processed,
      successful,
      failed,
      errors: errors.slice(0, 10), // Return first 10 errors
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Upload failed', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}