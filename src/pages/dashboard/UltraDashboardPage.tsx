import { useState } from 'react';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../lib/i18n';
import { Logo } from '../../components/ui/Logo';
import { WALLPAPERS } from '../../components/dashboard/ultra/UltraWallpaperSelector';
import { UltraCommandBar } from '../../components/dashboard/ultra/UltraCommandBar';
import { UltraAiPanel } from '../../components/dashboard/ultra/UltraAiPanel';
import { UltraQuickWidgets } from '../../components/dashboard/ultra/UltraQuickWidgets';
import { LanguageSwitcher } from '../../components/ui/LanguageSwitcher';
import {
  LayoutDashboard,
  Megaphone,
  Users,
  MessageSquare,
  Package,
  Globe,
  FileCheck,
  BarChart3,
  Settings,
  Search,
  Grid,
  Bell,
  CheckCircle2,
  LogOut,
  X,
  Zap,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Activity,
  Layers,
  Image,
  Sliders,
  Calendar,
  Clock,
  Wand2,
  Video,
  Ship,
  Plus,
} from 'lucide-react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';

interface NavItem {
  categoryEn?: string;
  categoryZh?: string;
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { name: string; href: string }[];
}

interface CalendarActivity {
  id: string;
  time: string;
  date: string;
  titleEn: string;
  titleZh: string;
  category: 'meeting' | 'freight' | 'marketing' | 'compliance';
  status: 'upcoming' | 'in_progress' | 'completed';
  icon: React.ComponentType<{ className?: string }>;
  detailEn: string;
  detailZh: string;
}

