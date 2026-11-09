import { useState } from 'react';
import {
  Upload,
  Download,
  Activity,
  ExternalLink,
  RefreshCw,
  ArrowLeftRight,
  Inbox,
  ShieldAlert,
  PackageCheck,
  X,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
  ChannelLogo,
  ChannelName,
  ConnectionStatusPill,
  ListingStatePill,
  SyncRunStatusPill,
  StatCard,
  SectionCard,
  PageHeader,
  EmptyHint,
  timeAgo,
  int,
} from '../../../components/marketplace/marketplaceUi';
import { MarketplaceSyncService } from '../../../lib/services/marketplace/marketplaceSyncService';
import type {
  ChannelConnection,
  MarketplaceChannelType,
  MarketplaceSyncSummary,
} from '../../../types/marketplace';

interface HubSnapshot {
  summary: MarketplaceSyncSummary;
  connections: ChannelConnection[];
  recentRuns: ReturnType<typeof MarketplaceSyncService.getSyncRuns>;
  queuePending: number;
}

const capture = (): HubSnapshot => ({
  summary: MarketplaceSyncService.getSummary(),
  connections: MarketplaceSyncService.getConnections(),
  recentRuns: MarketplaceSyncService.getSyncRuns().slice(0, 3),
  queuePending: MarketplaceSyncService.getImportQueue().filter((c) => c.decision === 'PENDING').length,
});

