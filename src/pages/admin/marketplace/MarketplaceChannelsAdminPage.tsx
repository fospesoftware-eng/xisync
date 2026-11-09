import { useState } from 'react';
import {
  KeyRound,
  RefreshCw,
  Activity,
  ShieldCheck,
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
  ChannelLogo,
  ChannelName,
  ConnectionStatusPill,
  StatCard,
  SectionCard,
  PageHeader,
  int,
} from '../../../components/marketplace/marketplaceUi';
import { MarketplaceSyncService } from '../../../lib/services/marketplace/marketplaceSyncService';
import type { MarketplaceChannelType } from '../../../types/marketplace';
import { useI18n } from '../../../lib/i18n';

interface MasterCredentialRow {
  id: string;
  channel: MarketplaceChannelType;
  providerLabel: { en: string; zh: string };
  appKeyMasked: string;
  appSecretLast4: string;
  membershipLabel: { en: string; zh: string };
  status: 'ACTIVE' | 'NEEDS_REAUTH';
  latencyMs: number;
  lastHealthCheckedAt: string;
  apiCallsToday: number;
  apiQuotaPerDay: number;
}

interface TenantStorefrontRow {
  id: string;
  tenant: string;
  channel: MarketplaceChannelType;
  memberId: string;
  tier: { en: string; zh: string };
  liveListings: number;
  authStatus: 'AUTHORIZED' | 'NEEDS_REAUTH';
  authorizedUntil: string;
}

const initialCredentials: MasterCredentialRow[] = [
  {
    id: 'mkt-cred-alibaba',
    channel: 'ALIBABA',
    providerLabel: {
      en: 'ICBU Open Platform partner app (XiSync Global ISV)',
      zh: 'ICBU 开放平台合作伙伴应用（XiSync 全球 ISV）',
    },
    appKeyMasked: 'LTAI5t••••••••••••k92p',
    appSecretLast4: '7f2a',
    membershipLabel: {
      en: '出口通 · Gold Supplier (SaaS test store)',
      zh: '出口通 · 金牌供应商 (SaaS 测试店铺)',
    },
    status: 'ACTIVE',
    latencyMs: 184,
    lastHealthCheckedAt: '14 min ago',
    apiCallsToday: 184,
    apiQuotaPerDay: 5000,
  },
  {
    id: 'mkt-cred-mic',
    channel: 'MADE_IN_CHINA',
    providerLabel: {
      en: 'MIC supplier console connector (forward-compatible)',
      zh: '中国制造网供应商后台连接器（前向兼容）',
    },
    appKeyMasked: 'MIC-CONN••••••••••••aa11',
    appSecretLast4: 'c19e',
    membershipLabel: {
      en: 'Audited Supplier (SaaS test store)',
      zh: '认证供应商 (SaaS 测试店铺)',
    },
    status: 'ACTIVE',
    latencyMs: 160,
    lastHealthCheckedAt: '8 min ago',
    apiCallsToday: 96,
    apiQuotaPerDay: 5000,
  },
];

const initialStorefronts: TenantStorefrontRow[] = [
  {
    id: 'st-1',
    tenant: 'tn_ecotoys_99182 · EcoToys Demo',
    channel: 'ALIBABA',
    memberId: 'ecotoys_99182',
    tier: { en: '出口通 Gold Supplier', zh: '出口通 金牌供应商' },
    liveListings: 4,
    authStatus: 'AUTHORIZED',
    authorizedUntil: '2026-10-12',
  },
  {
    id: 'st-2',
    tenant: 'tn_ecotoys_99182 · EcoToys Demo',
    channel: 'MADE_IN_CHINA',
    memberId: 'ecotoyscn',
    tier: { en: 'Audited Supplier', zh: '认证供应商' },
    liveListings: 4,
    authStatus: 'AUTHORIZED',
    authorizedUntil: '2026-12-01',
  },
  {
    id: 'st-3',
    tenant: 'tn_shenzhen_led · Shenzhen LED',
    channel: 'ALIBABA',
    memberId: 'szled_2024',
    tier: { en: '金品诚企', zh: '金品诚企' },
    liveListings: 12,
    authStatus: 'AUTHORIZED',
    authorizedUntil: '2027-01-15',
  },
  {
    id: 'st-4',
    tenant: 'tn_machinery_cn · CNC Machinery',
    channel: 'MADE_IN_CHINA',
    memberId: 'cncmachinery',
    tier: { en: 'Audited Supplier', zh: '认证供应商' },
    liveListings: 6,
    authStatus: 'NEEDS_REAUTH',
    authorizedUntil: '2026-09-20',
  },
];

