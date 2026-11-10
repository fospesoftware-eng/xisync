import type {
  CreditAssessment,
  CreditFactor,
  CreditInput,
  CreditVerdict,
  FactorLevel,
} from '../../../types/tradeIntelligence.ts';

export const COUNTRY_RISK: Record<string, number> = {
  US: 78,
  DE: 88,
  GB: 82,
  JP: 92,
  AU: 85,
  AE: 66,
  MX: 55,
  NG: 34,
  IN: 61,
  BR: 58,
  VN: 63,
  ID: 64,
  SA: 70,
  ZA: 52,
};

export const CREDIT_WEIGHTS = {
  countryRisk: 20,
  paymentHistory: 22,
  orderVsLimit: 14,
  tenor: 12,
  sectorVolatility: 10,
  concentration: 12,
  documentation: 10,
} as const;

export const HARD_STOP_SCORE = 24;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function levelFor(score: number): FactorLevel {
  if (score >= 72) return 'good';
  if (score >= 48) return 'watch';
  return 'risk';
}

export function countryRiskFor(countryCode: string): number {
  return COUNTRY_RISK[countryCode.toUpperCase()] ?? 55;
}

function scoreCountryRisk(input: CreditInput): number {
  return clamp(countryRiskFor(input.countryCode), 0, 100);
}

function scorePaymentHistory(input: CreditInput): number {
  const base = clamp(input.onTimePaymentRate, 0, 1) * 100;
  const tenureBonus = clamp(input.yearsTrading, 0, 15) * 0.8;
  return clamp(base * 0.94 + tenureBonus, 0, 100);
}

function scoreOrderVsLimit(input: CreditInput): number {
  if (input.insuredLimitUsd <= 0) return 15;
  const ratio = input.orderValueUsd / input.insuredLimitUsd;
  if (ratio <= 0.6) return 100;
  if (ratio <= 1) return clamp(100 - (ratio - 0.6) * 75, 55, 100);
  return clamp(70 - (ratio - 1) * 45, 5, 70);
}

function scoreTenor(input: CreditInput): number {
  return clamp(106 - input.tenorDays * 0.45, 8, 100);
}

function scoreSectorVolatility(input: CreditInput): number {
  return clamp((1 - clamp(input.sectorVolatility, 0, 1)) * 100, 0, 100);
}

function scoreConcentration(input: CreditInput): number {
  return clamp(112 - clamp(input.concentrationPct, 0, 100) * 1.05, 0, 100);
}

function scoreDocumentation(input: CreditInput): number {
  return clamp(input.documentsCompletePct, 0, 100);
}

function verdictFor(score: number): CreditVerdict {
  if (score >= 78) return 'eligible';
  if (score >= 62) return 'conditional';
  if (score >= 45) return 'referred';
  return 'declined';
}

function gradeFor(score: number): string {
  if (score >= 85) return 'A+';
  if (score >= 78) return 'A';
  if (score >= 68) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'E';
}

function suggestedTerms(verdict: CreditVerdict): CreditAssessment['suggestedTerms'] {
  switch (verdict) {
    case 'eligible':
      return { payment: 'open_account_60', insurance: 'full_cover' };
    case 'conditional':
      return { payment: 'lc_at_sight', insurance: 'partial_cover' };
    case 'referred':
      return { payment: 'partial_advance_30', insurance: 'conditional_cover' };
    case 'declined':
      return { payment: 'advance_100', insurance: 'not_eligible' };
  }
}

function confidenceFor(input: CreditInput): CreditAssessment['confidence'] {
  const completeness =
    (clamp(input.yearsTrading, 0, 15) / 15) * 0.35 +
    clamp(input.documentsCompletePct / 100, 0, 1) * 0.45 +
    clamp(input.onTimePaymentRate, 0, 1) * 0.2;
  if (completeness >= 0.8) return 'high';
  if (completeness >= 0.6) return 'medium';
  return 'low';
}

/**
 * Deterministic, auditable Sinosure-style eligibility assessment.
 * Higher factor scores always mean lower credit risk.
 */
export function assessCreditEligibility(
  input: CreditInput,
  options: { modelMode?: 'heuristic' | 'remote'; degraded?: boolean; notice?: string } = {},
): CreditAssessment {
  const factors: CreditFactor[] = [
    { key: 'countryRisk', score: scoreCountryRisk(input), weight: CREDIT_WEIGHTS.countryRisk },
    { key: 'paymentHistory', score: scorePaymentHistory(input), weight: CREDIT_WEIGHTS.paymentHistory },
    { key: 'orderVsLimit', score: scoreOrderVsLimit(input), weight: CREDIT_WEIGHTS.orderVsLimit },
    { key: 'tenor', score: scoreTenor(input), weight: CREDIT_WEIGHTS.tenor },
    { key: 'sectorVolatility', score: scoreSectorVolatility(input), weight: CREDIT_WEIGHTS.sectorVolatility },
    { key: 'concentration', score: scoreConcentration(input), weight: CREDIT_WEIGHTS.concentration },
    { key: 'documentation', score: scoreDocumentation(input), weight: CREDIT_WEIGHTS.documentation },
  ].map((factor) => ({
    ...factor,
    score: Math.round(factor.score * 10) / 10,
    impact: Math.round(((factor.score * factor.weight) / 100) * 10) / 10,
    level: levelFor(factor.score),
  }));

  const weighted = factors.reduce((sum, factor) => sum + factor.impact, 0);
  const hardStop = input.sanctionsFlag;
  const score = Math.round(clamp(hardStop ? Math.min(weighted, HARD_STOP_SCORE) : weighted, 0, 100));
  const verdict = hardStop ? 'declined' : verdictFor(score);

  const improvements = factors
    .map((factor) => ({
      key: factor.key,
      gain: Math.round((factor.weight * (100 - factor.score)) / 100),
    }))
    .filter((item) => item.gain >= 2)
    .sort((a, b) => b.gain - a.gain)
    .slice(0, 4);

  const coverageRatio =
    input.orderValueUsd > 0 ? Math.round((input.insuredLimitUsd / input.orderValueUsd) * 100) / 100 : 0;

  return {
    score,
    verdict,
    grade: hardStop ? 'E' : gradeFor(score),
    coverageRatio,
    factors,
    improvements: hardStop ? [] : improvements,
    suggestedTerms: suggestedTerms(verdict),
    confidence: confidenceFor(input),
    modelMode: options.modelMode ?? 'heuristic',
    degraded: options.degraded ?? false,
    notice: options.notice,
    generatedAt: new Date().toISOString(),
  };
}

export function qualifiesForCoverage(assessment: CreditAssessment): boolean {
  return assessment.verdict === 'eligible' || assessment.verdict === 'conditional';
}
