import { Campaign, AdAccountConnection } from '../../types/marketing';

export const googleAdsService = {
  async getConnectedAccount(): Promise<AdAccountConnection> {
    return {
      id: 'google-acc-1',
      channel: 'google',
      name: 'Google Ads & Business Profile Manager',
      accountId: '902-148-5921',
      status: 'connected',
      tokenExpiresAt: '2026-11-20T00:00:00Z',
      totalSpendMonth: 18900,
      currency: 'USD',
      activeCampaignsCount: 6,
      lastSyncedAt: new Date().toISOString(),
      webhookStatus: 'active',
    };
  },

  async publishCampaign(_campaignData: Partial<Campaign>): Promise<{ success: boolean; googleCampaignId: string }> {
    // Production mapping point for Google Ads API v16 /customers/<CUSTOMER_ID>/campaigns:mutate
    await new Promise((res) => setTimeout(res, 800));
    return {
      success: true,
      googleCampaignId: `g_cmp_${Math.random().toString(36).substring(2, 9)}`,
    };
  },

  async fetchSearchKeywords(productName: string): Promise<string[]> {
    return [
      `wholesale ${productName}`,
      `${productName} china manufacturer`,
      `bulk buy ${productName}`,
      `custom ${productName} supplier`,
      `factory price ${productName}`,
    ];
  },
};
