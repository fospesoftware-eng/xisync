import type {
  TradeWorkspaceRepository,
  TradeWorkspaceState,
} from '../../../types/tradeIntelligence.ts';
import { SNAPSHOT_RETENTION_DAYS } from './snapshots.ts';

const STORAGE_PREFIX = 'xisync:trade-intelligence:v1:';
const MAX_SAVED_ITEMS = 25;

export function createEmptyState(): TradeWorkspaceState {
  return {
    version: 1,
    matchWorkflows: {},
    assessments: [],
    quotes: [],
    documentChecks: [],
    snapshots: [],
    updatedAt: new Date().toISOString(),
  };
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function normalizeState(raw: unknown): TradeWorkspaceState {
  if (!isObject(raw) || raw.version !== 1) return createEmptyState();
  return {
    version: 1,
    matchWorkflows: isObject(raw.matchWorkflows)
      ? (raw.matchWorkflows as TradeWorkspaceState['matchWorkflows'])
      : {},
    assessments: Array.isArray(raw.assessments)
      ? (raw.assessments as TradeWorkspaceState['assessments'])
      : [],
    quotes: Array.isArray(raw.quotes) ? (raw.quotes as TradeWorkspaceState['quotes']) : [],
    documentChecks: Array.isArray(raw.documentChecks)
      ? (raw.documentChecks as TradeWorkspaceState['documentChecks'])
      : [],
    snapshots: Array.isArray(raw.snapshots)
      ? (raw.snapshots as TradeWorkspaceState['snapshots'])
      : [],
    updatedAt: typeof raw.updatedAt === 'string' ? raw.updatedAt : new Date().toISOString(),
  };
}

export function trimState(state: TradeWorkspaceState): TradeWorkspaceState {
  return {
    ...state,
    assessments: state.assessments.slice(0, MAX_SAVED_ITEMS),
    quotes: state.quotes.slice(0, MAX_SAVED_ITEMS),
    documentChecks: state.documentChecks.slice(0, MAX_SAVED_ITEMS),
    snapshots: [...state.snapshots]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-SNAPSHOT_RETENTION_DAYS),
    updatedAt: new Date().toISOString(),
  };
}

export class LocalTradeWorkspaceRepository implements TradeWorkspaceRepository {
  private key(tenantId: string): string {
    return `${STORAGE_PREFIX}${tenantId}`;
  }

  async load(tenantId: string): Promise<TradeWorkspaceState> {
    if (typeof window === 'undefined' || !window.localStorage) return createEmptyState();
    try {
      const raw = window.localStorage.getItem(this.key(tenantId));
      if (!raw) return createEmptyState();
      return normalizeState(JSON.parse(raw));
    } catch {
      throw new Error('TRADE_WORKSPACE_CORRUPTED');
    }
  }

  async save(tenantId: string, state: TradeWorkspaceState): Promise<void> {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      window.localStorage.setItem(this.key(tenantId), JSON.stringify(trimState(state)));
    } catch {
      throw new Error('TRADE_WORKSPACE_WRITE_FAILED');
    }
  }
}

export const tradeWorkspaceStorageKey = (tenantId: string): string => `${STORAGE_PREFIX}${tenantId}`;
