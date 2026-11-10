export type Bilingual = { en: string; zh: string };

export type CreditVerdict = 'eligible' | 'conditional' | 'referred' | 'declined';
export type FactorLevel = 'good' | 'watch' | 'risk';
export type ConfidenceBand = 'low' | 'medium' | 'high';

export interface Buyer {
  id: string;
  name: Bilingual;
  countryCode: string;
  country: Bilingual;
  sector: string;
  sectorLabel: Bilingual;
  yearsTrading: number;
  onTimePaymentRate: number;
  orderValueUsd: number;
  insuredLimitUsd: number;
  tenorDays: number;
  sectorVolatility: number;
  concentrationPct: number;
  documentsCompletePct: number;
  sanctionsFlag: boolean;
  countryRiskScore: number;
}

export interface Supplier {
  id: string;
  name: Bilingual;
  city: Bilingual;
  sector: string;
  sectorLabel: Bilingual;
  monthlyCapacityUnits: number;
  leadTimeDays: number;
  priceIndex: number;
  certifications: string[];
  rating: number;
}

export interface Product {
  id: string;
  name: Bilingual;
  sector: string;
  sectorLabel: Bilingual;
  hsCode: string;
  targetPriceUsd: number;
  moqUnits: number;
  supplierId: string;
}

export type ShippingMode = 'fcl' | 'lcl' | 'air' | 'rail';
export type ContainerType = '20ft' | '40ft' | '40ft_hc';
export type Incoterm = 'EXW' | 'FOB' | 'CFR' | 'CIF' | 'DDP';
export type CongestionLevel = 'low' | 'medium' | 'high';

export interface Lane {
  id: string;
  originCode: string;
  destinationCode: string;
  origin: Bilingual;
  destination: Bilingual;
  distanceKm: number;
  transitBaseDays: number;
  costPerFeuUsd: number;
  congestion: CongestionLevel;
  onTimePct: number;
  carrier: string;
}

export interface OrderRecord {
  id: string;
  buyerId: string;
  productId: string;
  laneId: string;
  valueUsd: number;
  marginPct: number;
  incoterm: Incoterm;
  mode: ShippingMode;
  shippedAt: string;
  status: 'in_transit' | 'delivered' | 'exception' | 'booked';
  onTime: boolean;
}

export interface CreditInput {
  buyerId?: string;
  buyerName: string;
  countryCode: string;
  yearsTrading: number;
  onTimePaymentRate: number;
  orderValueUsd: number;
  insuredLimitUsd: number;
  tenorDays: number;
  sectorVolatility: number;
  concentrationPct: number;
  documentsCompletePct: number;
  sanctionsFlag: boolean;
}

export interface CreditFactor {
  key: string;
  score: number;
  weight: number;
  impact: number;
  level: FactorLevel;
}

export interface CreditAssessment {
  score: number;
  verdict: CreditVerdict;
  grade: string;
  coverageRatio: number;
  factors: CreditFactor[];
  improvements: { key: string; gain: number }[];
  suggestedTerms: { payment: string; insurance: string };
  confidence: ConfidenceBand;
  modelMode: 'heuristic' | 'remote';
  degraded: boolean;
  notice?: string;
  generatedAt: string;
}

export interface ShippingInput {
  originCode: string;
  destinationCode: string;
  mode: ShippingMode;
  containerType: ContainerType;
  weightKg: number;
  volumeCbm: number;
  incoterm: Incoterm;
  month: number;
  fuelSurchargePct: number;
  peakSeason: boolean;
  portCongestion: CongestionLevel;
  cargoValueUsd: number;
  priority?: 'cost' | 'balanced' | 'speed';
}

export interface CostDriver {
  key: string;
  amountUsd: number;
  direction: 'up' | 'down';
}

export interface ShippingEstimate {
  mode: ShippingMode;
  costLowUsd: number;
  costMidUsd: number;
  costHighUsd: number;
  transitLowDays: number;
  transitHighDays: number;
  co2Tons: number;
  confidence: number;
  breakdown: CostDriver[];
}

export interface ShippingPrediction {
  laneId: string;
  laneLabel: Bilingual;
  distanceKm: number;
  estimates: ShippingEstimate[];
  recommendedMode: ShippingMode;
  selected: ShippingEstimate;
  notice?: string;
  modelMode: 'heuristic' | 'remote';
  generatedAt: string;
}

export interface MatchFactor {
  key: string;
  score: number;
  weight: number;
}

export interface MatchGap {
  key: string;
  severity: 'minor' | 'major';
}

export interface MatchCandidate {
  id: string;
  buyerId: string;
  supplierId: string;
  productId: string;
  score: number;
  factors: MatchFactor[];
  gaps: MatchGap[];
  /** Seeded age of the suggestion, so untouched rows can be flagged stale. */
  suggestedAgeDays: number;
}

export type MatchStage = 'suggested' | 'shortlisted' | 'contacted' | 'negotiating' | 'won' | 'lost';

export interface MatchStageChange {
  stage: MatchStage;
  at: string;
}

export interface MatchWorkflow {
  stage: MatchStage;
  updatedAt: string;
  history: MatchStageChange[];
}

export interface SavedAssessment {
  id: string;
  buyerId?: string;
  buyerName: string;
  score: number;
  verdict: CreditVerdict;
  createdAt: string;
  input: CreditInput;
}

export interface QuoteInput {
  buyerName: string;
  productName: string;
  quantity: number;
  unitPriceUsd: number;
  incoterm: Incoterm;
  leadTimeDays: number;
  paymentTerms: string;
  validityDays: number;
}

export interface QuoteDraft {
  reference: string;
  subtotalUsd: number;
  freightUsd: number;
  insuranceUsd: number;
  totalUsd: number;
  lines: { key: string; value: string }[];
  summary: Bilingual;
  generatedAt: string;
}

