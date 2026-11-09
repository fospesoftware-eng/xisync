import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { Logo } from '../ui/Logo';
import { Button } from '../ui/Button';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { useI18n } from '../../lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';

type DropdownChild = { name: string; href: string; desc?: string };

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t, language } = useI18n();
  const isZh = language === 'zh';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const modules: DropdownChild[] = [
    { name: isZh ? '全渠道收件箱' : 'Omnichannel Inbox', desc: isZh ? '统一管理所有买家沟通渠道' : 'Unify all buyer channels', href: '/product#inbox' },
    { name: isZh ? '智能 CRM 与 RFQ 管道' : 'Smart CRM & RFQ Pipeline', desc: isZh ? 'AI 潜客评分与报价' : 'AI lead scoring & quotes', href: '/product#crm' },
    { name: isZh ? '多式联运物流枢纽' : 'Multimodal Logistics Hub', desc: isZh ? '工厂到港口全程追踪' : 'Factory-to-port tracking', href: '/product#freight' },
    { name: isZh ? '合规与贸易单据库' : 'Compliance & Trade Vault', desc: isZh ? 'OCR 与区域合规检查' : 'OCR & regional checks', href: '/product#compliance' },
    { name: isZh ? '品牌化买家门户' : 'Branded Buyer Portal', desc: isZh ? '白标自助服务门户' : 'White-label self-service', href: '/product#portal' },
    { name: isZh ? 'AI 助手' : 'AI Co-Pilot', desc: isZh ? '7×24 双语客户经理' : '24/7 bilingual AE', href: '/product#ai' },
  ];

  const industries: DropdownChild[] = [
    { name: isZh ? '电子与智能硬件' : 'Electronics & Hardware', href: '/solutions#electronics' },
    { name: isZh ? '工业机械与零部件' : 'Industrial Machinery', href: '/solutions#machinery' },
    { name: isZh ? '纺织品与服装' : 'Textiles & Apparel', href: '/solutions#textiles' },
    { name: isZh ? '汽车与售后市场' : 'Automotive & Aftermarket', href: '/solutions#automotive' },
    { name: isZh ? '消费品与家居' : 'Consumer Goods & Home', href: '/solutions#consumer' },
  ];

  const navigation = [
    { name: isZh ? '功能模块' : 'Modules', href: '#', children: modules },
    { name: isZh ? '解决方案' : 'Solutions', href: '#', children: industries },
    { name: t.nav.integrations, href: '/integrations' },
    { name: t.nav.pricing, href: '/pricing' },
  ];

  const overHero = location.pathname === '/' && !scrolled && !mobileMenuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        overHero
          ? 'bg-transparent'
          : 'bg-white/80 backdrop-blur-xl border-b border-ink-100'
      }`}
    >
      <nav className="container-custom">
        <div className="flex items-center justify-between h-14 lg:h-16">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center group">
              <Logo size="md" color="gradient" />
            </Link>

            <div className="hidden lg:flex items-center gap-0.5">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.children && setActiveDropdown(item.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  {item.children ? (
                    <button
                      className="
                        flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200
                        text-ink-700 hover:text-ink-950 hover:bg-ink-100
                      "
                    >
                      {item.name}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${activeDropdown === item.name ? 'rotate-180' : ''}`} />
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className="
                        px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200
                        text-ink-700 hover:text-ink-950 hover:bg-ink-100
                      "
                    >
                      {item.name}
                    </Link>
                  )}

                  <AnimatePresence>
                    {item.children && activeDropdown === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        className="absolute top-full left-0 pt-2 w-[320px]"
                      >
                        <div className="rounded-2xl bg-white p-2 shadow-premium-lg border border-ink-100">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-ink-50"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium text-ink-900">{child.name}</div>
                                {child.desc && <div className="mt-0.5 text-xs text-ink-500 truncate">{child.desc}</div>}
                              </div>
                              <ArrowRight className="h-4 w-4 text-ink-300 opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2">
            <LanguageSwitcher variant="compact" className="text-ink-500" />
            <Link to="/login">
              <Button variant="ghost" className="text-ink-700 hover:text-ink-950 hover:bg-ink-100">
                {t.auth.signIn}
              </Button>
            </Link>
            <Link to="/demo" className="magnetic">
              <Button className="rounded-full text-white">
                {isZh ? '免费试用' : 'Start Free'}
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher variant="compact" className="text-ink-500" />
            <button
              className="p-2 transition-colors text-ink-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-ink-100 bg-white">
                {navigation.map((item) => (
                  <div key={item.name}>
                    {item.children ? (
                      <div className="px-4 py-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">{item.name}</div>
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            className="block py-2 text-sm text-ink-700 hover:text-ink-900"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className="block px-4 py-3 text-sm font-medium text-ink-700 hover:text-ink-900"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="flex flex-col gap-2 mt-4 px-4">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t.auth.signIn}
                    </Button>
                  </Link>
                  <Link to="/demo" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full rounded-full text-white">
                      {isZh ? '免费试用' : 'Start Free'}
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
