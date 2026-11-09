import { useState } from 'react';
import {
  Inbox,
  PackagePlus,
  RefreshCcw,
  XCircle,
  X,
  CheckCircle2,
  Boxes,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
  ChannelLogo,
  ChannelName,
  PageHeader,
  SectionCard,
  EmptyHint,
  usd,
  int,
  timeAgo,
} from '../../../components/marketplace/marketplaceUi';
import { MarketplaceSyncService } from '../../../lib/services/marketplace/marketplaceSyncService';
import type { ChannelImportCandidate } from '../../../types/marketplace';

const capture = () => MarketplaceSyncService.getImportQueue();
type QueueState = ReturnType<typeof capture>;

function CandidateCard({
  item,
  onAccept,
  onReject,
  busy,
}: {
  item: ChannelImportCandidate;
  onAccept: (mode: 'RECONCILE' | 'NEW_PRODUCT') => void;
  onReject: () => void;
  busy: boolean;
}) {
  const pending = item.decision === 'PENDING';
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-slate-900/60 p-4 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <ChannelLogo channel={item.channel} />
          <div className="min-w-0">
            <div className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">{item.title}</div>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <ChannelName channel={item.channel} showDomain={false} />
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                {item.category ?? 'Uncategorized'}
              </span>
              <code className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500">{item.externalListingId}</code>
            </div>
          </div>
        </div>
        {pending ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/40 shrink-0">
            <Inbox className="w-3 h-3" /> PENDING
          </span>
        ) : (
          <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${
              item.decision === 'ACCEPTED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40'
                : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/40'
            }`}
          >
            {item.decision === 'ACCEPTED' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
            {item.decision}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-4">
        {item.imageUrls[0] && (
          <img src={item.imageUrls[0]} alt="" className="w-20 h-20 rounded-xl object-cover bg-slate-100 dark:bg-slate-800" loading="lazy" />
        )}
        <div className="grid grid-cols-3 gap-3 flex-1">
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Price</div>
            <div className="text-sm font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{usd(item.priceUsd)}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">MOQ</div>
            <div className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">{item.moq === null ? '—' : int(item.moq)}</div>
          </div>
          <div>
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Stock on channel</div>
            <div className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">
              {item.stockQty === null ? 'Unlimited / n/a' : int(item.stockQty)}
            </div>
          </div>
        </div>
      </div>

      {item.description && (
        <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.description}</p>
      )}

      {item.matchedSku ? (
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40">
          <Boxes className="w-3.5 h-3.5" />
          Matches existing XiSync SKU {item.matchedSku} — reconcile refreshes stock &amp; price
        </div>
      ) : (
        <div className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/40">
          <PackagePlus className="w-3.5 h-3.5" />
          Not in XiSync catalog — add as a new DRAFT product
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mr-auto">
          Detected {timeAgo(item.detectedAt)} ·{' '}
          <a href={item.externalListingUrl} target="_blank" rel="noreferrer" className="font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400 hover:underline">
            open on channel
          </a>
        </span>
        {pending && (
          <>
            {item.matchedSku ? (
              <>
                <Button size="sm" variant="secondary" icon={<RefreshCcw className="w-3.5 h-3.5" />} loading={busy} onClick={() => onAccept('RECONCILE')}>
                  Reconcile {item.matchedSku}
                </Button>
                <Button size="sm" variant="outline" icon={<PackagePlus className="w-3.5 h-3.5" />} loading={busy} onClick={() => onAccept('NEW_PRODUCT')}>
                  Add as new product
                </Button>
              </>
            ) : (
              <Button size="sm" icon={<PackagePlus className="w-3.5 h-3.5" />} loading={busy} onClick={() => onAccept('NEW_PRODUCT')}>
                Add to inventory (DRAFT)
              </Button>
            )}
            <Button size="sm" variant="ghost" icon={<X className="w-3.5 h-3.5" />} disabled={busy} onClick={onReject}>
              Reject
            </Button>
          </>
        )}
        {!pending && item.decisionNote && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400">{item.decisionNote}</span>
        )}
      </div>
    </div>
  );
}

export function MarketplaceImportQueuePage() {
  const [queue, setQueue] = useState<QueueState>(capture);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const refresh = () => setQueue(capture());
  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 8000);
  };

  const accept = async (id: string, mode: 'RECONCILE' | 'NEW_PRODUCT') => {
    setBusyId(id);
    try {
      const updated = MarketplaceSyncService.acceptImportCandidate(id, mode);
      refresh();
      notify(`Accepted: ${updated.decisionNote}`);
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  };

  const reject = async (id: string) => {
    setBusyId(id);
    try {
      MarketplaceSyncService.rejectImportCandidate(id);
      refresh();
      notify('Candidate rejected and dismissed.');
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  };

  const pending = queue.filter((c) => c.decision === 'PENDING');
  const decided = queue.filter((c) => c.decision !== 'PENDING');

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <PageHeader
        title="Channel Import Queue"
        subtitle="Listings pulled back from your storefronts (Import). Reconcile them into existing SKUs or add them to the XiSync catalog as drafts."
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
        title={`Pending decisions (${pending.length})`}
        subtitle={'Imported from scheduled runs or manual "Import listings" actions on the hub'}
      >
        {pending.length === 0 ? (
          <EmptyHint>
            Nothing waiting. Run an import from the Marketplace Hub (channel card → "Import listings") to pull storefront products
            back into XiSync.
          </EmptyHint>
        ) : (
          <div className="space-y-4">
            {pending.map((item) => (
              <CandidateCard
                key={item.id}
                item={item}
                busy={busyId === item.id}
                onAccept={(mode) => accept(item.id, mode)}
                onReject={() => reject(item.id)}
              />
            ))}
          </div>
        )}
      </SectionCard>

      {decided.length > 0 && (
        <SectionCard title={`Decided (${decided.length})`} subtitle="Acceptance history for this session">
          <div className="space-y-4">
            {decided.map((item) => (
              <CandidateCard
                key={item.id}
                item={item}
                busy={false}
                onAccept={() => undefined}
                onReject={() => undefined}
              />
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
