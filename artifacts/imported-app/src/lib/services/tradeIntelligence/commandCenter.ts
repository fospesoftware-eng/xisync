import type {
  Buyer,
  Bilingual,
  CommandAction,
  CommandCenterSnapshot,
  CommandKpi,
  DailySnapshot,
  Lane,
  MatchCandidate,
  MatchStage,
  MatchWorkflow,
  OrderRecord,
  PipelineColumn,
  SavedAssessment,
  SavedDocumentCheck,
  SavedQuote,
  ShipmentRiskCard,
} from '../../../types/tradeIntelligence.ts';
import { BUYERS, LANES, MONTHLY_REVENUE, ORDERS, PRODUCTS, findProduct, laneLabel } from './dataset.ts';
import { detectOrderAnomalies, laneTransitDays } from './alerts.ts';
import { rankMatches } from './matching.ts';
import { predictShipping } from './shipping.ts';
import { ACTIVE_STAGES, MATCH_STAGES } from './workflow.ts';
import {
  compareDelta,
  findPriorSnapshot,
  snapshotDate,
  type PriorSnapshot,
} from './snapshots.ts';

const DAY_MS = 86_400_000;
const STALE_MATCH_DAYS = 7;

export interface CommandCenterInput {
  workflows?: Record<string, MatchWorkflow>;
  assessments?: SavedAssessment[];
  documentChecks?: SavedDocumentCheck[];
  quotes?: SavedQuote[];
  buyers?: Buyer[];
  orders?: OrderRecord[];
  lanes?: Lane[];
  matches?: MatchCandidate[];
  snapshots?: DailySnapshot[];
  now?: Date;
}

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

function average(values: number[]): number {
  return values.length === 0 ? 0 : sum(values) / values.length;
}

function monthOf(iso: string): string {
  return iso.slice(0, 7);
}

function daysSince(iso: string, now: Date): number {
  const at = new Date(iso).getTime();
  if (Number.isNaN(at)) return 0;
  return Math.max(0, Math.floor((now.getTime() - at) / DAY_MS));
}

function money(value: number, language: 'en' | 'zh'): string {
  if (language === 'zh') {
    if (value >= 100_000_000) return `${(value / 100_000_000).toFixed(2)} 亿美元`;
    if (value >= 10_000) return `${Math.round(value / 10_000)} 万美元`;
    return `USD ${Math.round(value)}`;
  }
  if (value >= 1_000_000) return `USD ${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `USD ${Math.round(value / 1_000)}k`;
  return `USD ${Math.round(value)}`;
}

function signedMoney(value: number, language: 'en' | 'zh'): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${money(Math.abs(value), language)}`;
}

function stageOf(workflows: Record<string, MatchWorkflow>, matchId: string): MatchStage {
  return workflows[matchId]?.stage ?? 'suggested';
}

/**
 * Age in days of the current stage. Persisted workflows age from their last
 * transition; untouched suggestions age from the seeded date they entered the
 * queue, so a row that was never opened can still be flagged stale.
 */
function matchAge(
  match: MatchCandidate,
  workflows: Record<string, MatchWorkflow>,
  now: Date,
): { stage: MatchStage; age: number } {
  const workflow = workflows[match.id];
  if (workflow) return { stage: workflow.stage, age: daysSince(workflow.updatedAt, now) };
  return { stage: 'suggested', age: Math.max(0, match.suggestedAgeDays ?? 0) };
}

