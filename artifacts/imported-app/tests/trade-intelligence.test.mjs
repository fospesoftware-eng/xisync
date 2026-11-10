import test from 'node:test';
import assert from 'node:assert/strict';

import {
  BUYERS,
  DEFAULT_DOCUMENTS,
  DOCUMENT_KEYS,
  MONTHLY_REVENUE,
  ORDERS,
  defaultCreditInput,
} from '../src/lib/services/tradeIntelligence/dataset.ts';
import { assessCreditEligibility, CREDIT_WEIGHTS } from '../src/lib/services/tradeIntelligence/credit.ts';
import { predictShipping } from '../src/lib/services/tradeIntelligence/shipping.ts';
import { rankMatches } from '../src/lib/services/tradeIntelligence/matching.ts';
import { checkDocuments } from '../src/lib/services/tradeIntelligence/documents.ts';
import { draftQuote } from '../src/lib/services/tradeIntelligence/quotes.ts';
import { buildTradeAlerts, detectOrderAnomalies } from '../src/lib/services/tradeIntelligence/alerts.ts';
import { buildAnalytics } from '../src/lib/services/tradeIntelligence/analytics.ts';
import { buildCommandCenter } from '../src/lib/services/tradeIntelligence/commandCenter.ts';
import {
  SNAPSHOT_RETENTION_DAYS,
  compareDelta,
  createDailySnapshot,
  findPriorSnapshot,
  snapshotDate,
  upsertSnapshot,
} from '../src/lib/services/tradeIntelligence/snapshots.ts';
import {
  ALLOWED_TRANSITIONS,
  canTransition,
  createWorkflow,
  transitionWorkflow,
} from '../src/lib/services/tradeIntelligence/workflow.ts';

const buyer = (id) => {
  const found = BUYERS.find((item) => item.id === id);
  assert.ok(found, `missing buyer ${id}`);
  return found;
};

const makeSnapshot = (date, overrides = {}) => ({
  date,
  capturedAt: `${date}T12:00:00.000Z`,
  exposure: { insuredUsd: 400000, uninsuredUsd: 100000, committedUsd: 500000, pipelineUsd: 1000000 },
  kpis: { revenueUsd: 4000000, openExposureUsd: 500000, marginPct: 20, orderIntake: 8 },
  pipeline: [{ stage: 'suggested', count: 10, valueUsd: 1000000 }],
  risk: { high: 1, medium: 2, low: 3 },
  actions: { total: 4, critical: 1, warning: 2, info: 1 },
  ...overrides,
});

const shippingInput = (overrides = {}) => ({
  originCode: 'CNSHA',
  destinationCode: 'USLAX',
  mode: 'fcl',
  containerType: '40ft',
  weightKg: 18000,
  volumeCbm: 60,
  incoterm: 'CIF',
  month: 10,
  fuelSurchargePct: 18,
  peakSeason: true,
  portCongestion: 'medium',
  cargoValueUsd: 300000,
  ...overrides,
});

test('credit assessment is bounded, weighted and verdict-consistent', () => {
  const assessment = assessCreditEligibility(defaultCreditInput(buyer('buyer-sakura')));
  assert.ok(assessment.score > 0 && assessment.score <= 100);
  assert.equal(assessment.verdict, 'eligible');
  assert.equal(assessment.grade, 'A+');
  assert.equal(assessment.factors.length, 7);
  const weightTotal = assessment.factors.reduce((sum, factor) => sum + factor.weight, 0);
  assert.equal(weightTotal, Object.values(CREDIT_WEIGHTS).reduce((sum, weight) => sum + weight, 0));
  assert.equal(weightTotal, 100);
  for (const factor of assessment.factors) {
    assert.ok(factor.score >= 0 && factor.score <= 100);
    assert.ok(factor.impact >= 0 && factor.impact <= factor.weight);
  }
  const gains = assessment.improvements.map((item) => item.gain);
  assert.deepEqual(gains, [...gains].sort((a, b) => b - a));
});

