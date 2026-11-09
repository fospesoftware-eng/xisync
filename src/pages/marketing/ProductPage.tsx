import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { CTASection } from '../../components/marketing/CTASection';
import { ScrollProgress } from '../../components/marketing/premium/ScrollProgress';
import { Reveal } from '../../components/marketing/premium/Reveal';
import { PageHero, SectionHeading, CheckItem } from '../../components/marketing/MarketingUI';
import { useI18n } from '../../lib/i18n';
import {
  MessageCircle, Zap, Truck, FileCheck, LayoutDashboard, Bot,
  TrendingUp, Clock, Globe, ShieldCheck,
} from 'lucide-react';

type Module = {
  id: string;
  icon: typeof MessageCircle;
  name: { en: string; zh: string };
  title: { en: string; zh: string };
  tagline: { en: string; zh: string };
  description: { en: string; zh: string };
  features: { en: string; zh: string }[];
  metrics: { value: string; label: { en: string; zh: string } }[];
  accent: string;
  visual: 'inbox' | 'pipeline' | 'freight' | 'docs' | 'portal' | 'ai';
};

const modules: Module[] = [
  {
    id: 'inbox',
    icon: MessageCircle,
    name: { en: 'Connect', zh: '沟通' },
    title: { en: 'Omnichannel Communication Inbox', zh: '全渠道沟通收件箱' },
    tagline: {
      en: 'Never lose an overseas buyer in fragmented chat apps again.',
      zh: '再也不会在零散的聊天应用中流失海外买家。',
    },
    description: {
      en: 'Every WhatsApp message, WeChat chat, email, Instagram DM and Facebook conversation lands in one shared inbox — with real-time neural translation so your team replies in the buyer’s language in seconds.',
      zh: 'WhatsApp、微信、邮件、Instagram、Facebook 的所有消息都汇聚到同一个共享收件箱，实时神经翻译让团队几秒钟内就能用买家的母语回复。',
    },
    features: [
      { en: 'Real-time bidirectional translation across 7+ languages', zh: '实时双向翻译，支持 7 种以上语言' },
      { en: 'Unified inbox: WhatsApp, WeChat, Email, Instagram, Messenger', zh: '统一收件箱：WhatsApp、微信、邮件、Instagram、Messenger' },
      { en: 'AI auto-drafts high-converting follow-up messages', zh: 'AI 自动起草高转化率的跟进话术' },
      { en: 'SLA timers, team routing and conversation ownership', zh: 'SLA 计时、团队分配与会话归属' },
    ],
    metrics: [
      { value: '-80%', label: { en: 'response time', zh: '响应时间' } },
      { value: '7+', label: { en: 'languages', zh: '种语言' } },
      { value: '3x', label: { en: 'messages handled', zh: '消息处理量' } },
    ],
    accent: 'bg-xisync-blue-50 text-xisync-blue-600',
    visual: 'inbox',
  },
  {
    id: 'crm',
    icon: Zap,
    name: { en: 'CRM', zh: 'CRM' },
    title: { en: 'Smart Export CRM & Pipeline', zh: '智能出口 CRM 与销售管道' },
    tagline: {
      en: 'Close high-ticket international orders with deal intelligence.',
      zh: '借助订单智能，高效成交高价值海外订单。',
    },
    description: {
      en: 'Built for the 30-to-90 day export sales cycle. AI lead scoring surfaces verified buyers, multi-currency proforma invoices calculate Incoterms automatically, and a predictive pipeline tells you which deals need attention today.',
      zh: '专为 30–90 天的出口销售周期打造。AI 潜客评分精准锁定真实买家，多币种形式发票自动核算贸易术语，预测式管道告诉你今天该跟进哪些订单。',
    },
    features: [
      { en: 'AI lead scoring prioritizes verified buyers', zh: 'AI 潜客评分，优先处理真实采购意向' },
      { en: 'Instant multi-currency PI with Incoterms calculation', zh: '即时多币种形式发票，自动计算贸易术语' },
      { en: 'Predictive pipeline for 30–90 day export cycles', zh: '预测式管道，适配 30–90 天出口周期' },
      { en: 'Quotes, samples, orders and reorders in one timeline', zh: '报价、样品、订单与返单集中在一条时间线' },
    ],
    metrics: [
      { value: '+34%', label: { en: 'RFQ-to-order rate', zh: '询盘转化率' } },
      { value: '10x', label: { en: 'faster follow-up', zh: '跟进速度' } },
      { value: '35%', label: { en: 'higher conversion', zh: '转化率提升' } },
    ],
    accent: 'bg-xisync-cyan-50 text-xisync-cyan-600',
    visual: 'pipeline',
  },
  {
    id: 'freight',
    icon: Truck,
    name: { en: 'Logistics', zh: '物流' },
    title: { en: 'Real-Time Freight & Logistics Tracker', zh: '实时货运与物流追踪' },
    tagline: {
      en: 'Factory floor to buyer’s door with zero blind spots.',
      zh: '从工厂车间到买家门口，全程零盲区。',
    },
    description: {
      en: 'Live carrier API feeds from Maersk, COSCO, DHL, FedEx and UPS. XiSync detects delays, vessel roll-overs and customs holds automatically — and pushes branded milestone updates to your overseas buyers before they ask.',
      zh: '直连马士基、中远、DHL、FedEx、UPS 的官方数据接口。XiSync 自动识别延误、船舶滚装与海关扣留，并在买家询问之前主动推送品牌化的物流动态。',
    },
    features: [
      { en: 'Direct API feeds from Maersk, COSCO, DHL, FedEx, UPS', zh: '直连马士基、中远、DHL、FedEx、UPS 官方接口' },
      { en: 'Auto alerts for delays, roll-overs and customs holds', zh: '延误、滚装、海关扣留自动预警' },
      { en: 'Sea, air and express in one timeline', zh: '海运、空运、快递统一在一条时间线' },
      { en: 'Automated buyer-facing milestone notifications', zh: '自动向买家推送里程碑通知' },
    ],
    metrics: [
      { value: '100%', label: { en: 'shipment visibility', zh: '货物可见性' } },
      { value: '-60%', label: { en: 'support tickets', zh: '客服工单' } },
      { value: '+40%', label: { en: 'buyer trust', zh: '买家信任度' } },
    ],
    accent: 'bg-xisync-green-50 text-xisync-green-600',
    visual: 'freight',
  },
  {
    id: 'compliance',
    icon: FileCheck,
    name: { en: 'Compliance', zh: '合规' },
    title: { en: 'Compliance, Customs & Document Vault', zh: '合规、海关与单据库' },
    tagline: {
      en: 'Eliminate customs hold-ups and lost container fees.',
      zh: '杜绝海关扣留与滞箱费用。',
    },
    description: {
      en: 'Deep OCR reads bills of lading, packing lists, invoices and certificates of origin — even handwritten slips. Destination checklists cover EU CE/RoHS, US FDA/FCC and Saudi SASO, with certificate expiry monitoring built in.',
      zh: '深度 OCR 可识别提单、装箱单、发票、原产地证，甚至手写单据。目的国合规清单覆盖欧盟 CE/RoHS、美国 FDA/FCC、沙特 SASO，并内置证书到期监控。',
    },
    features: [
      { en: 'OCR parses B/L, packing lists, invoices, certificates of origin', zh: 'OCR 解析提单、装箱单、发票、原产地证' },
      { en: 'EU CE/RoHS, US FDA/FCC, SASO compliance checklists', zh: '欧盟 CE/RoHS、美国 FDA/FCC、SASO 合规清单' },
      { en: 'Certificate expiry monitoring with auto reminders', zh: '证书到期监控，自动提醒续期' },
      { en: 'Version-controlled, audit-ready document vault', zh: '版本可追溯、随时可审计的单据库' },
    ],
    metrics: [
      { value: '0', label: { en: 'compliance delays', zh: '合规延误' } },
      { value: '-90%', label: { en: 'compliance issues', zh: '合规问题' } },
      { value: '10x', label: { en: 'faster retrieval', zh: '单据调取速度' } },
    ],
    accent: 'bg-ink-100 text-ink-900',
    visual: 'docs',
  },
  {
    id: 'portal',
    icon: LayoutDashboard,
    name: { en: 'Portal', zh: '门户' },
    title: { en: 'White-Label Buyer Self-Service Portal', zh: '白标买家自助门户' },
    tagline: {
      en: 'Give overseas clients an enterprise-grade tracking experience.',
      zh: '为海外客户提供企业级的自助追踪体验。',
    },
    description: {
      en: 'Your buyers get a branded portal on your own domain — track orders, watch production milestones on a live map, and download QC reports, invoices and test certificates in their own language. Your support inbox gets quieter by the week.',
      zh: '买家通过您的专属域名访问品牌化门户：追踪订单、在实时地图上查看生产里程碑、用母语下载质检报告、发票与测试证书。客服邮箱从此越来越安静。',
    },
    features: [
      { en: 'Custom domain & branding (track.yourcompany.com)', zh: '自定义域名与品牌形象（track.贵公司.com）' },
      { en: 'Multi-language production progress & tracking maps', zh: '多语言生产进度与追踪地图' },
      { en: 'One-click downloads: reports, invoices, certificates', zh: '一键下载质检报告、发票、测试证书' },
      { en: 'Quote approval and reorder requests in-portal', zh: '门户内直接确认报价、发起返单' },
    ],
    metrics: [
      { value: '70%', label: { en: 'self-service rate', zh: '自助服务率' } },
      { value: '-50%', label: { en: 'support volume', zh: '客服工作量' } },
      { value: '+60%', label: { en: 'buyer satisfaction', zh: '买家满意度' } },
    ],
    accent: 'bg-xisync-cyan-50 text-xisync-cyan-600',
    visual: 'portal',
  },
  {
    id: 'ai',
    icon: Bot,
    name: { en: 'AI Co-Pilot', zh: 'AI 助手' },
    title: { en: 'Embedded AI Co-Pilot', zh: '嵌入式 AI 助手' },
    tagline: {
      en: 'Your 24/7 bilingual export account executive.',
      zh: '您 7×24 小时在线的双语出口客户经理。',
    },
    description: {
      en: 'Trained on cross-border trade, the Co-Pilot pre-screens documents for missing HS codes and weight mismatches, drafts buyer replies, recommends optimal container and Incoterms strategies, and flags risks before they cost you money.',
      zh: 'AI 助手基于跨境贸易场景训练，可预筛缺失 HS 编码、重量不符等风险，起草买家回复，推荐最优装柜方案与贸易术语，在问题造成损失之前提前预警。',
    },
    features: [
      { en: 'Deep cross-border OCR, including handwritten slips', zh: '深度跨境 OCR，可识别手写单据' },
      { en: 'Pre-screening for missing HS codes and mismatches', zh: '预筛缺失 HS 编码、信息不符等风险' },
      { en: 'Optimal container & Incoterms recommendations', zh: '推荐最优装柜方案与贸易术语' },
      { en: 'Bilingual reply drafting in the buyer’s tone', zh: '贴合买家语气的双语回复起草' },
    ],
    metrics: [
      { value: '24/7', label: { en: 'always on', zh: '全天候在线' } },
      { value: '68%', label: { en: 'less manual work', zh: '人工工作量减少' } },
      { value: '<1s', label: { en: 'draft generation', zh: '生成草稿耗时' } },
    ],
    accent: 'bg-xisync-blue-50 text-xisync-blue-600',
    visual: 'ai',
  },
];

