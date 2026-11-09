// ====================================================================================
// Production Next.js API Route: /api/marketplace/sync
// Mirrors app/api/media-buyer/campaign/deploy/route.ts. Exposes the marketplace
// sync orchestrator (EXPORT/IMPORT) over HTTP so scheduled jobs / external ERPs
// can drive the same workflow as the UI.
//
//   POST /api/marketplace/sync
//     { channel: 'ALIBABA' | 'MADE_IN_CHINA',
//       direction: 'EXPORT' | 'IMPORT',
//       mode?: 'FULL' | 'INCREMENTAL' | 'SINGLE_SKU',
//       skus?: string[],
//       tenantId: string }
//   GET  /api/marketplace/sync  -> channel connections + summary snapshot
// ====================================================================================

import { NextRequest, NextResponse } from 'next/server';
import { MarketplaceSyncService } from '../../../src/lib/services/marketplace/marketplaceSyncService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId, channel, direction, mode, skus } = body ?? {};

    if (!tenantId || !channel || !direction) {
      return NextResponse.json(
        { error: 'Missing mandatory parameters: tenantId, channel (ALIBABA|MADE_IN_CHINA), direction (EXPORT|IMPORT).' },
        { status: 400 }
      );
    }

    const validChannels = ['ALIBABA', 'MADE_IN_CHINA'];
    if (!validChannels.includes(channel)) {
      return NextResponse.json({ error: `Invalid channel: ${channel}` }, { status: 400 });
    }
    if (direction !== 'EXPORT' && direction !== 'IMPORT') {
      return NextResponse.json({ error: `Invalid direction: ${direction}` }, { status: 400 });
    }

    const result = await MarketplaceSyncService.runSync({
      channel,
      direction,
      mode: mode ?? 'FULL',
      skus: Array.isArray(skus) ? skus : undefined,
      triggeredBy: 'API',
    });

    if (result.status === 'FAILED') {
      return NextResponse.json(
        { success: false, runId: result.id, message: result.message },
        { status: 422 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        runId: result.id,
        status: result.status,
        direction: result.direction,
        channel: result.channel,
        message: result.message,
        itemsProcessed: result.itemsProcessed,
        itemsCreated: result.itemsCreated,
        itemsUpdated: result.itemsUpdated,
        itemsFailed: result.itemsFailed,
        perSkuResults: result.perSkuResults,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('API /api/marketplace/sync internal error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error while running marketplace sync.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const summary = MarketplaceSyncService.getSummary();
    const connections = MarketplaceSyncService.getConnections();
    const mappings = MarketplaceSyncService.getMappings();
    const queuePending = MarketplaceSyncService.getImportQueue().filter(
      (c) => c.decision === 'PENDING'
    ).length;
    return NextResponse.json({ summary, connections, mappings, queuePending }, { status: 200 });
  } catch (error: any) {
    console.error('API /api/marketplace/sync internal error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error while reading marketplace state.' },
      { status: 500 }
    );
  }
}
