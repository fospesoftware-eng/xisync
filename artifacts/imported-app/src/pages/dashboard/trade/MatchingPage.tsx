import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Filter,
  History,
  Info,
  Search,
  Sparkles,
  Target,
  Users,
  XCircle,
} from 'lucide-react';
import { useI18n } from '../../../lib/i18n';
import { getTradeCopy } from '../../../lib/i18n/tradeCopy';
import { useTradeWorkspace } from '../../../hooks/useTradeWorkspace';
import {
  SECTOR_LABELS,
  findBuyer,
  findProduct,
  findSupplier,
} from '../../../lib/services/tradeIntelligence/dataset';
import { MATCH_WEIGHTS, rankMatches } from '../../../lib/services/tradeIntelligence/matching';
import { MATCH_STAGES, nextStages } from '../../../lib/services/tradeIntelligence/workflow';
import type { MatchStage } from '../../../types/tradeIntelligence';
import {
  Field,
  GhostButton,
  GlassCard,
  Meter,
  Pill,
  SectionHeading,
  Select,
  StatePanel,
  TextInput,
  TradeShell,
  cx,
} from '../../../components/trade/TradeUI';
import { formatDateTime, formatNumber, formatUsd } from '../../../components/trade/format';

const STAGE_TONE: Record<MatchStage, 'slate' | 'cyan' | 'indigo' | 'amber' | 'emerald' | 'rose'> = {
  suggested: 'slate',
  shortlisted: 'cyan',
  contacted: 'indigo',
  negotiating: 'amber',
  won: 'emerald',
  lost: 'rose',
};

const STAGE_BAR: Record<MatchStage, string> = {
  suggested: 'from-slate-400 to-slate-300',
  shortlisted: 'from-xisync-cyan-500 to-cyan-300',
  contacted: 'from-xisync-blue-800 to-xisync-blue-500',
  negotiating: 'from-amber-500 to-yellow-300',
  won: 'from-emerald-500 to-lime-400',
  lost: 'from-rose-500 to-rose-300',
};

