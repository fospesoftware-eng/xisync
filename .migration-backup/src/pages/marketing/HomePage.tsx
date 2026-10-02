import { useEffect, useMemo, useRef, type MouseEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useMotionValue, useMotionTemplate } from 'framer-motion';
import { Header } from '../../components/marketing/Header';
import { Footer } from '../../components/marketing/Footer';
import { Button } from '../../components/ui/Button';
import { ChannelIcon } from '../../components/ui/ChannelIcon';
import { Reveal } from '../../components/marketing/premium/Reveal';
import { TiltCard } from '../../components/marketing/premium/TiltCard';
import { CountUp } from '../../components/marketing/premium/CountUp';
import { Parallax } from '../../components/marketing/premium/Parallax';
import { ParticleField } from '../../components/marketing/premium/ParticleField';
import { Marquee } from '../../components/marketing/premium/Marquee';
import { useMouseParallax } from '../../components/marketing/premium/useMouseParallax';
import { useI18n } from '../../lib/i18n';
import {
  ArrowRight,
  Users,
  MessageCircle,
  Share2,
  Package,
  FileCheck,
  LayoutDashboard,
  Play,
  Globe,
  TrendingUp,
  Zap,
  Star,
  Check,
  Sparkles,
  Languages,
  ShieldCheck,
  LineChart,
  Truck,
  Building2,
  Rocket,
} from 'lucide-react';

const EASE: [number, number, number, number] = [0.21, 0.65, 0.36, 1];

/** Filmic grain overlay (inline SVG turbulence) */
const NOISE_DATA_URI = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='0.55'/></svg>")`;

function splitWords(text: string): string[] {
  return /[\u4e00-\u9fff]/.test(text) ? Array.from(text) : text.split(' ');
}

/** Word/character staggered headline reveal with a 3D pop */
function StaggerText({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) {
  const words = useMemo(() => splitWords(text), [text]);
  return (
    <motion.span
      className="inline-block"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.055, delayChildren: delay } },
      }}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className={`inline-block will-change-transform ${className}`}
          variants={{
            hidden: { opacity: 0, y: 30, rotateX: 45, filter: 'blur(8px)' },
            visible: {
              opacity: 1,
              y: 0,
              rotateX: 0,
              filter: 'blur(0px)',
              transition: { duration: 0.65, ease: EASE },
            },
          }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </motion.span>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-xisync-cyan-200 bg-xisync-cyan-50 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-xisync-cyan-700">
      <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-xisync-cyan-500 to-xisync-lime-500" />
      {children}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: string;
}) {
  return (
    <Reveal className="mx-auto mb-14 max-w-3xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-gray-600">{subtitle}</p>}
    </Reveal>
  );
}

