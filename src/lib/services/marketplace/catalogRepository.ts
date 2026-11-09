// ====================================================================================
// XiSync Master Catalog Repository (source of truth for marketplace export)
// In a production build these records live in the tenant product catalog
// (src/pages/dashboard/ProductsPage.tsx). For the marketplace module we keep a
// shared, seeded catalog so the Export workflow has real SKUs to operate on.
// ====================================================================================

import type { XisyncProduct } from '../../../types/marketplace';
import { getProductImages } from './productImages';

let catalog: XisyncProduct[] = [
  {
    sku: 'INV-4000-HE',
    nameEn: '5,000W Commercial Hybrid Solar Inverter',
    nameZh: '5,000W 工商业工频光伏混合逆变器',
    category: 'Solar PV & Energy',
    descriptionEn:
      'Factory-direct 5kW hybrid solar inverter with MPPT, grid-tie + off-grid modes and Wi-Fi monitoring. FOB Shenzhen, CE/TUV certified.',
    descriptionZh: '工厂直供 5kW 混合光伏逆变器，支持并离网双模式与 WiFi 监控，CE/TUV 认证，深圳 FOB。',
    hsCode: '8504.40.95',
    priceUsd: 1250.0,
    moq: 1,
    stockQty: 340,
    unit: 'Unit',
    imageUrls: getProductImages('INV-4000-HE'),
    certifications: ['CE', 'TUV', 'ISO9001'],
    tradeTerms: ['FOB', 'EXW', 'CIF', 'DDP'],
    targetMarkets: ['US', 'EU', 'AE', 'SA', 'BR'],
    weightKg: 22.5,
    status: 'ACTIVE',
    sourceChannel: 'XISYNC',
    createdAt: '2026-07-02T09:00:00Z',
    updatedAt: '2026-08-26T10:12:00Z',
  },
  {
    sku: 'PV-BOX-2026',
    nameEn: 'IP68 Waterproof PV Junction Box (Section 301 Exempt)',
    nameZh: 'IP68 防水光伏接线盒 (美关税 301 豁免)',
    category: 'Solar PV & Energy',
    descriptionEn:
      'IP68 rated PV junction box, 30A / 1000V diode protected, 301-tariff exempt export line. Bulk container loading available.',
    descriptionZh: 'IP68 光伏接线盒，30A/1000V 防反二极管保护，301 关税豁免产线，支持整柜出货。',
    hsCode: '8544.42.90',
    priceUsd: 6.8,
    moq: 1000,
    stockQty: 8900,
    unit: 'Unit',
    imageUrls: getProductImages('PV-BOX-2026'),
    certifications: ['TUV', 'UL', 'RoHS'],
    tradeTerms: ['FOB', 'CIF', 'DDP'],
    targetMarkets: ['US', 'EU', 'MX', 'AU'],
    weightKg: 0.12,
    status: 'ACTIVE',
    sourceChannel: 'XISYNC',
    createdAt: '2026-07-02T09:05:00Z',
    updatedAt: '2026-08-27T04:40:00Z',
  },
  {
    sku: 'LED-8800-HC',
    nameEn: 'Ultra-Thin Smart Industrial LED Panel - 40ft Container Pack',
    nameZh: '超薄智能工业级 LED 面板灯 (40尺高柜整柜装)',
    category: 'High-Tech Electronics',
    descriptionEn:
      'Ultra-thin 0.9m industrial smart LED panel with dimming + occupancy sensor, container-pack pricing with MOQ in pallets.',
    descriptionZh: '0.9m 超薄工业级智能 LED 面板灯，支持调光与人体感应，整柜装出货。',
    hsCode: '9405.42.90',
    priceUsd: 42.5,
    moq: 200,
    stockQty: 1200,
    unit: 'Unit',
    imageUrls: getProductImages('LED-8800-HC'),
    certifications: ['CE', 'RoHS', 'SAA'],
    tradeTerms: ['FOB', 'EXW', 'CIF'],
    targetMarkets: ['EU', 'AU', 'SG', 'JP'],
    weightKg: 1.8,
    status: 'ACTIVE',
    sourceChannel: 'XISYNC',
    createdAt: '2026-07-02T09:10:00Z',
    updatedAt: '2026-08-25T16:02:00Z',
  },
  {
    sku: 'TR-9900-MX',
    nameEn: 'Precision Micro-Transformer Assembly Line #3 (Rev.3)',
    nameZh: '高精微型变压器模组 (产线#3 保供 / Rev.3)',
    category: 'Precision Hardware',
    descriptionEn:
      'Rev.3 precision micro-transformer module with SMT toroidal core, 0.5-3W rating. RoHS/REACH compliant, dedicated line #3 capacity.',
    descriptionZh: 'Rev.3 高精微型变压器模组，SMT 环形磁芯 0.5-3W，RoHS/REACH 合规，产线 #3 专供。',
    hsCode: '8504.31.00',
    priceUsd: 18.2,
    moq: 1000,
    stockQty: 4500,
    unit: 'Unit',
    imageUrls: getProductImages('TR-9900-MX'),
    certifications: ['RoHS', 'REACH', 'ISO9001'],
    tradeTerms: ['FOB', 'EXW', 'CIF', 'DDP'],
    targetMarkets: ['US', 'EU', 'IN', 'VN'],
    weightKg: 0.05,
    status: 'ACTIVE',
    sourceChannel: 'XISYNC',
    createdAt: '2026-07-02T09:15:00Z',
    updatedAt: '2026-08-27T02:30:00Z',
  },
  {
    sku: 'VAL-X900-HYD',
    nameEn: 'Industrial Hydraulic Valve Assembly X-900',
    nameZh: '工业液压阀组总成 X-900',
    category: 'Machinery & Components',
    descriptionEn:
      'High-flow industrial hydraulic valve assembly X-900 for construction machinery, 350 bar rated, hardened spool, 12-month warranty.',
    descriptionZh: 'X-900 大流量工业液压阀组总成，350bar 额定，硬化阀芯，适用工程机械，质保 12 个月。',
    hsCode: '8481.20.00',
    priceUsd: 450.0,
    moq: 50,
    stockQty: 1240,
    unit: 'Unit',
    imageUrls: getProductImages('VAL-X900-HYD'),
    certifications: ['ISO9001', 'CE'],
    tradeTerms: ['FOB', 'CIF'],
    targetMarkets: ['US', 'BR', 'TR', 'EG'],
    weightKg: 4.6,
    status: 'ACTIVE',
    sourceChannel: 'XISYNC',
    createdAt: '2026-07-02T09:20:00Z',
    updatedAt: '2026-08-24T08:15:00Z',
  },
  {
    sku: 'CF-3K-CARBON',
    nameEn: 'High-Tensile Carbon Fiber Fabric 3K Roll',
    nameZh: '高抗拉碳纤维布 3K 卷材',
    category: 'Raw Materials & Composites',
    descriptionEn:
      '3K 200g/m² twill carbon fiber fabric roll for structural/composite parts, aerospace-grade tensile strength, consistent tow quality.',
    descriptionZh: '3K 200g/m² 斜纹碳纤维布卷材，航空级抗拉强度，纱束均匀，适用于结构件与复合材料。',
    hsCode: '6815.10.00',
    priceUsd: 120.0,
    moq: 20,
    stockQty: 650,
    unit: 'Roll',
    imageUrls: getProductImages('CF-3K-CARBON'),
    certifications: ['ISO9001', 'SGS'],
    tradeTerms: ['FOB', 'EXW', 'CIF'],
    targetMarkets: ['EU', 'US', 'TW', 'KR'],
    weightKg: 8.0,
    status: 'ACTIVE',
    sourceChannel: 'XISYNC',
    createdAt: '2026-07-02T09:25:00Z',
    updatedAt: '2026-08-23T11:00:00Z',
  },
  {
    sku: 'SNS-8800-IOT',
    nameEn: 'Smart IoT Precision Sensor Array v4',
    nameZh: '智能 IoT 精密传感器阵列 v4',
    category: 'Electronics & Sensors',
    descriptionEn:
      'v4 industrial IoT sensor array (temp/humidity/air quality/pressure) with LoRaWAN + 4G gateway options. Custom firmware supported.',
    descriptionZh: 'v4 工业级 IoT 传感器阵列（温湿度/空气/压力），支持 LoRaWAN + 4G 网关，可定制固件。',
    hsCode: '9031.80.80',
    priceUsd: 85.0,
    moq: 100,
    stockQty: 3800,
    unit: 'Unit',
    imageUrls: getProductImages('SNS-8800-IOT'),
    certifications: ['CE', 'FCC', 'RoHS'],
    tradeTerms: ['FOB', 'DDP'],
    targetMarkets: ['EU', 'US', 'SG', 'JP'],
    weightKg: 0.3,
    status: 'ACTIVE',
    sourceChannel: 'XISYNC',
    createdAt: '2026-07-02T09:30:00Z',
    updatedAt: '2026-08-26T14:20:00Z',
  },
];

