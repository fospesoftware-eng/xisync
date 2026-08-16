import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../../lib/i18n';
import { useTheme } from '../../../lib/theme-context';
import { mockCampaigns, mockLeadAttributions } from '../../../lib/mockMarketingData';
import { ChannelIcon } from '../../../components/ui/ChannelIcon';
import {
  TrendingUp,
  Target,
  DollarSign,
  Users,
  Eye,
  MousePointer,
  Zap,
  Plus,
  Radio,
  ArrowUpRight,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { marketingLeadSync } from '../../../lib/services/marketingLeadSync';
import { LeadAttributionItem } from '../../../types/marketing';

const trendChartData = [
  { month: 'Jan', spend: 8400, leads: 180, pipeline: 520000 },
  { month: 'Feb', spend: 11200, leads: 245, pipeline: 780000 },
  { month: 'Mar', spend: 14500, leads: 310, pipeline: 990000 },
  { month: 'Apr', spend: 12800, leads: 280, pipeline: 850000 },
  { month: 'May', spend: 16900, leads: 390, pipeline: 1250000 },
  { month: 'Jun', spend: 18500, leads: 450, pipeline: 1480000 },
];

const channelRoiData = [
  { name: 'Meta Ads', spend: 12450, leads: 285, cpl: 43.6, color: '#1877F2' },
  { name: 'Google Ads', spend: 18900, leads: 410, cpl: 46.0, color: '#4285F4' },
  { name: 'TikTok Ads', spend: 6800, leads: 190, cpl: 35.7, color: '#000000' },
  { name: 'WhatsApp API', spend: 3450, leads: 165, cpl: 20.9, color: '#25D366' },
];

const geoDistribution = [
  { region: 'North America', share: '38%', leads: 274, value: '$980k', color: 'bg-blue-500' },
  { region: 'Europe (EU/UK)', share: '28%', leads: 202, value: '$720k', color: 'bg-cyan-500' },
  { region: 'Middle East', share: '18%', leads: 130, value: '$460k', color: 'bg-emerald-500' },
  { region: 'LATAM', share: '10%', leads: 72, value: '$250k', color: 'bg-amber-500' },
  { region: 'Southeast Asia', share: '6%', leads: 44, value: '$130k', color: 'bg-rose-500' },
];

export function MarketingHubPage() {
  const { language } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'q1' | 'ytd'>('30d');
  const [campaigns, setCampaigns] = useState(mockCampaigns);
  const [liveLeads, setLiveLeads] = useState<LeadAttributionItem[]>(mockLeadAttributions);
  const [isSimulatingLead, setIsSimulatingLead] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);



  const handleSimulateWebhookLead = async () => {
    setIsSimulatingLead(true);
    const newLead = await marketingLeadSync.triggerWebhookSimulation();
    setLiveLeads((prev) => [newLead, ...prev]);
    setIsSimulatingLead(false);
    setNotification(
      language === 'zh'
        ? `⚡ 来自 ${newLead.region} 的海外买家 ${newLead.leadName} (${newLead.companyName}) 刚通过 ${newLead.channel.toUpperCase()} 转化为 CRM 线索 (估值 $${(newLead.estimatedValueUSD/1000).toFixed(0)}k)`
        : `⚡ Live Lead Triggered: ${newLead.leadName} (${newLead.companyName}) from ${newLead.region} via ${newLead.channel.toUpperCase()} ($${(newLead.estimatedValueUSD/1000).toFixed(0)}k)`
    );
    setTimeout(() => setNotification(null), 6000);
  };

  const toggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'paused' : 'active' } : c))
    );
  };

  return (
    <div className="space-y-6">
      {/* Executive Header Banner */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200/80'} shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 transition-all duration-150`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 text-[11px] font-semibold tracking-wider rounded-full bg-gradient-to-r from-xisync-blue-900 to-xisync-cyan-800 text-xisync-cyan-300 uppercase">
              {language === 'zh' ? '犀同步 全球数字营销枢纽' : 'XiSync Global Marketing Command'}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-300 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/50">
              <Radio className="w-3 h-3 text-emerald-500 animate-pulse" />
              {language === 'zh' ? '多平台 Webhook 实时回传中' : 'Real-time API & Webhooks Active'}
            </span>
          </div>
          <h1 className={`text-2xl font-bold mt-2 tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'zh' ? '出海营销与询盘获客看板' : 'Global Growth & Performance Intelligence'}
          </h1>
          <p className={`text-xs mt-1 max-w-2xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {language === 'zh'
              ? '跨 Meta Ads (FB/IG)、Google Ads、TikTok Commercial 与 WhatsApp Business 全链路投放、AI 文案生成与归因分析。'
              : 'End-to-end campaign execution, AI translation, and CRM lead attribution across Meta, Google, TikTok & WhatsApp.'}
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Timeframe selector */}
          <div className={`flex items-center p-1 rounded-xl border text-xs font-semibold ${isDark ? 'bg-slate-700/60 border-slate-600' : 'bg-slate-100 border-slate-200'}`}>
            {[
              { code: '7d', label: '7D' },
              { code: '30d', label: '30D' },
              { code: 'q1', label: 'Q1 2026' },
              { code: 'ytd', label: 'YTD' },
            ].map((t) => (
              <button
                key={t.code}
                onClick={() => setTimeframe(t.code as any)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  timeframe === t.code
                    ? 'bg-white dark:bg-slate-800 text-xisync-cyan-600 dark:text-xisync-cyan-400 font-bold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleSimulateWebhookLead}
            disabled={isSimulatingLead}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all disabled:opacity-50"
          >
            <Zap className={`w-3.5 h-3.5 ${isSimulatingLead ? 'animate-spin' : ''}`} />
            {language === 'zh' ? '测试进单' : 'Simulate Webhook'}
          </button>

          <Link
            to="/dashboard/marketing/campaigns"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 hover:opacity-95 text-white shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            {language === 'zh' ? '新建广告系列' : 'Create Campaign'}
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (6 Metric Cards) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            title: language === 'zh' ? '总广告消耗' : 'Total Ad Spend',
            value: '$43,200',
            change: '+14.2%',
            trend: 'up',
            icon: DollarSign,
            subtitle: 'USD',
          },
          {
            title: language === 'zh' ? '曝光展现量' : 'Impressions',
            value: '812.5k',
            change: '+22.8%',
            trend: 'up',
            icon: Eye,
            subtitle: 'Views',
          },
          {
            title: language === 'zh' ? '广告点击次数' : 'Ad Clicks',
            value: '30,240',
            change: '+8.4%',
            trend: 'up',
            icon: MousePointer,
            subtitle: 'CTR 3.72%',
          },
          {
            title: language === 'zh' ? 'B2B 询盘线索' : 'B2B Leads',
            value: '1,428',
            change: '+18.6%',
            trend: 'up',
            icon: Target,
            subtitle: 'CPL $30.2',
          },
          {
            title: language === 'zh' ? '即时会话/WhatsApp' : 'Direct Inquiries',
            value: '722',
            change: '+31.0%',
            trend: 'up',
            icon: Users,
            subtitle: '50.5% Ratio',
          },
          {
            title: language === 'zh' ? '估算意向货值' : 'Pipeline Value',
            value: '$2.54M',
            change: '+26.4%',
            trend: 'up',
            icon: TrendingUp,
            subtitle: 'CRM Target',
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200/80'} shadow-sm flex flex-col justify-between transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-600`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate uppercase">
                {kpi.title}
              </span>
              <kpi.icon className="w-4 h-4 text-xisync-cyan-500 flex-shrink-0" />
            </div>

            <div className="mt-3">
              <div className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{kpi.value}</div>
              <div className="flex items-center justify-between mt-1 text-[10px]">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" /> {kpi.change}
                </span>
                <span className="text-slate-400 font-mono">{kpi.subtitle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center justify-between transition-all">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
            <span>{notification}</span>
          </div>
          <Link
            to="/dashboard/inbox"
            className="text-xs underline font-bold hover:text-emerald-950 dark:hover:text-emerald-100 flex items-center gap-1"
          >
            {language === 'zh' ? '直达收件箱' : 'Open Inbox'} <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Dual Insights Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Trend Area Chart */}
        <div className={`lg:col-span-2 p-6 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200/80'} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'zh' ? '广告消耗与 B2B 询盘趋势 (Ad Spend vs. Leads Generated)' : 'Ad Spend & B2B Lead Trends'}
              </h3>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {language === 'zh' ? '过去 6 个月投放效果与线索增长走势' : 'Monthly growth trajectory of budget allocation and converted leads.'}
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-xisync-cyan-500">
                <span className="w-2.5 h-2.5 rounded-full bg-xisync-cyan-500 inline-block" /> Spend ($)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Leads Count
              </span>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
                <YAxis stroke={isDark ? '#94a3b8' : '#64748b'} fontSize={12} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                  }}
                />
                <Area type="monotone" dataKey="spend" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorSpend)" />
                <Area type="monotone" dataKey="leads" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorLeads)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right 1 Col: Channel ROI & Cost Efficiency */}
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200/80'} shadow-sm space-y-4`}>
          <div>
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'zh' ? '各渠道获客成本 CPL 效能' : 'Channel CPL Efficiency'}
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'zh' ? '渠道单条线索成本 (Cost Per Lead)' : 'Comparison of Average CPL by Platform'}
            </p>
          </div>

          <div className="space-y-4 pt-2">
            {channelRoiData.map((item) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    <ChannelIcon channel={item.name.split(' ')[0]} size="sm" />
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${item.cpl} CPL</span>
                    <span className="text-[11px] text-slate-400 ml-2">(${item.spend.toLocaleString()})</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (item.leads / 410) * 100)}%`,
                      backgroundColor: item.color === '#000000' && isDark ? '#38bdf8' : item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300">
            💡 <span className="font-bold">{language === 'zh' ? '最佳获客渠道:' : 'Top ROI Channel:'}</span> {language === 'zh' ? 'WhatsApp API 单条 CPL 仅 $20.9，推荐加大预算。' : 'WhatsApp API yields lowest CPL at $20.9 per inquiry.'}
          </div>
        </div>
      </div>

      {/* Geo Distribution & Conversion Funnel Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Buyer Geo Distribution */}
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200/80'} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'zh' ? '全球海外买家地域分布' : 'Global Buyer Geo-Distribution'}
            </h3>
            <span className="text-xs font-semibold text-slate-400">Total Leads: 722</span>
          </div>

          <div className="space-y-3">
            {geoDistribution.map((g) => (
              <div key={g.region} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${g.color}`} />
                  <div>
                    <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{g.region}</div>
                    <div className="text-[11px] text-slate-500">{g.leads} Leads Captured</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{g.share}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{g.value} Est.</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Funnel Performance */}
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200/80'} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between">
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'zh' ? '出海引流转化漏斗 (Click -> Deal)' : 'Lead Conversion Funnel'}
            </h3>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Overall Conv. 2.39%</span>
          </div>

          <div className="space-y-3 pt-1">
            {[
              { stage: language === 'zh' ? '1. 广告曝光 (Impressions)' : '1. Ad Impressions', val: '812,500', pct: '100%', bg: 'bg-blue-600' },
              { stage: language === 'zh' ? '2. 广告点击 (Ad Clicks)' : '2. Ad Clicks', val: '30,240', pct: '3.72%', bg: 'bg-cyan-500' },
              { stage: language === 'zh' ? '3. 产生会话 (Direct Inquiries)' : '3. Direct Inquiries', val: '1,420', pct: '4.69%', bg: 'bg-teal-500' },
              { stage: language === 'zh' ? '4. 录入 CRM 线索 (Qualified Leads)' : '4. CRM Leads', val: '722', pct: '50.8%', bg: 'bg-emerald-500' },
              { stage: language === 'zh' ? '5. 成交意向金额 (Pipeline Deals)' : '5. Deals Won ($2.54M)', val: '184 Deals', pct: '25.4%', bg: 'bg-emerald-600' },
            ].map((st) => (
              <div key={st.stage} className="p-3 rounded-xl border border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 font-semibold">
                  <div className={`w-2.5 h-2.5 rounded-full ${st.bg}`} />
                  <span className={isDark ? 'text-white' : 'text-slate-900'}>{st.stage}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white mr-2">{st.val}</span>
                  <span className="text-[11px] text-slate-400 font-mono">({st.pct})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Campaigns Table */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200/80'} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'zh' ? '进行中全球广告系列 (Live Campaigns)' : 'Live Global Campaigns'}
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'zh' ? '实时调控预算、暂停/启用与查看各渠道引流转化情况' : 'Real-time campaign pacing, channel allocation, and status management.'}
            </p>
          </div>
          <Link
            to="/dashboard/marketing/campaigns"
            className="text-xs font-bold text-xisync-cyan-600 hover:text-xisync-cyan-700 dark:text-xisync-cyan-400 flex items-center gap-1"
          >
            {language === 'zh' ? '进入完整广告管理' : 'Manage All Campaigns'} &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-bold text-slate-400 uppercase tracking-wider ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <th className="py-3 px-3">{language === 'zh' ? '广告系列名称 / 关联产品' : 'Campaign & Product'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '投放渠道' : 'Channels'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '目标市场' : 'Region'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '状态' : 'Status'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '消耗 / 日预算' : 'Spend / Daily'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '询盘线索' : 'Leads'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '商机估值' : 'Pipeline'}</th>
                <th className="py-3 px-3 text-right">{language === 'zh' ? '操作' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {campaigns.map((cmp) => {
                const percentSpend = Math.min(100, Math.round((cmp.spend / cmp.totalBudget) * 100));
                return (
                  <tr key={cmp.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={cmp.productImage}
                          alt={cmp.productName}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                        />
                        <div>
                          <div className="font-bold text-xs line-clamp-1">{cmp.name}</div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{cmp.productName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {cmp.channels.map((ch) => (
                          <ChannelIcon key={ch} channel={ch} size="sm" />
                        ))}
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-1 text-[11px] rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold capitalize">
                        {cmp.targetRegion.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => toggleCampaign(cmp.id)}
                        className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full transition-all flex items-center gap-1.5 ${
                          cmp.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                            : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-400'
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${cmp.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {cmp.status.toUpperCase()}
                      </button>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold">${cmp.spend} / ${cmp.dailyBudget}/d</div>
                      <div className="w-24 bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1">
                        <div
                          className="bg-gradient-to-r from-xisync-blue-500 to-xisync-cyan-500 h-full transition-all duration-300"
                          style={{ width: `${percentSpend}%` }}
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-emerald-600 dark:text-emerald-400">{cmp.leadsCount} {language === 'zh' ? '条' : 'leads'}</div>
                      <div className="text-[11px] text-slate-400">CPL: ${cmp.cpl}</div>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                      ${(cmp.pipelineValue / 1000).toFixed(0)}k
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        to="/dashboard/inbox"
                        className="inline-flex items-center gap-1 text-xs font-bold text-xisync-blue-600 dark:text-xisync-cyan-400 hover:underline"
                      >
                        {language === 'zh' ? '会话进单' : 'View Inbox'} &rarr;
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Lead Attribution Feed */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'zh' ? '实时获客归因 Feed (Ad Click -> CRM Lead)' : 'Real-time Lead Attribution Feed'}
            </h3>
            <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {language === 'zh' ? '从广告点击、UTM 追踪到自动落库 XiSync CRM 的最新海外买家线索' : 'Latest overseas B2B buyer leads captured from ad campaigns directly synced to CRM.'}
            </p>
          </div>
          <Link
            to="/dashboard/marketing/attribution"
            className="text-xs font-bold text-xisync-cyan-600 hover:text-xisync-cyan-700 dark:text-xisync-cyan-400 flex items-center gap-1"
          >
            {language === 'zh' ? '查看归因分析报告' : 'Full Lead Attribution'} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveLeads.slice(0, 4).map((lead) => (
            <div
              key={lead.id}
              className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-700/40 border-slate-700/80' : 'bg-slate-50 border-slate-200'} flex items-start justify-between gap-3 transition-all duration-200 hover:border-xisync-cyan-400`}
            >
              <div className="flex items-start gap-3">
                <ChannelIcon channel={lead.channel} size="sm" />
                <div>
                  <div className={`font-bold text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{lead.leadName}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">{lead.companyName} &bull; {lead.region}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1">
                    UTM: {lead.utmSource} / {lead.utmMedium}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">${lead.estimatedValueUSD.toLocaleString()}</div>
                <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-full bg-xisync-blue-100 text-xisync-blue-800 dark:bg-xisync-blue-950/60 dark:text-xisync-blue-300 mt-1 uppercase border border-xisync-blue-200 dark:border-xisync-blue-800/60">
                  {lead.dealStatus.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
