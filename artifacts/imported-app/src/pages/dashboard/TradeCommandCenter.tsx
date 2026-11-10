import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  ChevronRight,
  FileCheck2,
  Gauge,
  ShieldCheck,
  Ship,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { useI18n } from '../../lib/i18n';
import { getTradeCopy } from '../../lib/i18n/tradeCopy';
import { getCommandCopy } from '../../lib/i18n/commandCopy';
import { useTradeWorkspace } from '../../hooks/useTradeWorkspace';
import { buildCommandCenter } from '../../lib/services/tradeIntelligence/commandCenter';
import { GlassCard, Pill, SectionHeading, StatePanel, TradeShell, cx } from '../../components/trade/TradeUI';
import { Sparkline } from '../../components/trade/TradeCharts';
import { formatNumber, formatPercent, formatUsd } from '../../components/trade/format';
import type { CommandModule } from '../../types/tradeIntelligence';

const SEVERITY_TONE = {
  critical: 'rose',
  warning: 'amber',
  info: 'slate',
} as const;

const CATEGORY_ICON = {
  credit: ShieldCheck,
  logistics: Ship,
  matching: Users,
  documents: FileCheck2,
  anomaly: AlertTriangle,
} as const;

const MODULE_PATH: Record<CommandModule, string> = {
  credit: '/credit',
  shipping: '/shipping',
  matching: '/matching',
  analytics: '/analytics',
  toolkit: '/toolkit',
};

