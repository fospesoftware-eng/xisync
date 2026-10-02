// Next.js Route Handler for: POST /api/wallet/topup/webhook
import { NextRequest, NextResponse } from 'next/server';
import { PaymentGatewayManager } from '@/lib/gateways/paymentGatewayManager';
import { DoubleEntryLedgerCore } from '@/lib/treasury/doubleEntryLedgerCore';
import { TreasuryFxEngine } from '@/lib/treasury/treasuryFxEngine';
import { WalletLedgerService } from '@/src/lib/services/mediaBuyer/walletLedger';

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || req.headers.get('stripe-signature') || 'valid_sig';
    const webhookSecret = process.env.PAYMENT_WEBHOOK_SECRET || 'xisync_treasury_whsec_2026';

    // 1. Verify Cryptographic Signature
    const isValid = PaymentGatewayManager.verifyWebhookSignature(rawBody, signature, webhookSecret);
    if (!isValid) {
      return NextResponse.json({ error: 'INVALID_SIGNATURE' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const { event, paymentIntentId, status, tenantId, grossAmountCny, paymentMethod } = payload;

    if (status === 'SUCCEEDED' || event === 'payment_intent.succeeded' || status === 'COMPLETED') {
      const wallet = WalletLedgerService.getWallet(tenantId || 'tn_ecotoys_99182');
      const fxQuote = await TreasuryFxEngine.getInstitutionalQuote();

      // Formulate Payment Intent object
      const paymentIntent = await PaymentGatewayManager.createPaymentIntent(
        {
          tenantId: wallet.tenantId,
          depositAmountCny: grossAmountCny || 10000,
          paymentMethod: paymentMethod || 'ALIPAY',
          idempotencyKey: `idem_wh_${paymentIntentId}`,
        },
        fxQuote.effectiveConversionRate,
        wallet.customMarginOverridePct || 0.20
      );

      // Execute ACID Atomic Settlement
      const result = await DoubleEntryLedgerCore.executeAtomicTopUpSettlement(wallet, paymentIntent, fxQuote);

      return NextResponse.json({
        success: true,
        transactionId: result.completedTransaction.id,
        status: result.completedTransaction.status,
        creditedAdBudgetUsd: result.completedTransaction.netAdBudgetUsd,
        retainedPlatformMarginUsd: result.completedTransaction.marginAmountUsd,
        newUsdBalance: result.updatedWallet.usdBalance,
        auditCount: result.auditEntries.length,
      });
    }

    return NextResponse.json({ success: true, message: 'Event ignored or pending' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'WEBHOOK_PROCESSING_FAILED', message: error.message },
      { status: 400 }
    );
  }
}
