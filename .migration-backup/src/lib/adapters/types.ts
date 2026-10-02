import { PlatformType, NormalizedMetrics } from '../../types/mediaBuyer';

export interface UnifiedCampaignPayload {
  tenantId: string;
  campaignName: string;
  objective: 'B2B_LEAD_GEN' | 'INQUIRY_MAX' | 'CATALOG_SALES' | 'VIDEO_VIEWS';
  dailyBudgetUsd: number;
  targetMarkets: string[]; // ['US', 'DE', 'AE', 'SA']
  targetIndustries: string[];
  headline: string;
  description: string;
  landingPageUrl: string;
  callToAction: string;
  videoAssetUrl?: string;
  imageAssetUrl?: string;
}

export interface ExternalCampaignResult {
  platform: PlatformType;
  externalCampaignId: string;
  externalAdSetId?: string;
  externalAdId?: string;
  status: 'ACTIVE' | 'PENDING_REVIEW' | 'PAUSED';
  allocatedDailyBudgetUsd: number;
  deployedAt: string;
}

export interface VideoMeta {
  title: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  durationSeconds: number;
}

export interface AdPlatformAdapter {
  platform: PlatformType;
  createChildAccount(tenantName: string): Promise<string>;
  deployCampaign(payload: UnifiedCampaignPayload): Promise<ExternalCampaignResult>;
  uploadVideoAsset(fileUrl: string, metadata: VideoMeta): Promise<string>;
  updateCampaignStatus(externalId: string, status: 'ACTIVE' | 'PAUSED'): Promise<void>;
  fetchHourlyMetrics(externalId: string): Promise<NormalizedMetrics>;
}