function buildExposure(
  buyers: Buyer[],
  openOrders: OrderRecord[],
): CommandCenterSnapshot['exposure'] {
  const buyerById = new Map(buyers.map((buyer) => [buyer.id, buyer]));
  let insuredUsd = 0;
  let uninsuredUsd = 0;

  for (const buyer of buyers) {
    const open = openOrders
      .filter((order) => order.buyerId === buyer.id)
      .reduce((total, order) => total + order.valueUsd, 0);
    if (open === 0) continue;
    const insured = Math.min(open, buyer.insuredLimitUsd);
    insuredUsd += insured;
    uninsuredUsd += open - insured;
  }

  const countryMap = new Map<string, { exposureUsd: number; riskScores: number[] }>();
  for (const order of openOrders) {
    const buyer = buyerById.get(order.buyerId);
    if (!buyer) continue;
    const entry = countryMap.get(buyer.countryCode) ?? { exposureUsd: 0, riskScores: [] };
    entry.exposureUsd += order.valueUsd;
    entry.riskScores.push(buyer.countryRiskScore);
    countryMap.set(buyer.countryCode, entry);
  }
  const topCountry = [...countryMap.entries()]
    .map(([code, entry]) => {
      const buyer = buyers.find((item) => item.countryCode === code);
      return {
        country: buyer?.country ?? { en: code, zh: code },
        exposureUsd: entry.exposureUsd,
        riskScore: Math.round(average(entry.riskScores)),
      };
    })
    .sort((a, b) => b.exposureUsd - a.exposureUsd)[0];

  return {
    insuredUsd,
    uninsuredUsd,
    committedUsd: sum(openOrders.map((order) => order.valueUsd)),
    pipelineUsd: 0,
    largest: topCountry ?? null,
  };
}

function buildKpis(
  orders: OrderRecord[],
  openOrders: OrderRecord[],
  prior: PriorSnapshot | null,
): CommandKpi[] {
  const months = MONTHLY_REVENUE.map((point) => point.month);

  const revenueSeries = MONTHLY_REVENUE.map((point) => point.revenueUsd);
  const orderSeries = MONTHLY_REVENUE.map((point) => point.orders);
  const marginSeries = months.map((month) =>
    average(orders.filter((order) => monthOf(order.shippedAt) === month).map((order) => order.marginPct)),
  );
  const exposureSeries = months.map((month) =>
    sum(openOrders.filter((order) => monthOf(order.shippedAt) === month).map((order) => order.valueUsd)),
  );

  const latestMargin = marginSeries[marginSeries.length - 1] || average(orders.map((order) => order.marginPct));
  const previous = prior?.snapshot.kpis ?? null;
  const baselineDate = prior?.snapshot.date;

  const base: Pick<CommandKpi, 'baselineDate'> = baselineDate ? { baselineDate } : {};

  return [
    {
      key: 'revenue',
      label: { en: 'Booked revenue', zh: '已入账营收' },
      value: revenueSeries[revenueSeries.length - 1] ?? 0,
      unit: 'usd',
      deltaPct: compareDelta(revenueSeries[revenueSeries.length - 1] ?? 0, previous?.revenueUsd),
      series: revenueSeries,
      ...base,
    },
    {
      key: 'exposure',
      label: { en: 'Open exposure', zh: '在途风险敞口' },
      value: sum(openOrders.map((order) => order.valueUsd)),
      unit: 'usd',
      deltaPct: compareDelta(
        sum(openOrders.map((order) => order.valueUsd)),
        previous?.openExposureUsd,
      ),
      series: exposureSeries,
      ...base,
    },
    {
      key: 'margin',
      label: { en: 'Average margin', zh: '平均利润率' },
      value: Math.round(latestMargin * 10) / 10,
      unit: 'pct',
      deltaPct: compareDelta(Math.round(latestMargin * 10) / 10, previous?.marginPct),
      series: marginSeries.map((value) => Math.round(value * 10) / 10),
      ...base,
    },
    {
      key: 'orders',
      label: { en: 'Order intake', zh: '月度订单量' },
      value: orderSeries[orderSeries.length - 1] ?? 0,
      unit: 'count',
      deltaPct: compareDelta(orderSeries[orderSeries.length - 1] ?? 0, previous?.orderIntake),
      series: orderSeries,
      ...base,
    },
  ];
}

