-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties_offmarket ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties_offmarket_raw ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cel_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = user_id AND role = 'admin' AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user is agent or admin
CREATE OR REPLACE FUNCTION is_agent_or_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = user_id AND role IN ('admin', 'agent') AND is_active = TRUE
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can insert users" ON public.users
    FOR INSERT WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update all users" ON public.users
    FOR UPDATE USING (is_admin(auth.uid()));

-- Contacts table policies
CREATE POLICY "Agents and admins can view contacts" ON public.contacts
    FOR SELECT USING (is_agent_or_admin(auth.uid()));

CREATE POLICY "Agents and admins can insert contacts" ON public.contacts
    FOR INSERT WITH CHECK (is_agent_or_admin(auth.uid()));

CREATE POLICY "Agents and admins can update contacts" ON public.contacts
    FOR UPDATE USING (is_agent_or_admin(auth.uid()));

CREATE POLICY "Admins can delete contacts" ON public.contacts
    FOR DELETE USING (is_admin(auth.uid()));

-- Properties table policies
CREATE POLICY "Agents and admins can view properties" ON public.properties_offmarket
    FOR SELECT USING (is_agent_or_admin(auth.uid()));

CREATE POLICY "Agents and admins can insert properties" ON public.properties_offmarket
    FOR INSERT WITH CHECK (is_agent_or_admin(auth.uid()));

CREATE POLICY "Agents and admins can update properties" ON public.properties_offmarket
    FOR UPDATE USING (is_agent_or_admin(auth.uid()));

CREATE POLICY "Admins can delete properties" ON public.properties_offmarket
    FOR DELETE USING (is_admin(auth.uid()));

-- Properties raw data policies
CREATE POLICY "Agents and admins can view raw properties" ON public.properties_offmarket_raw
    FOR SELECT USING (is_agent_or_admin(auth.uid()));

CREATE POLICY "Agents and admins can insert raw properties" ON public.properties_offmarket_raw
    FOR INSERT WITH CHECK (is_agent_or_admin(auth.uid()));

CREATE POLICY "Admins can update raw properties" ON public.properties_offmarket_raw
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete raw properties" ON public.properties_offmarket_raw
    FOR DELETE USING (is_admin(auth.uid()));

-- Contact-Property relationships policies
CREATE POLICY "Agents and admins can view contact-property relationships" ON public.contacts_properties
    FOR SELECT USING (is_agent_or_admin(auth.uid()));

CREATE POLICY "Agents and admins can insert contact-property relationships" ON public.contacts_properties
    FOR INSERT WITH CHECK (is_agent_or_admin(auth.uid()));

CREATE POLICY "Agents and admins can update contact-property relationships" ON public.contacts_properties
    FOR UPDATE USING (is_agent_or_admin(auth.uid()));

CREATE POLICY "Admins can delete contact-property relationships" ON public.contacts_properties
    FOR DELETE USING (is_admin(auth.uid()));

-- CEL rules policies
CREATE POLICY "Users can view their own rules" ON public.cel_rules
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own rules" ON public.cel_rules
    FOR INSERT WITH CHECK (auth.uid() = user_id AND is_agent_or_admin(auth.uid()));

CREATE POLICY "Users can update their own rules" ON public.cel_rules
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own rules" ON public.cel_rules
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all rules" ON public.cel_rules
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update all rules" ON public.cel_rules
    FOR UPDATE USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete all rules" ON public.cel_rules
    FOR DELETE USING (is_admin(auth.uid()));

-- Alerts policies
CREATE POLICY "Users can view alerts from their rules" ON public.alerts
    FOR SELECT USING (
        auth.uid() IN (
            SELECT user_id FROM public.cel_rules WHERE id = rule_id
        ) OR is_admin(auth.uid())
    );

CREATE POLICY "System can insert alerts" ON public.alerts
    FOR INSERT WITH CHECK (true); -- Alerts are system-generated

CREATE POLICY "Users can update alerts from their rules" ON public.alerts
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT user_id FROM public.cel_rules WHERE id = rule_id
        ) OR is_admin(auth.uid())
    );

CREATE POLICY "Admins can delete alerts" ON public.alerts
    FOR DELETE USING (is_admin(auth.uid()));

-- Audit logs policies (read-only for admins)
CREATE POLICY "Admins can view audit logs" ON public.audit_logs
    FOR SELECT USING (is_admin(auth.uid()));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true); -- Audit logs are system-generated

-- Create audit trigger function
CREATE OR REPLACE FUNCTION create_audit_log()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_values,
        new_values,
        ip_address
    ) VALUES (
        auth.uid(),
        TG_OP,
        TG_TABLE_NAME,
        CASE 
            WHEN TG_OP = 'DELETE' THEN OLD.id::text
            ELSE NEW.id::text
        END,
        CASE 
            WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD)
            WHEN TG_OP = 'UPDATE' THEN to_jsonb(OLD)
            ELSE NULL
        END,
        CASE 
            WHEN TG_OP = 'DELETE' THEN NULL
            ELSE to_jsonb(NEW)
        END,
        inet_client_addr()
    );
    
    RETURN CASE 
        WHEN TG_OP = 'DELETE' THEN OLD
        ELSE NEW
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to sensitive tables
CREATE TRIGGER audit_users_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.users
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_contacts_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.contacts
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_properties_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.properties_offmarket
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_contact_property_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.contacts_properties
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

CREATE TRIGGER audit_cel_rules_changes
    AFTER INSERT OR UPDATE OR DELETE ON public.cel_rules
    FOR EACH ROW EXECUTE FUNCTION create_audit_log();

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile when new auth user is created
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();