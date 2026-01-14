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
    { name: t.dashboard.nav.inbox, href: '/dashboard/inbox', icon: MessageSquare },
    { name: language === 'zh' ? '产品' : 'Products', href: '/dashboard/products', icon: Package },
    { name: t.dashboard.nav.logistics, href: '/dashboard/logistics', icon: Globe },
    { name: t.dashboard.nav.compliance, href: '/dashboard/compliance', icon: FileCheck },
    { name: t.dashboard.analytics, href: '/dashboard/analytics', icon: BarChart3 },
    { name: t.dashboard.nav.settings, href: '/dashboard/settings', icon: Settings },
  ];

  const adminNavigation: NavItem[] = [
    { name: t.dashboard.nav.dashboard, href: '/admin', icon: LayoutDashboard },
    { name: t.admin.tenants, href: '/admin/tenants', icon: Building2 },
    { name: t.admin.users, href: '/admin/users', icon: Users },
    { name: 'Website CMS', href: '/admin/cms', icon: FileText },
    { name: t.admin.billing, href: '/admin/billing', icon: CreditCard },
    { name: t.dashboard.nav.integrations, href: '/admin/integrations', icon: Zap },
    { name: t.admin.security, href: '/admin/security', icon: Shield },
    { name: t.admin.analytics, href: '/admin/analytics', icon: BarChart3 },
    { name: t.dashboard.nav.settings, href: '/admin/settings', icon: Settings },
  ];

  const navigation = variant === 'admin' ? adminNavigation : clientNavigation;

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
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

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <div key={item.name}>
              {item.children ? (
                <>
                  <button
                    onClick={() =>
                      setExpandedItem(expandedItem === item.name ? null : item.name)
                    }
                    className={`
                      w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium
                      transition-colors
                      ${isActive(item.href)
                        ? theme === 'dark'
                          ? 'bg-xisync-cyan-900/50 text-xisync-cyan-300'
                          : 'bg-xisync-cyan-50 text-xisync-cyan-700'
                        : theme === 'dark'
                          ? 'text-gray-300 hover:bg-gray-700'
                          : 'text-gray-600 hover:bg-gray-100'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedItem === item.name ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {expandedItem === item.name && (
                    <div className="mt-1 ml-8 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`
                            block px-3 py-2 rounded-lg text-sm
                            ${isActive(child.href)
                              ? theme === 'dark'
                                ? 'bg-xisync-cyan-900/50 text-xisync-cyan-300 font-medium'
                                : 'bg-xisync-cyan-50 text-xisync-cyan-700 font-medium'
                              : theme === 'dark'
                                ? 'text-gray-400 hover:bg-gray-700'
                                : 'text-gray-600 hover:bg-gray-100'}
                          `}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                    transition-colors
                    ${isActive(item.href) && !item.children
                      ? theme === 'dark'
                        ? 'bg-xisync-cyan-900/50 text-xisync-cyan-300'
                        : 'bg-xisync-cyan-50 text-xisync-cyan-700'
                      : theme === 'dark'
                        ? 'text-gray-300 hover:bg-gray-700'
                        : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
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