function buildCreditActions(
  buyers: Buyer[],
  assessments: SavedAssessment[],
  now: Date,
): CommandAction[] {
  const actions: CommandAction[] = [];
  const byBuyer = new Map<string, SavedAssessment[]>();
  for (const assessment of assessments) {
    const key = assessment.buyerId ?? assessment.buyerName;
    byBuyer.set(key, [...(byBuyer.get(key) ?? []), assessment]);
  }

  for (const [key, items] of byBuyer) {
    const sorted = [...items].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
    const latest = sorted[0];
    const previous = sorted[1];
    if (latest && previous && latest.score < previous.score - 4) {
      const drop = previous.score - latest.score;
      actions.push({
        id: `credit-drop-${key}`,
        category: 'credit',
        severity: drop >= 12 ? 'critical' : 'warning',
        priority: 62 + drop,
        title: {
          en: `Credit score degraded: ${latest.buyerName}`,
          zh: `信用评分下降：${latest.buyerName}`,
        },
        reason: {
          en: `Score moved from ${previous.score} to ${latest.score} across the last two saved assessments. Re-run with current documents before booking.`,
          zh: `最近两次评估评分由 ${previous.score} 降至 ${latest.score}，建议按最新单证重跑后再安排出运。`,
        },
        module: 'credit',
      });
    }
    if (latest && (latest.verdict === 'referred' || latest.verdict === 'declined')) {
      const critical = latest.verdict === 'declined';
      actions.push({
        id: `credit-verdict-${key}`,
        category: 'credit',
        severity: critical ? 'critical' : 'warning',
        priority: critical ? 94 : 76,
        title: {
          en: `Credit ${critical ? 'declined' : 'referred'}: ${latest.buyerName}`,
          zh: `信用${critical ? '拒批' : '转人工'}：${latest.buyerName}`,
        },
        reason: {
          en: `Latest saved assessment scored ${latest.score} (${latest.verdict}). Resolve the top factor before extending terms.`,
          zh: `最新评估得分 ${latest.score}（${latest.verdict}），请在授信前处理首要风险因子。`,
        },
        module: 'credit',
      });
    }
    if (latest && daysSince(latest.createdAt, now) > 45) {
      actions.push({
        id: `credit-stale-${key}`,
        category: 'credit',
        severity: 'info',
        priority: 48,
        title: {
          en: `Credit review is ${daysSince(latest.createdAt, now)} days old: ${latest.buyerName}`,
          zh: `信用评估已 ${daysSince(latest.createdAt, now)} 天未更新：${latest.buyerName}`,
        },
        reason: {
          en: 'Country risk and payment behaviour change faster than this review cycle. Refresh the assessment to keep cover valid.',
          zh: '国别风险与付款表现变化快于当前复核周期，请刷新评估以维持有效承保。',
        },
        module: 'credit',
      });
    }
  }

  for (const buyer of buyers) {
    if (!buyer.sanctionsFlag && buyer.countryRiskScore >= 55) continue;
    if (byBuyer.has(buyer.id)) continue;
    actions.push({
      id: `credit-unassessed-${buyer.id}`,
      category: 'credit',
      severity: buyer.sanctionsFlag ? 'critical' : 'warning',
      priority: buyer.sanctionsFlag ? 96 : 72,
      title: {
        en: buyer.sanctionsFlag
          ? `Sanctions flag with no current cover: ${buyer.name.en}`
          : `High country risk not underwritten: ${buyer.name.en}`,
        zh: buyer.sanctionsFlag
          ? `制裁命中且无有效承保：${buyer.name.zh}`
          : `高国别风险尚未承保：${buyer.name.zh}`,
      },
      reason: {
        en: buyer.sanctionsFlag
          ? 'Screening hit is unresolved and no saved credit assessment exists for this party.'
          : `${buyer.country.en} scores ${buyer.countryRiskScore}/100 and no credit assessment has been saved.`,
        zh: buyer.sanctionsFlag
          ? '筛查命中尚未处理，且该主体没有已保存的信用评估。'
          : `${buyer.country.zh} 国别风险评分 ${buyer.countryRiskScore}/100，且尚未保存信用评估。`,
      },
      module: 'credit',
    });
  }

  return actions;
}

