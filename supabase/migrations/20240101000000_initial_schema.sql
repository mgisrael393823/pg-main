-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'agent', 'viewer');
CREATE TYPE sync_status AS ENUM ('pending', 'synced', 'error');
CREATE TYPE enrichment_status AS ENUM ('pending', 'enriched', 'error');
CREATE TYPE relationship_type AS ENUM ('owner', 'interested', 'past_owner', 'lead');
CREATE TYPE alert_frequency AS ENUM ('immediate', 'daily', 'weekly');
CREATE TYPE alert_type AS ENUM ('contact_property_match', 'property_update', 'new_contact', 'custom');
CREATE TYPE alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    role user_role DEFAULT 'agent' NOT NULL,
    hubspot_user_id TEXT,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    last_login TIMESTAMP WITH TIME ZONE,
    preferences JSONB DEFAULT '{}'::jsonb
);

-- Contacts table (HubSpot contacts)
CREATE TABLE public.contacts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    hubspot_id TEXT NOT NULL UNIQUE,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    company TEXT,
    job_title TEXT,
    lifecycle_stage TEXT,
    lead_status TEXT,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    properties JSONB DEFAULT '{}'::jsonb,
    sync_status sync_status DEFAULT 'pending' NOT NULL,
    sync_error TEXT,
    last_sync_at TIMESTAMP WITH TIME ZONE
);

-- Properties table (PropStream off-market properties)
CREATE TABLE public.properties_offmarket (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    county TEXT NOT NULL,
    property_type TEXT NOT NULL,
    bedrooms INTEGER,
    bathrooms DECIMAL(3,1),
    square_feet INTEGER,
    lot_size INTEGER,
    year_built INTEGER,
    estimated_value DECIMAL(12,2),
    tax_assessed_value DECIMAL(12,2),
    annual_taxes DECIMAL(10,2),
    owner_name TEXT,
    owner_phone TEXT,
    owner_email TEXT,
    mailing_address TEXT,
    equity_estimate DECIMAL(12,2),
    mortgage_balance DECIMAL(12,2),
    last_sale_date DATE,
    last_sale_price DECIMAL(12,2),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    propstream_id TEXT,
    cook_county_pin TEXT,
    enrichment_status enrichment_status DEFAULT 'pending' NOT NULL,
    enrichment_data JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE NOT NULL
);

-- Raw PropStream data table (for audit trail)
CREATE TABLE public.properties_offmarket_raw (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    filename TEXT NOT NULL,
    row_number INTEGER NOT NULL,
    raw_data JSONB NOT NULL,
    processed_property_id UUID REFERENCES public.properties_offmarket(id),
    processing_status sync_status DEFAULT 'pending' NOT NULL,
    processing_error TEXT
);

-- Contact-Property relationships (many-to-many)
CREATE TABLE public.contacts_properties (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE NOT NULL,
    property_id UUID REFERENCES public.properties_offmarket(id) ON DELETE CASCADE NOT NULL,
    relationship_type relationship_type NOT NULL,
    confidence_score DECIMAL(3,2) CHECK (confidence_score >= 0 AND confidence_score <= 1),
    match_criteria JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    UNIQUE(contact_id, property_id, relationship_type)
);

-- CEL Rules table (alert rules)
CREATE TABLE public.cel_rules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    cel_expression TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    priority INTEGER DEFAULT 1 NOT NULL CHECK (priority >= 1 AND priority <= 10),
    alert_frequency alert_frequency DEFAULT 'immediate' NOT NULL,
    last_triggered TIMESTAMP WITH TIME ZONE,
    trigger_count INTEGER DEFAULT 0 NOT NULL
);

-- Alerts table
CREATE TABLE public.alerts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    rule_id UUID REFERENCES public.cel_rules(id) ON DELETE CASCADE NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE SET NULL,
    property_id UUID REFERENCES public.properties_offmarket(id) ON DELETE SET NULL,
    alert_type alert_type NOT NULL,
    message TEXT NOT NULL,
    severity alert_severity DEFAULT 'medium' NOT NULL,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Audit logs table
CREATE TABLE public.audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    table_name TEXT,
    record_id TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT
);

-- Create indexes for performance
CREATE INDEX idx_contacts_hubspot_id ON public.contacts(hubspot_id);
CREATE INDEX idx_contacts_email ON public.contacts(email);
CREATE INDEX idx_contacts_sync_status ON public.contacts(sync_status);
CREATE INDEX idx_contacts_last_sync_at ON public.contacts(last_sync_at);

CREATE INDEX idx_properties_address ON public.properties_offmarket(address);
CREATE INDEX idx_properties_city_state ON public.properties_offmarket(city, state);
CREATE INDEX idx_properties_county ON public.properties_offmarket(county);
CREATE INDEX idx_properties_property_type ON public.properties_offmarket(property_type);
CREATE INDEX idx_properties_estimated_value ON public.properties_offmarket(estimated_value);
CREATE INDEX idx_properties_owner_name ON public.properties_offmarket(owner_name);
CREATE INDEX idx_properties_propstream_id ON public.properties_offmarket(propstream_id);
CREATE INDEX idx_properties_cook_county_pin ON public.properties_offmarket(cook_county_pin);
CREATE INDEX idx_properties_enrichment_status ON public.properties_offmarket(enrichment_status);
CREATE INDEX idx_properties_is_active ON public.properties_offmarket(is_active);

-- Geospatial index for location-based queries
CREATE INDEX idx_properties_location ON public.properties_offmarket USING GIST(ST_Point(longitude, latitude));

CREATE INDEX idx_contacts_properties_contact_id ON public.contacts_properties(contact_id);
CREATE INDEX idx_contacts_properties_property_id ON public.contacts_properties(property_id);
CREATE INDEX idx_contacts_properties_relationship_type ON public.contacts_properties(relationship_type);
CREATE INDEX idx_contacts_properties_is_active ON public.contacts_properties(is_active);

CREATE INDEX idx_cel_rules_user_id ON public.cel_rules(user_id);
CREATE INDEX idx_cel_rules_is_active ON public.cel_rules(is_active);

CREATE INDEX idx_alerts_rule_id ON public.alerts(rule_id);
CREATE INDEX idx_alerts_contact_id ON public.alerts(contact_id);
CREATE INDEX idx_alerts_property_id ON public.alerts(property_id);
CREATE INDEX idx_alerts_is_read ON public.alerts(is_read);
CREATE INDEX idx_alerts_created_at ON public.alerts(created_at DESC);
CREATE INDEX idx_alerts_severity ON public.alerts(severity);

CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Full-text search indexes
CREATE INDEX idx_contacts_search ON public.contacts USING GIN(
    to_tsvector('english', 
        COALESCE(first_name, '') || ' ' || 
        COALESCE(last_name, '') || ' ' || 
        COALESCE(email, '') || ' ' || 
        COALESCE(company, '')
    )
);

CREATE INDEX idx_properties_search ON public.properties_offmarket USING GIN(
    to_tsvector('english', 
        COALESCE(address, '') || ' ' || 
        COALESCE(city, '') || ' ' || 
        COALESCE(owner_name, '')
    )
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON public.contacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties_offmarket FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cel_rules_updated_at BEFORE UPDATE ON public.cel_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();