export function MatchingPage() {
  const { language } = useI18n();
  const copy = getTradeCopy(language);
  const workspace = useTradeWorkspace();
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState('all');
  const [stageFilter, setStageFilter] = useState<'all' | MatchStage>('all');
  const [minScore, setMinScore] = useState(0);
  const [view, setView] = useState<'board' | 'list'>('board');
  const [notice, setNotice] = useState<string | null>(null);

  const enriched = useMemo(
    () =>
      rankMatches().map((match) => ({
        ...match,
        buyer: findBuyer(match.buyerId),
        product: findProduct(match.productId),
        supplier: findSupplier(match.supplierId),
        workflow: workspace.state?.matchWorkflows[match.id],
      })),
    [workspace.state?.matchWorkflows],
  );

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return enriched.filter((match) => {
      if (match.score < minScore) return false;
      if (sector !== 'all' && match.buyer?.sector !== sector) return false;
      const stage = match.workflow?.stage ?? 'suggested';
      if (stageFilter !== 'all' && stage !== stageFilter) return false;
      if (!query) return true;
      return [match.buyer?.name.en, match.buyer?.name.zh, match.product?.name.en, match.product?.name.zh, match.supplier?.name.en, match.supplier?.name.zh]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(query));
    });
  }, [enriched, search, sector, stageFilter, minScore]);

  const stageOf = (id: string): MatchStage =>
    workspace.state?.matchWorkflows[id]?.stage ?? 'suggested';

  const move = (matchId: string, stage: MatchStage) => {
    const applied = workspace.setMatchStage(matchId, stage);
    setNotice(applied ? null : copy.matching.changeFailed);
  };

  const stats = useMemo(() => {
    const active = enriched.filter((match) => {
      const stage = match.workflow?.stage ?? 'suggested';
      return stage !== 'won' && stage !== 'lost';
    });
    const won = enriched.filter((match) => match.workflow?.stage === 'won');
    return {
      total: enriched.length,
      active: active.length,
      average: enriched.length
        ? Math.round(enriched.reduce((sum, match) => sum + match.score, 0) / enriched.length)
        : 0,
      wonValue: won.reduce((sum, match) => sum + (match.buyer?.orderValueUsd ?? 0), 0),
    };
  }, [enriched]);

  const sectors = Object.entries(SECTOR_LABELS);
  const clearFilters = () => {
    setSearch('');
    setSector('all');
    setStageFilter('all');
    setMinScore(0);
  };

  return (
    <TradeShell
      active="matching"
      eyebrow={copy.matching.eyebrow}
      title={copy.matching.title}
      subtitle={copy.matching.subtitle}
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <GlassCard className="p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{copy.matching.results.replace('{count}', '')}</p>
          <p className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">{formatNumber(stats.total, language)}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{copy.overview.kpiMatches}</p>
          <p className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">{formatNumber(stats.active, language)}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{copy.matching.score}</p>
          <p className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">{stats.average}</p>
        </GlassCard>
        <GlassCard className="p-4">
          <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">{copy.matching.stages.won.label}</p>
          <p className="mt-2 text-xl font-extrabold text-slate-950 dark:text-white">
            {formatUsd(stats.wonValue, language, true)}
          </p>
        </GlassCard>
      </div>

      <GlassCard className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <div className="flex-1">
            <Field label={copy.matching.search}>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500 dark:text-slate-400" />
                <TextInput
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={copy.matching.search}
                  className="pl-9"
                />
              </div>
            </Field>
          </div>
          <div className="w-full lg:w-40">
            <Field label={copy.matching.sector}>
              <Select value={sector} onChange={(event) => setSector(event.target.value)}>
                <option value="all">{copy.matching.allSectors}</option>
                {sectors.map(([key, label]) => (
                  <option key={key} value={key}>
                    {label[language]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="w-full lg:w-36">
            <Field label={copy.matching.stage}>
              <Select
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value as 'all' | MatchStage)}
              >
                <option value="all">{copy.matching.allStages}</option>
                {MATCH_STAGES.map((stage) => (
                  <option key={stage} value={stage}>
                    {copy.matching.stages[stage].label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="w-full lg:w-44">
            <Field label={`${copy.matching.minScore}: ${minScore}`}>
              <input
                type="range"
                min={0}
                max={100}
                value={minScore}
                onChange={(event) => setMinScore(Number(event.target.value))}
                className="mt-3 w-full accent-xisync-cyan-600"
              />
            </Field>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700">
              {(['board', 'list'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setView(mode)}
                  className={cx(
                    'px-3 py-2 text-[10px] font-bold transition',
                    view === mode
                      ? 'bg-gradient-to-r from-xisync-blue-900 to-xisync-cyan-600 text-white'
                      : 'bg-white/70 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300',
                  )}
                >
                  {mode === 'board' ? copy.matching.board : copy.matching.list}
                </button>
              ))}
            </div>
            <GhostButton onClick={clearFilters}>
              <Filter className="h-3 w-3" />
              {copy.matching.resetFilters}
            </GhostButton>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Pill tone="cyan">
            <Sparkles className="h-3 w-3" />
            {copy.matching.results.replace('{count}', formatNumber(filtered.length, language))}
          </Pill>
          <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400">
            <Info className="h-3 w-3" />
            {copy.matching.persisted}
          </span>
          {workspace.error && <Pill tone="rose">{copy.common.errorTitle}</Pill>}
          {notice && (
            <button type="button" onClick={() => setNotice(null)}>
              <Pill tone="amber">{notice}</Pill>
            </button>
          )}
        </div>
      </GlassCard>

      {workspace.loading ? (
        <GlassCard>
          <StatePanel kind="loading" title={copy.common.loading} />
        </GlassCard>
      ) : filtered.length === 0 ? (
        <GlassCard>
          <StatePanel
            kind="empty"
            icon={Target}
            title={copy.matching.noMatches}
            message={copy.matching.subtitle}
            onRetry={clearFilters}
            retryLabel={copy.matching.resetFilters}
          />
        </GlassCard>
      ) : view === 'board' ? (
        <div className="grid gap-3 overflow-x-auto pb-2 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          {MATCH_STAGES.map((stage) => {
            const stageMatches = filtered.filter((match) => stageOf(match.id) === stage);
            const value = stageMatches.reduce((sum, match) => sum + (match.buyer?.orderValueUsd ?? 0), 0);
            return (
              <div key={stage} className="min-w-[220px]">
                <div className="mb-2 flex items-center justify-between gap-2 px-1">
                  <div className="flex items-center gap-1.5">
                    <span className={cx('h-2 w-2 rounded-full bg-gradient-to-r', STAGE_BAR[stage])} />
                    <span className="text-[10px] font-extrabold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
                      {copy.matching.stages[stage].label}
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    {stageMatches.length}
                  </span>
                </div>
                <div className="mb-2 rounded-xl border border-slate-200/60 bg-white/40 px-2 py-1.5 text-[9px] font-semibold text-slate-500 dark:text-slate-300 dark:border-white/10 dark:bg-white/[0.05]">
                  {formatUsd(value, language, true)}
                </div>
                <div className="space-y-2">
                  {stageMatches.map((match) => (
                    <div
                      key={match.id}
                      className="rounded-xl border border-slate-200/70 bg-white/80 p-3 shadow-sm transition hover:border-xisync-cyan-500/40 hover:shadow-md dark:border-white/10 dark:bg-slate-900/70"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 truncate text-[10px] font-extrabold text-slate-900 dark:text-white">
                          {match.buyer?.name[language]}
                        </p>
                        <span className="shrink-0 rounded-md bg-gradient-to-r from-xisync-blue-900 to-xisync-cyan-600 px-1.5 py-0.5 text-[9px] font-extrabold text-white">
                          {match.score}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[9px] text-slate-500 dark:text-slate-400">
                        {match.product?.name[language]}
                      </p>
                      <p className="mt-0.5 truncate text-[9px] text-slate-500 dark:text-slate-400">
                        {match.supplier?.city[language]}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {match.gaps.slice(0, 2).map((gap) => (
                          <span
                            key={gap.key}
                            className={cx(
                              'rounded px-1 py-0.5 text-[8px] font-bold',
                              gap.severity === 'major'
                                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
                            )}
                          >
                            {copy.matching.gap[gap.key as keyof typeof copy.matching.gap] ?? gap.key}
                          </span>
                        ))}
                        {match.gaps.length === 0 && (
                          <span className="rounded bg-emerald-500/10 px-1 py-0.5 text-[8px] font-bold text-emerald-700 dark:text-emerald-300">
                            {copy.matching.noGaps}
                          </span>
                        )}
                      </div>
                      {nextStages(stage).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1 border-t border-slate-200/60 pt-2 dark:border-white/5">
                          {nextStages(stage).map((next) => (
                            <button
                              key={next}
                              type="button"
                              onClick={() => move(match.id, next)}
                              className={cx(
                                'inline-flex items-center gap-0.5 rounded-md px-1.5 py-1 text-[8px] font-bold transition',
                                next === 'lost'
                                  ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'
                                  : 'bg-xisync-blue-900/[0.06] text-xisync-blue-800 hover:bg-xisync-blue-900/10 dark:bg-cyan-400/10 dark:text-cyan-200',
                              )}
                            >
                              {next === 'lost' ? <XCircle className="h-2.5 w-2.5" /> : <ChevronRight className="h-2.5 w-2.5" />}
                              {copy.matching.stages[next].label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {stageMatches.length === 0 && (
                    <div className="rounded-xl border border-dashed border-slate-200/80 px-3 py-6 text-center text-[9px] text-slate-500 dark:border-white/[0.15] dark:bg-white/[0.02] dark:text-slate-400">
                      {copy.common.empty}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((match) => {
            const stage = stageOf(match.id);
            const workflow = workspace.state?.matchWorkflows[match.id];
            return (
              <GlassCard key={match.id} className="p-4" accent={false}>
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                  <div className="flex items-start gap-3 lg:w-64">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-xisync-blue-900 to-xisync-cyan-600 text-sm font-extrabold text-white">
                      {Math.round(match.score)}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-extrabold text-slate-900 dark:text-white">
                        {match.buyer?.name[language]}
                      </p>
                      <p className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-400">
                        {match.buyer?.country[language]} · {copy.matching.score} {match.score}
                      </p>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Pill tone={STAGE_TONE[stage]}>{copy.matching.stages[stage].label}</Pill>
                        <span className="text-[9px] font-semibold text-slate-500 dark:text-slate-400">
                          {formatUsd(match.buyer?.orderValueUsd ?? 0, language, true)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px]">
                      <span className="font-bold text-slate-800 dark:text-slate-200">{match.product?.name[language]}</span>
                      <span className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Users className="h-3 w-3" />
                        {match.supplier?.name[language]}
                      </span>
                      <span className="text-slate-500 dark:text-slate-400">{match.supplier?.city[language]}</span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
                      {match.factors.map((factor) => (
                        <div key={factor.key}>
                          <div className="flex items-center justify-between text-[9px]">
                            <span className="text-slate-500 dark:text-slate-400">
                              {copy.matching.factor[factor.key as keyof typeof copy.matching.factor] ?? factor.key}
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">{factor.score.toFixed(0)}</span>
                          </div>
                          <div className="mt-0.5">
                            <Meter value={factor.score} tone={factor.score >= 75 ? 'emerald' : factor.score >= 50 ? 'cyan' : 'amber'} height="h-0.5" />
                          </div>
                        </div>
                      ))}
                    </div>
                    {match.gaps.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {match.gaps.map((gap) => (
                          <span
                            key={gap.key}
                            className={cx(
                              'rounded px-1.5 py-0.5 text-[8px] font-bold',
                              gap.severity === 'major'
                                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                                : 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
                            )}
                          >
                            {copy.matching.gap[gap.key as keyof typeof copy.matching.gap] ?? gap.key}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-1 lg:w-56 lg:justify-end">
                    {nextStages(stage).map((next) => (
                      <button
                        key={next}
                        type="button"
                        onClick={() => move(match.id, next)}
                        className={cx(
                          'inline-flex items-center gap-1 rounded-lg border px-2 py-1.5 text-[9px] font-bold transition',
                          next === 'lost'
                            ? 'border-rose-300/50 text-rose-600 hover:bg-rose-500/10 dark:border-rose-400/30 dark:text-rose-300'
                            : 'border-slate-200 text-slate-700 hover:border-xisync-cyan-500/50 hover:text-xisync-cyan-700 dark:border-white/10 dark:text-slate-300 dark:hover:text-cyan-300',
                        )}
                      >
                        {next === 'lost' ? <XCircle className="h-3 w-3" /> : <ArrowRight className="h-3 w-3" />}
                        {copy.matching.stages[next].label}
                      </button>
                    ))}
                    {nextStages(stage).length === 0 && stage === 'won' && (
                      <Pill tone="emerald">
                        <CheckCircle2 className="h-3 w-3" />
                        {copy.matching.stages.won.label}
                      </Pill>
                    )}
                    {nextStages(stage).length === 0 && stage === 'lost' && (
                      <button
                        type="button"
                        onClick={() => move(match.id, 'suggested')}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1.5 text-[9px] font-bold text-slate-600 dark:border-white/10 dark:text-slate-300"
                      >
                        <ArrowLeft className="h-3 w-3" />
                        {copy.matching.stages.suggested.label}
                      </button>
                    )}
                  </div>
                </div>

                <details className="group mt-3 border-t border-slate-200/60 pt-2 dark:border-white/5">
                  <summary className="flex cursor-pointer list-none items-center gap-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                    <History className="h-3 w-3" />
                    {copy.matching.history}
                    <ChevronRight className="h-3 w-3 transition group-open:rotate-90" />
                  </summary>
                  <ol className="mt-2 flex flex-wrap items-center gap-2">
                    {(workflow?.history ?? [{ stage: 'suggested', at: new Date().toISOString() }]).map((entry, index) => (
                      <li key={`${entry.stage}-${index}`} className="flex items-center gap-1.5">
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-600 dark:bg-white/5 dark:text-slate-300">
                          {copy.matching.stages[entry.stage].label}
                        </span>
                        <span className="text-[9px] text-slate-500 dark:text-slate-400">{formatDateTime(entry.at, language)}</span>
                        {index < (workflow?.history.length ?? 1) - 1 && <ArrowRight className="h-2.5 w-2.5 text-slate-300" />}
                      </li>
                    ))}
                  </ol>
                </details>
              </GlassCard>
            );
          })}
        </div>
      )}

      <GlassCard className="p-4">
        <SectionHeading title={copy.matching.factors} hint={copy.matching.subtitle} icon={Target} />
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
          {Object.entries(MATCH_WEIGHTS).map(([key, weight]) => (
            <div key={key} className="rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2 dark:border-white/10 dark:bg-white/[0.03]">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                  {copy.matching.factor[key as keyof typeof copy.matching.factor] ?? key}
                </p>
                <span className="text-[9px] font-extrabold text-slate-700 dark:text-slate-200">{weight}</span>
              </div>
              <div className="mt-1.5">
                <Meter value={(weight / 25) * 100} tone="cyan" height="h-0.5" />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </TradeShell>
  );
}
