import { useMemo, useState, type MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useMotionTemplate, AnimatePresence } from 'framer-motion';
import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { Button } from '../../components/ui/Button';
import { ChannelIcon } from '../../components/ui/ChannelIcon';
import { Reveal } from '../../components/marketing/premium/Reveal';
import { CountUp } from '../../components/marketing/premium/CountUp';
import { Marquee } from '../../components/marketing/premium/Marquee';
import { ScrollProgress } from '../../components/marketing/premium/ScrollProgress';
import { useI18n } from '../../lib/i18n';
import {
  ArrowRight, MessageCircle, Package, FileCheck, LayoutDashboard,
  Play, TrendingUp, Zap, Check, Languages, ShieldCheck,
  Truck, Building2, ChevronDown, ChevronUp, Factory, Calculator,
  Landmark, Bot, Cpu, Wrench, Shirt, Car, Boxes, Lock, RefreshCw, Eye,
  Sparkles,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as const;

function SplitText({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  const isCjk = /[\u4e00-\u9fff]/.test(text);

  if (isCjk) {
    return (
      <motion.span
        className={`inline-block ${className}`}
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.6, delay, ease: EASE }}
      >
        {text}
      </motion.span>
    );
  }

  const words = useMemo(() => text.split(' '), [text]);
  return (
    <span className="inline-block">
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={`inline-block whitespace-nowrap ${className}`}
          initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.5, delay: delay + i * 0.08, ease: EASE }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-3.5 py-1 text-xs font-semibold text-ink-600 shadow-premium-sm">
      <span className="h-1 w-1 rounded-full bg-brand-500" />
      {children}
    </span>
  );
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow: string; title: React.ReactNode; subtitle?: string }) {
  return (
    <Reveal className="mx-auto mb-16 max-w-3xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-3xl font-bold leading-tight text-ink-950 md:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && <p className="mt-5 text-base leading-relaxed text-ink-500 md:text-lg">{subtitle}</p>}
    </Reveal>
  );
}

function FAQItem({ q, a, isOpen, onToggle, index }: { q: string; a: string; isOpen: boolean; onToggle: () => void; index: number }) {
  return (
    <Reveal delay={index * 0.08} y={16}>
      <div className="rounded-2xl border border-ink-200 bg-white p-5 transition-all duration-300 hover:border-ink-300 card-lift">
        <button onClick={onToggle} className="flex w-full items-center justify-between gap-4 text-left">
          <span className="text-base font-semibold text-ink-950">{q}</span>
          <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-100 text-ink-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </span>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <p className="mt-3 text-sm leading-relaxed text-ink-500">{a}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Reveal>
  );
}

