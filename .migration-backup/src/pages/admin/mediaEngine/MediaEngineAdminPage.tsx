import { useState } from 'react';
import {
  Key,
  Zap,
  Sliders,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  PauseCircle,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
  GoogleAdsLogo,
  MetaLogo,
  TikTokLogo,
} from '../../../components/mediaBuyer/BrandLogos';
import { MasterMediaCredential } from '../../../types/mediaBuyer';
import { useI18n } from '../../../lib/i18n';

export function MediaEngineAdminPage() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const fmtTime = (s: string) => {
    if (s === 'Just now') return t('Just now', '刚刚');
    if (s === '2m ago') return t('2m ago', '2 分钟前');
    if (s === '5m ago') return t('5m ago', '5 分钟前');
    return s;
  };
  const [defaultMarginPct, setDefaultMarginPct] = useState(20);
  const [enterpriseMarginThreshold, setEnterpriseMarginThreshold] = useState(100000);
  const [enterpriseMarginPct, setEnterpriseMarginPct] = useState(15);
  const [globalKillSwitchActive, setGlobalKillSwitchActive] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Master Agency Credentials
  const [credentials, setCredentials] = useState<MasterMediaCredential[]>([
    {
      id: 'cred-goog-01',
      platform: 'GOOGLE_ADS',
      name: 'Google Ads Master Agency MCC (XiSync Global)',
      mccCustomerId: '984-102-8819',
      developerTokenMasked: 'dev_token_9841••••••••••••',
      status: 'ACTIVE',
      dailySpendCapUsd: 100000,
      currentDaySpendUsd: 14820,
      latencyMs: 78,
      lastHealthCheckedAt: 'Just now',
    },
    {
      id: 'cred-meta-02',
      platform: 'META_ADS',
      name: 'Meta Business Manager Agency Portfolio (Direct VIP)',
      businessManagerId: 'bm_994810293812938',
      systemUserTokenMasked: 'EAAG9481••••••••••••bc91',
      status: 'ACTIVE',
      dailySpendCapUsd: 80000,
      currentDaySpendUsd: 11200,
      latencyMs: 65,
      lastHealthCheckedAt: '2m ago',
    },
    {
      id: 'cred-tiktok-03',
      platform: 'TIKTOK_ADS',
      name: 'TikTok For Business Agency Center (Global Spark)',
      businessCenterId: 'tt_bc_88192038192',
      systemUserTokenMasked: 'tt_acc_token••••••••••••91a2',
      status: 'ACTIVE',
      dailySpendCapUsd: 50000,
      currentDaySpendUsd: 6840,
      latencyMs: 82,
      lastHealthCheckedAt: '5m ago',
    },
  ]);

  const [testingId, setTestingId] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const handleTestPing = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, latencyMs: Math.floor(55 + Math.random() * 20), lastHealthCheckedAt: 'Just now' }
            : c
        )
      );
      triggerToast(t('Master Agency API Credential Authenticated: 200 OK', '顶级代理商 API 凭证已认证：200 OK'));
    }, 1000);
  };

  return (
    <div className="space-y-6 text-slate-900 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white shadow-md">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 via-cyan-400 to-emerald-400 text-slate-950 shadow-md">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold font-mono text-cyan-300 uppercase tracking-wider">
                {t('SaaS SuperAdmin Media Engine Hub', 'SaaS 超级管理员投流总控中心')}
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight">
              {t('Media Engine Admin & Master Agency Account Management', '跨国投流总控与代理商母账号管理 (Media Engine Admin)')}
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {t('Manage Google MCC, Meta BM, TikTok BC master agency keys, global 20% service-fee markup and emergency kill-switch controls', '管理 Google MCC、Meta BM、TikTok BC 顶级母账号密钥、全局 20% 服务费加价与紧急熔断控制')}
            </p>
          </div>
        </div>

        {/* Global Kill Switch */}
        <button
          onClick={() => {
            const nextState = !globalKillSwitchActive;
            setGlobalKillSwitchActive(nextState);
            triggerToast(
              nextState
                ? t('⚠️ Global emergency kill-switch ON: billing via external ad APIs for all tenants has been paused!', '⚠️ 全局紧急熔断已开启：已暂停所有租户的外部广告 API 计费！')
                : t('✓ Global emergency kill-switch lifted: campaigns resumed normal bidding & delivery.', '✓ 全局紧急熔断已解除：广告系列恢复正常竞价投放。')
            );
          }}
          className={`px-5 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 transition-all shadow-md ${
            globalKillSwitchActive
              ? 'bg-rose-600 hover:bg-rose-700 text-white'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
        >
          {globalKillSwitchActive ? (
            <>
              <AlertTriangle className="w-4 h-4 text-white animate-bounce" />
              <span>{t('Global ad kill-switch active (PAUSED)', '全局广告熔断中 (PAUSED)')}</span>
            </>
          ) : (
            <>
              <PauseCircle className="w-4 h-4" />
              <span>{t('Activate global emergency kill-switch', '开启全局紧急熔断')}</span>
            </>
          )}
        </button>
      </div>

      {/* Global Financial Flow Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">{t('Gross CNY Inflow', '累计人民币入金')}</span>
          <div className="text-2xl font-black text-slate-900 font-mono">¥1,840,000</div>
          <span className="text-[10px] text-emerald-600 font-semibold">{t('+24.5% vs. last month', '+24.5% 较上月')}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">{t('Fospe platform service-fee retention (20% Margin)', 'Fospe 平台服务费留存 (20% Margin)')}</span>
          <div className="text-2xl font-black text-emerald-600 font-mono">$50,863 USD</div>
          <span className="text-[10px] text-slate-400">{t('Net profit retention 100%', '净利润留存率 100%')}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">{t('Live API Spend', '实时 API 消耗总额')}</span>
          <div className="text-2xl font-black text-indigo-600 font-mono">$32,860 USD</div>
          <span className="text-[10px] text-slate-400">{t('Today (37 export tenants)', '今日消耗 (37家出海租户)')}</span>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 font-bold">{t('Unspent Escrow', '租户未消耗沉淀资金')}</span>
          <div className="text-2xl font-black text-cyan-600 font-mono">$148,200 USD</div>
          <span className="text-[10px] text-emerald-600 font-bold">{t('Bank escrow account, no advance-payment risk', '银行托管账户无垫资风险')}</span>
        </div>
      </div>

      {/* SECTION 1: MASTER AGENCY CREDENTIALS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="font-black text-base text-slate-900">{t('Master Agency Credentials', '顶级母账号凭证金库 (Master Agency Credentials)')}</h2>
              <p className="text-xs text-slate-500">{t('AES-256 encrypted at rest; the system uses this identity to auto-provision and manage sub-accounts for each export merchant.', 'AES-256 加密存储，系统自动以此身份为各出海商家开通并管理二级子账户')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {credentials.map((cred) => (
            <div key={cred.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    {cred.platform === 'GOOGLE_ADS' && <GoogleAdsLogo size={18} />}
                    {cred.platform === 'META_ADS' && <MetaLogo size={18} />}
                    {cred.platform === 'TIKTOK_ADS' && <TikTokLogo size={18} />}
                  </div>
                  <span className="font-extrabold text-sm text-slate-900">{cred.name}</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {cred.status === 'ACTIVE' ? t('Active', '正常') : cred.status}
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-600 flex flex-wrap gap-4 pt-1">
                  <span>{t('ID', 'ID')}: {cred.mccCustomerId || cred.businessManagerId || cred.businessCenterId}</span>
                  <span>{t('Token', '令牌')}: {cred.developerTokenMasked || cred.systemUserTokenMasked}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right text-xs font-mono pr-2 hidden sm:block">
                  <div className="font-bold text-slate-900">{t('Today', '今日消耗')}: ${cred.currentDaySpendUsd.toLocaleString()} / ${cred.dailySpendCapUsd.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">{t('Latency', '延迟')}: <strong className="text-emerald-600">{cred.latencyMs}ms</strong> • {fmtTime(cred.lastHealthCheckedAt)}</div>
                </div>

                <button
                  onClick={() => handleTestPing(cred.id)}
                  disabled={testingId === cred.id}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 shadow-2xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingId === cred.id ? 'animate-spin text-indigo-600' : ''}`} />
                  <span>{testingId === cred.id ? t('Testing…', '校验中...') : t('Test health', '测试健康度')}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: GLOBAL MARGIN & PRICING CONTROLS */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <div>
              <h2 className="font-black text-base text-slate-900">{t('Platform Margin & Tier Rules', '平台全局服务费加价规则 (Platform Margin & Tier Rules)')}</h2>
              <p className="text-xs text-slate-500">{t('Configure the service-fee rate auto-deducted from CNY top-ups and tiered discounts for enterprise clients.', '配置人民币充值自动扣除的服务费率与大客户梯度优惠')}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">{t('Default Margin %', '默认标准平台服务费率 (Default Margin %)')}</label>
            <div className="relative">
              <input
                type="number"
                value={defaultMarginPct}
                onChange={(e) => setDefaultMarginPct(parseInt(e.target.value) || 20)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 outline-none focus:border-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 font-bold">%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">{t('Auto-deducted on merchant top-up (default 20%)', '出海商家充值时自动扣除（默认 20%）')}</span>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">{t('Enterprise tier threshold (CNY)', '大客户阶梯充值门槛 (CNY)')}</label>
            <input
              type="number"
              value={enterpriseMarginThreshold}
              onChange={(e) => setEnterpriseMarginThreshold(parseInt(e.target.value) || 100000)}
              className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">{t('Single top-up above this amount triggers the enterprise discount.', '单笔充值超过此金额触发大客优惠')}</span>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">{t('Enterprise discount rate (%)', '大客户优惠费率 (%)')}</label>
            <div className="relative">
              <input
                type="number"
                value={enterpriseMarginPct}
                onChange={(e) => setEnterpriseMarginPct(parseInt(e.target.value) || 15)}
                className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold text-slate-900 outline-none focus:border-indigo-500"
              />
              <span className="absolute right-3 top-2.5 text-slate-400 font-bold">%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">{t('Enterprise-only service fee (e.g. 15%)', '大客户专享服务费（如 15%）')}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <Button onClick={() => triggerToast(t('Global platform service-fee markup rules saved and applied network-wide!', '全局平台服务费加价规则已保存并全网生效！'))}>
            {t('Save rate settings', '保存费率设置')}
          </Button>
        </div>
      </div>

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
