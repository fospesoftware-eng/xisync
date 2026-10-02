/*
  # Xisync Core Database Schema
  
  ## Overview
  This migration establishes the foundational multi-tenant SaaS architecture for Xisync,
  a comprehensive export management platform for Chinese exporters.

  ## 1. New Tables
  
  ### Tenant Management
  - `tenants` - Multi-tenant organizations (exporter companies)
    - `id` (uuid, primary key)
    - `name` (text) - Company name
    - `name_cn` (text) - Chinese company name
    - `slug` (text, unique) - URL-friendly identifier
    - `industry` (text) - Industry category
    - `region` (text) - Geographic region
    - `timezone` (text) - Default timezone
    - `currency` (text) - Default currency
    - `default_language` (text) - Primary language
    - `logo_url` (text) - Company logo
    - `status` (text) - active/suspended/trial
    - `plan` (text) - Subscription plan
    - `settings` (jsonb) - Flexible settings storage
    - `created_at`, `updated_at` (timestamptz)

  - `tenant_limits` - Resource limits per tenant
    - `tenant_id` (uuid, foreign key)
    - `max_seats`, `max_messages`, `max_storage_mb`, `max_integrations`
    - `features_enabled` (jsonb) - Feature flags

  ### User Management
  - `profiles` - Extended user profiles linked to auth.users
    - `id` (uuid, primary key, references auth.users)
    - `tenant_id` (uuid, foreign key to tenants)
    - `full_name`, `full_name_cn` (text)
    - `role` (text) - admin/manager/agent/viewer
    - `avatar_url`, `phone`, `language` (text)
    - `is_active` (boolean)
    - `last_login_at` (timestamptz)

  - `team_invitations` - Pending team invitations
    - `id`, `tenant_id`, `email`, `role`, `token`, `expires_at`, `invited_by`

  ### CRM Core
  - `leads` - Sales leads
    - Full lead management with source tracking, scoring, status

  - `accounts` - Buyer companies/organizations
    - Company details, hierarchy, payment terms

  - `contacts` - Individual contacts at buyer companies
    - Contact details, role, preferences, consent

  - `deals` - Sales opportunities/pipeline
    - Pipeline stages, values, probability, assignments

  - `activities` - CRM activity log
    - Calls, emails, meetings, tasks, notes

  ### Products & Quotes
  - `products` - Product catalog
    - SKU, variants, pricing, specifications, media

  - `quotes` - Sales quotations
    - Multi-currency, Incoterms, terms, status

  - `quote_items` - Quote line items
    - Products, quantities, pricing, descriptions

  ### Orders & Invoicing
  - `orders` - Sales orders
    - Order details, status, fulfillment

  - `order_items` - Order line items

  - `invoices` - Customer invoices
    - Amounts, payment status, due dates

  ### Logistics
  - `shipments` - Shipment tracking
    - Mode, carrier, ports, dates, tracking

  - `shipment_milestones` - Shipment status updates
    - Milestone type, timestamp, notes

  ### Messaging & Channels
  - `channel_connections` - Integration connections
    - Channel type, credentials, status

  - `conversations` - Message threads
    - Channel, participants, status

  - `messages` - Individual messages
    - Content, translations, attachments

  ### Documents & Compliance
  - `documents` - Document library
    - Type, file, expiry, versions

  - `compliance_requirements` - Destination requirements
    - Country, product category, required docs

  ### Customer Portal
  - `portal_users` - Buyer portal accounts
    - Login, preferences, linked contact

  ## 2. Security
  - RLS enabled on ALL tables
  - Tenant isolation enforced via policies
  - Role-based access within tenants
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TENANT MANAGEMENT
-- ============================================

CREATE TABLE IF NOT EXISTS tenants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_cn text,
  slug text UNIQUE NOT NULL,
  industry text,
  region text,
  timezone text DEFAULT 'Asia/Shanghai',
  currency text DEFAULT 'USD',
  default_language text DEFAULT 'zh',
  logo_url text,
  status text DEFAULT 'trial' CHECK (status IN ('active', 'suspended', 'trial', 'cancelled')),
  plan text DEFAULT 'trial' CHECK (plan IN ('trial', 'starter', 'pro', 'business', 'enterprise')),
  settings jsonb DEFAULT '{}',
  trial_ends_at timestamptz DEFAULT (now() + interval '14 days'),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS tenant_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE UNIQUE NOT NULL,
  max_seats integer DEFAULT 3,
  max_messages_per_month integer DEFAULT 1000,
  max_storage_mb integer DEFAULT 500,
  max_integrations integer DEFAULT 2,
  features_enabled jsonb DEFAULT '{"crm": true, "messaging": true, "logistics": false, "compliance": false, "portal": false}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- USER MANAGEMENT
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id uuid REFERENCES tenants(id) ON DELETE SET NULL,
  full_name text,
  full_name_cn text,
  role text DEFAULT 'agent' CHECK (role IN ('super_admin', 'admin', 'manager', 'agent', 'viewer')),
  avatar_url text,
  phone text,
  language text DEFAULT 'zh',
  is_active boolean DEFAULT true,
  last_login_at timestamptz,
  settings jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS team_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  role text DEFAULT 'agent',
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  invited_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- CRM CORE
-- ============================================

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  source text,
  source_details jsonb DEFAULT '{}',
  company_name text,
  company_name_cn text,
  contact_name text,
  email text,
  phone text,
  country text,
  industry text,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'unqualified', 'converted')),
  score integer DEFAULT 0,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  notes text,
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  converted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  name_cn text,
  type text DEFAULT 'customer' CHECK (type IN ('customer', 'prospect', 'partner', 'competitor')),
  industry text,
  website text,
  country text,
  city text,
  address text,
  phone text,
  email text,
  parent_account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  payment_terms text,
  credit_limit decimal(15,2),
  currency text DEFAULT 'USD',
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'churned')),
  health_score integer DEFAULT 50,
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  full_name_cn text,
  email text,
  phone text,
  mobile text,
  job_title text,
  department text,
  role_type text CHECK (role_type IN ('decision_maker', 'influencer', 'user', 'procurement', 'finance', 'logistics')),
  preferred_language text DEFAULT 'en',
  preferred_channel text DEFAULT 'email' CHECK (preferred_channel IN ('email', 'whatsapp', 'wechat', 'phone')),
  timezone text,
  consent_marketing boolean DEFAULT false,
  consent_transactional boolean DEFAULT true,
  is_primary boolean DEFAULT false,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'bounced')),
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  last_contacted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  name text NOT NULL,
  value decimal(15,2) DEFAULT 0,
  currency text DEFAULT 'USD',
  stage text DEFAULT 'qualification' CHECK (stage IN ('qualification', 'discovery', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  probability integer DEFAULT 10,
  expected_close_date date,
  actual_close_date date,
  lost_reason text,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  source text,
  products jsonb DEFAULT '[]',
  notes text,
  tags text[] DEFAULT '{}',
  custom_fields jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL CHECK (type IN ('call', 'email', 'meeting', 'task', 'note', 'message')),
  subject text,
  description text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  due_date timestamptz,
  completed_at timestamptz,
  lead_id uuid REFERENCES leads(id) ON DELETE CASCADE,
  account_id uuid REFERENCES accounts(id) ON DELETE CASCADE,
  contact_id uuid REFERENCES contacts(id) ON DELETE CASCADE,
  deal_id uuid REFERENCES deals(id) ON DELETE CASCADE,
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- PRODUCTS & QUOTES
-- ============================================

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  sku text NOT NULL,
  name text NOT NULL,
  name_cn text,
  description text,
  description_cn text,
  category text,
  unit text DEFAULT 'pcs',
  base_price decimal(15,2),
  currency text DEFAULT 'USD',
  moq integer DEFAULT 1,
  lead_time_days integer,
  hs_code text,
  weight_kg decimal(10,3),
  dimensions jsonb,
  materials text[],
  certifications text[],
  images text[] DEFAULT '{}',
  specifications jsonb DEFAULT '{}',
  is_active boolean DEFAULT true,
  tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, sku)
);

CREATE TABLE IF NOT EXISTS quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  quote_number text NOT NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  deal_id uuid REFERENCES deals(id) ON DELETE SET NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'sent', 'viewed', 'accepted', 'rejected', 'expired')),
  valid_until date,
  currency text DEFAULT 'USD',
  subtotal decimal(15,2) DEFAULT 0,
  discount_percent decimal(5,2) DEFAULT 0,
  tax_percent decimal(5,2) DEFAULT 0,
  total decimal(15,2) DEFAULT 0,
  incoterm text,
  payment_terms text,
  delivery_terms text,
  notes text,
  notes_internal text,
  cover_letter text,
  cover_letter_translated text,
  approved_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  approved_at timestamptz,
  sent_at timestamptz,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, quote_number)
);

CREATE TABLE IF NOT EXISTS quote_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid REFERENCES quotes(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  description text,
  description_translated text,
  quantity integer DEFAULT 1,
  unit text DEFAULT 'pcs',
  unit_price decimal(15,2),
  discount_percent decimal(5,2) DEFAULT 0,
  total decimal(15,2),
  notes text,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- ORDERS & INVOICING
-- ============================================

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  order_number text NOT NULL,
  quote_id uuid REFERENCES quotes(id) ON DELETE SET NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_production', 'ready', 'shipped', 'delivered', 'cancelled')),
  currency text DEFAULT 'USD',
  subtotal decimal(15,2) DEFAULT 0,
  tax decimal(15,2) DEFAULT 0,
  total decimal(15,2) DEFAULT 0,
  paid_amount decimal(15,2) DEFAULT 0,
  payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partial', 'paid', 'refunded')),
  shipping_address jsonb,
  billing_address jsonb,
  notes text,
  notes_internal text,
  expected_ship_date date,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, order_number)
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  description text,
  quantity integer DEFAULT 1,
  unit text DEFAULT 'pcs',
  unit_price decimal(15,2),
  total decimal(15,2),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  invoice_number text NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  type text DEFAULT 'standard' CHECK (type IN ('standard', 'proforma', 'deposit', 'credit_note')),
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'cancelled')),
  currency text DEFAULT 'USD',
  subtotal decimal(15,2) DEFAULT 0,
  tax decimal(15,2) DEFAULT 0,
  total decimal(15,2) DEFAULT 0,
  paid_amount decimal(15,2) DEFAULT 0,
  due_date date,
  paid_at timestamptz,
  notes text,
  sent_at timestamptz,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, invoice_number)
);

-- ============================================
-- LOGISTICS
-- ============================================

CREATE TABLE IF NOT EXISTS shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  shipment_number text NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  mode text CHECK (mode IN ('sea', 'air', 'express', 'rail', 'truck')),
  carrier text,
  forwarder text,
  tracking_number text,
  container_number text,
  booking_number text,
  bl_number text,
  origin_port text,
  destination_port text,
  origin_country text,
  destination_country text,
  etd date,
  eta date,
  actual_departure date,
  actual_arrival date,
  status text DEFAULT 'booked' CHECK (status IN ('booked', 'picked_up', 'export_cleared', 'in_transit', 'arrived', 'import_cleared', 'delivered', 'exception')),
  packages integer,
  weight_kg decimal(10,2),
  volume_cbm decimal(10,3),
  incoterm text,
  shipping_cost decimal(15,2),
  insurance_cost decimal(15,2),
  tracking_url text,
  notes text,
  documents jsonb DEFAULT '[]',
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, shipment_number)
);

CREATE TABLE IF NOT EXISTS shipment_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid REFERENCES shipments(id) ON DELETE CASCADE NOT NULL,
  milestone_type text NOT NULL,
  title text,
  description text,
  location text,
  occurred_at timestamptz DEFAULT now(),
  is_exception boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- MESSAGING & CHANNELS
-- ============================================

CREATE TABLE IF NOT EXISTS channel_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  channel_type text NOT NULL CHECK (channel_type IN ('email', 'whatsapp', 'wechat', 'instagram', 'facebook', 'webchat', 'sms')),
  name text NOT NULL,
  credentials jsonb DEFAULT '{}',
  settings jsonb DEFAULT '{}',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'error', 'disabled')),
  last_sync_at timestamptz,
  error_message text,
  created_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  channel_id uuid REFERENCES channel_connections(id) ON DELETE SET NULL,
  channel_type text,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  external_id text,
  subject text,
  status text DEFAULT 'open' CHECK (status IN ('open', 'pending', 'resolved', 'closed')),
  priority text DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  assigned_to uuid REFERENCES profiles(id) ON DELETE SET NULL,
  last_message_at timestamptz,
  last_customer_message_at timestamptz,
  sla_due_at timestamptz,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  direction text NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  sender_type text CHECK (sender_type IN ('customer', 'agent', 'system', 'bot')),
  sender_id uuid,
  content text,
  content_translated text,
  original_language text,
  target_language text,
  content_type text DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'file', 'audio', 'video', 'template')),
  attachments jsonb DEFAULT '[]',
  status text DEFAULT 'sent' CHECK (status IN ('pending', 'sent', 'delivered', 'read', 'failed')),
  external_id text,
  metadata jsonb DEFAULT '{}',
  is_internal_note boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- ============================================
-- DOCUMENTS & COMPLIANCE
-- ============================================

CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  type text CHECK (type IN ('certificate', 'coo', 'msds', 'test_report', 'invoice', 'packing_list', 'bl', 'customs', 'contract', 'other')),
  category text,
  file_url text,
  file_size integer,
  mime_type text,
  version integer DEFAULT 1,
  expires_at date,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  account_id uuid REFERENCES accounts(id) ON DELETE SET NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  shipment_id uuid REFERENCES shipments(id) ON DELETE SET NULL,
  tags text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  uploaded_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS compliance_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  destination_country text NOT NULL,
  product_category text,
  hs_code_prefix text,
  required_documents text[] DEFAULT '{}',
  regulations text,
  notes text,
  is_global boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ============================================
-- CUSTOMER PORTAL
-- ============================================

CREATE TABLE IF NOT EXISTS portal_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  contact_id uuid REFERENCES contacts(id) ON DELETE SET NULL,
  email text NOT NULL,
  password_hash text,
  language text DEFAULT 'en',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
  last_login_at timestamptz,
  notification_preferences jsonb DEFAULT '{"email": true, "whatsapp": false}',
  magic_link_token text,
  magic_link_expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, email)
);

-- ============================================
-- AUDIT & ANALYTICS
-- ============================================

CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  old_values jsonb,
  new_values jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS usage_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid REFERENCES tenants(id) ON DELETE CASCADE NOT NULL,
  metric_type text NOT NULL,
  metric_value integer DEFAULT 0,
  period_start date NOT NULL,
  period_end date NOT NULL,
  breakdown jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  UNIQUE(tenant_id, metric_type, period_start)
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_tenant ON profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_tenant ON leads(tenant_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_accounts_tenant ON accounts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contacts_tenant ON contacts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_contacts_account ON contacts(account_id);
CREATE INDEX IF NOT EXISTS idx_deals_tenant ON deals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_deals_stage ON deals(tenant_id, stage);
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_quotes_tenant ON quotes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tenant ON shipments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_tenant ON conversations(tenant_id);
CREATE INDEX IF NOT EXISTS idx_conversations_status ON conversations(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_documents_tenant ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipment_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE portal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_metrics ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's tenant_id
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS uuid AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user is super admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'super_admin'
  )
$$ LANGUAGE sql SECURITY DEFINER;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (id = auth.uid() OR tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (
    id = auth.uid() OR 
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('super_admin', 'admin'))
  );

-- TENANTS POLICIES
CREATE POLICY "Users can view own tenant"
  ON tenants FOR SELECT
  TO authenticated
  USING (id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Super admins can manage tenants"
  ON tenants FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- TENANT LIMITS POLICIES
CREATE POLICY "Users can view own tenant limits"
  ON tenant_limits FOR SELECT
  TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Super admins can manage tenant limits"
  ON tenant_limits FOR ALL
  TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- GENERIC TENANT-SCOPED POLICIES (for CRM tables)
CREATE POLICY "Tenant members can view leads"
  ON leads FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert leads"
  ON leads FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update leads"
  ON leads FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete leads"
  ON leads FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Accounts policies
CREATE POLICY "Tenant members can view accounts"
  ON accounts FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert accounts"
  ON accounts FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update accounts"
  ON accounts FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete accounts"
  ON accounts FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Contacts policies
CREATE POLICY "Tenant members can view contacts"
  ON contacts FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert contacts"
  ON contacts FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update contacts"
  ON contacts FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete contacts"
  ON contacts FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Deals policies
CREATE POLICY "Tenant members can view deals"
  ON deals FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert deals"
  ON deals FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update deals"
  ON deals FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete deals"
  ON deals FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Activities policies
CREATE POLICY "Tenant members can view activities"
  ON activities FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert activities"
  ON activities FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update activities"
  ON activities FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can delete own activities"
  ON activities FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND created_by = auth.uid());

-- Products policies
CREATE POLICY "Tenant members can view products"
  ON products FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert products"
  ON products FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update products"
  ON products FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete products"
  ON products FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Quotes policies
CREATE POLICY "Tenant members can view quotes"
  ON quotes FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert quotes"
  ON quotes FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update quotes"
  ON quotes FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete quotes"
  ON quotes FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Quote items policies
CREATE POLICY "Tenant members can view quote items"
  ON quote_items FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id 
    AND (quotes.tenant_id = get_user_tenant_id() OR is_super_admin())
  ));

CREATE POLICY "Tenant members can manage quote items"
  ON quote_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id 
    AND quotes.tenant_id = get_user_tenant_id()
  ));

CREATE POLICY "Tenant members can update quote items"
  ON quote_items FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id 
    AND quotes.tenant_id = get_user_tenant_id()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id 
    AND quotes.tenant_id = get_user_tenant_id()
  ));

CREATE POLICY "Tenant members can delete quote items"
  ON quote_items FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM quotes WHERE quotes.id = quote_items.quote_id 
    AND quotes.tenant_id = get_user_tenant_id()
  ));

-- Orders policies
CREATE POLICY "Tenant members can view orders"
  ON orders FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update orders"
  ON orders FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete orders"
  ON orders FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Order items policies
CREATE POLICY "Tenant members can view order items"
  ON order_items FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
    AND (orders.tenant_id = get_user_tenant_id() OR is_super_admin())
  ));

CREATE POLICY "Tenant members can manage order items"
  ON order_items FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
    AND orders.tenant_id = get_user_tenant_id()
  ));

CREATE POLICY "Tenant members can update order items"
  ON order_items FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
    AND orders.tenant_id = get_user_tenant_id()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
    AND orders.tenant_id = get_user_tenant_id()
  ));

CREATE POLICY "Tenant members can delete order items"
  ON order_items FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM orders WHERE orders.id = order_items.order_id 
    AND orders.tenant_id = get_user_tenant_id()
  ));

-- Invoices policies
CREATE POLICY "Tenant members can view invoices"
  ON invoices FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert invoices"
  ON invoices FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update invoices"
  ON invoices FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete invoices"
  ON invoices FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Shipments policies
CREATE POLICY "Tenant members can view shipments"
  ON shipments FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert shipments"
  ON shipments FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update shipments"
  ON shipments FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete shipments"
  ON shipments FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Shipment milestones policies
CREATE POLICY "Tenant members can view milestones"
  ON shipment_milestones FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM shipments WHERE shipments.id = shipment_milestones.shipment_id 
    AND (shipments.tenant_id = get_user_tenant_id() OR is_super_admin())
  ));

CREATE POLICY "Tenant members can manage milestones"
  ON shipment_milestones FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM shipments WHERE shipments.id = shipment_milestones.shipment_id 
    AND shipments.tenant_id = get_user_tenant_id()
  ));

CREATE POLICY "Tenant members can update milestones"
  ON shipment_milestones FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM shipments WHERE shipments.id = shipment_milestones.shipment_id 
    AND shipments.tenant_id = get_user_tenant_id()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM shipments WHERE shipments.id = shipment_milestones.shipment_id 
    AND shipments.tenant_id = get_user_tenant_id()
  ));

CREATE POLICY "Tenant members can delete milestones"
  ON shipment_milestones FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM shipments WHERE shipments.id = shipment_milestones.shipment_id 
    AND shipments.tenant_id = get_user_tenant_id()
  ));

-- Channel connections policies
CREATE POLICY "Tenant members can view channels"
  ON channel_connections FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant admins can insert channels"
  ON channel_connections FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

CREATE POLICY "Tenant admins can update channels"
  ON channel_connections FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ))
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete channels"
  ON channel_connections FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Conversations policies
CREATE POLICY "Tenant members can view conversations"
  ON conversations FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert conversations"
  ON conversations FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update conversations"
  ON conversations FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete conversations"
  ON conversations FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Messages policies
CREATE POLICY "Tenant members can view messages"
  ON messages FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id 
    AND (conversations.tenant_id = get_user_tenant_id() OR is_super_admin())
  ));

CREATE POLICY "Tenant members can insert messages"
  ON messages FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id 
    AND conversations.tenant_id = get_user_tenant_id()
  ));

CREATE POLICY "Tenant members can update messages"
  ON messages FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id 
    AND conversations.tenant_id = get_user_tenant_id()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id 
    AND conversations.tenant_id = get_user_tenant_id()
  ));

CREATE POLICY "Tenant members can delete messages"
  ON messages FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id 
    AND conversations.tenant_id = get_user_tenant_id()
  ));

-- Documents policies
CREATE POLICY "Tenant members can view documents"
  ON documents FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant members can insert documents"
  ON documents FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant members can update documents"
  ON documents FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete documents"
  ON documents FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Compliance requirements policies
CREATE POLICY "Anyone can view global requirements"
  ON compliance_requirements FOR SELECT TO authenticated
  USING (is_global = true OR tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant admins can manage requirements"
  ON compliance_requirements FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

CREATE POLICY "Tenant admins can update requirements"
  ON compliance_requirements FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ))
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete requirements"
  ON compliance_requirements FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Portal users policies
CREATE POLICY "Tenant members can view portal users"
  ON portal_users FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant admins can manage portal users"
  ON portal_users FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can update portal users"
  ON portal_users FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete portal users"
  ON portal_users FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- Audit logs policies
CREATE POLICY "Tenant admins can view audit logs"
  ON audit_logs FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ) OR is_super_admin());

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id() OR is_super_admin());

-- Usage metrics policies
CREATE POLICY "Tenant admins can view usage"
  ON usage_metrics FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ) OR is_super_admin());

CREATE POLICY "System can manage usage metrics"
  ON usage_metrics FOR INSERT TO authenticated
  WITH CHECK (is_super_admin());

CREATE POLICY "System can update usage metrics"
  ON usage_metrics FOR UPDATE TO authenticated
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- Team invitations policies
CREATE POLICY "Tenant admins can view invitations"
  ON team_invitations FOR SELECT TO authenticated
  USING (tenant_id = get_user_tenant_id() OR is_super_admin());

CREATE POLICY "Tenant admins can create invitations"
  ON team_invitations FOR INSERT TO authenticated
  WITH CHECK (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

CREATE POLICY "Tenant admins can update invitations"
  ON team_invitations FOR UPDATE TO authenticated
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "Tenant admins can delete invitations"
  ON team_invitations FOR DELETE TO authenticated
  USING (tenant_id = get_user_tenant_id() AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin', 'manager', 'super_admin')
  ));

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name FROM information_schema.columns 
    WHERE column_name = 'updated_at' AND table_schema = 'public'
  LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS update_%s_updated_at ON %s', t, t);
    EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON %s FOR EACH ROW EXECUTE FUNCTION update_updated_at()', t, t);
  END LOOP;
END $$;