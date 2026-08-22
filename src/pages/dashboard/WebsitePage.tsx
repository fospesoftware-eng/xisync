import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Website } from '../../types/websiteBuilder';
import { WebsiteWizard } from '../../components/website/WebsiteWizard';
import { WebsiteDashboard } from '../../components/website/WebsiteDashboard';

const LOCAL_STORAGE_KEY = 'xisync_website_builder_state';

const DEFAULT_DEMO_WEBSITE: Website = {
  id: 'web-default-1',
  tenant_id: 'tenant-demo',
  name: 'ExportCo International',
  subdomain: 'exportco.xisync.site',
  custom_domain: 'exportco-global.com',
  active_theme_id: 'theme-enterprise',
  has_active_site: true,
  creation_mode: 'url_conversion',
  source_url: 'https://demo.exportco.com',
  primary_language: 'en',
  inventory_sync_enabled: true,
  status: 'published',
  theme_config: {
    id: 'theme-enterprise',
    name: 'Enterprise Sleek',
    name_zh: '商务科技精英',
    description: 'High-contrast sapphire theme tailored for global industrial machinery & B2B exporters.',
    preview_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    color_palette: {
      primary: '#0284c7',
      secondary: '#0f172a',
      background: '#020617',
      text: '#f8fafc',
      accent: '#38bdf8',
    },
    typography: { font_family_en: 'Inter', font_family_zh: 'PingFang SC', base_font_size: '15px' },
    component_style: { border_radius: 'rounded-2xl', shadow: 'shadow-md' },
  },
  pages: [
    {
      id: 'page-home',
      website_id: 'web-default-1',
      slug: 'index',
      title: { en: 'Home', zh: '首页' },
      seo_metadata: {
        meta_title: {
          en: 'ExportCo International — Leading Industrial Exporter',
          zh: 'ExportCo 国际 — 领先的工业装备出口制造商',
        },
        meta_description: {
          en: 'Official B2B exporter catalog for ExportCo. ISO 9001 certified manufacturer offering wholesale supply, OEM/ODM customization, and direct global logistics.',
          zh: 'ExportCo 官方 B2B 采购平台。ISO 9001 认证外贸工厂，提供大宗批发、OEM/ODM 定制及全球一站式物流履约。',
        },
        keywords: ['High-Tech Electronics', 'China Export', 'B2B Wholesale', 'Factory Direct', 'OEM ODM'],
        og_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
      },
      sections: [
        {
          id: 'sec-hero',
          type: 'hero',
          title: {
            en: 'Engineered Precision Equipment for Global Supply Chains',
            zh: '赋能全球供应链：精工制造高端电子设备',
          },
          subtitle: {
            en: 'Direct from ExportCo Pudong Manufacturing Base. Certified for US, EU & APAC Compliance.',
            zh: '源自 ExportCo 浦东智能生产基地，全线通过北美、欧盟及亚太合规认证。',
          },
          content: {
            en: 'Empowering global wholesale buyers with automated negotiation, dynamic margin pricing, and guaranteed 40ft container freight transit.',
            zh: '为全球大宗采购商提供 AI 自主议价、动态边际定价以及 COSCO 保障集装箱海运服务。',
          },
          media_urls: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80'],
          cta_button: { label: { en: 'Request Wholesale RFQ', zh: '获取批发报价单' }, link: '#products' },
        },
        {
          id: 'sec-features',
          type: 'features',
          title: { en: 'Why Partner With Our Factory', zh: '工厂核心优势' },
          subtitle: { en: 'End-to-End Exporter Quality Assurance', zh: '全流程出口品质保障与产能调配' },
          content: {
            en: '100% automated QC inspection, 15-day sea freight dispatch to LAX/Rotterdam, and multi-currency L/C payment settlement.',
            zh: '100% 自动全检，15天直达美西/欧洲港口，支持多币种信用证与电汇结算。',
          },
        },
        {
          id: 'sec-products',
          type: 'products',
          title: { en: 'Featured Export Inventory Catalog', zh: '核心出口产品目录' },
          subtitle: { en: 'Connected to XiSync Live Stock Inventory', zh: '已实时同步犀同步智能库存中心' },
        },
      ],
    },
    {
      id: 'page-about',
      website_id: 'web-default-1',
      slug: 'about',
      title: { en: 'About Factory', zh: '关于工厂' },
      seo_metadata: {
        meta_title: { en: 'About ExportCo — Certified Production Base', zh: '关于 ExportCo — 制造基地与合规认证' },
        meta_description: {
          en: "Learn about ExportCo's 45,000 sqm production facility and international export certifications.",
          zh: '了解 ExportCo 45,000 平方米现代化生产基地与国际出口认证。',
        },
        keywords: ['Factory Overview', 'Certifications'],
        og_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
      },
      sections: [
        {
          id: 'sec-about-main',
          type: 'about',
          title: { en: '45,000 m² Automated Manufacturing Hub', zh: '45,000 m² 自动化数智工厂' },
          content: {
            en: 'ExportCo operates 12 automated production lines equipped with German SMT machinery.',
            zh: 'ExportCo 拥有 12 条德国 SMT 自动化生产线。',
          },
        },
      ],
    },
  ],
  domain_config: {
    id: 'dom-default-1',
    website_id: 'web-default-1',
    domain_name: 'exportco-global.com',
    provider: 'manual_dns',
    status: 'connected',
    dns_records: [
      { type: 'A', name: '@', value: '76.76.21.21', verified: true, ttl: 3600 },
      { type: 'CNAME', name: 'www', value: 'cname.xisync.site', verified: true, ttl: 3600 },
    ],
    connected_at: new Date().toISOString(),
  },
  analytics: {
    website_id: 'web-default-1',
    total_pageviews: 14820,
    unique_visitors: 4290,
    bounce_rate_pct: 32.4,
    avg_session_duration: '3m 45s',
    language_preference_ratio: { en: 68, zh: 32 },
    seo_indexing_status: { google_indexed_pages: 14, baidu_indexed_pages: 12, health_score: 96 },
    top_clicked_inventory_items: [
      { sku: 'INV-4000-HE', product_name: '5,000W Hybrid Solar Inverter', clicks: 1240 },
      { sku: 'LED-8800-HC', product_name: 'Smart Industrial LED Panel', clicks: 890 },
      { sku: 'TR-9900-MX', product_name: 'Precision Micro-Transformer Line #3', clicks: 640 },
    ],
    monthly_traffic_trend: [
      { month: 'Apr', pageviews: 2800, visitors: 940 },
      { month: 'May', pageviews: 4200, visitors: 1280 },
      { month: 'Jun', pageviews: 6100, visitors: 1950 },
      { month: 'Jul', pageviews: 9400, visitors: 2890 },
      { month: 'Aug', pageviews: 14820, visitors: 4290 },
    ],
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function WebsitePage() {
  const location = useLocation();

  // Load website state from localStorage or default demo
  const [website, setWebsite] = useState<Website | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DEMO_WEBSITE;
  });

  const handleUpdateWebsite = (updated: Website) => {
    setWebsite(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleWizardComplete = (newWeb: Website) => {
    handleUpdateWebsite(newWeb);
  };

  const handleResetWizard = () => {
    if (website) {
      const resetState: Website = { ...website, has_active_site: false };
      handleUpdateWebsite(resetState);
    }
  };

  // Determine sub-tab from location pathname
  const getSubTabFromPath = (): 'build' | 'themes' | 'domains' | 'statistics' => {
    if (location.pathname.includes('/themes')) return 'themes';
    if (location.pathname.includes('/domains')) return 'domains';
    if (location.pathname.includes('/statistics')) return 'statistics';
    return 'build';
  };

  const initialTab = getSubTabFromPath();

  if (!website || !website.has_active_site) {
    return <WebsiteWizard onComplete={handleWizardComplete} />;
  }

  return (
    <WebsiteDashboard
      website={website}
      onUpdateWebsite={handleUpdateWebsite}
      onResetWizard={handleResetWizard}
      initialTab={initialTab}
    />
  );
}
