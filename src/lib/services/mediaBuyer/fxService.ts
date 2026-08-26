// ====================================================================================
// FX Rate & Treasury Conversion Microservice with Mid-Market Caching & Platform Margin
// ====================================================================================

export interface FxRateResult {
  baseCurrency: 'USD';
  targetCurrency: 'CNY';
  midMarketRate: number; // e.g. 7.2350 CNY per 1 USD
  inverseRate: number;   // e.g. 0.1382 USD per 1 CNY
  timestamp: number;
  source: 'EXCHANGE_RATE_API' | 'OPEN_EXCHANGE' | 'CACHED_FALLBACK';
}

export interface MarginConversionResult {
  depositAmountCny: number;
  fxRate: number;
  grossAmountUsd: number;
  marginPercent: number;     // e.g. 0.20 (20%)
  marginAmountUsd: number;   // Gross USD * 0.20
  netAdBudgetUsd: number;    // Gross USD - Margin Amount
  netAdBudgetCnyEquivalent: number;
  calculatedAt: string;
}

export class FxConversionService {
  private static CACHED_RATE: FxRateResult = {
    baseCurrency: 'USD',
    targetCurrency: 'CNY',
    midMarketRate: 7.235,
    inverseRate: 1 / 7.235,
    timestamp: Date.now(),
    source: 'CACHED_FALLBACK',
  };

  private static CACHE_TTL_MS = 1000 * 60 * 15; // 15 Minutes

  /**
   * Fetches real-time USD/CNY exchange rate with local in-memory fallback.
   */
  public static async getLiveUsdCnyRate(): Promise<FxRateResult> {
    const isCacheValid = Date.now() - this.CACHED_RATE.timestamp < this.CACHE_TTL_MS;
    if (isCacheValid) {
      return this.CACHED_RATE;
    }

    try {
      // In production, pulls from ExchangeRate-API or OpenExchangeRates
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD', {
        headers: { 'User-Agent': 'XiSync-Treasury/2.0' },
      });

      if (response.ok) {
        const data = await response.json();
        const cnyRate = Number(data.rates?.CNY) || 7.235;

        this.CACHED_RATE = {
          baseCurrency: 'USD',
          targetCurrency: 'CNY',
          midMarketRate: cnyRate,
          inverseRate: 1 / cnyRate,
          timestamp: Date.now(),
          source: 'EXCHANGE_RATE_API',
        };
        return this.CACHED_RATE;
      }
    } catch (err) {
      console.warn('Live FX rate fetch failed, utilizing cached fallback rate:', err);
    }

    return this.CACHED_RATE;
  }

  /**
   * Executes the exact Cross-Border Media Buying Top-up & Platform Margin Math:
   * 1. Gross USD = Deposit CNY / FX Rate
   * 2. Platform Margin (e.g. 20%) = Gross USD * Margin Percent
   * 3. Allocatable Ad Budget = Gross USD - Platform Margin
   */
  public static calculateTopUpConversion(
    depositAmountCny: number,
    customMarginPct: number = 0.20,
    fxRateOverride?: number
  ): MarginConversionResult {
    const fxRate = fxRateOverride || this.CACHED_RATE.midMarketRate;
    
    // Exact decimal precision rounding
    const grossAmountUsd = Number((depositAmountCny / fxRate).toFixed(4));
    const marginAmountUsd = Number((grossAmountUsd * customMarginPct).toFixed(4));
    const netAdBudgetUsd = Number((grossAmountUsd - marginAmountUsd).toFixed(4));
    const netAdBudgetCnyEquivalent = Number((netAdBudgetUsd * fxRate).toFixed(2));

    return {
      depositAmountCny,
      fxRate,
      grossAmountUsd,
      marginPercent: customMarginPct,
      marginAmountUsd,
      netAdBudgetUsd,
      netAdBudgetCnyEquivalent,
      calculatedAt: new Date().toISOString(),
    };
  }
}
