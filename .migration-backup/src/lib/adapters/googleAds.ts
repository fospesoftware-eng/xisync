import { AdPlatformAdapter, UnifiedCampaignPayload, ExternalCampaignResult, VideoMeta } from './types';
import { NormalizedMetrics } from '../../types/mediaBuyer';

export class GoogleAdsAdapter implements AdPlatformAdapter {
  public platform = 'GOOGLE_ADS' as const;

  public async createChildAccount(tenantName: string): Promise<string> {
    console.log(`[GoogleAdsAdapter] Provisioning client account under MCC: "${tenantName}"`);
    return `goog-act-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
  }

  public async deployCampaign(payload: UnifiedCampaignPayload): Promise<ExternalCampaignResult> {
    console.log(`[GoogleAdsAdapter] Deploying Performance Max & Search Campaign for: ${payload.campaignName}`);
    
    const externalCampaignId = `gc_${Math.floor(10000000 + Math.random() * 90000000)}`;
    const externalAdSetId = `gag_${Math.floor(1000000 + Math.random() * 9000000)}`;
    const externalAdId = `gad_${Math.floor(100000 + Math.random() * 900000)}`;

    return {
      platform: this.platform,
      externalCampaignId,
      externalAdSetId,
      externalAdId,
      status: 'ACTIVE',
      allocatedDailyBudgetUsd: payload.dailyBudgetUsd,
      deployedAt: new Date().toISOString(),
    };
  }

  public async uploadVideoAsset(fileUrl: string, metadata: VideoMeta): Promise<string> {
    console.log(`[GoogleAdsAdapter] Uploading YouTube asset: ${fileUrl} (${metadata.aspectRatio})`);
    return `yt-asset-${Date.now()}`;
  }

  public async updateCampaignStatus(externalId: string, status: 'ACTIVE' | 'PAUSED'): Promise<void> {
    console.log(`[GoogleAdsAdapter] Updating status of campaign ${externalId} to: ${status}`);
  }

  public async fetchHourlyMetrics(_externalId: string): Promise<NormalizedMetrics> {
    return {
      platform: this.platform,
      impressions: 48200,
      clicks: 1420,
      ctr: 2.95,
      videoViews: 12500,
      inquiriesGenerated: 68,
      whatsappClicks: 34,
      spendUsd: 840.5,
      cpaUsd: 12.36,
      attributedOrderValueUsd: 38400.0,
      trueTradeRoas: Number((38400 / (840.5 * 1.2)).toFixed(2)),
    };
  }
}
