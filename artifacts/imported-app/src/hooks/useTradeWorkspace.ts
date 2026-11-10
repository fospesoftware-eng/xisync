import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  CreditAssessment,
  CreditInput,
  DocumentCheckResult,
  MatchStage,
  QuoteDraft,
  QuoteInput,
  SavedAssessment,
  SavedDocumentCheck,
  SavedQuote,
  TradeWorkspaceState,
} from '../types/tradeIntelligence';
import {
  LocalTradeWorkspaceRepository,
  createEmptyState,
  normalizeState,
  tradeWorkspaceStorageKey,
  trimState,
} from '../lib/services/tradeIntelligence/store';
import { createWorkflow, transitionWorkflow } from '../lib/services/tradeIntelligence/workflow';
import { buildCommandCenter } from '../lib/services/tradeIntelligence/commandCenter';
import {
  createDailySnapshot,
  upsertSnapshot,
} from '../lib/services/tradeIntelligence/snapshots';

/**
 * Persist today's compact book snapshot. Called on app open and after every
 * state change; repeated writes on the same day replace that day's record so
 * the stored book always reflects the latest known values.
 */
function captureSnapshot(state: TradeWorkspaceState): TradeWorkspaceState {
  const now = new Date();
  const command = buildCommandCenter({
    workflows: state.matchWorkflows,
    assessments: state.assessments,
    documentChecks: state.documentChecks,
    quotes: state.quotes,
    snapshots: state.snapshots,
    now,
  });
  return {
    ...state,
    snapshots: upsertSnapshot(state.snapshots, createDailySnapshot(command, now)),
  };
}

export interface TradeWorkspaceApi {
  state: TradeWorkspaceState | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
  setMatchStage: (matchId: string, stage: MatchStage) => boolean;
  recordAssessment: (assessment: CreditAssessment, input: CreditInput) => void;
  recordQuote: (quote: QuoteDraft, input: QuoteInput) => void;
  recordDocumentCheck: (result: DocumentCheckResult, productName: string, market: SavedDocumentCheck['market']) => void;
  resetWorkspace: () => void;
}

const DEFAULT_TENANT = 'demo-workspace';

export function useTradeWorkspace(tenantId?: string | null): TradeWorkspaceApi {
  const workspaceId = tenantId || DEFAULT_TENANT;
  const repository = useMemo(() => new LocalTradeWorkspaceRepository(), []);
  const [state, setState] = useState<TradeWorkspaceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const stateRef = useRef<TradeWorkspaceState | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    repository
      .load(workspaceId)
      .then((loaded) => {
        if (!active) return;
        const next = trimState(captureSnapshot(loaded));
        stateRef.current = next;
        setState(next);
        repository.save(workspaceId, next).catch((cause: unknown) => {
          if (!active) return;
          setError(cause instanceof Error ? cause.message : 'TRADE_WORKSPACE_WRITE_FAILED');
        });
      })
      .catch((cause: unknown) => {
        if (!active) return;
        setError(cause instanceof Error ? cause.message : 'TRADE_WORKSPACE_LOAD_FAILED');
        const empty = createEmptyState();
        stateRef.current = empty;
        setState(empty);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [repository, workspaceId, reloadKey]);

  useEffect(() => {
    const key = tradeWorkspaceStorageKey(workspaceId);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== key || !event.newValue) return;
      try {
        const next = normalizeState(JSON.parse(event.newValue));
        stateRef.current = next;
        setState(next);
      } catch {
        setError('TRADE_WORKSPACE_CORRUPTED');
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [workspaceId]);

  const commit = useCallback(
    (updater: (current: TradeWorkspaceState) => TradeWorkspaceState): TradeWorkspaceState => {
      const current = stateRef.current ?? createEmptyState();
      const next = trimState(captureSnapshot(updater(current)));
      stateRef.current = next;
      setState(next);
      repository.save(workspaceId, next).catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : 'TRADE_WORKSPACE_WRITE_FAILED');
      });
      return next;
    },
    [repository, workspaceId],
  );

  const setMatchStage = useCallback(
    (matchId: string, stage: MatchStage): boolean => {
      const current = stateRef.current ?? createEmptyState();
      const existing = current.matchWorkflows[matchId] ?? createWorkflow();
      const next = transitionWorkflow(existing, stage);
      if (!next) return false;
      commit((base) => ({
        ...base,
        matchWorkflows: { ...base.matchWorkflows, [matchId]: next },
      }));
      return true;
    },
    [commit],
  );

  const recordAssessment = useCallback(
    (assessment: CreditAssessment, input: CreditInput) => {
      const entry: SavedAssessment = {
        id: `assessment-${Date.now()}`,
        buyerId: input.buyerId,
        buyerName: input.buyerName,
        score: assessment.score,
        verdict: assessment.verdict,
        createdAt: assessment.generatedAt,
        input,
      };
      commit((base) => ({ ...base, assessments: [entry, ...base.assessments] }));
    },
    [commit],
  );

  const recordQuote = useCallback(
    (quote: QuoteDraft, input: QuoteInput) => {
      const entry: SavedQuote = {
        id: `quote-${Date.now()}`,
        reference: quote.reference,
        buyerName: input.buyerName,
        productName: input.productName,
        totalUsd: quote.totalUsd,
        createdAt: quote.generatedAt,
        input,
      };
      commit((base) => ({ ...base, quotes: [entry, ...base.quotes] }));
    },
    [commit],
  );

  const recordDocumentCheck = useCallback(
    (result: DocumentCheckResult, productName: string, market: SavedDocumentCheck['market']) => {
      const entry: SavedDocumentCheck = {
        id: `document-check-${Date.now()}`,
        productName,
        market,
        readinessPct: result.readinessPct,
        verdict: result.verdict,
        createdAt: result.generatedAt,
      };
      commit((base) => ({ ...base, documentChecks: [entry, ...base.documentChecks] }));
    },
    [commit],
  );

  const resetWorkspace = useCallback(() => {
    commit(() => createEmptyState());
  }, [commit]);

  return {
    state,
    loading,
    error,
    reload: () => setReloadKey((key) => key + 1),
    setMatchStage,
    recordAssessment,
    recordQuote,
    recordDocumentCheck,
    resetWorkspace,
  };
}