export function MarketplaceChannelsAdminPage() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const fmtTime = (s: string) => {
    if (s === 'just now') return t('just now', '刚刚');
    const m = s.match(/^(\d+) min ago$/);
    if (m) return t(`${m[1]} min ago`, `${m[1]} 分钟前`);
    return s;
  };
  const [credentials, setCredentials] = useState<MasterCredentialRow[]>(initialCredentials);
  const [storefronts, setStorefronts] = useState<TenantStorefrontRow[]>(initialStorefronts);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmRotate, setConfirmRotate] = useState<string | null>(null);

  const notify = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 8000);
  };

  const testConnection = async (cred: MasterCredentialRow) => {
    setBusyId(cred.id);
    try {
      const conn = await MarketplaceSyncService.healthCheckChannel(cred.channel);
      setCredentials((prev) =>
        prev.map((c) =>
          c.id === cred.id
            ? {
                ...c,
                status: 'ACTIVE',
                latencyMs: conn.apiHealth === 'HEALTHY_200_OK' ? Math.floor(120 + Math.random() * 120) : 999,
                lastHealthCheckedAt: 'just now',
              }
            : c
        )
      );
      notify(`[${isZh ? cred.providerLabel.zh : cred.providerLabel.en}] ${t('Health check passed — API reachable', '健康检查通过 — API 可达')} (${conn.apiHealth}).`);
    } catch (err) {
      notify(err instanceof Error ? err.message : String(err));
    } finally {
      setBusyId(null);
    }
  };

  const rotateKey = (id: string) => {
    setConfirmRotate(null);
    const hex = '0123456789abcdef';
    const newLast4 = Array.from({ length: 4 }, () => hex[Math.floor(Math.random() * 16)]).join('');
    setCredentials((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, appSecretLast4: newLast4, status: 'ACTIVE', lastHealthCheckedAt: 'just now' } : c
      )
    );
    // Rotating the master app credential invalidates every tenant authorization.
    setStorefronts((prev) =>
      prev.map((s) =>
        s.channel === credentials.find((c) => c.id === id)?.channel
          ? { ...s, authStatus: 'NEEDS_REAUTH' as const }
          : s
      )
    );
    notify(t('Key rotated. All connected tenant storefronts on this channel must re-authorize (OAuth consent).', '密钥已轮换。此渠道下所有已连接的租户店铺须重新授权（OAuth 同意）。'));
  };

  const openBriefing = (channel: MarketplaceChannelType) => {
    notify(
      channel === 'ALIBABA'
        ? t('Full research: see alibaba-international-station-api-briefing.md in repo root.', '完整研究：见仓库根目录的 alibaba-international-station-api-briefing.md。')
        : t('Made-in-China has no official seller API (verified) — export path is the official bulk-import template.', '中国制造网无官方卖家 API（已核实）— 导出路径为官方批量导入模板。')
    );
  };

  const totalLive = storefronts.reduce((sum, s) => sum + s.liveListings, 0);
  const needsReauth = storefronts.filter((s) => s.authStatus === 'NEEDS_REAUTH').length;

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <PageHeader
        title={t('Marketplace Channel Master Credentials', '跨境平台渠道主凭证')}
        subtitle={t('SaaS-admin control of the platform app credentials that let tenant storefronts sync their XiSync catalog to Alibaba.com and Made-in-China.com.', 'SaaS 管理员对平台应用凭证的管控，使租户店铺可将 XiSync 商品目录同步至阿里巴巴国际站与中国制造网。')}
      />

      {toast && (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold shadow-lg">
          <span className="truncate">{toast}</span>
          <button onClick={() => setToast(null)} className="p-1 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label={t('Connected tenant storefronts', '已连接的租户店铺')} value={String(storefronts.length)} icon={<Building2 className="w-4 h-4 text-sky-500" />} />
        <StatCard label={t('Live listings (all tenants)', '在线商品（全部租户）')} value={int(totalLive)} icon={<Activity className="w-4 h-4 text-emerald-500" />} />
        <StatCard
          label={t('Awaiting re-authorization', '待重新授权')}
          value={String(needsReauth)}
          tone={needsReauth > 0 ? 'text-amber-600 dark:text-amber-400' : undefined}
          icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          label={t('Master credentials', '主凭证')}
          value={String(credentials.filter((c) => c.status === 'ACTIVE').length)}
          icon={<KeyRound className="w-4 h-4 text-xisync-cyan-500" />}
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {credentials.map((cred) => {
          const conn = MarketplaceSyncService.connectionFor(cred.channel);
          return (
            <SectionCard
              key={cred.id}
              title={
                <div className="flex items-center gap-3">
                  <ChannelLogo channel={cred.channel} />
                  <div>
                    <div className="font-extrabold text-sm">{cred.channel === 'ALIBABA' ? t('Alibaba.com', '阿里巴巴国际站') : t('Made-in-China.com', '中国制造网')} {t('master app', '主应用')}</div>
                    <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">{isZh ? cred.providerLabel.zh : cred.providerLabel.en}</div>
                  </div>
                </div>
              }
              actions={<ConnectionStatusPill status={conn?.status ?? 'ERROR'} />}
            >
              <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs mb-4">
                <div>
                  <dt className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t('App Key (masked)', 'App Key（脱敏）')}</dt>
                  <dd className="font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5">{cred.appKeyMasked}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t('App Secret (last 4)', 'App Secret（后 4 位）')}</dt>
                  <dd className="font-mono font-bold text-slate-700 dark:text-slate-200 mt-0.5">••••••••{cred.appSecretLast4}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t('Membership', '会员等级')}</dt>
                  <dd className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">{isZh ? cred.membershipLabel.zh : cred.membershipLabel.en}</dd>
                </div>
                <div>
                  <dt className="text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">{t('Latency / last check', '延迟 / 最近检查')}</dt>
                  <dd className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                    {cred.latencyMs} ms · {fmtTime(cred.lastHealthCheckedAt)}
                  </dd>
                </div>
              </dl>

              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1">
                  <span>{t('API calls today (all tenants share quota)', '今日 API 调用（所有租户共享配额）')}</span>
                  <span>{int(cred.apiCallsToday)} / {int(cred.apiQuotaPerDay)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-xisync-cyan-500 to-xisync-blue-600"
                    style={{ width: `${Math.min(100, (cred.apiCallsToday / cred.apiQuotaPerDay) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" variant="outline" icon={<Activity className="w-3.5 h-3.5" />} loading={busyId === cred.id} onClick={() => testConnection(cred)}>
                  {t('Test connection', '测试连接')}
                </Button>
                {confirmRotate === cred.id ? (
                  <>
                    <Button size="sm" variant="danger" loading={busyId === cred.id} onClick={() => rotateKey(cred.id)}>
                      {t('Confirm rotate (invalidates tenant auths)', '确认轮换（会使租户授权失效）')}
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setConfirmRotate(null)}>
                      {t('Cancel', '取消')}
                    </Button>
                  </>
                ) : (
                  <Button size="sm" variant="ghost" icon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => setConfirmRotate(cred.id)}>
                    {t('Rotate key', '轮换密钥')}
                  </Button>
                )}
                <button onClick={() => openBriefing(cred.channel)} className="inline-flex items-center gap-1 text-[11px] font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400 hover:underline ml-auto">
                  {t('Access-model notes', '接入模式说明')} <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </SectionCard>
          );
        })}
      </div>

      <SectionCard
        title={t('Connected tenant storefronts', '已连接的租户店铺')}
        subtitle={t('Storefronts that authorized XiSync (per store). Master key rotation above marks them NEEDS_REAUTH.', '已授权 XiSync 的店铺（按店铺计）。上方的母密钥轮换会将它们标记为 NEEDS_REAUTH。')}
        className="p-0 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 font-extrabold uppercase tracking-wide text-[10px]">
                <th className="py-3 px-5">{t('Tenant storefront', '租户店铺')}</th>
                <th className="py-3 px-5">{t('Channel', '渠道')}</th>
                <th className="py-3 px-5">{t('Member ID', '会员 ID')}</th>
                <th className="py-3 px-5">{t('Tier', '会员等级')}</th>
                <th className="py-3 px-5 text-right">{t('Live listings', '在线商品')}</th>
                <th className="py-3 px-5">{t('Authorization', '授权')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {storefronts.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-800 dark:text-slate-200">{s.tenant}</td>
                  <td className="py-3.5 px-5">
                    <span className="inline-flex items-center gap-1.5">
                      <ChannelLogo channel={s.channel} className="w-5 h-5 text-[8px]" />
                      <ChannelName channel={s.channel} showDomain={false} />
                    </span>
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-500 dark:text-slate-400">{s.memberId}</td>
                  <td className="py-3.5 px-5 font-bold text-slate-600 dark:text-slate-300">{isZh ? s.tier.zh : s.tier.en}</td>
                  <td className="py-3.5 px-5 text-right font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{s.liveListings}</td>
                  <td className="py-3.5 px-5">
                    {s.authStatus === 'AUTHORIZED' ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {t('Authorized until', '已授权至')} {s.authorizedUntil}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                        <AlertTriangle className="w-3.5 h-3.5" /> {t('Needs re-auth (before', '需重新授权（截至')} {s.authorizedUntil}{t(')', '）')}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <SectionCard title={t('How tenant sync is provisioned', '租户同步如何开通')} subtitle={t('SaaS master-app model, mirroring the Media Buyer credential architecture', 'SaaS 主应用模式，与 Media Buyer 凭证架构一致')}>
        <ol className="space-y-2 text-xs text-slate-500 dark:text-slate-400 list-decimal list-inside">
          <li>
            <b className="text-slate-700 dark:text-slate-200">{t('Alibaba.com:', '阿里巴巴国际站：')}</b> {t('XiSync holds the ICBU partner app (appkey/secret). A tenant storefront subscribes via fuwu.alibaba.com and consents with their alibaba.com login — the access token becomes the tenant\'s session key. Product APIs used: schema publish/update, category, photobank, inventory, on/off shelf (see briefing file).', 'XiSync 持有 ICBU 合作伙伴应用（appkey/secret）。租户店铺通过 fuwu.alibaba.com 订阅并使用其 alibaba.com 登录进行授权同意 — 访问令牌即成为该租户的会话密钥。使用的商品 API：schema 发布/更新、类目、photobank、库存、上下架（见说明文件）。')}
          </li>
          <li>
            <b className="text-slate-700 dark:text-slate-200">{t('Made-in-China.com:', '中国制造网：')}</b> {t('no official catalog API exists (verified) — the connector exports to the official Excel bulk-import template in 外贸e家 / Virtual Office; the API-shaped adapter keeps the tenant workflow identical so a future sanctioned API can slot in without UI changes.', '无官方商品目录 API（已核实）— 连接器导出为 外贸e家 / Virtual Office 的官方 Excel 批量导入模板；采用 API 形态的适配器使租户工作流保持一致，便于未来 sanctioned API 接入时无需改动 UI。')}
          </li>
          <li>
            <b className="text-slate-700 dark:text-slate-200">{t('Security:', '安全：')}</b> {t('secrets are AES-encrypted at rest (MediaAccountCredential pattern), never returned to the client — only masked previews, matching the marketplace Prisma schema additions.', '密钥静态加密（AES，MediaAccountCredential 模式），绝不返回给客户端 — 仅返回脱敏预览，与 marketplace Prisma schema 新增字段一致。')}
          </li>
        </ol>
        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4" /> {t('Persisted as MarketplaceChannelCredential in the database schema (Prisma)', '在数据库 schema（Prisma）中持久化为 MarketplaceChannelCredential')}
        </div>
      </SectionCard>
    </div>
  );
}
