import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Twitter, Linkedin, Youtube, Mail } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'YouTube', href: '#', icon: Youtube },
];

export function Footer() {
  const { t, language } = useI18n();
  const isZh = language === 'zh';

  const productLinks = [
    { name: isZh ? '全渠道收件箱' : 'Omnichannel Inbox', href: '/product#inbox' },
    { name: isZh ? '智能 CRM 与 RFQ 管道' : 'Smart CRM & RFQ Pipeline', href: '/product#crm' },
    { name: isZh ? '多式联运物流枢纽' : 'Multimodal Logistics Hub', href: '/product#freight' },
    { name: isZh ? '合规与贸易单据库' : 'Compliance & Trade Vault', href: '/product#compliance' },
    { name: isZh ? '品牌化买家门户' : 'Branded Buyer Portal', href: '/product#portal' },
    { name: isZh ? 'AI 助手' : 'AI Co-Pilot', href: '/product#ai' },
    { name: isZh ? '集成生态' : 'Integrations', href: '/integrations' },
  ];

  const industryLinks = [
    { name: isZh ? '电子与智能硬件' : 'Electronics & Hardware', href: '/solutions#electronics' },
    { name: isZh ? '工业机械与零部件' : 'Industrial Machinery', href: '/solutions#machinery' },
    { name: isZh ? '纺织品与服装' : 'Textiles & Apparel', href: '/solutions#textiles' },
    { name: isZh ? '汽车与售后市场' : 'Automotive & Aftermarket', href: '/solutions#automotive' },
    { name: isZh ? '消费品与家居' : 'Consumer Goods & Home', href: '/solutions#consumer' },
  ];

  const companyLinks = [
    { name: isZh ? '关于 XiSync' : 'About XiSync', href: '#' },
    { name: isZh ? '加入我们' : 'Careers', href: '#' },
    { name: isZh ? '新闻与媒体' : 'Press & Media', href: '#' },
    { name: isZh ? '合作伙伴计划' : 'Partner Program', href: '#' },
  ];

  const legalLinks = [
    { name: isZh ? '安全架构' : 'Security Architecture', href: '#' },
    { name: 'GDPR / PIPL', href: '#' },
    { name: isZh ? '服务条款' : 'Terms of Service', href: '#' },
    { name: isZh ? '服务状态' : 'Status Page', href: '#' },
  ];

  return (
    <footer className="relative bg-ink-950 text-white overflow-hidden">
      {/* subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      {/* soft glow */}
      <div className="absolute -top-32 left-1/4 h-64 w-[30rem] rounded-full bg-xisync-blue-600/10 blur-[120px]" />
      <div className="absolute -top-32 right-1/4 h-64 w-[30rem] rounded-full bg-xisync-green-500/10 blur-[120px]" />

      <div className="container-custom relative py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Logo size="lg" color="white" />
            <p className="mt-5 text-sm leading-relaxed text-ink-400 max-w-sm">
              {isZh
                ? '统一的 AI 驱动出口操作系统，助力制造商和贸易商更智能地拓展全球业务。'
                : 'Unified AI-powered export OS for manufacturers and trading companies to grow globally, smarter.'}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-ink-400 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  <link.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">{isZh ? '产品功能' : 'Product'}</h3>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-sm text-ink-400 hover:text-white transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industry */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">{isZh ? '行业方案' : 'Industries'}</h3>
            <ul className="mt-4 space-y-2.5">
              {industryLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-sm text-ink-400 hover:text-white transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">{isZh ? '关于公司' : 'Company'}</h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-sm text-ink-400 hover:text-white transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold text-white">{isZh ? '法律与合规' : 'Legal & Trust'}</h3>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((l) => (
                <li key={l.name}>
                  <Link to={l.href} className="text-sm text-ink-400 hover:text-white transition-colors">{l.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-ink-500">© 2025 XiSync. {t.footer.rights}</p>
          <div className="flex items-center gap-4 text-sm text-ink-500">
            <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /> hello@xisync.com</span>
            <span className="hidden sm:inline">SOC-2 · PIPL · AES-256</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