/* ---------- Per-module mockup visuals ---------- */
function MockVisual({ type }: { type: Module['visual'] }) {
  const card = 'rounded-xl border border-ink-100 bg-white p-4 shadow-premium';
  const bar = 'h-2 rounded-full bg-ink-100';

  if (type === 'inbox') {
    return (
      <div className="space-y-3">
        {[
          { name: 'WhatsApp', msg: 'Hi, can you ship 2x40HQ to Hamburg?', tag: 'bg-xisync-green-100 text-xisync-green-700', unread: true },
          { name: 'WeChat', msg: '报价单请更新一下 FOB 价格', tag: 'bg-xisync-blue-100 text-xisync-blue-700', unread: true },
          { name: 'Email', msg: 'Re: PI #XS-2041 — please confirm ETA', tag: 'bg-ink-100 text-ink-600', unread: false },
        ].map((c) => (
          <div key={c.name} className={card}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink-950">{c.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${c.tag}`}>{c.unread ? 'NEW' : 'TR'}</span>
            </div>
            <p className="mt-2 text-xs text-ink-500">{c.msg}</p>
            <div className="mt-2 flex items-center gap-2">
              <Globe className="h-3 w-3 text-xisync-cyan-500" />
              <span className="text-[10px] text-xisync-cyan-600">Translated · AI reply ready</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'pipeline') {
    const stages = [
      { name: 'New RFQ', pct: 100, n: 12 },
      { name: 'Quoted', pct: 78, n: 8 },
      { name: 'Negotiating', pct: 52, n: 5 },
      { name: 'Deposit Paid', pct: 30, n: 3 },
    ];
    return (
      <div className={card}>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-xs font-bold text-ink-950">Export Pipeline</span>
          <span className="rounded-full bg-xisync-green-50 px-2 py-0.5 text-[10px] font-semibold text-xisync-green-600">+$284K this week</span>
        </div>
        <div className="space-y-3">
          {stages.map((s) => (
            <div key={s.name}>
              <div className="mb-1 flex justify-between text-[10px] font-medium text-ink-500">
                <span>{s.name} · {s.n}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-ink-100">
                <div className="h-full rounded-full bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-green-500" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink-100 pt-3 text-center">
          <div><div className="text-sm font-bold text-ink-950">87</div><div className="text-[10px] text-ink-400">Open deals</div></div>
          <div><div className="text-sm font-bold gradient-text">$1.2M</div><div className="text-[10px] text-ink-400">Forecast</div></div>
          <div><div className="text-sm font-bold text-ink-950">64%</div><div className="text-[10px] text-ink-400">Win rate</div></div>
        </div>
      </div>
    );
  }

  if (type === 'freight') {
    return (
      <div className={card}>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-bold text-ink-950">MSKU 4821 · COSCO</span>
          <span className="rounded-full bg-xisync-blue-50 px-2 py-0.5 text-[10px] font-semibold text-xisync-blue-600">At Sea</span>
        </div>
        <div className="relative flex items-center justify-between px-1">
          {['Ningbo', 'Singapore', 'Suez', 'Hamburg'].map((p, i) => (
            <div key={p} className="flex flex-col items-center gap-1.5">
              <div className={`h-2.5 w-2.5 rounded-full ${i < 2 ? 'bg-gradient-to-r from-xisync-blue-600 to-xisync-green-500' : 'bg-ink-200'}`} />
              <span className="text-[9px] font-medium text-ink-500">{p}</span>
            </div>
          ))}
          <div className="absolute left-3 right-3 top-1 -z-0 h-0.5 bg-ink-100" />
        </div>
        <div className="mt-4 space-y-2">
          <div className={`${bar} w-full`} />
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-xisync-green-600" />
            <span className="text-[10px] text-ink-500">ETA Hamburg: Sep 24 · on schedule</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3 w-3 text-xisync-cyan-600" />
            <span className="text-[10px] text-ink-500">Buyer notified automatically</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'docs') {
    return (
      <div className="space-y-3">
        {[
          { name: 'Bill of Lading · XS-2041', ok: true },
          { name: 'Packing List · 420 cartons', ok: true },
          { name: 'CE Certificate — expires 2026-11', ok: false },
          { name: 'Certificate of Origin · FORM A', ok: true },
        ].map((d) => (
          <div key={d.name} className={`${card} flex items-center justify-between`}>
            <div className="flex items-center gap-3">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${d.ok ? 'bg-xisync-green-100' : 'bg-amber-100'}`}>
                <FileCheck className={`h-4 w-4 ${d.ok ? 'text-xisync-green-600' : 'text-amber-600'}`} />
              </div>
              <span className="text-xs font-medium text-ink-700">{d.name}</span>
            </div>
            <span className={`text-[10px] font-semibold ${d.ok ? 'text-xisync-green-600' : 'text-amber-600'}`}>
              {d.ok ? '✓ Verified' : 'Renew soon'}
            </span>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'portal') {
    return (
      <div className={`${card} overflow-hidden p-0`}>
        <div className="flex items-center justify-between bg-ink-950 px-4 py-2.5">
          <span className="text-[10px] font-semibold text-white">track.bestpack-mfg.com</span>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] text-white/80">EN · DE</span>
        </div>
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold text-ink-950">Order #XS-2041</span>
            <span className="rounded-full bg-xisync-green-50 px-2 py-0.5 text-[10px] font-semibold text-xisync-green-600">In Production</span>
          </div>
          <div className="mb-3 space-y-2">
            {['Tooling complete', 'Mass production 60%', 'QC inspection booked'].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`h-1.5 w-1.5 rounded-full ${i < 2 ? 'bg-xisync-green-500' : 'bg-ink-200'}`} />
                <span className="text-[10px] text-ink-600">{s}</span>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {['QC Report', 'Invoice', 'Test Cert', 'B/L'].map((b) => (
              <div key={b} className="rounded-lg border border-ink-100 bg-ink-50 py-2 text-center text-[10px] font-medium text-ink-600">{b} ↓</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ai
  return (
    <div className="space-y-3">
      <div className={`${card} bg-ink-950 border-ink-950`}>
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-xisync-cyan-400" />
          <span className="text-xs font-bold text-white">XiSync AI</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ink-300">
          This RFQ asks for CIF Hamburg. Your usual FOB rate + €1,840 freight = 6.2% margin. Switching to CIF with carrier X improves margin to 9.1%. Draft the reply?
        </p>
        <div className="mt-3 flex gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold text-white">Draft reply</span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium text-white/70">Explain</span>
        </div>
      </div>
      <div className={`${card} flex items-start gap-3`}>
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-xisync-green-600" />
        <p className="text-[11px] text-ink-600">HS code check passed · net/gross weight matches PI · no L/C discrepancy risk detected.</p>
      </div>
    </div>
  );
}

export function ProductPage() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);

  return (
    <div className="min-h-screen overflow-x-clip bg-ink-50">
      <ScrollProgress />
      <Header />

      <main>
        <PageHero
          eyebrow={t('Product Modules', '产品模块')}
          title={
            isZh ? (
              <>一个平台，<span className="gradient-text">六大出口引擎</span></>
            ) : (
              <>One Platform, <span className="gradient-text">Six Export Engines</span></>
            )
          }
          subtitle={t(
            'Every stage of the export journey — inquiry, order, compliance, logistics and buyer experience — unified in one AI-driven system. Start with what you need, add more as you grow.',
            '从询盘、订单、合规、物流到买家体验，出口全流程统一在一个 AI 驱动的系统中。先用您需要的模块，业务增长后随时扩展。'
          )}
          primaryCta={t('Start 14-Day Free Trial', '开始 14 天免费试用')}
          primaryHref="/demo"
          secondaryCta={t('Book a Live Demo', '预约现场演示')}
          secondaryHref="/demo"
        />

        {/* Module quick nav */}
        <section className="relative z-20 -mt-8 pb-4">
          <div className="container-custom">
            <Reveal y={16}>
              <div className="flex flex-wrap justify-center gap-2.5 rounded-2xl border border-ink-100 bg-white/80 p-3 shadow-premium backdrop-blur-xl">
                {modules.map((m) => (
                  <a
                    key={m.id}
                    href={`#${m.id}`}
                    className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-ink-600 transition-all duration-200 hover:bg-ink-100 hover:text-ink-950"
                  >
                    <m.icon className="h-4 w-4 text-xisync-cyan-600" />
                    {t(m.name.en, m.name.zh)}
                  </a>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Module sections */}
        {modules.map((mod, index) => (
          <section
            key={mod.id}
            id={mod.id}
            className={`relative scroll-mt-24 py-20 lg:py-28 ${index % 2 === 1 ? 'bg-white' : 'bg-ink-50/60'}`}
          >
            <div className="container-custom">
              <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <Reveal>
                    <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${mod.accent}`}>
                      <mod.icon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-3xl font-bold tracking-tight text-ink-950 md:text-4xl">
                      {t(mod.title.en, mod.title.zh)}
                    </h2>
                    <p className="mt-2 text-base font-semibold gradient-text">
                      {t(mod.tagline.en, mod.tagline.zh)}
                    </p>
                    <p className="mt-4 text-base leading-relaxed text-ink-500">
                      {t(mod.description.en, mod.description.zh)}
                    </p>
                    <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                      {mod.features.map((f, i) => (
                        <CheckItem key={i}>{t(f.en, f.zh)}</CheckItem>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap gap-8 border-t border-ink-100 pt-6">
                      {mod.metrics.map((m) => (
                        <div key={m.label.en}>
                          <div className="text-2xl font-bold gradient-text">{m.value}</div>
                          <div className="text-xs font-medium text-ink-400">{t(m.label.en, m.label.zh)}</div>
                        </div>
                      ))}
                    </div>
                  </Reveal>
                </div>

                <Reveal delay={0.15} y={32} className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative">
                    <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-br from-xisync-blue-100/60 via-white to-xisync-green-100/60 blur-2xl" />
                    <div className="relative rounded-2xl border border-ink-100 bg-white/70 p-5 shadow-premium-lg backdrop-blur-sm">
                      <div className="mb-4 flex items-center gap-2">
                        <div className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                        <div className="h-2.5 w-2.5 rounded-full bg-ink-200" />
                        <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-xisync-blue-500 to-xisync-green-500" />
                        <span className="ml-2 text-[10px] font-medium text-ink-400">app.xisync.com</span>
                      </div>
                      <MockVisual type={mod.visual} />
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </section>
        ))}

        {/* Platform stats strip */}
        <section className="bg-white py-16">
          <div className="container-custom">
            <SectionHeading
              eyebrow={t('One Unified Platform', '统一平台')}
              title={isZh ? <>数据只录入一次，<span className="gradient-text">处处自动流转</span></> : <>Enter data once, <span className="gradient-text">it flows everywhere</span></>}
              subtitle={t(
                'Modules share the same buyer records, documents and order history — no copy-pasting between spreadsheets, chat apps and ERP screens.',
                '所有模块共享同一套买家档案、单据与订单数据，无需在表格、聊天软件和 ERP 之间反复复制粘贴。'
              )}
            />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { icon: TrendingUp, value: '-68%', label: { en: 'Buyer inquiry response time', zh: '买家询盘响应时间' } },
                { icon: Zap, value: '+34%', label: { en: 'RFQ-to-order conversion', zh: '询盘到订单转化率' } },
                { icon: ShieldCheck, value: '0', label: { en: 'Compliance-related delays', zh: '合规原因导致的延误' } },
                { icon: Truck, value: '100%', label: { en: 'Multimodal shipment visibility', zh: '多式联运货物可见性' } },
              ].map((s, i) => (
                <Reveal key={s.label.en} delay={i * 0.08} className="h-full">
                  <div className="card-lift h-full rounded-2xl border border-ink-100 bg-white p-6 text-center">
                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-xisync-blue-50 to-xisync-green-50">
                      <s.icon className="h-5 w-5 text-xisync-cyan-600" />
                    </div>
                    <div className="mt-4 text-3xl font-bold gradient-text">{s.value}</div>
                    <p className="mt-1 text-sm text-ink-500">{t(s.label.en, s.label.zh)}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
