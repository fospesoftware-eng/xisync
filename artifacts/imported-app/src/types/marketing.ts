export type MarketingChannel = 'meta' | 'google' | 'tiktok' | 'whatsapp';

export type CampaignStatus = 'active' | 'paused' | 'draft' | 'completed' | 'reviewing';

export type BuyerPersona = 'wholesalers' | 'distributors' | 'retailers' | 'oem_partners' | 'importers';

export type TargetRegion = 'north_america' | 'europe' | 'latam' | 'middle_east' | 'southeast_asia' | 'global';

export type Currency = 'USD' | 'EUR' | 'CNY';

export interface Campaign {
  id: string;
  name: string;
  channels: MarketingChannel[];
  productId?: string;
  productName?: string;
  productImage?: string;
  status: CampaignStatus;
  buyerPersona: BuyerPersona;
  targetRegion: TargetRegion;
  dailyBudget: number;
  totalBudget: number;
  currency: Currency;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number; // percentage
  cpl: number; // cost per lead
  leadsCount: number;
  inquiriesCount: number;
  pipelineValue: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
  copywriting?: {
    cn: string;
    en?: string;
    es?: string;
    ar?: string;
  };
}

export interface AdAccountConnection {
  id: string;
  channel: MarketingChannel;
  name: string;
  accountId: string;
  status: 'connected' | 'expired' | 'disconnected' | 'warning';
  tokenExpiresAt: string;
  totalSpendMonth: number;
  currency: Currency;
  activeCampaignsCount: number;
  lastSyncedAt: string;
  webhookStatus: 'active' | 'inactive';
}

export interface CreativeAsset {
  id: string;
  title: string;
  productId: string;
  productName: string;
  imageUrl: string;
  type: 'image' | 'video' | 'carousel';
  originalCopyCn: string;
  translatedCopies: {
    en: string;
    es: string;
    ar: string;
    de: string;
    fr: string;
  };
  compliancePassed: boolean;
  complianceNotes?: string;
  createdAt: string;
}

export interface LeadAttributionItem {
  id: string;
  leadName: string;
  companyName: string;
  email: string;
  phone: string;
  channel: MarketingChannel;
  campaignId: string;
  campaignName: string;
  adGroupName?: string;
  region: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  clickTimestamp: string;
  convertedAt: string;
  crmLeadId?: string;
  dealStatus: 'new_lead' | 'contacted' | 'negotiation' | 'closed_won';
  estimatedValueUSD: number;
}
