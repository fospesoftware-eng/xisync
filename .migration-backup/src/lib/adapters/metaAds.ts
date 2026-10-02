import { AdPlatformAdapter, UnifiedCampaignPayload, ExternalCampaignResult, VideoMeta } from './types';
import { NormalizedMetrics } from '../../types/mediaBuyer';

export class MetaAdsAdapter implements AdPlatformAdapter {
  public platform = 'META_ADS' as const;

  public async createChildAccount(tenantName: string): Promise<string> {
    console.log(`[MetaAdsAdapter] Creating ad account under Business Manager: "${tenantName}"`);
    return `act_${Math.floor(100000000000000 + Math.random() * 900000000000000)}`;
  }

  public async deployCampaign(payload: UnifiedCampaignPayload): Promise<ExternalCampaignResult> {
    console.log(`[MetaAdsAdapter] Creating Campaign + Reels/Feed AdSet + Dynamic Creative: ${payload.campaignName}`);

    const externalCampaignId = `fb_camp_${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const externalAdSetId = `fb_adset_${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const externalAdId = `fb_ad_${Math.floor(1000000000 + Math.random() * 9000000000)}`;

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
    console.log(`[MetaAdsAdapter] Ingesting vertical video to /advideos endpoint: ${fileUrl} (${metadata.aspectRatio})`);
    return `fb-video-id-${Date.now()}`;
  }

  public async updateCampaignStatus(externalId: string, status: 'ACTIVE' | 'PAUSED'): Promise<void> {
    console.log(`[MetaAdsAdapter] Graph API POST /v19.0/${externalId} status=${status}`);
  }

  public async fetchHourlyMetrics(_externalId: string): Promise<NormalizedMetrics> {
    return {
      platform: this.platform,
      impressions: 62400,
      clicks: 2180,
      ctr: 3.49,
      videoViews: 28900,
      inquiriesGenerated: 94,
      whatsappClicks: 62,
      spendUsd: 720.0,
      cpaUsd: 7.66,
      attributedOrderValueUsd: 49500.0,
      trueTradeRoas: Number((49500 / (720.0 * 1.2)).toFixed(2)),
    };
  }
}
