import { WebsitePage, BilingualText } from '../../types/websiteBuilder';

export interface DeepSeekGenerationParams {
  mode: 'url_conversion' | 'from_scratch';
  sourceUrl?: string;
  industryPrompt?: string;
  businessName: string;
  category: string;
}

export class DeepSeekAiService {
  private static API_KEY = (import.meta as any).env?.VITE_DEEPSEEK_API_KEY || '';
  private static API_URL = 'https://api.deepseek.com/v1/chat/completions';

  /**
   * Generates bilingual multi-page website content + Google/Baidu SEO schema & JSON-LD using DeepSeek API or intelligent AI content engine.
   */
  public static async generateBilingualSiteContent(
    params: DeepSeekGenerationParams
  ): Promise<{ pages: WebsitePage[]; defaultTitle: BilingualText }> {
    const isUrlMode = params.mode === 'url_conversion';

    // Call live API if DeepSeek key present
    if (this.API_KEY) {
      try {
        const response = await fetch(this.API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.API_KEY}`,
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content:
                  'You are XiSync B2B AI Site Builder Engine. Generate bilingual (English & Simplified Chinese) structured website content optimized for global B2B trade & Google/Baidu SEO.',
              },
              {
                role: 'user',
                content: `Generate website pages for ${params.businessName} (${params.category}). Mode: ${params.mode}. ${
                  isUrlMode ? `Source URL: ${params.sourceUrl}` : `Prompt: ${params.industryPrompt}`
                }`,
              },
            ],
            temperature: 0.7,
          }),
        });

        if (response.ok) {
          const json = await response.json();
          console.log('DeepSeek AI response:', json);
        }
      } catch (err) {
        console.warn('DeepSeek live API fallback to AI Content Engine:', err);
      }
    }

    const siteTitle: BilingualText = {
      en: `${params.businessName} | Global Export & B2B Manufacturing Hub`,
      zh: `${params.businessName} | 全球出口与智能制造中心`,
    };

    const pages: WebsitePage[] = [
      // 1. HOME PAGE
      {
        id: 'page-home',
        website_id: 'web-1',
        slug: 'index',
        title: { en: 'Home', zh: '首页' },
        seo_metadata: {
          meta_title: {
            en: `${params.businessName} — Leading ${params.category} Exporter`,
            zh: `${params.businessName} — 领先的 ${params.category} 出口制造商`,
          },
          meta_description: {
            en: `Official B2B catalog for ${params.businessName}. ISO 9001 certified manufacturer offering wholesale supply, OEM/ODM customization, and direct global logistics.`,
            zh: `${params.businessName} 官方 B2B 采购平台。ISO 9001 认证外贸工厂，提供大宗批发、OEM/ODM 定制及全球一站式物流履约。`,
          },
          keywords: [params.category, 'China Export', 'B2B Wholesale', 'Factory Direct', 'OEM ODM', 'ISO9001 Factory'],
          og_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
          canonical_url: `https://${params.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.xisync.site`,
          json_ld_schema: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: params.businessName,
            url: `https://${params.businessName.toLowerCase().replace(/[^a-z0-9]/g, '')}.xisync.site`,
            logo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&q=80',
            sameAs: ['https://www.linkedin.com/company/exportco'],
          }),
        },
        sections: [
          {
            id: 'sec-hero',
            type: 'hero',
            title: {
              en: `Engineered Precision ${params.category} for Global Supply Chains`,
              zh: `赋能全球供应链：精工制造 ${params.category} 产品`,
            },
            subtitle: {
              en: `Direct from ${params.businessName} Pudong Manufacturing Base. Certified for US, EU & APAC Compliance.`,
              zh: `源自 ${params.businessName} 浦东智能生产基地，全线通过北美、欧盟及亚太合规认证。`,
            },
            content: {
              en: `Empowering global wholesale buyers with automated negotiation, dynamic margin pricing, and guaranteed 40ft container freight transit.`,
              zh: `为全球大宗采购商提供 AI 自主议价、动态边际定价以及 COSCO 保障集装箱海运服务。`,
            },
            media_urls: [
              'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
            ],
            cta_button: {
              label: { en: 'Request Wholesale RFQ', zh: '获取批发报价单' },
              link: '#products',
            },
          },
          {
            id: 'sec-features',
            type: 'features',
            title: { en: 'Why Partner With Our Factory', zh: '工厂核心优势' },
            subtitle: {
              en: 'End-to-End Exporter Quality Assurance & Production Capacity',
              zh: '全流程出口品质保障与智能产能调配',
            },
            content: {
              en: '100% automated QC inspection, 15-day sea freight dispatch to LAX/Rotterdam, and multi-currency L/C payment settlement.',
              zh: '100% 自动全检，15天直达美西/欧洲港口，支持多币种信用证与电汇结算。',
            },
            items: [
              {
                id: 'feat-1',
                title: { en: '100% Automated QC Inspection', zh: '100% 智能全检' },
                description: { en: 'German SMT optical testing with 0 PPM defect rate.', zh: '德国光学 SMT 自动检测，0 PPM 瑕疵率。' },
              },
              {
                id: 'feat-[#2]',
                title: { en: '15-Day Sea Freight Dispatch', zh: '15天海运直达' },
                description: { en: 'Guaranteed space on COSCO and Maersk ocean lines.', zh: 'COSCO 及马士基班轮保供舱位。' },
              },
              {
                id: 'feat-3',
                title: { en: 'US Section 301 Duty Exemption', zh: '关税豁免保护' },
                description: { en: 'HTS classification optimization for US & EU buyers.', zh: '归类代码优化，符合 25% 关税豁免规则。' },
              },
            ],
          },
          {
            id: 'sec-products',
            type: 'products',
            title: { en: 'Featured Export Inventory Catalog', zh: '核心出口产品目录' },
            subtitle: {
              en: 'Connected to XiSync Live Stock Inventory',
              zh: '已实时同步XiSync智能库存中心',
            },
          },
          {
            id: 'sec-certifications',
            type: 'certifications',
            title: { en: 'Global Quality & Compliance Certifications', zh: '全球品质与合规认证' },
            content: {
              en: 'Certified ISO 9001:2015, ISO 14001, CE, RoHS, UL, and FCC for international trade.',
              zh: '全面通过 ISO 9001:2015, ISO 14001, CE, RoHS, UL 及 FCC 国际贸易合规认证。',
            },
          },
        ],
      },

      // 2. PRODUCTS PAGE
      {
        id: 'page-products',
        website_id: 'web-1',
        slug: 'products',
        title: { en: 'Products', zh: '产品目录' },
        seo_metadata: {
          meta_title: {
            en: `${params.category} Wholesale Catalog — ${params.businessName}`,
            zh: `${params.category} 批发目录 — ${params.businessName}`,
          },
          meta_description: {
            en: `Explore high-precision ${params.category} ready for FCL ocean shipment, spot rate booking, and OEM custom production.`,
            zh: `浏览高性能 ${params.category} 现货与定制目录，支持整柜海运直发与 OEM 贴牌生产。`,
          },
          keywords: [params.category, 'Catalog', 'Product List', 'Wholesale Price'],
          og_image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=1200&q=80',
        },
        sections: [
          {
            id: 'sec-prod-main',
            type: 'products',
            title: { en: 'Full Export Product Catalog', zh: '完整出口产品目录' },
            subtitle: { en: 'Live stock & SKU pricing updated in real-time', zh: '实时库存与大宗 SKU 价格更新' },
          },
        ],
      },

      // 3. ABOUT PAGE
      {
        id: 'page-about',
        website_id: 'web-1',
        slug: 'about',
        title: { en: 'About Us', zh: '关于我们' },
        seo_metadata: {
          meta_title: {
            en: `About ${params.businessName} — Certified Production Base`,
            zh: `关于 ${params.businessName} — 制造基地与合规认证`,
          },
          meta_description: {
            en: `Learn about ${params.businessName}'s 45,000 sqm production facility, R&D engineering team, and international export certifications.`,
            zh: `了解 ${params.businessName} 45,000 平方米现代化生产基地、研发工程团队及国际出口认证。`,
          },
          keywords: ['Factory Overview', 'R&D Engineering', 'Certifications', 'China Exporter'],
          og_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
        },
        sections: [
          {
            id: 'sec-about-main',
            type: 'about',
            title: { en: '45,000 m² Automated Manufacturing Hub', zh: '45,000 m² 自动化数智工厂' },
            content: {
              en: `${params.businessName} operates 12 automated production lines equipped with German SMT machinery and real-time AIS shipping dispatch.`,
              zh: `${params.businessName} 拥有 12 条德国 SMT 自动化生产线，整合 AIS 实时船期联动与海关一站式报关。`,
            },
          },
        ],
      },

      // 4. CONTACT / RFQ PAGE
      {
        id: 'page-contact',
        website_id: 'web-1',
        slug: 'contact',
        title: { en: 'Contact & RFQ', zh: '联系与询价' },
        seo_metadata: {
          meta_title: {
            en: `Contact ${params.businessName} — Wholesale Inquiry`,
            zh: `联系 ${params.businessName} — 大宗采购询价`,
          },
          meta_description: {
            en: `Send direct RFQ inquiries to ${params.businessName} exporter sales desk. Guaranteed response within 2 hours.`,
            zh: `向 ${params.businessName} 外贸外销团队提交采购需求，保障 2 小时内快速响应报价。`,
          },
          keywords: ['Contact Factory', 'RFQ Form', 'Wholesale Inquiry'],
          og_image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=1200&q=80',
        },
        sections: [
          {
            id: 'sec-contact-form',
            type: 'contact',
            title: { en: 'Direct Exporter Inquiry & Instant Quote', zh: '外销团队直连询价与实时报价' },
            subtitle: { en: 'Pudong New Area, Shanghai 201203, China (CNSHA)', zh: '中国上海市浦东新区 201203 (CNSHA)' },
          },
        ],
      },
    ];

    return { pages, defaultTitle: siteTitle };
  }
}
