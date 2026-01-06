import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useI18n } from '../../lib/i18n';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { t } = useI18n();

  const navigation = [
    { name: t.nav.product, href: '/product' },
    { name: t.nav.integrations, href: '/integrations' },
    { name: t.nav.pricing, href: '/pricing' },
    {
      name: t.nav.resources,
      href: '#',
      children: [
        { name: t.nav.helpCenter, href: '/resources/help' },
        { name: t.nav.documentation, href: '/resources/docs' },
        { name: t.nav.blog, href: '/resources/blog' },
      ],
    },
  ];

  const isActive = (href: string) => location.pathname === href;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center">
              <Logo size="md" />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.children ? (
                    <button
                      className={`
                        flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg
                        transition-colors duration-200
                        ${activeDropdown === item.name ? 'text-xisync-blue-900 bg-gray-100' : 'text-gray-600 hover:text-xisync-blue-900'}
                      `}
                    >
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className={`
                        px-4 py-2 text-sm font-medium rounded-lg
                        transition-colors duration-200
                        ${isActive(item.href) ? 'text-xisync-blue-900 bg-xisync-blue-50' : 'text-gray-600 hover:text-xisync-blue-900'}
                      `}
                    >
                      {item.name}
                    </Link>
                  )}

                  {item.children && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 pt-2 animate-slide-down">
                      <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block px-4 py-2.5 text-sm text-gray-600 hover:text-xisync-blue-900 hover:bg-gray-50 transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <LanguageSwitcher variant="compact" />
            <Link to="/login">
              <Button variant="ghost">{t.auth.signIn}</Button>
            </Link>
            <Link to="/demo">
              <Button>{t.nav.bookDemo}</Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher variant="compact" />
            <button
              className="p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-100 animate-slide-down">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <button className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-600">
                      {item.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <div className="pl-4">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-4 py-2.5 text-sm text-gray-500 hover:text-xisync-blue-900"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    to={item.href}
                    className="block px-4 py-3 text-sm font-medium text-gray-600 hover:text-xisync-blue-900"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
            <div className="flex flex-col gap-3 mt-4 px-4">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full">
                  {t.auth.signIn}
                </Button>
              </Link>
              <Link to="/demo" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">{t.nav.bookDemo}</Button>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
