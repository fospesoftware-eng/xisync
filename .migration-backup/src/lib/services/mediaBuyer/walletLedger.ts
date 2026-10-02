// ====================================================================================
// Double-Entry Ledger, Wallet Accounting & Inbound Top-Up Ingestion Service
// ====================================================================================

import {
  TenantWallet,
  WalletTransaction,
  PaymentMethod,
} from '../../../types/mediaBuyer';
import { FxConversionService } from './fxService';

export interface InitiateTopUpParams {
  tenantId: string;
  depositAmountCny: number;
  paymentMethod: PaymentMethod;
  customMarginOverride?: number;
}

export interface InitiateTopUpResult {
  transactionId: string;
  qrCodeDataUrl: string;
  paymentReference: string;
  conversion: ReturnType<typeof FxConversionService.calculateTopUpConversion>;
  expiresInSeconds: number;
}

export class WalletLedgerService {
  // In-memory tenant wallet state (persisted across session & local store)
  private static WALLET_STORE: Record<string, TenantWallet> = {
    'tn_ecotoys_99182': {
      id: 'wlt-ecotoys-01',
      tenantId: 'tn_ecotoys_99182',
      cnyBalance: 24500.0,
      usdBalance: 2708.99,
      reservedAdSpendUsd: 1250.0,
      lifetimeDepositedCny: 150000.0,
      lifetimeGrossUsdConverted: 20732.5,
      lifetimeMarginRetainedUsd: 4146.5,
      lifetimeSpentUsd: 16800.0,
      customMarginOverridePct: 0.20,
      autoPauseOnLowBalance: true,
      lowBalanceThresholdUsd: 50.0,
      updatedAt: new Date().toISOString(),
    },
  };

  private static TRANSACTION_HISTORY: WalletTransaction[] = [
    {
      id: 'tx-topup-98124',
      walletId: 'wlt-ecotoys-01',
      tenantId: 'tn_ecotoys_99182',
      type: 'TOPUP_CNY',
      status: 'COMPLETED',
      paymentMethod: 'ALIPAY',
      paymentReference: 'ALI_20260826_99481920',
      idempotencyKey: 'idem_99182_topup_98124',
      grossAmountCny: 10000.0,
      fxRate: 7.235,
      grossAmountUsd: 1382.17,
      marginPercent: 0.20,
      marginAmountUsd: 276.43,
      netAdBudgetUsd: 1105.74,
      balanceBeforeUsd: 1603.25,
      balanceAfterUsd: 2708.99,
      createdAt: '2026-08-25T14:32:00Z',
    },
    {
      id: 'tx-topup-98123',
      walletId: 'wlt-ecotoys-01',
      tenantId: 'tn_ecotoys_99182',
      type: 'TOPUP_CNY',
      status: 'COMPLETED',
      paymentMethod: 'WECHAT_PAY',
      paymentReference: 'WX_20260820_88419201',
      idempotencyKey: 'idem_99182_topup_98123',
      grossAmountCny: 20000.0,
      fxRate: 7.228,
      grossAmountUsd: 2767.02,
      marginPercent: 0.20,
      marginAmountUsd: 553.4,
      netAdBudgetUsd: 2213.62,
      balanceBeforeUsd: 845.0,
      balanceAfterUsd: 3058.62,
      createdAt: '2026-08-20T09:15:00Z',
    },
    {
      id: 'tx-settle-98122',
      walletId: 'wlt-ecotoys-01',
      tenantId: 'tn_ecotoys_99182',
      type: 'AD_SETTLEMENT',
      status: 'COMPLETED',
      idempotencyKey: 'idem_99182_settle_98122',
      grossAmountCny: 0,
      fxRate: 7.228,
      grossAmountUsd: -450.0,
      marginPercent: 0,
      marginAmountUsd: 0,
      netAdBudgetUsd: -450.0,
      balanceBeforeUsd: 3508.62,
      balanceAfterUsd: 3058.62,
      metadata: { campaignName: 'US B2B Montessori Wooden Toys (Google Search + Meta PMax)' },
      createdAt: '2026-08-19T23:59:59Z',
    },
  ];

  /**
   * Retrieves or initializes tenant wallet.
   */
  public static getWallet(tenantId: string): TenantWallet {
    if (!this.WALLET_STORE[tenantId]) {
      this.WALLET_STORE[tenantId] = {
        id: `wlt-${tenantId}`,
        tenantId,
        cnyBalance: 0,
        usdBalance: 0,
        reservedAdSpendUsd: 0,
        lifetimeDepositedCny: 0,
        lifetimeGrossUsdConverted: 0,
        lifetimeMarginRetainedUsd: 0,
        lifetimeSpentUsd: 0,
        customMarginOverridePct: 0.20,
        autoPauseOnLowBalance: true,
        lowBalanceThresholdUsd: 50.0,
        updatedAt: new Date().toISOString(),
      };
    }
    return this.WALLET_STORE[tenantId];
  }

