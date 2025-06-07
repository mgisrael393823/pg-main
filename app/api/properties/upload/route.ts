import { NextResponse } from 'next/server'
import Papa from 'papaparse'
import { createServiceSupabase, createServerSupabase } from '@/utils/supabase-server'
import { sanitizeInput } from '@/utils/validation'
import type { TablesInsert } from '@/types/index'

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10MB
const REQUIRED_HEADERS = ['Property Address', 'City', 'State', 'Zip']

function cors() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: cors() })
}

export async function POST(req: Request) {
  const supabase = createServerSupabase()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: cors() })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) {
    return NextResponse.json({ error: 'File missing' }, { status: 400, headers: cors() })
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: 'File too large' }, { status: 400, headers: cors() })
  }

  if (!file.name.toLowerCase().endsWith('.csv')) {
    return NextResponse.json({ error: 'Invalid file type' }, { status: 400, headers: cors() })
  }

  const text = await file.text()

  const parsed = Papa.parse<Record<string, string>>(text, { header: true, skipEmptyLines: true })
  if (parsed.errors.length > 0) {
    return NextResponse.json({ error: 'Failed to parse CSV' }, { status: 400, headers: cors() })
  }

  const headers = parsed.meta.fields || []
  const missing = REQUIRED_HEADERS.filter(h => !headers.includes(h))
  if (missing.length) {
    return NextResponse.json({ error: `Missing headers: ${missing.join(', ')}` }, { status: 400, headers: cors() })
  }

  const serviceSupabase = createServiceSupabase()

  let total = 0
  let successful = 0
  let failed = 0
  for (const row of parsed.data) {
    total++
    try {
      const address = sanitizeInput(row['Property Address'] || '')
      const city = sanitizeInput(row['City'] || '')
      const state = sanitizeInput(row['State'] || '')
      const zip = sanitizeInput(row['Zip'] || '')
      if (!address || !city || !state || !zip) {
        failed++
        continue
      }

      const { data: existing } = await serviceSupabase
        .from('properties_offmarket')
        .select('id')
        .eq('address', address)
        .eq('city', city)
        .eq('state', state)
        .eq('zip_code', zip)
        .maybeSingle()

      if (existing) {
        continue
      }

      const property: TablesInsert<'properties_offmarket'> = {
        address,
        city,
        state,
        zip_code: zip,
        county: sanitizeInput(row['County'] || ''),
        property_type: sanitizeInput(row['Property Type'] || ''),
        bedrooms: row['Bedrooms'] ? Number(row['Bedrooms']) : null,
        bathrooms: row['Bathrooms'] ? Number(row['Bathrooms']) : null,
        square_feet: row['Square Feet'] ? Number(row['Square Feet']) : null,
        lot_size: row['Lot Size'] ? Number(row['Lot Size']) : null,
        year_built: row['Year Built'] ? Number(row['Year Built']) : null,
        estimated_value: row['Estimated Value'] ? Number(row['Estimated Value']) : null,
        tax_assessed_value: row['Tax Assessed Value'] ? Number(row['Tax Assessed Value']) : null,
        annual_taxes: row['Annual Taxes'] ? Number(row['Annual Taxes']) : null,
        owner_name: sanitizeInput(row['Owner Name'] || ''),
        owner_phone: sanitizeInput(row['Owner Phone'] || ''),
        owner_email: sanitizeInput(row['Owner Email'] || ''),
        mailing_address: sanitizeInput(row['Mailing Address'] || ''),
        is_active: true,
        enrichment_status: 'pending',
      }

      const { error } = await serviceSupabase.from('properties_offmarket').insert(property)
      if (error) {
        failed++
      } else {
        successful++
      }
    } catch (err) {
      failed++
    }
  }

  await serviceSupabase.from('audit_logs').insert({
    user_id: user.id,
    action: 'import_properties',
    table_name: 'properties_offmarket',
    new_values: { records_created: successful },
  } as any)

  return NextResponse.json({ total, successful, failed }, { headers: cors() })
}
