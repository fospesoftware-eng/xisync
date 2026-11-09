// ====================================================================================
// Marketplace Sync Orchestrator - Alibaba.com + Made-in-China.com
// Mirrors the Media Buyer workflow: a unified XiSync catalog fans out to one
// adapter per channel, tracks per-SKU↔listing mappings, records sync runs and
// supports two-way sync (EXPORT inventory -> channel, IMPORT channel -> queue).
//
// State is module-level (in-memory) so the whole module runs end-to-end in the
// SPA without a backend, exactly like WalletLedgerService/ProductionMediaOrchestrator.
// ====================================================================================

import type {
  ChannelConnection,
  ChannelImportCandidate,
  ChannelMembershipTier,
  ChannelSummaryRow,
  ListingSyncState,
  MarketplaceChannelType,
  MarketplaceSyncRun,
  MarketplaceSyncSummary,
  ProductListingMapping,
  SyncDirection,
  SyncMode,
  XisyncProduct,
} from '../../../types/marketplace';
import type {
  AdapterMarketplaceProduct,
  MarketplaceChannelAdapter,
} from '../../adapters/marketplace/types';
import { AlibabaMarketplaceAdapter } from '../../adapters/marketplace/alibabaAdapter';
import { MadeInChinaMarketplaceAdapter } from '../../adapters/marketplace/madeInChinaAdapter';
import { CatalogRepository } from './catalogRepository';

// ------------------------------------------------------------------------------------
// Small seed/time helpers
// ------------------------------------------------------------------------------------
const minsAgo = (mins: number) => new Date(Date.now() - mins * 60_000).toISOString();

let runCounter = 0;
const nextRunId = () => `mks-${Date.now()}-${++runCounter}`;

function productToAdapterProduct(p: XisyncProduct): AdapterMarketplaceProduct {
  return {
    sku: p.sku,
    titleEn: p.nameEn,
    titleZh: p.nameZh,
    category: p.category,
    descriptionEn: p.descriptionEn,
    descriptionZh: p.descriptionZh,
    hsCode: p.hsCode,
    priceUsd: p.priceUsd,
    moq: p.moq,
    stockQty: p.stockQty,
    unit: p.unit,
    imageUrls: p.imageUrls,
    certifications: p.certifications,
    tradeTerms: p.tradeTerms,
    targetMarkets: p.targetMarkets,
    weightKg: p.weightKg,
  };
}

// ------------------------------------------------------------------------------------
// Seed: channel connections (with the real-world API-access model surfaced)
// ------------------------------------------------------------------------------------
const connections: ChannelConnection[] = [
  {
    channel: 'ALIBABA',
    accountLabel: 'Shenzhen EcoToys Manufacturing Co., Ltd.',
    memberId: 'ecotoys_99182',
    storefrontUrl: 'https://ecotoys.en.alibaba.com',
    membershipTier: 'PAID_SUPPLIER',
    membershipLabel: '出口通 · Gold Supplier',
    integrationMode: 'PARTNER_APP',
    apiAccessNote:
      'ICBU Open Platform product APIs are reached through a certified ISV/ERP app: XiSync subscribes on fuwu.alibaba.com (外贸服务市场) and you authorize with this Alibaba.com store login (OAuth2.0, sp=icbu). Official dev quota: 5,000 calls/day per app.',
    status: 'CONNECTED',
    apiHealth: 'HEALTHY_200_OK',
    lastHealthCheckedAt: minsAgo(14),
    lastSyncAt: minsAgo(25),
    apiCallsToday: 184,
    apiQuotaPerDay: 5000,
    connectedAt: '2026-05-12T08:00:00Z',
  },
  {
    channel: 'MADE_IN_CHINA',
    accountLabel: 'Shenzhen EcoToys Manufacturing Co., Ltd. (深圳伊可玩具制造有限公司)',
    memberId: 'ecotoyscn',
    storefrontUrl: 'https://ecotoyscn.en.made-in-china.com',
    membershipTier: 'PAID_SUPPLIER',
    membershipLabel: '认证供应商 · Audited Supplier',
    integrationMode: 'PARTNER_APP',
    apiAccessNote:
      'Verified 2026: Made-in-China.com (Focus Technology) has NO official seller catalog API. Batch tooling = Excel-template bulk import in 外贸e家/Virtual Office; scraping is prohibited. XiSync keeps a forward-compatible connector: until Focus ships a sanctioned API, catalog export maps to the official bulk-import template and live two-way sync is simulated.',
    status: 'CONNECTED',
    apiHealth: 'HEALTHY_200_OK',
    lastHealthCheckedAt: minsAgo(8),
    lastSyncAt: minsAgo(40),
    apiCallsToday: 96,
    apiQuotaPerDay: 5000,
    connectedAt: '2026-06-01T06:30:00Z',
  },
];