  /**
   * Returns complete transaction history.
   */
  public static getTransactions(tenantId: string): WalletTransaction[] {
    return this.TRANSACTION_HISTORY.filter((t) => t.tenantId === tenantId);
  }

  /**
   * Initiates CNY Top-Up with QR Code Generation & FX Preview.
   */
  public static async initiateTopUp(params: InitiateTopUpParams): Promise<InitiateTopUpResult> {
    const wallet = this.getWallet(params.tenantId);
    const fxRateResult = await FxConversionService.getLiveUsdCnyRate();
    const marginPct = params.customMarginOverride ?? wallet.customMarginOverridePct ?? 0.20;

    const conversion = FxConversionService.calculateTopUpConversion(
      params.depositAmountCny,
      marginPct,
      fxRateResult.midMarketRate
    );

    const transactionId = `tx-topup-${Date.now()}`;
    const paymentRef = `${params.paymentMethod.slice(0, 3)}_${new Date().toISOString().slice(0, 10).replace(/-/g, '')}_${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Mock Dynamic QR Code
    const qrCodeDataUrl = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=xisync_pay_${params.paymentMethod.toLowerCase()}_${params.depositAmountCny}_${transactionId}`;

    const newTx: WalletTransaction = {
      id: transactionId,
      walletId: wallet.id,
      tenantId: params.tenantId,
      type: 'TOPUP_CNY',
      status: 'PENDING',
      paymentMethod: params.paymentMethod,
      paymentReference: paymentRef,
      checkoutQrCodeUrl: qrCodeDataUrl,
      idempotencyKey: `idem_${params.tenantId}_${transactionId}`,
      grossAmountCny: params.depositAmountCny,
      fxRate: conversion.fxRate,
      grossAmountUsd: conversion.grossAmountUsd,
      marginPercent: conversion.marginPercent,
      marginAmountUsd: conversion.marginAmountUsd,
      netAdBudgetUsd: conversion.netAdBudgetUsd,
      balanceBeforeUsd: wallet.usdBalance,
      balanceAfterUsd: wallet.usdBalance + conversion.netAdBudgetUsd,
      createdAt: new Date().toISOString(),
    };

    this.TRANSACTION_HISTORY.unshift(newTx);

    return {
      transactionId,
      qrCodeDataUrl,
      paymentReference: paymentRef,
      conversion,
      expiresInSeconds: 900, // 15 Min QR expiry
    };
  }

  /**
   * Confirms payment via Webhook (ACID ledger update).
   */
  public static completeTopUpWebhook(transactionId: string): WalletTransaction {
    const tx = this.TRANSACTION_HISTORY.find((t) => t.id === transactionId);
    if (!tx) throw new Error('Transaction not found');
    if (tx.status === 'COMPLETED') return tx;

    const wallet = this.getWallet(tx.tenantId);

    // Double-entry state transition
    tx.status = 'COMPLETED';
    tx.balanceBeforeUsd = wallet.usdBalance;
    tx.balanceAfterUsd = wallet.usdBalance + tx.netAdBudgetUsd;

    wallet.cnyBalance += tx.grossAmountCny;
    wallet.usdBalance += tx.netAdBudgetUsd;
    wallet.lifetimeDepositedCny += tx.grossAmountCny;
    wallet.lifetimeGrossUsdConverted += tx.grossAmountUsd;
    wallet.lifetimeMarginRetainedUsd += tx.marginAmountUsd;
    wallet.updatedAt = new Date().toISOString();

    return tx;
  }

  /**
   * Reserves or spends ad budget for a campaign.
   */
  public static deductAdSpend(tenantId: string, amountUsd: number, campaignName: string): boolean {
    const wallet = this.getWallet(tenantId);
    if (wallet.usdBalance < amountUsd) {
      return false; // Insufficient funds
    }

    const tx: WalletTransaction = {
      id: `tx-spend-${Date.now()}`,
      walletId: wallet.id,
      tenantId,
      type: 'AD_SETTLEMENT',
      status: 'COMPLETED',
      idempotencyKey: `idem_${tenantId}_spend_${Date.now()}`,
      grossAmountCny: 0,
      fxRate: 7.235,
      grossAmountUsd: -amountUsd,
      marginPercent: 0,
      marginAmountUsd: 0,
      netAdBudgetUsd: -amountUsd,
      balanceBeforeUsd: wallet.usdBalance,
      balanceAfterUsd: wallet.usdBalance - amountUsd,
      metadata: { campaignName },
      createdAt: new Date().toISOString(),
    };

    wallet.usdBalance -= amountUsd;
    wallet.lifetimeSpentUsd += amountUsd;
    wallet.updatedAt = new Date().toISOString();

    this.TRANSACTION_HISTORY.unshift(tx);
    return true;
  }
}