test('credit score responds monotonically to payment and tenor risk', () => {
  const base = defaultCreditInput(buyer('buyer-meridian'));
  const strong = assessCreditEligibility(base).score;
  const weakPayment = assessCreditEligibility({ ...base, onTimePaymentRate: 0.55 }).score;
  const longTenor = assessCreditEligibility({ ...base, tenorDays: 150 }).score;
  const biggerOrder = assessCreditEligibility({ ...base, orderValueUsd: 900000 }).score;
  assert.ok(weakPayment < strong);
  assert.ok(longTenor < strong);
  assert.ok(biggerOrder < strong);
});

test('sanctions flag is a hard stop', () => {
  const assessment = assessCreditEligibility(defaultCreditInput(buyer('buyer-goldenbridge')));
  assert.equal(assessment.verdict, 'declined');
  assert.ok(assessment.score <= 24);
  assert.equal(assessment.improvements.length, 0);
});

test('shipping ranges, mode comparison and priority recommendation are coherent', () => {
  const prediction = predictShipping(shippingInput());
  assert.equal(prediction.estimates.length, 4);
  for (const estimate of prediction.estimates) {
    assert.ok(estimate.costLowUsd <= estimate.costMidUsd);
    assert.ok(estimate.costMidUsd <= estimate.costHighUsd);
    assert.ok(estimate.transitLowDays <= estimate.transitHighDays);
    assert.ok(estimate.confidence > 0.5 && estimate.confidence <= 0.94);
    assert.ok(estimate.breakdown.length > 0);
  }
  const fcl = prediction.estimates.find((estimate) => estimate.mode === 'fcl');
  const air = prediction.estimates.find((estimate) => estimate.mode === 'air');
  assert.ok(fcl && air);
  assert.ok(air.costMidUsd > fcl.costMidUsd);
  assert.ok(air.transitHighDays < fcl.transitHighDays);
  assert.equal(prediction.laneId, 'lane-sha-lax');
  assert.equal(predictShipping(shippingInput({ priority: 'speed' })).recommendedMode, 'air');
});

test('shipping reacts to surcharges, seasonality and falls back gracefully', () => {
  const baseline = predictShipping(shippingInput({ peakSeason: false, fuelSurchargePct: 0, month: 4 }));
  const stressed = predictShipping(shippingInput({ peakSeason: true, fuelSurchargePct: 30, month: 8 }));
  const baseFcl = baseline.estimates.find((estimate) => estimate.mode === 'fcl');
  const stressedFcl = stressed.estimates.find((estimate) => estimate.mode === 'fcl');
  assert.ok(baseFcl && stressedFcl);
  assert.ok(stressedFcl.costMidUsd > baseFcl.costMidUsd);
  const fallback = predictShipping(shippingInput({ originCode: 'CNXXX', destinationCode: 'ZZZZZ' }));
  assert.equal(fallback.laneId, 'lane-fallback');
  assert.equal(fallback.notice, 'lane_fallback');
  assert.equal(fallback.estimates.length, 4);
});

test('matching ranks same-sector pairs with explainable factors and gaps', () => {
  const matches = rankMatches();
  assert.ok(matches.length >= 12);
  for (const match of matches) {
    assert.ok(match.score >= 0 && match.score <= 100);
    assert.equal(match.id, `${match.buyerId}__${match.productId}`);
    const factorWeight = match.factors.reduce((sum, factor) => sum + factor.weight, 0);
    assert.equal(factorWeight, 100);
  }
  const scores = matches.map((match) => match.score);
  assert.deepEqual(scores, [...scores].sort((a, b) => b - a));
  const industrial = matches.filter((match) => match.buyerId === 'buyer-kestrel');
  assert.ok(industrial.some((match) => match.gaps.some((gap) => gap.key === 'leadTime')));
});

