// ====================================================================================
// Production Next.js API Route: /api/media-buyer/campaign/deploy
// ====================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { ProductionMediaOrchestrator, CampaignLaunchRequest } from '../../../../src/lib/services/mediaBuyer/orchestratorService';

export async function POST(req: NextRequest) {
  try {
    const body: CampaignLaunchRequest = await req.json();

    if (!body.tenantId || !body.name || !body.dailyBudgetUsd || !body.englishHeadline) {
      return NextResponse.json(
        { error: 'Missing mandatory campaign deployment parameters (tenantId, name, dailyBudgetUsd, englishHeadline).' },
        { status: 400 }
      );
    }

    const result = await ProductionMediaOrchestrator.orchestrateCampaignLaunch(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error, complianceScore: result.complianceScore },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        campaign: result.campaign,
        platformDeployments: result.platformDeployments,
        complianceScore: result.complianceScore,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API /api/media-buyer/campaign/deploy internal error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error while orchestrating media campaign.' },
      { status: 500 }
    );
  }
}
