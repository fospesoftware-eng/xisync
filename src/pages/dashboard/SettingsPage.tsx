import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { VisualWorkflowBuilder } from '../../components/workflow/VisualWorkflowBuilder';
import {
  Settings,
  Settings2,
  Building2,
  Bot,
  Ship,
  ShieldCheck,
  Bell,
  CheckCircle2,
  Key,
  Check,
  Radio,
  RefreshCw,
  Copy,
} from 'lucide-react';

interface ChannelAuthItem {
  id: string;
  name: string;
  channel: 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'wechat' | 'google_ads';
  icon: string;
  status: 'connected' | 'needs_auth' | 'token_expiring';
  appId: string;
  webhookSecret: string;
  accountName: string;
  leadsIngestedTotal: number;
  lastWebhookPing: string;
}

export function SettingsPage() {
  const location = useLocation();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync active settings tab
  const getTabFromPath = () => {
    if (location.pathname.includes('/channels') || location.pathname.includes('/api')) return 'channels';
    if (location.pathname.includes('/profile')) return 'profile';
    if (location.pathname.includes('/ai-rules')) return 'ai-rules';
    if (location.pathname.includes('/logistics-settings')) return 'logistics-settings';
    if (location.pathname.includes('/security-compliance')) return 'security-compliance';
    if (location.pathname.includes('/notifications')) return 'notifications';
    return 'channels';
  };

  const [activeTab, setActiveTab] = useState<'channels' | 'workflow' | 'profile' | 'ai-rules' | 'logistics-settings' | 'security-compliance' | 'notifications'>(getTabFromPath());

  // Form states
  const [factoryName, setFactoryName] = useState('Eco-Toys Craft & Precision Manufacturing Base');
  const [taxId, setTaxId] = useState('CN-91310000MA1FL4892X');
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Omnichannel API & App Auth Configurations
  const [channels] = useState<ChannelAuthItem[]>([
    {
      id: 'ch-fb-1',
      name: 'Facebook Messenger & Graph API',
      channel: 'facebook',
      icon: 'FB',
      status: 'connected',
      appId: '109284729104820',
      webhookSecret: 'fb_sec_994827103948172039',
      accountName: 'Eco-Toys Craft Official Page',
      leadsIngestedTotal: 482,
      lastWebhookPing: '2 mins ago',
    },
    {
      id: 'ch-ig-2',
      name: 'Instagram Direct Business API',
      channel: 'instagram',
      icon: 'IG',
      status: 'connected',
      appId: 'ig_biz_8837192049182',
      webhookSecret: 'ig_sec_38291049281039482',
      accountName: '@ecotoys_craft_official',
      leadsIngestedTotal: 319,
      lastWebhookPing: 'Just now',
    },
    {
      id: 'ch-wa-3',
      name: 'WhatsApp Business Cloud API (Meta)',
      channel: 'whatsapp',
      icon: 'WA',
      status: 'connected',
      appId: 'waba_phone_18004927962',
      webhookSecret: 'waba_sec_8471920394817293',
      accountName: '+1 (800) 492-7962 (Verified Exporter)',
      leadsIngestedTotal: 840,
      lastWebhookPing: '5 mins ago',
    },
    {
      id: 'ch-tt-4',
      name: 'TikTok Commercial Direct Lead Center',
      channel: 'tiktok',
      icon: 'TT',
      status: 'connected',
      appId: 'tt_app_774910293847',
      webhookSecret: 'tt_sec_1928471920384719',
      accountName: '@ecotoys_global_factory',
      leadsIngestedTotal: 215,
      lastWebhookPing: '12 mins ago',
    },
    {
      id: 'ch-wc-5',
      name: 'WeChat Official Account & WeCom Bridge',
      channel: 'wechat',
      icon: 'WC',
      status: 'connected',
      appId: 'wx8947291048201948',
      webhookSecret: 'wc_sec_7739102938471920',
      accountName: 'Eco-Toys 宁波制造基地企业微信',
      leadsIngestedTotal: 1290,
      lastWebhookPing: '1 min ago',
    },
  ]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const handleTestWebhook = (chId: string) => {
    setSyncingId(chId);
    setTimeout(() => {
      setSyncingId(null);
      triggerToast(`Live Webhook Test Ping Successful! All incoming messages routing to Unified Inbox.`);
    }, 800);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white bg-slate-50/60 dark:bg-transparent p-2 md:p-4 rounded-3xl min-h-screen">
      {/* Settings Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-md">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                System Administration & Omnichannel API Controls
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Client Settings & Channel Authorization Hub
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300 font-medium mt-0.5">
              Manage Facebook Messenger, Instagram Direct, WhatsApp Cloud API, TikTok, and unified webhook ingesters
            </p>
          </div>
        </div>

        <Button
          onClick={() => triggerToast('All channel configurations and API authorization tokens saved!')}
          icon={<Check className="w-4 h-4" />}
        >
          Save All Settings
        </Button>
      </div>

      {/* Settings Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('channels')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'channels'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Channel API & Auth (FB, IG, WA)</span>
        </button>

        <button
          onClick={() => setActiveTab('workflow')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'workflow'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Workflow Builder</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Manufacturer Profile</span>
        </button>

        <button
          onClick={() => setActiveTab('ai-rules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'ai-rules'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Copilot & Pricing</span>
        </button>

        <button
          onClick={() => setActiveTab('logistics-settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'logistics-settings'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>Logistics & Freight</span>
        </button>

        <button
          onClick={() => setActiveTab('security-compliance')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'security-compliance'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Credit Shield</span>
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>API & Webhooks</span>
        </button>
      </div>

      {/* MODULE: Omnichannel Channel API & OAuth Settings */}
      {activeTab === 'channels' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-cyan-500" />
                  <span>Omnichannel Social Chat & Messaging Channels API Hub</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  All messages from Facebook, Instagram, WhatsApp, TikTok, and WeChat automatically land in the Unified Inbox with DeepSeek AI translation
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 self-start sm:self-auto">
                ALL 5 CHANNELS ACTIVE
              </span>
            </div>

            {/* Channels Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              {channels.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">{item.name}</h3>
                        <div className="text-[11px] text-slate-500 font-medium">{item.accountName}</div>
                      </div>
                    </div>

                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      LIVE CONNECTED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">App ID / Channel Key:</span>
                      <span className="font-bold font-mono text-[11px] truncate block text-slate-900 dark:text-white">
                        {item.appId}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">Total Ingested Leads:</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">
                        {item.leadsIngestedTotal.toLocaleString()} leads
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">Last Webhook: {item.lastWebhookPing}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestWebhook(item.id)}
                        disabled={syncingId === item.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 transition-all shadow-2xs"
                      >
                        <RefreshCw className={`w-3 h-3 ${syncingId === item.id ? 'animate-spin' : ''}`} />
                        <span>Test Webhook</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Global Webhook Listener Endpoint */}
            <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5 font-mono">
                  <Key className="w-3.5 h-3.5" />
                  <span>Unified Omnichannel Webhook Listener Endpoint (Auto-Ingestion to Inbox)</span>
                </span>
                <button
                  onClick={() => triggerToast('Webhook URL copied to clipboard!')}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
              </div>
              <div className="font-mono text-xs text-emerald-400 bg-slate-950 p-2.5 rounded-xl overflow-x-auto">
                https://api.xisync.com/v1/omnichannel/inbox/webhook?tenant_id=tn_ecotoys_99182
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 1: Visual Workflow Engine Builder & Modifier */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <VisualWorkflowBuilder />
        </div>
      )}

      {/* MODULE 2: Manufacturer & Company Profile Settings */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-cyan-500" />
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Exporter Factory Profile & Licensing</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                VERIFIED EXPORTER
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Official Company / Factory Name</label>
                <input
                  type="text"
                  value={factoryName}
                  onChange={(e) => setFactoryName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Unified Social Credit Code (China Tax ID)</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">System Base Accounting Currency</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none">
                  <option>USD ($) - United States Dollar (Default Base)</option>
                  <option>EUR (€) - Eurozone Settlement Currency</option>
                  <option>GBP (£) - British Pound Sterling</option>
                  <option>CNY (¥) - Chinese Yuan Renminbi Direct</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Main Manufacturing Category</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none">
                  <option>Eco Wooden Toys & Child Montessori Goods</option>
                  <option>High-Tech Electronics & Machinery</option>
                  <option>Solar PV & Energy Storage</option>
                  <option>Apparel, Footwear & Textiles</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => triggerToast('Manufacturer Profile details saved!')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                Save Factory Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}