test('workflow enforces the defined state machine and records history', () => {
  const start = createWorkflow('2026-01-01T00:00:00.000Z');
  assert.equal(start.stage, 'suggested');
  assert.equal(canTransition('suggested', 'won'), false);
  assert.equal(canTransition('suggested', 'shortlisted'), true);
  const shortlisted = transitionWorkflow(start, 'shortlisted', '2026-01-02T00:00:00.000Z');
  assert.ok(shortlisted);
  assert.equal(shortlisted.stage, 'shortlisted');
  assert.equal(shortlisted.history.length, 2);
  assert.equal(shortlisted.history[1].at, '2026-01-02T00:00:00.000Z');
  assert.equal(transitionWorkflow(shortlisted, 'won', '2026-01-03T00:00:00.000Z'), null);
  const contacted = transitionWorkflow(shortlisted, 'contacted', '2026-01-03T00:00:00.000Z');
  const negotiating = contacted && transitionWorkflow(contacted, 'negotiating', '2026-01-04T00:00:00.000Z');
  const won = negotiating && transitionWorkflow(negotiating, 'won', '2026-01-05T00:00:00.000Z');
  assert.ok(won);
  assert.equal(won.stage, 'won');
  assert.deepEqual(won.history.map((entry) => entry.stage), [
    'suggested',
    'shortlisted',
    'contacted',
    'negotiating',
    'won',
  ]);
  assert.deepEqual(ALLOWED_TRANSITIONS.won, []);
});

test('analytics aggregates pipeline, exposure, lanes and risk from shared data', () => {
  const snapshot = buildAnalytics();
  assert.ok(snapshot.totalPipelineValueUsd > 0);
  assert.ok(snapshot.totalExposureUsd > 0);
  assert.ok(snapshot.averageMarginPct > 0 && snapshot.averageMarginPct < 100);
  assert.equal(snapshot.pipeline.length, 6);
  assert.equal(
    snapshot.pipeline.reduce((sum, point) => sum + point.count, 0),
    rankMatches().length,
  );
  assert.equal(
    snapshot.riskDistribution.reduce((sum, band) => sum + band.count, 0),
    BUYERS.length,
  );
  assert.equal(snapshot.lanePerformance.length, 8);
  for (let index = 1; index < snapshot.exposureByCountry.length; index += 1) {
    assert.ok(
      snapshot.exposureByCountry[index - 1].exposureUsd >= snapshot.exposureByCountry[index].exposureUsd,
    );
  }
  const withWon = buildAnalytics({
    workflows: {
      [`${BUYERS[0].id}__product-cookware`]: {
        stage: 'won',
        updatedAt: '2026-01-01T00:00:00.000Z',
        history: [{ stage: 'won', at: '2026-01-01T00:00:00.000Z' }],
      },
    },
  });
  const wonPoint = withWon.pipeline.find((point) => point.stage === 'won');
  assert.equal(wonPoint?.count, 1);
});

test('document checks gate on critical missing documents', () => {
  const allComplete = Object.fromEntries(DOCUMENT_KEYS.map((key) => [key, 'complete']));
  const ready = checkDocuments({
    productName: 'Test',
    hsCode: '9405.42',
    market: 'eu',
    invoiceValueUsd: 10000,
    documents: allComplete,
  });
  assert.equal(ready.readinessPct, 100);
  assert.equal(ready.verdict, 'ready');
  const oneCritical = checkDocuments({
    productName: 'Test',
    hsCode: '9405.42',
    market: 'eu',
    invoiceValueUsd: 10000,
    documents: { ...allComplete, bill_of_lading: 'missing' },
  });
  assert.equal(oneCritical.verdict, 'conditional');
  assert.ok(oneCritical.issues.some((issue) => issue.key === 'bill_of_lading' && issue.severity === 'critical'));
  const blocked = checkDocuments({
    productName: 'Test',
    hsCode: 'bad-hs',
    market: 'eu',
    invoiceValueUsd: 10000,
    documents: {
      ...allComplete,
      commercial_invoice: 'missing',
      packing_list: 'missing',
      customs_declaration: 'missing',
    },
  });
  assert.equal(blocked.verdict, 'blocked');
  assert.ok(blocked.issues.some((issue) => issue.key === 'hsCodeFormat'));
});

