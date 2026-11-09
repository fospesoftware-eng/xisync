import { useState } from 'react';
import {
  Search,
  Upload,
  RefreshCw,
  PauseCircle,
  PlayCircle,
  ExternalLink,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
  ChannelLogo,
  ListingStatePill,
  PageHeader,
  SectionCard,
  usd,
  int,
} from '../../../components/marketplace/marketplaceUi';
import { MarketplaceSyncService } from '../../../lib/services/marketplace/marketplaceSyncService';
import { CatalogRepository } from '../../../lib/services/marketplace/catalogRepository';
import type {
  MarketplaceChannelType,
  ProductListingMapping,
  XisyncProduct,
} from '../../../types/marketplace';

const CHANNELS: MarketplaceChannelType[] = ['ALIBABA', 'MADE_IN_CHINA'];

interface Snapshot {
  products: XisyncProduct[];
  mappings: ProductListingMapping[];
}

const capture = (): Snapshot => ({
  products: CatalogRepository.list(),
  mappings: MarketplaceSyncService.getMappings(),
});

function ProductChannelCell({
  product,
  channel,
  mapping,
  busy,
  onSync,
  onToggle,
  onToast,
}: {
  product: XisyncProduct;
  channel: MarketplaceChannelType;
  mapping?: ProductListingMapping;
  busy: boolean;
  onSync: () => void;
  onToggle: () => void;
  onToast: (msg: string) => void;
}) {
  const state = mapping?.syncState ?? 'NOT_SYNCED';
  const canSync = product.status === 'ACTIVE';
  const canToggle = Boolean(mapping?.externalListingId) && (state === 'LIVE' || state === 'PAUSED');

  return (
    <div className="min-w-[220px]">
      <div className="flex items-center justify-between gap-2">
        <ListingStatePill state={state} />
        <div className="flex items-center gap-1">
          <button
            title={canSync ? 'Sync this SKU to channel' : 'Only ACTIVE catalog SKUs can be synced'}
            disabled={!canSync || busy}
            onClick={onSync}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-xisync-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${busy ? 'animate-spin' : ''}`} />
          </button>
          <button
            title={canToggle ? (state === 'PAUSED' ? 'Resume listing' : 'Pause listing') : 'Not toggleable'}
            disabled={!canToggle || busy}
            onClick={onToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-amber-500 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {state === 'PAUSED' ? <PlayCircle className="w-3.5 h-3.5" /> : <PauseCircle className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
      {mapping?.externalListingId && (
        <div className="mt-1.5 flex items-center gap-1.5">
          <code className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 truncate">
            {mapping.externalListingId}
          </code>
          {mapping.externalListingUrl && (
            <a
              href={mapping.externalListingUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => onToast(`Opening listing ${mapping.externalListingId} on ${channel}…`)}
              className="text-slate-400 hover:text-xisync-cyan-500"
              title="Open listing on channel"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
      {mapping?.listingPriceUsd !== null && mapping?.listingPriceUsd !== undefined && (
        <div className="mt-1 text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400">
          {usd(mapping.listingPriceUsd)} · {mapping.listingStockQty === null ? '—' : `${int(mapping.listingStockQty)} pcs`}
        </div>
      )}
      {mapping?.lastSyncMessage && mapping.syncState !== 'LIVE' && (
        <div
          className={`mt-1.5 text-[10px] leading-snug rounded-lg px-2 py-1 border ${
            state === 'REJECTED' || state === 'ERROR'
              ? 'text-red-600 dark:text-red-300 border-red-100 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10'
              : 'text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40'
          }`}
        >
          {mapping.lastSyncMessage}
        </div>
      )}
    </div>
  );
}

export function MarketplaceCatalogPage() {
  const [snap, setSnap] = useState<Snapshot>(capture);
  const [search, setSearch] = useState('');
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = () => setSnap(capture());
  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 8000);
  };

  const mappingFor = (sku: string, channel: MarketplaceChannelType) =>
    snap.mappings.find((m) => m.sku === sku && m.channel === channel);

  const runExport = async (
    channel: MarketplaceChannelType,
    mode: 'FULL' | 'INCREMENTAL' | 'SINGLE_SKU',
    skus?: string[]
  ) => {
    const key = `${channel}:${mode}:${(skus ?? []).join('|')}`;
    setBusyKey(key);
    try {
      const run = await MarketplaceSyncService.runSync({ channel, direction: 'EXPORT', mode, skus });
      refresh();
      notify(`[${channel}] ${run.status} — ${run.message}`);
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyKey(null);
    }
  };

  const togglePause = async (mappingId: string, pause: boolean, channel: MarketplaceChannelType) => {
    const key = `toggle:${mappingId}`;
    setBusyKey(key);
    try {
      await MarketplaceSyncService.setMappingPaused(mappingId, pause);
      refresh();
      notify(`[${channel}] Listing ${pause ? 'paused' : 'resumed'} on channel.`);
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyKey(null);
    }
  };

  const filtered = snap.products.filter((p) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (
      p.sku.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.nameZh.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.hsCode.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <PageHeader
        title="Catalog Sync Matrix"
        subtitle="Each XiSync SKU against its Alibaba.com and Made-in-China.com listings. Push changes, pause/resume, or open listings on the channel."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-3.5 h-3.5" />}
              loading={busyKey === 'ALIBABA:INCREMENTAL:'}
              onClick={() => runExport('ALIBABA', 'INCREMENTAL')}
            >
              Export missing → Alibaba
            </Button>
            <Button
              variant="outline"
              size="sm"
              icon={<Upload className="w-3.5 h-3.5" />}
              loading={busyKey === 'MADE_IN_CHINA:INCREMENTAL:'}
              onClick={() => runExport('MADE_IN_CHINA', 'INCREMENTAL')}
            >
              Export missing → MIC
            </Button>
          </>
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

      <SectionCard
        title={`XiSync Master Catalog (${snap.products.length} SKUs)`}
        subtitle="Source of truth — changes here are what export to the channels"
        actions={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search SKU, name, category, HS code…"
              className="w-64 pl-9 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-xisync-cyan-500 font-medium"
            />
          </div>
        }
        className="p-0 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[1080px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 font-extrabold uppercase tracking-wide text-[10px]">
                <th className="py-3 px-5">Product</th>
                <th className="py-3 px-5">Inventory</th>
                {CHANNELS.map((ch) => (
                  <th key={ch} className="py-3 px-5">
                    <span className="inline-flex items-center gap-1.5">
                      <ChannelLogo channel={ch} className="w-5 h-5 text-[8px]" />
                      {ch === 'ALIBABA' ? 'Alibaba.com' : 'Made-in-China.com'}
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.map((product) => (
                <tr key={product.sku} className="align-top hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-start gap-3 max-w-[260px]">
                      {product.imageUrls[0] ? (
                        <img
                          src={product.imageUrls[0]}
                          alt=""
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-[10px]">
                          NA
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 dark:text-white leading-snug">{product.nameEn}</div>
                        <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">{product.nameZh}</div>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <code className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {product.sku}
                          </code>
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">{product.category}</span>
                          <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">HS {product.hsCode}</span>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                              product.status === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                            }`}
                          >
                            {product.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5 whitespace-nowrap">
                    <div className="font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{usd(product.priceUsd)}</div>
                    <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                      {int(product.stockQty)} {product.unit}s in stock
                    </div>
                    <div className="text-[11px] font-medium text-slate-400 dark:text-slate-500">MOQ {product.moq}</div>
                  </td>
                  {CHANNELS.map((ch) => {
                    const mapping = mappingFor(product.sku, ch);
                    const busy = busyKey === `${ch}:SINGLE_SKU:${product.sku}` || busyKey === `toggle:${mapping?.id ?? ''}`;
                    return (
                      <td key={ch} className="py-4 px-5">
                        <ProductChannelCell
                          product={product}
                          channel={ch}
                          mapping={mapping}
                          busy={busy}
                          onSync={() => runExport(ch, 'SINGLE_SKU', [product.sku])}
                          onToggle={() => {
                            if (!mapping) return;
                            togglePause(mapping.id, mapping.syncState !== 'PAUSED', ch);
                          }}
                          onToast={notify}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <p className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
        Tip: "Export missing" runs an <b>incremental</b> sync — it only touches SKUs that are NOT_SYNCED, REJECTED, ERROR, PAUSED or
        stale (&gt;45 min). Use the refresh icon on a channel cell to push a single SKU; new offers enter <b>Pending review</b> on the
        channel before going live.
      </p>
    </div>
  );
}