export interface SavedQuote {
  id: string;
  reference: string;
  buyerName: string;
  productName: string;
  totalUsd: number;
  createdAt: string;
  input: QuoteInput;
}

export type MarketCode = 'eu' | 'us' | 'asean' | 'mena';
export type DocumentStatus = 'complete' | 'missing' | 'expiring' | 'not_applicable';

export interface DocumentCheckInput {
  productName: string;
  hsCode: string;
  market: MarketCode;
  invoiceValueUsd: number;
  documents: Record<string, DocumentStatus>;
}

export interface DocumentCheckIssue {
  key: string;
  severity: 'warning' | 'critical';
}

export interface DocumentCheckResult {
  readinessPct: number;
  verdict: 'ready' | 'conditional' | 'blocked';
  items: { key: string; status: DocumentStatus }[];
  issues: DocumentCheckIssue[];
  summary: Bilingual;
  generatedAt: string;
}

export interface SavedDocumentCheck {
  id: string;
  productName: string;
  market: MarketCode;
  readinessPct: number;
  verdict: DocumentCheckResult['verdict'];
  createdAt: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';
export type AlertCategory = 'tariff' | 'risk' | 'logistics' | 'credit';

export interface TradeAlert {
  id: string;
  severity: AlertSeverity;
  category: AlertCategory;
  title: Bilingual;
  detail: Bilingual;
  action: Bilingual;
}

export interface OrderAnomaly {
  orderId: string;
  score: number;
  reasonKey: string;
  detail: Bilingual;
}

export interface PipelinePoint {
  stage: MatchStage;
  count: number;
  valueUsd: number;
}

export interface ExposurePoint {
  countryCode: string;
  country: Bilingual;
  exposureUsd: number;
  riskScore: number;
}

export interface LanePerformancePoint {
  laneId: string;
  label: Bilingual;
  onTimePct: number;
  avgTransitDays: number;
  costPerFeuUsd: number;
  orders: number;
  marginPct: number;
}

export interface RiskBandPoint {
  band: 'low' | 'moderate' | 'elevated' | 'high';
  count: number;
}

export interface MonthlyFlowPoint {
  month: string;
  revenueUsd: number;
  orders: number;
}

export interface TradeWorkspaceState {
  version: 1;
  matchWorkflows: Record<string, MatchWorkflow>;
  assessments: SavedAssessment[];
  quotes: SavedQuote[];
  documentChecks: SavedDocumentCheck[];
  snapshots: DailySnapshot[];
  updatedAt: string;
}

export interface DailySnapshot {
  date: string;
  capturedAt: string;
  exposure: {
    insuredUsd: number;
    uninsuredUsd: number;
    committedUsd: number;
    pipelineUsd: number;
  };
  kpis: {
    revenueUsd: number;
    openExposureUsd: number;
    marginPct: number;
    orderIntake: number;
  };
  pipeline: { stage: MatchStage; count: number; valueUsd: number }[];
  risk: { high: number; medium: number; low: number };
  actions: { total: number; critical: number; warning: number; info: number };
}

export interface TradeWorkspaceRepository {
  load(tenantId: string): Promise<TradeWorkspaceState>;
  save(tenantId: string, state: TradeWorkspaceState): Promise<void>;
}

export interface AnalyticsSnapshot {
  totalPipelineValueUsd: number;
  totalExposureUsd: number;
  averageMarginPct: number;
  activeMatches: number;
  pipeline: PipelinePoint[];
  exposureByCountry: ExposurePoint[];
  lanePerformance: LanePerformancePoint[];
  riskDistribution: RiskBandPoint[];
  monthlyFlow: MonthlyFlowPoint[];
}

export type CommandModule = 'credit' | 'shipping' | 'matching' | 'analytics' | 'toolkit';

export interface CommandAction {
  id: string;
  category: 'credit' | 'logistics' | 'matching' | 'documents' | 'anomaly';
  severity: AlertSeverity;
  priority: number;
  title: Bilingual;
  reason: Bilingual;
  impactUsd?: number;
  module: CommandModule;
}

export interface CommandKpi {
  key: 'revenue' | 'exposure' | 'margin' | 'orders';
  label: Bilingual;
  value: number;
  unit: 'usd' | 'pct' | 'count';
  deltaPct: number | null;
  baselineDate?: string;
  series: number[];
}

export interface CommandExposure {
  insuredUsd: number;
  uninsuredUsd: number;
  committedUsd: number;
  pipelineUsd: number;
  largest: { country: Bilingual; exposureUsd: number; riskScore: number } | null;
}

export interface ShipmentRiskCard {
  orderId: string;
  buyerName: Bilingual;
  laneLabel: Bilingual;
  mode: ShippingMode;
  valueUsd: number;
  status: OrderRecord['status'];
  insured: boolean;
  transitLowDays: number;
  transitHighDays: number;
  plannedDays: number;
  slipDays: number;
  riskLevel: 'critical' | 'warning' | 'clear';
  flags: { key: string; label: Bilingual }[];
}

export interface PipelineColumn {
  stage: MatchStage;
  count: number;
  valueUsd: number;
  staleCount: number;
  top: { id: string; buyerName: Bilingual; productName: Bilingual; score: number }[];
}

export interface CommandBriefing {
  headline: Bilingual;
  lines: Bilingual[];
  generatedAt: string;
}

export interface CommandCenterSnapshot {
  actions: CommandAction[];
  briefing: CommandBriefing;
  kpis: CommandKpi[];
  exposure: CommandExposure;
  shipments: ShipmentRiskCard[];
  pipeline: PipelineColumn[];
  generatedAt: string;
}
