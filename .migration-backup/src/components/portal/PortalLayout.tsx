import { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useI18n } from '../../lib/i18n';
import { useTheme } from '../../lib/theme-context';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Package,
  FileCheck,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Bell,
} from 'lucide-react';

export function PortalLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { t, language } = useI18n();
  const { theme } = useTheme();

  const navigation = [
    { name: t.dashboard.nav.dashboard, href: '/portal', icon: LayoutDashboard },
    { name: t.portal.messages, href: '/portal/messages', icon: MessageSquare },
    { name: language === 'zh' ? '报价与订单' : 'Quotes & Orders', href: '/portal/orders', icon: FileText },
    { name: t.portal.myShipments, href: '/portal/shipments', icon: Package },
    { name: t.portal.myDocuments, href: '/portal/documents', icon: FileCheck },
    { name: t.portal.support, href: '/portal/support', icon: HelpCircle },
  ];

  const isActive = (href: string) => {
    return location.pathname === href;
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
          <Link to="/portal">
            <Logo size="md" />
          </Link>
          <button
            className={`lg:hidden p-2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className={`px-4 py-3 border-b ${
          theme === 'dark'
            ? 'bg-xisync-cyan-900/30 border-xisync-cyan-800'
            : 'bg-xisync-cyan-50 border-xisync-cyan-100'
        }`}>
          <div className={`font-semibold ${theme === 'dark' ? 'text-xisync-cyan-300' : 'text-xisync-cyan-900'}`}>
            ABC Corporation
          </div>
          <div className={`text-sm ${theme === 'dark' ? 'text-xisync-cyan-400' : 'text-xisync-cyan-600'}`}>
            {t.portal.title}
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
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
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className={`p-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
          <button
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg ${
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
              <h1 className={`text-lg font-semibold hidden sm:block ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {t.portal.title}
              </h1>
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
                    John Smith
                  </div>
                  <div className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                    john@abccorp.com
                  </div>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center text-white text-sm font-semibold">
                  JS
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
