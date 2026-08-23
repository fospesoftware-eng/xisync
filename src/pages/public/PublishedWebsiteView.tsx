import { useState, useEffect } from 'react';
import { Website, LanguageCode, InventoryItemSync } from '../../types/websiteBuilder';
import { WebsiteInventorySyncService } from '../../lib/services/websiteInventorySync';
import { EcoToysTemplate } from '../../components/website/templates/EcoToysTemplate';
import {
  Globe,
  Phone,
  Mail,
  ShieldCheck,
  Package,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Download,
  MapPin,
  Building2,
  Send,
  Layers,
  Check,
  X,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'xisync_website_builder_state';

const DEFAULT_DEMO_WEBSITE: Website = {
  id: 'web-default-1',
  tenant_id: 'tenant-demo',
  name: 'Eco-Toys Craft Workshop',
  subdomain: 'ecotoys.xisync.site',
  custom_domain: 'eco-toys.com',
  active_theme_id: 'theme-ecotoys',
  has_active_site: true,
  creation_mode: 'url_conversion',
  source_url: 'https://eco-toys.com',
  primary_language: 'en',
  inventory_sync_enabled: true,
  status: 'published',
  theme_config: {
    id: 'theme-ecotoys',
    name: 'Eco-Toys Pastel (Soft Craft)',
    name_zh: '生态玩具 / 婴童木作 (莫兰迪柔蓝)',
    description: 'Bespoke soft pastel sky-blue theme with rounded cards, cloud accents, and circular CTA badges tailored for toys, kids & crafts.',
    preview_image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    color_palette: {
      primary: '#1E3A5F',
      secondary: '#DDECF0',
      background: '#DDECF0',
      text: '#1E3A5F',
      accent: '#A9D0E4',
    },
    typography: { font_family_en: 'Playfair Display', font_family_zh: 'Noto Serif SC', base_font_size: '15px' },
    component_style: { border_radius: 'rounded-2xl', shadow: 'shadow-sm' },
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
            zh: '赋能全球供应链：精工制造高端能源与电子装备',
          },
          subtitle: {
            en: 'Direct from ExportCo Pudong Smart Manufacturing Base. Certified for US, EU & APAC Compliance.',
            zh: '源自 ExportCo 浦东智能制造基地，全线通过北美、欧盟及亚太国际合规认证。',
          },
          content: {
            en: 'Empowering global wholesale buyers with automated negotiation, dynamic margin pricing, and guaranteed 40ft container freight transit.',
            zh: '为全球大宗采购商提供 AI 自主议价、动态边际定价以及 COSCO 保障集装箱海运班轮服务。',
          },
          media_urls: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80'],
          cta_button: { label: { en: 'Request Wholesale RFQ', zh: '获取大宗批发报价单' }, link: '#rfq-calculator' },
        },
        {
          id: 'sec-features',
          type: 'features',
          title: { en: 'Why Partner With Our Factory', zh: '工厂核心竞争优势' },
          subtitle: { en: 'End-to-End Exporter Quality Assurance & Direct Port Dispatch', zh: '全流程出口品质保障与直接港口班轮发运' },
          content: {
            en: '100% automated QC inspection, 15-day sea freight dispatch to LAX/Rotterdam, and multi-currency L/C payment settlement.',
            zh: '100% 自动全检，15天直达美西/欧洲港口，支持多币种信用证与电汇结算。',
          },
        },
        {
          id: 'sec-products',
          type: 'products',
          title: { en: 'Featured Export Inventory Catalog', zh: '核心现货出口产品目录' },
          subtitle: { en: 'Connected to XiSync Live Stock Inventory', zh: '已实时同步犀同步智能库存中心' },
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
    seo_indexing_status: {
      google_indexed_pages: 14,
      baidu_indexed_pages: 12,
      health_score: 96,
      audit_checks: [],
    },
    top_clicked_inventory_items: [],
    monthly_traffic_trend: [],
  },
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export function PublishedWebsiteView() {
  const [lang, setLang] = useState<LanguageCode>('en');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'GBP' | 'CNY'>('USD');
  const [website] = useState<Website>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_DEMO_WEBSITE;
  });

  const [inventory, setInventory] = useState<InventoryItemSync[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showRfqModal, setShowRfqModal] = useState(false);
  const [rfqProduct, setRfqProduct] = useState<InventoryItemSync | null>(null);
  const [rfqQuantity, setRfqQuantity] = useState(500);
  const [rfqPort, setRfqPort] = useState('Los Angeles (USLAX), USA');
  const [rfqSubmitted, setRfqSubmitted] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'products' | 'factory' | 'logistics' | 'certifications' | 'contact'>('home');

  useEffect(() => {
    (async () => {
      const items = await WebsiteInventorySyncService.fetchClientDeskInventory();
      setInventory(items);
    })();
  }, []);

  const filteredInventory =
    selectedCategory === 'all'
      ? inventory
      : inventory.filter((item) => item.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  const handleOpenRfq = (item?: InventoryItemSync) => {
    if (item) setRfqProduct(item);
    else if (inventory.length > 0) setRfqProduct(inventory[0]);
    setRfqSubmitted(false);
    setShowRfqModal(true);
  };

  const handleSubmitRfq = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSubmitted(true);
    setTimeout(() => {
      setShowRfqModal(false);
      setRfqSubmitted(false);
    }, 2500);
  };

  // If active theme is Eco-Toys, render the bespoke Eco-Toys storefront template!
  if (website.active_theme_id === 'theme-ecotoys' || website.name.toLowerCase().includes('toy')) {
    return (
      <EcoToysTemplate
        website={website}
        lang={lang}
        onLanguageChange={setLang}
        currency={currency}
        onCurrencyChange={setCurrency}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
      {/* 1. TOP UTILITY BAR (Global Exporter Ribbon) */}
      <div className="bg-slate-900/90 border-b border-slate-800 text-xs py-2 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Left credentials */}
          <div className="flex items-center gap-4 text-slate-400 font-medium overflow-x-auto whitespace-nowrap">
            <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Shanghai Pudong Base • Port Hub (CNSHA)</span>
            </span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>ISO 9001:2015 & CE Certified</span>
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:flex items-center gap-1">
              <Phone className="w-3 h-3 text-slate-400" />
              <span>+86 (21) 5888-9920</span>
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as any)}
              className="bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2 py-0.5 text-[11px] font-bold outline-none cursor-pointer"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CNY">CNY (¥)</option>
            </select>

            {/* Language Switcher */}
            <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg text-[11px] font-bold">
              <button
                onClick={() => setLang('en')}
                className={`px-2 py-0.5 rounded transition-all ${
                  lang === 'en' ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('zh')}
                className={`px-2 py-0.5 rounded transition-all ${
                  lang === 'zh' ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                中文
              </button>
            </div>

            <button
              onClick={() => handleOpenRfq()}
              className="px-3 py-1 rounded-lg bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-extrabold text-[11px] shadow-xs hover:opacity-90 transition-all flex items-center gap-1"
            >
              <Send className="w-3 h-3 text-amber-300" />
              <span>{lang === 'zh' ? '2小时快速询价' : 'Fast RFQ (2h)'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER NAVIGATION BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveNavTab('home')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white flex items-center justify-center shadow-lg">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white block leading-tight">
                {website.name.toUpperCase()}
              </span>
              <span className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">
                GLOBAL B2B MANUFACTURING
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-300">
            <button
              onClick={() => setActiveNavTab('home')}
              className={`hover:text-cyan-400 transition-colors ${activeNavTab === 'home' ? 'text-cyan-400 font-extrabold' : ''}`}
            >
              {lang === 'zh' ? '首页' : 'Home'}
            </button>
            <button
              onClick={() => setActiveNavTab('products')}
              className={`hover:text-cyan-400 transition-colors flex items-center gap-1.5 ${activeNavTab === 'products' ? 'text-cyan-400 font-extrabold' : ''}`}
            >
              <span>{lang === 'zh' ? '产品现货目录' : 'Products & Stock'}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE
              </span>
            </button>
            <button
              onClick={() => setActiveNavTab('factory')}
              className={`hover:text-cyan-400 transition-colors ${activeNavTab === 'factory' ? 'text-cyan-400 font-extrabold' : ''}`}
            >
              {lang === 'zh' ? '智能工厂与产线' : 'Factory & QC Lab'}
            </button>
            <button
              onClick={() => setActiveNavTab('logistics')}
              className={`hover:text-cyan-400 transition-colors ${activeNavTab === 'logistics' ? 'text-cyan-400 font-extrabold' : ''}`}
            >
              {lang === 'zh' ? '港口海运时效' : 'Ocean Logistics'}
            </button>
            <button
              onClick={() => setActiveNavTab('certifications')}
              className={`hover:text-cyan-400 transition-colors ${activeNavTab === 'certifications' ? 'text-cyan-400 font-extrabold' : ''}`}
            >
              {lang === 'zh' ? '国际合规认证' : 'Certifications'}
            </button>
            <button
              onClick={() => setActiveNavTab('contact')}
              className={`hover:text-cyan-400 transition-colors ${activeNavTab === 'contact' ? 'text-cyan-400 font-extrabold' : ''}`}
            >
              {lang === 'zh' ? '联系外销团队' : 'Contact & RFQ'}
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenRfq()}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white font-extrabold text-xs shadow-lg hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <span>{lang === 'zh' ? '索取 2026 产品画册' : 'Download Catalog (PDF)'}</span>
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 3. HERO BANNER (Cinematic Global Exporter Showcase) */}
      <section className="relative overflow-hidden pt-12 pb-20 px-4 md:px-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        {/* Glow ambient circle */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              <span>
                {lang === 'zh'
                  ? '国家级高新技术外贸制造企业 • ISO 9001 认证'
                  : 'CERTIFIED DIRECT EXPORTER • ISO 9001:2015 & CE'}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {lang === 'zh' ? (
                <>
                  赋能全球供应链：<br />
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-lime-300 bg-clip-text text-transparent">
                    精工智造 出口直供
                  </span>
                </>
              ) : (
                <>
                  Precision Engineered <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-lime-300 bg-clip-text text-transparent">
                    B2B Manufacturing
                  </span>{' '}
                  for Global Supply Chains
                </>
              )}
            </h1>

            <p className="text-base text-slate-300 font-medium max-w-xl leading-relaxed">
              {lang === 'zh'
                ? '依托上海浦东自动化生产基地与宁波舟山港直发班轮，为欧美及亚太批发商提供大宗采购、OEM/ODM 深度定制以及 25% 美关税 301 豁免保障。'
                : 'Direct from Shanghai Pudong automated facility. Supplying wholesale buyers across North America, Europe & APAC with guaranteed FCL container transit and Section 301 tariff duty exemptions.'}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => handleOpenRfq()}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white font-extrabold text-sm shadow-xl hover:opacity-95 transition-all flex items-center gap-2"
              >
                <span>{lang === 'zh' ? '获取大宗批发报价单 (RFQ)' : 'Request Wholesale Quote (RFQ)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveNavTab('products')}
                className="px-6 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all flex items-center gap-2"
              >
                <Package className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'zh' ? '浏览现货库存' : 'View In-Stock SKUs'}</span>
              </button>
            </div>

            {/* Key Exporter Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80">
              {[
                { val: '45,000 m²', label: lang === 'zh' ? '数智生产基地' : 'Factory Base' },
                { val: '12 Lines', label: lang === 'zh' ? '德国 SMT 产线' : 'Auto SMT Lines' },
                { val: '50+ Ports', label: lang === 'zh' ? '全球直达口岸' : 'Export Ports' },
                { val: '< 0.01%', label: lang === 'zh' ? '0 PPM 瑕疵率' : 'Defect Rate' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-xl font-black text-white font-mono">{stat.val}</div>
                  <div className="text-xs text-slate-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-3xl border border-slate-700/80 bg-slate-900/90 p-4 shadow-2xl space-y-4">
              <div className="h-64 rounded-2xl overflow-hidden relative">
                <img
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80"
                  alt="Manufacturing Facility"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[11px] font-mono font-bold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>LINE #3 ACTIVE DISPATCH</span>
                </div>
              </div>

              <div className="p-2 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-400">Current Maritime Carrier:</span>
                  <span className="text-cyan-400 font-mono">COSCO Ocean Express</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-400">Next FCL Vessel Departure:</span>
                  <span className="text-white font-mono">CNSHA ➔ USLAX (Aug 26)</span>
                </div>
                <div className="flex items-center justify-between font-bold">
                  <span className="text-slate-400">US Tariff Duty Optimization:</span>
                  <span className="text-emerald-400 font-bold">Section 301 Approved (25% Savings)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT CATALOG & LIVE CLIENT DESK STOCK */}
      <section id="products" className="py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="space-y-2 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              <Package className="w-4 h-4" />
              <span>{lang === 'zh' ? '犀同步 实时现货库存中心' : 'XiSync Live Stock & Catalog'}</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              {lang === 'zh' ? '核心外贸出口产品现货目录' : 'Featured Export Product Catalog'}
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              {lang === 'zh'
                ? '全部现货库存支持 40 尺高柜整柜海运拼箱、多币种结算及 OEM 定制加标。'
                : 'All products ready for 40ft HC ocean container dispatch, multi-currency settlement, and OEM custom branding.'}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {[
              { id: 'all', label: lang === 'zh' ? '全部现货' : 'All Products' },
              { id: 'solar', label: lang === 'zh' ? '光伏与储能' : 'Solar PV & Energy' },
              { id: 'electronics', label: lang === 'zh' ? '智能电子' : 'High-Tech Electronics' },
              { id: 'hardware', label: lang === 'zh' ? '精工五金' : 'Precision Hardware' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => (
            <div
              key={item.sku}
              className="rounded-3xl border border-slate-800 bg-slate-900/70 overflow-hidden flex flex-col justify-between hover:border-cyan-500/50 transition-all group shadow-lg"
            >
              <div>
                <div className="h-52 overflow-hidden relative">
                  <img
                    src={item.image_url}
                    alt={item.name[lang]}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-950/80 text-cyan-400 border border-cyan-500/30">
                    SKU: {item.sku}
                  </div>
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>{item.stock_count} {lang === 'zh' ? '件现货' : 'in Stock'}</span>
                  </div>
                </div>

                <div className="p-6 space-y-3 text-left">
                  <div className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                    {item.category}
                  </div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-cyan-400 transition-colors">
                    {item.name[lang]}
                  </h3>
                  <div className="flex items-baseline gap-2 pt-1 border-t border-slate-800">
                    <span className="text-2xl font-black text-cyan-400 font-mono">
                      ${item.price_usd}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      / {lang === 'zh' ? '台 (FOB 上海港)' : 'unit (FOB CNSHA)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-2">
                <button
                  onClick={() => handleOpenRfq(item)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 hover:opacity-95 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'zh' ? '获取专属报价' : 'Instant RFQ'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. INTERACTIVE B2B RFQ & INSTANT QUOTE CALCULATOR */}
      <section id="rfq-calculator" className="py-20 px-4 md:px-8 bg-slate-900/60 border-y border-slate-800">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-4 text-left">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
              <Send className="w-4 h-4" />
              <span>{lang === 'zh' ? '智能询价引擎' : 'Autonomous RFQ Engine'}</span>
            </div>
            <h2 className="text-3xl font-black text-white">
              {lang === 'zh' ? '在线计算大宗集装箱采购运价' : 'Calculate Wholesale FCL Ocean Rates'}
            </h2>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              {lang === 'zh'
                ? '直接输入采购数量与目的港口，系统自动匹配 COSCO 班轮舱位与 CIF 最优运价。'
                : 'Select quantity and destination port. Instant FOB/CIF pricing generated and dispatched to exporter desk.'}
            </p>

            <div className="space-y-2 pt-2 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'zh' ? '保障 2 小时内出具正式 Proforma 账单' : 'Official Proforma Invoice within 2 hours'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'zh' ? '支持 T/T 30/70 及多币种不可撤销信用证' : 'Irrevocable L/C & T/T 30/70 terms accepted'}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl space-y-4 text-left text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">
                    {lang === 'zh' ? '目标采购产品' : 'Selected Product'}
                  </label>
                  <select
                    value={rfqProduct?.sku || ''}
                    onChange={(e) => {
                      const found = inventory.find((i) => i.sku === e.target.value);
                      if (found) setRfqProduct(found);
                    }}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-900 font-bold text-white outline-none"
                  >
                    {inventory.map((item) => (
                      <option key={item.sku} value={item.sku}>
                        {item.name[lang]} (${item.price_usd})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">
                    {lang === 'zh' ? '采购数量 (件 / 套)' : 'Quantity (Units)'}
                  </label>
                  <input
                    type="number"
                    value={rfqQuantity}
                    onChange={(e) => setRfqQuantity(Number(e.target.value))}
                    min={50}
                    className="w-full p-3 rounded-xl border border-slate-800 bg-slate-900 font-mono font-bold text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-400 block mb-1">
                  {lang === 'zh' ? '目的港口 (Destination Port)' : 'Destination Ocean Port'}
                </label>
                <select
                  value={rfqPort}
                  onChange={(e) => setRfqPort(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-800 bg-slate-900 font-semibold text-white outline-none"
                >
                  <option>Los Angeles (USLAX), USA • 14 Days Transit</option>
                  <option>Rotterdam (NLRTM), Netherlands • 22 Days Transit</option>
                  <option>Nhava Sheva (INNSA), India • 8 Days Transit</option>
                  <option>Jebel Ali (AEDXB), UAE • 16 Days Transit</option>
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Estimated Total CIF Value</div>
                  <div className="text-2xl font-black text-cyan-400 font-mono">
                    ${((rfqProduct?.price_usd || 1250) * rfqQuantity).toLocaleString()} USD
                  </div>
                </div>
                <button
                  onClick={() => handleOpenRfq(rfqProduct || undefined)}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{lang === 'zh' ? '提交外销询价' : 'Submit Wholesale Inquiry'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRODUCTION CAPACITY & QC LAB */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto space-y-12 text-left">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-cyan-400 uppercase">
            <Layers className="w-4 h-4" />
            <span>{lang === 'zh' ? '智能制造与品控' : 'Smart Manufacturing & QC Lab'}</span>
          </div>
          <h2 className="text-3xl font-black text-white">
            {lang === 'zh' ? '德国 SMT 全自动产线与 100% 光学全检' : 'German SMT Automation & 100% AOI Inspection'}
          </h2>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: lang === 'zh' ? '精密原材光谱检验' : 'Raw Material Spectrometry',
              desc: lang === 'zh' ? '所有元器件进厂前进行RoHS环保与光谱分析。' : '100% incoming component inspection and RoHS validation.',
            },
            {
              step: '02',
              title: lang === 'zh' ? '全自动 SMT 贴片' : 'High-Speed SMT Mounting',
              desc: lang === 'zh' ? '德国西门子高速贴片机，贴装精度 ±0.01mm。' : 'Siemens high-speed mounters with ±0.01mm accuracy.',
            },
            {
              step: '03',
              title: lang === 'zh' ? '72小时高温老化' : '72h High-Temp Burn-In',
              desc: lang === 'zh' ? '全功率负载高温连续老化测试，剔除早期隐患。' : 'Full-load stress burn-in to eliminate early component failure.',
            },
            {
              step: '04',
              title: lang === 'zh' ? '整柜集装箱海运加固' : 'FCL Ocean Packaging',
              desc: lang === 'zh' ? '防潮防震熏蒸托盘打包，直发上海港口。' : 'Moisture-proof fumigated pallets ready for direct port dispatch.',
            },
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-3xl border border-slate-800 bg-slate-900/60 space-y-3">
              <div className="text-2xl font-black text-cyan-500 font-mono">{item.step}</div>
              <h3 className="font-extrabold text-base text-white">{item.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="bg-slate-950 border-t border-slate-800 pt-16 pb-12 px-4 md:px-8 text-left text-xs text-slate-400">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-xisync-blue-600 to-xisync-cyan-400 text-white flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold text-white">{website.name}</span>
            </div>
            <p className="leading-relaxed">
              Global exporter of high-precision electronic equipment, solar energy components, and industrial machinery.
            </p>
            <div className="text-[11px] font-mono text-slate-500">
              Tax ID: 91310115MA1K39812A • Shanghai CNSHA
            </div>
          </div>

          <div className="space-y-2">
            <div className="font-extrabold text-white text-sm mb-2">Export Categories</div>
            <div>Solar PV & Commercial Inverters</div>
            <div>Industrial Smart LED Lighting</div>
            <div>Precision Micro-Transformers</div>
            <div>Custom OEM/ODM Metal Parts</div>
          </div>

          <div className="space-y-2">
            <div className="font-extrabold text-white text-sm mb-2">Maritime Port Dispatch</div>
            <div>Port of Shanghai (CNSHA)</div>
            <div>Port of Ningbo-Zhoushan (CNNGB)</div>
            <div>Port of Shenzhen Yantian (CNSZX)</div>
            <div>Port of Guangzhou Nansha (CNCAN)</div>
          </div>

          <div className="space-y-3">
            <div className="font-extrabold text-white text-sm">Direct Exporter Sales Desk</div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>export@exportco-global.com</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-cyan-400" />
              <span>+86 (21) 5888-9920</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span>Pudong New Area, Shanghai 201203, China</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>© {new Date().getFullYear()} {website.name}. All Global Rights Reserved.</div>
          <div className="flex items-center gap-2 font-mono">
            <span>Powered by</span>
            <span className="text-cyan-400 font-bold">XiSync B2B SaaS Cloud Engine</span>
          </div>
        </div>
      </footer>

      {/* 8. INSTANT RFQ INQUIRY MODAL */}
      {showRfqModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-white">
                  {lang === 'zh' ? '向外贸工厂提交大宗采购询价 (RFQ)' : 'Submit Wholesale RFQ to Exporter'}
                </h3>
                <p className="text-[11px] text-slate-400">
                  {lang === 'zh' ? '2小时内出具官方报价单与船期' : 'Official quotation & sailing schedule within 2 hours'}
                </p>
              </div>
              <button
                onClick={() => setShowRfqModal(false)}
                className="p-1 text-slate-400 hover:text-white rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!rfqSubmitted ? (
              <form onSubmit={handleSubmitRfq} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-400 block mb-1">Target Product SKU</label>
                  <input
                    type="text"
                    readOnly
                    value={`${rfqProduct?.name[lang] || 'Selected Item'} (${rfqProduct?.sku || 'SKU-001'})`}
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 font-bold text-cyan-400 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Your Name</label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. David Miller"
                      className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Work Email</label>
                    <input
                      required
                      type="email"
                      placeholder="david@company.com"
                      className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-semibold outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">Company / Importer</label>
                    <input
                      required
                      type="text"
                      placeholder="Global Tech Distribution LLC"
                      className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-400 block mb-1">WhatsApp / Phone</label>
                    <input
                      type="text"
                      placeholder="+1 (555) 019-2834"
                      className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-semibold outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-400 block mb-1">Inquiry Specifications & Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Provide container packaging requirements, OEM logo branding, or Incoterms requests..."
                    className="w-full p-2.5 rounded-xl border border-slate-800 bg-slate-950 text-white font-medium outline-none"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRfqModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-slate-800 font-bold text-xs text-slate-400"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Wholesale Inquiry</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                <h4 className="font-extrabold text-lg text-white">Wholesale RFQ Dispatched!</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Your inquiry has been received by {website.name} exporter sales desk. Official proforma quote will be sent within 2 hours.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
