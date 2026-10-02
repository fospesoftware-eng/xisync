// Next.js Route Handler for: POST /api/wallet/topup/initiate
import { NextRequest, NextResponse } from 'next/server';
import { TreasuryFxEngine } from '@/lib/treasury/treasuryFxEngine';
import { PaymentGatewayManager } from '@/lib/gateways/paymentGatewayManager';
import { WalletLedgerService } from '@/src/lib/services/mediaBuyer/walletLedger';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantId, depositAmountCny, paymentMethod, idempotencyKey, customMarginOverridePct } = body;

    if (!tenantId || !depositAmountCny || depositAmountCny <= 0 || !paymentMethod) {
      return NextResponse.json(
        { success: false, error: 'INVALID_PARAMETERS', message: 'Missing required deposit parameters' },
        { status: 400 }
      );
    }

    // 1. Fetch Real-Time Institutional FX Quote
    const fxQuote = await TreasuryFxEngine.getInstitutionalQuote();

    // 2. Fetch Tenant Wallet details for margin determination
    const wallet = WalletLedgerService.getWallet(tenantId);
    const marginPct = customMarginOverridePct ?? wallet.customMarginOverridePct ?? 0.20;

    // 3. Provision Multi-Gateway Checkout Session & Dynamic QR
    const paymentIntent = await PaymentGatewayManager.createPaymentIntent(
      {
        tenantId,
        depositAmountCny,
        paymentMethod,
        idempotencyKey: idempotencyKey || `idem_${tenantId}_${Date.now()}`,
      },
      fxQuote.effectiveConversionRate,
      marginPct
    );

    return NextResponse.json({
      success: true,
      paymentIntentId: paymentIntent.paymentIntentId,
      gatewayTradeNo: paymentIntent.gatewayTradeNo,
      checkoutQrCodeUrl: paymentIntent.qrCodeUrl,
      universalDeepLink: paymentIntent.universalDeepLink,
      fxQuote: {
        quoteId: fxQuote.quoteId,
        effectiveRate: fxQuote.effectiveConversionRate,
        validForSeconds: fxQuote.quoteValidForSeconds,
        expiresAt: fxQuote.expiresAt,
      },
      financialBreakdown: {
        depositAmountCny: paymentIntent.grossAmountCny,
        grossAmountUsd: paymentIntent.grossAmountUsd,
        platformMarginPct: marginPct,
        platformMarginUsd: paymentIntent.platformMarginUsd,
        netAdBudgetUsd: paymentIntent.netAdBudgetUsd,
      },
      status: paymentIntent.status,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'INITIATION_FAILED', message: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
