import { InventoryItemSync } from '../../types/websiteBuilder';
import { CatalogRepository } from './marketplace/catalogRepository';

export class WebsiteInventorySyncService {
  /**
   * Fetches inventory items from the XiSync master catalog.
   * This is the single source of truth — products imported from Alibaba /
   * Made-in-China via the marketplace sync flow automatically appear here,
   * so any website built in XiSync automatically lists the live inventory.
   *
   * @param includeDrafts If true, DRAFT products are included (for the website
   *                      builder so the exporter can review & publish them).
   *                      Defaults to false (published websites show only ACTIVE).
   */
  public static async fetchClientDeskInventory(includeDrafts = false): Promise<InventoryItemSync[]> {
    const all = CatalogRepository.list();
    const products = includeDrafts ? all : all.filter((p) => p.status === 'ACTIVE');
    return products.map((p, idx) => ({
      id: `prod-${idx + 1}`,
      sku: p.sku,
      name: { en: p.nameEn, zh: p.nameZh },
      price_usd: p.priceUsd,
      stock_count: p.stockQty,
      in_stock: p.stockQty > 0,
      category: p.category,
      image_url: p.imageUrls[0] || '',
      sync_enabled: p.status === 'ACTIVE',
      status: p.status,
    }));
  }
}
