import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
  ChannelLogo,
  SyncRunStatusPill,
  PageHeader,
  SectionCard,
  EmptyHint,
  timeAgo,
  int,
} from '../../../components/marketplace/marketplaceUi';
import { MarketplaceSyncService } from '../../../lib/services/marketplace/marketplaceSyncService';
import type { MarketplaceSyncRun } from '../../../types/marketplace';

const capture = () => MarketplaceSyncService.getSyncRuns();

export function MarketplaceHistoryPage() {
  const [runs, setRuns] = useState<ReturnType<typeof capture>>(capture);
  const [channelFilter, setChannelFilter] = useState<'ALL' | 'ALIBABA' | 'MADE_IN_CHINA'>('ALL');
  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'EXPORT' | 'IMPORT'>('ALL');
  const [busy, setBusy] = useState<boolean>(false);

  const filtered = runs.filter(
    (r) =>
      (channelFilter === 'ALL' || r.channel === channelFilter) &&
      (directionFilter === 'ALL' || r.direction === directionFilter)
  );

  const quickExport = async () => {
    setBusy(true);
    try {
      await MarketplaceSyncService.runSync({ channel: 'ALIBABA', direction: 'EXPORT', mode: 'FULL' });
      await MarketplaceSyncService.runSync({ channel: 'MADE_IN_CHINA', direction: 'EXPORT', mode: 'FULL' });
      setRuns(capture());
    } finally {
      setBusy(false);
    }
  };

  const filterBtn = (
    active: boolean,
    onClick: () => void,
    label: string
  ) => (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
        active
          ? 'bg-xisync-cyan-500/15 text-xisync-cyan-700 dark:text-xisync-cyan-300 border-xisync-cyan-500/40'
          : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <PageHeader
        title="Marketplace Sync History"
        subtitle="Every export/import run: what was pushed, pulled, and what needs attention."
        actions={
          <Button size="sm" icon={<Upload className="w-3.5 h-3.5" />} loading={busy} onClick={quickExport}>
            Quick export (both channels)
          </Button>
        }
      />

      <SectionCard
        title="Run log"
        subtitle="Chronological record of channel syncs"
        actions={
          <div className="flex items-center gap-1.5 flex-wrap">
            {filterBtn(channelFilter === 'ALL', () => setChannelFilter('ALL'), 'All channels')}
            {filterBtn(channelFilter === 'ALIBABA', () => setChannelFilter('ALIBABA'), 'Alibaba')}
            {filterBtn(channelFilter === 'MADE_IN_CHINA', () => setChannelFilter('MADE_IN_CHINA'), 'Made-in-China')}
            <span className="w-px h-5 bg-slate-200 dark:bg-slate-700 mx-1 hidden sm:block" />
            {filterBtn(directionFilter === 'ALL', () => setDirectionFilter('ALL'), 'All directions')}
            {filterBtn(directionFilter === 'EXPORT', () => setDirectionFilter('EXPORT'), 'Exports')}
            {filterBtn(directionFilter === 'IMPORT', () => setDirectionFilter('IMPORT'), 'Imports')}
          </div>
        }
        className="p-0 overflow-hidden"
      >
        {filtered.length === 0 ? (
          <div className="p-5">
            <EmptyHint>No runs match the current filters.</EmptyHint>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((run) => (
              <RunRow key={run.id} run={run} />
            ))}
          </ul>
        )}
      </SectionCard>
    </div>
  );
}

function RunRow({ run }: { run: MarketplaceSyncRun }) {
  const isExport = run.direction === 'EXPORT';
  return (
    <li className="px-5 py-4 hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
      <div className="flex flex-wrap items-start gap-3">
        <ChannelLogo channel={run.channel} className="w-8 h-8 text-[10px]" />
        <div className="flex-1 min-w-[220px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              {isExport ? 'Export to' : 'Import from'} {run.channel === 'ALIBABA' ? 'Alibaba.com' : 'Made-in-China.com'}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase">
              {isExport ? <ArrowUpFromLine className="w-3 h-3" /> : <ArrowDownToLine className="w-3 h-3" />}
              {run.mode.toLowerCase()}
            </span>
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
              {timeAgo(run.startedAt)}
              {run.triggeredBy === 'SCHEDULED' && ' · scheduled'}
              {run.triggeredBy === 'API' && ' · via API'}
            </span>
            <div className="ml-auto">
              <SyncRunStatusPill status={run.status} />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">{run.message}</p>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-bold">
            <span className="text-slate-400 dark:text-slate-500">{int(run.itemsProcessed)} processed</span>
            <span className="text-emerald-600 dark:text-emerald-400">▲ {int(run.itemsCreated)} created</span>
            <span className="text-sky-600 dark:text-sky-400">⇄ {int(run.itemsUpdated)} updated</span>
            <span className={run.itemsFailed > 0 ? 'text-red-600 dark:text-red-400' : 'text-slate-400 dark:text-slate-500'}>
              ✕ {int(run.itemsFailed)} failed
            </span>
          </div>

          {run.perSkuResults.length > 0 && (
            <details className="mt-2">
              <summary className="inline-flex items-center gap-1 text-[11px] font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400 cursor-pointer hover:underline">
                Per-SKU results ({run.perSkuResults.length}) <ArrowRight className="w-3 h-3" />
              </summary>
              <ul className="mt-2 space-y-1 pl-1">
                {run.perSkuResults.map((res, i) => (
                  <li key={`${run.id}-${i}`} className="text-[11px] flex items-start gap-2">
                    <span
                      className={`font-mono font-extrabold px-1.5 py-0.5 rounded text-[9px] uppercase shrink-0 ${
                        res.action === 'FAILED'
                          ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-300'
                          : res.action === 'CREATED' || res.action === 'IMPORTED'
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {res.action}
                    </span>
                    <span className="font-mono font-bold text-slate-600 dark:text-slate-300">{res.sku}</span>
                    <span className="text-slate-500 dark:text-slate-400">{res.message}</span>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </li>
  );
}
