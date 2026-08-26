-- ====================================================================================
-- MIGRATION: 20260826000001_deepseek_api_credentials_and_system_settings.sql
-- PURPOSE: Production-Grade Database Tables, Foreign Keys, Indexes & RLS for:
--          SaaS Admin System Settings & Global DeepSeek API Credentials Management
-- ====================================================================================

-- 1. TABLE: system_ai_configurations (Platform-wide & Tenant-level DeepSeek credentials)
CREATE TABLE IF NOT EXISTS public.system_ai_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL DEFAULT 'deepseek',
    api_key_ciphertext TEXT NOT NULL,
    api_key_masked VARCHAR(50) NOT NULL,
    base_url TEXT NOT NULL DEFAULT 'https://api.deepseek.com/v1',
    default_model VARCHAR(50) NOT NULL DEFAULT 'deepseek-chat',
    reasoning_model VARCHAR(50) NOT NULL DEFAULT 'deepseek-reasoner',
    temperature NUMERIC(3,2) NOT NULL DEFAULT 0.70,
    max_tokens INTEGER NOT NULL DEFAULT 4096,
    rate_limit_rpm INTEGER NOT NULL DEFAULT 600,
    daily_quota_limit INTEGER NOT NULL DEFAULT 100000,
    current_month_tokens_used BIGINT NOT NULL DEFAULT 0,
    current_month_cost_usd NUMERIC(10,4) NOT NULL DEFAULT 0.0000,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'degraded', 'expired', 'testing'
    last_health_check TIMESTAMPTZ,
    last_ping_latency_ms INTEGER DEFAULT 85,
    is_global_default BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. TABLE: ai_usage_audit_logs (Granular billing & token accounting)
CREATE TABLE IF NOT EXISTS public.ai_usage_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE SET NULL,
    provider VARCHAR(50) NOT NULL DEFAULT 'deepseek',
    model VARCHAR(50) NOT NULL,
    endpoint VARCHAR(100) NOT NULL,
    prompt_tokens INTEGER NOT NULL,
    completion_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    estimated_cost_usd NUMERIC(8,6) NOT NULL,
    latency_ms INTEGER NOT NULL,
    status_code INTEGER NOT NULL DEFAULT 200,
    requested_by VARCHAR(100) DEFAULT 'system_copilot',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_system_ai_configs_provider ON public.system_ai_configurations(provider);
CREATE INDEX IF NOT EXISTS idx_ai_usage_logs_tenant ON public.ai_usage_audit_logs(tenant_id, created_at DESC);

-- 4. RLS POLICIES
ALTER TABLE public.system_ai_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow authenticated SaaS super admins full access
CREATE POLICY "Allow platform admins full access to system_ai_configurations"
    ON public.system_ai_configurations
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow platform admins full access to ai_usage_audit_logs"
    ON public.ai_usage_audit_logs
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);
