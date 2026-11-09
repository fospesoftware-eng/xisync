import { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { CTASection } from '../../components/marketing/CTASection';
import { ScrollProgress } from '../../components/marketing/premium/ScrollProgress';
import { Reveal } from '../../components/marketing/premium/Reveal';
import { PageHero, SectionHeading, FAQSection } from '../../components/marketing/MarketingUI';
import { useI18n } from '../../lib/i18n';
import { Check, X, ShieldCheck, RefreshCw, Headphones, Lock, Sparkles } from 'lucide-react';

type Cell = boolean | string;

type Plan = {
  id: string;
  name: { en: string; zh: string };
  desc: { en: string; zh: string };
  priceMonthly?: number;
  priceAnnual?: number;
  contactSales?: boolean;
  custom?: boolean;
  cta: { en: string; zh: string };
  popular: boolean;
  features: { en: string; zh: string }[];
};

const plans: Plan[] = [
  {
    id: 'starter',
    name: { en: 'Starter', zh: '入门版' },
    desc: { en: 'For small exporters getting started with global sales', zh: '适合刚起步的小型出口商' },
    priceMonthly: 1000,
    priceAnnual: 800,
    cta: { en: 'Start Free Trial', zh: '开始免费试用' },
    popular: false,
    features: [
      { en: '3 team members', zh: '3 名团队成员' },
      { en: '500 messages / month', zh: '每月 500 条消息' },
      { en: '2 email + 1 WhatsApp', zh: '2 个邮箱 + 1 个 WhatsApp' },
      { en: '1 storefront', zh: '1 个店铺' },
      { en: '50 shipment tracks / month', zh: '每月 50 次物流追踪' },
      { en: '5 GB document storage', zh: '5 GB 单据存储' },
      { en: 'XiSync subdomain portal', zh: 'XiSync 子域名门户' },
      { en: 'Standard email support', zh: '标准邮件支持' },
    ],
  },
  {
    id: 'pro',
    name: { en: 'Pro', zh: '专业版' },
    desc: { en: 'For growing export teams that need every channel', zh: '适合需要全渠道能力的成长期出口团队' },
    contactSales: true,
    cta: { en: 'Contact Sales', zh: '联系销售' },
    popular: true,
    features: [
      { en: '10 team members', zh: '10 名团队成员' },
      { en: '5,000 messages / month', zh: '每月 5,000 条消息' },
      { en: '5 email + 3 WhatsApp + WeChat', zh: '5 个邮箱 + 3 个 WhatsApp + 微信' },
      { en: '3 storefronts', zh: '3 个店铺' },
      { en: '250 shipment tracks / month', zh: '每月 250 次物流追踪' },
      { en: '50 GB storage + OCR', zh: '50 GB 存储 + OCR 识别' },
      { en: 'Custom branded domain', zh: '自定义品牌域名' },
      { en: 'Dedicated priority account manager', zh: '专属优先客户经理' },
    ],
  },
  {
    id: 'business',
    name: { en: 'Business', zh: '企业版' },
    desc: { en: 'For established exporters with complex compliance needs', zh: '适合合规需求复杂的成熟外贸企业' },
    contactSales: true,
    cta: { en: 'Contact Sales', zh: '联系销售' },
    popular: false,
    features: [
      { en: '25 team members', zh: '25 名团队成员' },
      { en: '25,000 messages / month', zh: '每月 25,000 条消息' },
      { en: 'Unlimited channel connections', zh: '所有渠道无限连接' },
      { en: 'All supported storefronts', zh: '所有支持的店铺' },
      { en: '1,000 shipment tracks / month', zh: '每月 1,000 次物流追踪' },
      { en: '250 GB storage + OCR', zh: '250 GB 存储 + OCR 识别' },
      { en: 'Full white-label portal', zh: '完整白标门户' },
      { en: '24/7 SLA + guided onboarding', zh: '7×24 SLA + 专属入职对接' },
    ],
  },
  {
    id: 'enterprise',
    name: { en: 'Enterprise', zh: '旗舰版' },
    desc: { en: 'High-volume teams & private deployment', zh: '高业务量团队与私有化部署' },
    custom: true,
    cta: { en: 'Talk to Sales', zh: '咨询销售' },
    popular: false,
    features: [
      { en: 'Unlimited seats', zh: '无限席位' },
      { en: 'Unlimited messages', zh: '无限消息' },
      { en: 'Dedicated infrastructure', zh: '专属基础设施' },
      { en: 'Custom ERP / marketplace integration', zh: '定制 ERP / 平台集成' },
      { en: 'High-volume dedicated logistics API', zh: '高吞吐专属物流 API' },
      { en: 'Unlimited storage + custom AI engine', zh: '无限存储 + 自定义 AI 引擎' },
      { en: 'Multi-brand custom portals', zh: '多品牌定制门户' },
      { en: 'Custom SLA & engineering lead', zh: '定制 SLA + 专属工程对接' },
    ],
  },
];

type Category = {
  name: { en: string; zh: string };
  rows: { name: { en: string; zh: string }; values: Cell[] }[];
};

const categories: Category[] = [
  {
    name: { en: 'Core Platform', zh: '核心平台' },
    rows: [
      { name: { en: 'Team members', zh: '团队成员' }, values: ['3', '10', '25', { en: 'Unlimited', zh: '无限' }] },
      { name: { en: 'Messages per month', zh: '每月消息数' }, values: ['500', '5,000', '25,000', { en: 'Unlimited', zh: '无限' }] },
      { name: { en: 'Document storage', zh: '单据存储' }, values: ['5 GB', '50 GB', '250 GB', { en: 'Unlimited', zh: '无限' }] },
      { name: { en: 'Export CRM & pipeline', zh: '出口 CRM 与销售管道' }, values: [true, true, true, true] },
      { name: { en: 'AI translation & reply drafting', zh: 'AI 翻译与回复起草' }, values: [false, true, true, true] },
    ],
  },
  {
    name: { en: 'Channels & Storefronts', zh: '渠道与店铺' },
    rows: [
      { name: { en: 'Email integration', zh: '邮箱集成' }, values: [true, true, true, true] },
      { name: { en: 'WhatsApp Business', zh: 'WhatsApp Business' }, values: [true, true, true, true] },
      { name: { en: 'WeChat', zh: '微信' }, values: [false, true, true, true] },
      { name: { en: 'Instagram & Facebook', zh: 'Instagram 与 Facebook' }, values: [false, true, true, true] },
      { name: { en: 'Connected storefronts', zh: '对接店铺数' }, values: ['1', '3', { en: 'All', zh: '全部' }, { en: 'All', zh: '全部' }] },
    ],
  },
  {
    name: { en: 'Logistics & Compliance', zh: '物流与合规' },
    rows: [
      { name: { en: 'Shipment tracking / month', zh: '每月物流追踪' }, values: ['50', '250', '1,000', { en: 'Unlimited', zh: '无限' }] },
      { name: { en: 'Carrier API feeds (Maersk, DHL…)', zh: '承运商 API 数据（马士基、DHL 等）' }, values: [false, true, true, true] },
      { name: { en: 'OCR document parsing', zh: 'OCR 单据识别' }, values: [false, true, true, true] },
      { name: { en: 'Compliance center & expiry alerts', zh: '合规中心与到期提醒' }, values: [false, false, true, true] },
    ],
  },
  {
    name: { en: 'Buyer Portal & Branding', zh: '买家门户与品牌' },
    rows: [
      { name: { en: 'Buyer self-service portal', zh: '买家自助门户' }, values: [true, true, true, true] },
      { name: { en: 'Custom domain', zh: '自定义域名' }, values: [false, true, true, true] },
      { name: { en: 'Full white-label branding', zh: '完整白标品牌' }, values: [false, false, true, true] },
      { name: { en: 'Multi-brand portals', zh: '多品牌门户' }, values: [false, false, false, true] },
    ],
  },
  {
    name: { en: 'API & Support', zh: 'API 与支持' },
    rows: [
      { name: { en: 'REST API & webhooks', zh: 'REST API 与 Webhooks' }, values: [false, false, true, true] },
      { name: { en: 'Custom ERP integration', zh: '定制 ERP 集成' }, values: [false, false, false, true] },
      { name: { en: 'Dedicated account manager', zh: '专属客户经理' }, values: [false, true, true, true] },
      { name: { en: 'Uptime SLA', zh: '可用性 SLA' }, values: ['—', '99.5%', '99.9%', '99.99%'] },
    ],
  },
];

function CellValue({ cell, isZh }: { cell: Cell; isZh: boolean }) {
  if (cell === true) {
    return (
      <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-xisync-green-100">
        <Check className="h-3 w-3 text-xisync-green-600" />
      </span>
    );
  }
  if (cell === false) {
    return (
      <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-ink-100">
        <X className="h-3 w-3 text-ink-300" />
      </span>
    );
  }
  const text = typeof cell === 'string' ? cell : isZh ? cell.zh : cell.en;
  return <span className="text-sm font-medium text-ink-700">{text}</span>;
}

export function PricingPage() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const [annual, setAnnual] = useState(true);

  const faqsFull = [
    {
      q: t('Can I try XiSync before committing?', '付费之前可以先试用吗？'),
      a: t(
        'Yes. Every plan starts with a 14-day free trial — no credit card required. You can explore every module and upgrade, downgrade or cancel at any time.',
        '可以。所有方案均提供 14 天免费试用，无需绑定信用卡。您可以体验全部模块，并随时升级、降级或取消。'
      ),
    },
    {
      q: t('Which currency do you bill in?', '支持什么货币结算？'),
      a: t(
        'All published prices are in Chinese Yuan (RMB). Enterprise agreements can also be settled in USD or EUR with a locked exchange rate.',
        '公示价格均以人民币（RMB）计价。旗舰版企业合同也可使用美元或欧元结算，并锁定汇率。'
      ),
    },
    {
      q: t('What does annual billing save?', '按年付费可以省多少？'),
      a: t(
        'Choosing annual billing on the Starter plan works out to ¥800/month — a saving of about 20% versus monthly billing.',
        '入门版选择按年付费，折合每月 ¥800，相比按月付费节省约 20%。'
      ),
    },
    {
      q: t('What happens if I exceed my message or tracking limit?', '消息或追踪额度用完了怎么办？'),
      a: t(
        'We notify you at 80% usage. You can upgrade instantly, or purchase add-on packs. We never cut off active conversations with your buyers.',
        '额度使用到 80% 时我们会提醒您。您可以随时升级，或购买加油包；我们绝不会中断您与买家正在进行的沟通。'
      ),
    },
    {
      q: t('Is our customer and pricing data secure?', '客户名单和报价数据安全吗？'),
      a: t(
        'Absolutely. Data is protected with RBAC permissions, AES-256 end-to-end encryption and strict tenant isolation. Sales reps only see the accounts assigned to them. We are SOC 2 aligned with PIPL-compliant data handling.',
        '绝对安全。系统采用 RBAC 权限控制、AES-256 端到端加密与严格的租户隔离，业务员仅能访问分配给自己的客户。我们遵循 SOC 2 标准，并按 PIPL 要求处理数据。'
      ),
    },
    {
      q: t('Can Pro, Business and Enterprise only be bought through sales?', '专业版、企业版、旗舰版只能联系销售购买吗？'),
      a: t(
        'These plans are tailored to your team size, channels and shipment volume, so we scope them with you in a short call — including onboarding and data migration.',
        '这三个方案会根据您的团队规模、渠道数量和货运量量身配置，我们会通过一次简短沟通为您确认方案，包含入职培训与数据迁移。'
      ),
    },
  ];

  const guarantees = [
    { icon: RefreshCw, title: t('14-day free trial', '14 天免费试用'), desc: t('No credit card required', '无需绑定信用卡') },
    { icon: ShieldCheck, title: t('SOC 2 · PIPL aligned', '符合 SOC 2 · PIPL'), desc: t('Enterprise-grade security', '企业级安全保障') },
    { icon: Headphones, title: t('Onboarding & migration', '入职与数据迁移'), desc: t('Guided by our export experts', '由出口专家全程指导') },
    { icon: Lock, title: t('Cancel anytime', '随时取消'), desc: t('No long-term lock-in', '无长期绑定') },
  ];

  return (
    <div className="min-h-screen overflow-x-clip bg-ink-50">
      <ScrollProgress />
      <Header />

      <main>
        <PageHero
          eyebrow={t('Pricing', '价格方案')}
          title={
            isZh ? (
              <>简单透明，<span className="gradient-text">随业务扩展</span></>
            ) : (
              <>Simple, Transparent, <span className="gradient-text">Built to Scale</span></>
            )
          }
          subtitle={t(
            'Start free for 14 days. Every plan includes the export CRM, unified inbox and AI translation — upgrade as your volume grows. All prices in Chinese Yuan (RMB).',
            '14 天免费试用开始。所有方案均包含出口 CRM、统一收件箱与 AI 翻译，业务增长后再随时升级。所有价格以人民币（RMB）计价。'
          )}
          primaryCta={t('Start Free Trial', '开始免费试用')}
          primaryHref="/demo"
          secondaryCta={t('Book a Demo', '预约演示')}
          secondaryHref="/demo"
        >
          {/* Billing toggle */}
          <div className="inline-flex items-center gap-1 rounded-full border border-ink-200 bg-white p-1 shadow-premium">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                !annual ? 'bg-ink-950 text-white' : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              {t('Monthly', '按月付费')}
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 ${
                annual ? 'bg-ink-950 text-white' : 'text-ink-500 hover:text-ink-900'
              }`}
            >
              {t('Annual', '按年付费')}
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  annual ? 'bg-white/20 text-white' : 'bg-xisync-green-100 text-xisync-green-700'
                }`}
              >
                {t('Save 20%', '省 20%')}
              </span>
            </button>
          </div>
        </PageHero>

        {/* Plan cards */}
        <section className="relative z-10 -mt-4 pb-8">
          <div className="container-custom">
            <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan, i) => (
                <Reveal key={plan.id} delay={i * 0.08} className="h-full">
                  <div
                    className={`card-lift relative flex h-full flex-col rounded-2xl border-2 bg-white p-6 ${
                      plan.popular ? 'border-xisync-blue-500 shadow-premium-md' : 'border-ink-200'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-xisync-blue-700 via-xisync-cyan-600 to-xisync-green-500 px-3 py-1 text-xs font-semibold text-white">
                        {t('Most Popular', '最受欢迎')}
                      </span>
                    )}
                    <h3 className="text-base font-semibold text-ink-950">{t(plan.name.en, plan.name.zh)}</h3>
                    <div className="mt-3 min-h-[2.5rem]">
                      {plan.priceMonthly ? (
                        <>
                          <span className={`text-3xl font-bold ${plan.popular ? 'gradient-text' : 'text-ink-950'}`}>
                            ¥{(annual ? (plan.priceAnnual ?? plan.priceMonthly!) : plan.priceMonthly!).toLocaleString()}
                          </span>
                          <span className="text-sm text-ink-500"> / {t('mo', '月')}</span>
                        </>
                      ) : plan.contactSales ? (
                        <span className="text-2xl font-bold text-ink-950">{t('Contact Sales', '联系销售')}</span>
                      ) : (
                        <span className="text-2xl font-bold text-ink-950">{t('Custom', '定制报价')}</span>
                      )}
                    </div>
                    {plan.priceMonthly && annual && (
                      <p className="mt-1 text-xs text-ink-400">
                        {t('Billed', '按年计费')} ¥{((plan.priceAnnual ?? 0) * 12).toLocaleString()} / {t('year', '年')}
                      </p>
                    )}
                    <p className="mt-2 text-sm text-ink-500">{t(plan.desc.en, plan.desc.zh)}</p>

                    <ul className="mt-5 flex-1 space-y-2.5">
                      {plan.features.map((f) => (
                        <li key={f.en} className="flex items-start gap-2 text-sm text-ink-600">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-xisync-green-500" />
                          <span>{t(f.en, f.zh)}</span>
                        </li>
                      ))}
                    </ul>

                    <Link to="/demo" className="mt-6 block">
                      <span
                        className={`flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 ${
                          plan.popular
                            ? 'bg-gradient-to-r from-xisync-blue-800 via-xisync-cyan-600 to-xisync-green-500 text-white shadow-premium hover:shadow-premium-lg hover:opacity-95'
                            : 'border-2 border-ink-200 bg-white text-ink-950 hover:border-ink-300 hover:bg-ink-50'
                        }`}
                      >
                        {t(plan.cta.en, plan.cta.zh)}
                      </span>
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison table */}
        <section className="bg-white py-20 lg:py-28">
          <div className="container-custom">
            <SectionHeading
              eyebrow={t('Compare Plans', '方案对比')}
              title={
                isZh ? (
                  <>完整功能<span className="gradient-text">一目了然</span></>
                ) : (
                  <>Every feature, <span className="gradient-text">side by side</span></>
                )
              }
              subtitle={t('Not sure which plan fits? Our team will map your channels, team size and shipment volume to the right tier in a 15-minute call.',
                '不确定哪个方案合适？我们的团队会在 15 分钟沟通中，根据您的渠道、团队规模和货运量为您推荐合适的版本。')}
            />

            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-ink-200 shadow-premium">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse bg-white">
                    <thead>
                      <tr className="border-b border-ink-200 bg-ink-50/80">
                        <th className="p-5 text-left text-sm font-semibold text-ink-950">{t('Feature', '功能')}</th>
                        {plans.map((p) => (
                          <th key={p.id} className="p-5 text-center">
                            <div className={`text-sm font-bold ${p.popular ? 'gradient-text' : 'text-ink-950'}`}>
                              {t(p.name.en, p.name.zh)}
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <Fragment key={cat.name.en}>
                          <tr>
                            <td colSpan={5} className="bg-ink-950 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white">
                              {t(cat.name.en, cat.name.zh)}
                            </td>
                          </tr>
                          {cat.rows.map((row, ri) => (
                            <tr key={row.name.en} className={ri % 2 === 0 ? 'bg-white' : 'bg-ink-50/40'}>
                              <td className="px-5 py-3.5 text-sm text-ink-600">{t(row.name.en, row.name.zh)}</td>
                              {row.values.map((v, vi) => (
                                <td key={vi} className="px-5 py-3.5 text-center">
                                  <CellValue cell={v} isZh={isZh} />
                                </td>
                              ))}
                            </tr>
                          ))}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Guarantees */}
        <section className="bg-ink-50/60 py-16">
          <div className="container-custom">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {guarantees.map((g, i) => (
                <Reveal key={g.title} delay={i * 0.07} className="h-full">
                  <div className="card-lift h-full rounded-2xl border border-ink-100 bg-white p-6 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-xisync-blue-50 to-xisync-green-50">
                      <g.icon className="h-5 w-5 text-xisync-cyan-600" />
                    </div>
                    <h3 className="mt-4 text-sm font-bold text-ink-950">{g.title}</h3>
                    <p className="mt-1 text-xs text-ink-500">{g.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-white py-20 lg:py-28">
          <div className="container-custom">
            <SectionHeading
              eyebrow={t('FAQ', '常见问题')}
              title={
                isZh ? (
                  <>价格相关<span className="gradient-text">常见问题</span></>
                ) : (
                  <>Pricing <span className="gradient-text">questions, answered</span></>
                )
              }
            />
            <FAQSection items={faqsFull} />
            <Reveal className="mt-10 text-center">
              <p className="text-sm text-ink-500">
                {t('Still have questions?', '还有其他问题？')}{' '}
                <Link to="/demo" className="inline-flex items-center gap-1 font-semibold text-xisync-blue-700 hover:underline">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t('Talk to our team', '与我们的团队沟通')}
                </Link>
              </p>
            </Reveal>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
