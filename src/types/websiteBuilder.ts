export type CreationMode = 'url_conversion' | 'from_scratch';

export type WebsiteStatus = 'draft' | 'published' | 'maintenance';

export type LanguageCode = 'en' | 'zh';

export interface BilingualText {
  en: string;
  zh: string;
}

export type SectionType =
  | 'hero'
  | 'features'
  | 'products'
  | 'about'
  | 'cta'
  | 'contact'
  | 'certifications'
  | 'faq'
  | 'testimonials'
  | 'footer';

export interface PageSection {
  id: string;
  type: SectionType;
  title: BilingualText;
  subtitle?: BilingualText;
  content?: BilingualText;
  media_urls?: string[];
  cta_button?: {
    label: BilingualText;
    link: string;
  };
  items?: {
    id: string;
    title: BilingualText;
    description: BilingualText;
    icon?: string;
  }[];
}

export interface SeoMetadata {
  meta_title: BilingualText;
  meta_description: BilingualText;
  keywords: string[];
  og_image: string;
  canonical_url?: string;
  json_ld_schema?: string;
}

export interface WebsitePage {
  id: string;
  website_id: string;
  slug: string; // 'index', 'products', 'about', 'contact', 'rfq'
  title: BilingualText;
  seo_metadata: SeoMetadata;
  sections: PageSection[];
}

export interface ThemeConfig {
  id: string;
  name: string;
  name_zh: string;
  description: string;
  preview_image: string;
  color_palette: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  typography: {
    font_family_en: string;
    font_family_zh: string;
    base_font_size: string;
  };
  component_style: {
    border_radius: 'none' | 'rounded-md' | 'rounded-2xl' | 'rounded-full';
    shadow: 'none' | 'shadow-sm' | 'shadow-md' | 'shadow-xl';
  };
}

export interface DnsRecord {
  type: 'A' | 'CNAME' | 'TXT';
  name: string;
  value: string;
  verified: boolean;
  ttl?: number;
}

export interface DomainConfig {
  id: string;
  website_id: string;
  domain_name: string;
  provider: 'xisync_subdomain' | 'manual_dns' | 'godaddy_api';
  status: 'pending_verification' | 'connected' | 'error';
  dns_records: DnsRecord[];
  godaddy_order_id?: string;
  price_usd?: number;
  auto_renew?: boolean;
  connected_at?: string;
}

export interface InventoryItemSync {
  id: string;
  sku: string;
  name: BilingualText;
  price_usd: number;
  stock_count: number;
  in_stock: boolean;
  category: string;
  image_url: string;
  sync_enabled: boolean;
  status?: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
}

export interface SeoAuditCheck {
  id: string;
  rule: string;
  status: 'passed' | 'warning' | 'failed';
  score: number;
  recommendation: string;
}

export interface SiteAnalytics {
  website_id: string;
  total_pageviews: number;
  unique_visitors: number;
  bounce_rate_pct: number;
  avg_session_duration: string;
  language_preference_ratio: {
    en: number;
    zh: number;
  };
  seo_indexing_status: {
    google_indexed_pages: number;
    baidu_indexed_pages: number;
    health_score: number; // 0 - 100
    audit_checks: SeoAuditCheck[];
  };
  top_clicked_inventory_items: {
    sku: string;
    product_name: string;
    clicks: number;
  }[];
  monthly_traffic_trend: {
    month: string;
    pageviews: number;
    visitors: number;
  }[];
}

export interface Website {
  id: string;
  tenant_id: string;
  name: string;
  logo_url?: string;
  logo_text?: string;
  favicon_url?: string;
  announcement_bar?: {
    enabled: boolean;
    text: BilingualText;
    link?: string;
    bg_color?: string;
    text_color?: string;
  };
  subdomain: string;
  custom_domain: string | null;
  active_theme_id: string;
  has_active_site: boolean;
  creation_mode: CreationMode;
  source_url?: string;
  industry_prompt?: string;
  primary_language: LanguageCode;
  inventory_sync_enabled: boolean;
  status: WebsiteStatus;
  theme_config: ThemeConfig;
  pages: WebsitePage[];
  domain_config: DomainConfig;
  analytics: SiteAnalytics;
  created_at: string;
  updated_at: string;
}