// ------------------------------------------------------------------------------------
// Seed: per-SKU ↔ channel listing mappings
// ------------------------------------------------------------------------------------
const mkMapping = (
  sku: string,
  channel: MarketplaceChannelType,
  opts: {
    externalId?: string;
    listingUrl?: string;
    state: ListingSyncState;
    price?: number;
    stock?: number;
    lastSync?: string;
    message?: string;
    title?: string;
    createdAt?: string;
  }
): ProductListingMapping => ({
  id: `map_${channel}_${sku}`,
  sku,
  channel,
  externalListingId: opts.externalId ?? null,
  externalListingUrl: opts.listingUrl ?? null,
  channelTitle: opts.title ?? null,
  listingPriceUsd: opts.price ?? null,
  listingStockQty: opts.stock ?? null,
  syncState: opts.state,
  lastSyncAt: opts.lastSync ?? null,
  lastSyncMessage: opts.message ?? null,
  createdAt: opts.createdAt ?? '2026-07-20T02:00:00Z',
});

const mappings: ProductListingMapping[] = [
  // ------------------------- Alibaba.com -------------------------
  mkMapping('INV-4000-HE', 'ALIBABA', {
    externalId: 'ALB-INV-4000-HE',
    listingUrl:
      'https://www.alibaba.com/product-detail/5000w-commercial-hybrid-solar-inverter_ALBINV4000HE.html',
    title: '5,000W Commercial Hybrid Solar Inverter Factory Direct Solar PV & Energy MOQ 1',
    state: 'LIVE',
    price: 1250,
    stock: 340,
    lastSync: minsAgo(25),
    message: 'Updated price/stock on Alibaba.com.',
  }),
  mkMapping('PV-BOX-2026', 'ALIBABA', {
    externalId: 'ALB-PV-BOX-2026',
    listingUrl:
      'https://www.alibaba.com/product-detail/ip68-waterproof-pv-junction-box_ALBPVBOX2026.html',
    title: 'IP68 Waterproof PV Junction Box Factory Direct Solar PV & Energy MOQ 1000',
    state: 'LIVE',
    price: 6.8,
    stock: 8900,
    lastSync: minsAgo(25),
    message: 'Updated price/stock on Alibaba.com.',
  }),
  mkMapping('LED-8800-HC', 'ALIBABA', {
    externalId: 'ALB-LED-8800-HC',
    listingUrl:
      'https://www.alibaba.com/product-detail/ultra-thin-smart-industrial-led-panel_ALBLED8800HC.html',
    title: 'Ultra-Thin Smart Industrial LED Panel Factory Direct High-Tech Electronics MOQ 200',
    state: 'LIVE',
    price: 42.5,
    stock: 1200,
    lastSync: minsAgo(25),
    message: 'Updated price/stock on Alibaba.com.',
  }),
  mkMapping('TR-9900-MX', 'ALIBABA', {
    externalId: 'ALB-TR-9900-MX',
    listingUrl:
      'https://www.alibaba.com/product-detail/precision-micro-transformer-module_ALBTR9900MX.html',
    title: 'Precision Micro-Transformer Module Factory Direct Precision Hardware MOQ 1000',
    state: 'LIVE',
    price: 18.2,
    stock: 4500,
    lastSync: minsAgo(25),
    message: 'Updated price/stock on Alibaba.com.',
  }),
  mkMapping('VAL-X900-HYD', 'ALIBABA', {
    externalId: 'ALB-VAL-X900-HYD',
    listingUrl:
      'https://www.alibaba.com/product-detail/industrial-hydraulic-valve-assembly_ALBVALX900HYD.html',
    title: 'Industrial Hydraulic Valve Assembly X-900 China Manufacturer Machinery & Components MOQ 50',
    state: 'REJECTED',
    price: 450,
    stock: 1240,
    lastSync: minsAgo(180),
    message:
      'Rejected: title contains promotional keyword "Factory Direct" not allowed on Alibaba product details. Rename and resubmit.',
  }),
  mkMapping('SNS-8800-IOT', 'ALIBABA', {
    externalId: 'ALB-SNS-8800-IOT',
    listingUrl:
      'https://www.alibaba.com/product-detail/smart-iot-precision-sensor-array_ALBSNS8800IOT.html',
    title: 'Smart IoT Precision Sensor Array v4 Factory Direct Electronics & Sensors MOQ 100',
    state: 'PENDING_REVIEW',
    price: 85,
    stock: 3800,
    lastSync: minsAgo(360),
    message: 'Offer submitted to Alibaba moderation queue (expected review < 48h).',
  }),
  mkMapping('CF-3K-CARBON', 'ALIBABA', {
    state: 'NOT_SYNCED',
  }),
  // ----------------------- Made-in-China.com ---------------------
  mkMapping('INV-4000-HE', 'MADE_IN_CHINA', {
    externalId: 'MIC-INV-4000-HE',
    listingUrl: 'https://www.made-in-china.com/product/MIC-INV-4000-HE.html',
    title: '5,000W Commercial Hybrid Solar Inverter - China Manufacturer Solar PV & Energy (FOB/CIF)',
    state: 'LIVE',
    price: 1250,
    stock: 340,
    lastSync: minsAgo(40),
    message: 'Updated price/stock on Made-in-China.com.',
  }),
  mkMapping('PV-BOX-2026', 'MADE_IN_CHINA', {
    externalId: 'MIC-PV-BOX-2026',
    listingUrl: 'https://www.made-in-china.com/product/MIC-PV-BOX-2026.html',
    title: 'IP68 Waterproof PV Junction Box - China Manufacturer Solar PV & Energy (FOB/CIF)',
    state: 'LIVE',
    price: 6.8,
    stock: 8900,
    lastSync: minsAgo(40),
    message: 'Updated price/stock on Made-in-China.com.',
  }),
  mkMapping('LED-8800-HC', 'MADE_IN_CHINA', {
    externalId: 'MIC-LED-8800-HC',
    listingUrl: 'https://www.made-in-china.com/product/MIC-LED-8800-HC.html',
    title: 'Ultra-Thin Smart Industrial LED Panel - China Manufacturer High-Tech Electronics (FOB/CIF)',
    state: 'LIVE',
    price: 42.5,
    stock: 1200,
    lastSync: minsAgo(40),
    message: 'Updated price/stock on Made-in-China.com.',
  }),
  mkMapping('TR-9900-MX', 'MADE_IN_CHINA', {
    externalId: 'MIC-TR-9900-MX',
    listingUrl: 'https://www.made-in-china.com/product/MIC-TR-9900-MX.html',
    title: 'Precision Micro-Transformer Module - China Manufacturer Precision Hardware (FOB/CIF)',
    state: 'LIVE',
    price: 18.2,
    stock: 4500,
    lastSync: minsAgo(40),
    message: 'Updated price/stock on Made-in-China.com.',
  }),
  mkMapping('VAL-X900-HYD', 'MADE_IN_CHINA', {
    externalId: 'MIC-VAL-X900-HYD',
    listingUrl: 'https://www.made-in-china.com/product/MIC-VAL-X900-HYD.html',
    title: 'Industrial Hydraulic Valve Assembly X-900 - China Manufacturer Machinery & Components',
    state: 'PAUSED',
    price: 450,
    stock: 1240,
    lastSync: minsAgo(40),
    message: 'Paused on channel (manual hold by sales team).',
  }),
  mkMapping('SNS-8800-IOT', 'MADE_IN_CHINA', { state: 'NOT_SYNCED' }),
  mkMapping('CF-3K-CARBON', 'MADE_IN_CHINA', { state: 'NOT_SYNCED' }),
];

