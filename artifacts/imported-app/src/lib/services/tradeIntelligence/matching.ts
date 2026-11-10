import type {
  Buyer,
  MatchCandidate,
  MatchFactor,
  MatchGap,
  Product,
  Supplier,
} from '../../../types/tradeIntelligence.ts';
import { BUYERS, PRODUCTS, SUPPLIERS } from './dataset.ts';
import { countryRiskFor } from './credit.ts';

export const MATCH_WEIGHTS = {
  sectorFit: 25,
  capacity: 20,
  price: 20,
  leadTime: 15,
  compliance: 10,
  countryRisk: 10,
} as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function matchId(buyerId: string, productId: string): string {
  return `${buyerId}__${productId}`;
}

/**
 * Suggestions enter the queue on different days in the seeded book. A stable
 * hash gives each untouched row an age in days (0–18) without a clock, so two
 * builds of the same dataset report the same stale rows.
 */
export function suggestedAgeDays(id: string): number {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) {
    hash = (hash * 31 + id.charCodeAt(index)) % 10_007;
  }
  return hash % 19;
}

function scoreCapacity(buyer: Buyer, product: Product, supplier: Supplier): number {
  const estimatedUnits = Math.max(product.moqUnits, Math.round(buyer.orderValueUsd / product.targetPriceUsd));
  return clamp((supplier.monthlyCapacityUnits / estimatedUnits) * 100, 10, 100);
}

function scorePrice(supplier: Supplier): number {
  return clamp(160 - supplier.priceIndex * 80, 30, 100);
}

function scoreLeadTime(supplier: Supplier): number {
  return clamp(120 - supplier.leadTimeDays * 1.6, 20, 100);
}

function scoreCompliance(supplier: Supplier): number {
  return clamp(supplier.certifications.length * 22, 20, 100);
}

export function rankMatches(
  buyers: Buyer[] = BUYERS,
  products: Product[] = PRODUCTS,
  suppliers: Supplier[] = SUPPLIERS,
): MatchCandidate[] {
  const supplierById = new Map(suppliers.map((supplier) => [supplier.id, supplier]));
  const candidates: MatchCandidate[] = [];

  for (const buyer of buyers) {
    for (const product of products) {
      if (product.sector !== buyer.sector) continue;
      const supplier = supplierById.get(product.supplierId);
      if (!supplier) continue;

      const factors: MatchFactor[] = [
        { key: 'sectorFit', score: 100, weight: MATCH_WEIGHTS.sectorFit },
        { key: 'capacity', score: scoreCapacity(buyer, product, supplier), weight: MATCH_WEIGHTS.capacity },
        { key: 'price', score: scorePrice(supplier), weight: MATCH_WEIGHTS.price },
        { key: 'leadTime', score: scoreLeadTime(supplier), weight: MATCH_WEIGHTS.leadTime },
        { key: 'compliance', score: scoreCompliance(supplier), weight: MATCH_WEIGHTS.compliance },
        {
          key: 'countryRisk',
          score: countryRiskFor(buyer.countryCode),
          weight: MATCH_WEIGHTS.countryRisk,
        },
      ].map((factor) => ({ ...factor, score: Math.round(factor.score * 10) / 10 }));

      const score =
        Math.round(
          factors.reduce((sum, factor) => sum + (factor.score * factor.weight) / 100, 0) * 10,
        ) / 10;

      const estimatedUnits = Math.max(
        product.moqUnits,
        Math.round(buyer.orderValueUsd / product.targetPriceUsd),
      );
      const gaps: MatchGap[] = [];
      if (supplier.monthlyCapacityUnits < estimatedUnits) {
        gaps.push({ key: 'capacityShortfall', severity: 'major' });
      }
      if (supplier.leadTimeDays > 38) {
        gaps.push({ key: 'leadTime', severity: supplier.leadTimeDays > 45 ? 'major' : 'minor' });
      }
      if (supplier.priceIndex > 1) {
        gaps.push({ key: 'pricePremium', severity: 'minor' });
      }
      if (supplier.certifications.length < 3) {
        gaps.push({ key: 'certificationGap', severity: 'minor' });
      }
      if (countryRiskFor(buyer.countryCode) < 55) {
        gaps.push({ key: 'countryRisk', severity: 'major' });
      }

      candidates.push({
        id: matchId(buyer.id, product.id),
        buyerId: buyer.id,
        supplierId: supplier.id,
        productId: product.id,
        score,
        factors,
        gaps,
        suggestedAgeDays: suggestedAgeDays(matchId(buyer.id, product.id)),
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score);
}
