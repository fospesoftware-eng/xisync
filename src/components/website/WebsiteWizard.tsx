import { useState } from 'react';
import { CreationMode, Website, ThemeConfig } from '../../types/websiteBuilder';
import { UrlScraperService } from '../../lib/services/urlScraperService';
import { DeepSeekAiService } from '../../lib/services/deepseekAiService';
import { GoDaddyDomainService } from '../../lib/services/godaddyDomainService';
import { WebsiteInventorySyncService } from '../../lib/services/websiteInventorySync';
import {
  Sparkles,
  Globe,
  Wand2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Package,
  Search,
  Loader2,
} from 'lucide-react';

interface WebsiteWizardProps {
  onComplete: (website: Website) => void;
}

const PRESET_THEMES: ThemeConfig[] = [
  {
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
  {
    id: 'theme-cyber',
    name: 'Cyber Matrix Ultra',
    name_zh: '赛博光影矩阵',
    description: 'Futuristic glowing dark theme designed for solar PV, electronics, & smart hardware.',
    preview_image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    color_palette: {
      primary: '#10b981',
      secondary: '#090d16',
      background: '#030712',
      text: '#ffffff',
      accent: '#06b6d4',
    },
    typography: { font_family_en: 'Plus Jakarta Sans', font_family_zh: 'Noto Sans SC', base_font_size: '15px' },
    component_style: { border_radius: 'rounded-2xl', shadow: 'shadow-xl' },
  },
  {
    id: 'theme-nordic',
    name: 'Nordic Clean Light',
    name_zh: '北欧极简冰白',
    description: 'Clean minimalist layout with high readability for consumer goods & apparel wholesale.',
    preview_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    color_palette: {
      primary: '#2563eb',
      secondary: '#f8fafc',
      background: '#ffffff',
      text: '#0f172a',
      accent: '#3b82f6',
    },
    typography: { font_family_en: 'Inter', font_family_zh: 'Source Han Sans CN', base_font_size: '15px' },
    component_style: { border_radius: 'rounded-md', shadow: 'shadow-sm' },
  },
];

export function WebsiteWizard({ onComplete }: WebsiteWizardProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);
  const [creationMode, setCreationMode] = useState<CreationMode>('url_conversion');
  const [sourceUrl, setSourceUrl] = useState('https://demo.exportco.com');
  const [industryPrompt, setIndustryPrompt] = useState('High-Tech Solar PV Inverters & Precision Energy Hardware');
  const [businessName, setBusinessName] = useState('ExportCo International');
  const [category, setCategory] = useState('High-Tech Electronics & Machinery');
  const [selectedTheme, setSelectedTheme] = useState<ThemeConfig>(PRESET_THEMES[0]);
  const [inventorySyncEnabled, setInventorySyncEnabled] = useState(true);

  // Step 3 Domain setup
  const [domainMode, setDomainMode] = useState<'subdomain' | 'custom'>('subdomain');
  const [customDomainInput, setCustomDomainInput] = useState('exportco-global.com');
  const [godaddySearchQuery, setGodaddySearchQuery] = useState('');
  const [godaddyResults, setGodaddyResults] = useState<any[]>([]);
  const [godaddySearching, setGodaddySearching] = useState(false);

  // Step 4 Loading state
  const [generating, setGenerating] = useState(false);
  const [progressStatus, setProgressStatus] = useState('Scraping URL and initializing DeepSeek AI...');
  const [progressPct, setProgressPct] = useState(0);

  const handleGodaddySearch = async () => {
    if (!godaddySearchQuery.trim()) return;
    setGodaddySearching(true);
    try {
      const res = await GoDaddyDomainService.searchDomainAvailability(godaddySearchQuery);
      setGodaddyResults(res);
    } catch (err) {
      console.error(err);
    } finally {
      setGodaddySearching(false);
    }
  };

  const handleFinalizeAndLaunch = async () => {
    setGenerating(true);
    setProgressPct(15);
    setProgressStatus('Scraping source URL structure & removing third-party scripts...');

    try {
      if (creationMode === 'url_conversion') {
        await UrlScraperService.scrapeClientUrl(sourceUrl);
      }
      setProgressPct(45);
      setProgressStatus('Engaging DeepSeek AI engine for dual-language (EN/ZH) translation & Google SEO structuring...');

      const { pages } = await DeepSeekAiService.generateBilingualSiteContent({
        mode: creationMode,
        sourceUrl,
        industryPrompt,
        businessName,
        category,
      });

      setProgressPct(75);
      setProgressStatus('Connecting site product blocks to XiSync Client Desk inventory stock...');

      await WebsiteInventorySyncService.fetchClientDeskInventory();

      setProgressPct(95);
      setProgressStatus('Configuring DNS parameters & SSL certificates...');

      await new Promise((resolve) => setTimeout(resolve, 800));

      const chosenDomain =
        domainMode === 'custom' && customDomainInput
          ? customDomainInput
          : `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.xisync.site`;

      const generatedWebsite: Website = {
        id: `web-${Date.now()}`,
        tenant_id: 'tenant-demo',
        name: businessName,
        subdomain: `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.xisync.site`,
        custom_domain: domainMode === 'custom' ? customDomainInput : null,
        active_theme_id: selectedTheme.id,
        has_active_site: true,
        creation_mode: creationMode,
        source_url: sourceUrl,
        industry_prompt: industryPrompt,
        primary_language: 'en',
        inventory_sync_enabled: inventorySyncEnabled,
        status: 'published',
        theme_config: selectedTheme,
        pages,
        domain_config: {
          id: `dom-${Date.now()}`,
          website_id: `web-${Date.now()}`,
          domain_name: chosenDomain,
          provider: domainMode === 'custom' ? 'manual_dns' : 'xisync_subdomain',
          status: 'connected',
          dns_records: GoDaddyDomainService.getManualDnsParameters(chosenDomain),
          connected_at: new Date().toISOString(),
        },
        analytics: {
          website_id: `web-${Date.now()}`,
          total_pageviews: 14820,
          unique_visitors: 4290,
          bounce_rate_pct: 32.4,
          avg_session_duration: '3m 45s',
          language_preference_ratio: { en: 68, zh: 32 },
          seo_indexing_status: {
            google_indexed_pages: 14,
            baidu_indexed_pages: 12,
            health_score: 96,
            audit_checks: [
              { id: 'seo-1', rule: 'H1-H3 Semantic Heading Structure', status: 'passed', score: 100, recommendation: 'H1 & H2 tags validated on all pages.' },
              { id: 'seo-2', rule: 'Bilingual Meta Titles & Descriptions', status: 'passed', score: 100, recommendation: 'EN & ZH meta tags present and indexed.' },
            ],
          },
          top_clicked_inventory_items: [
            { sku: 'INV-4000-HE', product_name: '5,000W Hybrid Solar Inverter', clicks: 1240 },
            { sku: 'LED-8800-HC', product_name: 'Smart Industrial LED Panel', clicks: 890 },
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

      setProgressPct(100);
      setProgressStatus('Site published successfully!');

      setTimeout(() => {
        onComplete(generatedWebsite);
      }, 500);
    } catch (err) {
      console.error(err);
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8 text-slate-900 dark:text-white">
      {/* Step Stepper Navigation Indicator */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              XiSync Website Builder Onboarding Engine
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Generate Your Global B2B Exporter Website</h1>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 font-mono">
            STEP {currentStep} OF 4
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2 pt-2">
          {[
            { num: 1, label: 'Creation Mode' },
            { num: 2, label: 'Theme & Inventory' },
            { num: 3, label: 'Domain Setup' },
            { num: 4, label: 'Launch & Publish' },
          ].map((s) => (
            <div key={s.num} className="space-y-1.5">
              <div
                className={`h-2 rounded-full transition-all ${
                  currentStep >= s.num
                    ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400'
                    : 'bg-slate-200 dark:bg-slate-800'
                }`}
              />
              <span className={`text-[11px] font-bold block truncate ${currentStep === s.num ? 'text-cyan-500' : 'text-slate-400'}`}>
                {s.num}. {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1 — Creation Mode Selection */}
      {currentStep === 1 && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold">Step 1: Choose Website Creation Mode</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Convert an existing domain or generate a brand new bilingual site from scratch with DeepSeek AI.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Option A: Convert URL */}
            <div
              onClick={() => setCreationMode('url_conversion')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all space-y-4 ${
                creationMode === 'url_conversion'
                  ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                  <Globe className="w-6 h-6" />
                </div>
                {creationMode === 'url_conversion' && <CheckCircle2 className="w-5 h-5 text-cyan-500" />}
              </div>
              <div>
                <h3 className="font-extrabold text-base">Option A: Convert Existing Website URL</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Enter your current website URL. System crawls content, cleans third-party scripts, and DeepSeek AI translates into dual-language (EN & ZH) with Google SEO.
                </p>
              </div>
            </div>

            {/* Option B: Build from Scratch */}
            <div
              onClick={() => setCreationMode('from_scratch')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all space-y-4 ${
                creationMode === 'from_scratch'
                  ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Wand2 className="w-6 h-6" />
                </div>
                {creationMode === 'from_scratch' && <CheckCircle2 className="w-5 h-5 text-cyan-500" />}
              </div>
              <div>
                <h3 className="font-extrabold text-base">Option B: Build Brand New Site from Scratch</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                  Enter your business name and industry prompt. DeepSeek AI generates initial bilingual site copy, hero banners, product categories, and SEO structure.
                </p>
              </div>
            </div>
          </div>

          {/* Form Inputs based on Selection */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-4 text-xs">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Company / Brand Name</label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none"
                  placeholder="e.g. ExportCo International"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Industry Manufacturing Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none"
                >
                  <option>High-Tech Electronics & Machinery</option>
                  <option>Solar PV & Energy Storage</option>
                  <option>Precision Hardware & Automotive</option>
                  <option>Apparel, Textiles & Footwear</option>
                </select>
              </div>
            </div>

            {creationMode === 'url_conversion' ? (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Existing Website URL to Scrape</label>
                <input
                  type="text"
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-cyan-600 dark:text-cyan-400 outline-none"
                  placeholder="https://yourcompany.com"
                />
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  DeepSeek AI will scrape product lines, media, and navigation hierarchy automatically.
                </p>
              </div>
            ) : (
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">AI Prompt & Factory Positioning</label>
                <textarea
                  rows={3}
                  value={industryPrompt}
                  onChange={(e) => setIndustryPrompt(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold outline-none"
                  placeholder="Describe your products, ISO certifications, and target markets..."
                />
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 hover:opacity-90 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
            >
              <span>Next: Theme & Inventory Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — Theme & Inventory Connection */}
      {currentStep === 2 && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold">Step 2: Theme Selection & Client Desk Stock Sync</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Choose your visual layout style and link your live product inventory from XiSync Client Desk.
            </p>
          </div>

          {/* Theme Options Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {PRESET_THEMES.map((theme) => (
              <div
                key={theme.id}
                onClick={() => setSelectedTheme(theme)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                  selectedTheme.id === theme.id
                    ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="h-32 rounded-xl overflow-hidden relative">
                  <img src={theme.preview_image} alt={theme.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 p-2 flex items-end">
                    <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded bg-slate-900/80 font-mono">
                      {theme.name_zh}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-sm">{theme.name}</h3>
                    {selectedTheme.id === theme.id && <CheckCircle2 className="w-4 h-4 text-cyan-500" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                    {theme.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Client Desk Inventory Connection Toggle */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">
                  Connect XiSync Client Desk Inventory Stock
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  Automatically sync live product stock status, SKU pricing, and catalog items to website product pages.
                </p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inventorySyncEnabled}
                onChange={(e) => setInventorySyncEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:after:border-slate-600 peer-checked:bg-cyan-500" />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 hover:opacity-90 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
            >
              <span>Next: Initial Domain Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — Initial Domain Setup */}
      {currentStep === 3 && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold">Step 3: Initial Domain Setup & Custom Connectivity</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Start with a free temporary sub-domain or connect your custom domain via Manual DNS or GoDaddy API.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Subdomain Option */}
            <div
              onClick={() => setDomainMode('subdomain')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                domainMode === 'subdomain'
                  ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                  FREE TEMPORARY
                </span>
                {domainMode === 'subdomain' && <CheckCircle2 className="w-5 h-5 text-cyan-500" />}
              </div>
              <h3 className="font-extrabold text-base">XiSync Free Sub-Domain</h3>
              <p className="text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                {businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.xisync.site
              </p>
            </div>

            {/* Custom Domain Option */}
            <div
              onClick={() => setDomainMode('custom')}
              className={`p-6 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
                domainMode === 'custom'
                  ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/20 shadow-md'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-500">
                  CUSTOM DOMAIN
                </span>
                {domainMode === 'custom' && <CheckCircle2 className="w-5 h-5 text-cyan-500" />}
              </div>
              <h3 className="font-extrabold text-base">Connect Custom Domain (Manual DNS / GoDaddy)</h3>
              <p className="text-xs text-slate-400 font-medium">
                Connect your existing registrar domain via A-Record / CNAME or search/buy via GoDaddy API.
              </p>
            </div>
          </div>

          {domainMode === 'custom' && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Enter Custom Domain Name</label>
                <input
                  type="text"
                  value={customDomainInput}
                  onChange={(e) => setCustomDomainInput(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold outline-none"
                  placeholder="e.g. exportco-global.com"
                />
              </div>

              {/* GoDaddy API Search Tool */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white">GoDaddy API Domain Availability Search</span>
                  <span className="text-[10px] font-mono text-cyan-500">API v3 LIVE</span>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={godaddySearchQuery}
                    onChange={(e) => setGodaddySearchQuery(e.target.value)}
                    placeholder="Search available domains..."
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold outline-none"
                  />
                  <button
                    onClick={handleGodaddySearch}
                    disabled={godaddySearching}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5"
                  >
                    {godaddySearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>Check</span>
                  </button>
                </div>

                {godaddyResults.length > 0 && (
                  <div className="space-y-2 pt-2">
                    {godaddyResults.map((r) => (
                      <div
                        key={r.domain}
                        className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono font-extrabold text-slate-900 dark:text-white">{r.domain}</span>
                          <span className="ml-2 text-[10px] text-emerald-500 font-bold">AVAILABLE</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-extrabold text-sm text-cyan-600 dark:text-cyan-400">${r.price_usd} / yr</span>
                          <button
                            onClick={() => setCustomDomainInput(r.domain)}
                            className="px-3 py-1 rounded-lg bg-cyan-500 text-white font-bold text-[10px]"
                          >
                            Use Domain
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 hover:opacity-90 text-white font-extrabold text-xs shadow-md flex items-center gap-2"
            >
              <span>Next: Finalize & Launch</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4 — Finalize & Launch */}
      {currentStep === 4 && (
        <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6 text-center animate-in fade-in">
          {!generating ? (
            <div className="space-y-6 py-6">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-xisync-blue-600 to-xisync-cyan-400 text-white mx-auto flex items-center justify-center shadow-lg">
                <Wand2 className="w-8 h-8" />
              </div>
              <div className="space-y-2 max-w-lg mx-auto">
                <h2 className="text-2xl font-extrabold">Ready to Generate & Launch Your Site</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                  DeepSeek AI will process content in English & Simplified Chinese, apply SEO structuring, and connect your Client Desk inventory.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 max-w-md mx-auto text-left text-xs space-y-2 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Creation Mode:</span>
                  <span className="capitalize text-cyan-600 dark:text-cyan-400 font-bold">{creationMode.replace('_', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Selected Theme:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedTheme.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stock Inventory Sync:</span>
                  <span className="text-emerald-500 font-bold">{inventorySyncEnabled ? 'CONNECTED' : 'DISABLED'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Primary Domain:</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">
                    {domainMode === 'custom' && customDomainInput
                      ? customDomainInput
                      : `${businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.xisync.site`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleFinalizeAndLaunch}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 hover:opacity-95 text-white font-extrabold text-sm shadow-xl flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                  <span>Generate Site with DeepSeek AI</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="py-12 space-y-6 max-w-md mx-auto">
              <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="font-extrabold text-lg">Generating Bilingual Website</h3>
                <p className="text-xs text-cyan-600 dark:text-cyan-400 font-mono font-bold animate-pulse">{progressStatus}</p>
              </div>
              <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
