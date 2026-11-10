import { type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, useId } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  FileCheck2,
  LayoutDashboard,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Ship,
  Sparkles,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { getTradeCopy } from '../../lib/i18n/tradeCopy';
import { tradeProvider } from '../../lib/services/tradeIntelligence/provider';

export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(' ');
}

interface TradeShellProps {
  active: 'overview' | 'credit' | 'shipping' | 'matching' | 'analytics' | 'toolkit';
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
}

const TABS: { key: TradeShellProps['active']; icon: LucideIcon; path: string }[] = [
  { key: 'overview', icon: LayoutDashboard, path: '' },
  { key: 'credit', icon: ShieldCheck, path: '/credit' },
  { key: 'shipping', icon: Ship, path: '/shipping' },
  { key: 'matching', icon: Users, path: '/matching' },
  { key: 'analytics', icon: BarChart3, path: '/analytics' },
  { key: 'toolkit', icon: FileCheck2, path: '/toolkit' },
];

export function TradeShell({ active, eyebrow, title, subtitle, children }: TradeShellProps) {
  const { language } = useI18n();
  const copy = getTradeCopy(language);
  const location = useLocation();
  const base = location.pathname.startsWith('/dashboard/ultra')
    ? '/dashboard/ultra/trade-intelligence'
    : '/dashboard/trade-intelligence';

  return (
    <div className="relative space-y-6 pb-16">
      <div className="pointer-events-none absolute inset-x-0 -top-24 -z-10 h-[520px] overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(37,99,235,0.22),transparent)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(34,211,238,0.18),transparent)]" />
        <div className="absolute right-0 top-24 h-[300px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgba(132,204,22,0.16),transparent)] blur-3xl" />
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-indigo-50/80 to-cyan-50/60 shadow-[0_30px_80px_-50px_rgba(30,58,138,0.55)] dark:border-white/10 dark:from-slate-950 dark:via-indigo-950/70 dark:to-slate-900">
        <div className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(30,58,138,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(30,58,138,0.08)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)] dark:opacity-30" />
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-xisync-cyan-400/30 to-xisync-lime-400/10 blur-2xl" />
        <div className="relative px-5 py-6 sm:px-7 lg:px-9 lg:py-8">
          <Link
            to={base}
            className="group inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 transition hover:text-xisync-blue-800 dark:text-slate-400 dark:hover:text-cyan-300"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            {copy.nav.group}
          </Link>

          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-xisync-cyan-500/20 bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-xisync-blue-800 shadow-sm backdrop-blur dark:border-cyan-300/20 dark:bg-white/5 dark:text-cyan-200">
                <Sparkles className="h-3.5 w-3.5 text-xisync-cyan-600 dark:text-cyan-300" />
                {eyebrow}
              </div>
              <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-[34px] dark:text-white">
                {title}
              </h1>
              <p className="mt-2.5 max-w-xl text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                {subtitle}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-50/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-700 backdrop-blur dark:border-emerald-400/25 dark:bg-emerald-400/10 dark:text-emerald-300">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </span>
                {copy.overview.live}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/70 px-3 py-1.5 text-[10px] font-semibold text-slate-600 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <Sparkles className="h-3 w-3 text-xisync-cyan-600 dark:text-cyan-300" />
                {tradeProvider.mode === 'remote' ? copy.common.modelRemote : copy.common.modelHeuristic}
              </span>
            </div>
          </div>
        </div>

        <div className="relative border-t border-slate-200/60 bg-white/50 px-3 py-2 backdrop-blur-xl dark:border-white/5 dark:bg-slate-950/40">
          <nav className="flex gap-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => {
              const isActive = tab.key === active;
              const Icon = tab.icon;
              return (
                <Link
                  key={tab.key}
                  to={`${base}${tab.path}`}
                  className={cx(
                    'relative flex shrink-0 items-center gap-2 rounded-xl px-3.5 py-2 text-[11px] font-bold transition-colors',
                    isActive
                      ? 'text-white'
                      : 'text-slate-600 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="trade-tab-active"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-xisync-blue-900 via-xisync-blue-700 to-xisync-cyan-600 shadow-[0_10px_24px_-14px_rgba(30,58,138,0.9)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <Icon className="relative h-3.5 w-3.5" />
                  <span className="relative">{copy.nav[tab.key]}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </section>

      {children}
    </div>
  );
}

export function GlassCard({
  children,
  className,
  accent = true,
}: {
  children: ReactNode;
  className?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/85 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.45)] backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-slate-900/65',
        className,
      )}
    >
      {accent && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-xisync-cyan-500/60 to-transparent" />
      )}
      {children}
    </div>
  );
}

