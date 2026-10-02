import { useState } from 'react';
import { useI18n } from '../../../lib/i18n';
import { useTheme } from '../../../lib/theme-context';
import { mockAdAccounts } from '../../../lib/mockMarketingData';
import { ChannelIcon } from '../../../components/ui/ChannelIcon';
import {
  AlertTriangle,
  RefreshCw,
  Zap,
  CheckCircle,
  ExternalLink,
  Key,
} from 'lucide-react';

export function MarketingChannelsPage() {
  const { language } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [accounts, setAccounts] = useState(mockAdAccounts);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const handleRefreshTokens = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setAccounts((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                status: 'connected',
                tokenExpiresAt: '2026-12-31T00:00:00Z',
                lastSyncedAt: new Date().toISOString(),
              }
            : a
        )
      );
      setSyncingId(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200/80'} shadow-sm flex items-center justify-between`}>
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'zh' ? '出海广告账户与 API 授权管理' : 'Ad Accounts & Channels Connection Manager'}
          </h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {language === 'zh'
              ? '管理 Meta Ads (FB/IG)、Google Ads、TikTok Commercial 与 WhatsApp Cloud API 的 OAuth 2.0 授权与 Webhook 实时回传'
              : 'Manage OAuth tokens, API rate limits, and webhook lead receivers across overseas platforms.'}
          </p>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200/80'} shadow-sm space-y-4 transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-600`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <ChannelIcon channel={acc.channel} size="md" />
                <div>
                  <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{acc.name}</h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">ID: {acc.accountId}</div>
                </div>
              </div>

              <span
                className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase flex items-center gap-1.5 border ${
                  acc.status === 'connected'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60'
                    : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800/60'
                }`}
              >
                {acc.status === 'connected' ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    CONNECTED
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    TOKEN EXPIRING
                  </>
                )}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700/60">
              <div>
                <span className="text-slate-500 dark:text-slate-400">{language === 'zh' ? '本月总消耗:' : 'Monthly Spend:'}</span>
                <div className="font-bold text-sm text-slate-900 dark:text-white mt-0.5">${acc.totalSpendMonth.toLocaleString()} USD</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">{language === 'zh' ? 'Token 到期时间:' : 'Token Expiry:'}</span>
                <div className="font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{acc.tokenExpiresAt.split('T')[0]}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">{language === 'zh' ? '活跃广告系列:' : 'Active Campaigns:'}</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{acc.activeCampaignsCount}</div>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">{language === 'zh' ? 'Webhook 回传状态:' : 'Webhook Lead Receiver:'}</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <Zap className="w-3 h-3 text-emerald-500" /> ACTIVE
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-400 font-mono">
                {language === 'zh' ? '上次同步:' : 'Last Synced:'} {new Date(acc.lastSyncedAt).toLocaleTimeString()}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRefreshTokens(acc.id)}
                  disabled={syncingId === acc.id}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncingId === acc.id ? 'animate-spin' : ''}`} />
                  {language === 'zh' ? '刷新 Token 授权' : 'Renew OAuth'}
                </button>

                <a
                  href={`#${acc.channel}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-xisync-cyan-50 dark:bg-xisync-cyan-950/60 text-xisync-cyan-700 dark:text-xisync-cyan-300 border border-xisync-cyan-200 dark:border-xisync-cyan-800/60 flex items-center gap-1 hover:bg-xisync-cyan-100 transition-all"
                >
                  {language === 'zh' ? '查看 API 设置' : 'API Settings'} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Webhook Endpoint Simulator & Token Management Info */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/90 border-slate-700/80' : 'bg-white border-slate-200/80'} shadow-sm space-y-4`}>
        <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'} flex items-center gap-2`}>
          <Key className="w-5 h-5 text-xisync-cyan-500" />
          {language === 'zh' ? 'XiSync Webhook 回调监听地址 (Real-time Lead Ingestion)' : 'XiSync Live Webhook Listener Endpoint'}
        </h3>
        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
          {language === 'zh'
            ? '将此 URL 填入 Meta Business Suite, Google Ads Lead Form Webhook 或 TikTok Developer Console 以秒级捕获线索。'
            : 'Copy this listener URL into your ad platforms for instant lead routing into XiSync CRM.'}
        </p>

        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 font-mono text-xs overflow-x-auto shadow-inner">
          <span>https://api.xisync.com/v1/webhooks/leads/receive?tenant_id=tn_892401</span>
        </div>
      </div>
    </div>
  );
}
