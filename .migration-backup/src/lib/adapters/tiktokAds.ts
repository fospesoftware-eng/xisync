import { AdPlatformAdapter, UnifiedCampaignPayload, ExternalCampaignResult, VideoMeta } from './types';
import { NormalizedMetrics } from '../../types/mediaBuyer';

export class TikTokAdsAdapter implements AdPlatformAdapter {
  public platform = 'TIKTOK_ADS' as const;

  public async createChildAccount(tenantName: string): Promise<string> {
    console.log(`[TikTokAdsAdapter] Creating advertiser under Business Center: "${tenantName}"`);
    return `tt_adv_${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`;
  }

  public async deployCampaign(payload: UnifiedCampaignPayload): Promise<ExternalCampaignResult> {
    console.log(`[TikTokAdsAdapter] Deploying Spark Ads & Instant Form Campaign: ${payload.campaignName}`);

    const externalCampaignId = `tt_camp_${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;
    const externalAdSetId = `tt_adgroup_${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;
    const externalAdId = `tt_ad_${Math.floor(10000000000000 + Math.random() * 90000000000000)}`;

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
    console.log(`[TikTokAdsAdapter] Uploading video to TikTok Creative Asset Library: ${fileUrl} (${metadata.aspectRatio})`);
    return `v_tt_${Date.now()}`;
  }

  public async updateCampaignStatus(externalId: string, status: 'ACTIVE' | 'PAUSED'): Promise<void> {
    console.log(`[TikTokAdsAdapter] Updating TikTok campaign status: ${externalId} -> ${status}`);
  }

  public async fetchHourlyMetrics(_externalId: string): Promise<NormalizedMetrics> {
    return {
      platform: this.platform,
      impressions: 89000,
      clicks: 3410,
      ctr: 3.83,
      videoViews: 54000,
      inquiriesGenerated: 112,
      whatsappClicks: 78,
      spendUsd: 580.0,
      cpaUsd: 5.18,
      attributedOrderValueUsd: 28900.0,
      trueTradeRoas: Number((28900 / (580.0 * 1.2)).toFixed(2)),
    };
  }
}