let nextDraftNumber = 1;

export class CatalogRepository {
  public static list(): XisyncProduct[] {
    return catalog;
  }

  public static find(sku: string): XisyncProduct | undefined {
    return catalog.find((p) => p.sku === sku);
  }

  /** Called when an imported channel listing is accepted as a brand-new XiSync record. */
  public static createFromImport(input: {
    nameEn: string;
    category: string;
    priceUsd: number;
    moq: number;
    stockQty: number | null;
    imageUrls: string[];
    description?: string | null;
    sourceChannel: 'ALIBABA' | 'MADE_IN_CHINA';
  }): XisyncProduct {
    const now = new Date().toISOString();
    const channelTag = input.sourceChannel === 'ALIBABA' ? 'ALB' : 'MIC';
    const sku = `IMP-${channelTag}-${String(nextDraftNumber).padStart(3, '0')}`;
    nextDraftNumber += 1;
    const record: XisyncProduct = {
      sku,
      nameEn: input.nameEn,
      nameZh: `(平台回传) ${input.nameEn}`,
      category: input.category || 'Uncategorized (Channel Import)',
      descriptionEn: input.description || 'Imported from channel; fill export details before publishing.',
      descriptionZh: '平台回传产品，待完善资料后发布。',
      hsCode: 'PENDING',
      priceUsd: input.priceUsd,
      moq: input.moq > 0 ? input.moq : 1,
      stockQty: input.stockQty ?? 0,
      unit: 'Unit',
      imageUrls: input.imageUrls.length > 0 ? input.imageUrls : getProductImages(sku),
      certifications: [],
      tradeTerms: ['FOB'],
      targetMarkets: [],
      weightKg: 0,
      status: 'DRAFT',
      sourceChannel: input.sourceChannel,
      createdAt: now,
      updatedAt: now,
    };
    catalog = [record, ...catalog];
    return record;
  }

  /** Reconciling an existing SKU from a channel pull (stock/price refresh). */
  public static reconcileFromChannel(
    sku: string,
    patch: { priceUsd?: number; stockQty?: number }
  ): XisyncProduct | undefined {
    const record = catalog.find((p) => p.sku === sku);
    if (!record) return undefined;
    record.priceUsd = patch.priceUsd ?? record.priceUsd;
    if (patch.stockQty !== undefined && patch.stockQty !== null) {
      record.stockQty = patch.stockQty;
    }
    record.updatedAt = new Date().toISOString();
    return record;
  }

  public static activeProducts(): XisyncProduct[] {
    return catalog.filter((p) => p.status === 'ACTIVE');
  }
}
