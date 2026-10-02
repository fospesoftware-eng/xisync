export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'unqualified' | 'negotiating' | 'converted';
export type LeadSource = 'whatsapp' | 'facebook_ad' | 'instagram_dm' | 'google_search' | 'website_rfq' | 'tiktok_commercial' | 'wechat';

export type AccountTier = 'tier_1_enterprise' | 'tier_2_wholesale' | 'tier_3_boutique';
export type PaymentTerms = '30/70 T/T' | '100% L/C at Sight' | 'OA 30 Days' | 'OA 60 Days' | 'DP / CAD';

export type DealStage = 'qualification' | 'discovery' | 'proposal' | 'negotiation' | 'compliance_review' | 'closed_won' | 'closed_lost';

export interface Lead {
  id: string;
  tenant_id: string;
  contact_name: string;
  email: string;
  phone?: string;
  company_name: string;
  country: string;
  source: LeadSource;
  status: LeadStatus;
  score: number; // 0 - 100 AI Lead Quality Score
  deal_value_estimate_usd: number;
  assigned_to_agent?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  tenant_id: string;
  name: string;
  industry: string;
  country: string;
  tier: AccountTier;
  credit_score: number; // 0 - 100
  sinosure_rating: 'AAA' | 'AA' | 'A' | 'BBB' | 'Unrated';
  payment_terms: PaymentTerms;
  annual_revenue_usd: number;
  total_orders_count: number;
  primary_contact_name: string;
  primary_contact_email: string;
  website_domain: string;
  tax_id?: string;
  assigned_account_manager: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  tenant_id: string;
  account_id?: string;
  first_name: string;
  last_name: string;
  job_title: string;
  company_name: string;
  email: string;
  phone: string;
  whatsapp_number?: string;
  wechat_id?: string;
  country: string;
  preferred_channel: 'whatsapp' | 'facebook' | 'instagram' | 'email' | 'wechat';
  is_primary_decision_maker: boolean;
  notes?: string;
  last_contacted_at: string;
  created_at: string;
}

export interface Deal {
  id: string;
  tenant_id: string;
  account_id?: string;
  title: string;
  company_name: string;
  product_skus: string[];
  total_value_usd: number;
  stage: DealStage;
  probability_pct: number; // 0 - 100
  expected_close_date: string;
  incoterms: 'FOB Shanghai' | 'FOB Ningbo' | 'CIF Rotterdam' | 'CIF Los Angeles' | 'DDP';
  assigned_agent: string;
  proforma_invoice_no?: string;
  created_at: string;
  updated_at: string;
}

export interface ChannelConnection {
  id: string;
  tenant_id: string;
  channel_type: 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'wechat' | 'google_ads';
  account_name: string;
  app_id: string;
  status: 'connected' | 'token_expiring' | 'disconnected';
  token_expires_at: string;
  webhook_secret: string;
  total_leads_ingested: number;
  last_synced_at: string;
}

export interface OmnichannelMessage {
  id: string;
  conversation_id: string;
  sender_type: 'customer' | 'agent' | 'ai_copilot';
  content_original: string;
  content_translated?: string;
  source_lang: string;
  target_lang: string;
  channel_type: 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'wechat' | 'email' | 'webchat';
  attachments?: {
    type: 'pdf' | 'image' | 'proforma_invoice';
    url: string;
    filename: string;
  }[];
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}