export function TradeCommandCenter() {
  const { language } = useI18n();
  const copy = getCommandCopy(language);
  const trade = getTradeCopy(language);
  const navigate = useNavigate();
  const location = useLocation();
  const base = location.pathname.startsWith('/dashboard/ultra')
    ? '/dashboard/ultra/trade-intelligence'
    : '/dashboard/trade-intelligence';

  const { state, loading, error, reload } = useTradeWorkspace();
  const snapshot = useMemo(
    () =>
      buildCommandCenter({
        workflows: state?.matchWorkflows,
        assessments: state?.assessments,
        documentChecks: state?.documentChecks,
        quotes: state?.quotes,
        snapshots: state?.snapshots,
      }),
    [state],
  );

  const go = (suffix: string) => navigate(`${base}${suffix}`);
  const actionTarget = (module: CommandModule) => go(MODULE_PATH[module]);

  return (
    <TradeShell active="overview" eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle}>
      {error && (
        <GlassCard className="p-0">
          <StatePanel kind="error" title={copy.errorTitle} message={error} onRetry={reload} retryLabel={copy.retry} />
        </GlassCard>
      )}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <GlassCard className="overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_140%_at_0%_0%,rgba(6,182,212,0.16),transparent_55%),radial-gradient(90%_120%_at_100%_0%,rgba(132,204,22,0.12),transparent_60%)] dark:bg-[radial-gradient(120%_140%_at_0%_0%,rgba(34,211,238,0.16),transparent_55%),radial-gradient(90%_120%_at_100%_0%,rgba(132,204,22,0.1),transparent_60%)]" />
          <div className="relative p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <SectionHeading
                title={copy.briefingHeading}
                hint={copy.briefingHint}
                icon={Sparkles}
              />
              <div className="flex items-center gap-2">
                <Pill tone="cyan">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-xisync-cyan-500 opacity-70" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-xisync-cyan-500" />
                  </span>
                  {copy.live}
                </Pill>
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                  {copy.generated} {new Date(snapshot.generatedAt).toLocaleTimeString(language === 'zh' ? 'zh-CN' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>

            <p className="mt-4 max-w-3xl text-base font-extrabold leading-snug tracking-tight text-slate-950 sm:text-lg dark:text-white">
              {snapshot.briefing.headline[language]}
            </p>
            <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {snapshot.briefing.lines.map((line, index) => (
                <motion.li
                  key={line.en}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, delay: 0.08 + index * 0.06 }}
                  className="flex gap-2 rounded-xl border border-slate-200/60 bg-white/60 px-3 py-2.5 text-[11px] leading-relaxed text-slate-600 backdrop-blur dark:border-white/5 dark:bg-white/[0.03] dark:text-slate-300"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-xisync-cyan-500 to-xisync-lime-500" />
                  {line[language]}
                </motion.li>
              ))}
            </ul>
          </div>
        </GlassCard>
      </motion.section>

      <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <GlassCard key={index} className="p-4">
                <StatePanel kind="loading" title={copy.loading} />
              </GlassCard>
            ))
          : snapshot.kpis.map((kpi, index) => {
              const hasBaseline = kpi.deltaPct !== null;
              const positive = (kpi.deltaPct ?? 0) >= 0;
              const value =
                kpi.unit === 'usd'
                  ? formatUsd(kpi.value, language, true)
                  : kpi.unit === 'pct'
                    ? formatPercent(kpi.value, 1)
                    : formatNumber(kpi.value, language);
              return (
                <motion.button
                  key={kpi.key}
                  type="button"
                  onClick={() => go('/analytics')}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="group text-left"
                >
                  <GlassCard className="h-full p-4 transition-colors group-hover:border-xisync-cyan-500/40 dark:group-hover:border-cyan-300/25">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        {kpi.label[language]}
                      </p>
                      <ArrowUpRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:text-xisync-cyan-600 dark:text-slate-600 dark:group-hover:text-cyan-300" />
                    </div>
                    <div className="mt-2 flex items-end justify-between gap-2">
                      <p className="text-2xl font-extrabold tracking-tight text-slate-950 dark:text-white">{value}</p>
                      {hasBaseline ? (
                        <span
                          className={cx(
                            'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
                            positive
                              ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-300',
                          )}
                        >
                          {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {positive ? '+' : ''}
                          {kpi.deltaPct?.toFixed(1)}%
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-slate-500/10 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-400">
                          {copy.baseline}
                        </span>
                      )}
                    </div>
                    <Sparkline
                      data={kpi.series}
                      tone={hasBaseline ? (positive ? 'lime' : 'rose') : 'cyan'}
                      height={38}
                      className="mt-1 opacity-80"
                    />
                    <p className="mt-1 text-[10px] font-medium text-slate-500 dark:text-slate-400">
                      {kpi.baselineDate ? `${copy.vsPrev} · ${kpi.baselineDate}` : copy.baselineHint}
                    </p>
                  </GlassCard>
                </motion.button>
              );
            })}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.55fr_1fr]">
        <GlassCard className="p-4 sm:p-5">
          <SectionHeading
            title={copy.actionHeading}
            hint={copy.actionHint}
            icon={Gauge}
            action={
              <button
                type="button"
                onClick={() => go('/analytics')}
                className="hidden items-center gap-1 text-[11px] font-bold text-xisync-blue-800 transition hover:gap-1.5 sm:inline-flex dark:text-cyan-300"
              >
                {copy.openAnalytics}
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            }
          />

          {loading ? (
            <StatePanel kind="loading" title={copy.loading} />
          ) : snapshot.actions.length === 0 ? (
            <StatePanel kind="empty" title={copy.actionEmpty} />
          ) : (
            <ul className="mt-4 space-y-2">
              {snapshot.actions.map((action, index) => {
                const Icon = CATEGORY_ICON[action.category];
                return (
                  <motion.li
                    key={action.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.24) }}
                  >
                    <button
                      type="button"
                      onClick={() => actionTarget(action.module)}
                      className="group flex w-full items-start gap-3 rounded-xl border border-slate-200/70 bg-white/55 p-3 text-left transition hover:-translate-y-0.5 hover:border-xisync-cyan-500/40 hover:bg-white/80 hover:shadow-[0_14px_36px_-28px_rgba(30,58,138,0.6)] dark:border-white/5 dark:bg-white/[0.025] dark:hover:border-cyan-300/25 dark:hover:bg-white/[0.05]"
                    >
                      <span
                        className={cx(
                          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border',
                          action.severity === 'critical'
                            ? 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300'
                            : action.severity === 'warning'
                              ? 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300'
                              : 'border-slate-300/70 bg-slate-100/70 text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300',
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="text-[12px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                            {action.title[language]}
                          </span>
                          <Pill tone={SEVERITY_TONE[action.severity]}>{copy.severity[action.severity]}</Pill>
                          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                            {copy.category[action.category]}
                          </span>
                        </span>
                        <span className="mt-1 block text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                          {action.reason[language]}
                        </span>
                      </span>
                      <span className="flex shrink-0 flex-col items-end gap-1">
                        {action.impactUsd ? (
                          <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                            {formatUsd(action.impactUsd, language, true)}
                          </span>
                        ) : null}
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-xisync-blue-800 opacity-0 transition group-hover:opacity-100 dark:text-cyan-300">
                          {copy.resolve}
                          <ChevronRight className="h-3 w-3" />
                        </span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </GlassCard>

        <GlassCard className="p-4 sm:p-5">
          <SectionHeading title={copy.exposureHeading} hint={copy.exposureHint} icon={Wallet} />
          {(() => {
            const committed = snapshot.exposure.committedUsd;
            const pipeline = snapshot.exposure.pipelineUsd;
            const total = committed + pipeline || 1;
            const insured = snapshot.exposure.insuredUsd;
            const coverage = committed > 0 ? Math.round((insured / committed) * 100) : 0;
            return (
              <div className="mt-4 space-y-4">
                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {copy.committed}
                    </span>
                    <span className="text-lg font-extrabold text-slate-950 dark:text-white">
                      {formatUsd(committed, language, true)}
                    </span>
                  </div>
                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.round((committed / total) * 100)}%` }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-gradient-to-r from-xisync-blue-900 via-xisync-blue-700 to-xisync-cyan-500"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    <span>
                      {copy.pipeline} · {formatUsd(pipeline, language, true)}
                    </span>
                    <span>{Math.round((pipeline / total) * 100)}%</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                      {copy.coverage}
                    </span>
                    <span className={cx('text-lg font-extrabold', coverage >= 80 ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300')}>
                      {coverage}%
                    </span>
                  </div>
                  <div className="mt-2 flex h-2.5 overflow-hidden rounded-full bg-slate-200/70 dark:bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${coverage}%` }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-xisync-lime-500"
                    />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[10px] font-semibold">
                    <span className="text-emerald-700 dark:text-emerald-300">
                      {copy.insured} · {formatUsd(insured, language, true)}
                    </span>
                    <span className="text-rose-700 dark:text-rose-300">
                      {copy.uninsured} · {formatUsd(snapshot.exposure.uninsuredUsd, language, true)}
                    </span>
                  </div>
                </div>

                {snapshot.exposure.largest && (
                  <button
                    type="button"
                    onClick={() => go('/analytics')}
                    className="group flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200/70 bg-white/55 px-3 py-2.5 text-left transition hover:border-xisync-cyan-500/40 dark:border-white/5 dark:bg-white/[0.025]"
                  >
                    <span>
                      <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                        {copy.largest}
                      </span>
                      <span className="mt-0.5 block text-[11px] font-extrabold text-slate-900 dark:text-white">
                        {snapshot.exposure.largest.country[language]} ·{' '}
                        {formatUsd(snapshot.exposure.largest.exposureUsd, language, true)}
                      </span>
                    </span>
                    <Pill tone={snapshot.exposure.largest.riskScore >= 70 ? 'emerald' : snapshot.exposure.largest.riskScore >= 55 ? 'amber' : 'rose'}>
                      {snapshot.exposure.largest.riskScore}/100
                    </Pill>
                  </button>
                )}

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => go('/analytics')}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl border border-slate-200/80 bg-white/70 px-3 py-2 text-[11px] font-bold text-slate-700 transition hover:border-xisync-cyan-500/40 dark:border-white/10 dark:bg-white/5 dark:text-slate-200"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    {copy.openAnalytics}
                  </button>
                  <button
                    type="button"
                    onClick={() => go('/credit')}
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-gradient-to-r from-xisync-blue-900 via-xisync-blue-700 to-xisync-cyan-600 px-3 py-2 text-[11px] font-bold text-white shadow-[0_12px_26px_-18px_rgba(30,58,138,0.9)]"
                  >
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {copy.openCredit}
                  </button>
                </div>
              </div>
            );
          })()}
        </GlassCard>
      </section>

      <GlassCard className="p-4 sm:p-5">
        <SectionHeading
          title={copy.shipmentsHeading}
          hint={copy.shipmentsHint}
          icon={Ship}
          action={
            <button
              type="button"
              onClick={() => go('/shipping')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-xisync-blue-800 transition hover:gap-1.5 dark:text-cyan-300"
            >
              {copy.modules.shipping}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        />
        {snapshot.shipments.length === 0 ? (
          <StatePanel kind="empty" title={copy.noShipments} />
        ) : (
          <ul className="mt-4 divide-y divide-slate-200/70 dark:divide-white/5">
            {snapshot.shipments.map((shipment, index) => (
              <motion.li
                key={shipment.orderId}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.2) }}
              >
                <button
                  type="button"
                  onClick={() => go('/shipping')}
                  className="group grid w-full grid-cols-1 gap-2 py-3 text-left sm:grid-cols-[1.3fr_1.2fr_0.9fr_1fr_auto] sm:items-center"
                >
                  <span className="min-w-0">
                    <span className="flex items-center gap-2">
                      <span className="text-[11px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                        {shipment.orderId}
                      </span>
                      <Pill tone={shipment.riskLevel === 'critical' ? 'rose' : shipment.riskLevel === 'warning' ? 'amber' : 'emerald'}>
                        {shipment.riskLevel === 'clear' ? copy.onTrack : copy.severity[shipment.riskLevel === 'critical' ? 'critical' : 'warning']}
                      </Pill>
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {shipment.buyerName[language]}
                    </span>
                  </span>
                  <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                    {shipment.laneLabel[language]}
                    <span className="ml-1.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-600 dark:bg-white/10 dark:text-slate-300">
                      {shipment.mode}
                    </span>
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                      {copy.predicted}
                    </span>
                    <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-100">
                      {shipment.transitLowDays}–{shipment.transitHighDays} {copy.days}
                    </span>
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                      {copy.planned} · {shipment.plannedDays} {copy.days}
                    </span>
                    <span
                      className={cx(
                        'text-[11px] font-bold',
                        shipment.slipDays >= 3
                          ? 'text-rose-700 dark:text-rose-300'
                          : shipment.slipDays >= 2
                            ? 'text-amber-700 dark:text-amber-300'
                            : 'text-emerald-700 dark:text-emerald-300',
                      )}
                    >
                      {shipment.slipDays >= 2
                        ? `${copy.slip} +${shipment.slipDays} ${copy.days}`
                        : copy.onTrack}
                    </span>
                  </span>
                  <span className="flex flex-wrap items-center gap-1 sm:justify-end">
                    {shipment.flags.slice(0, 2).map((flag) => (
                      <span
                        key={flag.key}
                        className="rounded-md border border-slate-200/70 bg-white/70 px-1.5 py-0.5 text-[9px] font-bold text-slate-500 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                      >
                        {flag.label[language]}
                      </span>
                    ))}
                    <span className="ml-1 text-[11px] font-bold text-slate-700 dark:text-slate-200">
                      {formatUsd(shipment.valueUsd, language, true)}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-xisync-cyan-600 dark:text-slate-600" />
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
        )}
      </GlassCard>

      <GlassCard className="p-4 sm:p-5">
        <SectionHeading
          title={copy.pipelineHeading}
          hint={copy.pipelineHint}
          icon={Users}
          action={
            <button
              type="button"
              onClick={() => go('/matching')}
              className="inline-flex items-center gap-1 text-[11px] font-bold text-xisync-blue-800 transition hover:gap-1.5 dark:text-cyan-300"
            >
              {copy.openMatching}
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          }
        />
        {snapshot.pipeline.length === 0 ? (
          <StatePanel kind="empty" title={copy.noPipeline} />
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {snapshot.pipeline.map((column, index) => (
              <motion.button
                key={column.stage}
                type="button"
                onClick={() => go('/matching')}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                className="group rounded-xl border border-slate-200/70 bg-gradient-to-b from-white/80 to-white/40 p-3 text-left transition hover:border-xisync-cyan-500/40 dark:border-white/10 dark:from-white/[0.08] dark:to-white/[0.03]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold tracking-tight text-slate-900 dark:text-white">
                    {trade.matching.stages[column.stage].label}
                  </span>
                  <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                    {column.count}
                  </span>
                </div>
                <p className="mt-1 text-sm font-extrabold text-xisync-blue-900 dark:text-cyan-200">
                  {formatUsd(column.valueUsd, language, true)}
                </p>
                {column.staleCount > 0 && (
                  <p className="mt-1 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                    <AlertTriangle className="h-3 w-3" />
                    {column.staleCount} {copy.stale}
                  </p>
                )}
                <ul className="mt-2 space-y-1">
                  {column.top.map((match) => (
                    <li key={match.id} className="flex items-center justify-between gap-2 text-[10px]">
                      <span className="truncate font-semibold text-slate-600 dark:text-slate-300">
                        {match.buyerName[language]}
                      </span>
                      <span className="shrink-0 font-extrabold text-slate-800 dark:text-slate-100">{match.score}</span>
                    </li>
                  ))}
                </ul>
              </motion.button>
            ))}
          </div>
        )}
      </GlassCard>
    </TradeShell>
  );
}
