import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  FileCheck2,
  FileWarning,
  Percent,
  ShieldAlert,
  ShieldCheck,
  Ship,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { useI18n } from '../../../lib/i18n';
import { getTradeCopy } from '../../../lib/i18n/tradeCopy';
import { useTradeWorkspace } from '../../../hooks/useTradeWorkspace';
import { BUYERS, PRODUCTS, SUPPLIERS, findBuyer, findProduct, findSupplier } from '../../../lib/services/tradeIntelligence/dataset';
import { buildAnalytics } from '../../../lib/services/tradeIntelligence/analytics';
import { rankMatches } from '../../../lib/services/tradeIntelligence/matching';
import { buildTradeAlerts } from '../../../lib/services/tradeIntelligence/alerts';
import { MATCH_STAGES } from '../../../lib/services/tradeIntelligence/workflow';
import {
  GlassCard,
  Meter,
  Pill,
  PrimaryButton,
  ScoreRing,
  SectionHeading,
  StatePanel,
  StatTile,
  TradeShell,
} from '../../../components/trade/TradeUI';
import { formatDateTime, formatNumber, formatUsd } from '../../../components/trade/format';

export function TradeIntelligenceHome() {
  const { language } = useI18n();
  const copy = getTradeCopy(language);
  const navigate = useNavigate();
  const workspace = useTradeWorkspace();
  const analytics = useMemo(
    () => buildAnalytics({ workflows: workspace.state?.matchWorkflows }),
    [workspace.state?.matchWorkflows],
  );
  const matches = useMemo(() => rankMatches(), []);
  const alerts = useMemo(() => buildTradeAlerts(), []);

  const topMatches = useMemo(
    () =>
      matches.slice(0, 3).map((match) => ({
        ...match,
        buyer: findBuyer(match.buyerId),
        product: findProduct(match.productId),
        supplier: findSupplier(match.supplierId),
        stage: workspace.state?.matchWorkflows[match.id]?.stage ?? 'suggested',
      })),
    [matches, workspace.state?.matchWorkflows],
  );

  const latestAssessment = workspace.state?.assessments[0];

  const activity = useMemo(() => {
    if (!workspace.state) return [];
    const items = [
      ...workspace.state.assessments.map((item) => ({
        id: item.id,
        type: 'credit' as const,
        at: item.createdAt,
        title: item.buyerName,
        meta: `${item.score} · ${copy.credit.verdict[item.verdict].label}`,
        href: '/credit',
      })),
      ...workspace.state.quotes.map((item) => ({
        id: item.id,
        type: 'quote' as const,
        at: item.createdAt,
        title: item.reference,
        meta: `${item.buyerName} · ${formatUsd(item.totalUsd, language)}`,
        href: '/toolkit',
      })),
      ...workspace.state.documentChecks.map((item) => ({
        id: item.id,
        type: 'documents' as const,
        at: item.createdAt,
        title: item.productName,
        meta: `${item.readinessPct}% · ${copy.toolkit.docVerdict[item.verdict]}`,
        href: '/toolkit',
      })),
    ];
    return items.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime()).slice(0, 5);
  }, [workspace.state, language, copy]);

  const base = window.location.pathname.startsWith('/dashboard/ultra')
    ? '/dashboard/ultra/trade-intelligence'
    : '/dashboard/trade-intelligence';

  const severityTone = {
    critical: 'rose' as const,
    warning: 'amber' as const,
    info: 'cyan' as const,
  };
  const severityIcon = {
    critical: ShieldAlert,
    warning: AlertTriangle,
    info: Sparkles,
  };

  const modules = [
    {
      icon: ShieldCheck,
      title: copy.overview.creditTitle,
      body: copy.overview.creditBody,
      cta: copy.overview.creditCta,
      href: `${base}/credit`,
      tone: 'from-xisync-blue-900 to-xisync-cyan-600',
    },
    {
      icon: Ship,
      title: copy.overview.shippingTitle,
      body: copy.overview.shippingBody,
      cta: copy.overview.shippingCta,
      href: `${base}/shipping`,
      tone: 'from-xisync-cyan-600 to-xisync-lime-500',
    },
    {
      icon: Users,
      title: copy.overview.matchingTitle,
      body: copy.overview.matchingBody,
      cta: copy.overview.matchingCta,
      href: `${base}/matching`,
      tone: 'from-indigo-700 to-xisync-blue-500',
    },
    {
      icon: BarChart3,
      title: copy.overview.analyticsTitle,
      body: copy.overview.analyticsBody,
      cta: copy.overview.analyticsCta,
      href: `${base}/analytics`,
      tone: 'from-xisync-blue-800 to-teal-500',
    },
    {
      icon: FileCheck2,
      title: copy.overview.toolkitTitle,
      body: copy.overview.toolkitBody,
      cta: copy.overview.toolkitCta,
      href: `${base}/toolkit`,
      tone: 'from-slate-800 to-xisync-cyan-600',
    },
  ];

  return (
    <TradeShell
      active="overview"
      eyebrow={copy.overview.eyebrow}
      title={copy.overview.title}
      subtitle={copy.overview.subtitle}
    >
      {workspace.error && (
        <GlassCard className="border-rose-300/60 p-4 dark:border-rose-400/30">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-rose-600 dark:text-rose-300">
              <AlertTriangle className="h-4 w-4" />
              {copy.common.errorTitle}
            </div>
            <button
              type="button"
              onClick={workspace.reload}
              className="rounded-lg border border-rose-300/60 px-2.5 py-1 text-[10px] font-bold text-rose-600 dark:border-rose-400/30 dark:text-rose-300"
            >
              {copy.common.retry}
            </button>
          </div>
        </GlassCard>
      )}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {workspace.loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <GlassCard key={index} className="p-4">
              <div className="h-2.5 w-16 animate-pulse rounded-full bg-slate-200 dark:bg-white/10" />
              <div className="mt-4 h-6 w-24 animate-pulse rounded-md bg-slate-200/80 dark:bg-white/10" />
              <div className="mt-2 h-2 w-20 animate-pulse rounded-full bg-slate-100 dark:bg-white/5" />
            </GlassCard>
          ))
        ) : (
          <>
            <StatTile
              label={copy.overview.kpiPipeline}
              value={formatUsd(analytics.totalPipelineValueUsd, language, true)}
              sub={copy.matching.results.replace('{count}', formatNumber(analytics.activeMatches, language))}
              icon={TrendingUp}
              tone="cyan"
            />
            <StatTile
              label={copy.overview.kpiExposure}
              value={formatUsd(analytics.totalExposureUsd, language, true)}
              sub={`${analytics.exposureByCountry.length} ${copy.analytics.buyers}`}
              icon={Wallet}
              tone="indigo"
            />
            <StatTile
              label={copy.overview.kpiMargin}
              value={`${analytics.averageMarginPct.toFixed(1)}%`}
              sub={`${formatNumber(analytics.monthlyFlow[analytics.monthlyFlow.length - 1]?.orders ?? 0, language)} ${copy.analytics.orders}`}
              icon={Percent}
              tone="lime"
            />
            <StatTile
              label={copy.overview.kpiMatches}
              value={formatNumber(analytics.activeMatches, language)}
              sub={copy.matching.results.replace('{count}', formatNumber(matches.length, language))}
              icon={Users}
              tone="emerald"
            />
          </>
        )}
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <GlassCard className="p-5">
            <SectionHeading
              title={copy.overview.moduleHeading}
              hint={copy.overview.moduleSubheading}
              icon={Sparkles}
            />
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {modules.map((module) => {
                const Icon = module.icon;
                return (
                  <Link
                    key={module.title}
                    to={module.href}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/70 bg-white/70 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-xisync-cyan-500/40 hover:shadow-[0_22px_50px_-30px_rgba(6,182,212,0.6)] dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-cyan-400/30"
                  >
                    <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-xisync-cyan-400/20 to-transparent blur-2xl transition group-hover:opacity-100" />
                    <div className="flex items-start justify-between gap-3">
                      <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${module.tone} text-white shadow-lg`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-slate-300 transition group-hover:text-xisync-cyan-600 dark:text-slate-600 dark:group-hover:text-cyan-300" />
                    </div>
                    <p className="mt-3 text-[12px] font-extrabold text-slate-900 dark:text-white">{module.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">{module.body}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-xisync-blue-800 dark:text-cyan-300">
                      {module.cta}
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                );
              })}
              <Link
                to={`${base}/matching`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-xisync-blue-900/15 bg-gradient-to-br from-xisync-blue-900 via-xisync-blue-800 to-xisync-cyan-700 p-4 text-white transition hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-30px_rgba(30,58,138,0.9)]"
              >
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/20 blur-2xl" />
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.14em]">
                    <Activity className="h-3 w-3" />
                    {copy.overview.live}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-white/70" />
                </div>
                <div className="mt-4">
                  <p className="text-[12px] font-extrabold">{topMatches[0]?.product?.name[language] ?? copy.overview.matchingTitle}</p>
                  <p className="mt-1 text-[10px] text-cyan-100/80">
                    {topMatches[0]?.buyer?.name[language] ?? copy.overview.matchingBody}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <Meter value={topMatches[0]?.score ?? 0} tone="lime" height="h-1" />
                    <span className="text-[10px] font-bold">{topMatches[0]?.score ?? 0}</span>
                  </div>
                </div>
              </Link>
            </div>
          </GlassCard>
        </div>

        <div className="xl:col-span-4">
          <GlassCard className="h-full p-5">
            <SectionHeading title={copy.overview.signals} hint={copy.overview.signalsSubtitle} icon={ShieldAlert} />
            <div className="mt-4 space-y-2.5">
              {alerts.slice(0, 4).map((alert) => {
                const Icon = severityIcon[alert.severity];
                return (
                  <div
                    key={alert.id}
                    className="rounded-xl border border-slate-200/70 bg-white/60 p-3 transition hover:border-slate-300/80 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                        <Icon className="h-3.5 w-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <Pill tone={severityTone[alert.severity]}>{copy.toolkit.severity[alert.severity]}</Pill>
                          <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate-400">
                            {copy.toolkit.category[alert.category]}
                          </span>
                        </div>
                        <p className="mt-1 text-[11px] font-bold leading-snug text-slate-900 dark:text-white">
                          {alert.title[language]}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                          {alert.detail[language]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <Link
                to={`${base}/toolkit`}
                className="flex items-center justify-center gap-1 rounded-xl border border-dashed border-slate-300/80 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-slate-500 transition hover:border-xisync-cyan-500/50 hover:text-xisync-cyan-700 dark:border-white/10 dark:text-slate-400 dark:hover:text-cyan-300"
              >
                {copy.common.viewAll}
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <GlassCard className="h-full p-5">
            <SectionHeading
              title={copy.overview.activity}
              hint={copy.overview.activityEmpty}
              icon={Clock3}
              action={
                latestAssessment && (
                  <Pill tone="emerald">
                    <CheckCircle2 className="h-3 w-3" />
                    {copy.common.persisted}
                  </Pill>
                )
              }
            />
            {activity.length === 0 ? (
              <StatePanel
                kind="empty"
                icon={Sparkles}
                title={copy.overview.activityEmpty}
                message={copy.overview.noAssessments}
              >
                <PrimaryButton onClick={() => navigate(`${base}/credit`)}>
                  {copy.overview.creditCta}
                </PrimaryButton>
              </StatePanel>
            ) : (
              <ul className="mt-3 divide-y divide-slate-200/70 dark:divide-white/5">
                {activity.map((item) => {
                  const Icon = item.type === 'credit' ? ShieldCheck : item.type === 'quote' ? FileCheck2 : FileWarning;
                  return (
                    <li key={item.id}>
                      <Link
                        to={`${base}${item.href}`}
                        className="flex items-center gap-3 py-3 transition hover:opacity-80"
                      >
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-300">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-bold text-slate-900 dark:text-white">{item.title}</p>
                          <p className="mt-0.5 text-[10px] text-slate-500 dark:text-slate-400">{item.meta}</p>
                        </div>
                        <span className="shrink-0 text-[9px] font-semibold text-slate-400">
                          {formatDateTime(item.at, language)}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </GlassCard>
        </div>

        <div className="xl:col-span-5">
          <GlassCard className="h-full p-5">
            <SectionHeading
              title={copy.overview.lastAssessment}
              hint={latestAssessment ? latestAssessment.buyerName : copy.overview.noAssessments}
              icon={ShieldCheck}
              action={
                <Link
                  to={`${base}/credit`}
                  className="text-[10px] font-bold uppercase tracking-[0.1em] text-xisync-blue-800 dark:text-cyan-300"
                >
                  {copy.credit.assess}
                </Link>
              }
            />
            {latestAssessment ? (
              <div className="mt-4 flex items-center gap-4">
                <ScoreRing
                  score={latestAssessment.score}
                  size={124}
                  verdict={
                    latestAssessment.score >= 75 ? 'good' : latestAssessment.score >= 55 ? 'watch' : 'risk'
                  }
                  caption={copy.credit.scoreLabel}
                />
                <div className="min-w-0 flex-1 space-y-2">
                  <Pill
                    tone={
                      latestAssessment.verdict === 'eligible'
                        ? 'emerald'
                        : latestAssessment.verdict === 'conditional'
                          ? 'cyan'
                          : latestAssessment.verdict === 'referred'
                            ? 'amber'
                            : 'rose'
                    }
                  >
                    {copy.credit.verdict[latestAssessment.verdict].label}
                  </Pill>
                  <p className="text-[10px] leading-relaxed text-slate-500 dark:text-slate-400">
                    {copy.credit.verdict[latestAssessment.verdict].hint}
                  </p>
                  <div className="flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                    <Clock3 className="h-3 w-3" />
                    {formatDateTime(latestAssessment.createdAt, language)}
                  </div>
                </div>
              </div>
            ) : (
              <StatePanel
                kind="empty"
                icon={ShieldCheck}
                title={copy.overview.noAssessments}
                message={copy.credit.resultEmpty}
              />
            )}

            <div className="mt-5 border-t border-slate-200/70 pt-4 dark:border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
                {copy.matching.board}
              </p>
              <div className="mt-2.5 grid grid-cols-3 gap-1.5">
                {MATCH_STAGES.slice(0, 3).map((stage) => {
                  const count = analytics.pipeline.find((point) => point.stage === stage)?.count ?? 0;
                  return (
                    <div key={stage} className="rounded-lg bg-slate-50 px-2 py-2 text-center dark:bg-white/[0.04]">
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">{count}</p>
                      <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.08em] text-slate-500 dark:text-slate-400">
                        {copy.matching.stages[stage].label}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard className="p-5">
        <SectionHeading
          title={copy.matching.title}
          hint={copy.matching.subtitle}
          icon={Users}
          action={
            <Link
              to={`${base}/matching`}
              className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.1em] text-xisync-blue-800 dark:text-cyan-300"
            >
              {copy.overview.matchingCta}
              <ArrowRight className="h-3 w-3" />
            </Link>
          }
        />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {topMatches.map((match) => (
            <Link
              key={match.id}
              to={`${base}/matching`}
              className="group rounded-2xl border border-slate-200/70 bg-white/60 p-4 transition hover:-translate-y-0.5 hover:border-xisync-cyan-500/40 dark:border-white/10 dark:bg-white/[0.03]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-extrabold text-slate-900 dark:text-white">
                    {match.buyer?.name[language]}
                  </p>
                  <p className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-400">
                    {match.product?.name[language]} · {match.supplier?.city[language]}
                  </p>
                </div>
                <Pill tone={match.stage === 'won' ? 'emerald' : match.stage === 'lost' ? 'rose' : 'cyan'}>
                  {copy.matching.stages[match.stage].label}
                </Pill>
              </div>
              <div className="mt-3 flex items-center justify-between text-[9px] font-bold uppercase tracking-[0.1em] text-slate-500 dark:text-slate-400">
                <span>{copy.matching.score}</span>
                <span className="text-slate-900 dark:text-white">{match.score}</span>
              </div>
              <div className="mt-1.5">
                <Meter value={match.score} tone={match.score >= 85 ? 'lime' : match.score >= 70 ? 'cyan' : 'amber'} />
              </div>
            </Link>
          ))}
        </div>
      </GlassCard>

      <p className="px-1 text-center text-[10px] text-slate-500 dark:text-slate-400">
        {BUYERS.length} buyers · {SUPPLIERS.length} suppliers · {PRODUCTS.length} products · {copy.common.persisted}
      </p>
    </TradeShell>
  );
}
