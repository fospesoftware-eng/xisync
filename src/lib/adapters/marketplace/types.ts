// ====================================================================================
// Marketplace Channel Adapter Contract
// One adapter per channel (Alibaba.com / Made-in-China.com) that normalizes the
// platform's product-publishing surface behind a single interface so the XiSync
// orchestrator can push/pull with the same workflow used for ad platforms.
//
// PRODUCTION MAPPING NOTES (from official API research - 2025):
//  - Alibaba.com International Station (ICBU/阿里国际站) APIs are reached through
//    the ICBU Open Platform. Access is via an ISV/partner app (appkey/appsecret,
//    OAuth2.0 consent at oauth.alibaba.com?sp=icbu) - sellers usually subscribe to
//    a certified ERP app on fuwu.alibaba.com and authorize their store account.
//    Product publishing uses the schema-based ICBU product APIs
//    (alibaba.icbu.product.schema.*, category.get.new, photobank.*, inventory.*).
//  - Made-in-China.com (焦点科技) exposes a supplier open API for paid/certified
//    suppliers; exact endpoint family pending verified documentation.
// The classes in this folder simulate those calls deterministically so the full
// module workflow can run end-to-end without live credentials.
// ====================================================================================

import type {
  MarketplaceChannelType,
  ListingSyncState,
} from '../../../types/marketplace';

/** Normalized product payload the orchestrator hands to any channel adapter. */
export interface AdapterMarketplaceProduct {
  sku: string;
  titleEn: string;
  titleZh?: string;
  category: string;
  descriptionEn: string;
  descriptionZh?: string;
  hsCode: string;
  priceUsd: number;
  moq: number;
  stockQty: number;
  unit: string;
  imageUrls: string[];
  certifications: string[];
  tradeTerms: string[];
  targetMarkets: string[];
  weightKg: number;
}

export type ChannelListingState = Exclude<ListingSyncState, 'NOT_SYNCED' | 'SYNCING' | 'ERROR'>;

export interface ChannelListingResult {
  channel: MarketplaceChannelType;
  externalListingId: string;
  externalListingUrl: string;
  state: ChannelListingState;
  listingPriceUsd: number;
  listingStockQty: number;
}

/** A listing pulled back from the channel (Import side). */
export interface AdapterImportCandidate {
  channel: MarketplaceChannelType;
  externalListingId: string;
  externalListingUrl: string;
  title: string;
  priceUsd: number | null;
  moq: number | null;
  stockQty: number | null;
  imageUrls: string[];
  category: string | null;
  description: string | null;
}

export interface ListingLookup {
  externalListingId: string;
  externalListingUrl: string;
  title: string;
  state: Exclude<ChannelListingState, 'PENDING_REVIEW'> | 'PENDING_REVIEW';
  listingPriceUsd: number | null;
  listingStockQty: number | null;
}

export interface ChannelConnectionHealth {
  channel: MarketplaceChannelType;
  ok: boolean;
  latencyMs: number;
  message: string;
}

export interface MarketplaceChannelAdapter {
  readonly channel: MarketplaceChannelType;
  readonly label: string;
  /** Verifies credentials + API reachability for the connected storefront. */
  checkConnection(): Promise<ChannelConnectionHealth>;
  /** Create-or-update (upsert) semantics keyed by normalized SKU. */
  exportProduct(product: AdapterMarketplaceProduct): Promise<ChannelListingResult>;
  updateProduct(
    externalListingId: string,
    product: AdapterMarketplaceProduct
  ): Promise<ChannelListingResult>;
  /** On/off-shelf the listing (pause when XiSync stock hits 0). */
  setListingActive(externalListingId: string, active: boolean): Promise<ListingLookup>;
  deleteListing(externalListingId: string): Promise<void>;
  fetchListing(externalListingId: string): Promise<ListingLookup>;
  listActiveListings(): Promise<ListingLookup[]>;
  /** Pulls current storefront listings back (Import side of the workflow). */
  importRecentListings(maxItems?: number): Promise<AdapterImportCandidate[]>;
}

// ------------------------------------------------------------------------------------
// Shared helpers
// ------------------------------------------------------------------------------------

/** Deterministic listing id so re-exports behave like upserts (idempotent). */
export function channelListingId(channel: MarketplaceChannelType, sku: string): string {
  return channel === 'ALIBABA' ? `ALB-${sku}` : `MIC-${sku}`;
}

export function listingUrlFor(
  channel: MarketplaceChannelType,
  externalListingId: string,
  titleSlug: string
): string {
  const slug = titleSlug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return channel === 'ALIBABA'
    ? `https://www.alibaba.com/product-detail/${slug}_${externalListingId.replace('-', '')}.html`
    : `https://www.made-in-china.com/product/${externalListingId}.html`;
}

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Channel-side validation shared by adapters before "calling" the platform. */
export function validateProductForChannel(
  product: AdapterMarketplaceProduct,
  rules: { requireZh?: boolean; minPriceUsd?: number; minImages?: number }
): string | null {
  if (!product.sku) return 'Missing SKU - cannot publish anonymous product.';
  if (product.priceUsd <= 0 || product.priceUsd < (rules.minPriceUsd ?? 0))
    return `Price ${product.priceUsd} USD below channel minimum.`;
  if (product.imageUrls.length === 0) return 'At least one product image is required.';
  if (product.imageUrls.length < (rules.minImages ?? 1))
    return `At least ${rules.minImages ?? 1} product images are required by this channel.`;
  if (product.stockQty < 0) return 'Stock quantity cannot be negative.';
  if (product.moq <= 0) return 'MOQ must be greater than zero.';
  if (!product.hsCode) return 'HS (tariff) code is required for cross-border listings.';
  if (rules.requireZh && !product.titleZh && !product.descriptionZh)
    return 'Chinese title/description is required by this channel listing policy.';
  return null;
}