test('quote drafts are deterministic and totals reconcile', () => {
  const input = {
    buyerName: 'Nordlicht Living GmbH',
    productName: 'Ceramic Cookware Set',
    quantity: 1000,
    unitPriceUsd: 20,
    incoterm: 'CIF',
    leadTimeDays: 30,
    paymentTerms: '30% advance / 70% against B/L copy',
    validityDays: 14,
  };
  const first = draftQuote(input);
  const second = draftQuote(input);
  assert.equal(first.reference, second.reference);
  assert.equal(first.subtotalUsd, 20000);
  assert.equal(first.freightUsd, 1000);
  assert.ok(first.insuranceUsd > 0);
  assert.equal(
    Math.round((first.subtotalUsd + first.freightUsd + first.insuranceUsd) * 100) / 100,
    first.totalUsd,
  );
  const exw = draftQuote({ ...input, incoterm: 'EXW' });
  assert.equal(exw.freightUsd, 0);
  assert.equal(exw.insuranceUsd, 0);
});

test('alerts and anomaly detection surface real exposure signals', () => {
  const alerts = buildTradeAlerts();
  assert.ok(alerts.some((alert) => alert.severity === 'critical'));
  assert.ok(alerts.some((alert) => alert.id === 'sanctions-buyer-goldenbridge'));
  assert.ok(alerts.some((alert) => alert.category === 'tariff'));
  const anomalies = detectOrderAnomalies();
  assert.ok(anomalies.length > 0);
  assert.ok(anomalies.some((anomaly) => anomaly.orderId === 'ord-1015'));
  assert.ok(anomalies.every((anomaly) => anomaly.score > 0 && anomaly.score <= 100));
  assert.ok(ORDERS.length === 20);
});

test('command centre is deterministic and internally consistent', () => {
  const now = new Date('2026-11-09T09:00:00.000Z');
  const first = buildCommandCenter({ now });
  const second = buildCommandCenter({ now });
  assert.deepEqual(first, second);

  assert.equal(first.actions.length > 0, true);
  assert.equal(first.actions.length <= 10, true);
  assert.ok(first.actions.every((action, index, list) => index === 0 || list[index - 1].priority >= action.priority));
  assert.ok(first.actions.some((action) => action.severity === 'critical'));
  assert.ok(first.actions.some((action) => action.category === 'logistics'));

  const { insuredUsd, uninsuredUsd, committedUsd, pipelineUsd } = first.exposure;
  assert.ok(committedUsd > 0);
  assert.equal(Math.round(insuredUsd + uninsuredUsd), Math.round(committedUsd));
  assert.ok(pipelineUsd >= 0);
  assert.ok(uninsuredUsd > 0, 'seed data should contain at least one over-limit buyer');

  assert.equal(first.kpis.length, 4);
  assert.ok(first.kpis.every((kpi) => kpi.series.length === 6));
  assert.equal(first.kpis.find((kpi) => kpi.key === 'revenue').value, MONTHLY_REVENUE.at(-1).revenueUsd);

  assert.equal(first.briefing.lines.length, 4);
  assert.ok(first.briefing.headline.en.length > 0);
  assert.ok(first.briefing.headline.zh.length > 0);
  assert.ok(first.shipments.length > 0 && first.shipments.length <= 8);
  assert.ok(first.shipments.some((shipment) => shipment.riskLevel === 'critical'));
  assert.ok(first.shipments.some((shipment) => shipment.orderId === 'ord-1005'));
});

