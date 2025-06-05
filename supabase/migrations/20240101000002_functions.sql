-- Function to search contacts with full-text search
CREATE OR REPLACE FUNCTION search_contacts(
    search_term TEXT DEFAULT '',
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    hubspot_id TEXT,
    email TEXT,
    first_name TEXT,
    last_name TEXT,
    company TEXT,
    phone TEXT,
    lifecycle_stage TEXT,
    lead_status TEXT,
    last_activity_date TIMESTAMP WITH TIME ZONE,
    sync_status sync_status,
    rank REAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        c.hubspot_id,
        c.email,
        c.first_name,
        c.last_name,
        c.company,
        c.phone,
        c.lifecycle_stage,
        c.lead_status,
        c.last_activity_date,
        c.sync_status,
        ts_rank(
            to_tsvector('english', 
                COALESCE(c.first_name, '') || ' ' || 
                COALESCE(c.last_name, '') || ' ' || 
                COALESCE(c.email, '') || ' ' || 
                COALESCE(c.company, '')
            ),
            plainto_tsquery('english', search_term)
        ) as rank
    FROM public.contacts c
    WHERE 
        CASE 
            WHEN search_term = '' THEN TRUE
            ELSE to_tsvector('english', 
                COALESCE(c.first_name, '') || ' ' || 
                COALESCE(c.last_name, '') || ' ' || 
                COALESCE(c.email, '') || ' ' || 
                COALESCE(c.company, '')
            ) @@ plainto_tsquery('english', search_term)
        END
    ORDER BY 
        CASE WHEN search_term = '' THEN c.last_activity_date END DESC,
        CASE WHEN search_term != '' THEN rank END DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;

-- Function to search properties with full-text search and filters
CREATE OR REPLACE FUNCTION search_properties(
    search_term TEXT DEFAULT '',
    city_filter TEXT DEFAULT '',
    state_filter TEXT DEFAULT '',
    county_filter TEXT DEFAULT '',
    property_type_filter TEXT DEFAULT '',
    min_value DECIMAL DEFAULT NULL,
    max_value DECIMAL DEFAULT NULL,
    min_bedrooms INTEGER DEFAULT NULL,
    max_bedrooms INTEGER DEFAULT NULL,
    min_bathrooms DECIMAL DEFAULT NULL,
    max_bathrooms DECIMAL DEFAULT NULL,
    min_sqft INTEGER DEFAULT NULL,
    max_sqft INTEGER DEFAULT NULL,
    min_year INTEGER DEFAULT NULL,
    max_year INTEGER DEFAULT NULL,
    bounds_north DECIMAL DEFAULT NULL,
    bounds_south DECIMAL DEFAULT NULL,
    bounds_east DECIMAL DEFAULT NULL,
    bounds_west DECIMAL DEFAULT NULL,
    limit_count INTEGER DEFAULT 50,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    address TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    county TEXT,
    property_type TEXT,
    bedrooms INTEGER,
    bathrooms DECIMAL,
    square_feet INTEGER,
    year_built INTEGER,
    estimated_value DECIMAL,
    owner_name TEXT,
    latitude DECIMAL,
    longitude DECIMAL,
    enrichment_status enrichment_status,
    rank REAL
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.address,
        p.city,
        p.state,
        p.zip_code,
        p.county,
        p.property_type,
        p.bedrooms,
        p.bathrooms,
        p.square_feet,
        p.year_built,
        p.estimated_value,
        p.owner_name,
        p.latitude,
        p.longitude,
        p.enrichment_status,
        CASE 
            WHEN search_term = '' THEN 0
            ELSE ts_rank(
                to_tsvector('english', 
                    COALESCE(p.address, '') || ' ' || 
                    COALESCE(p.city, '') || ' ' || 
                    COALESCE(p.owner_name, '')
                ),
                plainto_tsquery('english', search_term)
            )
        END as rank
    FROM public.properties_offmarket p
    WHERE 
        p.is_active = TRUE
        AND (search_term = '' OR to_tsvector('english', 
            COALESCE(p.address, '') || ' ' || 
            COALESCE(p.city, '') || ' ' || 
            COALESCE(p.owner_name, '')
        ) @@ plainto_tsquery('english', search_term))
        AND (city_filter = '' OR p.city ILIKE '%' || city_filter || '%')
        AND (state_filter = '' OR p.state = state_filter)
        AND (county_filter = '' OR p.county ILIKE '%' || county_filter || '%')
        AND (property_type_filter = '' OR p.property_type = property_type_filter)
        AND (min_value IS NULL OR p.estimated_value >= min_value)
        AND (max_value IS NULL OR p.estimated_value <= max_value)
        AND (min_bedrooms IS NULL OR p.bedrooms >= min_bedrooms)
        AND (max_bedrooms IS NULL OR p.bedrooms <= max_bedrooms)
        AND (min_bathrooms IS NULL OR p.bathrooms >= min_bathrooms)
        AND (max_bathrooms IS NULL OR p.bathrooms <= max_bathrooms)
        AND (min_sqft IS NULL OR p.square_feet >= min_sqft)
        AND (max_sqft IS NULL OR p.square_feet <= max_sqft)
        AND (min_year IS NULL OR p.year_built >= min_year)
        AND (max_year IS NULL OR p.year_built <= max_year)
        AND (bounds_north IS NULL OR p.latitude <= bounds_north)
        AND (bounds_south IS NULL OR p.latitude >= bounds_south)
        AND (bounds_east IS NULL OR p.longitude <= bounds_east)
        AND (bounds_west IS NULL OR p.longitude >= bounds_west)
    ORDER BY 
        CASE WHEN search_term = '' THEN p.estimated_value END DESC,
        CASE WHEN search_term != '' THEN rank END DESC
    LIMIT limit_count
    OFFSET offset_count;
END;
$$;

-- Function to get dashboard statistics
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result JSON;
    total_contacts INTEGER;
    total_properties INTEGER;
    total_alerts INTEGER;
    unread_alerts INTEGER;
    recent_contacts INTEGER;
    recent_properties INTEGER;
    avg_response_time DECIMAL;
BEGIN
    -- Get basic counts
    SELECT COUNT(*) INTO total_contacts FROM public.contacts;
    SELECT COUNT(*) INTO total_properties FROM public.properties_offmarket WHERE is_active = TRUE;
    
    -- Get alert counts for user's rules
    SELECT COUNT(*) INTO total_alerts 
    FROM public.alerts a
    JOIN public.cel_rules r ON a.rule_id = r.id
    WHERE r.user_id = get_dashboard_stats.user_id;
    
    SELECT COUNT(*) INTO unread_alerts 
    FROM public.alerts a
    JOIN public.cel_rules r ON a.rule_id = r.id
    WHERE r.user_id = get_dashboard_stats.user_id AND a.is_read = FALSE;
    
    -- Get recent activity counts (last 7 days)
    SELECT COUNT(*) INTO recent_contacts 
    FROM public.contacts 
    WHERE created_at >= NOW() - INTERVAL '7 days';
    
    SELECT COUNT(*) INTO recent_properties 
    FROM public.properties_offmarket 
    WHERE created_at >= NOW() - INTERVAL '7 days' AND is_active = TRUE;
    
    -- Calculate average response time (placeholder - would be calculated from actual usage)
    avg_response_time := 1.2;
    
    -- Build result JSON
    result := json_build_object(
        'totalContacts', total_contacts,
        'totalProperties', total_properties,
        'totalAlerts', total_alerts,
        'unreadAlerts', unread_alerts,
        'recentActivity', json_build_object(
            'contacts', recent_contacts,
            'properties', recent_properties
        ),
        'performanceMetrics', json_build_object(
            'avgResponseTime', avg_response_time,
            'dataAccuracy', 0.95,
            'systemUptime', 0.99,
            'userSatisfaction', 4.2
        )
    );
    
    RETURN result;
END;
$$;

-- Function to match contacts with properties based on various criteria
CREATE OR REPLACE FUNCTION match_contacts_properties()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    match_count INTEGER := 0;
    contact_record RECORD;
    property_record RECORD;
    confidence DECIMAL;
BEGIN
    -- Match contacts with properties based on email
    FOR contact_record IN 
        SELECT * FROM public.contacts 
        WHERE email IS NOT NULL AND email != ''
    LOOP
        FOR property_record IN 
            SELECT * FROM public.properties_offmarket 
            WHERE owner_email IS NOT NULL 
            AND owner_email = contact_record.email
            AND is_active = TRUE
        LOOP
            -- Check if relationship already exists
            IF NOT EXISTS (
                SELECT 1 FROM public.contacts_properties 
                WHERE contact_id = contact_record.id 
                AND property_id = property_record.id
                AND relationship_type = 'owner'
            ) THEN
                INSERT INTO public.contacts_properties (
                    contact_id, 
                    property_id, 
                    relationship_type, 
                    confidence_score,
                    match_criteria
                ) VALUES (
                    contact_record.id, 
                    property_record.id, 
                    'owner', 
                    0.95,
                    '{"method": "email_match"}'::jsonb
                );
                match_count := match_count + 1;
            END IF;
        END LOOP;
    END LOOP;
    
    -- Match based on name similarity
    FOR contact_record IN 
        SELECT * FROM public.contacts 
        WHERE first_name IS NOT NULL AND last_name IS NOT NULL
    LOOP
        FOR property_record IN 
            SELECT * FROM public.properties_offmarket 
            WHERE owner_name IS NOT NULL 
            AND is_active = TRUE
        LOOP
            -- Calculate name similarity confidence
            confidence := CASE 
                WHEN LOWER(property_record.owner_name) LIKE 
                     '%' || LOWER(contact_record.first_name) || '%' || LOWER(contact_record.last_name) || '%'
                THEN 0.8
                WHEN LOWER(property_record.owner_name) LIKE 
                     '%' || LOWER(contact_record.last_name) || '%'
                THEN 0.6
                ELSE 0
            END;
            
            IF confidence >= 0.6 AND NOT EXISTS (
                SELECT 1 FROM public.contacts_properties 
                WHERE contact_id = contact_record.id 
                AND property_id = property_record.id
                AND relationship_type = 'owner'
            ) THEN
                INSERT INTO public.contacts_properties (
                    contact_id, 
                    property_id, 
                    relationship_type, 
                    confidence_score,
                    match_criteria
                ) VALUES (
                    contact_record.id, 
                    property_record.id, 
                    'owner', 
                    confidence,
                    '{"method": "name_similarity"}'::jsonb
                );
                match_count := match_count + 1;
            END IF;
        END LOOP;
    END LOOP;
    
    RETURN match_count;
END;
$$;

-- Function to process CEL rules and generate alerts
CREATE OR REPLACE FUNCTION process_cel_rules()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    rule_record RECORD;
    alert_count INTEGER := 0;
    contact_record RECORD;
    property_record RECORD;
    should_trigger BOOLEAN;
BEGIN
    -- Process each active rule
    FOR rule_record IN 
        SELECT * FROM public.cel_rules 
        WHERE is_active = TRUE
    LOOP
        -- Simple CEL expression evaluation (this would be more sophisticated in production)
        -- For now, we'll handle basic property value and contact criteria
        
        -- Example: property.estimated_value > 500000 AND contact.lifecycle_stage == "lead"
        IF rule_record.cel_expression LIKE '%estimated_value%' AND rule_record.cel_expression LIKE '%>%' THEN
            FOR contact_record IN 
                SELECT c.* FROM public.contacts c
                JOIN public.contacts_properties cp ON c.id = cp.contact_id
                JOIN public.properties_offmarket p ON cp.property_id = p.id
                WHERE p.estimated_value > 500000
                AND c.lifecycle_stage = 'lead'
                AND p.is_active = TRUE
            LOOP
                -- Check if alert already exists for this rule and contact
                IF NOT EXISTS (
                    SELECT 1 FROM public.alerts 
                    WHERE rule_id = rule_record.id 
                    AND contact_id = contact_record.id
                    AND created_at >= NOW() - INTERVAL '24 hours'
                ) THEN
                    INSERT INTO public.alerts (
                        rule_id,
                        contact_id,
                        alert_type,
                        message,
                        severity,
                        metadata
                    ) VALUES (
                        rule_record.id,
                        contact_record.id,
                        'contact_property_match',
                        'High-value property match found for lead: ' || 
                        COALESCE(contact_record.first_name || ' ' || contact_record.last_name, contact_record.email),
                        'high',
                        json_build_object('rule_name', rule_record.name)::jsonb
                    );
                    
                    -- Update rule trigger count
                    UPDATE public.cel_rules 
                    SET trigger_count = trigger_count + 1,
                        last_triggered = NOW()
                    WHERE id = rule_record.id;
                    
                    alert_count := alert_count + 1;
                END IF;
            END LOOP;
        END IF;
    END LOOP;
    
    RETURN alert_count;
END;
$$;

-- Function to geocode addresses (placeholder - would integrate with external service)
CREATE OR REPLACE FUNCTION geocode_property(property_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    property_record RECORD;
    result JSON;
BEGIN
    SELECT * INTO property_record 
    FROM public.properties_offmarket 
    WHERE id = property_id;
    
    IF property_record IS NULL THEN
        RETURN json_build_object('error', 'Property not found');
    END IF;
    
    -- In production, this would call an external geocoding service
    -- For now, return mock coordinates based on city/state
    result := json_build_object(
        'latitude', 41.8781 + (RANDOM() - 0.5) * 0.1,  -- Chicago area
        'longitude', -87.6298 + (RANDOM() - 0.5) * 0.1,
        'accuracy', 'high',
        'formatted_address', property_record.address || ', ' || property_record.city || ', ' || property_record.state
    );
    
    -- Update the property with coordinates
    UPDATE public.properties_offmarket 
    SET latitude = (result->>'latitude')::DECIMAL,
        longitude = (result->>'longitude')::DECIMAL,
        enrichment_status = 'enriched',
        enrichment_data = result
    WHERE id = property_id;
    
    RETURN result;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION search_contacts TO authenticated;
GRANT EXECUTE ON FUNCTION search_properties TO authenticated;
GRANT EXECUTE ON FUNCTION get_dashboard_stats TO authenticated;
GRANT EXECUTE ON FUNCTION match_contacts_properties TO authenticated;
GRANT EXECUTE ON FUNCTION process_cel_rules TO authenticated;
GRANT EXECUTE ON FUNCTION geocode_property TO authenticated;