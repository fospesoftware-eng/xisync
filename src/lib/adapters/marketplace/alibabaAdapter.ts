// ====================================================================================
// Alibaba.com (International Station / 阿里国际站) Channel Adapter
// Simulates the ICBU Open Platform product-publishing surface so the full XiSync
// marketplace workflow runs end-to-end without live seller credentials.
//
// Production target (see alibaba-international-station-api-briefing.md):
//  - open.alibaba.com (ICBU Open Platform), access granted to ISV/ERP apps
//    (appkey/appsecret + OAuth2.0 seller consent, sp=icbu at oauth.alibaba.com).
//  - Product publishing: schema-based APIs alibaba.icbu.product.schema.get/add/
//    add.draft/update/render, category.get.new, photobank.upload, inventory
//    get/update, product.batch.update.display (on/off shelf). Sellers normally
//    reach these by subscribing to a certified partner app on fuwu.alibaba.com
//    (外贸服务市场) and authorizing with their alibaba.com store account.
// ====================================================================================

import type {
  AdapterImportCandidate,
  AdapterMarketplaceProduct,
  ChannelConnectionHealth,
  ChannelListingResult,
  ListingLookup,
  MarketplaceChannelAdapter,
} from './types';
import {
  channelListingId,
  delay,
  listingUrlFor,
  validateProductForChannel,
} from './types';

interface StoredListing {
  externalListingId: string;
  externalListingUrl: string;
  title: string;
  priceUsd: number | null;
  stockQty: number | null;
  state: 'LIVE' | 'PAUSED' | 'PENDING_REVIEW';
}

/** Module-level "storefront" so state survives across orchestrator runs. */
const liveStore = new Map<string, StoredListing>();

function demoTitle(product: AdapterMarketplaceProduct): string {
  return `${product.titleEn} Factory Direct ${product.category} MOQ ${product.moq}`;
}

export class AlibabaMarketplaceAdapter implements MarketplaceChannelAdapter {
  public readonly channel = 'ALIBABA' as const;
  public readonly label = 'Alibaba.com International Station';

  public async checkConnection(): Promise<ChannelConnectionHealth> {
    await delay(180);
    return {
      channel: this.channel,
      ok: true,
      latencyMs: 180,
      message:
        'ICBU Open Platform reachable. App subscription valid (fuwu.alibaba.com) - seller consent OK.',
    };
  }

  public async exportProduct(
    product: AdapterMarketplaceProduct
  ): Promise<ChannelListingResult> {
    await delay(240);
    const err = validateProductForChannel(product, {
      minImages: 3,
      minPriceUsd: 0.99,
    });
    if (err) throw new Error(`[Alibaba.com] Listing rejected: ${err}`);

    const externalListingId = channelListingId(this.channel, product.sku);
    const existing = liveStore.get(product.sku);
    const isNew = !existing;

    const stored: StoredListing = {
      externalListingId,
      externalListingUrl: listingUrlFor(this.channel, externalListingId, product.titleEn),
      title: demoTitle(product),
      priceUsd: product.priceUsd,
      stockQty: Math.max(product.stockQty, 0),
      state: isNew ? 'PENDING_REVIEW' : 'LIVE',
    };
    liveStore.set(product.sku, stored);

    return {
      channel: this.channel,
      externalListingId,
      externalListingUrl: stored.externalListingUrl,
      state: isNew ? 'PENDING_REVIEW' : 'LIVE',
      listingPriceUsd: stored.priceUsd ?? 0,
      listingStockQty: stored.stockQty ?? 0,
    };
  }

  public async updateProduct(
    externalListingId: string,
    product: AdapterMarketplaceProduct
  ): Promise<ChannelListingResult> {
    await delay(200);
    const err = validateProductForChannel(product, { minImages: 3, minPriceUsd: 0.99 });
    if (err) throw new Error(`[Alibaba.com] Update rejected: ${err}`);

    const stored: StoredListing = {
      externalListingId,
      externalListingUrl: listingUrlFor(this.channel, externalListingId, product.titleEn),
      title: demoTitle(product),
      priceUsd: product.priceUsd,
      stockQty: Math.max(product.stockQty, 0),
      state: 'LIVE',
    };
    liveStore.set(product.sku, stored);

    return {
      channel: this.channel,
      externalListingId,
      externalListingUrl: stored.externalListingUrl,
      state: 'LIVE',
      listingPriceUsd: stored.priceUsd ?? 0,
      listingStockQty: stored.stockQty ?? 0,
    };
  }