function buildLimitActions(buyers: Buyer[], openOrders: OrderRecord[]): CommandAction[] {
  const actions: CommandAction[] = [];
  for (const buyer of buyers) {
    const open = openOrders
      .filter((order) => order.buyerId === buyer.id)
      .reduce((total, order) => total + order.valueUsd, 0);
    const excess = open - buyer.insuredLimitUsd;
    if (excess <= 0) continue;
    const ratio = open / Math.max(1, buyer.insuredLimitUsd);
    actions.push({
      id: `limit-${buyer.id}`,
      category: 'credit',
      severity: ratio > 1.5 ? 'critical' : 'warning',
      priority: Math.min(92, 60 + ratio * 14),
      title: {
        en: `Uninsured exposure: ${buyer.name.en}`,
        zh: `未承保敞口：${buyer.name.zh}`,
      },
      reason: {
        en: `${money(open, 'en')} open against a ${money(buyer.insuredLimitUsd, 'en')} insured limit — ${money(excess, 'en')} is uncovered (${ratio.toFixed(2)}x).`,
        zh: `在途敞口 ${money(open, 'zh')}，投保限额 ${money(buyer.insuredLimitUsd, 'zh')}，未覆盖 ${money(excess, 'zh')}（${ratio.toFixed(2)} 倍）。`,
      },
      impactUsd: excess,
      module: 'credit',
    });
  }
  return actions;
}

function buildTransitActions(
  openOrders: OrderRecord[],
  lanes: Lane[],
  buyers: Buyer[],
  now: Date,
): { actions: CommandAction[]; shipments: ShipmentRiskCard[] } {
  const laneById = new Map(lanes.map((lane) => [lane.id, lane]));
  const buyerById = new Map(buyers.map((buyer) => [buyer.id, buyer]));
  const actions: CommandAction[] = [];
  const shipments: ShipmentRiskCard[] = [];

  for (const order of openOrders) {
    const lane = laneById.get(order.laneId);
    const buyer = buyerById.get(order.buyerId);
    if (!lane || !buyer) continue;

    const prediction = predictShipping({
      originCode: lane.originCode,
      destinationCode: lane.destinationCode,
      mode: order.mode,
      containerType: '40ft',
      weightKg: 18_000,
      volumeCbm: 55,
      incoterm: order.incoterm,
      month: now.getMonth() + 1,
      fuelSurchargePct: 6,
      peakSeason: false,
      portCongestion: lane.congestion,
      cargoValueUsd: order.valueUsd,
    });

    const plannedDays = laneTransitDays(lane);
    const estimate = prediction.selected;
    const slipDays = estimate.transitHighDays - plannedDays;
    const uninsured = order.valueUsd > buyer.insuredLimitUsd;

    const flags: ShipmentRiskCard['flags'] = [];
    if (order.status === 'exception') {
      flags.push({
        key: 'exception',
        label: { en: 'Operational exception', zh: '操作异常' },
      });
    }
    if (uninsured) {
      flags.push({ key: 'uninsured', label: { en: 'Above insured limit', zh: '超出投保限额' } });
    }
    if (lane.congestion === 'high') {
      flags.push({ key: 'congestion', label: { en: 'Port congestion', zh: '港口拥堵' } });
    }
    if (slipDays >= 2) {
      flags.push({
        key: 'transit_slip',
        label: {
          en: `Transit slipping +${Math.max(0, slipDays)}d`,
          zh: `时效延后 +${Math.max(0, slipDays)} 天`,
        },
      });
    }
    if (buyer.documentsCompletePct < 70) {
      flags.push({ key: 'documents', label: { en: 'Document gap', zh: '单证缺口' } });
    }

    const critical = order.status === 'exception' || flags.some((flag) => flag.key === 'exception');
    shipments.push({
      orderId: order.id,
      buyerName: buyer.name,
      laneLabel: laneLabel(lane),
      mode: order.mode,
      valueUsd: order.valueUsd,
      status: order.status,
      insured: !uninsured,
      transitLowDays: estimate.transitLowDays,
      transitHighDays: estimate.transitHighDays,
      plannedDays,
      slipDays,
      riskLevel: critical ? 'critical' : flags.length > 0 ? 'warning' : 'clear',
      flags,
    });

    if (order.status === 'exception') {
      actions.push({
        id: `transit-exception-${order.id}`,
        category: 'logistics',
        severity: 'critical',
        priority: 88,
        title: {
          en: `Shipment exception: ${order.id}`,
          zh: `在途异常：${order.id}`,
        },
        reason: {
          en: `${buyer.name.en} · ${laneLabel(lane).en} is in exception status with ${money(order.valueUsd, 'en')} at risk.`,
          zh: `${buyer.name.zh} · ${laneLabel(lane).zh} 处于异常状态，风险货值 ${money(order.valueUsd, 'zh')}。`,
        },
        impactUsd: order.valueUsd,
        module: 'shipping',
      });
    } else if (slipDays >= 3) {
      actions.push({
        id: `transit-slip-${order.id}`,
        category: 'logistics',
        severity: 'warning',
        priority: 52 + slipDays * 3,
        title: {
          en: `Transit may slip ${slipDays} days: ${order.id}`,
          zh: `预计时效延后 ${slipDays} 天：${order.id}`,
        },
        reason: {
          en: `Predicted window is ${estimate.transitLowDays}–${estimate.transitHighDays} days versus ${plannedDays} planned on ${laneLabel(lane).en}.`,
          zh: `预测运输窗口 ${estimate.transitLowDays}–${estimate.transitHighDays} 天，原计划 ${plannedDays} 天（${laneLabel(lane).zh}）。`,
        },
        impactUsd: order.valueUsd,
        module: 'shipping',
      });
    }
  }

  shipments.sort((a, b) => {
    if (a.riskLevel !== b.riskLevel) {
      const order = { critical: 0, warning: 1, clear: 2 };
      return order[a.riskLevel] - order[b.riskLevel];
    }
    return b.valueUsd - a.valueUsd;
  });

  return { actions, shipments: shipments.slice(0, 8) };
}

