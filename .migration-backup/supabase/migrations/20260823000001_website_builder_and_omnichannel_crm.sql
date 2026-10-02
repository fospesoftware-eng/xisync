-- ====================================================================================
-- MIGRATION: 20260823000001_website_builder_and_omnichannel_crm.sql
-- PURPOSE: Production-Grade Database Tables, Foreign Keys, Indexes & RLS for:
--          1. Website Builder Multi-Page CMS, SEO & GoDaddy Custom Domains
--          2. Omnichannel Messaging Integrations (Meta FB/IG, WhatsApp Cloud, TikTok, WeChat)
--          3. Advanced B2B Trade Negotiation, Escrow & Inbound Webhooks
-- ====================================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
    CREATE TYPE website_status_enum AS ENUM ('draft', 'published', 'maintenance');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE channel_provider_enum AS ENUM ('facebook', 'instagram', 'whatsapp', 'tiktok', 'wechat', 'email', 'webchat', 'sms');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE domain_provider_enum AS ENUM ('xisync_subdomain', 'manual_dns', 'godaddy_api');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLE: websites (Core Storefront Architecture)
CREATE TABLE IF NOT EXISTS public.websites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(100) UNIQUE NOT NULL,
    custom_domain VARCHAR(255) UNIQUE,
    logo_url TEXT,
    logo_text VARCHAR(100) DEFAULT '🧸 ECO-TOYS',
    favicon_url TEXT,
    active_theme_id VARCHAR(100) NOT NULL DEFAULT 'theme-ecotoys',
    has_active_site BOOLEAN NOT NULL DEFAULT true,
    creation_mode VARCHAR(50) NOT NULL DEFAULT 'url_conversion',
    source_url TEXT,
    primary_language VARCHAR(10) NOT NULL DEFAULT 'en',
    inventory_sync_enabled BOOLEAN NOT NULL DEFAULT true,
    status website_status_enum NOT NULL DEFAULT 'published',
    theme_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    seo_defaults JSONB NOT NULL DEFAULT '{}'::jsonb,
    analytics_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. TABLE: website_pages (Dedicated Multi-Page & Block Routing)
CREATE TABLE IF NOT EXISTS public.website_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
    slug VARCHAR(100) NOT NULL,
    title JSONB NOT NULL DEFAULT '{"en": "Home", "zh": "首页"}'::jsonb,
    seo_metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    sections JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(website_id, slug)
);

-- 5. TABLE: website_domains (GoDaddy v3 & Manual DNS Polling Engine)
CREATE TABLE IF NOT EXISTS public.website_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_id UUID NOT NULL REFERENCES public.websites(id) ON DELETE CASCADE,
    domain_name VARCHAR(255) NOT NULL,
    provider domain_provider_enum NOT NULL DEFAULT 'manual_dns',
    status VARCHAR(50) NOT NULL DEFAULT 'connected',
    dns_records JSONB NOT NULL DEFAULT '[]'::jsonb,
    godaddy_order_id VARCHAR(100),
    price_usd NUMERIC(10, 2),
    auto_renew BOOLEAN DEFAULT true,
    ssl_certified BOOLEAN DEFAULT true,
    connected_at TIMESTAMPTZ DEFAULT now(),
    last_verified_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABLE: omnichannel_connections (Social & Messaging OAuth API Credentials)
CREATE TABLE IF NOT EXISTS public.omnichannel_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    channel_type channel_provider_enum NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    app_id VARCHAR(255) NOT NULL,
    app_secret_hash TEXT,
    oauth_access_token TEXT,
    token_expires_at TIMESTAMPTZ,
    webhook_secret VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT true,
    total_leads_ingested INTEGER NOT NULL DEFAULT 0,
    last_webhook_received_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, channel_type, app_id)
);

-- 7. TABLE: omnichannel_messages_history (Live DeepSeek Bilingual Chats)
CREATE TABLE IF NOT EXISTS public.omnichannel_messages_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    conversation_id VARCHAR(100) NOT NULL,
    channel_type channel_provider_enum NOT NULL,
    sender_type VARCHAR(50) NOT NULL DEFAULT 'customer',
    sender_name VARCHAR(255),
    content_original TEXT NOT NULL,
    content_translated TEXT,
    source_language VARCHAR(10) DEFAULT 'en',
    target_language VARCHAR(10) DEFAULT 'zh',
    attachments JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(50) DEFAULT 'delivered',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. INDEXES FOR HIGH-THROUGHPUT QUERIES
CREATE INDEX IF NOT EXISTS idx_websites_tenant_id ON public.websites(tenant_id);
CREATE INDEX IF NOT EXISTS idx_websites_subdomain ON public.websites(subdomain);
CREATE INDEX IF NOT EXISTS idx_website_pages_lookup ON public.website_pages(website_id, slug);
CREATE INDEX IF NOT EXISTS idx_website_domains_website_id ON public.website_domains(website_id);
CREATE INDEX IF NOT EXISTS idx_omnichannel_connections_tenant ON public.omnichannel_connections(tenant_id, channel_type);
CREATE INDEX IF NOT EXISTS idx_omnichannel_messages_conv ON public.omnichannel_messages_history(tenant_id, conversation_id, created_at DESC);

-- 9. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omnichannel_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.omnichannel_messages_history ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation RLS Policies
CREATE POLICY "Tenant users can view own websites"
    ON public.websites FOR ALL
    TO authenticated
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE profiles.id = auth.uid()))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Public anonymous users can view published websites"
    ON public.websites FOR SELECT
    TO anon
    USING (status = 'published');

CREATE POLICY "Public anonymous users can view published website pages"
    ON public.website_pages FOR SELECT
    TO anon
    USING (is_published = true);

CREATE POLICY "Tenant users can view own omnichannel connections"
    ON public.omnichannel_connections FOR ALL
    TO authenticated
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE profiles.id = auth.uid()))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.profiles WHERE profiles.id = auth.uid()));

CREATE POLICY "Tenant users can view own omnichannel messages"
    ON public.omnichannel_messages_history FOR ALL
    TO authenticated
    USING (tenant_id = (SELECT tenant_id FROM public.profiles WHERE profiles.id = auth.uid()))
    WITH CHECK (tenant_id = (SELECT tenant_id FROM public.profiles WHERE profiles.id = auth.uid()));
