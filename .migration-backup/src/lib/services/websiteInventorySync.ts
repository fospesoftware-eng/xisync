import { InventoryItemSync } from '../../types/websiteBuilder';

export class WebsiteInventorySyncService {
  /**
   * Fetches active stock inventory items from XiSync Client Desk stock inventory.
   */
  public static async fetchClientDeskInventory(): Promise<InventoryItemSync[]> {
    return [
      {
        id: 'prod-1',
        sku: 'INV-4000-HE',
        name: { en: '5,000W Commercial Hybrid Solar Inverter', zh: '5,000W 工商业工频光伏混合逆变器' },
        price_usd: 1250.0,
        stock_count: 340,
        in_stock: true,
        category: 'Solar PV & Energy',
        image_url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
        sync_enabled: true,
      },
      {
        id: 'prod-2',
        sku: 'LED-8800-HC',
        name: { en: 'Ultra-Thin Smart Industrial LED Panel 40ft Container Pack', zh: '超薄智能工业级 LED 面板灯 40尺高柜整柜装' },
        price_usd: 42.5,
        stock_count: 1200,
        in_stock: true,
        category: 'High-Tech Electronics',
        image_url: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
        sync_enabled: true,
      },
      {
        id: 'prod-3',
        sku: 'TR-9900-MX',
        name: { en: 'Precision Micro-Transformer Assembly Line #3', zh: '高精微型变压器模组 (产线#3保供)' },
        price_usd: 18.2,
        stock_count: 4500,
        in_stock: true,
        category: 'Precision Hardware',
        image_url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
        sync_enabled: true,
      },
      {
        id: 'prod-4',
        sku: 'PV-BOX-2026',
        name: { en: 'IP68 Waterproof PV Junction Box (Section 301 Exempt)', zh: 'IP68 防水光伏接线盒 (美关税 301 豁免)' },
        price_usd: 6.8,
        stock_count: 8900,
        in_stock: true,
        category: 'Solar PV & Energy',
        image_url: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80',
        sync_enabled: false,
      },
    ];
  }
}