// ------------------------------------------------------------------------------------
// Seed: sync run history
// ------------------------------------------------------------------------------------
const syncRuns: MarketplaceSyncRun[] = [
  {
    id: 'mks-seed-alb-export',
    channel: 'ALIBABA',
    direction: 'EXPORT',
    mode: 'FULL',
    status: 'SUCCESS',
    startedAt: minsAgo(25),
    finishedAt: minsAgo(24),
    itemsProcessed: 7,
    itemsCreated: 0,
    itemsUpdated: 6,
    itemsFailed: 0,
    message:
      'Pushed 6 existing listings (price/stock refresh). SNS-8800-IOT offer remained under moderation - not re-submitted.',
    perSkuResults: [
      { sku: 'INV-4000-HE', action: 'UPDATED', externalListingId: 'ALB-INV-4000-HE', message: 'Stock 340, price $1,250.00 synced.' },
      { sku: 'SNS-8800-IOT', action: 'NO_CHANGE', externalListingId: 'ALB-SNS-8800-IOT', message: 'Listing still under Alibaba moderation.' },
    ],
    triggeredBy: 'MANUAL',
  },
  {
    id: 'mks-seed-mic-export',
    channel: 'MADE_IN_CHINA',
    direction: 'EXPORT',
    mode: 'FULL',
    status: 'SUCCESS',
    startedAt: minsAgo(40),
    finishedAt: minsAgo(39),
    itemsProcessed: 7,
    itemsCreated: 0,
    itemsUpdated: 4,
    itemsFailed: 0,
    message: 'Pushed 4 live listings; VAL-X900-HYD left paused (manual hold); 2 SKUs not yet published to MIC.',
    perSkuResults: [
      { sku: 'INV-4000-HE', action: 'UPDATED', externalListingId: 'MIC-INV-4000-HE', message: 'Stock 340, price $1,250.00 synced.' },
      { sku: 'VAL-X900-HYD', action: 'SKIPPED', externalListingId: 'MIC-VAL-X900-HYD', message: 'Manual pause respected - not resumed.' },
    ],
    triggeredBy: 'MANUAL',
  },
  {
    id: 'mks-seed-alb-import',
    channel: 'ALIBABA',
    direction: 'IMPORT',
    mode: 'INCREMENTAL',
    status: 'SUCCESS',
    startedAt: minsAgo(200),
    finishedAt: minsAgo(199),
    itemsProcessed: 3,
    itemsCreated: 0,
    itemsUpdated: 0,
    itemsFailed: 0,
    message: 'Pulled 3 storefront listings. 1 matched to XiSync SKU (PV-BOX-2026), 2 unmatched - sent to Import Queue for review.',
    perSkuResults: [
      { sku: 'PV-BOX-2026', action: 'IMPORTED', externalListingId: 'ALB-PVB-PV-BOX-2026', message: 'Matched existing SKU - queue for reconcile.' },
      { sku: 'WOOD-MONTESSORI-BULK', action: 'IMPORTED', externalListingId: 'ALB-WOOD-MONTESSORI-BULK', message: 'No XiSync match - queue for new product review.' },
      { sku: 'CUSTOM-PCBA-7K', action: 'IMPORTED', externalListingId: 'ALB-CUSTOM-PCBA-7K', message: 'No XiSync match - queue for new product review.' },
    ],
    triggeredBy: 'SCHEDULED',
  },
];