test('command centre raises credit, stale-match and document actions from workspace state', () => {
  const now = new Date('2026-11-09T09:00:00.000Z');
  const matches = rankMatches();
  const target = matches[0];
  const staleAt = new Date(now.getTime() - 20 * 86_400_000).toISOString();
  const workflows = {
    [target.id]: {
      stage: 'shortlisted',
      updatedAt: staleAt,
      history: [
        { stage: 'suggested', at: staleAt },
        { stage: 'shortlisted', at: staleAt },
      ],
    },
  };
  const assessments = [
    {
      id: 'a-new',
      buyerId: 'buyer-meridian',
      buyerName: 'Meridian Home Goods',
      score: 58,
      verdict: 'referred',
      createdAt: '2026-11-08T10:00:00.000Z',
      input: {},
    },
    {
      id: 'a-old',
      buyerId: 'buyer-meridian',
      buyerName: 'Meridian Home Goods',
      score: 76,
      verdict: 'approved',
      createdAt: '2026-10-01T10:00:00.000Z',
      input: {},
    },
  ];
  const documentChecks = [
    {
      id: 'doc-1',
      productName: 'LED Panel',
      market: 'us',
      readinessPct: 54,
      verdict: 'blocked',
      createdAt: '2026-11-08T12:00:00.000Z',
    },
  ];

  const prior = makeSnapshot('2026-11-08');
  const snapshot = buildCommandCenter({
    now,
    workflows,
    assessments,
    documentChecks,
    matches,
    snapshots: [prior],
  });
  assert.ok(snapshot.actions.some((action) => action.id === 'credit-drop-buyer-meridian'));
  assert.ok(snapshot.actions.some((action) => action.id === `match-stale-${target.id}`));
  assert.ok(snapshot.actions.some((action) => action.id === 'doc-doc-1'));
  assert.ok(snapshot.actions.some((action) => action.severity === 'critical'));
  const shortlisted = snapshot.pipeline.find((column) => column.stage === 'shortlisted');
  assert.equal(shortlisted.count >= 1, true);
  assert.equal(shortlisted.staleCount, 1);
  assert.equal(shortlisted.top.length > 0, true);
  assert.ok(snapshot.briefing.lines[0].en.includes('Since yesterday'));
});

test('daily snapshot is a deterministic compact copy of the book', () => {
  const now = new Date('2026-11-09T09:00:00.000Z');
  const command = buildCommandCenter({ now });
  const snapshot = createDailySnapshot(command, now);

  assert.equal(snapshot.date, snapshotDate(now));
  assert.equal(snapshot.capturedAt, now.toISOString());
  assert.equal(snapshot.exposure.committedUsd, command.exposure.committedUsd);
  assert.equal(snapshot.exposure.pipelineUsd, command.exposure.pipelineUsd);
  assert.equal(
    snapshot.kpis.revenueUsd,
    command.kpis.find((kpi) => kpi.key === 'revenue').value,
  );
  assert.equal(snapshot.pipeline.length, command.pipeline.length);

  const riskTotal = snapshot.risk.high + snapshot.risk.medium + snapshot.risk.low;
  assert.equal(riskTotal, command.shipments.length);
  const actionTotal =
    snapshot.actions.critical + snapshot.actions.warning + snapshot.actions.info;
  assert.equal(actionTotal, command.actions.length);
  assert.equal(snapshot.actions.total, command.actions.length);

  assert.deepEqual(createDailySnapshot(command, now), snapshot);
});

test('snapshots upsert one record per day and trim to the retention window', () => {
  const first = makeSnapshot('2026-11-09', {
    kpis: { revenueUsd: 1, openExposureUsd: 2, marginPct: 3, orderIntake: 4 },
  });
  const replacement = makeSnapshot('2026-11-09', {
    kpis: { revenueUsd: 9, openExposureUsd: 2, marginPct: 3, orderIntake: 4 },
  });

  const replaced = upsertSnapshot([first], replacement);
  assert.equal(replaced.length, 1);
  assert.equal(replaced[0].kpis.revenueUsd, 9);

  const day = (offset) =>
    new Date(Date.UTC(2026, 10, 9) - offset * 86_400_000).toISOString().slice(0, 10);
  const history = [];
  for (let offset = SNAPSHOT_RETENTION_DAYS + 15; offset >= 1; offset -= 1) {
    history.push(makeSnapshot(day(offset)));
  }
  const trimmed = history.reduce((acc, entry) => upsertSnapshot(acc, entry), []);

  assert.equal(trimmed.length, SNAPSHOT_RETENTION_DAYS);
  assert.equal(trimmed[0].date, day(SNAPSHOT_RETENTION_DAYS));
  assert.equal(trimmed.at(-1).date, day(1));
  assert.deepEqual(
    trimmed.map((entry) => entry.date),
    [...trimmed.map((entry) => entry.date)].sort(),
  );
});