export function HomePage() {
  const { language } = useI18n();
  const isZh = language === 'zh';

  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const spotlightBg = useMotionTemplate`radial-gradient(500px circle at ${spotlightX}% ${spotlightY}%, rgba(37,99,235,0.07), transparent 60%)`;

  const modules = [
    {
      icon: MessageCircle,
      title: isZh ? '全渠道沟通收件箱' : 'Omnichannel Communication Inbox',
      tagline: isZh ? '再也不会在零散的聊天应用中流失海外买家' : 'Never lose an overseas buyer in fragmented chat apps again.',
      features: [
        isZh ? '实时双向神经翻译，支持 7+ 种语言' : 'Real-time bidirectional translation across 7+ languages',
        isZh ? '统一管理 WhatsApp、微信、邮件、Instagram、Messenger' : 'Unify WhatsApp, WeChat, Email, Instagram, Messenger',
        isZh ? 'AI 自动生成高转化的跟进消息' : 'AI auto-drafts high-converting follow-ups',
      ],
      accent: 'bg-brand-50 text-brand-600',
    },
    {
      icon: Zap,
      title: isZh ? '智能出口 CRM 与销售管道' : 'Smart Export CRM & Pipeline',
      tagline: isZh ? '借助订单智能，高效成交高价值海外订单' : 'Close high-ticket international orders with deal intelligence.',
      features: [
        isZh ? 'AI 潜客评分，精准锁定真实采购意向' : 'AI lead scoring prioritizes verified buyers',
        isZh ? '即时多币种报价，自动计算国际贸易术语' : 'Instant multi-currency PI with Incoterms calculation',
        isZh ? '预测式销售管道，适配 30-90 天出口周期' : 'Predictive pipeline for 30-to-90 day export cycles',
      ],
      accent: 'bg-ink-100 text-ink-900',
    },
    {
      icon: Truck,
      title: isZh ? '实时货运与物流追踪' : 'Real-Time Freight & Logistics Tracker',
      tagline: isZh ? '从工厂到买家门口，全程零盲区' : 'Factory floor to buyer\'s door with zero blind spots.',
      features: [
        isZh ? '直连马士基、中远、DHL、FedEx、UPS 官方 API' : 'Direct API feeds from Maersk, COSCO, DHL, FedEx, UPS',
        isZh ? '自动检测延误、集装箱滚装、海关扣留' : 'Auto delay, vessel roll-over, customs alerts',
        isZh ? '自动向海外买家推送里程碑通知' : 'Auto milestone dispatch to overseas buyers',
      ],
      accent: 'bg-cyan-50 text-cyan-600',
    },
    {
      icon: FileCheck,
      title: isZh ? '合规、海关与单据库' : 'Compliance, Customs & Document Vault',
      tagline: isZh ? '杜绝海关扣留与滞箱费用' : 'Eliminate customs hold-ups and lost container fees.',
      features: [
        isZh ? '智能 OCR 解析提单、装箱单、发票、原产地证' : 'OCR parses B/L, Packing Lists, Invoices, CO',
        isZh ? '欧盟 CE/RoHS、美国 FDA/FCC、沙特 SASO 合规清单' : 'EU CE/RoHS, US FDA/FCC, SASO checklists',
        isZh ? '证书到期自动提醒' : 'Certificate expiry monitoring',
      ],
      accent: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: LayoutDashboard,
      title: isZh ? '白标买家自助门户' : 'White-Label Buyer Self-Service Portal',
      tagline: isZh ? '为海外客户提供企业级追踪体验' : 'Give overseas clients an enterprise-grade tracking experience.',
      features: [
        isZh ? '自定义域名与品牌形象（track.yourcompany.com）' : 'Custom domain & branding',
        isZh ? '多语言生产进度展示与追踪地图' : 'Multi-language production & tracking maps',
        isZh ? '一键下载质检报告、发票、测试证书' : 'One-click download: reports, invoices, certificates',
      ],
      accent: 'bg-amber-50 text-amber-600',
    },
    {
      icon: Bot,
      title: isZh ? '嵌入式 AI 助手' : 'Embedded AI Co-Pilot',
      tagline: isZh ? '您 24/7 在线的双语出口客户经理' : 'Your 24/7 bilingual export account executive.',
      features: [
        isZh ? '深度跨境 OCR，可识别手写单据' : 'Deep cross-border OCR for handwritten slips',
        isZh ? '合规预筛：缺失 HS 编码、重量不符等预警' : 'Compliance pre-screening for missing HS codes',
        isZh ? '推荐最优集装箱装柜方案与贸易术语' : 'Optimal container & Incoterms recommendations',
      ],
      accent: 'bg-violet-50 text-violet-600',
    },
  ];

  const extensions = [
    {
      icon: Factory,
      title: isZh ? '🏭 工厂生产与里程碑联动' : '🏭 Factory Production & Milestone Link',
      subtitle: isZh ? 'OEM / ODM 就绪' : 'OEM / ODM Ready',
      items: [
        isZh ? '实时批次状态：对接 ERP/MES，买家可见模具、原料、QA 进度' : 'Live Batch Status: ERP/MES for tooling, materials, QA updates',
        isZh ? '数字化装船前检验：上传 QA 图片、跌落测试视频、SGS/TÜV 报告' : 'Digital PSI: QA images, drop-test videos, SGS/TÜV reports',
      ],
    },
    {
      icon: Calculator,
      title: isZh ? '📦 智能 CBM 与集装箱优化' : '📦 Intelligent CBM & Container Optimization',
      subtitle: isZh ? '3D 装柜预览' : '3D Stuffing Preview',
      items: [
        isZh ? '3D 集装箱装柜预览：基于产品规格模拟 20GP/40GP/40HQ 布局' : '3D preview for 20GP, 40GP, 40HQ from product specs',
        isZh ? '体积重量优化，空运附加费即时提醒' : 'Dimensional weight optimization with instant warnings',
      ],
    },
    {
      icon: Landmark,
      title: isZh ? '🛡️ 贸易融资与外汇风险管理' : '🛡️ Trade Finance & FX Risk Management',
      subtitle: isZh ? '实时汇率监控' : 'Real-Time FX Monitor',
      items: [
        isZh ? '美元/欧元/人民币汇率锁定，报价有效期到期提醒' : 'FX rate locks & quotation validity alerts',
        isZh ? '信用证不符点检查：按 UCP 600 规则自动扫描' : 'L/C Discrepancy Checker against UCP 600 rules',
      ],
    },
  ];

  const industries = [
    { icon: Cpu, name: isZh ? '电子与智能硬件' : 'Electronics & Hardware', desc: isZh ? 'RoHS/CE/FCC、序列号追踪、锂电池' : 'RoHS/CE/FCC, serial tracking, lithium' },
    { icon: Wrench, name: isZh ? '工业机械与设备' : 'Industrial Machinery', desc: isZh ? '长周期管道、散货物流、里程碑付款' : 'Long-cycle pipeline, breakbulk, milestone' },
    { icon: Shirt, name: isZh ? '纺织品与服装' : 'Textiles & Apparel', desc: isZh ? '样品追踪、OEKO-TEX/GOTS、阿里巴巴 RFQ' : 'Sample tracking, OEKO-TEX/GOTS, Alibaba' },
    { icon: Car, name: isZh ? '汽车与售后市场' : 'Automotive & Aftermarket', desc: isZh ? '零件目录、VIN 匹配、全球分销' : 'Parts catalog, VIN matching, global' },
    { icon: Boxes, name: isZh ? '消费品与家居' : 'Consumer Goods & Home', desc: isZh ? '季节性船期、条码生成、多语言' : 'Seasonal dates, barcode gen, multi-lang' },
  ];

  const valueMetrics = [
    { value: '-68%', label: isZh ? '买家询盘响应时间' : 'Buyer Inquiry Response Time', icon: Zap },
    { value: '+34%', label: isZh ? 'RFQ 到订单转化率' : 'RFQ-to-Order Conversion Rate', icon: TrendingUp },
    { value: '0', label: isZh ? '合规延误' : 'Compliance Delays', icon: ShieldCheck },
    { value: '100%', label: isZh ? '多式联运货物可见性' : 'Multimodal Shipment Visibility', icon: Eye },
  ];

  const stats = [
    { to: 10000, suffix: '+', label: isZh ? '活跃出口商' : 'Active Exporters' },
    { to: 50, suffix: '+', label: isZh ? '覆盖国家数' : 'Countries Reached' },
    { prefix: '$', to: 2, suffix: 'B+', label: isZh ? '贸易总额' : 'Trade Volume' },
    { to: 99.9, decimals: 1, suffix: '%', label: isZh ? '系统可用率' : 'Uptime' },
  ];

  const channels = ['WhatsApp', 'WeChat', 'Email', 'Instagram', 'Facebook', 'TikTok'];
  const brands = ['Alibaba', 'Made-in-China', 'WhatsApp Business', 'WeChat Work', 'Gmail', 'Microsoft 365', 'Slack', 'Zapier', 'Google Drive', 'Dropbox'];

  const heroMouseHandler = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    spotlightX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotlightY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen overflow-x-clip bg-ink-50">
      <ScrollProgress />

      <Header />

      <main>
        {/* ============ HERO ============ */}
        <section
          className="relative overflow-hidden pt-28 pb-24 lg:pt-36 lg:pb-32"
          onMouseMove={heroMouseHandler}
        >
          {/* soft gradient wash */}
          <div className="absolute inset-0 bg-wash" />
          {/* subtle grid */}
          <div className="absolute inset-0 bg-grid-subtle" />

          {/* soft floating blobs */}
          <div className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-xisync-blue-200/50 blur-[120px] animate-drift" />
          <div className="absolute top-10 -right-40 h-[28rem] w-[28rem] rounded-full bg-xisync-green-200/60 blur-[120px] animate-drift" style={{ animationDelay: '-6s' }} />
          <div className="absolute bottom-0 left-1/2 h-[24rem] w-[24rem] -translate-x-1/2 rounded-full bg-xisync-cyan-100/60 blur-[120px] animate-drift" style={{ animationDelay: '-10s' }} />

          <motion.div aria-hidden className="pointer-events-none absolute inset-0 z-[2] hidden lg:block" style={{ background: spotlightBg }} />

          <div className="container-custom relative z-10">
            <div className="mx-auto max-w-5xl text-center">
              {/* badge */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
                className="inline-flex items-center gap-2 rounded-full border border-ink-200 bg-white px-4 py-1.5 shadow-premium-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <span className="text-xs font-medium text-ink-700">
                  {isZh ? '⚡ 10,000+ 跨境出口商与制造商信赖' : '⚡ Trusted by 10,000+ Cross-Border Exporters'}
                </span>
              </motion.div>

              {/* headline */}
              <h1 className="mt-8 text-5xl font-bold leading-[1.05] tracking-tight text-ink-950 sm:text-6xl lg:text-7xl xl:text-8xl">
                <SplitText text={isZh ? 'AI 驱动的全球' : 'The AI-Powered'} delay={0.15} />
                <br />
                <SplitText
                  text={isZh ? '出口操作系统' : 'Export Operating System'}
                  delay={0.35}
                  className="gradient-text"
                />
              </h1>

              {/* subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-ink-500 md:text-xl"
              >
                {isZh
                  ? '整合全球询盘、加速海外订单成交、自动化海关合规、追踪工厂到港口货运——这一切都集成于专为现代制造商打造的统一平台。'
                  : 'Consolidate global inquiries, close overseas deals faster, automate customs compliance, and track factory-to-port freight—all in one unified platform built for modern manufacturers.'}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.75 }}
                className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
              >
                <Link to="/demo" className="btn-primary magnetic">
                  <span>{isZh ? '开始 14 天免费试用' : 'Start 14-Day Free Trial'}</span>
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
                <Link to="/demo" className="btn-secondary magnetic">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink-100">
                    <Play className="h-3 w-3 text-ink-700" />
                  </span>
                  {isZh ? '预约现场演示' : 'Book a Live Demo'}
                </Link>
              </motion.div>

              {/* social proof */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.9 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-ink-500"
              >
                <span className="inline-flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Alibaba.com {isZh ? '认证合作伙伴' : 'Verified'}</span>
                <span className="inline-flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> Made-in-China {isZh ? '已对接' : 'Connected'}</span>
                <span className="inline-flex items-center gap-1.5"><RefreshCw className="h-3.5 w-3.5" /> WhatsApp Business BSP</span>
                <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> SOC-2 · PIPL</span>
              </motion.div>
            </div>

            {/* dashboard mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 1, ease: EASE }}
              className="relative mx-auto mt-16 max-w-5xl"
            >
              <div className="absolute -inset-8 rounded-[2rem] bg-gradient-to-br from-xisync-blue-200/40 via-white to-xisync-green-200/40 blur-2xl" />

              <div className="relative rounded-2xl border border-ink-200 bg-white shadow-premium-lg overflow-hidden">
                {/* browser chrome */}
                <div className="flex items-center gap-2 border-b border-ink-100 px-4 py-2.5">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-ink-200" />
                    <span className="h-3 w-3 rounded-full bg-ink-200" />
                    <span className="h-3 w-3 rounded-full bg-ink-200" />
                  </div>
                  <div className="mx-auto w-full max-w-md rounded-lg bg-ink-50 px-3 py-1 text-center text-xs text-ink-500 border border-ink-100">
                    app.xisync.com/dashboard
                  </div>
                  <div className="w-8" />
                </div>

                <div className="grid grid-cols-3 gap-3 p-4 sm:gap-4 sm:p-6">
                  <div className="col-span-2 rounded-xl border border-ink-100 bg-ink-50/50 p-4 sm:p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div className="h-2.5 w-24 rounded bg-ink-200" />
                      <div className="h-6 w-6 rounded-lg bg-brand-100" />
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-2 w-full rounded bg-ink-200" />
                      <div className="h-2 w-3/4 rounded bg-ink-200" />
                      <div className="h-2 w-1/2 rounded bg-ink-200" />
                    </div>
                    <div className="mt-5 flex h-16 items-end gap-1.5">
                      {[35, 55, 42, 70, 58, 85, 64, 92, 76, 100].map((h, i) => (
                        <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-xisync-blue-700 via-xisync-cyan-500 to-xisync-green-400" style={{ height: `${h}%` }} />
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-xisync-blue-100" />
                      <div className="flex-1">
                        <div className="mb-1 h-2 w-16 rounded bg-ink-200" />
                        <div className="h-2 w-28 rounded bg-ink-200" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-xl border border-ink-100 bg-white p-4">
                      <div className="mb-2 h-2 w-14 rounded bg-ink-200" />
                      <div className="text-2xl font-bold text-ink-950">$45.2K</div>
                      <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-xisync-green-50 px-2 py-0.5">
                        <TrendingUp className="h-3 w-3 text-xisync-green-600" />
                        <span className="text-xs font-medium text-xisync-green-600">+12%</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-ink-100 bg-white p-4">
                      <div className="mb-2 h-2 w-14 rounded bg-ink-200" />
                      <div className="flex items-center gap-2">
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-ink-100">
                          <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-xisync-blue-600 to-xisync-green-500" />
                        </div>
                        <span className="text-xs font-medium text-ink-600">75%</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-ink-100 bg-white p-4">
                      <div className="mb-2 h-2 w-14 rounded bg-ink-200" />
                      <div className="flex h-8 items-end gap-1">
                        {[30, 45, 38, 62, 55, 80, 70, 95].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-xisync-blue-600 to-xisync-green-400" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* floating chips */}
              <motion.div
                className="absolute -left-8 top-10 z-20 hidden xl:block"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.4 }}
              >
                <div className="animate-float flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-premium">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-brand-600">
                    <Languages className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-ink-950">{isZh ? 'AI 实时翻译' : 'AI Live Translation'}</div>
                    <div className="text-[11px] text-ink-500">EN → 中文 · ES · AR</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="absolute -right-6 top-20 z-20 hidden xl:block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 1.55 }}
              >
                <div className="animate-float-slow flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3 shadow-premium" style={{ animationDelay: '-3s' }}>
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <Package className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-ink-950">{isZh ? '货物已发出' : 'Shipment dispatched'}</div>
                    <div className="text-[11px] text-ink-500">#XS-2024-0918 · ETA 14d</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* stats */}
            <div className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.08} y={20}>
                  <div className="text-center">
                    <CountUp to={stat.to} prefix={stat.prefix} suffix={stat.suffix} decimals={stat.decimals} className="gradient-text text-3xl font-bold md:text-4xl" />
                    <div className="mt-1 text-sm text-ink-500">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-ink-50" />
        </section>

        {/* ============ VALUE METRICS ============ */}
        <section className="relative py-4 lg:py-6">
          <div className="container-custom">
            <Reveal y={24}>
              <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 rounded-2xl border border-ink-200 bg-white p-4 shadow-premium-md md:grid-cols-4 md:p-5">
                {valueMetrics.map((m) => (
                  <div key={m.label} className="group flex items-center gap-3 rounded-xl p-2.5 transition-all duration-200 hover:bg-ink-50">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-ink-950 text-white transition-transform duration-200 group-hover:scale-105">
                      <m.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-2xl font-bold text-ink-950 md:text-3xl">{m.value}</div>
                      <div className="text-xs text-ink-500 leading-snug">{m.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ============ BRAND MARQUEE ============ */}
        <section className="relative bg-ink-50 py-10 border-y border-ink-100">
          <div className="container-custom">
            <Reveal>
              <p className="text-center text-xs font-medium uppercase tracking-widest text-ink-400">
                {isZh ? '已对接的平台' : 'Integrated with'}
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Marquee duration={40} className="mt-6 mask-fade-x">
                {brands.map((brand) => (
                  <span key={brand} className="mx-10 text-sm font-semibold uppercase tracking-[0.2em] text-ink-300">
                    {brand}
                  </span>
                ))}
              </Marquee>
            </Reveal>
          </div>
        </section>

        {/* ============ 6 CORE ENGINES ============ */}
        <section className="relative overflow-hidden bg-white py-20 lg:py-28">
          <div className="container-custom">
            <SectionHeading
              eyebrow={isZh ? '六大核心引擎' : 'Six Core Engines'}
              title={
                isZh ? (
                  <>为 <span className="gradient-text">现代出口商</span> 打造的平台</>
                ) : (
                  <>Built for <span className="gradient-text">Modern Exporters</span></>
                )
              }
              subtitle={isZh ? '从询盘到交付、从合规到物流——全部集成于一个 AI 驱动的统一系统中。' : 'From inquiry to delivery, compliance to logistics—all in one unified AI-driven platform.'}
            />

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((mod, i) => (
                <Reveal key={mod.title} delay={(i % 3) * 0.08} y={20} className="h-full">
                  <div className="group h-full">
                    <div className="card-lift h-full rounded-2xl border border-ink-200 bg-white p-6">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${mod.accent}`}>
                        <mod.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-ink-950">{mod.title}</h3>
                      <p className="mt-1.5 text-sm italic text-ink-400">"{mod.tagline}"</p>
                      <ul className="mt-4 space-y-2">
                        {mod.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-ink-500">
                            <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-ink-300" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ OMNICHANNEL ============ */}
        <section className="relative overflow-hidden bg-ink-50 py-20 lg:py-28">
          <div className="container-custom">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <Reveal>
                  <Eyebrow>{isZh ? '全渠道' : 'Omnichannel'}</Eyebrow>
                  <h2 className="mt-5 text-3xl font-bold leading-tight text-ink-950 md:text-4xl lg:text-5xl">
                    {isZh ? (
                      <>在买家最常用的 <span className="gradient-text">渠道</span> 触达他们</>
                    ) : (
                      <>Meet Buyers on Their <span className="gradient-text">Channels</span></>
                    )}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-5 text-base leading-relaxed text-ink-500 md:text-lg">
                    {isZh ? 'WhatsApp、微信、邮件、Instagram、Facebook——所有对话汇聚于一个收件箱，配备即时 AI 翻译。' : 'WhatsApp, WeChat, Email, Instagram, Facebook — all conversations in one place with instant AI translation.'}
                  </p>
                </Reveal>
                <ul className="mt-7 space-y-3">
                  {(isZh
                    ? ['统一收件箱', '实时 AI 翻译（支持 7+ 种语言）', 'AI 智能回复建议', '完整对话历史', '团队协作收件箱']
                    : ['Single unified inbox', 'Real-time translation (7+ languages)', 'AI smart reply suggestions', 'Full conversation history', 'Collaborative team inbox']
                  ).map((item, i) => (
                    <Reveal key={item} delay={0.12 + i * 0.06} x={-16}>
                      <li className="flex items-center gap-3 text-ink-700">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-ink-950 text-white">
                          <Check className="h-3 w-3" />
                        </span>
                        <span className="text-sm font-medium">{item}</span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>

              <div className="relative">
                <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-brand-100 via-white to-cyan-100 blur-2xl" />
                <div className="relative grid grid-cols-3 gap-3">
                  {channels.map((channel, i) => (
                    <motion.div
                      key={channel}
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                    >
                      <div className="animate-float" style={{ animationDelay: `${(i % 3) * -2}s`, animationDuration: `${6 + (i % 3)}s` }}>
                        <div className="card-lift group flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-ink-200 bg-white p-5 shadow-premium-sm">
                          <ChannelIcon channel={channel} size="lg" />
                          <span className="text-xs font-semibold text-ink-500">{channel}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ INDUSTRY EXTENSIONS ============ */}
        <section className="relative overflow-hidden bg-white py-20 lg:py-28">
          <SectionHeading
            eyebrow={isZh ? '战略性扩展能力' : 'Strategic Extensions'}
            title={
              isZh ? (
                <>超越 CRM 的 <span className="gradient-text">专属能力</span></>
              ) : (
                <>Unique Additions That Go <span className="gradient-text">Beyond CRM</span></>
              )
            }
            subtitle={isZh ? '专为出口商打造的专业能力。' : 'Purpose-built for exporters.'}
          />

          <div className="container-custom">
            <div className="grid gap-5 lg:grid-cols-3">
              {extensions.map((ext, i) => (
                <Reveal key={ext.title} delay={i * 0.1} y={24} className="h-full">
                  <div className="card-lift h-full rounded-2xl border border-ink-200 bg-white p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-950 text-white">
                      <ext.icon className="h-6 w-6" />
                    </div>
                    <div className="mt-4">
                      <div className="text-xs font-medium text-ink-400">{ext.subtitle}</div>
                      <h3 className="mt-1 text-lg font-bold text-ink-950">{ext.title}</h3>
                    </div>
                    <ul className="mt-4 space-y-2.5">
                      {ext.items.map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-sm text-ink-500">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink-300" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ INDUSTRIES ============ */}
        <section className="relative overflow-hidden bg-ink-50 py-20 lg:py-28">
          <SectionHeading
            eyebrow={isZh ? '行业解决方案' : 'Industry Solutions'}
            title={
              isZh ? (
                <>为您的 <span className="gradient-text">行业</span> 专属打造</>
              ) : (
                <>Tailored for <span className="gradient-text">Your Industry</span></>
              )
            }
          />
          <div className="container-custom">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              {industries.map((ind, i) => (
                <Reveal key={ind.name} delay={i * 0.06} y={16}>
                  <Link to="/product" className="group block">
                    <div className="card-lift h-full rounded-2xl border border-ink-200 bg-white p-5">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-100 text-ink-700 transition-transform duration-300 group-hover:scale-110">
                        <ind.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-sm font-semibold text-ink-950">{ind.name}</h3>
                      <p className="mt-1 text-xs text-ink-500 leading-snug">{ind.desc}</p>
                      <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-ink-950 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:gap-2">
                        {isZh ? '查看详情' : 'Explore'}
                        <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section className="relative overflow-hidden bg-white py-20 lg:py-28">
          <div className="container-custom">
            <SectionHeading
              eyebrow={isZh ? '价格方案' : 'Pricing'}
              title={
                isZh ? (
                  <>简单透明，<span className="gradient-text">随业务扩展</span></>
                ) : (
                  <>Simple, Transparent, <span className="gradient-text">Scalable</span></>
                )
              }
              subtitle={isZh ? '所有方案均以人民币（RMB）计价，支持按年或按月付费。' : 'All plans billed in Chinese Yuan (RMB). Billed annually or monthly.'}
            />

            <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-4">
              {[
                { name: isZh ? '入门版' : 'Starter', price: '¥1,000', suffix: isZh ? '/月' : '/mo', desc: isZh ? '适合初创及小型出口商' : 'For small exporters', features: [isZh ? '3 名团队成员' : '3 Team Members', isZh ? '每月 500 条消息' : '500 Messages / mo', isZh ? '2 个邮箱 + 1 个 WhatsApp' : '2 Email + 1 WhatsApp', isZh ? '1 个店铺' : '1 Storefront', isZh ? '每月 50 次物流追踪' : '50 Shipments / mo', isZh ? '5 GB 合规单据库' : '5 GB Storage', isZh ? 'XiSync 子域名门户' : 'XiSync Subdomain', isZh ? '标准支持' : 'Standard Support'], popular: false },
                { name: isZh ? '专业版' : 'Pro', price: isZh ? '联系销售' : 'Contact Sales', desc: isZh ? '适合快速发展的出口团队' : 'For growing teams', features: [isZh ? '10 名团队成员' : '10 Team Members', isZh ? '每月 5,000 条消息' : '5,000 Messages / mo', isZh ? '5 个邮箱 + 3 个 WhatsApp + 微信' : '5 Email + 3 WhatsApp + WeChat', isZh ? '3 个店铺' : '3 Storefronts', isZh ? '每月 250 次物流追踪' : '250 Shipments / mo', isZh ? '50 GB 存储 + OCR' : '50 GB + OCR', isZh ? '自定义品牌域名' : 'Custom Branded Domain', isZh ? '专属优先客户经理' : 'Dedicated Priority Manager'], popular: true },
                { name: isZh ? '企业版' : 'Business', price: isZh ? '联系销售' : 'Contact Sales', desc: isZh ? '适合成熟的大型外贸企业' : 'For established exporters', features: [isZh ? '25 名团队成员' : '25 Team Members', isZh ? '每月 25,000 条消息' : '25,000 Messages / mo', isZh ? '所有渠道无限连接' : 'Unlimited Channels', isZh ? '所有支持的店铺' : 'All Stores', isZh ? '每月 1,000 次物流追踪' : '1,000 Shipments / mo', isZh ? '250 GB 存储 + OCR' : '250 GB + OCR', isZh ? '完整白标门户' : 'Full White-Label', isZh ? '7×24 SLA + 专属入职对接' : '24/7 SLA + Onboarding'], popular: false },
                { name: isZh ? '旗舰版' : 'Enterprise', price: isZh ? '定制报价' : 'Custom Pricing', desc: isZh ? '高 API 调用量与私有化部署' : 'High-volume & private deployments', features: [isZh ? '无限席位' : 'Unlimited Seats', isZh ? '无限消息' : 'Unlimited Messages', isZh ? '专属基础设施' : 'Dedicated Infrastructure', isZh ? '定制 ERP / 平台集成' : 'Custom ERP / Marketplace', isZh ? '高吞吐专属物流 API' : 'High-Volume Dedicated API', isZh ? '无限存储 + 自定义 AI 引擎' : 'Unlimited + Custom AI Engine', isZh ? '多品牌定制门户' : 'Multi-Brand Custom Portals', isZh ? '定制 SLA + 工程对接' : 'Custom SLA & Engineering Lead'], popular: false },
              ].map((plan, i) => (
                <Reveal key={plan.name} delay={i * 0.1} className="h-full">
                  <div className={`card-lift h-full rounded-2xl border-2 bg-white p-6 relative ${plan.popular ? 'border-xisync-blue-500 shadow-premium-md' : 'border-ink-200'}`}>
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-xisync-blue-700 via-xisync-cyan-600 to-xisync-green-500 px-3 py-1 text-xs font-semibold text-white">
                        {isZh ? '最受欢迎' : 'Most Popular'}
                      </span>
                    )}
                    <h3 className="text-base font-semibold text-ink-950">{plan.name}</h3>
                    <div className="mt-2">
                      <span className={`text-3xl font-bold ${plan.popular ? 'gradient-text' : 'text-ink-950'}`}>{plan.price}</span>
                      {plan.suffix && <span className="text-ink-500 text-sm">{plan.suffix}</span>}
                    </div>
                    <p className="mt-1 text-sm text-ink-500">{plan.desc}</p>
                    <ul className="mt-5 space-y-2">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-ink-600">
                          <Check className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link to="/pricing" className="mt-6 block">
                      <Button
                        className={`w-full rounded-full ${plan.popular ? 'text-white' : 'bg-white text-ink-950 border-2 border-ink-200 hover:bg-ink-50'}`}
                      >
                        {isZh ? '联系销售' : 'Contact Sales'}
                      </Button>
                    </Link>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-8 text-center">
              <Link to="/pricing" className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-700 hover:text-ink-950 transition-colors">
                {isZh ? '对比所有方案与详细功能' : 'Compare all plans and features'}
                <ArrowRight className="h-4 w-4 transition-transform hover:translate-x-0.5" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============ FAQ ============ */}
        <section className="relative overflow-hidden bg-ink-50 py-20 lg:py-28">
          <SectionHeading
            eyebrow={isZh ? '常见问题' : 'FAQ'}
            title={
              isZh ? (
                <>关于 <span className="gradient-text">XiSync</span>，您可能想了解的</>
              ) : (
                <>What You Might Want to Know About <span className="gradient-text">XiSync</span></>
              )
            }
          />
          <div className="container-custom">
            <div className="mx-auto grid max-w-3xl gap-3">
              {[
                { q: isZh ? 'XiSync 如何与我的阿里巴巴和 Made-in-China 店铺对接？' : 'How does XiSync connect with Alibaba and Made-in-China stores?', a: isZh ? '通过安全的 OAuth API 对接，自动将所有询盘、消息和买家数据汇聚到全渠道收件箱中。' : 'Connects via secure OAuth APIs. Aggregates all inquiries, messages, and buyer metadata into your Omnichannel Inbox.' },
                { q: isZh ? '海外客户会看到中文字符或 XiSync 品牌吗？' : 'Will overseas clients see Chinese characters or XiSync branding?', a: isZh ? '不会。客户门户和对外通信完全白标，买家可以在所选语言下、以您的品牌查看一切内容。' : 'No. Fully white-labeled. Overseas clients view everything in their selected language under your brand.' },
                { q: isZh ? 'AI 助手如何处理专业的技术产品术语？' : 'How does the AI Co-Pilot handle specialized technical product terms?', a: isZh ? '基于国际贸易语料库、HS 编码数据库和行业词汇表训练。可上传内部产品目录，训练专属词汇库。' : 'Trained on international trade corpora, HS code databases, and industry glossaries. Upload your catalog to train a private vocabulary.' },
                { q: isZh ? '我们的客户名单和报价数据安全吗？' : 'Is our customer list and quotation pricing secure?', a: isZh ? '绝对安全。采用 RBAC 权限控制、AES-256 端到端加密，租户环境严格隔离，业务员仅能访问其负责的客户。' : 'Absolutely. RBAC, AES-256 encryption, strict tenant isolation. Reps only access their assigned accounts.' },
              ].map((faq, i) => (
                <FAQItem
                  key={i}
                  q={faq.q} a={faq.a}
                  isOpen={openFaq === i}
                  onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ============ FINAL CTA ============ */}
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
      </main>

      <Footer />
    </div>
  );
}
