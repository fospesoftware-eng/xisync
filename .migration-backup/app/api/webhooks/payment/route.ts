// Next.js Route Handler Simulation for: POST /api/webhooks/payment
import { NextRequest, NextResponse } from 'next/server';
import { WalletLedgerService } from '@/lib/services/mediaBuyer/walletLedger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, transactionId, paymentReference, status } = body;

    if (status === 'SUCCESS' || status === 'COMPLETED' || event === 'charge.succeeded') {
      const updatedTx = WalletLedgerService.completeTopUpWebhook(transactionId);
      return NextResponse.json({
        success: true,
        transactionId: updatedTx.id,
        status: updatedTx.status,
        creditedUsd: updatedTx.netAdBudgetUsd,
        newBalanceUsd: updatedTx.balanceAfterUsd,
      });
    }

    return NextResponse.json({ success: true, message: 'Event acknowledged' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failed' },
      { status: 400 }
    );
  }
}
