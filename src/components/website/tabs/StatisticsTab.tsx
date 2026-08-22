import { useState } from 'react';
import { Website, SiteAnalytics } from '../../../types/websiteBuilder';
import { BarChart3, TrendingUp, Globe, Package, Users, Eye, Activity, CheckCircle2, AlertTriangle, XCircle, Search } from 'lucide-react';

interface StatisticsTabProps {
  website: Website;
}

export function StatisticsTab({ website }: StatisticsTabProps) {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('30d');

  const analytics: SiteAnalytics = website.analytics || {
    website_id: website.id,
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
        { id: 'seo-3', rule: 'JSON-LD Organization Schema Markup', status: 'passed', score: 95, recommendation: 'Structured schema active for Google Rich Snippets.' },
        { id: 'seo-4', rule: 'Image Alt Tag Accessibility', status: 'warning', score: 85, recommendation: 'Add Chinese alt text to 2 factory product images.' },
      ],
    },
    top_clicked_inventory_items: [
      { sku: 'INV-4000-HE', product_name: '5,000W Hybrid Solar Inverter', clicks: 1240 },
      { sku: 'LED-8800-HC', product_name: 'Smart Industrial LED Panel', clicks: 890 },
      { sku: 'TR-9900-MX', product_name: 'Precision Micro-Transformer Assembly Line #3', clicks: 640 },
      { sku: 'PV-BOX-2026', product_name: 'IP68 Waterproof PV Junction Box', clicks: 420 },
    ],
    monthly_traffic_trend: [
      { month: 'Apr', pageviews: 2800, visitors: 940 },
      { month: 'May', pageviews: 4200, visitors: 1280 },
      { month: 'Jun', pageviews: 6100, visitors: 1950 },
      { month: 'Jul', pageviews: 9400, visitors: 2890 },
      { month: 'Aug', pageviews: 14820, visitors: 4290 },
    ],
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Website Traffic & Inventory Analytics</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Real-time B2B buyer traffic, search engine SEO indexing health, and catalog interaction metrics
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            {(['30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg uppercase transition-all ${
                  timeRange === range
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            SEO HEALTH SCORE: {analytics.seo_indexing_status.health_score}/100
          </span>
        </div>
      </div>

      {/* Primary KPI Deck */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            title: 'Total Pageviews',
            value: analytics.total_pageviews.toLocaleString(),
            change: '+24.8%',
            icon: <Eye className="w-5 h-5" />,
            color: 'bg-blue-500/10 text-blue-500',
          },
          {
            title: 'Unique B2B Visitors',
            value: analytics.unique_visitors.toLocaleString(),
            change: '+18.2%',
            icon: <Users className="w-5 h-5" />,
            color: 'bg-cyan-500/10 text-cyan-500',
          },
          {
            title: 'Avg Session Duration',
            value: analytics.avg_session_duration,
            change: '+12.4%',
            icon: <Activity className="w-5 h-5" />,
            color: 'bg-emerald-500/10 text-emerald-500',
          },
          {
            title: 'Bounce Rate',
            value: `${analytics.bounce_rate_pct}%`,
            change: '-4.1%',
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'bg-amber-500/10 text-amber-500',
          },
        ].map((kpi) => (
          <div key={kpi.title} className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">{kpi.title}</span>
              <div className={`p-2 rounded-xl ${kpi.color}`}>{kpi.icon}</div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{kpi.value}</span>
              <span className="text-xs font-mono font-bold text-emerald-500">{kpi.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid: Traffic Chart & Language / SEO Audit Breakdown */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Traffic Bar Graph & SEO Audit Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Monthly Visitor & Pageview Growth</h3>
                  <p className="text-xs text-slate-400 font-medium">B2B buyer traffic trends across global markets</p>
                </div>
              </div>
            </div>

            <div className="h-56 w-full relative flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
              {analytics.monthly_traffic_trend.map((bar) => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div
                      style={{ height: `${(bar.pageviews / 15000) * 100}%` }}
                      className="w-full max-w-[28px] rounded-t-lg bg-gradient-to-t from-xisync-blue-600 to-xisync-cyan-400 group-hover:opacity-90 transition-all duration-300 relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono font-bold whitespace-nowrap z-20 pointer-events-none">
                        {bar.pageviews.toLocaleString()} PV
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">{bar.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Indexing Health & Audit Checklist */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-500" />
                <h3 className="font-extrabold text-sm">SEO Health & Search Engine Audit</h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono font-bold">
                <span className="text-cyan-500">Google: {analytics.seo_indexing_status.google_indexed_pages} Pages</span>
                <span>•</span>
                <span className="text-emerald-500">Baidu: {analytics.seo_indexing_status.baidu_indexed_pages} Pages</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {(analytics.seo_indexing_status.audit_checks || []).map((check) => (
                <div
                  key={check.id}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5">
                    {check.status === 'passed' && <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />}
                    {check.status === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />}
                    {check.status === 'failed' && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                    <div>
                      <div className="font-extrabold text-slate-900 dark:text-white">{check.rule}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{check.recommendation}</div>
                    </div>
                  </div>

                  <span className="font-mono font-extrabold text-cyan-600 dark:text-cyan-400">{check.score}/100</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Language Preference Ratio & Top Clicked Inventory Items */}
        <div className="space-y-6">
          {/* Language Preference Ratio */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-500" />
                <h3 className="font-extrabold text-sm">Language Preference Ratio</h3>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>English (Global Exporters)</span>
                  <span className="font-mono text-cyan-500">{analytics.language_preference_ratio.en}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${analytics.language_preference_ratio.en}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-bold mb-1">
                  <span>Simplified Chinese (Domestic Direct)</span>
                  <span className="font-mono text-emerald-500">{analytics.language_preference_ratio.zh}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${analytics.language_preference_ratio.zh}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Top Clicked Stock Inventory Items */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Package className="w-4 h-4 text-amber-500" />
              <h3 className="font-extrabold text-sm">Top Clicked Catalog Items</h3>
            </div>

            <div className="space-y-3">
              {analytics.top_clicked_inventory_items.map((item) => (
                <div key={item.sku} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">{item.product_name}</div>
                    <div className="text-[10px] font-mono text-slate-400">SKU: {item.sku}</div>
                  </div>
                  <span className="font-mono font-extrabold text-cyan-600 dark:text-cyan-400">{item.clicks} clicks</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
