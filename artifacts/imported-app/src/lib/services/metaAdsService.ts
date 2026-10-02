import { Campaign, AdAccountConnection } from '../../types/marketing';

export const metaAdsService = {
  async getConnectedAccount(): Promise<AdAccountConnection> {
    return {
      id: 'meta-acc-1',
      channel: 'meta',
      name: 'Shenzhen Tech Meta Business (FB/IG/WhatsApp)',
      accountId: 'act_9482019481',
      status: 'connected',
      tokenExpiresAt: '2026-10-15T00:00:00Z',
      totalSpendMonth: 12450,
      currency: 'USD',
      activeCampaignsCount: 4,
      lastSyncedAt: new Date().toISOString(),
      webhookStatus: 'active',
    };
  },

  async publishCampaign(_campaignData: Partial<Campaign>): Promise<{ success: boolean; metaCampaignId: string }> {
    // Production mapping point for Meta Marketing API Graph v19.0 /act_<AD_ACCOUNT_ID>/campaigns
    await new Promise((res) => setTimeout(res, 800));
    return {
      success: true,
      metaCampaignId: `fb_cmp_${Math.random().toString(36).substring(2, 9)}`,
    };
  },

  async toggleCampaignStatus(_campaignId: string, _status: 'active' | 'paused'): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 300));
    return true;
  },
};
