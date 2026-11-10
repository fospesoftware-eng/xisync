import type {
  CommandCenterSnapshot,
  DailySnapshot,
  MatchStage,
} from '../../../types/tradeIntelligence.ts';

/**
 * Snapshots are kept for a rolling window of calendar days. One snapshot per day
 * is retained (the latest capture wins), so the store never grows without bound.
 */
export const SNAPSHOT_RETENTION_DAYS = 45;

const DAY_MS = 86_400_000;

export interface PriorSnapshot {
  snapshot: DailySnapshot;
  daysAgo: number;
}

/** Local calendar day, matching how the operator experiences "today". */
export function snapshotDate(now: Date): string {
  const year = String(now.getFullYear());
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function kpiValue(command: CommandCenterSnapshot, key: string): number {
  return command.kpis.find((kpi) => kpi.key === key)?.value ?? 0;
}

/**
 * Compact end-of-day book: exposure split, pipeline by stage, the four headline
 * KPI values, shipment risk counts and open action counts. Pure: given the same
 * command-centre snapshot and clock it always produces the same record.
 */
export function createDailySnapshot(
  command: CommandCenterSnapshot,
  now: Date,
): DailySnapshot {
  const risk = { high: 0, medium: 0, low: 0 };
  for (const shipment of command.shipments) {
    if (shipment.riskLevel === 'critical') risk.high += 1;
    else if (shipment.riskLevel === 'warning') risk.medium += 1;
    else risk.low += 1;
  }

  const actions = { total: command.actions.length, critical: 0, warning: 0, info: 0 };
  for (const action of command.actions) {
    if (action.severity === 'critical') actions.critical += 1;
    else if (action.severity === 'warning') actions.warning += 1;
    else actions.info += 1;
  }

  return {
    date: snapshotDate(now),
    capturedAt: now.toISOString(),
    exposure: {
      insuredUsd: command.exposure.insuredUsd,
      uninsuredUsd: command.exposure.uninsuredUsd,
      committedUsd: command.exposure.committedUsd,
      pipelineUsd: command.exposure.pipelineUsd,
    },
    kpis: {
      revenueUsd: kpiValue(command, 'revenue'),
      openExposureUsd: kpiValue(command, 'exposure'),
      marginPct: kpiValue(command, 'margin'),
      orderIntake: kpiValue(command, 'orders'),
    },
    pipeline: command.pipeline.map((column) => ({
      stage: column.stage,
      count: column.count,
      valueUsd: column.valueUsd,
    })),
    risk,
    actions,
  };
}

/**
 * Insert or replace the record for a calendar day, keep the list ascending and
 * trim it to the retention window. Replacing means repeated writes on the same
 * day always leave one honest "latest book" snapshot behind.
 */
export function upsertSnapshot(
  snapshots: DailySnapshot[],
  snapshot: DailySnapshot,
  retentionDays = SNAPSHOT_RETENTION_DAYS,
): DailySnapshot[] {
  const byDate = new Map<string, DailySnapshot>();
  for (const entry of snapshots) byDate.set(entry.date, entry);
  byDate.set(snapshot.date, snapshot);
  return [...byDate.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-retentionDays);
}

function dateMs(date: string): number {
  return Date.parse(`${date}T00:00:00.000Z`);
}

/** Whole calendar days between two YYYY-MM-DD dates (b - a). */
export function calendarDaysBetween(a: string, b: string): number {
  return Math.round((dateMs(b) - dateMs(a)) / DAY_MS);
}

/**
 * Most recent snapshot strictly before `date`. Returns null on a first run, so
 * callers can render explicit "no baseline yet" copy instead of inventing one.
 */
export function findPriorSnapshot(
  snapshots: DailySnapshot[],
  date: string,
): PriorSnapshot | null {
  const earlier = snapshots
    .filter((snapshot) => snapshot.date < date)
    .sort((a, b) => a.date.localeCompare(b.date));
  const latest = earlier[earlier.length - 1];
  if (!latest) return null;
  return { snapshot: latest, daysAgo: Math.max(1, calendarDaysBetween(latest.date, date)) };
}

/**
 * Day-over-day percentage change. Returns null when there is no stored prior
 * day, so the UI can distinguish "no baseline" from a genuine flat result.
 */
export function compareDelta(
  current: number,
  previous: number | null | undefined,
): number | null {
  if (previous === null || previous === undefined || Number.isNaN(previous)) return null;
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