  public async setListingActive(
    externalListingId: string,
    active: boolean
  ): Promise<ListingLookup> {
    await delay(160);
    const entry = [...liveStore.entries()].find(([, v]) => v.externalListingId === externalListingId);
    if (!entry) {
      throw new Error(
        `[Alibaba.com] Listing ${externalListingId} not found on this storefront.`
      );
    }
    const [sku, stored] = entry;
    if (active && stored.stockQty !== null && stored.stockQty <= 0) {
      throw new Error('[Alibaba.com] Cannot activate: listing stock is 0.');
    }
    stored.state = active ? 'LIVE' : 'PAUSED';
    liveStore.set(sku, stored);
    return {
      externalListingId,
      externalListingUrl: stored.externalListingUrl,
      title: stored.title,
      state: stored.state,
      listingPriceUsd: stored.priceUsd,
      listingStockQty: stored.stockQty,
    };
  }

  public async deleteListing(externalListingId: string): Promise<void> {
    await delay(140);
    const entry = [...liveStore.entries()].find(([, v]) => v.externalListingId === externalListingId);
    if (!entry) throw new Error(`[Alibaba.com] Listing ${externalListingId} not found.`);
    liveStore.delete(entry[0]);
  }

  public async fetchListing(externalListingId: string): Promise<ListingLookup> {
    await delay(150);
    const found = [...liveStore.values()].find((v) => v.externalListingId === externalListingId);
    if (!found) throw new Error(`[Alibaba.com] Listing ${externalListingId} not found.`);
    return {
      externalListingId: found.externalListingId,
      externalListingUrl: found.externalListingUrl,
      title: found.title,
      state: found.state,
      listingPriceUsd: found.priceUsd,
      listingStockQty: found.stockQty,
    };
  }

  public async listActiveListings(): Promise<ListingLookup[]> {
    await delay(180);
    return [...liveStore.values()]
      .filter((v) => v.state === 'LIVE' || v.state === 'PENDING_REVIEW')
      .map((v) => ({
        externalListingId: v.externalListingId,
        externalListingUrl: v.externalListingUrl,
        title: v.title,
        state: v.state,
        listingPriceUsd: v.priceUsd,
        listingStockQty: v.stockQty,
      }));
  }

  /**
   * Pulls the connected storefront's recent listings back (reconciliation/import).
   * Demo pool mixes (a) listings that match XiSync SKUs by title token and
   * (b) listings published directly on Alibaba that do NOT exist in XiSync yet.
   */
  public async importRecentListings(maxItems = 10): Promise<AdapterImportCandidate[]> {
    await delay(320);
    const pool: AdapterImportCandidate[] = [
      {
        channel: this.channel,
        externalListingId: 'ALB-PVB-PV-BOX-2026',
        externalListingUrl:
          'https://www.alibaba.com/product-detail/ip68-pv-junction-box_ALBPVB.html',
        title: 'IP68 Waterproof PV Junction Box PV-BOX-2026 1000V 30A (Section 301 Exempt)',
        priceUsd: 6.8,
        moq: 1000,
        stockQty: 12500,
        imageUrls: ['https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80'],
        category: 'Solar PV & Energy',
        description:
          'IP68 rated PV junction box compatible with 30A string inverters; 301-tariff exempt line produced on Shenzhen line #2.',
      },
      {
        channel: this.channel,
        externalListingId: 'ALB-WOOD-MONTESSORI-BULK',
        externalListingUrl:
          'https://www.alibaba.com/product-detail/wooden-montessori-toys-bulk_ALBWOOD.html',
        title: 'Wooden Educational Montessori Toys Bulk Set OEM Custom Logo Eco-Friendly FSC',
        priceUsd: 3.85,
        moq: 500,
        stockQty: 26000,
        imageUrls: ['https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=600&q=80'],
        category: 'Toys & Hobbies',
        description:
          'Bulk FSC-certified wooden Montessori educational toy sets with custom logo OEM. Popular in US/EU kindergartens.',
      },
      {
        channel: this.channel,
        externalListingId: 'ALB-CUSTOM-PCBA-7K',
        externalListingUrl:
          'https://www.alibaba.com/product-detail/custom-pcba-turnkey_ALBPCBA.html',
        title: 'Custom PCB Assembly Turnkey Service (SMT/DIP/Box Build) ROHS Certified',
        priceUsd: 0.42,
        moq: 1000,
        stockQty: null,
        imageUrls: ['https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'],
        category: 'Electronics Manufacturing Services',
        description: 'Turnkey PCB assembly including SMT, DIP, testing and box build for IoT/sensor OEM clients.',
      },
    ];
    return pool.slice(0, maxItems);
  }
}
