export type Profile = {
  id: string;
  tenant_id: string | null;
  full_name: string | null;
  full_name_cn: string | null;
  role: 'super_admin' | 'admin' | 'manager' | 'agent' | 'viewer';
  avatar_url: string | null;
  phone: string | null;
  language: string;
  is_active: boolean;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type Tenant = {
  id: string;
  name: string;
  name_cn: string | null;
  slug: string;
  industry: string | null;
  region: string | null;
  timezone: string | null;
  currency: string | null;
  default_language: string | null;
  logo_url: string | null;
  status: 'active' | 'suspended' | 'trial' | 'cancelled';
  plan: 'trial' | 'starter' | 'pro' | 'business' | 'enterprise';
  settings: Record<string, unknown>;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
};