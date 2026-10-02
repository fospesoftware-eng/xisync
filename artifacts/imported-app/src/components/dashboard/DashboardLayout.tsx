import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../lib/i18n';
import { useTheme } from '../../lib/theme-context';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Package,
  FileCheck,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  Building2,
  Globe,
  CreditCard,
  Shield,
  Zap,
  FileText,
  Megaphone,
  Wand2,
  Sparkles,
  Calendar,
} from 'lucide-react';

type NavItem = {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { name: string; href: string }[];
};

type DashboardLayoutProps = {
  variant?: 'client' | 'admin';
};

export function DashboardLayout({ variant = 'client' }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const location = useLocation();
  const { profile, tenant, signOut } = useAuth();
  const { t, language } = useI18n();
  const { theme } = useTheme();

  const clientNavigation: NavItem[] = [
    { name: t.dashboard.nav.dashboard, href: '/dashboard', icon: LayoutDashboard },
    {
      name: (t as any).marketing?.nav?.marketing || (language === 'zh' ? '犀同步 全球数字营销' : 'Global Marketing'),
      href: '/dashboard/marketing',
      icon: Megaphone,
      children: [
        { name: (t as any).marketing?.nav?.overview || (language === 'zh' ? '营销概览 & ROI' : 'Overview & ROI'), href: '/dashboard/marketing' },
        { name: (t as any).marketing?.nav?.mediaBuyer || (language === 'zh' ? '🎯 自动化投流 (Media Buyer)' : 'Media Buyer'), href: '/dashboard/media-buyer' },
        { name: (t as any).marketing?.nav?.campaigns || (language === 'zh' ? '广告系列管理' : 'Campaigns'), href: '/dashboard/marketing/campaigns' },
        { name: (t as any).marketing?.nav?.channels || (language === 'zh' ? '渠道与 API 授权' : 'Ad Accounts & Channels'), href: '/dashboard/marketing/channels' },
        { name: (t as any).marketing?.nav?.creatives || (language === 'zh' ? '素材工坊与 AI' : 'Creative Studio'), href: '/dashboard/marketing/creatives' },
        { name: (t as any).marketing?.nav?.attribution || (language === 'zh' ? '获客归因跟踪' : 'Lead Attribution'), href: '/dashboard/marketing/attribution' },
      ],
    },
    {
      name: t.dashboard.nav.crm,
      href: '/dashboard/crm',
      icon: Users,
      children: [
        { name: t.dashboard.nav.leads, href: '/dashboard/crm/leads' },
        { name: t.dashboard.nav.accounts, href: '/dashboard/crm/accounts' },
        { name: t.dashboard.nav.contacts, href: '/dashboard/crm/contacts' },
        { name: t.dashboard.nav.deals, href: '/dashboard/crm/deals' },
      ],
    },
    {
      name: language === 'zh' ? '独立站建站 AI' : 'Website Builder',
      href: '/dashboard/website-builder',
      icon: Wand2,
      children: [
        { name: language === 'zh' ? '建站与内容编辑' : 'Build', href: '/dashboard/website-builder/build' },
        { name: language === 'zh' ? '主题与视觉风格' : 'Themes', href: '/dashboard/website-builder/themes' },
        { name: language === 'zh' ? '域名与 DNS 解析' : 'Domains', href: '/dashboard/website-builder/domains' },
        { name: language === 'zh' ? '数据与 SEO 分析' : 'Statistics', href: '/dashboard/website-builder/statistics' },
      ],
    },
    { name: t.dashboard.nav.inbox, href: '/dashboard/inbox', icon: MessageSquare },
    { name: language === 'zh' ? '产品' : 'Products', href: '/dashboard/products', icon: Package },
    {
      name: t.dashboard.nav.logistics,
      href: '/dashboard/logistics/tracking',
      icon: Globe,
      children: [
        { name: language === 'zh' ? '追踪' : 'Tracking', href: '/dashboard/logistics/tracking' },
        { name: language === 'zh' ? '运价' : 'Rates', href: '/dashboard/logistics/rates' },
        { name: language === 'zh' ? 'AI 风控' : 'AI Risk', href: '/dashboard/logistics/ai-optimizer' },
        { name: language === 'zh' ? '报关' : 'Customs', href: '/dashboard/logistics/customs' },
        { name: language === 'zh' ? '地图' : 'Map', href: '/dashboard/logistics/map' },
      ],
    },
    {
      name: language === 'zh' ? 'AI 贸易 Copilot' : 'AI Trade Copilot',
      href: '/dashboard/ai-copilot/negotiation',
      icon: Sparkles,
      children: [
        { name: language === 'zh' ? '自主议价' : 'Autonomous Negotiation', href: '/dashboard/ai-copilot/negotiation' },
        { name: language === 'zh' ? '需求预测' : 'Demand Forecast', href: '/dashboard/ai-copilot/forecast' },
        { name: language === 'zh' ? '信用风控盾' : 'Credit & Fraud Shield', href: '/dashboard/ai-copilot/credit-shield' },
      ],
    },
    { name: t.dashboard.nav.compliance, href: '/dashboard/compliance', icon: FileCheck },
    { name: t.dashboard.analytics, href: '/dashboard/analytics', icon: BarChart3 },
    {
      name: t.dashboard.nav.settings,
      href: '/dashboard/settings',
      icon: Settings,
      children: [
        { name: language === 'zh' ? '社交聊天 API 授权' : 'Channel API & Auth', href: '/dashboard/settings/channels' },
        { name: language === 'zh' ? '工作流构建器' : 'Workflow Builder', href: '/dashboard/settings/workflow' },
        { name: language === 'zh' ? '工厂与企业信息' : 'Manufacturer Profile', href: '/dashboard/settings/profile' },
        { name: language === 'zh' ? 'AI 机器人与议价' : 'AI Chatbot & Negotiation', href: '/dashboard/settings/ai-rules' },
        { name: language === 'zh' ? '物流与运力设置' : 'Logistics Defaults', href: '/dashboard/settings/logistics-settings' },
        { name: language === 'zh' ? '信用风控与合规' : 'Credit & Security Shield', href: '/dashboard/settings/security-compliance' },
        { name: language === 'zh' ? 'API 密钥与 Webhook' : 'API Keys & Webhooks', href: '/dashboard/settings/notifications' },
      ],
    },
  ];

  const adminNavigation: NavItem[] = [
    { name: t.dashboard.nav.dashboard, href: '/admin', icon: LayoutDashboard },
    { name: t.admin.tenants, href: '/admin/tenants', icon: Building2 },
    { name: t.admin.users, href: '/admin/users', icon: Users },
    { name: 'Website CMS', href: '/admin/cms', icon: FileText },
    { name: language === 'zh' ? '跨国投流总控' : 'Media Engine Admin', href: '/admin/media-engine', icon: Zap },
    { name: t.admin.billing, href: '/admin/billing', icon: CreditCard },
    { name: t.dashboard.nav.integrations, href: '/admin/integrations', icon: Zap },
    { name: t.admin.security, href: '/admin/security', icon: Shield },
    { name: t.admin.analytics, href: '/admin/analytics', icon: BarChart3 },
    { name: t.dashboard.nav.settings, href: '/admin/settings', icon: Settings },
  ];

  const navigation = variant === 'admin' ? adminNavigation : clientNavigation;

  const isExactActive = (href: string) => {
    return location.pathname === href;
  };

  const isChildActive = (item: NavItem) => {
    if (!item.children) return false;
    return item.children.some(
      (c) => location.pathname === c.href || (c.href !== '/dashboard' && location.pathname.startsWith(c.href))
    );
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div
        className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64
          ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
          border-r transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className={`flex items-center justify-between h-16 px-4 border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <Link to={variant === 'admin' ? '/admin' : '/dashboard'}>
            <Logo size="md" />
          </Link>
          <button
            className={`lg:hidden p-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {variant === 'admin' && (
          <div className={`px-4 py-2 ${theme === 'dark' ? 'bg-xisync-blue-900/50 border-xisync-blue-800' : 'bg-xisync-blue-50 border-xisync-blue-100'} border-b`}>
            <span className={`text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-xisync-blue-300' : 'text-xisync-blue-700'}`}>
              {t.admin.title}
            </span>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {navigation.map((item) => {
            const hasActiveChild = isChildActive(item);
            const isItemExpanded = expandedItem === item.name || hasActiveChild;

            return (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button
                      onClick={() =>
                        setExpandedItem(expandedItem === item.name ? null : item.name)
                      }
                      className={`
                        w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold
                        transition-all duration-150
                        ${hasActiveChild
                          ? theme === 'dark'
                            ? 'text-xisync-cyan-400 font-bold bg-slate-800/40'
                            : 'text-xisync-blue-900 font-bold bg-slate-100/60'
                          : theme === 'dark'
                            ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                            : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className={`w-4 h-4 ${hasActiveChild ? 'text-xisync-cyan-500' : 'text-slate-400'}`} />
                        {item.name}
                      </div>
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                          isItemExpanded ? 'rotate-180 text-xisync-cyan-500' : ''
                        }`}
                      />
                    </button>
                    {isItemExpanded && (
                      <div className="mt-1 ml-4 pl-3 border-l border-slate-200 dark:border-slate-700 space-y-1">
                        {item.children.map((child) => {
                          const childActive = isExactActive(child.href);
                          return (
                            <Link
                              key={child.name}
                              to={child.href}
                              className={`
                                flex items-center px-3 py-2 rounded-lg text-xs transition-all duration-150
                                ${childActive
                                  ? theme === 'dark'
                                    ? 'bg-slate-800 text-xisync-cyan-300 font-bold border-l-2 border-xisync-cyan-400 pl-2.5'
                                    : 'bg-slate-100 text-xisync-blue-900 font-bold border-l-2 border-xisync-cyan-500 pl-2.5'
                                  : theme === 'dark'
                                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'}
                              `}
                            >
                              {child.name}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className={`
                      flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold
                      transition-all duration-150
                      ${isExactActive(item.href)
                        ? theme === 'dark'
                          ? 'bg-slate-800 text-xisync-cyan-300 font-bold border-l-2 border-xisync-cyan-400 pl-3'
                          : 'bg-slate-100 text-xisync-blue-900 font-bold border-l-2 border-xisync-cyan-500 pl-3'
                        : theme === 'dark'
                          ? 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                          : 'text-slate-700 hover:bg-slate-100/80 hover:text-slate-900'}
                    `}
                  >
                    <item.icon className={`w-4 h-4 ${isExactActive(item.href) ? 'text-xisync-cyan-500' : 'text-slate-400'}`} />
                    {item.name}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>

        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <Link
            to="/help"
            className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
              theme === 'dark' ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <HelpCircle className="w-5 h-5" />
            {t.nav.helpCenter}
          </Link>
          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg mt-1 ${
              theme === 'dark' ? 'text-red-400 hover:bg-red-900/30' : 'text-red-600 hover:bg-red-50'
            }`}
          >
            <LogOut className="w-5 h-5" />
            {t.common.logout}
          </button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className={`sticky top-0 z-30 border-b ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center gap-4">
              <button
                className={`lg:hidden p-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className={`hidden md:flex items-center gap-2 rounded-lg px-3 py-2 w-64 ${
                theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                <Search className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder={`${t.common.search}...`}
                  className={`bg-transparent text-sm outline-none flex-1 ${theme === 'dark' ? 'text-white placeholder-gray-400' : ''}`}
                />
                <kbd className={`hidden lg:block px-1.5 py-0.5 text-xs rounded border ${
                  theme === 'dark' ? 'text-gray-400 bg-gray-600 border-gray-500' : 'text-gray-400 bg-white border-gray-200'
                }`}>
                  /
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Top Calendar Icon Button */}
              <Link
                to="/dashboard/calendar"
                className={`p-2 rounded-xl border transition-all shadow-sm relative ${
                  location.pathname === '/dashboard/calendar'
                    ? 'bg-xisync-cyan-500/20 text-xisync-cyan-600 border-xisync-cyan-400/40'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:text-white bg-gray-800 border-gray-700'
                      : 'text-gray-600 hover:text-gray-900 bg-white border-gray-200'
                }`}
                title="Trade Calendar & Schedule"
              >
                <Calendar className="w-4 h-4 text-xisync-cyan-500" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </Link>

              <Link
                to={location.pathname.startsWith('/dashboard/ultra') ? '/dashboard' : '/dashboard/ultra'}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all duration-200 shadow-md ${
                  location.pathname.startsWith('/dashboard/ultra')
                    ? 'bg-gradient-to-r from-xisync-lime-500 via-xisync-cyan-400 to-xisync-blue-600 text-slate-950 ring-2 ring-xisync-lime-400'
                    : 'bg-gradient-to-r from-xisync-blue-900 via-xisync-cyan-600 to-xisync-lime-500 text-white hover:opacity-95 hover:scale-105'
                }`}
                title="Switch to XiSync ULTRA Immersive Workspace"
              >
                <span>{(t as any).ultra?.toggleButton || 'ULTRA'}</span>
              </Link>

              <LanguageSwitcher variant="compact" className={theme === 'dark' ? 'text-gray-300' : ''} />
              <ThemeToggle variant="compact" />

              <button className={`relative p-2 rounded-lg ${
                theme === 'dark' ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}>
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              <div className={`flex items-center gap-3 pl-3 border-l ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <div className="text-right hidden sm:block">
                  <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {profile?.full_name || 'User'}
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    {tenant?.name || 'No company'}
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