function buildMatchActions(
  matches: MatchCandidate[],
  workflows: Record<string, MatchWorkflow>,
  buyers: Buyer[],
  now: Date,
): CommandAction[] {
  const buyerById = new Map(buyers.map((buyer) => [buyer.id, buyer]));
  const actions: CommandAction[] = [];
  for (const match of matches) {
    const { stage, age } = matchAge(match, workflows, now);
    if (!ACTIVE_STAGES.includes(stage)) continue;
    if (age < STALE_MATCH_DAYS) continue;
    const buyer = buyerById.get(match.buyerId);
    const untouched = !workflows[match.id];
    actions.push({
      id: `match-stale-${match.id}`,
      category: 'matching',
      severity: age >= 14 ? 'warning' : 'info',
      priority: untouched ? Math.min(74, 42 + age * 2) : Math.min(78, 46 + age * 2),
      title: untouched
        ? {
            en: `Suggestion untouched ${age} days`,
            zh: `撮合建议已 ${age} 天未处理`,
          }
        : {
            en: `Match idle ${age} days in ${stage}`,
            zh: `撮合在 ${stage} 阶段停留 ${age} 天`,
          },
      reason: untouched
        ? {
            en: `${buyer?.name.en ?? match.buyerId} scored ${match.score} when suggested ${age} days ago and has no recorded next step.`,
            zh: `${buyer?.name.zh ?? match.buyerId} ${age} 天前匹配得分 ${match.score}，目前仍无跟进记录。`,
          }
        : {
            en: `${buyer?.name.en ?? match.buyerId} scored ${match.score}; advance, re-qualify or close it so the pipeline stays honest.`,
            zh: `${buyer?.name.zh ?? match.buyerId} 匹配得分 ${match.score}，请推进、重新评估或关闭，保持管道真实。`,
          },
      impactUsd: buyer?.orderValueUsd,
      module: 'matching',
    });
  }
  return actions.sort((a, b) => b.priority - a.priority).slice(0, 2);
}

