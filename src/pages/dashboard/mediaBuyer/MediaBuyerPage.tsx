import { useState } from 'react';
import {
  Wallet,
  DollarSign,
  TrendingUp,
  Plus,
  ShieldCheck,
  Zap,
  CheckCircle2,
  X,
  Clock,
  Sparkles,
  BarChart3,
  Globe,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { useI18n } from '../../../lib/i18n';
import { CampaignBuilder } from '../../../components/mediaBuyer/CampaignBuilder';
import { EffectivenessTable } from '../../../components/mediaBuyer/EffectivenessTable';
import { TreasuryLiveFxCard } from '../../../components/mediaBuyer/treasury/TreasuryLiveFxCard';
import { WalletLedgerService } from '../../../lib/services/mediaBuyer/walletLedger';
import { FxConversionService } from '../../../lib/services/mediaBuyer/fxService';
import {
  TenantWallet,
  WalletTransaction,
  ManagedCampaign,
  NormalizedMetrics,
  PaymentMethod,
} from '../../../types/mediaBuyer';

export function MediaBuyerPage() {
  const { language } = useI18n();
  const tenantId = 'tn_ecotoys_99182';

  // Live Wallet & Transaction States
  const [wallet, setWallet] = useState<TenantWallet>(() => WalletLedgerService.getWallet(tenantId));
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() =>
    WalletLedgerService.getTransactions(tenantId)
  );

  // Top-Up Modal State
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [depositAmountCny, setDepositAmountCny] = useState(10000);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('ALIPAY');
  const [pendingQrData, setPendingQrData] = useState<{
    qrUrl: string;
    txId: string;
    conversion: ReturnType<typeof FxConversionService.calculateTopUpConversion>;
  } | null>(null);
  const [isSimulatingPayment, setIsSimulatingPayment] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Campaign Matrix State
  const [campaigns, setCampaigns] = useState<ManagedCampaign[]>([
    {
      id: 'camp-us-toys-01',
      tenantId,
      name: 'US B2B Montessori Wooden Toys (Search + Reels)',
      objective: 'B2B_LEAD_GEN',
      targetMarkets: ['US', 'CA'],
      targetIndustries: ['Eco Toys', 'Baby & Children'],
      dailyBudgetUsd: 150.0,
      totalBudgetUsd: 4500.0,
      spentAmountUsd: 2140.5,
      cpaTargetUsd: 12.0,
      status: 'ACTIVE',
      autoRebalanceEnabled: true,
      startDate: '2026-08-15T00:00:00Z',
      chineseHeadline: '源头实木玩具工厂直供：符合CE/ASTM认证 (起订量50件)',
      englishHeadline: 'Factory Direct FSC Montessori Wooden Toys & Organic Plush Dolls',
      landingPageUrl: 'https://ecotoys.xisync.site/site/ecotoys',
      callToAction: 'REQUEST_WHOLESALE_CATALOG',
      complianceScore: 100,
      complianceViolations: [],
      platformRatios: {
        GOOGLE_ADS: 0.4,
        META_ADS: 0.35,
        TIKTOK_ADS: 0.25,
        LINKEDIN_ADS: 0,
        MICROSOFT_ADS: 0,
      },
      createdAt: '2026-08-15T08:00:00Z',
      updatedAt: new Date().toISOString(),
    },
  ]);

  const [metrics, setMetrics] = useState<NormalizedMetrics[]>([
    {
      platform: 'GOOGLE_ADS',
      impressions: 48200,
      clicks: 1420,
      ctr: 2.95,
      videoViews: 12500,
      inquiriesGenerated: 68,
      whatsappClicks: 34,
      spendUsd: 840.5,
      cpaUsd: 12.36,
      attributedOrderValueUsd: 38400.0,
      trueTradeRoas: 38.07,
    },
    {
      platform: 'META_ADS',
      impressions: 62400,
      clicks: 2180,
      ctr: 3.49,
      videoViews: 28900,
      inquiriesGenerated: 94,
      whatsappClicks: 62,
      spendUsd: 720.0,
      cpaUsd: 7.66,
      attributedOrderValueUsd: 49500.0,
      trueTradeRoas: 57.29,
    },
    {
      platform: 'TIKTOK_ADS',
      impressions: 89000,
      clicks: 3410,
      ctr: 3.83,
      videoViews: 54000,
      inquiriesGenerated: 112,
      whatsappClicks: 78,
      spendUsd: 580.0,
      cpaUsd: 5.18,
      attributedOrderValueUsd: 28900.0,
      trueTradeRoas: 41.52,
    },
  ]);

  const [activeTab, setActiveTab] = useState<'matrix' | 'builder' | 'treasury' | 'transactions'>('matrix');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleInitiateQr = async () => {
    const res = await WalletLedgerService.initiateTopUp({
      tenantId,
      depositAmountCny,
      paymentMethod: selectedMethod,
      customMarginOverride: 0.20,
    });

    setPendingQrData({
      qrUrl: res.qrCodeDataUrl,
      txId: res.transactionId,
      conversion: res.conversion,
    });
  };

  const handleConfirmSimulation = () => {
    if (!pendingQrData) return;
    setIsSimulatingPayment(true);

    setTimeout(() => {
      WalletLedgerService.completeTopUpWebhook(pendingQrData.txId);
      const updatedWlt = WalletLedgerService.getWallet(tenantId);
      const updatedTxs = WalletLedgerService.getTransactions(tenantId);

      setWallet({ ...updatedWlt });
      setTransactions([...updatedTxs]);
      setIsSimulatingPayment(false);
      setPendingQrData(null);
      setShowTopUpModal(false);

      triggerToast(
        language === 'zh'
          ? `人民币充值成功！已完成汇率结算并入账 $${pendingQrData.conversion.netAdBudgetUsd} USD 可用广告金。`
          : `CNY deposit successful! Credited $${pendingQrData.conversion.netAdBudgetUsd} USD into active ad balance.`
      );
    }, 1500);
  };

  const handleCampaignCreated = (newCamp: ManagedCampaign) => {
    setCampaigns([newCamp, ...campaigns]);
    setActiveTab('matrix');
    triggerToast(
      language === 'zh'
        ? `广告系列「${newCamp.name}」已一键同步部署至 Google、Meta 和 TikTok 广告网络！`
        : `Campaign "${newCamp.name}" published to Google, Meta & TikTok ad networks!`
    );
  };

  return (
    <div className="space-y-6 text-slate-900 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 text-slate-950 shadow-md">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold font-mono text-cyan-300 uppercase tracking-wider">
                {language === 'zh' ? '跨国程序化投流中控' : 'Programmatic Media Buyer'}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {language === 'zh' ? '自动化投流中控台 (Media Buyer Console)' : 'Media Buyer Console'}
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {language === 'zh'
                ? '人民币微信/支付宝直接充值 · 智能汇率结算与 20% 平台服务费自动分账 · Google/Meta/TikTok 一键全网分发'
                : 'Direct CNY deposit via WeChat/Alipay · Real-time FX conversion with 20% margin split · 1-Click deployment to Google, Meta & TikTok'}
            </p>
          </div>
        </div>

        <Button
          onClick={() => setShowTopUpModal(true)}
          icon={<Plus className="w-4 h-4" />}
          className="bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black px-6 shadow-md"
        >
          {language === 'zh' ? '充值广告金 (Add Funds)' : 'Deposit Funds'}
        </Button>
      </div>

      {/* 4 Financial Wallet & Treasury Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{language === 'zh' ? '账户可用广告金 (USD)' : 'Available Ad Balance (USD)'}</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${wallet.usdBalance.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>{language === 'zh' ? '折合人民币 (CNY)' : 'CNY Equivalent'}</span>
            <span className="font-mono font-bold text-slate-800">
              ≈ ¥{(wallet.usdBalance * 7.235).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{language === 'zh' ? '累计人民币充值 (Lifetime CNY)' : 'Lifetime CNY Deposits'}</span>
            <Wallet className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-indigo-600 font-mono">
            ¥{wallet.lifetimeDepositedCny.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>{language === 'zh' ? '总折算毛美元' : 'Gross USD Converted'}</span>
            <span className="font-mono font-bold text-slate-800">
              ${wallet.lifetimeGrossUsdConverted.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{language === 'zh' ? '平台 20% 服务费 (Platform Margin)' : 'Platform 20% Retained Margin'}</span>
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-cyan-600 font-mono">
            ${wallet.lifetimeMarginRetainedUsd.toFixed(2)}
          </div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center justify-between pt-1 border-t border-slate-100">
            <span>{language === 'zh' ? '含代投与合规风控' : 'Ad Ops & Compliance Shield'}</span>
            <span>20%</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{language === 'zh' ? '累计已消耗投流金 (Spent USD)' : 'Lifetime Ad Spend (USD)'}</span>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ${wallet.lifetimeSpentUsd.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
            <span>{language === 'zh' ? '运行中广告组' : 'Active Campaigns'}</span>
            <span className="font-bold text-indigo-600">{campaigns.length} {language === 'zh' ? '个系列' : 'Active'}</span>
          </div>
        </div>
      </div>

      {/* Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-slate-200 text-xs font-bold shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'matrix'
              ? 'bg-slate-900 text-white shadow-xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>{language === 'zh' ? '全网投放成效矩阵 (ROAS Matrix)' : 'Multi-Channel ROAS Matrix'}</span>
        </button>

        <button
          onClick={() => setActiveTab('builder')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'builder'
              ? 'bg-slate-900 text-white shadow-xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{language === 'zh' ? '一键创建海外广告 (Campaign Builder)' : 'Campaign Builder'}</span>
        </button>

        <button
          onClick={() => setActiveTab('treasury')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'treasury'
              ? 'bg-slate-900 text-white shadow-xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-emerald-500" />
          <span>{language === 'zh' ? '离岸外汇与 20% 分账测算 (FX Treasury Engine)' : 'FX & 20% Margin Treasury'}</span>
        </button>

        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'transactions'
              ? 'bg-slate-900 text-white shadow-xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>{language === 'zh' ? '资金流水与双录账单 (Ledger History)' : 'Double-Entry Ledger'}</span>
        </button>
      </div>

      {/* TAB 1: EFFECTIVENESS MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-6">
          <EffectivenessTable
            metrics={metrics}
            onSmartRebalance={() => {
              // Shift 20% budget to TikTok
              setMetrics((prev) =>
                prev.map((m) =>
                  m.platform === 'TIKTOK_ADS'
                    ? { ...m, spendUsd: m.spendUsd + 150, inquiriesGenerated: m.inquiriesGenerated + 30 }
                    : m
                )
              );
            }}
          />
        </div>
      )}

      {/* TAB 2: CAMPAIGN BUILDER */}
      {activeTab === 'builder' && (
        <div className="space-y-6">
          <CampaignBuilder
            tenantId={tenantId}
            walletBalanceUsd={wallet.usdBalance}
            onCampaignCreated={handleCampaignCreated}
            onTopUpRequested={() => setShowTopUpModal(true)}
          />
        </div>
      )}

      {/* TAB 3: TREASURY LIVE FX & MARGIN ENGINE */}
      {activeTab === 'treasury' && (
        <div className="space-y-6">
          <TreasuryLiveFxCard />
        </div>
      )}

      {/* TAB 4: TRANSACTION LEDGER */}
      {activeTab === 'transactions' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-black text-base text-slate-900">
              {language === 'zh' ? '人民币充值与外汇结算流水明细 (Double-Entry Audit)' : 'CNY Deposits & FX Settlement Audit Ledger'}
            </h3>
            <span className="text-xs text-slate-500 font-mono">Real-time ACID Ledger</span>
          </div>

          <div className="divide-y divide-slate-100 text-xs overflow-x-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4 font-mono">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-700 font-sans">
                      {tx.type}
                    </span>
                    <span>{tx.paymentReference || tx.id}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-sans">
                    {new Date(tx.createdAt).toLocaleString()} • {tx.paymentMethod || 'SYSTEM'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-slate-900 text-sm">
                    {tx.grossAmountCny > 0 ? `+¥${tx.grossAmountCny.toLocaleString()}` : ''}
                    {tx.netAdBudgetUsd > 0 ? (
                      <span className="text-emerald-600 ml-2">
                        (${tx.netAdBudgetUsd.toFixed(2)} USD {language === 'zh' ? '入账' : 'Credited'})
                      </span>
                    ) : (
                      <span className="text-rose-600">${tx.netAdBudgetUsd.toFixed(2)} USD</span>
                    )}
                  </div>
                  <div className="text-[10px] text-slate-400 font-sans">
                    {language === 'zh'
                      ? `汇率: ${tx.fxRate} • 扣除20%服务费: $${tx.marginAmountUsd.toFixed(2)}`
                      : `FX Rate: ${tx.fxRate} • 20% Margin Fee: $${tx.marginAmountUsd.toFixed(2)}`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOP-UP MODAL */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 relative border border-slate-100 text-left">
            <button
              onClick={() => {
                setShowTopUpModal(false);
                setPendingQrData(null);
              }}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <Wallet className="w-4 h-4" />
                <span>{language === 'zh' ? '人民币跨境入金网关' : 'CNY Inbound Payment Gateway'}</span>
              </div>
              <h3 className="text-xl font-black text-slate-900">
                {language === 'zh' ? '人民币广告金充值与美元汇率折算' : 'Deposit Ad Funds & Real-Time FX Conversion'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {language === 'zh'
                  ? '支持支付宝/微信即时扫码。系统自动折算美元并扣除 20% 服务费后存入投流余额。'
                  : 'Scan with Alipay or WeChat Pay. Funds are converted to USD with automated 20% platform margin split.'}
              </p>
            </div>

            {!pendingQrData ? (
              <div className="space-y-4 text-xs">
                {/* Amount presets */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'zh' ? '选择充值金额 (人民币 CNY)' : 'Select Deposit Amount (CNY)'}
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[5000, 10000, 20000, 50000, 100000].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setDepositAmountCny(amt)}
                        className={`p-3 rounded-xl font-bold font-mono transition-all ${
                          depositAmountCny === amt
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        ¥{amt.toLocaleString()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Input */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'zh' ? '或自定义充值金额 (¥)' : 'Or Enter Custom Amount (¥)'}
                  </label>
                  <input
                    type="number"
                    value={depositAmountCny}
                    onChange={(e) => setDepositAmountCny(Math.max(100, parseInt(e.target.value) || 0))}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono font-bold text-base text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Payment Method */}
                <div>
                  <label className="font-bold text-slate-700 block mb-1">
                    {language === 'zh' ? '选择支付通道' : 'Payment Method'}
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('ALIPAY')}
                      className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 font-bold transition-all ${
                        selectedMethod === 'ALIPAY'
                          ? 'border-blue-500 bg-blue-50/50 text-blue-900'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-xl">🔵</span>
                      <span>{language === 'zh' ? '支付宝扫码 (Alipay)' : 'Alipay QR'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('WECHAT_PAY')}
                      className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 font-bold transition-all ${
                        selectedMethod === 'WECHAT_PAY'
                          ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900'
                          : 'border-slate-200 text-slate-700'
                      }`}
                    >
                      <span className="text-xl">🟢</span>
                      <span>{language === 'zh' ? '微信支付 (WeChat)' : 'WeChat Pay QR'}</span>
                    </button>
                  </div>
                </div>

                {/* FX & Margin Preview Card */}
                {(() => {
                  const preview = FxConversionService.calculateTopUpConversion(depositAmountCny, 0.20, 7.235);
                  return (
                    <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 font-mono text-[11px]">
                      <div className="flex justify-between text-slate-600 font-sans">
                        <span>{language === 'zh' ? '实时中间汇率:' : 'Live Mid-Market Rate:'}</span>
                        <span className="font-bold text-slate-900">1 USD = 7.2350 CNY</span>
                      </div>
                      <div className="flex justify-between text-slate-600 font-sans">
                        <span>{language === 'zh' ? '折合毛美元 (Gross USD):' : 'Gross USD Converted:'}</span>
                        <span className="font-bold text-slate-900">${preview.grossAmountUsd} USD</span>
                      </div>
                      <div className="flex justify-between text-slate-600 font-sans">
                        <span>{language === 'zh' ? '平台服务费 (20% Platform Margin):' : 'Platform Fee (20% Retained):'}</span>
                        <span className="font-bold text-indigo-600">-${preview.marginAmountUsd} USD</span>
                      </div>
                      <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-indigo-200 pt-2 font-sans">
                        <span>{language === 'zh' ? '实际入账可用广告金:' : 'Net Ad Budget Credited:'}</span>
                        <span className="text-emerald-600 font-black font-mono">${preview.netAdBudgetUsd} USD</span>
                      </div>
                    </div>
                  );
                })()}

                <Button onClick={handleInitiateQr} className="w-full py-3 font-bold">
                  {language === 'zh' ? '生成支付二维码 (Generate QR Code) ➔' : 'Generate Checkout QR Code ➔'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4 text-center text-xs animate-in zoom-in-95">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 inline-block mx-auto">
                  <img
                    src={pendingQrData.qrUrl}
                    alt="Payment QR Code"
                    className="w-48 h-48 mx-auto rounded-lg shadow-sm"
                  />
                  <div className="mt-2 font-mono font-bold text-slate-700">
                    {language === 'zh' ? '充值金额' : 'Deposit Amount'}: ¥{depositAmountCny.toLocaleString()} CNY
                  </div>
                </div>

                <p className="text-slate-500 max-w-xs mx-auto">
                  {language === 'zh' ? (
                    <>
                      请使用<strong>{selectedMethod === 'ALIPAY' ? '支付宝' : '微信'}</strong>扫描上方二维码完成支付。支付成功后，
                      <strong>${pendingQrData.conversion.netAdBudgetUsd} USD</strong> 将自动计入您的广告钱包。
                    </>
                  ) : (
                    <>
                      Please scan with <strong>{selectedMethod === 'ALIPAY' ? 'Alipay' : 'WeChat'}</strong> to complete payment. Upon confirmation,{' '}
                      <strong>${pendingQrData.conversion.netAdBudgetUsd} USD</strong> will be credited directly to your media buying balance.
                    </>
                  )}
                </p>

                <div className="pt-2 flex gap-3">
                  <Button variant="outline" onClick={() => setPendingQrData(null)} className="w-1/2">
                    {language === 'zh' ? '返回修改' : 'Back'}
                  </Button>
                  <Button
                    onClick={handleConfirmSimulation}
                    disabled={isSimulatingPayment}
                    className="w-1/2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                  >
                    {isSimulatingPayment
                      ? language === 'zh' ? '正在确认到账...' : 'Verifying...'
                      : language === 'zh' ? '模拟扫码完成支付' : 'Simulate Successful Payment'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Toast */}
      {toastMsg && (
        <div className="fixed bottom-8 right-8 z-50 px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