test('prior-day lookup handles no history, one day and multi-day gaps', () => {
  const now = new Date('2026-11-09T09:00:00.000Z');
  const today = snapshotDate(now);

  assert.equal(findPriorSnapshot([], today), null);

  const yesterday = makeSnapshot('2026-11-08');
  const oneDay = findPriorSnapshot([yesterday], today);
  assert.ok(oneDay);
  assert.equal(oneDay.snapshot.date, '2026-11-08');
  assert.equal(oneDay.daysAgo, 1);

  const older = makeSnapshot('2026-11-05');
  const multiDay = findPriorSnapshot([older, yesterday], today);
  assert.ok(multiDay);
  assert.equal(multiDay.snapshot.date, '2026-11-08');
  assert.equal(multiDay.daysAgo, 1);

  const gap = findPriorSnapshot([older, yesterday], '2026-11-10');
  assert.equal(gap.snapshot.date, '2026-11-08');
  assert.equal(gap.daysAgo, 2);

  const onlyToday = findPriorSnapshot([makeSnapshot(today), yesterday], today);
  assert.equal(onlyToday.snapshot.date, '2026-11-08');
});

test('KPI deltas read the stored prior-day book, or report a first run', () => {
  const now = new Date('2026-11-09T09:00:00.000Z');

  const fresh = buildCommandCenter({ now, snapshots: [] });
  for (const kpi of fresh.kpis) {
    assert.equal(kpi.deltaPct, null);
    assert.equal(kpi.baselineDate, undefined);
  }
  assert.ok(fresh.briefing.lines[0].en.startsWith('First run'));
  assert.ok(fresh.briefing.lines[0].zh.includes('首次运行'));

  const prior = makeSnapshot('2026-11-08', {
    kpis: { revenueUsd: 2_000_000, openExposureUsd: 250_000, marginPct: 10, orderIntake: 4 },
    actions: { total: 2, critical: 0, warning: 1, info: 1 },
  });
  const compared = buildCommandCenter({ now, snapshots: [prior] });

  for (const kpi of compared.kpis) {
    assert.equal(kpi.baselineDate, '2026-11-08');
    assert.equal(typeof kpi.deltaPct, 'number');
  }
  const exposure = compared.kpis.find((kpi) => kpi.key === 'exposure');
  assert.ok(exposure.deltaPct > 90, `expected exposure growth, got ${exposure.deltaPct}`);
  assert.ok(compared.briefing.lines[0].en.startsWith('Since yesterday'));
  assert.ok(compared.briefing.lines[0].en.includes('versus'));
});

test('untouched suggestions carry an age and surface as stale work', () => {
  const now = new Date('2026-11-09T09:00:00.000Z');
  const matches = rankMatches();

  assert.ok(matches.every((match) => match.suggestedAgeDays >= 0 && match.suggestedAgeDays <= 18));
  const staleSuggestions = matches.filter((match) => match.suggestedAgeDays >= 7);
  assert.ok(staleSuggestions.length > 0, 'seed data should contain stale untouched suggestions');

  const snapshot = buildCommandCenter({ now, matches, workflows: {} });
  assert.ok(
    snapshot.actions.some(
      (action) => action.id.startsWith('match-stale-') && action.title.en.startsWith('Suggestion untouched'),
    ),
  );

  const suggested = snapshot.pipeline.find((column) => column.stage === 'suggested');
  assert.equal(suggested.count, matches.length);
  assert.equal(suggested.staleCount, staleSuggestions.length);

  const touched = staleSuggestions[0];
  const withWorkflow = buildCommandCenter({
    now,
    matches,
    workflows: {
      [touched.id]: {
        stage: 'shortlisted',
        updatedAt: '2026-11-09T08:00:00.000Z',
        history: [{ stage: 'suggested', at: '2026-11-09T08:00:00.000Z' }],
      },
    },
  });
  const shortlisted = withWorkflow.pipeline.find((column) => column.stage === 'shortlisted');
  assert.equal(shortlisted.staleCount, 0);

  assert.equal(compareDelta(110, 100), 10);
  assert.equal(compareDelta(100, null), null);
  assert.equal(compareDelta(0, 0), 0);
  assert.equal(compareDelta(5, 0), 100);
});
