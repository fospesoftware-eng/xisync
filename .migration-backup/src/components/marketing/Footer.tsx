import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Twitter, Linkedin, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useI18n } from '../../lib/i18n';

const socialLinks = [
  { name: 'Twitter', href: '#', icon: Twitter },
  { name: 'LinkedIn', href: '#', icon: Linkedin },
  { name: 'YouTube', href: '#', icon: Youtube },
];

export function Footer() {
  const { t, language } = useI18n();

  const footerLinks = {
    product: {
      title: t.nav.product,
      links: [
        { name: 'CRM', href: '/product#crm' },
        { name: language === 'zh' ? '消息' : 'Messaging', href: '/product#messaging' },
        { name: language === 'zh' ? '物流' : 'Logistics', href: '/product#logistics' },
        { name: language === 'zh' ? '合规' : 'Compliance', href: '/product#compliance' },
        { name: language === 'zh' ? '客户门户' : 'Customer Portal', href: '/product#portal' },
        { name: t.nav.integrations, href: '/integrations' },
      ],
    },
    resources: {
      title: t.nav.resources,
      links: [
        { name: t.nav.helpCenter, href: '/help' },
        { name: t.nav.apiReference, href: '/docs/api' },
        { name: t.nav.blog, href: '/blog' },
      ],
    },
    company: {
      title: t.nav.company,
      links: [
        { name: t.nav.about, href: '/about' },
        { name: t.nav.careers, href: '/careers' },
        { name: t.nav.contact, href: '/contact' },
      ],
    },
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            <Logo size="lg" />
            <p className="mt-4 text-gray-400 text-sm leading-relaxed max-w-sm">
              {t.footer.description}
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="w-4 h-4" />
                <span>hello@xisync.com</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+86 400-888-8888</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>{language === 'zh' ? '中国上海' : 'Shanghai, China'}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-800 text-gray-400 hover:bg-xisync-cyan-600 hover:text-white transition-colors"
                >
                  <link.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-gray-400 hover:text-xisync-cyan-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500">
              © 2024 {language === 'zh' ? '犀同步' : 'XiSync'}. {t.footer.rights}
            </p>
            <div className="flex items-center gap-6">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-300">
                {t.footer.privacy}
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-300">
                {t.footer.terms}
              </Link>
              <Link to="/cookies" className="text-sm text-gray-500 hover:text-gray-300">
                {t.footer.cookies}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