function buildDocumentActions(
  documentChecks: SavedDocumentCheck[],
  buyers: Buyer[],
): CommandAction[] {
  const actions: CommandAction[] = [];
  const sorted = [...documentChecks].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const latest = sorted[0];
  if (latest && latest.verdict !== 'ready') {
    const blocked = latest.verdict === 'blocked';
    actions.push({
      id: `doc-${latest.id}`,
      category: 'documents',
      severity: blocked ? 'critical' : 'warning',
      priority: blocked ? 86 : 64,
      title: {
        en: `Document set ${blocked ? 'blocked' : 'conditional'}: ${latest.productName}`,
        zh: `单证${blocked ? '被阻断' : '有条件通过'}：${latest.productName}`,
      },
      reason: {
        en: `Latest readiness check scored ${latest.readinessPct}% for the ${latest.market.toUpperCase()} market.`,
        zh: `最近一次就绪度检查得分 ${latest.readinessPct}%（${latest.market.toUpperCase()} 市场）。`,
      },
      module: 'toolkit',
    });
  }

  const gapped = [...buyers]
    .filter((buyer) => buyer.documentsCompletePct < 70)
    .sort((a, b) => a.documentsCompletePct - b.documentsCompletePct)[0];
  if (gapped) {
    actions.push({
      id: `doc-buyer-${gapped.id}`,
      category: 'documents',
      severity: 'warning',
      priority: 58,
      title: {
        en: `Documentation gap: ${gapped.name.en}`,
        zh: `单证缺口：${gapped.name.zh}`,
      },
      reason: {
        en: `Only ${gapped.documentsCompletePct}% of required documents are on file; customs holds are likely.`,
        zh: `必备单证完整度仅 ${gapped.documentsCompletePct}%，存在海关扣关风险。`,
      },
      module: 'toolkit',
    });
  }
  return actions;
}

function buildAnomalyActions(
  orders: OrderRecord[],
  buyers: Buyer[],
  lanes: Lane[],
): CommandAction[] {
  return detectOrderAnomalies(orders, buyers, lanes)
    .slice(0, 2)
    .map((anomaly) => ({
      id: `anomaly-${anomaly.orderId}`,
      category: 'anomaly' as const,
      severity: anomaly.score >= 80 ? ('critical' as const) : ('warning' as const),
      priority: Math.min(84, 44 + anomaly.score / 2),
      title: {
        en: `Order anomaly: ${anomaly.orderId}`,
        zh: `订单异常：${anomaly.orderId}`,
      },
      reason: anomaly.detail,
      impactUsd: orders.find((order) => order.id === anomaly.orderId)?.valueUsd,
      module: 'toolkit' as const,
    }));
}

/**
 * Day-over-day narrative built only from the stored books. When no prior-day
 * snapshot exists we say so explicitly rather than fabricating a comparison.
 */