// ------------------------------------------------------------------------------------
// Seed: import queue (results of the scheduled Alibaba import above)
// ------------------------------------------------------------------------------------
const importQueue: ChannelImportCandidate[] = [
  {
    id: 'imp_ALIBABA_ALB-PVB-PV-BOX-2026',
    channel: 'ALIBABA',
    externalListingId: 'ALB-PVB-PV-BOX-2026',
    externalListingUrl: 'https://www.alibaba.com/product-detail/ip68-pv-junction-box_ALBPVB.html',
    title: 'IP68 Waterproof PV Junction Box PV-BOX-2026 1000V 30A (Section 301 Exempt)',
    priceUsd: 6.8,
    moq: 1000,
    stockQty: 12500,
    imageUrls: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'],
    category: 'Solar PV & Energy',
    description:
      'IP68 rated PV junction box compatible with 30A string inverters; 301-tariff exempt line produced on Shenzhen line #2.',
    detectedAt: minsAgo(199),
    matchedSku: 'PV-BOX-2026',
    decision: 'PENDING',
    decisionNote: null,
  },
  {
    id: 'imp_ALIBABA_ALB-WOOD-MONTESSORI-BULK',
    channel: 'ALIBABA',
    externalListingId: 'ALB-WOOD-MONTESSORI-BULK',
    externalListingUrl: 'https://www.alibaba.com/product-detail/wooden-montessori-toys-bulk_ALBWOOD.html',
    title: 'Wooden Educational Montessori Toys Bulk Set OEM Custom Logo Eco-Friendly FSC',
    priceUsd: 3.85,
    moq: 500,
    stockQty: 26000,
    imageUrls: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80'],
    category: 'Toys & Hobbies',
    description:
      'Bulk FSC-certified wooden Montessori educational toy sets with custom logo OEM. Popular in US/EU kindergartens.',
    detectedAt: minsAgo(199),
    matchedSku: null,
    decision: 'PENDING',
    decisionNote: null,
  },
  {
    id: 'imp_ALIBABA_ALB-CUSTOM-PCBA-7K',
    channel: 'ALIBABA',
    externalListingId: 'ALB-CUSTOM-PCBA-7K',
    externalListingUrl: 'https://www.alibaba.com/product-detail/custom-pcba-turnkey_ALBPCBA.html',
    title: 'Custom PCB Assembly Turnkey Service (SMT/DIP/Box Build) ROHS Certified',
    priceUsd: 0.42,
    moq: 1000,
    stockQty: null,
    imageUrls: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'],
    category: 'Electronics Manufacturing Services',
    description: 'Turnkey PCB assembly including SMT, DIP, testing and box build for IoT/sensor OEM clients.',
    detectedAt: minsAgo(199),
    matchedSku: null,
    decision: 'PENDING',
    decisionNote: null,
  },
];

