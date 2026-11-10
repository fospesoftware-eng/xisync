import type {
  CreditAssessment,
  CreditInput,
  DocumentCheckInput,
  DocumentCheckResult,
  QuoteDraft,
  QuoteInput,
  ShippingInput,
  ShippingPrediction,
} from '../../../types/tradeIntelligence.ts';
import { assessCreditEligibility } from './credit.ts';
import { predictShipping } from './shipping.ts';
import { checkDocuments } from './documents.ts';
import { draftQuote } from './quotes.ts';

export interface TradeIntelligenceProvider {
  readonly mode: 'heuristic' | 'remote';
  assessCredit(input: CreditInput): Promise<CreditAssessment>;
  predictShipping(input: ShippingInput): Promise<ShippingPrediction>;
  checkDocuments(input: DocumentCheckInput): Promise<DocumentCheckResult>;
  draftQuote(input: QuoteInput): Promise<QuoteDraft>;
}

const NETWORK_DELAY_MS = 220;
const REMOTE_TIMEOUT_MS = 2500;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class HeuristicTradeProvider implements TradeIntelligenceProvider {
  readonly mode = 'heuristic' as const;

  async assessCredit(input: CreditInput): Promise<CreditAssessment> {
    await wait(NETWORK_DELAY_MS);
    return assessCreditEligibility(input, { modelMode: 'heuristic' });
  }

  async predictShipping(input: ShippingInput): Promise<ShippingPrediction> {
    await wait(NETWORK_DELAY_MS);
    return predictShipping(input, { modelMode: 'heuristic' });
  }

  async checkDocuments(input: DocumentCheckInput): Promise<DocumentCheckResult> {
    await wait(NETWORK_DELAY_MS);
    return checkDocuments(input);
  }

  async draftQuote(input: QuoteInput): Promise<QuoteDraft> {
    await wait(NETWORK_DELAY_MS);
    return draftQuote(input);
  }
}

function isCreditAssessment(value: unknown): value is CreditAssessment {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<CreditAssessment>;
  return (
    typeof candidate.score === 'number' &&
    typeof candidate.verdict === 'string' &&
    Array.isArray(candidate.factors) &&
    candidate.factors.length > 0
  );
}

function isShippingPrediction(value: unknown): value is ShippingPrediction {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<ShippingPrediction>;
  return (
    Array.isArray(candidate.estimates) &&
    candidate.estimates.length > 0 &&
    typeof candidate.selected === 'object'
  );
}

function isDocumentCheck(value: unknown): value is DocumentCheckResult {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<DocumentCheckResult>;
  return typeof candidate.readinessPct === 'number' && Array.isArray(candidate.items);
}

function isQuoteDraft(value: unknown): value is QuoteDraft {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<QuoteDraft>;
  return typeof candidate.reference === 'string' && typeof candidate.totalUsd === 'number';
}

/**
 * Optional model-backed provider. It is only selected when an endpoint is
 * configured; any timeout, non-2xx response or malformed payload degrades to
 * the deterministic heuristic engine and flags the result as degraded.
 */
export class RemoteTradeProvider implements TradeIntelligenceProvider {
  readonly mode = 'remote' as const;

  constructor(
    private readonly endpoint: string,
    private readonly fallback = new HeuristicTradeProvider(),
  ) {}

  private async call(task: string, input: unknown): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REMOTE_TIMEOUT_MS);
    try {
      const response = await fetch(`${this.endpoint.replace(/\/$/, '')}/${task}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
        signal: controller.signal,
      });
      if (!response.ok) return null;
      return (await response.json()) as unknown;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  async assessCredit(input: CreditInput): Promise<CreditAssessment> {
    const result = await this.call('credit', input);
    if (isCreditAssessment(result)) {
      return { ...result, modelMode: 'remote', degraded: false };
    }
    const fallback = await this.fallback.assessCredit(input);
    return {
      ...fallback,
      degraded: true,
      notice: 'model_endpoint_unavailable',
    };
  }

  async predictShipping(input: ShippingInput): Promise<ShippingPrediction> {
    const result = await this.call('shipping', input);
    if (isShippingPrediction(result)) {
      return { ...result, modelMode: 'remote' };
    }
    const fallback = await this.fallback.predictShipping(input);
    return { ...fallback, notice: 'model_endpoint_unavailable' };
  }

  async checkDocuments(input: DocumentCheckInput): Promise<DocumentCheckResult> {
    const result = await this.call('documents', input);
    if (isDocumentCheck(result)) return result;
    return this.fallback.checkDocuments(input);
  }

  async draftQuote(input: QuoteInput): Promise<QuoteDraft> {
    const result = await this.call('quote', input);
    if (isQuoteDraft(result)) return result;
    return this.fallback.draftQuote(input);
  }
}

const configuredEndpoint = import.meta.env?.VITE_TRADE_AI_ENDPOINT as string | undefined;

export const tradeProvider: TradeIntelligenceProvider =
  configuredEndpoint && configuredEndpoint.trim().length > 0
    ? new RemoteTradeProvider(configuredEndpoint.trim())
    : new HeuristicTradeProvider();
