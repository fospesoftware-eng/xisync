import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Lock, Building2, ShieldCheck } from 'lucide-react';
import { Reveal } from './premium/Reveal';
import { useI18n } from '../../lib/i18n';

export function CTASection() {
  const { language } = useI18n();
  const isZh = language === 'zh';

  return (
    <section className="relative overflow-hidden bg-ink-950 py-24 lg:py-32">
      <div className="absolute inset-0 bg-grid-subtle opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(34,197,94,0.12)_0%,transparent_60%)]" />
      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-xisync-blue-600/10 blur-[100px]" />
      <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-xisync-green-500/10 blur-[100px]" />

      <div className="container-custom relative z-10">
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-white/80 backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {isZh ? '立即开始' : 'Get Started'}
            </div>
            <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl">
              {isZh ? '准备好拓展您的全球业务了吗？' : 'Ready to Grow Your Global Business?'}
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-400 md:text-lg">
              {isZh ? '加入成千上万家正在精简运营、提升海外销售额的优秀出口企业。' : 'Join thousands of exporters who are streamlining operations and growing overseas sales.'}
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/demo" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink-950 hover:bg-ink-100 transition-all duration-200 shadow-premium-lg">
                {isZh ? '开始 14 天免费试用' : 'Start 14-Day Free Trial'}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/demo" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:border-white/25 hover:bg-white/10">
                {isZh ? '预约平台演示' : 'Schedule Platform Walkthrough'}
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-ink-500">
              <span className="inline-flex items-center gap-1.5"><Lock className="h-3.5 w-3.5" /> AES-256 {isZh ? '加密' : 'encrypted'}</span>
              <span className="inline-flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5" /> 10,000+ {isZh ? '出口企业' : 'exporters'}</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> {isZh ? '14 天免费试用' : '14-day free trial'}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
