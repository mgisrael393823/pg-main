-- Create sync_logs table for tracking sync operations
CREATE TABLE public.sync_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL,
    sync_type TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('started', 'completed', 'failed', 'cancelled')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    records_processed INTEGER DEFAULT 0,
    records_created INTEGER DEFAULT 0,
    records_updated INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_messages TEXT[],
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes
CREATE INDEX idx_sync_logs_user_id ON public.sync_logs(user_id);
CREATE INDEX idx_sync_logs_provider ON public.sync_logs(provider);
CREATE INDEX idx_sync_logs_status ON public.sync_logs(status);
CREATE INDEX idx_sync_logs_completed_at ON public.sync_logs(completed_at DESC);

-- Enable RLS
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view their own sync logs" ON public.sync_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sync logs" ON public.sync_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sync logs" ON public.sync_logs
    FOR UPDATE USING (auth.uid() = user_id);

-- Function to get last successful sync
CREATE OR REPLACE FUNCTION get_last_sync(
    p_user_id UUID,
    p_provider TEXT,
    p_sync_type TEXT
)
RETURNS TIMESTAMP WITH TIME ZONE AS $$
BEGIN
    RETURN (
        SELECT completed_at
        FROM public.sync_logs
        WHERE user_id = p_user_id
        AND provider = p_provider
        AND sync_type = p_sync_type
        AND status = 'completed'
        ORDER BY completed_at DESC
        LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;