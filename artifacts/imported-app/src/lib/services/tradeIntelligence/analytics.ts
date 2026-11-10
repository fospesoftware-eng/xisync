import type {
  AnalyticsSnapshot,
  Buyer,
  Lane,
  MatchCandidate,
  MatchStage,
  MatchWorkflow,
  OrderRecord,
  PipelinePoint,
  RiskBandPoint,
} from '../../../types/tradeIntelligence.ts';
import { BUYERS, LANES, MONTHLY_REVENUE, ORDERS, defaultCreditInput, laneLabel } from './dataset.ts';
import { assessCreditEligibility } from './credit.ts';
import { rankMatches } from './matching.ts';
import { ACTIVE_STAGES, MATCH_STAGES } from './workflow.ts';
import { laneTransitDays } from './alerts.ts';

export interface AnalyticsInput {
  workflows?: Record<string, MatchWorkflow>;
  matches?: MatchCandidate[];
  buyers?: Buyer[];
  orders?: OrderRecord[];
  lanes?: Lane[];
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function stageOf(
  workflows: Record<string, MatchWorkflow>,
  match: MatchCandidate,
): MatchStage {
  return workflows[match.id]?.stage ?? 'suggested';
}

export function buildAnalytics(input: AnalyticsInput = {}): AnalyticsSnapshot {
  const workflows = input.workflows ?? {};
  const matches = input.matches ?? rankMatches();
  const buyers = input.buyers ?? BUYERS;
  const orders = input.orders ?? ORDERS;
  const lanes = input.lanes ?? LANES;

  const buyerById = new Map(buyers.map((buyer) => [buyer.id, buyer]));

  const pipeline: PipelinePoint[] = MATCH_STAGES.map((stage) => {
    const stageMatches = matches.filter((match) => stageOf(workflows, match) === stage);
    return {
      stage,
      count: stageMatches.length,
      valueUsd: stageMatches.reduce(
        (sum, match) => sum + (buyerById.get(match.buyerId)?.orderValueUsd ?? 0),
        0,
      ),
    };
  });

  const activeMatches = matches.filter((match) => ACTIVE_STAGES.includes(stageOf(workflows, match)));
  const totalPipelineValueUsd = activeMatches.reduce(
    (sum, match) => sum + (buyerById.get(match.buyerId)?.orderValueUsd ?? 0),
    0,
  );

  const openOrders = orders.filter((order) => order.status !== 'delivered');
  const totalExposureUsd = openOrders.reduce((sum, order) => sum + order.valueUsd, 0);

  const exposureMap = new Map<string, { exposureUsd: number; riskScores: number[] }>();
  for (const order of openOrders) {
    const buyer = buyerById.get(order.buyerId);
    if (!buyer) continue;
    const entry = exposureMap.get(buyer.countryCode) ?? { exposureUsd: 0, riskScores: [] };
    entry.exposureUsd += order.valueUsd;
    entry.riskScores.push(buyer.countryRiskScore);
    exposureMap.set(buyer.countryCode, entry);
  }
  const exposureByCountry = [...exposureMap.entries()]
    .map(([countryCode, entry]) => {
      const buyer = buyers.find((item) => item.countryCode === countryCode);
      return {
        countryCode,
        country: buyer?.country ?? { en: countryCode, zh: countryCode },
        exposureUsd: entry.exposureUsd,
        riskScore: Math.round(average(entry.riskScores)),
      };
    })
    .sort((a, b) => b.exposureUsd - a.exposureUsd);

  const lanePerformance = lanes
    .map((lane) => {
      const laneOrders = orders.filter((order) => order.laneId === lane.id);
      return {
        laneId: lane.id,
        label: laneLabel(lane),
        onTimePct: Math.round((laneOrders.length > 0 ? average(laneOrders.map((order) => (order.onTime ? 1 : 0))) : 0) * 100),
        avgTransitDays: laneTransitDays(lane),
        costPerFeuUsd: lane.costPerFeuUsd,
        orders: laneOrders.length,
        marginPct: Math.round(average(laneOrders.map((order) => order.marginPct)) * 10) / 10,
      };
    })
    .sort((a, b) => b.orders - a.orders);

  const riskDistribution: RiskBandPoint[] = [
    { band: 'low', count: 0 },
    { band: 'moderate', count: 0 },
    { band: 'elevated', count: 0 },
    { band: 'high', count: 0 },
  ];
  for (const buyer of buyers) {
    const score = assessCreditEligibility(defaultCreditInput(buyer)).score;
    if (score >= 75) riskDistribution[0].count += 1;
    else if (score >= 60) riskDistribution[1].count += 1;
    else if (score >= 45) riskDistribution[2].count += 1;
    else riskDistribution[3].count += 1;
  }

  return {
    totalPipelineValueUsd,
    totalExposureUsd,
    averageMarginPct: Math.round(average(orders.map((order) => order.marginPct)) * 10) / 10,
    activeMatches: activeMatches.length,
    pipeline,
    exposureByCountry,
    lanePerformance,
    riskDistribution,
    monthlyFlow: MONTHLY_REVENUE,
  };
}
