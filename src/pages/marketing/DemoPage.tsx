import { useState } from 'react';
import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { ScrollProgress } from '../../components/marketing/premium/ScrollProgress';
import { Reveal } from '../../components/marketing/premium/Reveal';
import { useI18n } from '../../lib/i18n';
import {
  Check, MessageSquare, Globe, ArrowRight, Building2, Mail, User, Phone,
  CalendarClock, Rocket,
} from 'lucide-react';

export function DemoPage() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    industry: '',
    size: '',
    message: '',
  });

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const benefits = [
    t('See every module live on real export workflows', '在真实出口业务流程中演示全部模块'),
    t('Get a setup plan matched to your channels & volume', '获得匹配您的渠道与业务量的落地方案'),
    t('Learn best practices from export operations experts', '由出口运营专家分享最佳实践'),
    t('No obligation — 14-day free trial after the call', '无强制购买，沟通后可享 14 天免费试用'),
  ];

  const steps = [
    {
      icon: MessageSquare,
      title: t('Discovery call · 15 min', '需求沟通 · 15 分钟'),
      desc: t('We learn about your markets, channels and current pain points.', '了解您的目标市场、使用渠道和当前痛点。'),
      accent: 'bg-xisync-blue-50 text-xisync-blue-600',
    },
    {
      icon: Globe,
      title: t('Live walkthrough · 30 min', '现场演示 · 30 分钟'),
      desc: t('Watch XiSync handle your own inquiries, quotes and shipments.', '用您自己的询盘、报价和货运场景现场演示。'),
      accent: 'bg-xisync-cyan-50 text-xisync-cyan-600',
    },
    {
      icon: Rocket,
      title: t('Next steps · 15 min', '落地计划 · 15 分钟'),
      desc: t('Leave with a tailored plan, pricing and migration timeline.', '沟通结束即获得定制方案、报价与数据迁移时间表。'),
      accent: 'bg-xisync-green-50 text-xisync-green-600',
    },
  ];

  const industries = [
    t('Manufacturing & machinery', '制造业与机械设备'),
    t('Consumer goods & home', '消费品与家居'),
    t('Electronics & hardware', '电子与智能硬件'),
    t('Textiles & apparel', '纺织品与服装'),
    t('Auto parts & aftermarket', '汽车零部件与售后市场'),
    t('Medical devices', '医疗器械'),
    t('Trading company', '贸易公司'),
    t('Other', '其他'),
  ];

  const sizes = [
    t('1–10 employees', '1–10 人'),
    t('11–50 employees', '11–50 人'),
    t('51–200 employees', '51–200 人'),
    t('201–500 employees', '201–500 人'),
    t('500+ employees', '500 人以上'),
  ];

  const inputCls =
    'w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-950 placeholder:text-ink-400 transition-all duration-200 focus:border-xisync-blue-500 focus:outline-none focus:ring-2 focus:ring-xisync-blue-500/20';
  const labelCls = 'mb-1.5 block text-sm font-medium text-ink-700';

  return (
    <div className="min-h-screen overflow-x-clip bg-ink-50">
      <ScrollProgress />
      <Header />

      <main>
        <section className="relative overflow-hidden pb-20 pt-32 lg:pb-28 lg:pt-40">
          <div className="absolute inset-0 bg-wash" />
          <div className="absolute inset-0 bg-grid-subtle" />
          <div className="absolute -top-40 -left-40 h-[30rem] w-[30rem] rounded-full bg-xisync-blue-200/50 blur-[120px] animate-drift" />
          <div className="absolute -top-20 -right-40 h-[26rem] w-[26rem] rounded-full bg-xisync-green-200/60 blur-[120px] animate-drift" style={{ animationDelay: '-7s' }} />

          <div className="container-custom relative z-10">
            <div className="grid items-start gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: pitch */}
              <Reveal>
                <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3.5 py-1 text-xs font-semibold text-ink-600 shadow-premium-sm">
                  <CalendarClock className="h-3.5 w-3.5 text-xisync-cyan-600" />
                  {t('Book a Demo', '预约演示')}
                </span>
                <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-ink-950 md:text-5xl">
                  {isZh ? (
                    <>亲眼见证 <span className="gradient-text">XiSync 如何运转</span></>
                  ) : (
                    <>See XiSync <span className="gradient-text">in action</span></>
                  )}
                </h1>
                <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-500 md:text-lg">
                  {t(
                    'Book a personalized walkthrough with our export experts. We’ll show you how to consolidate inquiries, close overseas orders faster, and automate compliance and freight — in one session.',
                    '预约出口专家的一对一演示。我们将用一场沟通，为您展示如何整合询盘、加速海外成交，并自动化合规与物流管理。'
                  )}
                </p>

                <ul className="mt-8 space-y-3.5">
                  {benefits.map((b) => (
                    <li key={b} className="flex items-start gap-3">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-xisync-green-100">
                        <Check className="h-3 w-3 text-xisync-green-600" />
                      </span>
                      <span className="text-sm text-ink-700">{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 space-y-4 rounded-2xl border border-ink-100 bg-white p-6 shadow-premium">
                  <h3 className="text-sm font-bold text-ink-950">{t('What to expect', '演示流程')}</h3>
                  {steps.map((s, i) => (
                    <div key={s.title} className="flex items-start gap-4">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.accent}`}>
                        <s.icon className="h-5 w-5" />
                      </div>
                      <div className="relative flex-1">
                        <div className="text-sm font-semibold text-ink-950">{s.title}</div>
                        <p className="mt-0.5 text-xs leading-relaxed text-ink-500">{s.desc}</p>
                        {i < steps.length - 1 && <div className="absolute -bottom-3 left-5 top-9 w-px bg-ink-100" />}
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Right: form */}
              <Reveal delay={0.15} y={28}>
                <div className="rounded-2xl border border-ink-100 bg-white p-7 shadow-premium-lg lg:p-8">
                  {submitted ? (
                    <div className="py-10 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-xisync-blue-100 to-xisync-green-100">
                        <Check className="h-8 w-8 text-xisync-green-600" />
                      </div>
                      <h2 className="mt-6 text-2xl font-bold text-ink-950">
                        {t('Thank you — request received', '提交成功，感谢您的预约')}
                      </h2>
                      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-ink-500">
                        {t(
                          'Our team will contact you within 24 hours to schedule your personalized demo. Keep an eye on your inbox for a confirmation.',
                          '我们的团队将在 24 小时内与您联系，安排专属演示时间，请注意查收邮箱中的确认邮件。'
                        )}
                      </p>
                      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink-50 px-4 py-2 text-xs font-medium text-ink-500">
                        <Mail className="h-3.5 w-3.5 text-xisync-cyan-600" />
                        {form.email || 'you@company.com'}
                      </div>
                    </div>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold text-ink-950">{t('Request your demo', '预约演示')}</h2>
                      <p className="mt-1.5 text-sm text-ink-500">
                        {t('Takes 30 seconds. No credit card needed.', '仅需 30 秒填写，无需信用卡。')}
                      </p>

                      <form
                        className="mt-6 space-y-4"
                        onSubmit={(e) => {
                          e.preventDefault();
                          setSubmitted(true);
                        }}
                      >
                        <div>
                          <label className={labelCls}>{t('Full name', '姓名')} *</label>
                          <div className="relative">
                            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                            <input required value={form.name} onChange={set('name')} placeholder={t('Zhang Wei', '张伟')} className={`${inputCls} pl-10`} />
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>{t('Work email', '工作邮箱')} *</label>
                          <div className="relative">
                            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                            <input required type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" className={`${inputCls} pl-10`} />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className={labelCls}>{t('Company', '公司名称')} *</label>
                            <div className="relative">
                              <Building2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                              <input required value={form.company} onChange={set('company')} placeholder={t('Ningbo Best Pack Co.', '宁波优品包装有限公司')} className={`${inputCls} pl-10`} />
                            </div>
                          </div>
                          <div>
                            <label className={labelCls}>{t('Phone / WhatsApp', '电话 / WhatsApp')}</label>
                            <div className="relative">
                              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                              <input type="tel" value={form.phone} onChange={set('phone')} placeholder="+86 138 0000 0000" className={`${inputCls} pl-10`} />
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className={labelCls}>{t('Industry', '所属行业')} *</label>
                            <select required value={form.industry} onChange={set('industry')} className={inputCls}>
                              <option value="">{t('Select industry', '请选择行业')}</option>
                              {industries.map((i) => (
                                <option key={i} value={i}>{i}</option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className={labelCls}>{t('Company size', '公司规模')} *</label>
                            <select required value={form.size} onChange={set('size')} className={inputCls}>
                              <option value="">{t('Select size', '请选择规模')}</option>
                              {sizes.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className={labelCls}>{t('What would you like to see? (optional)', '您最想了解哪些内容？（选填）')}</label>
                          <textarea
                            value={form.message}
                            onChange={set('message')}
                            rows={3}
                            placeholder={t('e.g. Alibaba RFQ handling, WhatsApp translation, shipment tracking…', '例如：阿里巴巴询盘处理、WhatsApp 翻译、货运追踪等')}
                            className={`${inputCls} resize-none`}
                          />
                        </div>

                        <button
                          type="submit"
                          className="group flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-xisync-blue-800 via-xisync-cyan-600 to-xisync-green-500 px-6 py-3.5 text-sm font-semibold text-white shadow-premium-md transition-all duration-200 hover:shadow-premium-lg hover:opacity-95"
                        >
                          {t('Request Demo', '提交预约')}
                          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                        </button>

                        <p className="text-center text-xs leading-relaxed text-ink-400">
                          {t(
                            'By submitting, you agree to our Privacy Policy and Terms of Service.',
                            '提交即表示您同意我们的隐私政策与服务条款。'
                          )}
                        </p>
                      </form>
                    </>
                  )}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