export function SectionHeading({
  title,
  hint,
  icon: Icon,
  action,
  className,
}: {
  title: string;
  hint?: string;
  icon?: LucideIcon;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cx('flex items-start justify-between gap-3', className)}>
      <div className="flex items-start gap-2.5">
        {Icon && (
          <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-xisync-blue-900/10 to-xisync-cyan-500/10 text-xisync-blue-800 ring-1 ring-inset ring-xisync-blue-900/10 dark:from-cyan-400/15 dark:to-lime-400/10 dark:text-cyan-300 dark:ring-white/10">
            <Icon className="h-3.5 w-3.5" />
          </span>
        )}
        <div>
          <h2 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h2>
          {hint && <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{hint}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

type Tone = 'indigo' | 'cyan' | 'lime' | 'amber' | 'rose' | 'emerald' | 'slate';

const TONE_CLASS: Record<Tone, string> = {
  indigo: 'border-xisync-blue-900/15 bg-xisync-blue-900/10 text-xisync-blue-900 dark:border-blue-400/25 dark:bg-blue-400/10 dark:text-blue-200',
  cyan: 'border-xisync-cyan-600/20 bg-xisync-cyan-500/10 text-xisync-cyan-800 dark:border-cyan-400/25 dark:bg-cyan-400/10 dark:text-cyan-200',
  lime: 'border-xisync-lime-600/20 bg-xisync-lime-500/10 text-xisync-lime-800 dark:border-lime-400/25 dark:bg-lime-400/10 dark:text-lime-200',
  amber: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200',
  rose: 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200',
  emerald: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200',
  slate: 'border-slate-300/70 bg-slate-100/80 text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
};

export function Pill({ tone = 'slate', children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={cx(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide',
        TONE_CLASS[tone],
      )}
    >
      {children}
    </span>
  );
}

export function StatTile({
  label,
  value,
  sub,
  icon: Icon,
  tone = 'indigo',
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: LucideIcon;
  tone?: Tone;
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {label}
          </p>
          <p className="mt-2 text-xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</p>
          {sub && <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{sub}</p>}
        </div>
        {Icon && (
          <span
            className={cx(
              'flex h-9 w-9 items-center justify-center rounded-xl border',
              TONE_CLASS[tone],
            )}
          >
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>
    </GlassCard>
  );
}

export function ScoreRing({
  score,
  size = 148,
  verdict,
  caption,
}: {
  score: number;
  size?: number;
  verdict: 'good' | 'watch' | 'risk';
  caption?: string;
}) {
  const gradientId = useId();
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;
  const colors =
    verdict === 'good'
      ? ['#22c55e', '#84cc16']
      : verdict === 'watch'
        ? ['#f59e0b', '#facc15']
        : ['#ef4444', '#fb7185'];

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="100%" stopColor={colors[1]} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className="stroke-slate-200/80 dark:stroke-white/10"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">{score}</span>
        {caption && (
          <span className="mt-0.5 max-w-[100px] text-center text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
            {caption}
          </span>
        )}
      </div>
    </div>
  );
}

export function Meter({
  value,
  tone = 'cyan',
  height = 'h-1.5',
}: {
  value: number;
  tone?: Tone;
  height?: string;
}) {
  const gradient =
    tone === 'rose'
      ? 'from-rose-500 to-rose-400'
      : tone === 'amber'
        ? 'from-amber-500 to-yellow-400'
        : tone === 'emerald' || tone === 'lime'
          ? 'from-emerald-500 to-lime-400'
          : 'from-xisync-blue-700 via-xisync-cyan-500 to-xisync-lime-400';
  return (
    <div className={cx('w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-white/10', height)}>
      <motion.div
        className={cx('h-full rounded-full bg-gradient-to-r', gradient)}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cx('block', className)}>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
        {label}
      </span>
      {children}
      {hint && <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={cx(
        'w-full rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2.5 text-xs font-medium text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-xisync-cyan-500 focus:ring-2 focus:ring-xisync-cyan-500/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white dark:placeholder:text-slate-500',
        props.className,
      )}
    />
  );
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={cx(
        'w-full appearance-none rounded-xl border border-slate-200 bg-white/90 px-3.5 py-2.5 text-xs font-medium text-slate-900 shadow-sm outline-none transition focus:border-xisync-cyan-500 focus:ring-2 focus:ring-xisync-cyan-500/25 dark:border-slate-700 dark:bg-slate-800/80 dark:text-white',
        props.className,
      )}
    />
  );
}

export function PrimaryButton({
  children,
  onClick,
  type = 'button',
  disabled,
  loading,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cx(
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-xisync-blue-900 via-xisync-blue-700 to-xisync-cyan-600 px-4 py-2.5 text-[11px] font-bold text-white shadow-[0_14px_30px_-16px_rgba(30,58,138,0.9)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
      <span className="relative">{children}</span>
    </button>
  );
}

export function GhostButton({
  children,
  onClick,
  className,
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        'inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white/80 px-3 py-2 text-[11px] font-bold text-slate-600 transition hover:border-slate-300 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:text-white',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/70 px-3.5 py-2.5 text-left transition hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800/60"
    >
      <span>
        <span className="block text-[11px] font-bold text-slate-700 dark:text-slate-200">{label}</span>
        {hint && <span className="mt-0.5 block text-[10px] text-slate-500 dark:text-slate-400">{hint}</span>}
      </span>
      <span
        className={cx(
          'relative h-5 w-9 shrink-0 rounded-full transition-colors',
          checked ? 'bg-gradient-to-r from-xisync-cyan-500 to-xisync-lime-500' : 'bg-slate-300 dark:bg-slate-600',
        )}
      >
        <span
          className={cx(
            'absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all',
            checked ? 'left-[18px]' : 'left-0.5',
          )}
        />
      </span>
    </button>
  );
}

export function StatePanel({
  kind,
  title,
  message,
  onRetry,
  retryLabel,
  icon: Icon = AlertTriangle,
  children,
}: {
  kind: 'loading' | 'empty' | 'error';
  title: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  icon?: LucideIcon;
  children?: ReactNode;
}) {
  if (kind === 'loading') {
    return (
      <div className="space-y-3 p-5" aria-busy="true">
        <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          {title}
        </div>
        <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-200/80 dark:bg-white/10" />
        <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-200/60 dark:bg-white/5" />
        <div className="h-24 w-full animate-pulse rounded-xl bg-slate-100/80 dark:bg-white/5" />
      </div>
    );
  }
  const isError = kind === 'error';
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-10 text-center">
      <span
        className={cx(
          'flex h-11 w-11 items-center justify-center rounded-2xl border',
          isError ? TONE_CLASS.rose : TONE_CLASS.slate,
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-sm font-extrabold text-slate-900 dark:text-white">{title}</p>
        {message && <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{message}</p>}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-bold text-slate-700 transition hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
        >
          <RefreshCw className="h-3 w-3" />
          {retryLabel}
        </button>
      )}
      {children}
    </div>
  );
}

export function StepBadge({ index, done }: { index: number; done?: boolean }) {
  return (
    <span
      className={cx(
        'flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-extrabold ring-1',
        done
          ? 'bg-emerald-500/15 text-emerald-600 ring-emerald-500/30 dark:text-emerald-300'
          : 'bg-xisync-blue-900/10 text-xisync-blue-800 ring-xisync-blue-900/15 dark:bg-cyan-400/10 dark:text-cyan-200 dark:ring-cyan-300/20',
      )}
    >
      {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : index}
    </span>
  );
}
