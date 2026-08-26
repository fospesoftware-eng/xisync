// ====================================================================================
// TypeScript Core Types for Media Buyer & Automated Ad Controller Subsystem
// ====================================================================================

export type PlatformType = 'GOOGLE_ADS' | 'META_ADS' | 'TIKTOK_ADS' | 'LINKEDIN_ADS' | 'MICROSOFT_ADS';

export type TransactionType =
  | 'TOPUP_CNY'
  | 'MARGIN_DEDUCTION'
  | 'AD_RESERVATION'
  | 'AD_SETTLEMENT'
  | 'AD_REFUND'
  | 'ADMIN_ADJUSTMENT';

export type PaymentMethod =
  | 'ALIPAY'
  | 'WECHAT_PAY'
  | 'AIRWALLEX'
  | 'LIANLIAN_PAY'
  | 'UNIONPAY'
  | 'STRIPE_CHINA';

export type TransactionStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'REVERSED';

export type CampaignObjective =
  | 'B2B_LEAD_GEN'
  | 'INQUIRY_MAX'
  | 'CATALOG_SALES'
  | 'VIDEO_VIEWS'
  | 'BRAND_AWARENESS';

export type CampaignStatus =
  | 'DRAFT'
  | 'COMPLIANCE_REVIEW'
  | 'COMPLIANCE_FAILED'
  | 'ACTIVE'
  | 'PAUSED_MANUAL'
  | 'PAUSED_OUT_OF_FUNDS'
  | 'REBALANCING'
  | 'COMPLETED'
  | 'SUSPENDED';

export interface TenantWallet {
  id: string;
  tenantId: string;
  cnyBalance: number;
  usdBalance: number;
  reservedAdSpendUsd: number;
  lifetimeDepositedCny: number;
  lifetimeGrossUsdConverted: number;
  lifetimeMarginRetainedUsd: number;
  lifetimeSpentUsd: number;
  customMarginOverridePct?: number; // e.g. 0.15 for 15%
  autoPauseOnLowBalance: boolean;
  lowBalanceThresholdUsd: number;
  updatedAt: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  tenantId: string;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  paymentReference?: string;
  checkoutQrCodeUrl?: string;
  idempotencyKey: string;
  grossAmountCny: number;
  fxRate: number;
  grossAmountUsd: number;
  marginPercent: number;
  marginAmountUsd: number;
  netAdBudgetUsd: number;
  balanceBeforeUsd: number;
  balanceAfterUsd: number;
  metadata?: Record<string, any>;
  failureReason?: string;
  createdAt: string;
}

export interface ManagedCampaign {
  id: string;
  tenantId: string;
  name: string;
  objective: CampaignObjective;
  targetMarkets: string[];
  targetIndustries: string[];
  dailyBudgetUsd: number;
  totalBudgetUsd: number;
  spentAmountUsd: number;
  cpaTargetUsd?: number;
  status: CampaignStatus;
  autoRebalanceEnabled: boolean;
  startDate: string;
  endDate?: string;
  chineseHeadline: string;
  englishHeadline: string;
  spanishHeadline?: string;
  arabicHeadline?: string;
  primaryVideoUrl?: string;
  primaryImageUrl?: string;
  landingPageUrl: string;
  callToAction: string;
  complianceScore: number;
  complianceViolations: ComplianceViolation[];
  platformRatios: Record<PlatformType, number>;
  createdAt: string;
  updatedAt: string;
}

export interface ComplianceViolation {
  field: 'headline' | 'description' | 'video' | 'landing_page';
  severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
  ruleViolated: string;
  originalText: string;
  suggestedReplacement: string;
  reason: string;
}

export interface NormalizedMetrics {
  platform: PlatformType;
  impressions: number;
  clicks: number;
  ctr: number;
  videoViews: number;
  inquiriesGenerated: number;
  whatsappClicks: number;
  spendUsd: number;
  cpaUsd: number;
  attributedOrderValueUsd: number;
  trueTradeRoas: number;
}

export interface MasterMediaCredential {
  id: string;
  platform: PlatformType;
  name: string;
  mccCustomerId?: string;
  businessManagerId?: string;
  businessCenterId?: string;
  organizationUrn?: string;
  developerTokenMasked?: string;
  systemUserTokenMasked?: string;
  status: 'ACTIVE' | 'NEEDS_REAUTH' | 'RATE_LIMITED' | 'SUSPENDED';
  dailySpendCapUsd: number;
  currentDaySpendUsd: number;
  latencyMs: number;
  lastHealthCheckedAt: string;
}