function buildChangeLine(
  exposure: CommandCenterSnapshot['exposure'],
  actions: CommandAction[],
  pipeline: PipelineColumn[],
  prior: PriorSnapshot | null,
): Bilingual {
  if (!prior) {
    return {
      en: 'First run for this book: no prior-day snapshot is stored yet, so today becomes the baseline and day-over-day deltas start tomorrow.',
      zh: '该账本首次运行：尚无前一日快照，今日将作为基准，明日起展示日环比。',
    };
  }

  const previous = prior.snapshot;
  const currentBook = exposure.committedUsd + exposure.pipelineUsd;
  const priorBook = previous.exposure.committedUsd + previous.exposure.pipelineUsd;
  const bookDelta = currentBook - priorBook;
  const bookPct = compareDelta(currentBook, priorBook) ?? 0;
  const critical = actions.filter((action) => action.severity === 'critical').length;
  const warning = actions.filter((action) => action.severity === 'warning').length;
  const liveMatches = pipeline.reduce((total, column) => total + column.count, 0);
  const priorMatches = previous.pipeline.reduce((total, column) => total + column.count, 0);
  const matchDelta = liveMatches - priorMatches;
  const pctSign = bookPct > 0 ? '+' : '';
  const when =
    prior.daysAgo === 1
      ? { en: 'Since yesterday', zh: '较昨日' }
      : {
          en: `Versus ${previous.date} (${prior.daysAgo} days ago)`,
          zh: `对比 ${previous.date}（${prior.daysAgo} 天前）`,
        };

  return {
    en: `${when.en}: book exposure ${signedMoney(bookDelta, 'en')} (${pctSign}${bookPct}%), ${critical} critical and ${warning} watch signals versus ${previous.actions.critical}/${previous.actions.warning}, ${liveMatches} live matches (${matchDelta > 0 ? '+' : ''}${matchDelta}).`,
    zh: `${when.zh}：业务敞口 ${signedMoney(bookDelta, 'zh')}（${pctSign}${bookPct}%），${critical} 项紧急、${warning} 项关注（前值 ${previous.actions.critical}/${previous.actions.warning}），在谈撮合 ${liveMatches} 项（${matchDelta > 0 ? '+' : ''}${matchDelta}）。`,
  };
}

function buildBriefing(
  actions: CommandAction[],
  exposure: CommandCenterSnapshot['exposure'],
  pipeline: PipelineColumn[],
  matches: MatchCandidate[],
  workflows: Record<string, MatchWorkflow>,
  buyers: Buyer[],
  shipments: ShipmentRiskCard[],
  prior: PriorSnapshot | null,
  now: Date,
): CommandCenterSnapshot['briefing'] {
  const buyerById = new Map(buyers.map((buyer) => [buyer.id, buyer]));
  const critical = actions.filter((action) => action.severity === 'critical').length;
  const warning = actions.filter((action) => action.severity === 'warning').length;
  const uninsuredShare =
    exposure.committedUsd > 0
      ? Math.round((exposure.uninsuredUsd / exposure.committedUsd) * 100)
      : 0;

  const headline: Bilingual = {
    en: `${critical} critical and ${warning} watch signals · ${uninsuredShare}% of open exposure is uninsured`,
    zh: `${critical} 项紧急、${warning} 项关注信号 · 在途敞口 ${uninsuredShare}% 未承保`,
  };

  const changed = buildChangeLine(exposure, actions, pipeline, prior);

  const largest: Bilingual = exposure.largest
    ? {
        en: `Largest concentration is ${exposure.largest.country.en} at ${money(exposure.largest.exposureUsd, 'en')} across open shipments, country risk ${exposure.largest.riskScore}/100.`,
        zh: `最大敞口集中在${exposure.largest.country.zh}，在途金额 ${money(exposure.largest.exposureUsd, 'zh')}，国别风险 ${exposure.largest.riskScore}/100。`,
      }
    : {
        en: 'No open shipments are currently carrying exposure.',
        zh: '当前没有在途订单产生风险敞口。',
      };

  const openMatches = matches
    .filter((match) => ACTIVE_STAGES.includes(stageOf(workflows, match.id)))
    .sort((a, b) => b.score - a.score);
  const best = openMatches[0] ?? matches.slice().sort((a, b) => b.score - a.score)[0];
  const matchLine: Bilingual = best
    ? {
        en: `Best open match: ${buyerById.get(best.buyerId)?.name.en ?? best.buyerId} at ${best.score} in ${stageOf(workflows, best.id)} — the strongest demand signal not yet won.`,
        zh: `最佳在谈撮合：${buyerById.get(best.buyerId)?.name.zh ?? best.buyerId}，得分 ${best.score}，处于 ${stageOf(workflows, best.id)} 阶段，是尚未赢单的最强需求信号。`,
      }
    : {
        en: 'No open matches qualified above the current threshold.',
        zh: '当前没有达到阈值的在谈撮合。',
      };

  const slipping = shipments.filter((shipment) => shipment.slipDays >= 2).length;
  const logistics: Bilingual =
    slipping > 0
      ? {
          en: `${slipping} of ${shipments.length} monitored shipments are predicted to miss their planned transit window.`,
          zh: `监控的 ${shipments.length} 票货物中有 ${slipping} 票预计无法达到计划时效。`,
        }
      : {
          en: `All ${shipments.length} monitored shipments are tracking inside their planned transit windows.`,
          zh: `监控的 ${shipments.length} 票货物均在计划时效内。`,
        };

  return {
    headline,
    lines: [changed, largest, matchLine, logistics],
    generatedAt: now.toISOString(),
  };
}

