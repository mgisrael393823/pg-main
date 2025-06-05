-- Create auth_states table for OAuth state verification
CREATE TABLE public.auth_states (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    state TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Create integrations table for storing OAuth tokens
CREATE TABLE public.integrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP WITH TIME ZONE,
    account_id TEXT,
    account_name TEXT,
    scopes TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    UNIQUE(user_id, provider)
);

-- Create indexes
CREATE INDEX idx_auth_states_user_id ON public.auth_states(user_id);
CREATE INDEX idx_auth_states_expires_at ON public.auth_states(expires_at);
CREATE INDEX idx_integrations_user_id ON public.integrations(user_id);
CREATE INDEX idx_integrations_provider ON public.integrations(provider);
CREATE INDEX idx_integrations_expires_at ON public.integrations(expires_at);

-- Enable RLS
ALTER TABLE public.auth_states ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- RLS policies for auth_states
CREATE POLICY "Users can create their own auth states" ON public.auth_states
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own auth states" ON public.auth_states
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can delete expired auth states" ON public.auth_states
    FOR DELETE USING (expires_at < NOW());

-- RLS policies for integrations
CREATE POLICY "Users can view their own integrations" ON public.integrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own integrations" ON public.integrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own integrations" ON public.integrations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own integrations" ON public.integrations
    FOR DELETE USING (auth.uid() = user_id);

-- Function to clean up expired auth states
CREATE OR REPLACE FUNCTION cleanup_expired_auth_states()
RETURNS void AS $$
BEGIN
    DELETE FROM public.auth_states
    WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to refresh HubSpot token
CREATE OR REPLACE FUNCTION refresh_hubspot_token(integration_id UUID)
RETURNS JSONB AS $$
DECLARE
    integration_record RECORD;
    new_tokens JSONB;
BEGIN
    -- Get integration record
    SELECT * INTO integration_record
    FROM public.integrations
    WHERE id = integration_id AND provider = 'hubspot';
    
    IF integration_record IS NULL THEN
        RETURN jsonb_build_object('error', 'Integration not found');
    END IF;
    
    -- This is a placeholder - actual implementation would call HubSpot API
    -- In production, this would be handled by an Edge Function
    RETURN jsonb_build_object(
        'success', true,
        'message', 'Token refresh should be handled by Edge Function'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;