// ====================================================================================
// Made-in-China.com (中国制造网 / MIC International Station - Focus Technology) Adapter
// Simulates the MIC supplier product-publishing surface so the full XiSync
// marketplace workflow runs end-to-end without live seller credentials.
//
// Production target (VERIFIED current status - research briefing 2026):
//  - Made-in-China.com (Focus Technology) exposes NO official seller/supplier
//    product-catalog API today. All plausible open-platform hosts fail DNS and
//    official docs describe product ops as UI-only, with the sanctioned batch
//    tool being Excel-template bulk import in the seller console (外贸e家 /
//    Virtual Office, FAQ 606362054). Scraping is prohibited by the User Agreement.
//  - Therefore this class models a forward-compatible connector surface: the
//    exact flow XiSync would drive once Focus ships a sanctioned API, while the
//    current real export path is generating the official bulk-import template
//    (mapped columns) rather than live REST calls. Every method below simulates
//    that flow so the module runs end-to-end without live credentials.
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

interface MicStoredListing {
  externalListingId: string;
  externalListingUrl: string;
  title: string;
  priceUsd: number | null;
  stockQty: number | null;
  state: 'LIVE' | 'PAUSED' | 'PENDING_REVIEW';
}

/** Module-level "storefront" so state survives across orchestrator runs. */
const micLiveStore = new Map<string, MicStoredListing>();

function micTitle(product: AdapterMarketplaceProduct): string {
  return `${product.titleEn} - China Manufacturer ${product.category} (FOB/CIF)`;
}

export class MadeInChinaMarketplaceAdapter implements MarketplaceChannelAdapter {
  public readonly channel = 'MADE_IN_CHINA' as const;
  public readonly label = 'Made-in-China.com (Focus Technology)';

  public async checkConnection(): Promise<ChannelConnectionHealth> {
    await delay(160);
    return {
      channel: this.channel,
      ok: true,
      latencyMs: 160,
      message:
        'MIC supplier member center reachable. 认证供应商 (Audited Supplier) credentials valid - catalog sync permitted.',
    };
  }

  public async exportProduct(
    product: AdapterMarketplaceProduct
  ): Promise<ChannelListingResult> {
    await delay(260);
    const err = validateProductForChannel(product, {
      minImages: 3,
      minPriceUsd: 0.5,
    });
    if (err) throw new Error(`[Made-in-China.com] Listing rejected: ${err}`);

    const externalListingId = channelListingId(this.channel, product.sku);
    const existing = micLiveStore.get(product.sku);
    const isNew = !existing;

    const stored: MicStoredListing = {
      externalListingId,
      externalListingUrl: listingUrlFor(this.channel, externalListingId, product.titleEn),
      title: micTitle(product),
      priceUsd: product.priceUsd,
      stockQty: Math.max(product.stockQty, 0),
      state: isNew ? 'PENDING_REVIEW' : 'LIVE',
    };
    micLiveStore.set(product.sku, stored);

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
    await delay(220);
    const err = validateProductForChannel(product, { minImages: 3, minPriceUsd: 0.5 });
    if (err) throw new Error(`[Made-in-China.com] Update rejected: ${err}`);

    const stored: MicStoredListing = {
      externalListingId,
      externalListingUrl: listingUrlFor(this.channel, externalListingId, product.titleEn),
      title: micTitle(product),
      priceUsd: product.priceUsd,
      stockQty: Math.max(product.stockQty, 0),
      state: 'LIVE',
    };
    micLiveStore.set(product.sku, stored);

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
    await delay(150);
    const entry = [...micLiveStore.entries()].find(
      ([, v]) => v.externalListingId === externalListingId
    );
    if (!entry) {
      throw new Error(
        `[Made-in-China.com] Listing ${externalListingId} not found on this storefront.`
      );
    }
    const [sku, stored] = entry;
    if (active && stored.stockQty !== null && stored.stockQty <= 0) {
      throw new Error('[Made-in-China.com] Cannot activate: listing stock is 0.');
    }
    stored.state = active ? 'LIVE' : 'PAUSED';
    micLiveStore.set(sku, stored);
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
    const entry = [...micLiveStore.entries()].find(
      ([, v]) => v.externalListingId === externalListingId
    );
    if (!entry) throw new Error(`[Made-in-China.com] Listing ${externalListingId} not found.`);
    micLiveStore.delete(entry[0]);
  }

  public async fetchListing(externalListingId: string): Promise<ListingLookup> {
    await delay(150);
    const found = [...micLiveStore.values()].find(
      (v) => v.externalListingId === externalListingId
    );
    if (!found) throw new Error(`[Made-in-China.com] Listing ${externalListingId} not found.`);
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
    await delay(190);
    return [...micLiveStore.values()]
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
   * Pulls the connected MIC storefront's recent listings back (import side).
   * Demo pool mixes listings that match XiSync SKUs with ones published on MIC
   * directly that have no XiSync catalog record yet.
   */
  public async importRecentListings(maxItems = 10): Promise<AdapterImportCandidate[]> {
    await delay(300);
    const pool: AdapterImportCandidate[] = [
      {
        channel: this.channel,
        externalListingId: 'MIC-TR-9900-MX-REV3',
        externalListingUrl:
          'https://www.made-in-china.com/product/MIC-TR-9900-MX-REV3.html',
        title: 'TR-9900-MX Precision Micro-Transformer SMT Toroidal 0.5-3W (Rev.3) OEM',
        priceUsd: 18.2,
        moq: 1000,
        stockQty: 4800,
        imageUrls: ['https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80'],
        category: 'Precision Hardware',
        description:
          'Rev.3 precision micro-transformer with SMT toroidal core, 0.5-3W rating, RoHS/REACH compliant, produced on line #3.',
      },
      {
        channel: this.channel,
        externalListingId: 'MIC-CNC-ALUM-OEM',
        externalListingUrl:
          'https://www.made-in-china.com/product/MIC-CNC-ALUM-OEM.html',
        title: 'CNC Machined Aluminum Parts Custom OEM (Auto/Aero/Medical) ISO9001',
        priceUsd: 1.25,
        moq: 100,
        stockQty: 80000,
        imageUrls: ['https://images.unsplash.com/photo-1537467191875-7e7c139f9b8f?auto=format&fit=crop&w=600&q=80'],
        category: 'Machining & Fabrication',
        description:
          '5-axis CNC aluminum precision parts with 0.005mm tolerance, ISO9001:2015 certified workshop, PPAP support.',
      },
      {
        channel: this.channel,
        externalListingId: 'MIC-SOLAR-CLEAN-KIT',
        externalListingUrl:
          'https://www.made-in-china.com/product/MIC-SOLAR-CLEAN-KIT.html',
        title: 'Solar Panel Cleaning Kit Water-fed Pole System (Commercial) OEM',
        priceUsd: 96.0,
        moq: 10,
        stockQty: 1200,
        imageUrls: ['https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80'],
        category: 'Solar PV & Energy',
        description:
          'Water-fed solar panel cleaning kit for commercial PV farms with TUV pole, RO brush and DI filtration.',
      },
    ];
    return pool.slice(0, maxItems);
  }
}
