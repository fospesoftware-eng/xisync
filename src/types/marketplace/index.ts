// ====================================================================================
// TypeScript Core Types: Marketplace Channels Subsystem
// B2B Channel Publishing (Alibaba.com International Station + Made-in-China.com)
// Two-way catalog sync between the XiSync inventory (Products) and the seller's
// marketplace storefronts, following the same adapter + orchestrator workflow as
// the Media Buyer subsystem.
// ====================================================================================

/** Marketplace / sourcing-channel the seller can publish XiSync inventory to. */
export type MarketplaceChannelType = 'ALIBABA' | 'MADE_IN_CHINA';

export type SyncDirection = 'EXPORT' | 'IMPORT';
export type SyncMode = 'FULL' | 'INCREMENTAL' | 'SINGLE_SKU';

export type ChannelConnectionStatus =
  | 'CONNECTED'
  | 'NEEDS_REAUTH'
  | 'RATE_LIMITED'
  | 'ERROR'
  | 'DISCONNECTED';

/** Rough paid-membership ladder on both channels (determines API eligibility). */
export type ChannelMembershipTier =
  | 'FREE'
  | 'PAID_SUPPLIER' // Alibaba 出口通/Gold Supplier · MIC 认证供应商
  | 'PREMIUM'; // Alibaba 金品诚企 · MIC 高级认证

/** How XiSync talks to a given channel storefront today. */
export type IntegrationMode = 'OFFICIAL_API' | 'PARTNER_APP' | 'MANUAL_CSV';

export type ListingSyncState =
  | 'NOT_SYNCED' // In XiSync catalog, never (or no longer) pushed to channel
  | 'SYNCING'
  | 'LIVE' // Published & sellable on the channel
  | 'PENDING_REVIEW' // Submitted, waiting for channel moderation/approval
  | 'REJECTED' // Channel rejected the listing (see lastSyncMessage)
  | 'PAUSED' // Manually or automatically paused on the channel
  | 'ERROR'; // Last sync attempt failed (see lastSyncMessage)

export type TradeTerm = 'FOB' | 'EXW' | 'CIF' | 'DDP' | 'CIP';

export type ProductStatus = 'ACTIVE' | 'DRAFT' | 'ARCHIVED';

// ------------------------------------------------------------------------------------
// XiSync master inventory record (the source of truth that gets exported)
// ------------------------------------------------------------------------------------
export interface XisyncProduct {
  sku: string;
  nameEn: string;
  nameZh: string;
  category: string;
  descriptionEn: string;
  descriptionZh: string;
  hsCode: string;
  priceUsd: number;
  moq: number;
  stockQty: number;
  unit: string; // 'Unit' | 'Roll' | 'Set' | 'Box'
  imageUrls: string[];
  certifications: string[]; // CE, ASTM F963, ISO9001, RoHS, FSC...
  tradeTerms: TradeTerm[];
  targetMarkets: string[];
  weightKg: number;
  status: ProductStatus;
  sourceChannel: MarketplaceChannelType | 'XISYNC';
  createdAt: string;
  updatedAt: string;
}

// ------------------------------------------------------------------------------------
// A connected seller storefront on one channel
// ------------------------------------------------------------------------------------
export interface ChannelConnection {
  channel: MarketplaceChannelType;
  accountLabel: string; // Business name shown on the platform
  memberId: string; // Platform member login / supplier id
  storefrontUrl: string; // Public storefront/profile URL
  membershipTier: ChannelMembershipTier;
  membershipLabel: string; // Marketing label e.g. "Gold Supplier"
  integrationMode: IntegrationMode;
  /** Plain-English note explaining how this channel's API is reached (eligibility etc.). */
  apiAccessNote: string;
  status: ChannelConnectionStatus;
  apiHealth: string; // e.g. HEALTHY_200_OK
  lastHealthCheckedAt: string;
  lastSyncAt: string | null;
  apiCallsToday: number;
  apiQuotaPerDay: number;
  connectedAt: string;
}

// ------------------------------------------------------------------------------------
// One XiSync SKU ↔ one channel listing mapping
// ------------------------------------------------------------------------------------
export interface ProductListingMapping {
  id: string; // map_<channel>_<sku>
  sku: string;
  channel: MarketplaceChannelType;
  externalListingId: string | null; // Alibaba offer id / MIC product id
  externalListingUrl: string | null;
  channelTitle: string | null; // Title as live on the channel
  listingPriceUsd: number | null;
  listingStockQty: number | null;
  syncState: ListingSyncState;
  lastSyncAt: string | null;
  lastSyncMessage: string | null; // Human readable result / rejection reason
  createdAt: string;
}

// ------------------------------------------------------------------------------------
// A completed sync run (activity log entry)
// ------------------------------------------------------------------------------------
export interface SyncSkuResult {
  sku: string;
  action: 'CREATED' | 'UPDATED' | 'PAUSED' | 'SKIPPED' | 'FAILED' | 'NO_CHANGE' | 'IMPORTED';
  externalListingId: string | null;
  message: string;
}

export interface MarketplaceSyncRun {
  id: string;
  channel: MarketplaceChannelType;
  direction: SyncDirection;
  mode: SyncMode;
  status: 'RUNNING' | 'SUCCESS' | 'PARTIAL' | 'FAILED';
  startedAt: string;
  finishedAt: string | null;
  itemsProcessed: number;
  itemsCreated: number;
  itemsUpdated: number;
  itemsFailed: number;
  message: string;
  perSkuResults: SyncSkuResult[];
  triggeredBy: 'MANUAL' | 'API' | 'SCHEDULED';
}

// ------------------------------------------------------------------------------------
// Channel listing pulled back into XiSync (Import Queue)
// ------------------------------------------------------------------------------------
export interface ChannelImportCandidate {
  id: string; // imp_<channel>_<externalListingId>
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
  detectedAt: string;
  matchedSku: string | null; // Existing XiSync SKU matched by title token, if any
  decision: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  decisionNote: string | null;
}

export type ImportCandidateDecision = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// ------------------------------------------------------------------------------------
// Derived roll-up summary for dashboards
// ------------------------------------------------------------------------------------
export interface ChannelSummaryRow {
  channel: MarketplaceChannelType;
  connectionStatus: ChannelConnectionStatus;
  membershipLabel: string;
  integrationMode: IntegrationMode;
  apiCallsToday: number;
  apiQuotaPerDay: number;
  lastSyncAt: string | null;
  liveListings: number;
  pendingReview: number;
  rejected: number;
  paused: number;
  errors: number;
  syncedSkus: number; // SKUs with a live/pending mapping
  totalCatalogSkus: number;
  notSyncedSkus: number;
}

export interface MarketplaceSyncSummary {
  rows: ChannelSummaryRow[];
  totals: {
    catalogSkus: number;
    activeCatalogSkus: number;
    liveListings: number;
    syncedSkus: number;
    pendingReview: number;
    syncIssues: number; // rejected + paused(manual auto) + errors across channels
    importQueuePending: number;
  };
}
