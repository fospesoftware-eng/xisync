import type {
  CostDriver,
  Lane,
  ShippingEstimate,
  ShippingInput,
  ShippingMode,
  ShippingPrediction,
} from '../../../types/tradeIntelligence.ts';
import { LANES, laneLabel } from './dataset.ts';

const CONTAINER_FACTOR: Record<ShippingInput['containerType'], number> = {
  '20ft': 0.78,
  '40ft': 1,
  '40ft_hc': 1.08,
};

const MODE_CONFIDENCE: Record<ShippingMode, number> = {
  fcl: 0.87,
  lcl: 0.78,
  air: 0.83,
  rail: 0.74,
};

const CONGESTION_FACTOR: Record<ShippingInput['portCongestion'], number> = {
  low: 0,
  medium: 0.03,
  high: 0.07,
};

const CONGESTION_DAYS: Record<ShippingInput['portCongestion'], number> = {
  low: 0,
  medium: 1,
  high: 3,
};

export const SEASON_FACTOR: Record<number, number> = {
  1: 1.07,
  2: 1.06,
  7: 1.08,
  8: 1.09,
  9: 1.06,
  10: 1.05,
};

function round(value: number, step = 10): number {
  return Math.round(value / step) * step;
}

function chargeableWeight(input: ShippingInput): number {
  return Math.max(input.weightKg, input.volumeCbm * 167);
}

function chargeableCbm(input: ShippingInput): number {
  return Math.max(input.volumeCbm, input.weightKg / 1000);
}

function baseFreight(input: ShippingInput, lane: Lane, mode: ShippingMode): number {
  const containerFactor = CONTAINER_FACTOR[input.containerType];
  switch (mode) {
    case 'fcl':
      return lane.costPerFeuUsd * containerFactor;
    case 'lcl':
      return Math.max(420, chargeableCbm(input) * (lane.costPerFeuUsd / 62) + 150);
    case 'air': {
      const ratePerKg = 4.15 + (lane.distanceKm / 5000) * 0.6;
      return chargeableWeight(input) * ratePerKg + 180;
    }
    case 'rail':
      return lane.costPerFeuUsd * containerFactor * 0.88 + 120;
  }
}

function transitDays(input: ShippingInput, lane: Lane, mode: ShippingMode): number {
  let base: number;
  switch (mode) {
    case 'fcl':
      base = lane.transitBaseDays;
      break;
    case 'lcl':
      base = lane.transitBaseDays + 4;
      break;
    case 'air':
      base = Math.ceil(lane.distanceKm / 9000) + 2;
      break;
    case 'rail':
      base = Math.max(12, Math.min(24, Math.round(lane.distanceKm / 800)));
      break;
  }
  return base + (input.peakSeason ? 1 : 0);
}

function co2Tons(input: ShippingInput, lane: Lane, mode: ShippingMode): number {
  switch (mode) {
    case 'fcl':
      return lane.distanceKm * 0.00012 * CONTAINER_FACTOR[input.containerType];
    case 'lcl':
      return lane.distanceKm * 0.00018 * Math.max(0.4, chargeableCbm(input) / 15);
    case 'air':
      return chargeableWeight(input) * lane.distanceKm * 0.00000055;
    case 'rail':
      return lane.distanceKm * 0.00005;
  }
}