/**
 * Deterministic command-centre aggregation. Every number, action and sentence is
 * derived from the same trade dataset and persisted workspace, so the dashboard
 * can be rebuilt identically from a snapshot.
 */
export function buildCommandCenter(input: CommandCenterInput = {}): CommandCenterSnapshot {
  const now = input.now ?? new Date();
  const buyers = input.buyers ?? BUYERS;
  const orders = input.orders ?? ORDERS;
  const lanes = input.lanes ?? LANES;
  const workflows = input.workflows ?? {};
  const assessments = input.assessments ?? [];
  const documentChecks = input.documentChecks ?? [];
  const matches = input.matches ?? rankMatches(buyers, PRODUCTS);
  const prior = findPriorSnapshot(input.snapshots ?? [], snapshotDate(now));

  const openOrders = orders.filter((order) => order.status !== 'delivered');
  const exposure = buildExposure(buyers, openOrders);
  const buyerById = new Map(buyers.map((buyer) => [buyer.id, buyer]));

  exposure.pipelineUsd = matches
    .filter((match) => ACTIVE_STAGES.includes(stageOf(workflows, match.id)))
    .reduce((total, match) => total + (buyerById.get(match.buyerId)?.orderValueUsd ?? 0), 0);

  const { actions: transitActions, shipments } = buildTransitActions(openOrders, lanes, buyers, now);
  const actions = [
    ...buildCreditActions(buyers, assessments, now),
    ...buildLimitActions(buyers, openOrders),
    ...transitActions,
    ...buildMatchActions(matches, workflows, buyers, now),
    ...buildDocumentActions(documentChecks, buyers),
    ...buildAnomalyActions(orders, buyers, lanes),
  ]
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 10);

  const pipeline: PipelineColumn[] = MATCH_STAGES.filter((stage) => ACTIVE_STAGES.includes(stage)).map(
    (stage) => {
      const stageMatches = matches.filter((match) => stageOf(workflows, match.id) === stage);
      return {
        stage,
        count: stageMatches.length,
        valueUsd: stageMatches.reduce(
          (total, match) => total + (buyerById.get(match.buyerId)?.orderValueUsd ?? 0),
          0,
        ),
        staleCount: stageMatches.filter(
          (match) => matchAge(match, workflows, now).age >= STALE_MATCH_DAYS,
        ).length,
        top: [...stageMatches]
          .sort((a, b) => b.score - a.score)
          .slice(0, 2)
          .map((match) => ({
            id: match.id,
            buyerName: buyerById.get(match.buyerId)?.name ?? { en: match.buyerId, zh: match.buyerId },
            productName: findProduct(match.productId)?.name ?? { en: match.productId, zh: match.productId },
            score: match.score,
          })),
      };
    },
  );

  return {
    actions,
    briefing: buildBriefing(
      actions,
      exposure,
      pipeline,
      matches,
      workflows,
      buyers,
      shipments,
      prior,
      now,
    ),
    kpis: buildKpis(orders, openOrders, prior),
    exposure,
    shipments,
    pipeline,
    generatedAt: now.toISOString(),
  };
}
