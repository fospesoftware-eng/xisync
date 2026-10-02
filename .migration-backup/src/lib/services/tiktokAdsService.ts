import { Campaign, AdAccountConnection } from '../../types/marketing';

export const tiktokAdsService = {
  async getConnectedAccount(): Promise<AdAccountConnection> {
    return {
      id: 'tiktok-acc-1',
      channel: 'tiktok',
      name: 'TikTok for Business Commercial Center',
      accountId: 'tt_729401928471',
      status: 'warning',
      tokenExpiresAt: '2026-08-20T00:00:00Z', // Expires soon alert
      totalSpendMonth: 6800,
      currency: 'USD',
      activeCampaignsCount: 2,
      lastSyncedAt: new Date().toISOString(),
      webhookStatus: 'active',
    };
  },

  async publishCampaign(_campaignData: Partial<Campaign>): Promise<{ success: boolean; tiktokCampaignId: string }> {
    // Production mapping point for TikTok Commercial API v1.3 /open_api/v1.3/campaign/create/
    await new Promise((res) => setTimeout(res, 800));
    return {
      success: true,
      tiktokCampaignId: `tt_cmp_${Math.random().toString(36).substring(2, 9)}`,
    };
  },
};