export function HomePage() {
  const { t, language } = useI18n();
  const { scrollYProgress } = useScroll();

  const heroParallaxA = useMouseParallax(28);
  const heroParallaxB = useMouseParallax(52);
  const heroParallaxC = useMouseParallax(80);

  // cursor spotlight (radial glow that follows the mouse across the hero)
  const spotlightX = useMotionValue(50);
  const spotlightY = useMotionValue(50);
  const spotlightBg = useMotionTemplate`radial-gradient(640px circle at ${spotlightX}% ${spotlightY}%, rgba(34,211,238,0.14), rgba(59,130,246,0.06) 45%, transparent 68%)`;

  // pause the background video for users who prefer reduced motion
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      const video = heroVideoRef.current;
      if (!video) return;
      if (mq.matches) video.pause();
      else video.play().catch(() => undefined);
    };
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const stats = [
    { to: 10000, suffix: '+', label: language === 'zh' ? '活跃出口商' : 'Active Exporters' },
    { to: 50, suffix: '+', label: language === 'zh' ? '覆盖国家' : 'Countries Reached' },
    { prefix: '$', to: 2, suffix: 'B+', label: language === 'zh' ? '贸易额' : 'Trade Volume' },
    { to: 99.9, decimals: 1, suffix: '%', label: language === 'zh' ? '正常运行时间' : 'Uptime' },
  ];

  const modules = [
    {
      icon: Users,
      name: 'CRM',
      title: language === 'zh' ? '客户管理' : 'Customer Management',
      description:
        language === 'zh'
          ? '管理线索、账户、联系人和交易，全流程追踪销售管道。'
          : 'Manage leads, accounts, contacts, and deals. Track your entire sales pipeline.',
      href: '/product#crm',
      color: 'from-xisync-blue-500 to-xisync-blue-700',
      glow: 'group-hover:shadow-[0_30px_80px_-24px_rgba(59,130,246,0.55)]',
      chip: 'bg-xisync-blue-50 text-xisync-blue-700',
    },
    {
      icon: MessageCircle,
      name: 'Connect',
      title: language === 'zh' ? '全渠道消息' : 'Omnichannel Messaging',
      description:
        language === 'zh'
          ? 'WhatsApp、微信、邮件、Instagram 统一收件箱，配有 AI 实时翻译。'
          : 'WhatsApp, WeChat, Email, Instagram in one inbox with AI translation.',
      href: '/product#messaging',
      color: 'from-xisync-cyan-500 to-xisync-cyan-700',
      glow: 'group-hover:shadow-[0_30px_80px_-24px_rgba(6,182,212,0.55)]',
      chip: 'bg-xisync-cyan-50 text-xisync-cyan-700',
    },
    {
      icon: Share2,
      name: 'Social',
      title: language === 'zh' ? '社媒营销' : 'Social Media',
      description:
        language === 'zh'
          ? '定时发布、多账号管理，将社媒互动转化为业务线索。'
          : 'Schedule posts, manage accounts, and convert social engagement to leads.',
      href: '/product#social',
      color: 'from-teal-500 to-teal-700',
      glow: 'group-hover:shadow-[0_30px_80px_-24px_rgba(20,184,166,0.55)]',
      chip: 'bg-teal-50 text-teal-700',
    },
    {
      icon: Package,
      name: 'Logistics',
      title: language === 'zh' ? '物流追踪' : 'Shipment Tracking',
      description:
        language === 'zh'
          ? '从工厂到目的地全程追踪出货，支持买家实时提醒。'
          : 'Track shipments from factory to destination with customer notifications.',
      href: '/product#logistics',
      color: 'from-xisync-green-500 to-xisync-green-700',
      glow: 'group-hover:shadow-[0_30px_80px_-24px_rgba(34,197,94,0.55)]',
      chip: 'bg-xisync-green-50 text-xisync-green-700',
    },
    {
      icon: FileCheck,
      name: 'Compliance',
      title: language === 'zh' ? '合规中心' : 'Compliance Center',
      description:
        language === 'zh'
          ? '管理出口证书，追踪到期时间，满足目标国监管要求。'
          : 'Manage certificates, track expirations, meet destination requirements.',
      href: '/product#compliance',
      color: 'from-xisync-lime-500 to-xisync-lime-700',
      glow: 'group-hover:shadow-[0_30px_80px_-24px_rgba(132,204,22,0.5)]',
      chip: 'bg-xisync-lime-50 text-xisync-lime-700',
    },
    {
      icon: LayoutDashboard,
      name: 'Portal',
      title: language === 'zh' ? '买家自助门户' : 'Customer Portal',
      description:
        language === 'zh'
          ? '为海外买家提供专属门户，便捷追踪订单及文档。'
          : 'Branded self-service portal for buyers to track orders and documents.',
      href: '/product#portal',
      color: 'from-orange-500 to-orange-700',
      glow: 'group-hover:shadow-[0_30px_80px_-24px_rgba(249,115,22,0.5)]',
      chip: 'bg-orange-50 text-orange-700',
    },
  ];

  const pages = [
    {
      title: language === 'zh' ? '产品介绍' : 'Product',
      description: language === 'zh' ? '探索六大强大模块，了解协同工作原理' : 'Explore all six modules and see how they work together',
      href: '/product',
      icon: Zap,
    },
    {
      title: language === 'zh' ? '平台集成' : 'Integrations',
      description: language === 'zh' ? '无缝对接 WhatsApp, 微信, Shopify, 阿里等平台' : 'Connect WhatsApp, WeChat, Shopify, Alibaba and more',
      href: '/integrations',
      icon: Globe,
    },
    {
      title: language === 'zh' ? '价格方案' : 'Pricing',
      description: language === 'zh' ? '简单透明的定价，支持 14 天免费试用' : 'Simple, transparent pricing with a 14-day free trial',
      href: '/pricing',
      icon: TrendingUp,
    },
    {
      title: language === 'zh' ? '预约演示' : 'Book Demo',
      description: language === 'zh' ? '获取专家团队的一对一个性化演示' : 'Get a personalized walkthrough from our team',
      href: '/demo',
      icon: Play,
    },
  ];

  const testimonials = [
    {
      quote:
        language === 'zh'
          ? 'XiSync 彻底改变了我们管理海外买家的方式。仅实时翻译功能就为我们节省了无数工作时间。'
          : 'XiSync transformed how we manage international buyers. The real-time translation alone saved us countless hours.',
      author: language === 'zh' ? '张伟' : 'Zhang Wei',
      role: language === 'zh' ? '出口经理，深圳电子' : 'Export Manager, Shenzhen Electronics',
      rating: 5,
    },
    {
      quote:
        language === 'zh'
          ? '我们将买家响应时间从几天缩短到了几分钟。客户非常喜欢专用的买家门户。'
          : 'We reduced our response time from days to minutes. Our buyers love the customer portal.',
      author: language === 'zh' ? '李明' : 'Li Ming',
      role: language === 'zh' ? '总经理，杭州纺织' : 'CEO, Hangzhou Textiles',
      rating: 5,
    },
  ];

  const channels = ['WhatsApp', 'WeChat', 'Email', 'Instagram', 'Facebook', 'TikTok'];

  const heroMouseHandler = (e: MouseEvent<HTMLElement>) => {
    heroParallaxA.onMouseMove(e);
    heroParallaxB.onMouseMove(e);
    heroParallaxC.onMouseMove(e);
    const rect = e.currentTarget.getBoundingClientRect();
    spotlightX.set(((e.clientX - rect.left) / rect.width) * 100);
    spotlightY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  return (
    <div className="min-h-screen overflow-x-clip">
      {/* scroll progress bar */}
      <motion.div
        className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-gradient-to-r from-xisync-blue-500 via-xisync-cyan-400 to-xisync-lime-400"
        style={{ scaleX: scrollYProgress }}
      />

      <Header />

      <main>
        {/* ============ HERO (3D parallax, immersive dark) ============ */}
        <section
          className="relative overflow-hidden bg-slate-950 pb-24 pt-32 lg:pb-32 lg:pt-40"
          onMouseMove={heroMouseHandler}
        >
          {/* base radial wash */}
          <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_-20%,#0d2a55_0%,#020617_60%)]" />
          {/* perspective grid */}
          <div className="absolute inset-0 bg-grid-dark mask-radial-fade opacity-70" />

          {/* generated aurora video (loops seamlessly, poster fallback) */}
          <video
            ref={heroVideoRef}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-bg-poster.jpg"
            aria-hidden
            className="absolute inset-0 h-full w-full scale-[1.03] object-cover opacity-45 mix-blend-screen"
          >
            <source src="/hero-bg.mp4" type="video/mp4" />
          </video>

          {/* filmic grain */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
            style={{ backgroundImage: NOISE_DATA_URI }}
          />

          {/* floating 3D wireframe globe (mouse parallax + slow spin) */}
          <motion.div
            style={{ x: heroParallaxB.sx, y: heroParallaxB.sy }}
            className="absolute -right-20 -top-24 hidden h-72 w-72 opacity-50 lg:block"
          >
            <div className="animate-orbit-slow h-full w-full">
              <svg viewBox="0 0 200 200" fill="none" className="h-full w-full drop-shadow-[0_0_24px_rgba(34,211,238,0.35)]">
                <circle cx="100" cy="100" r="78" stroke="rgba(34,211,238,0.55)" strokeWidth="1" />
                <ellipse cx="100" cy="100" rx="78" ry="30" stroke="rgba(34,211,238,0.4)" strokeWidth="1" />
                <ellipse cx="100" cy="100" rx="30" ry="78" stroke="rgba(34,211,238,0.35)" strokeWidth="1" />
                <ellipse cx="100" cy="100" rx="78" ry="58" stroke="rgba(148,197,253,0.3)" strokeWidth="1" transform="rotate(30 100 100)" />
                <ellipse cx="100" cy="100" rx="78" ry="58" stroke="rgba(148,197,253,0.3)" strokeWidth="1" transform="rotate(-30 100 100)" />
                <line x1="22" y1="100" x2="178" y2="100" stroke="rgba(34,211,238,0.45)" strokeWidth="1" />
              </svg>
            </div>
          </motion.div>

          {/* orbit rings behind the mockup */}
          <motion.div
            style={{ x: heroParallaxC.sx, y: heroParallaxC.sy }}
            className="pointer-events-none absolute left-1/2 top-[58%] hidden h-[46rem] w-[46rem] -translate-x-1/2 -translate-y-1/2 lg:block"
          >
            <div className="animate-orbit-slow absolute inset-0 rounded-full border border-dashed border-xisync-cyan-400/15" />
            <div className="animate-spin-reverse-slow absolute inset-10 rounded-full border border-xisync-blue-400/10" />
            <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-xisync-cyan-400/60 shadow-[0_0_18px_4px_rgba(34,211,238,0.5)]" />
          </motion.div>

          {/* aurora orbs at different parallax depths (motion wrapper = mouse parallax, inner = CSS drift) */}
          <motion.div
            style={{ x: heroParallaxA.sx, y: heroParallaxA.sy }}
            className="absolute -left-32 -top-32 h-[34rem] w-[34rem]"
          >
            <div className="h-full w-full rounded-full bg-xisync-blue-600/30 blur-3xl animate-aurora" />
          </motion.div>
          <motion.div
            style={{ x: heroParallaxB.sx, y: heroParallaxB.sy }}
            className="absolute right-[-12%] top-24 h-[30rem] w-[30rem]"
          >
            <div className="h-full w-full rounded-full bg-xisync-cyan-500/25 blur-3xl animate-aurora" style={{ animationDelay: '-6s' }} />
          </motion.div>
          <motion.div
            style={{ x: heroParallaxC.sx, y: heroParallaxC.sy }}
            className="absolute bottom-[-20%] left-[35%] h-[26rem] w-[26rem]"
          >
            <div className="h-full w-full rounded-full bg-xisync-lime-500/15 blur-3xl animate-aurora" style={{ animationDelay: '-10s' }} />
          </motion.div>

          <ParticleField density={70} className="opacity-70" />

          {/* cursor spotlight */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-[5] hidden lg:block"
            style={{ background: spotlightBg }}
          />

          <div className="container-custom relative z-10">
            <div className="mx-auto max-w-4xl text-center perspective-1200">
              {/* badge */}
              <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.05, ease: EASE }}
                className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-xisync-lime-400 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-xisync-lime-400" />
                </span>
                <span className="text-sm font-medium text-white/90">
                  {language === 'zh' ? 'AI 驱动的外贸 CRM' : 'AI powered CRM'}
                </span>
                <Sparkles className="h-3.5 w-3.5 text-xisync-cyan-300" />
              </motion.div>

              {/* headline */}
              <h1 className="mt-8 text-4xl font-bold leading-[1.12] text-white sm:text-5xl lg:text-6xl">
                <StaggerText text={language === 'zh' ? '智能出口，' : 'Export Smarter,'} delay={0.2} />
                {language === 'zh' ? '' : ' '}
                <StaggerText
                  text={language === 'zh' ? '拓展全球市场' : 'Grow Globally'}
                  delay={0.45}
                  className="animate-shimmer bg-gradient-to-r from-xisync-blue-300 via-xisync-cyan-300 to-xisync-lime-300 bg-clip-text text-transparent"
                />
              </h1>

              {/* subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.75, ease: EASE }}
                className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 md:text-xl"
              >
                {t.hero.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
                className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              >
                <Link
                  to="/demo"
                  className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-white px-7 py-3.5 text-base font-semibold text-xisync-blue-900 shadow-[0_0_50px_-10px_rgba(34,211,238,0.6)] transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98]"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">{t.nav.startFreeTrial}</span>
                  <ArrowRight className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-7 py-3.5 text-base font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:border-white/40 hover:bg-white/10"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <Play className="h-3.5 w-3.5 text-white" />
                  </span>
                  {t.hero.demo}
                </Link>
              </motion.div>

              {/* trust chips */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.05 }}
                className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-400"
              >
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-xisync-cyan-400" />
                  {language === 'zh' ? '企业级安全' : 'Enterprise-grade security'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Languages className="h-4 w-4 text-xisync-cyan-400" />
                  {language === 'zh' ? '多语言支持' : 'Multi-language support'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <LineChart className="h-4 w-4 text-xisync-cyan-400" />
                  {language === 'zh' ? '智能分析' : 'Smart analytics'}
                </span>
              </motion.div>
            </div>

            {/* ===== 3D tilt dashboard mockup with layered floating chips ===== */}
            <motion.div
              initial={{ opacity: 0, y: 60, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 1.15, ease: EASE }}
              className="relative mx-auto mt-16 max-w-5xl"
            >
              {/* ambient glow */}
              <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-r from-xisync-blue-500/25 via-xisync-cyan-400/20 to-xisync-lime-400/25 blur-3xl" />

              <TiltCard maxTilt={6} glareOpacity={0.09} className="mx-auto">
                <div className="animate-gradient-x rounded-2xl bg-gradient-to-r from-xisync-blue-500/60 via-xisync-cyan-400/60 to-xisync-lime-400/60 p-[1.5px] shadow-[0_60px_140px_-40px_rgba(2,6,23,0.95)]">
                  <div className="overflow-hidden rounded-[calc(1rem-1.5px)] bg-slate-900/80 backdrop-blur-xl">
                  {/* browser chrome */}
                  <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.04] px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="h-3 w-3 rounded-full bg-red-400/90" />
                      <span className="h-3 w-3 rounded-full bg-yellow-400/90" />
                      <span className="h-3 w-3 rounded-full bg-green-400/90" />
                    </div>
                    <div className="mx-auto w-full max-w-md rounded-lg bg-white/10 px-4 py-1.5 text-center text-xs text-slate-300">
                      app.xisync.com/dashboard
                    </div>
                    <div className="w-10" />
                  </div>

                  {/* dashboard skeleton */}
                  <div className="grid grid-cols-3 gap-3 p-4 sm:gap-4 sm:p-6">
                    <div className="col-span-2 rounded-xl border border-white/10 bg-white/[0.05] p-4 sm:p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="h-3 w-24 rounded bg-white/15" />
                        <div className="h-7 w-7 rounded-lg bg-xisync-cyan-500/40" />
                      </div>
                      <div className="space-y-3">
                        <div className="h-2 w-full rounded bg-white/10" />
                        <div className="h-2 w-3/4 rounded bg-white/10" />
                        <div className="h-2 w-1/2 rounded bg-white/10" />
                      </div>
                      {/* mini chart */}
                      <div className="mt-6 flex h-16 items-end gap-1.5">
                        {[35, 55, 42, 70, 58, 85, 64, 92, 76, 100].map((h, i) => (
                          <div
                            key={i}
                            className="flex-1 rounded-t-sm bg-gradient-to-t from-xisync-blue-600/70 to-xisync-cyan-400/80"
                            style={{ height: `${h}%` }}
                          />
                        ))}
                      </div>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="h-9 w-9 rounded-lg bg-xisync-blue-500/40" />
                        <div className="flex-1">
                          <div className="mb-1.5 h-2 w-20 rounded bg-white/15" />
                          <div className="h-2 w-32 rounded bg-white/10" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                        <div className="mb-2 h-2.5 w-16 rounded bg-white/15" />
                        <div className="text-2xl font-bold text-white">$45.2K</div>
                        <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-xisync-green-500/15 px-2 py-0.5">
                          <TrendingUp className="h-3 w-3 text-xisync-green-400" />
                          <span className="text-xs font-medium text-xisync-green-400">+12%</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                        <div className="mb-2 h-2.5 w-16 rounded bg-white/15" />
                        <div className="flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-xisync-cyan-500 to-xisync-lime-400" />
                          </div>
                          <span className="text-xs font-medium text-slate-300">75%</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-white/10 bg-white/[0.05] p-4">
                        <div className="mb-2 h-2.5 w-16 rounded bg-white/15" />
                        <div className="flex h-10 items-end gap-1">
                          {[30, 45, 38, 62, 55, 80, 70, 95].map((h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t-sm bg-gradient-to-t from-xisync-lime-500/60 to-xisync-lime-400/80"
                              style={{ height: `${h}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  </div>
                </div>
              </TiltCard>

              {/* floating chips — mouse parallax (motion) + CSS float (inner) */}
              <motion.div
                style={{ x: heroParallaxB.sx, y: heroParallaxB.sy }}
                className="absolute -left-12 top-14 z-20 hidden xl:block"
              >
                <div className="animate-float glass-dark flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-xisync-cyan-500/25">
                    <Languages className="h-4 w-4 text-xisync-cyan-300" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {language === 'zh' ? 'AI 实时翻译' : 'AI Live Translation'}
                    </div>
                    <div className="text-[11px] text-slate-400">EN → 中文</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                style={{ x: heroParallaxA.sx, y: heroParallaxA.sy }}
                className="absolute -right-14 top-24 z-20 hidden xl:block"
              >
                <div className="animate-float-slow glass-dark flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl" style={{ animationDelay: '-3s' }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-xisync-green-500/25">
                    <Package className="h-4 w-4 text-xisync-green-400" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {language === 'zh' ? '货物已发货' : 'Shipment dispatched'}
                    </div>
                    <div className="text-[11px] text-slate-400">#XS-2024-0918</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                style={{ x: heroParallaxC.sx, y: heroParallaxC.sy }}
                className="absolute -bottom-8 right-16 z-20 hidden xl:block"
              >
                <div className="animate-float glass-dark flex items-center gap-3 rounded-xl px-4 py-3 shadow-2xl" style={{ animationDelay: '-6s' }}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-xisync-lime-500/25">
                    <Star className="h-4 w-4 fill-xisync-lime-400 text-xisync-lime-400" />
                  </span>
                  <div>
                    <div className="text-xs font-semibold text-white">
                      {language === 'zh' ? '新买家好评' : 'New 5★ buyer review'}
                    </div>
                    <div className="text-[11px] text-slate-400">WhatsApp</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* ===== stats (animated counters) ===== */}
            <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 md:grid-cols-4">
              {stats.map((stat, i) => (
                <Reveal key={stat.label} delay={i * 0.1} y={24}>
                  <div className="group text-center">
                    <CountUp
                      to={stat.to}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      decimals={stat.decimals}
                      className="text-3xl font-bold text-white transition-shadow duration-300 group-hover:[text-shadow:0_0_30px_rgba(34,211,238,0.6)] md:text-4xl"
                    />
                    <div className="mt-1.5 text-sm text-slate-400">{stat.label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* bottom fade into the light section */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-slate-50" />
        </section>

        {/* ============ EXPLORE XISYNC ============ */}
        <section className="relative bg-slate-50 py-20 lg:py-28">
          <div className="container-custom">
            <SectionHeading
              eyebrow={language === 'zh' ? '平台导览' : 'Platform Guide'}
              title={
                language === 'zh' ? (
                  <>
                    探索<span className="gradient-text-shimmer">犀同步</span>
                  </>
                ) : (
                  <>
                    Explore <span className="gradient-text-shimmer">XiSync</span>
                  </>
                )
              }
              subtitle={language === 'zh' ? '快速了解我们平台的不同核心板块' : 'Navigate to different sections of our platform'}
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {pages.map((page, i) => (
                <Reveal key={page.title} delay={i * 0.08} className="h-full">
                  <Link to={page.href} className="block h-full">
                    <TiltCard maxTilt={9} className="group h-full">
                      <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 group-hover:border-xisync-cyan-300/70 group-hover:shadow-[0_28px_70px_-24px_rgba(6,182,212,0.4)]">
                        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-xisync-cyan-100 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                          <page.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="relative mt-4 text-lg font-semibold text-gray-900 transition-colors group-hover:text-xisync-cyan-700">
                          {page.title}
                        </h3>
                        <p className="relative mt-1.5 text-sm text-gray-600">{page.description}</p>
                        <div className="relative mt-5 flex items-center gap-1.5 text-sm font-semibold text-xisync-cyan-600 transition-all duration-300 group-hover:gap-3">
                          {t.nav.learnMore}
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ SIX MODULES ============ */}
        <section className="relative overflow-hidden bg-white py-20 lg:py-28">
          <Parallax speed={40} className="pointer-events-none absolute -left-40 top-1/3 h-[26rem] w-[26rem] rounded-full bg-xisync-cyan-100 blur-3xl opacity-60" />
          <Parallax speed={-40} className="pointer-events-none absolute -right-40 bottom-1/4 h-[24rem] w-[24rem] rounded-full bg-xisync-lime-100 blur-3xl opacity-60" />

          <div className="container-custom relative">
            <SectionHeading
              eyebrow={language === 'zh' ? '核心能力' : 'Core Capabilities'}
              title={
                language === 'zh' ? (
                  <>
                    六大核心<span className="gradient-text-shimmer">模块</span>
                  </>
                ) : (
                  <>
                    Six Powerful <span className="gradient-text-shimmer">Modules</span>
                  </>
                )
              }
              subtitle={t.features.subtitle}
            />

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {modules.map((module, i) => (
                <Reveal key={module.name} delay={(i % 3) * 0.1} className="h-full">
                  <Link to={module.href} className="block h-full">
                    <TiltCard maxTilt={8} className="group h-full">
                      <div
                        className={`relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 ${module.glow}`}
                      >
                        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-xisync-cyan-400/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                        <div
                          className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${module.color} shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}
                        >
                          <module.icon className="h-6 w-6 text-white" />
                        </div>
                        <div
                          className={`relative mt-4 inline-block rounded-md px-2 py-0.5 text-xs font-bold ${module.chip}`}
                        >
                          {module.name}
                        </div>
                        <h3 className="relative mt-2 text-lg font-semibold text-gray-900">{module.title}</h3>
                        <p className="relative mt-1.5 text-sm text-gray-600">{module.description}</p>
                        <div className="relative mt-5 flex items-center gap-1.5 text-sm font-semibold text-xisync-cyan-600 opacity-0 transition-all duration-300 group-hover:gap-3 group-hover:opacity-100">
                          {t.nav.learnMore}
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </TiltCard>
                  </Link>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-14 text-center">
              <Link to="/product">
                <Button size="lg" icon={<ArrowRight className="h-5 w-5" />} iconPosition="right">
                  {t.nav.viewAll}
                </Button>
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============ CONNECT ALL CHANNELS ============ */}
        <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">
          <div className="absolute inset-0 bg-grid-light mask-radial-fade opacity-50" />
          <div className="container-custom relative">
            <div className="grid items-center gap-14 lg:grid-cols-2">
              <div>
                <Reveal>
                  <Eyebrow>{language === 'zh' ? '全渠道' : 'Omnichannel'}</Eyebrow>
                  <h2 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">
                    {language === 'zh' ? (
                      <>
                        连接您的所有<span className="gradient-text-shimmer">沟通渠道</span>
                      </>
                    ) : (
                      <>
                        Connect All Your <span className="gradient-text-shimmer">Channels</span>
                      </>
                    )}
                  </h2>
                </Reveal>
                <Reveal delay={0.1}>
                  <p className="mt-5 text-lg leading-relaxed text-gray-600">
                    {language === 'zh'
                      ? '在买家最习惯的渠道触达他们。WhatsApp、微信、电子邮件、Instagram、Facebook——所有对话聚合在一个收件箱中，并支持 AI 实时翻译。'
                      : 'Meet your customers where they are. WhatsApp, WeChat, Email, Instagram, Facebook — all conversations in one place with instant AI translation.'}
                  </p>
                </Reveal>
                <ul className="mt-8 space-y-3.5">
                  {(language === 'zh'
                    ? ['统一收件箱', '实时 AI 翻译', '智能回复建议', '完整对话历史记录']
                    : ['Single unified inbox', 'Real-time translation', 'Smart reply suggestions', 'Full conversation history']
                  ).map((item, i) => (
                    <Reveal key={item} delay={0.15 + i * 0.07} x={-20} y={0}>
                      <li className="group flex items-center gap-3 text-gray-700">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-xisync-green-500 to-xisync-cyan-500 shadow-sm transition-transform duration-300 group-hover:scale-110">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </span>
                        <span className="font-medium">{item}</span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
                <Reveal delay={0.45}>
                  <Link to="/integrations" className="mt-9 inline-block">
                    <Button variant="secondary" icon={<Globe className="h-4 w-4" />}>
                      {language === 'zh' ? '查看所有集成' : 'View All Integrations'}
                    </Button>
                  </Link>
                </Reveal>
              </div>

              {/* floating channel tiles */}
              <div className="relative">
                <div className="absolute -inset-10 rounded-[3rem] bg-gradient-to-br from-xisync-blue-100 via-white to-xisync-cyan-100 blur-2xl" />
                <div className="relative grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {channels.map((channel, i) => (
                    <motion.div
                      key={channel}
                      initial={{ opacity: 0, y: 28, scale: 0.92 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: '-60px' }}
                      transition={{ duration: 0.6, delay: i * 0.09, ease: EASE }}
                    >
                      <div className="animate-float h-full" style={{ animationDelay: `${(i % 3) * -2.2}s`, animationDuration: `${6 + (i % 3)}s` }}>
                        <div className="group flex h-full flex-col items-center justify-center gap-2.5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-xisync-cyan-300 hover:shadow-[0_24px_60px_-20px_rgba(6,182,212,0.45)]">
                          <span className="transition-transform duration-500 group-hover:scale-110">
                            <ChannelIcon channel={channel} size="lg" />
                          </span>
                          <span className="text-xs font-semibold text-slate-500 transition-colors group-hover:text-xisync-cyan-700">
                            {channel}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* marquee band */}
            <Reveal delay={0.1} className="mt-20">
              <Marquee duration={38} className="mask-fade-x">
                {channels.map((channel) => (
                  <span key={channel} className="mx-8 flex items-center gap-8 text-sm font-semibold uppercase tracking-[0.22em] text-slate-400">
                    {channel}
                    <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-xisync-cyan-400 to-xisync-lime-400" />
                  </span>
                ))}
              </Marquee>
            </Reveal>
          </div>
        </section>

        {/* ============ TESTIMONIALS ============ */}
        <section className="relative overflow-hidden bg-white py-20 lg:py-28">
          <Parallax speed={30} className="pointer-events-none absolute -left-32 top-10 h-96 w-96 rounded-full bg-xisync-blue-50 blur-3xl opacity-70" />
          <Parallax speed={-30} className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-xisync-cyan-50 blur-3xl opacity-70" />

          <div className="container-custom relative">
            <SectionHeading
              eyebrow={language === 'zh' ? '客户见证' : 'Customer Stories'}
              title={
                language === 'zh' ? (
                  <>
                    深受 <span className="gradient-text-shimmer">10,000+ 出口商</span>信赖
                  </>
                ) : (
                  <>
                    Trusted by <span className="gradient-text-shimmer">10,000+ Exporters</span>
                  </>
                )
              }
            />

            <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
              {testimonials.map((testimonial, i) => (
                <Reveal key={testimonial.author} delay={i * 0.15} className="h-full">
                  <TiltCard maxTilt={6} className="group h-full">
                    <div className="relative h-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-7 shadow-lg shadow-slate-200/60 transition-shadow duration-300 group-hover:shadow-[0_32px_80px_-24px_rgba(30,64,175,0.3)]">
                      <span className="absolute -right-3 -top-5 font-serif text-[7rem] leading-none text-xisync-cyan-100">"</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: testimonial.rating }).map((_, s) => (
                          <Star key={s} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]" />
                        ))}
                      </div>
                      <p className="relative mt-4 leading-relaxed text-gray-700">"{testimonial.quote}"</p>
                      <div className="mt-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 font-semibold text-white shadow-md">
                          {testimonial.author.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{testimonial.author}</div>
                          <div className="text-sm text-gray-500">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ============ PRICING ============ */}
        <section className="relative overflow-hidden bg-slate-50 py-20 lg:py-28">
          <div className="container-custom">
            <SectionHeading
              eyebrow={language === 'zh' ? '价格方案' : 'Pricing'}
              title={
                language === 'zh' ? (
                  <>
                    清晰透明的<span className="gradient-text-shimmer">价格方案</span>
                  </>
                ) : (
                  <>
                    Simple, Transparent <span className="gradient-text-shimmer">Pricing</span>
                  </>
                )
              }
              subtitle={t.pricing.subtitle}
            />

            <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3 lg:gap-6">
              {[
                {
                  name: language === 'zh' ? '基础版' : 'Starter',
                  price: '$49',
                  desc: language === 'zh' ? '适合初创及小型出口商' : 'For small exporters',
                  features: language === 'zh' ? ['3 名团队成员', '每月 500 条消息', '邮件集成'] : ['3 team members', '500 messages/mo', 'Email integration'],
                  popular: false,
                },
                {
                  name: language === 'zh' ? '专业版' : 'Pro',
                  price: '$149',
                  desc: language === 'zh' ? '适合快速发展的出口团队' : 'For growing teams',
                  features: language === 'zh'
                    ? ['10 名团队成员', '每月 5,000 条消息', '支持所有渠道', 'AI 实时翻译']
                    : ['10 team members', '5,000 messages/mo', 'All channels', 'AI translation'],
                  popular: true,
                },
                {
                  name: language === 'zh' ? '企业版' : 'Business',
                  price: '$399',
                  desc: language === 'zh' ? '适合成熟的大型外贸企业' : 'For established exporters',
                  features: language === 'zh'
                    ? ['25 名团队成员', '每月 25,000 条消息', '合规中心', 'API 接口支持']
                    : ['25 team members', '25,000 messages/mo', 'Compliance center', 'API access'],
                  popular: false,
                },
              ].map((plan, i) => (
                <Reveal key={plan.name} delay={i * 0.12} className="h-full">
                  <TiltCard maxTilt={6} className="group h-full">
                    <div
                      className={`relative flex h-full flex-col rounded-2xl p-6 ${
                        plan.popular
                          ? 'border-animated shadow-[0_36px_90px_-30px_rgba(6,182,212,0.45)]'
                          : 'border border-slate-200/80 bg-white shadow-sm transition-all duration-300 group-hover:border-xisync-cyan-300/60 group-hover:shadow-[0_28px_70px_-28px_rgba(6,182,212,0.35)]'
                      }`}
                    >
                      {plan.popular && (
                        <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg animate-pulse-glow">
                          {language === 'zh' ? '最受欢迎' : 'Most Popular'}
                        </span>
                      )}
                      <h3 className="mt-2 text-lg font-semibold text-gray-900">{plan.name}</h3>
                      <div className="mt-2">
                        <span className={`text-3xl font-bold ${plan.popular ? 'gradient-text-shimmer' : 'text-gray-900'}`}>{plan.price}</span>
                        <span className="text-gray-500">/{language === 'zh' ? '月' : 'mo'}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">{plan.desc}</p>
                      <ul className="mt-6 flex-1 space-y-2.5">
                        {plan.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2.5 text-sm text-gray-600">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-xisync-green-100">
                              <Check className="h-3 w-3 text-xisync-green-600" />
                            </span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link to="/pricing" className="mt-7 block">
                        <Button variant={plan.popular ? 'primary' : 'outline'} className="w-full">
                          {language === 'zh' ? '查看详情' : 'View Details'}
                        </Button>
                      </Link>
                    </div>
                  </TiltCard>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.2} className="mt-9 text-center">
              <Link to="/pricing" className="group inline-flex items-center gap-1.5 font-semibold text-xisync-cyan-600 transition-colors hover:text-xisync-cyan-800">
                {language === 'zh' ? '对比所有方案和详细功能' : 'Compare all plans and features'}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ============ CTA ============ */}
        <section className="relative overflow-hidden bg-gradient-to-br from-xisync-blue-950 via-xisync-blue-900 to-xisync-cyan-950 py-24 lg:py-32">
          {/* background fx */}
          <div className="absolute inset-0 bg-[radial-gradient(100%_100%_at_50%_0%,rgba(6,182,212,0.18)_0%,transparent_55%)]" />
          <motion.div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-xisync-cyan-500/20 blur-3xl animate-aurora" />
          <motion.div className="absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-xisync-blue-500/25 blur-3xl animate-aurora" style={{ animationDelay: '-8s' }} />
          <ParticleField density={50} />

          <div className="container-custom relative z-10">
            <Parallax speed={26}>
              <div className="mx-auto max-w-3xl text-center">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-xisync-cyan-200 backdrop-blur-md">
                    <Rocket className="h-3.5 w-3.5" />
                    {language === 'zh' ? '立即开始' : 'Get Started'}
                  </div>
                  <h2 className="mt-6 text-3xl font-bold text-white md:text-4xl">
                    {language === 'zh' ? '准备好拓展您的全球业务了吗？' : 'Ready to Grow Your Global Business?'}
                  </h2>
                  <p className="mx-auto mt-5 max-w-2xl text-lg text-xisync-blue-100">
                    {language === 'zh'
                      ? '加入成千上万精简运营、提升海外销售额的优秀出口企业。'
                      : 'Join thousands of exporters who are streamlining operations and growing sales.'}
                  </p>
                </Reveal>

                <Reveal delay={0.15} className="mt-10">
                  <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                      to="/demo"
                      className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl bg-white px-8 py-4 text-base font-semibold text-xisync-blue-900 shadow-[0_0_60px_-10px_rgba(34,211,238,0.7)] transition-transform duration-300 hover:scale-[1.04] active:scale-[0.98]"
                    >
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                      <span className="relative">{t.nav.startFreeTrial}</span>
                      <ArrowRight className="relative h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-md transition-colors duration-300 hover:border-white/45 hover:bg-white/10"
                    >
                      {t.hero.demo}
                    </Link>
                  </div>
                </Reveal>

                <Reveal delay={0.25} className="mt-10">
                  <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-xisync-blue-200/90">
                    <span className="inline-flex items-center gap-2">
                      <Truck className="h-4 w-4 text-xisync-cyan-300" />
                      {language === 'zh' ? '全球物流追踪' : 'Global logistics tracking'}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-xisync-cyan-300" />
                      {language === 'zh' ? '服务 10,000+ 出口企业' : 'Trusted by 10,000+ exporters'}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-xisync-cyan-300" />
                      {language === 'zh' ? '14 天免费试用' : '14-day free trial'}
                    </span>
                  </div>
                </Reveal>
              </div>
            </Parallax>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
