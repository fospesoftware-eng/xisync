import { LeadAttributionItem } from '../../types/marketing';

export const marketingLeadSync = {
  async triggerWebhookSimulation(): Promise<LeadAttributionItem> {
    const fakeNames = ['Carlos Rodriguez', 'Hans Müller', 'Fatima Al-Mansoor', 'Jean Dupont', 'Alex Rivera'];
    const fakeCompanies = ['Iberia Trade S.L.', 'Bavaria Wholesale GmbH', 'Gulf Distributors LLC', 'EuroImport Corp', 'LatAm Supply Co.'];
    const channels = ['meta', 'google', 'tiktok', 'whatsapp'] as const;
    const randomIdx = Math.floor(Math.random() * fakeNames.length);

    const newLead: LeadAttributionItem = {
      id: `lead_attr_${Date.now()}`,
      leadName: fakeNames[randomIdx],
      companyName: fakeCompanies[randomIdx],
      email: `${fakeNames[randomIdx].toLowerCase().replace(' ', '.')}@example.com`,
      phone: '+1 (555) ' + Math.floor(100000 + Math.random() * 900000),
      channel: channels[Math.floor(Math.random() * channels.length)],
      campaignId: 'cmp_1',
      campaignName: '2026 Q1 Global B2B Buyer Acquisition',
      region: 'North America',
      utmSource: 'meta_ads',
      utmMedium: 'cpc',
      utmCampaign: 'q1_b2b_wholesale',
      clickTimestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      convertedAt: new Date().toISOString(),
      dealStatus: 'new_lead',
      estimatedValueUSD: Math.floor(15000 + Math.random() * 85000),
    };

    return newLead;
  },
};