// ------------------------------------------------------------------------------------
// Orchestrator
// ------------------------------------------------------------------------------------
function adapterFor(channel: MarketplaceChannelType): MarketplaceChannelAdapter {
  return channel === 'ALIBABA'
    ? new AlibabaMarketplaceAdapter()
    : new MadeInChinaMarketplaceAdapter();
}

export class MarketplaceSyncService {
  // --------------------------- read state --------------------------
  public static getConnections(): ChannelConnection[] {
    return connections;
  }

  public static getCatalog(): XisyncProduct[] {
    return CatalogRepository.list();
  }

  public static getMappings(): ProductListingMapping[] {
    return mappings;
  }

  public static getSyncRuns(): MarketplaceSyncRun[] {
    return [...syncRuns].sort(
      (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
    );
  }

  public static getImportQueue(): ChannelImportCandidate[] {
    return importQueue;
  }

  public static getSummary(): MarketplaceSyncSummary {
    const catalog = CatalogRepository.list();
    const activeCatalogSkus = catalog.filter((p) => p.status === 'ACTIVE');
    const rows: ChannelSummaryRow[] = connections.map((conn) => {
      const channelMappings = mappings.filter((m) => m.channel === conn.channel);
      return {
        channel: conn.channel,
        connectionStatus: conn.status,
        membershipLabel: conn.membershipLabel,
        integrationMode: conn.integrationMode,
        apiCallsToday: conn.apiCallsToday,
        apiQuotaPerDay: conn.apiQuotaPerDay,
        lastSyncAt: conn.lastSyncAt,
        liveListings: channelMappings.filter((m) => m.syncState === 'LIVE').length,
        pendingReview: channelMappings.filter((m) => m.syncState === 'PENDING_REVIEW').length,
        rejected: channelMappings.filter((m) => m.syncState === 'REJECTED').length,
        paused: channelMappings.filter((m) => m.syncState === 'PAUSED').length,
        errors: channelMappings.filter((m) => m.syncState === 'ERROR').length,
        syncedSkus: channelMappings.filter((m) =>
          ['LIVE', 'PENDING_REVIEW'].includes(m.syncState)
        ).length,
        totalCatalogSkus: activeCatalogSkus.length,
        notSyncedSkus: channelMappings.filter((m) => m.syncState === 'NOT_SYNCED').length,
      };
    });

    const countState = (state: ListingSyncState) =>
      mappings.filter((m) => m.syncState === state).length;

    return {
      rows,
      totals: {
        catalogSkus: catalog.length,
        activeCatalogSkus: activeCatalogSkus.length,
        liveListings: countState('LIVE'),
        syncedSkus: countState('LIVE') + countState('PENDING_REVIEW'),
        pendingReview: countState('PENDING_REVIEW'),
        syncIssues: countState('REJECTED') + countState('ERROR') + countState('PAUSED'),
        importQueuePending: importQueue.filter((c) => c.decision === 'PENDING').length,
      },
    };
  }

  // --------------------------- mutations ---------------------------

  /**
   * Runs a channel sync in the requested direction.
   * EXPORT: pushes XiSync inventory records to the channel storefront.
   * IMPORT: pulls the channel storefront's listings into the Import Queue.
   */
  public static async runSync(params: {
    channel: MarketplaceChannelType;
    direction: SyncDirection;
    mode: SyncMode;
    skus?: string[];
    triggeredBy?: 'MANUAL' | 'API' | 'SCHEDULED';
  }): Promise<MarketplaceSyncRun> {
    const runId = nextRunId();
    const startedAt = new Date().toISOString();
    const run: MarketplaceSyncRun = {
      id: runId,
      channel: params.channel,
      direction: params.direction,
      mode: params.mode,
      status: 'RUNNING',
      startedAt,
      finishedAt: null,
      itemsProcessed: 0,
      itemsCreated: 0,
      itemsUpdated: 0,
      itemsFailed: 0,
      message: 'Running…',
      perSkuResults: [],
      triggeredBy: params.triggeredBy ?? 'MANUAL',
    };
    syncRuns.unshift(run);

    const conn = connections.find((c) => c.channel === params.channel);
    if (!conn || conn.status !== 'CONNECTED') {
      run.status = 'FAILED';
      run.finishedAt = new Date().toISOString();
      run.message = `Channel ${params.channel} is not connected. Connect the storefront before syncing.`;
      return run;
    }

    try {
      if (params.direction === 'EXPORT') {
        await this.runExport(run, params);
      } else {
        await this.runImport(run, params);
      }
      conn.lastSyncAt = new Date().toISOString();
    } catch (err) {
      run.status = 'FAILED';
      run.finishedAt = new Date().toISOString();
      run.message = `Sync aborted: ${err instanceof Error ? err.message : String(err)}`;
    }
    return run;
  }

  private static async runExport(
    run: MarketplaceSyncRun,
    params: { channel: MarketplaceChannelType; mode: SyncMode; skus?: string[] }
  ): Promise<void> {
    const adapter = adapterFor(params.channel);
    const catalog = CatalogRepository.list();

    // Decide which SKUs this run should touch.
    let targets: XisyncProduct[];
    if (params.mode === 'SINGLE_SKU' && params.skus && params.skus.length > 0) {
      targets = params.skus
        .map((sku) => catalog.find((p) => p.sku === sku))
        .filter((p): p is XisyncProduct => Boolean(p));
    } else {
      const allActive = catalog.filter((p) => p.status === 'ACTIVE');
      if (params.mode === 'FULL') {
        targets = allActive;
      } else {
        // INCREMENTAL: only SKUs that are missing, stale, or in a fixable error state.
        const staleCutoff = Date.now() - 45 * 60_000;
        targets = allActive.filter((p) => {
          const m = mappings.find((x) => x.sku === p.sku && x.channel === params.channel);
          if (!m) return true;
          if (['NOT_SYNCED', 'REJECTED', 'ERROR', 'PAUSED'].includes(m.syncState)) return true;
          if (!m.lastSyncAt) return true;
          return new Date(m.lastSyncAt).getTime() < staleCutoff;
        });
      }
    }

    run.itemsProcessed = targets.length;
    for (const product of targets) {
      const mapping =
        mappings.find((m) => m.sku === product.sku && m.channel === params.channel) ??
        mkMapping(product.sku, params.channel, { state: 'NOT_SYNCED' });
      if (!mappings.includes(mapping)) mappings.push(mapping);

      if (product.status !== 'ACTIVE') {
        mapping.lastSyncMessage = `Skipped: product ${product.sku} is ${product.status} in XiSync catalog.`;
        run.perSkuResults.push({
          sku: product.sku,
          action: 'SKIPPED',
          externalListingId: mapping.externalListingId,
          message: mapping.lastSyncMessage,
        });
        continue;
      }

      // Never re-submit something still under platform moderation.
      if (mapping.syncState === 'PENDING_REVIEW') {
        mapping.lastSyncMessage = 'Listing still under platform moderation - not re-submitted.';
        run.perSkuResults.push({
          sku: product.sku,
          action: 'NO_CHANGE',
          externalListingId: mapping.externalListingId,
          message: mapping.lastSyncMessage,
        });
        continue;
      }

      try {
        const payload = productToAdapterProduct(product);
        if (!mapping.externalListingId) {
          // Out of stock products cannot be freshly published.
          if (product.stockQty <= 0) {
            throw new Error('Cannot publish: XiSync stock is 0 (auto-pause rule).');
          }
          const result = await adapter.exportProduct(payload);
          mapping.externalListingId = result.externalListingId;
          mapping.externalListingUrl = result.externalListingUrl;
          mapping.channelTitle = product.nameEn;
          mapping.syncState = result.state;
          mapping.lastSyncMessage =
            result.state === 'PENDING_REVIEW'
              ? `Offer ${result.externalListingId} submitted - awaiting channel moderation.`
              : `Listing ${result.externalListingId} published live.`;
          run.perSkuResults.push({
            sku: product.sku,
            action: 'CREATED',
            externalListingId: result.externalListingId,
            message: mapping.lastSyncMessage,
          });
          run.itemsCreated += 1;
        } else {
          // Inventory at 0 on an existing listing -> pause on the channel.
          if (product.stockQty <= 0) {
            await adapter.setListingActive(mapping.externalListingId, false);
            mapping.syncState = 'PAUSED';
            mapping.lastSyncMessage =
              'Auto-paused on channel: XiSync inventory is 0. Resumes when stock is added.';
            run.perSkuResults.push({
              sku: product.sku,
              action: 'PAUSED',
              externalListingId: mapping.externalListingId,
              message: mapping.lastSyncMessage,
            });
            continue;
          }
          const result = await adapter.updateProduct(mapping.externalListingId, payload);
          mapping.syncState = result.state;
          mapping.listingPriceUsd = result.listingPriceUsd;
          mapping.listingStockQty = result.listingStockQty;
          mapping.lastSyncMessage = `Updated price $${result.listingPriceUsd.toFixed(2)} / stock ${result.listingStockQty} on channel.`;
          run.perSkuResults.push({
            sku: product.sku,
            action: 'UPDATED',
            externalListingId: result.externalListingId,
            message: mapping.lastSyncMessage,
          });
          run.itemsUpdated += 1;
        }
        mapping.listingPriceUsd = product.priceUsd;
        mapping.listingStockQty = product.stockQty;
        mapping.lastSyncAt = new Date().toISOString();
      } catch (err) {
        mapping.syncState = 'ERROR';
        mapping.lastSyncMessage = err instanceof Error ? err.message : String(err);
        run.perSkuResults.push({
          sku: product.sku,
          action: 'FAILED',
          externalListingId: mapping.externalListingId,
          message: mapping.lastSyncMessage,
        });
        run.itemsFailed += 1;
      }
    }

    run.finishedAt = new Date().toISOString();
    run.status = run.itemsFailed === 0 ? 'SUCCESS' : run.itemsCreated + run.itemsUpdated > 0 ? 'PARTIAL' : 'FAILED';
    run.message = `Export ${params.mode.toLowerCase()}: ${run.itemsUpdated} updated, ${run.itemsCreated} created, ${run.itemsFailed} failed across ${run.itemsProcessed} processed SKU(s).`;
  }

  private static async runImport(
    run: MarketplaceSyncRun,
    params: { channel: MarketplaceChannelType }
  ): Promise<void> {
    const adapter = adapterFor(params.channel);
    const candidates = await adapter.importRecentListings(20);

    let added = 0;
    let skippedDup = 0;
    const catalog = CatalogRepository.list();

    for (const cand of candidates) {
      const exists = importQueue.some(
        (q) => q.channel === params.channel && q.externalListingId === cand.externalListingId
      );
      if (exists) {
        skippedDup += 1;
        continue;
      }

      const matchedSku =
        catalog.find((p) => {
          const haystack = `${cand.title} ${cand.externalListingId}`.toUpperCase();
          return haystack.includes(p.sku.toUpperCase());
        })?.sku ?? null;

      const queueItem: ChannelImportCandidate = {
        id: `imp_${params.channel}_${cand.externalListingId}`,
        channel: params.channel,
        externalListingId: cand.externalListingId,
        externalListingUrl: cand.externalListingUrl,
        title: cand.title,
        priceUsd: cand.priceUsd,
        moq: cand.moq,
        stockQty: cand.stockQty,
        imageUrls: cand.imageUrls,
        category: cand.category,
        description: cand.description,
        detectedAt: new Date().toISOString(),
        matchedSku,
        decision: 'PENDING',
        decisionNote: null,
      };
      importQueue.unshift(queueItem);
      added += 1;
      run.perSkuResults.push({
        sku: matchedSku ?? cand.externalListingId,
        action: 'IMPORTED',
        externalListingId: cand.externalListingId,
        message: matchedSku
          ? `Matched XiSync SKU ${matchedSku} - queued for reconcile.`
          : 'No XiSync match - queued as new product candidate.',
      });
    }

    run.itemsProcessed = added;
    run.finishedAt = new Date().toISOString();
    run.status = 'SUCCESS';
    run.message = `Import pulled ${added} new listing(s) from ${params.channel} into the Import Queue${
      skippedDup > 0 ? ` (${skippedDup} duplicates skipped)` : ''
    }. Review and accept/reject below.`;
  }

  /** Manual pause/resume of a live mapping. */
  public static async setMappingPaused(mappingId: string, paused: boolean): Promise<ProductListingMapping> {
    const mapping = mappings.find((m) => m.id === mappingId);
    if (!mapping) throw new Error('Listing mapping not found.');
    if (!mapping.externalListingId) {
      throw new Error('Cannot pause/resume a listing that has not been published to the channel.');
    }
    const adapter = adapterFor(mapping.channel);
    if (paused) {
      await adapter.setListingActive(mapping.externalListingId, false);
      mapping.syncState = 'PAUSED';
      mapping.lastSyncMessage = 'Paused on channel (manual).';
    } else {
      const product = CatalogRepository.find(mapping.sku);
      if (!product || product.stockQty <= 0) {
        throw new Error('Cannot resume: XiSync stock is 0. Restock the SKU first.');
      }
      await adapter.setListingActive(mapping.externalListingId, true);
      mapping.syncState = 'LIVE';
      mapping.listingPriceUsd = product.priceUsd;
      mapping.listingStockQty = product.stockQty;
      mapping.lastSyncMessage = 'Resumed live on channel.';
    }
    mapping.lastSyncAt = new Date().toISOString();
    return mapping;
  }

  /** Re-verifies channel credentials/API health. */
  public static async healthCheckChannel(channel: MarketplaceChannelType): Promise<ChannelConnection> {
    const conn = connections.find((c) => c.channel === channel);
    if (!conn) throw new Error('Connection not found.');
    const adapter = adapterFor(channel);
    const health = await adapter.checkConnection();
    conn.apiHealth = health.ok ? 'HEALTHY_200_OK' : 'UNREACHABLE';
    conn.status = health.ok ? 'CONNECTED' : 'ERROR';
    conn.lastHealthCheckedAt = new Date().toISOString();
    return conn;
  }

  /** Accept an Import-Queue candidate. RECONCILE refreshes a matched SKU; NEW_PRODUCT adds it to the catalog as a draft. */
  public static acceptImportCandidate(
    id: string,
    mode: 'RECONCILE' | 'NEW_PRODUCT'
  ): ChannelImportCandidate {
    const item = importQueue.find((c) => c.id === id);
    if (!item) throw new Error('Import candidate not found.');
    if (item.decision !== 'PENDING') throw new Error('Candidate already decided.');

    if (mode === 'RECONCILE') {
      if (!item.matchedSku) throw new Error('Candidate has no matched SKU - use "Add as new product" instead.');
      const price = item.priceUsd ?? undefined;
      const stock = item.stockQty ?? undefined;
      CatalogRepository.reconcileFromChannel(item.matchedSku, { priceUsd: price, stockQty: stock });
      const mapping = mappings.find(
        (m) => m.sku === item.matchedSku && m.channel === item.channel
      );
      if (mapping) {
        mapping.listingPriceUsd = item.priceUsd;
        mapping.listingStockQty = item.stockQty;
        mapping.lastSyncAt = new Date().toISOString();
        mapping.lastSyncMessage = 'Reconciled from channel import (stock/price refreshed).';
      }
      item.decision = 'ACCEPTED';
      item.decisionNote = `Reconciled XiSync SKU ${item.matchedSku}: stock ${item.stockQty ?? '-'}, price $${item.priceUsd ?? '-'}.`;
    } else {
      const created = CatalogRepository.createFromImport({
        nameEn: item.title,
        category: item.category ?? 'Uncategorized (Channel Import)',
        priceUsd: item.priceUsd ?? 0,
        moq: item.moq ?? 1,
        stockQty: item.stockQty,
        imageUrls: item.imageUrls,
        description: item.description,
        sourceChannel: item.channel,
      });
      item.decision = 'ACCEPTED';
      item.decisionNote = `Added to XiSync catalog as DRAFT SKU ${created.sku}. Complete export details, HS code and pricing, then publish to channels.`;
    }
    return item;
  }

  public static rejectImportCandidate(id: string, note = 'Dismissed by user.'): ChannelImportCandidate {
    const item = importQueue.find((c) => c.id === id);
    if (!item) throw new Error('Import candidate not found.');
    item.decision = 'REJECTED';
    item.decisionNote = note;
    return item;
  }

  public static connectionFor(channel: MarketplaceChannelType): ChannelConnection | undefined {
    return connections.find((c) => c.channel === channel);
  }

  public static tierRank(tier: ChannelMembershipTier): number {
    return tier === 'FREE' ? 0 : tier === 'PAID_SUPPLIER' ? 1 : 2;
  }
}