export function MarketplaceHubPage() {
  const [snap, setSnap] = useState<HubSnapshot>(capture);
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = () => setSnap(capture());

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 8000);
  };

  const runSync = async (
    channel: MarketplaceChannelType,
    direction: 'EXPORT' | 'IMPORT',
    mode: 'FULL' | 'INCREMENTAL' | 'SINGLE_SKU',
    label: string
  ) => {
    const key = `${channel}:${direction}:${mode}`;
    setBusyKey(key);
    try {
      const run = await MarketplaceSyncService.runSync({ channel, direction, mode });
      refresh();
      notify(`[${label}] ${run.status} — ${run.message}`);
    } catch (err) {
      notify(`Sync failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusyKey(null);
    }
  };

  const healthCheck = async (channel: MarketplaceChannelType, label: string) => {
    setBusyKey(`${channel}:health`);
    try {
      const conn = await MarketplaceSyncService.healthCheckChannel(channel);
      refresh();
      notify(`[${label}] ${conn.apiHealth} — credentials OK, API reachable.`);
    } catch (err) {
      notify(`Health check failed: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setBusyKey(null);
    }
  };

  const exportBoth = async () => {
    setBusyKey('both:export:FULL');
    try {
      const a = await MarketplaceSyncService.runSync({
        channel: 'ALIBABA',
        direction: 'EXPORT',
        mode: 'FULL',
      });
      const m = await MarketplaceSyncService.runSync({
        channel: 'MADE_IN_CHINA',
        direction: 'EXPORT',
        mode: 'FULL',
      });
      refresh();
      notify(`Export complete — Alibaba: ${a.status} (${a.itemsUpdated} updated) · MIC: ${m.status} (${m.itemsUpdated} updated).`);
    } finally {
      setBusyKey(null);
    }
  };

  const { summary, connections, recentRuns, queuePending } = snap;
  const totals = summary.totals;

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <PageHeader
        title="B2B Marketplace Publishing & Catalog Sync"
        subtitle="Publish and reconcile your XiSync inventory across Alibaba.com (国际站) and Made-in-China.com — one catalog, two storefronts."
        actions={
          <Button
            icon={<ArrowLeftRight className="w-4 h-4" />}
            loading={busyKey === 'both:export:FULL'}
            onClick={exportBoth}
          >
            Export catalog to both channels
          </Button>
        }
      />

      {toast && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-lg">
          <span className="truncate">{toast}</span>
          <button onClick={() => setToast(null)} className="p-1 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI deck */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard
          label="Live Listings"
          value={String(totals.liveListings)}
          tone="text-emerald-600 dark:text-emerald-400"
          sub="Sellable on both channels"
          icon={<PackageCheck className="w-4 h-4 text-emerald-500" />}
        />
        <StatCard
          label="SKUs Synced (≥1 ch.)"
          value={String(totals.syncedSkus)}
          sub={`of ${totals.activeCatalogSkus} active catalog SKUs`}
          icon={<Activity className="w-4 h-4 text-sky-500" />}
        />
        <StatCard
          label="Pending Review"
          value={String(totals.pendingReview)}
          sub="Waiting platform moderation"
          icon={<RefreshCw className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          label="Sync Issues"
          value={String(totals.syncIssues)}
          tone={totals.syncIssues > 0 ? 'text-red-600 dark:text-red-400' : undefined}
          sub="Rejected / paused / errors"
          icon={<ShieldAlert className="w-4 h-4 text-red-500" />}
        />
        <StatCard
          label="Import Queue"
          value={String(queuePending)}
          tone={queuePending > 0 ? 'text-blue-600 dark:text-blue-400' : undefined}
          sub="Listings pulled from channels"
          icon={<Inbox className="w-4 h-4 text-blue-500" />}
        />
      </div>

      {/* Channel connections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {connections.map((conn) => {
          const busyExport = busyKey === `${conn.channel}:EXPORT:FULL`;
          const busyImport = busyKey === `${conn.channel}:IMPORT:INCREMENTAL`;
          const busyHealth = busyKey === `${conn.channel}:health`;
          return (
            <SectionCard
              key={conn.channel}
              title={
                <div className="flex items-center gap-3">
                  <ChannelLogo channel={conn.channel} />
                  <div>
                    <div className="font-extrabold text-sm">{conn.membershipLabel}</div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      Member: {conn.memberId}
                    </div>
                  </div>
                </div>
              }
              actions={<ConnectionStatusPill status={conn.status} />}
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <ChannelName channel={conn.channel} showDomain={false} />
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600">
                  {conn.membershipLabel}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600">
                  {conn.integrationMode.replace('_', ' ')}
                </span>
                <a
                  href={conn.storefrontUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400 hover:underline"
                >
                  View storefront <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800 rounded-xl p-3 mb-4">
                <span className="font-extrabold uppercase tracking-wide text-[10px] text-slate-400 dark:text-slate-500 block mb-1">
                  API access model (verified)
                </span>
                {conn.apiAccessNote}
              </p>

              {/* API quota usage */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  <span>API calls today</span>
                  <span>
                    {int(conn.apiCallsToday)} / {int(conn.apiQuotaPerDay)}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-xisync-cyan-500 to-xisync-blue-600"
                    style={{ width: `${Math.min(100, (conn.apiCallsToday / conn.apiQuotaPerDay) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Per-channel status counts */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
                  <div className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                    {summary.rows.find((r) => r.channel === conn.channel)?.liveListings ?? 0}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">LIVE</div>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
                  <div className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                    {summary.rows.find((r) => r.channel === conn.channel)?.pendingReview ?? 0}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">PENDING REVIEW</div>
                </div>
                <div className="rounded-xl border border-slate-100 dark:border-slate-800 p-3">
                  <div className="text-lg font-extrabold text-slate-600 dark:text-slate-300">
                    {summary.rows.find((r) => r.channel === conn.channel)?.notSyncedSkus ?? 0}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500">NOT SYNCED</div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  icon={<RefreshCw className="w-3.5 h-3.5" />}
                  loading={busyHealth}
                  onClick={() => healthCheck(conn.channel, conn.membershipLabel)}
                >
                  Health check
                </Button>
                <Button
                  size="sm"
                  icon={<Upload className="w-3.5 h-3.5" />}
                  loading={busyExport}
                  onClick={() => runSync(conn.channel, 'EXPORT', 'FULL', conn.membershipLabel)}
                >
                  Full export to channel
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Download className="w-3.5 h-3.5" />}
                  loading={busyImport}
                  onClick={() => runSync(conn.channel, 'IMPORT', 'INCREMENTAL', conn.membershipLabel)}
                >
                  Import listings
                </Button>
                <span className="ml-auto text-[11px] font-bold text-slate-400 dark:text-slate-500">
                  Last sync {timeAgo(conn.lastSyncAt)}
                </span>
              </div>
            </SectionCard>
          );
        })}
      </div>

      {/* Verified API-access notes */}
      <SectionCard
        title="How catalog sync reaches each channel (verified research)"
        subtitle="Official findings — see the briefing files in the repo root for full citations."
      >
        <ul className="space-y-3 text-xs">
          <li className="flex gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-3">
            <ChannelLogo channel="ALIBABA" className="w-7 h-7 text-[10px]" />
            <div className="space-y-1">
              <div className="font-extrabold text-slate-900 dark:text-white">Alibaba.com (阿里国际站) — official ICBU Open Platform API exists</div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Product APIs (schema-based publish/update, category, photobank images, inventory, on/off shelf) are real and maintained.
                Sellers reach them through a certified ISV/ERP app: subscribe on{' '}
                <a className="font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400" href="https://fuwu.alibaba.com" target="_blank" rel="noreferrer">fuwu.alibaba.com (外贸服务市场)</a>{' '}
                and authorize with your alibaba.com login (OAuth2.0). XiSync would integrate as that partner app. Details in{' '}
                <code className="text-[10px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800">alibaba-international-station-api-briefing.md</code>.
              </p>
            </div>
          </li>
          <li className="flex gap-3 rounded-xl border border-slate-100 dark:border-slate-800 p-3">
            <ChannelLogo channel="MADE_IN_CHINA" className="w-7 h-7 text-[10px]" />
            <div className="space-y-1">
              <div className="font-extrabold text-slate-900 dark:text-white">Made-in-China.com — NO official seller catalog API today</div>
              <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                Verified: all open-platform hostnames fail DNS and docs describe UI-only product ops. The sanctioned bulk tool is the
                Excel-template import in the supplier console (外贸e家 / Virtual Office); scraping is prohibited. Until Focus ships an API,
                XiSync's MIC export path is the official bulk template mapping — see{' '}
                <a className="font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400" href="https://service.made-in-china.com" target="_blank" rel="noreferrer">service.made-in-china.com</a>.
              </p>
            </div>
          </li>
        </ul>
      </SectionCard>

      {/* Recent runs */}
      <SectionCard
        title="Recent sync activity"
        subtitle="Latest export/import runs across both channels"
        actions={
          <a
            href="/dashboard/marketplaces/history"
            className="inline-flex items-center gap-1 text-xs font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400 hover:underline"
          >
            View full history <ArrowRight className="w-3.5 h-3.5" />
          </a>
        }
      >
        {recentRuns.length === 0 ? (
          <EmptyHint>No sync activity yet — run your first export above.</EmptyHint>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentRuns.map((run) => (
              <li key={run.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex flex-wrap items-center gap-3">
                  <ChannelLogo channel={run.channel} className="w-7 h-7 text-[10px]" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold text-slate-900 dark:text-white truncate">
                      {run.direction === 'EXPORT' ? 'Export to' : 'Import from'} {run.channel === 'ALIBABA' ? 'Alibaba.com' : 'Made-in-China.com'}{' '}
                      · {run.mode.toLowerCase()}
                    </div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                      {run.message} · {timeAgo(run.startedAt)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    <span>{run.itemsProcessed} items</span>
                  </div>
                  <SyncRunStatusPill status={run.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </SectionCard>

      {/* Tiny legend so demo state is self explanatory */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-slate-400 dark:text-slate-500">
        <span className="font-bold">Listing states:</span>
        <ListingStatePill state="LIVE" />
        <ListingStatePill state="PENDING_REVIEW" />
        <ListingStatePill state="PAUSED" />
        <ListingStatePill state="REJECTED" />
        <ListingStatePill state="NOT_SYNCED" />
      </div>
    </div>
  );
}
