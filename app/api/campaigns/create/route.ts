// Next.js Route Handler Simulation for: POST /api/campaigns/create
import { NextRequest, NextResponse } from 'next/server';
import { AdComplianceScreener } from '@/lib/services/mediaBuyer/complianceScreener';
import { WalletLedgerService } from '@/lib/services/mediaBuyer/walletLedger';
import { GoogleAdsAdapter } from '@/lib/adapters/googleAds';
import { MetaAdsAdapter } from '@/lib/adapters/metaAds';
import { TikTokAdsAdapter } from '@/lib/adapters/tiktokAds';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      tenantId,
      campaignName,
      objective,
      dailyBudgetUsd,
      totalBudgetUsd,
      targetMarkets,
      headline,
      description,
      landingPageUrl,
      callToAction,
      platformRatios,
    } = body;

    // 1. AI Compliance Pre-Flight Screening
    const compliance = AdComplianceScreener.evaluateAdCopy(headline, description, landingPageUrl);
    if (!compliance.isPassed) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI_COMPLIANCE_FAILED',
          message: 'Ad copy contains prohibited terms or trademark violations',
          violations: compliance.violations,
        },
        { status: 422 }
      );
    }

    // 2. Double-Entry Wallet Balance Check
    const wallet = WalletLedgerService.getWallet(tenantId);
    if (wallet.usdBalance < dailyBudgetUsd) {
      return NextResponse.json(
        {
          success: false,
          error: 'INSUFFICIENT_FUNDS',
          message: 'Wallet balance is insufficient to initialize campaign daily budget',
          currentBalanceUsd: wallet.usdBalance,
        },
        { status: 402 }
      );
    }

    // 3. Dispatch to External Ad Platform Adapters
    const results = [];
    if (platformRatios?.GOOGLE_ADS > 0) {
      const google = new GoogleAdsAdapter();
      results.push(await google.deployCampaign({
        tenantId,
        campaignName,
        objective,
        dailyBudgetUsd: dailyBudgetUsd * platformRatios.GOOGLE_ADS,
        targetMarkets,
        targetIndustries: ['General'],
        headline,
        description,
        landingPageUrl,
        callToAction,
      }));
    }

    if (platformRatios?.META_ADS > 0) {
      const meta = new MetaAdsAdapter();
      results.push(await meta.deployCampaign({
        tenantId,
        campaignName,
        objective,
        dailyBudgetUsd: dailyBudgetUsd * platformRatios.META_ADS,
        targetMarkets,
        targetIndustries: ['General'],
        headline,
        description,
        landingPageUrl,
        callToAction,
      }));
    }

    if (platformRatios?.TIKTOK_ADS > 0) {
      const tiktok = new TikTokAdsAdapter();
      results.push(await tiktok.deployCampaign({
        tenantId,
        campaignName,
        objective,
        dailyBudgetUsd: dailyBudgetUsd * platformRatios.TIKTOK_ADS,
        targetMarkets,
        targetIndustries: ['General'],
        headline,
        description,
        landingPageUrl,
        callToAction,
      }));
    }

    return NextResponse.json({
      success: true,
      campaignId: `camp_${Date.now()}`,
      status: 'ACTIVE',
      deployedPlatforms: results,
      complianceScore: compliance.score,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