function buildEstimate(input: ShippingInput, lane: Lane, mode: ShippingMode): ShippingEstimate {
  const freight = baseFreight(input, lane, mode);
  const fuel = freight * (Math.max(0, input.fuelSurchargePct) / 100);
  const peak = input.peakSeason ? freight * 0.12 : 0;
  const congestion = freight * CONGESTION_FACTOR[input.portCongestion];
  const season = freight * ((SEASON_FACTOR[input.month] ?? 1) - 1);
  const originCharges = input.incoterm === 'EXW' ? 0 : 180;
  const destinationCharges = input.incoterm === 'DDP' ? 320 : 0;
  const duty = input.incoterm === 'DDP' ? input.cargoValueUsd * 0.065 : 0;
  const insurance =
    input.incoterm === 'CIF' || input.incoterm === 'DDP'
      ? (input.cargoValueUsd + freight) * 0.0045
      : 0;

  const rawComponents: CostDriver[] = [
    { key: 'baseFreight', amountUsd: freight, direction: 'up' },
    { key: 'fuelSurcharge', amountUsd: fuel, direction: 'up' },
    { key: 'peakSeason', amountUsd: peak, direction: 'up' },
    { key: 'portCongestion', amountUsd: congestion, direction: 'up' },
    { key: 'seasonality', amountUsd: season, direction: 'up' },
    { key: 'originCharges', amountUsd: originCharges, direction: 'up' },
    { key: 'destinationCharges', amountUsd: destinationCharges, direction: 'up' },
    { key: 'duty', amountUsd: duty, direction: 'up' },
    { key: 'insurance', amountUsd: insurance, direction: 'up' },
  ];

  const components = rawComponents
    .map((component) => ({ ...component, amountUsd: Math.round(component.amountUsd) }))
    .filter((component) => component.amountUsd > 0);

  const mid = components.reduce((sum, component) => sum + component.amountUsd, 0);
  const days = transitDays(input, lane, mode);
  const congestionDays = CONGESTION_DAYS[input.portCongestion];
  const confidence =
    Math.round(
      Math.min(
        0.94,
        Math.max(
          0.52,
          MODE_CONFIDENCE[mode] -
            (input.portCongestion === 'high' ? 0.07 : input.portCongestion === 'medium' ? 0.03 : 0) -
            (input.peakSeason ? 0.03 : 0),
        ),
      ) * 100,
    ) / 100;

  return {
    mode,
    costLowUsd: round(mid * 0.9),
    costMidUsd: round(mid),
    costHighUsd: round(mid * 1.18),
    transitLowDays: Math.max(2, days - 1),
    transitHighDays: days + 2 + congestionDays,
    co2Tons: Math.round(co2Tons(input, lane, mode) * 100) / 100,
    confidence,
    breakdown: components,
  };
}

function recommendationScore(
  estimate: ShippingEstimate,
  priority: NonNullable<ShippingInput['priority']>,
): number {
  const timeWeight = priority === 'speed' ? 320 : priority === 'cost' ? 20 : 85;
  return estimate.costMidUsd + estimate.transitHighDays * timeWeight;
}

function recommend(
  estimates: ShippingEstimate[],
  priority: NonNullable<ShippingInput['priority']>,
): ShippingEstimate {
  if (priority === 'speed') {
    // Fastest feasible option, then the cheapest among the near-fastest set.
    const fastest = Math.min(...estimates.map((estimate) => estimate.transitHighDays));
    const shortlist = estimates.filter((estimate) => estimate.transitHighDays <= fastest + 3);
    return shortlist.reduce((best, current) =>
      current.costMidUsd < best.costMidUsd ? current : best,
    );
  }
  return estimates.reduce((best, current) =>
    recommendationScore(current, priority) < recommendationScore(best, priority) ? current : best,
  );
}

export function findLane(originCode: string, destinationCode: string): Lane | undefined {
  return LANES.find(
    (lane) => lane.originCode === originCode && lane.destinationCode === destinationCode,
  );
}

function fallbackLane(originCode: string, destinationCode: string): Lane {
  return {
    id: 'lane-fallback',
    originCode,
    destinationCode,
    origin: { en: originCode, zh: originCode },
    destination: { en: destinationCode, zh: destinationCode },
    distanceKm: 10500,
    transitBaseDays: 20,
    costPerFeuUsd: 2600,
    congestion: 'medium',
    onTimePct: 0.8,
    carrier: 'Spot market',
  };
}

/**
 * Deterministic freight and transit estimator. Every returned range is derived
 * from the same auditable cost components shown to the user.
 */
export function predictShipping(
  input: ShippingInput,
  options: { modelMode?: 'heuristic' | 'remote'; notice?: string } = {},
): ShippingPrediction {
  const matched = findLane(input.originCode, input.destinationCode);
  const lane = matched ?? fallbackLane(input.originCode, input.destinationCode);
  const modes: ShippingMode[] = ['fcl', 'lcl', 'air', 'rail'];
  const estimates = modes.map((mode) => buildEstimate(input, lane, mode));
  const priority = input.priority ?? 'balanced';
  const recommended = recommend(estimates, priority);
  const selected = estimates.find((estimate) => estimate.mode === input.mode) ?? recommended;

  return {
    laneId: lane.id,
    laneLabel: laneLabel(lane),
    distanceKm: lane.distanceKm,
    estimates,
    recommendedMode: recommended.mode,
    selected,
    notice: options.notice ?? (matched ? undefined : 'lane_fallback'),
    modelMode: options.modelMode ?? 'heuristic',
    generatedAt: new Date().toISOString(),
  };
}
