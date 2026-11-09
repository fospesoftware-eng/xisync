// ====================================================================================
// Shared marketplace UI kit: channel metadata, status pills, formatting helpers.
// ====================================================================================

import type { ReactNode } from 'react';
import {
  CheckCircle2,
  Circle,
  Loader2,
  MinusCircle,
  PauseCircle,
  RefreshCw,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import type {
  ChannelConnectionStatus,
  ListingSyncState,
  MarketplaceChannelType,
} from '../../types/marketplace';

export interface ChannelMeta {
  channel: MarketplaceChannelType;
  label: string;
  domain: { en: string; zh: string };
  initials: string;
  logoBg: string; // literal tailwind gradient classes
  accentText: string;
  accentChip: string;
}

export const CHANNEL_META: Record<MarketplaceChannelType, ChannelMeta> = {
  ALIBABA: {
    channel: 'ALIBABA',
    label: 'Alibaba.com',
    domain: { en: 'International Station', zh: '阿里国际站' },
    initials: 'Ali',
    logoBg: 'bg-gradient-to-br from-orange-500 to-amber-400',
    accentText: 'text-orange-600 dark:text-orange-400',
    accentChip: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/30',
  },
  MADE_IN_CHINA: {
    channel: 'MADE_IN_CHINA',
    label: 'Made-in-China.com',
    domain: { en: 'MIC', zh: '中国制造网' },
    initials: 'MIC',
    logoBg: 'bg-gradient-to-br from-sky-500 to-blue-600',
    accentText: 'text-sky-600 dark:text-sky-400',
    accentChip: 'bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30',
  },
};

export function channelMeta(channel: MarketplaceChannelType): ChannelMeta {
  return CHANNEL_META[channel];
}

// ------------------------------ formatting ------------------------------

export function usd(value: number | null | undefined): string {
  if (value === null || value === undefined) return '—';
  return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function int(value: number): string {
  return value.toLocaleString('en-US');
}

export function timeAgo(iso: string | null | undefined, isZh = false): string {
  if (!iso) return '—';
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 0) return isZh ? '刚刚' : 'now';
  const mins = Math.floor(diffMs / 60_000);
  if (mins < 1) return isZh ? '刚刚' : 'just now';
  if (mins < 60) return isZh ? `${mins} 分钟前` : `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return isZh ? `${hours} 小时前` : `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return isZh ? `${days} 天前` : `${days}d ago`;
}

// ------------------------------ pills ------------------------------

const LISTING_STATE_STYLES: Record<ListingSyncState, { label: { en: string; zh: string }; cls: string }> = {
  NOT_SYNCED: { label: { en: 'Not synced', zh: '未同步' }, cls: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600' },
  SYNCING: { label: { en: 'Syncing…', zh: '同步中…' }, cls: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/40' },
  LIVE: { label: { en: 'Live', zh: '已上线' }, cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40' },
  PENDING_REVIEW: { label: { en: 'Pending review', zh: '待审核' }, cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/40' },
  REJECTED: { label: { en: 'Rejected', zh: '已拒绝' }, cls: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/40' },
  PAUSED: { label: { en: 'Paused', zh: '已暂停' }, cls: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-500/40' },
  ERROR: { label: { en: 'Sync error', zh: '同步异常' }, cls: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/40' },
};

export function ListingStatePill({ state }: { state: ListingSyncState }) {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const s = LISTING_STATE_STYLES[state];
  const Icon =
    state === 'LIVE' ? CheckCircle2 :
    state === 'REJECTED' || state === 'ERROR' ? XCircle :
    state === 'PAUSED' ? PauseCircle :
    state === 'PENDING_REVIEW' ? RefreshCw :
    state === 'SYNCING' ? Loader2 :
    state === 'NOT_SYNCED' ? MinusCircle : Circle;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${s.cls}`}>
      <Icon className="w-3 h-3" />
      {isZh ? s.label.zh : s.label.en}
    </span>
  );
}

const CONNECTION_STYLES: Record<ChannelConnectionStatus, { label: { en: string; zh: string }; cls: string; dot: string }> = {
  CONNECTED: { label: { en: 'Connected', zh: '已连接' }, cls: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  NEEDS_REAUTH: { label: { en: 'Needs re-auth', zh: '需重新授权' }, cls: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  RATE_LIMITED: { label: { en: 'Rate limited', zh: '已限流' }, cls: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
  ERROR: { label: { en: 'Error', zh: '异常' }, cls: 'text-red-700 dark:text-red-300', dot: 'bg-red-500' },
  DISCONNECTED: { label: { en: 'Disconnected', zh: '未连接' }, cls: 'text-slate-500 dark:text-slate-400', dot: 'bg-slate-400' },
};

export function ConnectionStatusPill({ status }: { status: ChannelConnectionStatus }) {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const s = CONNECTION_STYLES[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${s.cls}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot} ${status === 'CONNECTED' ? 'animate-pulse' : ''}`} />
      {isZh ? s.label.zh : s.label.en}
    </span>
  );
}

const RUN_STATUS_STYLES: Record<'RUNNING' | 'SUCCESS' | 'PARTIAL' | 'FAILED', string> = {
  RUNNING: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/40',
  SUCCESS: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40',
  PARTIAL: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/40',
  FAILED: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/40',
};

const RUN_STATUS_LABELS: Record<'RUNNING' | 'SUCCESS' | 'PARTIAL' | 'FAILED', { en: string; zh: string }> = {
  RUNNING: { en: 'Running', zh: '运行中' },
  SUCCESS: { en: 'Success', zh: '成功' },
  PARTIAL: { en: 'Partial', zh: '部分成功' },
  FAILED: { en: 'Failed', zh: '失败' },
};

export function SyncRunStatusPill({ status }: { status: 'RUNNING' | 'SUCCESS' | 'PARTIAL' | 'FAILED' }) {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const label = RUN_STATUS_LABELS[status];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${RUN_STATUS_STYLES[status]}`}>
      {status === 'RUNNING' && <Loader2 className="w-3 h-3 animate-spin" />}
      {status === 'SUCCESS' && <CheckCircle2 className="w-3 h-3" />}
      {status === 'FAILED' && <XCircle className="w-3 h-3" />}
      {status === 'PARTIAL' && <ShieldAlert className="w-3 h-3" />}
      {isZh ? label.zh : label.en}
    </span>
  );
}

// ------------------------------ channel brand ------------------------------

export function ChannelLogo({ channel, className = 'w-8 h-8 text-[11px]' }: { channel: MarketplaceChannelType; className?: string }) {
  const meta = channelMeta(channel);
  return (
    <div className={`${className} rounded-xl ${meta.logoBg} flex items-center justify-center text-white font-extrabold shrink-0`}>
      {meta.initials}
    </div>
  );
}

export function ChannelName({ channel, showDomain = true }: { channel: MarketplaceChannelType; showDomain?: boolean }) {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const meta = channelMeta(channel);
  return (
    <div>
      <div className="font-extrabold text-sm text-slate-900 dark:text-white">{meta.label}</div>
      {showDomain && <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{isZh ? meta.domain.zh : meta.domain.en}</div>}
    </div>
  );
}

// ------------------------------ layout atoms ------------------------------

export function StatCard({
  label,
  value,
  sub,
  tone = 'text-slate-900 dark:text-white',
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{label}</div>
        {icon}
      </div>
      <div className={`text-2xl font-extrabold mt-1 ${tone}`}>{value}</div>
      {sub && <div className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{sub}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  subtitle,
  actions,
  children,
  className = '',
}: {
  title: ReactNode;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white">{title}</h3>
          {subtitle && <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-300 mt-1">{subtitle}</p>
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}

export function EmptyHint({ children }: { children: ReactNode }) {
  return (
    <div className="text-center py-10 text-xs font-medium text-slate-400 dark:text-slate-500">{children}</div>
  );
}
