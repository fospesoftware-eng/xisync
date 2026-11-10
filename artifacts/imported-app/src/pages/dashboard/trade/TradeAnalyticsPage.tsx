import { useMemo } from 'react';
import {
  BarChart3,
  DollarSign,
  Gauge,
  Globe2,
  Percent,
  Ship,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { useI18n } from '../../../lib/i18n';
import { getTradeCopy } from '../../../lib/i18n/tradeCopy';
import { useTradeWorkspace } from '../../../hooks/useTradeWorkspace';
import { buildAnalytics } from '../../../lib/services/tradeIntelligence/analytics';
import {
  GlassCard,
  Pill,
  SectionHeading,
  StatePanel,
  StatTile,
  TradeShell,
} from '../../../components/trade/TradeUI';
import {
  ExposureBar,
  FlowArea,
  LaneComposed,
  PipelineBar,
  RiskDonut,
} from '../../../components/trade/TradeCharts';
import { formatNumber, formatPercent, formatUsd } from '../../../components/trade/format';

export function TradeAnalyticsPage() {
  const { language } = useI18n();
  const copy = getTradeCopy(language);
  const workspace = useTradeWorkspace();
  const analytics = useMemo(
    () => buildAnalytics({ workflows: workspace.state?.matchWorkflows }),
    [workspace.state?.matchWorkflows],
  );

  const pipelineData = analytics.pipeline.map((point) => ({
    label: copy.matching.stages[point.stage].label,
    valueUsd: point.valueUsd,
    count: point.count,
  }));

  const exposureData = analytics.exposureByCountry.map((point) => ({
    label: point.country[language],
    exposureUsd: point.exposureUsd,
    riskScore: point.riskScore,
  }));

  const laneData = analytics.lanePerformance.map((lane) => ({
    label: lane.label[language],
    onTimePct: lane.onTimePct,
    marginPct: lane.marginPct,
    lane,
  }));

  const riskData = analytics.riskDistribution.map((band) => ({
    label: copy.analytics.riskBand[band.band],
    count: band.count,
    color:
      band.band === 'low'
        ? '#10b981'
        : band.band === 'moderate'
          ? '#06b6d4'
          : band.band === 'elevated'
            ? '#f59e0b'
            : '#f43f5e',
  }));

  const pipelineEmpty = analytics.pipeline.every((point) => point.count === 0);

  if (workspace.loading) {
    return (
      <TradeShell
        active="analytics"
        eyebrow={copy.analytics.eyebrow}
        title={copy.analytics.title}
        subtitle={copy.analytics.subtitle}
      >
        <GlassCard>
          <StatePanel kind="loading" title={copy.common.loading} />
        </GlassCard>
      </TradeShell>
    );
  }

  if (workspace.error) {
    return (
      <TradeShell
        active="analytics"
        eyebrow={copy.analytics.eyebrow}
        title={copy.analytics.title}
        subtitle={copy.analytics.subtitle}
      >
        <GlassCard>
          <StatePanel
            kind="error"
            title={copy.common.errorTitle}
            message={workspace.error}
            onRetry={workspace.reload}
            retryLabel={copy.common.retry}
          />
        </GlassCard>
      </TradeShell>
    );
  }

  return (
    <TradeShell
      active="analytics"
      eyebrow={copy.analytics.eyebrow}
      title={copy.analytics.title}
      subtitle={copy.analytics.subtitle}
    >
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <StatTile
          label={copy.analytics.kpiPipeline}
          value={formatUsd(analytics.totalPipelineValueUsd, language, true)}
          sub={`${formatNumber(analytics.activeMatches, language)} ${copy.matching.results.replace('{count}', '').trim()}`}
          icon={TrendingUp}
          tone="cyan"
        />
        <StatTile
          label={copy.analytics.kpiExposure}
          value={formatUsd(analytics.totalExposureUsd, language, true)}
          sub={`${analytics.exposureByCountry.length} ${copy.analytics.buyers}`}
          icon={Wallet}
          tone="indigo"
        />
        <StatTile
          label={copy.analytics.kpiMargin}
          value={formatPercent(analytics.averageMarginPct, 1)}
          sub={`${formatNumber(analytics.lanePerformance.length, language)} ${copy.analytics.lanes}`}
          icon={Percent}
          tone="lime"
        />
        <StatTile
          label={copy.analytics.kpiMatches}
          value={formatNumber(analytics.activeMatches, language)}
          sub={`${formatNumber(analytics.pipeline.reduce((sum, point) => sum + point.count, 0), language)} ${copy.matching.results.replace('{count}', '').trim()}`}
          icon={Users}
          tone="emerald"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <GlassCard className="p-5 xl:col-span-7">
          <SectionHeading title={copy.analytics.pipeline} hint={copy.analytics.pipelineHint} icon={BarChart3} />
          {pipelineEmpty ? (
            <StatePanel kind="empty" icon={Users} title={copy.analytics.pipelineEmpty} />
          ) : (
            <>
              <div className="mt-3">
                <PipelineBar data={pipelineData} language={language} />
              </div>
              <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-6">
                {analytics.pipeline.map((point) => (
                  <div key={point.stage} className="rounded-lg bg-slate-50/80 px-2 py-1.5 text-center dark:bg-white/[0.04]">
                    <p className="text-[8px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                      {copy.matching.stages[point.stage].label}
                    </p>
                    <p className="mt-0.5 text-[11px] font-extrabold text-slate-900 dark:text-white">
                      {formatNumber(point.count, language)}
                    </p>
                    <p className="text-[8px] text-slate-500 dark:text-slate-400">{formatUsd(point.valueUsd, language, true)}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </GlassCard>

        <GlassCard className="p-5 xl:col-span-5">
          <SectionHeading title={copy.analytics.risk} hint={copy.analytics.riskHint} icon={Gauge} />
          <div className="mt-4">
            <RiskDonut data={riskData} language={language} />
          </div>
          <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-200/70 bg-white/60 px-3 py-2 text-[10px] dark:border-white/10 dark:bg-white/[0.03]">
            <span className="font-semibold text-slate-500 dark:text-slate-400">
              {copy.credit.scoreLabel}
            </span>
            <span className="font-bold text-slate-900 dark:text-white">
              {analytics.riskDistribution.reduce((sum, band) => sum + band.count, 0)} {copy.analytics.buyers}
            </span>
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <GlassCard className="p-5 xl:col-span-5">
          <SectionHeading title={copy.analytics.exposure} hint={copy.analytics.exposureHint} icon={Globe2} />
          {exposureData.length === 0 ? (
            <StatePanel kind="empty" icon={Globe2} title={copy.common.noData} />
          ) : (
            <div className="mt-3">
              <ExposureBar data={exposureData} language={language} />
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-5 xl:col-span-7">
          <SectionHeading title={copy.analytics.flow} hint={copy.analytics.flowHint} icon={DollarSign} />
          <div className="mt-3">
            <FlowArea data={analytics.monthlyFlow} language={language} />
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-5">
        <SectionHeading
          title={copy.analytics.lanes}
          hint={copy.analytics.lanesHint}
          icon={Ship}
          action={
            <Pill tone="slate">
              {formatNumber(analytics.lanePerformance.length, language)} {copy.analytics.lanes}
            </Pill>
          }
        />
        <div className="mt-4 grid gap-5 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <LaneComposed data={laneData} language={language} />
          </div>
          <div className="overflow-x-auto xl:col-span-5">
            <table className="w-full min-w-[420px] border-separate border-spacing-y-1 text-left">
              <thead>
                <tr className="text-[8px] uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                  <th className="px-2 py-1 font-bold">{copy.shipping.lane}</th>
                  <th className="px-2 py-1 font-bold">{copy.analytics.orders}</th>
                  <th className="px-2 py-1 font-bold">{copy.analytics.marginPct}</th>
                  <th className="px-2 py-1 font-bold">{copy.analytics.onTime}</th>
                  <th className="px-2 py-1 font-bold">{copy.analytics.transit}</th>
                  <th className="px-2 py-1 font-bold">{copy.analytics.cost}</th>
                </tr>
              </thead>
              <tbody>
                {analytics.lanePerformance.map((lane) => (
                  <tr key={lane.laneId} className="bg-white/50 text-[9px] dark:bg-white/[0.03]">
                    <td className="rounded-l-lg px-2 py-1.5 font-bold text-slate-800 dark:text-slate-200">
                      {lane.label[language]}
                    </td>
                    <td className="px-2 py-1.5 text-slate-500 dark:text-slate-400">{lane.orders}</td>
                    <td className="px-2 py-1.5 font-semibold text-slate-700 dark:text-slate-300">
                      {formatPercent(lane.marginPct, 1)}
                    </td>
                    <td className="px-2 py-1.5">
                      <span
                        className={`inline-flex rounded px-1 py-0.5 font-bold ${
                          lane.onTimePct >= 85
                            ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
                            : lane.onTimePct >= 70
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-500/10 text-rose-700 dark:text-rose-300'
                        }`}
                      >
                        {formatPercent(lane.onTimePct)}
                      </span>
                    </td>
                    <td className="px-2 py-1.5 text-slate-500 dark:text-slate-400">
                      {lane.avgTransitDays} {copy.common.days}
                    </td>
                    <td className="rounded-r-lg px-2 py-1.5 text-slate-500 dark:text-slate-400">
                      {formatUsd(lane.costPerFeuUsd, language, true)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GlassCard>
    </TradeShell>
  );
}