export function UltraDashboardPage() {
  const { profile } = useAuth();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const location = useLocation();

  const [wallpaperUrl, setWallpaperUrl] = useState(WALLPAPERS[0].url);
  const [blurLevel, setBlurLevel] = useState(4);
  const [expandedItem, setExpandedItem] = useState<string | null>('marketing');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activePromptModal, setActivePromptModal] = useState<{ title: string; content: string } | null>(null);
  const [isSyncAiWidgetOpen, setIsSyncAiWidgetOpen] = useState(false);
  const [isWallpaperModalOpen, setIsWallpaperModalOpen] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isAppGridModalOpen, setIsAppGridModalOpen] = useState(false);
  const [calendarFilter, setCalendarFilter] = useState<'all' | 'meeting' | 'freight' | 'marketing' | 'compliance'>('all');

  const userName = profile?.full_name || 'Audrey';
  const isUltraHome = location.pathname === '/dashboard/ultra' || location.pathname === '/dashboard/ultra/';

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleSendPrompt = (prompt: string) => {
    setActivePromptModal({
      title: prompt,
      content:
        language === 'zh'
          ? `针对您的指令：「${prompt}」\n\nXiSync ULTRA 引擎已完成实时全图谱检索：\n1. 本周外贸广告 ROI 环比提升 +14.2%，获得 48 条优质买家询盘；\n2. 推荐对 Meta Ads 服装及机械品类出价加权 15%；\n3. 已自动触发 37 条高价值待跟进线索至外贸 CRM 系统。`
          : `Analysis complete for prompt: "${prompt}"\n\n1. Global Ad ROI increased +14.2% DoD across Meta & Google Ads;\n2. 48 high-intent B2B inquiries captured in past 24 hours;\n3. Recommended +15% budget scaling for North American & Middle East WhatsApp direct ads.`,
    });
  };

  const handleExecuteAction = (actionName: string) => {
    showNotification(
      language === 'zh'
        ? `系统正在执行调优动作: ${actionName}`
        : `XiSync Ultra executing: ${actionName}`
    );
  };

  const calendarActivities: CalendarActivity[] = [
    {
      id: '1',
      time: '10:00 AM',
      date: 'Today',
      titleEn: 'B2B Buyer Contract Negotiation Call',
      titleZh: 'ABC Corp 北美大客户采购协议视频会议',
      category: 'meeting',
      status: 'upcoming',
      icon: Video,
      detailEn: 'ABC Corp (USA) • Contract Value $120,000',
      detailZh: 'ABC Corp (美国) • 订单货值 $120,000',
    },
    {
      id: '2',
      time: '02:30 PM',
      date: 'Today',
      titleEn: 'COSCO Ocean Freight Departure',
      titleZh: 'COSCO 上海港货轮起航 (SH-2024-001)',
      category: 'freight',
      status: 'in_progress',
      icon: Ship,
      detailEn: 'Port Shanghai → Los Angeles • Bill COSU123456',
      detailZh: '上海港 → 洛杉矶港 • 提单号 COSU123456',
    },
    {
      id: '3',
      time: '04:00 PM',
      date: 'Today',
      titleEn: 'Meta & Google Ads Campaign Relaunch',
      titleZh: 'Meta & Google 多语种海外广告组投放加权',
      category: 'marketing',
      status: 'upcoming',
      icon: Megaphone,
      detailEn: 'Targeting Europe & Middle East WhatsApp Direct',
      detailZh: '针对欧洲与中东市场 WhatsApp 直连引流',
    },
    {
      id: '4',
      time: '11:00 AM',
      date: 'Tomorrow',
      titleEn: 'EU CE Compliance Audit Inspection',
      titleZh: '出口欧盟 CE & RoHS 资质合规复检',
      category: 'compliance',
      status: 'upcoming',
      icon: FileCheck,
      detailEn: 'Safety Standards Directive 2011/65/EU',
      detailZh: '电器与机械安全指令 2011/65/EU',
    },
    {
      id: '5',
      time: '09:00 AM',
      date: 'Aug 20',
      titleEn: 'Middle East Electronics Expo Briefing',
      titleZh: '中东迪拜电子展会展前备货协调会',
      category: 'meeting',
      status: 'upcoming',
      icon: Users,
      detailEn: 'Dubai Exhibition Center • Booth B-42',
      detailZh: '迪拜世贸中心展馆 • 展位号 B-42',
    },
  ];

  const filteredCalendarActivities = calendarActivities.filter(
    (act) => calendarFilter === 'all' || act.category === calendarFilter
  );

  // Categorized client navigation items
  const navigationItems: NavItem[] = [
    { categoryEn: 'Core Workspace', categoryZh: '核心工作台', name: t.dashboard.nav.dashboard, href: '/dashboard/ultra', icon: LayoutDashboard },
    {
      categoryEn: 'Growth & Ads',
      categoryZh: '数字营销与获客',
      name: (t as any).marketing?.nav?.marketing || (language === 'zh' ? 'XiSync 全球数字营销' : 'Global Marketing'),
      href: '/dashboard/ultra/marketing',
      icon: Megaphone,
      children: [
        { name: (t as any).marketing?.nav?.overview || (language === 'zh' ? '营销概览 & ROI' : 'Overview & ROI'), href: '/dashboard/ultra/marketing' },
        { name: (t as any).marketing?.nav?.mediaBuyer || (language === 'zh' ? '🎯 自动化投流 (Media Buyer)' : 'Media Buyer'), href: '/dashboard/ultra/media-buyer' },
        { name: (t as any).marketing?.nav?.campaigns || (language === 'zh' ? '广告系列管理' : 'Campaigns'), href: '/dashboard/ultra/marketing/campaigns' },
        { name: (t as any).marketing?.nav?.channels || (language === 'zh' ? '渠道与 API 授权' : 'Ad Accounts & Channels'), href: '/dashboard/ultra/marketing/channels' },
        { name: (t as any).marketing?.nav?.creatives || (language === 'zh' ? '素材工坊' : 'Creative Studio'), href: '/dashboard/ultra/marketing/creatives' },
        { name: (t as any).marketing?.nav?.attribution || (language === 'zh' ? '获客归因跟踪' : 'Lead Attribution'), href: '/dashboard/ultra/marketing/attribution' },
      ],
    },
    {
      categoryEn: 'CRM & Sales Pipeline',
      categoryZh: '客户管理与商机',
      name: t.dashboard.nav.crm,
      href: '/dashboard/ultra/crm/leads',
      icon: Users,
      children: [
        { name: t.dashboard.nav.leads, href: '/dashboard/ultra/crm/leads' },
        { name: t.dashboard.nav.accounts, href: '/dashboard/ultra/crm/accounts' },
        { name: t.dashboard.nav.contacts, href: '/dashboard/ultra/crm/contacts' },
        { name: t.dashboard.nav.deals, href: '/dashboard/ultra/crm/deals' },
      ],
    },
    {
      categoryEn: 'AI Website Builder',
      categoryZh: '独立站建站 AI',
      name: language === 'zh' ? '独立站建站 AI' : 'Website Builder',
      href: '/dashboard/ultra/website-builder',
      icon: Wand2,
      children: [
        { name: language === 'zh' ? '建站与内容编辑' : 'Build', href: '/dashboard/ultra/website-builder/build' },
        { name: language === 'zh' ? '主题与视觉风格' : 'Themes', href: '/dashboard/ultra/website-builder/themes' },
        { name: language === 'zh' ? '域名与 DNS 解析' : 'Domains', href: '/dashboard/ultra/website-builder/domains' },
        { name: language === 'zh' ? '数据与 SEO 分析' : 'Statistics', href: '/dashboard/ultra/website-builder/statistics' },
      ],
    },
    { name: t.dashboard.nav.inbox, href: '/dashboard/ultra/inbox', icon: MessageSquare },
    { name: language === 'zh' ? '产品中心' : 'Products Center', href: '/dashboard/ultra/products', icon: Package },
    {
      categoryEn: 'Operations & Compliance',
      categoryZh: '履约物流与合规',
      name: t.dashboard.nav.logistics,
      href: '/dashboard/ultra/logistics/tracking',
      icon: Globe,
      children: [
        { name: language === 'zh' ? '追踪' : 'Tracking', href: '/dashboard/ultra/logistics/tracking' },
        { name: language === 'zh' ? '运价' : 'Rates', href: '/dashboard/ultra/logistics/rates' },
        { name: language === 'zh' ? 'AI 风控' : 'AI Risk', href: '/dashboard/ultra/logistics/ai-optimizer' },
        { name: language === 'zh' ? '报关' : 'Customs', href: '/dashboard/ultra/logistics/customs' },
        { name: language === 'zh' ? '地图' : 'Map', href: '/dashboard/ultra/logistics/map' },
      ],
    },
    {
      categoryEn: 'AI Trade Intelligence',
      categoryZh: 'AI 贸易智能',
      name: language === 'zh' ? 'AI 贸易 Copilot' : 'AI Trade Copilot',
      href: '/dashboard/ultra/ai-copilot/negotiation',
      icon: Sparkles,
      children: [
        { name: language === 'zh' ? '自主议价' : 'Autonomous Negotiation', href: '/dashboard/ultra/ai-copilot/negotiation' },
        { name: language === 'zh' ? '需求预测' : 'Demand Forecast', href: '/dashboard/ultra/ai-copilot/forecast' },
        { name: language === 'zh' ? '信用风控盾' : 'Credit & Fraud Shield', href: '/dashboard/ultra/ai-copilot/credit-shield' },
      ],
    },
    { name: t.dashboard.nav.compliance, href: '/dashboard/ultra/compliance', icon: FileCheck },
    { name: t.dashboard.analytics, href: '/dashboard/ultra/analytics', icon: BarChart3 },
    {
      categoryEn: 'System & Automation',
      categoryZh: '系统与自动化设置',
      name: t.dashboard.nav.settings,
      href: '/dashboard/ultra/settings',
      icon: Settings,
      children: [
        { name: language === 'zh' ? '社交聊天 API 授权' : 'Channel API & Auth', href: '/dashboard/ultra/settings/channels' },
        { name: language === 'zh' ? '工作流构建器' : 'Workflow Builder', href: '/dashboard/ultra/settings/workflow' },
        { name: language === 'zh' ? '工厂与企业信息' : 'Manufacturer Profile', href: '/dashboard/ultra/settings/profile' },
        { name: language === 'zh' ? 'AI 机器人与议价' : 'AI Chatbot & Negotiation', href: '/dashboard/ultra/settings/ai-rules' },
        { name: language === 'zh' ? '物流与运力设置' : 'Logistics Defaults', href: '/dashboard/ultra/settings/logistics-settings' },
        { name: language === 'zh' ? '信用风控与合规' : 'Credit & Security Shield', href: '/dashboard/ultra/settings/security-compliance' },
        { name: language === 'zh' ? 'API 密钥与 Webhook' : 'API Keys & Webhooks', href: '/dashboard/ultra/settings/notifications' },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 w-screen h-screen z-50 flex flex-col bg-slate-950 overflow-hidden text-white font-sans ultra-theme-container">
      {/* Dynamic Ambient Background Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src={wallpaperUrl}
          alt="XiSync Ultra Ambient Background"
          className="w-full h-full object-cover scale-105 transition-all duration-700 filter brightness-105 contrast-105"
        />
        {/* Glass Blur Backdrop Overlay */}
        <div
          className="absolute inset-0 bg-slate-950/20 transition-all duration-300"
          style={{ backdropFilter: `blur(${blurLevel}px)` }}
        />
        {/* Radial Ambient Glow Highlights */}
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-xisync-cyan-500/10 filter blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-xisync-lime-500/10 filter blur-3xl pointer-events-none" />
      </div>

      {/* Main Command Center Container */}
      <div className="relative z-10 flex flex-col w-full h-full overflow-hidden">
        {/* Top OS Navigation Header */}
        <header className="h-16 px-6 border-b border-white/10 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-950/40 backdrop-blur-2xl flex items-center justify-between flex-shrink-0 shadow-2xl">
          <div className="flex items-center gap-5">
            {/* Original XiSync Logo Only */}
            <Link to="/dashboard/ultra" className="flex items-center gap-2 group">
              <Logo size="md" />
            </Link>

            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-slate-900/80 border border-white/15 text-xs text-slate-300 w-72 shadow-inner">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder={language === 'zh' ? '搜索功能应用、线索或外贸数据...' : 'Search apps, leads, commands...'}
                className="bg-transparent outline-none w-full text-xs text-white placeholder-slate-400 font-medium"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Top Sync Widget Trigger Button */}
            <button
              onClick={() => setIsSyncAiWidgetOpen(!isSyncAiWidgetOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shadow-md ${
                isSyncAiWidgetOpen
                  ? 'bg-xisync-cyan-500/30 text-xisync-cyan-300 border border-xisync-cyan-400/50 shadow-xisync-cyan-500/20'
                  : 'bg-slate-900/80 text-white border border-white/15 hover:bg-slate-800'
              }`}
              title="Toggle Sync Widget"
            >
              <Activity className="w-3.5 h-3.5 text-xisync-cyan-400" />
              <span>Sync Widget</span>
            </button>

            {/* Top Calendar Trigger Button */}
            <Link
              to="/dashboard/ultra/calendar"
              className={`p-2.5 rounded-xl border transition-all shadow-md relative ${
                location.pathname === '/dashboard/ultra/calendar'
                  ? 'bg-xisync-cyan-500/30 text-xisync-cyan-300 border-xisync-cyan-400/50'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border-white/15 hover:bg-slate-800'
              }`}
              title="Full Google Calendar & Schedule"
            >
              <Calendar className="w-4 h-4 text-xisync-cyan-400" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher variant="compact" className="text-white" />

            {/* Wallpaper Top Button */}
            <button
              onClick={() => setIsWallpaperModalOpen(!isWallpaperModalOpen)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
                isWallpaperModalOpen
                  ? 'bg-xisync-cyan-500/30 text-xisync-cyan-300 border border-xisync-cyan-400/50'
                  : 'bg-slate-900/80 text-white border border-white/15 hover:bg-slate-800'
              }`}
            >
              <Image className="w-3.5 h-3.5 text-xisync-cyan-400" />
              <span>{language === 'zh' ? '切换壁纸' : 'Wallpapers'}</span>
            </button>

            <button
              onClick={() => setIsAppGridModalOpen(!isAppGridModalOpen)}
              className={`p-2.5 rounded-xl border transition-all shadow-md ${
                isAppGridModalOpen
                  ? 'bg-xisync-cyan-500/30 text-xisync-cyan-300 border-xisync-cyan-400/50'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border-white/15 hover:bg-slate-800'
              }`}
              title="Quick App Launcher & Module Matrix"
            >
              <Grid className="w-4 h-4 text-xisync-cyan-400" />
            </button>

            <button className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-white/15 text-slate-300 hover:text-white transition-all relative shadow-md">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-xisync-cyan-400 animate-pulse" />
            </button>

            {/* Exit ULTRA Button back to Classic Dashboard */}
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-red-500/20 to-amber-500/20 hover:from-red-500/40 hover:to-amber-500/40 text-red-300 border border-red-400/40 text-xs font-extrabold transition-all shadow-lg"
              title="Exit ULTRA Workspace"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'zh' ? '退出 ULTRA 模式' : 'Exit ULTRA'}</span>
            </button>
          </div>
        </header>

        {/* Main Workspace Layout */}
        <div className="flex-1 flex p-4 gap-4 overflow-hidden relative">
          {/* Left Navigation Bar */}
          <aside className="w-64 flex-shrink-0 hidden md:flex flex-col rounded-3xl bg-slate-950/75 backdrop-blur-2xl border border-white/20 shadow-2xl p-3 overflow-y-auto">
            <div className="px-3 py-2 border-b border-white/10 mb-2 flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-xisync-cyan-400" />
                {language === 'zh' ? '外贸系统全功能菜单' : 'XiSync Platform Modules'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <nav className="space-y-2 flex-1">
              {navigationItems.map((item, idx) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = expandedItem === item.name.toLowerCase() || expandedItem === item.href;
                const isActive = location.pathname === item.href;
                const categoryLabel = language === 'zh' ? item.categoryZh : item.categoryEn;

                return (
                  <div key={idx} className="space-y-1">
                    {categoryLabel && (
                      <div className="px-3 pt-2 pb-1 text-[9px] font-extrabold text-slate-400 uppercase tracking-widest">
                        {categoryLabel}
                      </div>
                    )}

                    {hasChildren ? (
                      <button
                        onClick={() => setExpandedItem(isExpanded ? null : item.name.toLowerCase())}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                          isExpanded
                            ? 'bg-gradient-to-r from-xisync-cyan-500/30 to-xisync-blue-600/30 text-xisync-cyan-300 border border-xisync-cyan-400/40 shadow-lg'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className={`w-4 h-4 ${isExpanded ? 'text-xisync-cyan-400' : 'text-slate-400'}`} />
                          <span>{item.name}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 text-xisync-cyan-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                        )}
                      </button>
                    ) : (
                      <Link
                        to={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-xisync-cyan-500/30 to-xisync-blue-600/30 text-xisync-cyan-300 border border-xisync-cyan-400/40 shadow-lg'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-xisync-cyan-400' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </Link>
                    )}

                    {/* Expandable Sub-Menu */}
                    {hasChildren && isExpanded && (
                      <div className="pl-8 space-y-1 border-l-2 border-xisync-cyan-500/40 ml-4 my-1">
                        {item.children!.map((child) => {
                          const isChildActive = location.pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              to={child.href}
                              className={`block px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                                isChildActive
                                  ? 'text-xisync-cyan-300 font-bold bg-white/10'
                                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                              }`}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* Center 100% FULL WIDTH Workspace Container */}
          <main className="flex-1 w-full flex flex-col justify-between py-2 px-2 md:px-4 overflow-y-auto space-y-6">
            {isUltraHome ? (
              <div className="my-auto space-y-8">
                <UltraCommandBar userName={userName} language={language} onSendPrompt={handleSendPrompt} />
                <UltraQuickWidgets language={language} />
              </div>
            ) : (
              <div className="w-full flex-1 rounded-3xl bg-slate-950/75 backdrop-blur-2xl border border-white/20 shadow-2xl p-6 overflow-y-auto text-white">
                <Outlet />
              </div>
            )}
          </main>

          {/* Floating Slide-Over Sync Widget Drawer Overlay */}
          {isSyncAiWidgetOpen && (
            <div className="fixed right-4 top-20 z-40 w-96 h-[calc(100vh-6rem)] shadow-2xl animate-in slide-in-from-right duration-300">
              <UltraAiPanel
                language={language}
                onClose={() => setIsSyncAiWidgetOpen(false)}
                onExecuteAction={handleExecuteAction}
              />
            </div>
          )}
        </div>
      </div>

      {/* Calendar Activities & Schedule Top-Level Front Popup (z-[99999]) */}
      {isCalendarModalOpen && (
        <div className="fixed right-20 top-20 z-[99999] w-96 max-h-[calc(100vh-6rem)] p-5 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-white space-y-4 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-xisync-cyan-400 to-xisync-blue-600 flex items-center justify-center shadow-lg">
                <Calendar className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  {language === 'zh' ? '外贸日程与活动计划' : 'Calendar & Activities'}
                </h3>
                <span className="text-[10px] text-xisync-cyan-300 font-mono">
                  {new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsCalendarModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-xs"
            >
              ✕
            </button>
          </div>

          {/* Activity Category Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
            {(['all', 'meeting', 'freight', 'marketing', 'compliance'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCalendarFilter(cat)}
                className={`px-2.5 py-1 rounded-full font-bold capitalize transition-all whitespace-nowrap ${
                  calendarFilter === cat
                    ? 'bg-gradient-to-r from-xisync-cyan-500 to-xisync-blue-600 text-white shadow-md'
                    : 'bg-white/10 text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'all'
                  ? language === 'zh' ? '全部活动' : 'All'
                  : cat === 'meeting'
                    ? language === 'zh' ? '买家会议' : 'Meetings'
                    : cat === 'freight'
                      ? language === 'zh' ? '物流起运' : 'Freight'
                      : cat === 'marketing'
                        ? language === 'zh' ? '营销投放' : 'Marketing'
                        : language === 'zh' ? '资质合规' : 'Compliance'}
              </button>
            ))}
          </div>

          {/* Activity Timeline List */}
          <div className="space-y-3 pt-1">
            {filteredCalendarActivities.map((act) => {
              const IconComp = act.icon;
              return (
                <div
                  key={act.id}
                  className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/15 shadow-md hover:border-white/30 transition-all space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-white/10 border border-white/15 text-xisync-cyan-400">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-extrabold text-xs text-white leading-snug">
                          {language === 'zh' ? act.titleZh : act.titleEn}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-medium">
                          {language === 'zh' ? act.detailZh : act.detailEn}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                    <div className="flex items-center gap-1.5 text-slate-300 font-mono">
                      <Clock className="w-3 h-3 text-xisync-cyan-400" />
                      <span>{act.date} • {act.time}</span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        act.status === 'in_progress'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse'
                          : 'bg-xisync-cyan-500/20 text-xisync-cyan-300 border border-xisync-cyan-500/30'
                      }`}
                    >
                      {act.status.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Activity Button */}
          <button
            onClick={() => {
              showNotification(language === 'zh' ? '日程安排功能已触发' : 'New schedule activity triggered');
              setIsCalendarModalOpen(false);
            }}
            className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-xisync-cyan-500 to-xisync-blue-600 text-white text-xs font-bold shadow-lg hover:opacity-90 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{language === 'zh' ? '创建新日程计划' : 'Schedule New Activity'}</span>
          </button>
        </div>
      )}

      {/* Wallpaper & Ambient Controls Top-Level Front Popup (z-[99999]) */}
      {isWallpaperModalOpen && (
        <div className="fixed right-6 top-20 z-[99999] w-80 p-5 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-white space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-xs font-extrabold flex items-center gap-1.5 text-xisync-cyan-300 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              {language === 'zh' ? '沉浸式壁纸与毛玻璃设置' : 'Wallpaper & Ambient Controls'}
            </span>
            <button
              onClick={() => setIsWallpaperModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-xs"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {WALLPAPERS.map((wp) => (
              <button
                key={wp.id}
                onClick={() => {
                  setWallpaperUrl(wp.url);
                }}
                className={`group relative h-16 rounded-2xl overflow-hidden border-2 transition-all ${
                  wallpaperUrl === wp.url
                    ? 'border-xisync-cyan-400 ring-2 ring-xisync-cyan-400/50 scale-105'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img
                  src={wp.url}
                  alt={wp.nameEn}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute inset-x-0 bottom-0 bg-slate-950/85 p-1 text-[10px] font-bold text-white text-center truncate">
                  {language === 'zh' ? wp.nameZh : wp.nameEn}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-2 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-xisync-cyan-400" />
                {language === 'zh' ? '玻璃模糊强度 (Backdrop Blur)' : 'Glass Blur Level'}
              </span>
              <span className="font-mono text-xisync-cyan-300 font-bold">{blurLevel}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={blurLevel}
              onChange={(e) => setBlurLevel(Number(e.target.value))}
              className="w-full accent-xisync-cyan-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      )}

      {/* Quick App Launcher Matrix Top-Level Front Popup (z-[99999]) */}
      {isAppGridModalOpen && (
        <div className="fixed right-16 top-20 z-[99999] w-96 p-5 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-white space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-xisync-cyan-400 to-xisync-blue-600 flex items-center justify-center shadow-lg">
                <Grid className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white">
                  {language === 'zh' ? '应用矩阵与快捷工坊' : 'Quick App Launcher'}
                </h3>
                <span className="text-[10px] text-xisync-cyan-300 font-mono">XiSync Platform Apps</span>
              </div>
            </div>
            <button
              onClick={() => setIsAppGridModalOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 text-xs"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { nameEn: 'Marketing', nameZh: '数字营销', href: '/dashboard/ultra/marketing', icon: Megaphone, color: 'from-purple-500 to-indigo-600' },
              { nameEn: 'CRM Leads', nameZh: '线索管理', href: '/dashboard/ultra/crm/leads', icon: Users, color: 'from-blue-500 to-cyan-600' },
              { nameEn: 'Deals', nameZh: '商机管道', href: '/dashboard/ultra/crm/deals', icon: Zap, color: 'from-amber-500 to-orange-600' },
              { nameEn: 'Inbox', nameZh: '全渠道收件箱', href: '/dashboard/ultra/inbox', icon: MessageSquare, color: 'from-emerald-500 to-teal-600' },
              { nameEn: 'Products', nameZh: '产品中心', href: '/dashboard/ultra/products', icon: Package, color: 'from-pink-500 to-rose-600' },
              { nameEn: 'Logistics', nameZh: '履约物流', href: '/dashboard/ultra/logistics', icon: Globe, color: 'from-cyan-500 to-blue-600' },
              { nameEn: 'Compliance', nameZh: '合规审计', href: '/dashboard/ultra/compliance', icon: FileCheck, color: 'from-yellow-500 to-amber-600' },
              { nameEn: 'Calendar', nameZh: '谷歌日历', href: '/dashboard/ultra/calendar', icon: Calendar, color: 'from-teal-500 to-emerald-600' },
              { nameEn: 'Analytics', nameZh: '数据分析', href: '/dashboard/ultra/analytics', icon: BarChart3, color: 'from-blue-600 to-indigo-700' },
            ].map((app) => {
              const IconComp = app.icon;
              return (
                <Link
                  key={app.href}
                  to={app.href}
                  onClick={() => setIsAppGridModalOpen(false)}
                  className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-xisync-cyan-400/50 hover:bg-slate-800/80 transition-all group shadow-md"
                >
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white mb-2 group-hover:scale-110 transition-transform shadow-lg`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-200 group-hover:text-white text-center truncate w-full">
                    {language === 'zh' ? app.nameZh : app.nameEn}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Execution Response Modal */}
      {activePromptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-3xl bg-slate-950/90 border border-white/20 shadow-2xl p-6 text-white space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-xisync-cyan-400 to-xisync-blue-600 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">{activePromptModal.title}</h3>
                  <span className="text-[10px] text-xisync-cyan-300">XiSync ULTRA Telemetry Response</span>
                </div>
              </div>
              <button
                onClick={() => setActivePromptModal(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="whitespace-pre-line text-xs leading-relaxed text-slate-200 bg-slate-900/60 p-4 rounded-2xl border border-white/10 font-sans">
              {activePromptModal.content}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  showNotification(language === 'zh' ? '已成功应用调优策略' : 'Strategy applied successfully');
                  setActivePromptModal(null);
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-xisync-cyan-500 to-xisync-blue-600 text-white text-xs font-bold shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{language === 'zh' ? '应用策略' : 'Apply Strategy'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-slate-900/90 backdrop-blur-2xl border border-xisync-cyan-400/50 text-xisync-cyan-300 text-xs font-extrabold shadow-2xl flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
