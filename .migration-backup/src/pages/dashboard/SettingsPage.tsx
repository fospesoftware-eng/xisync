import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Lock,
  Edit3,
  X,
} from 'lucide-react';

interface ChannelAuthItem {
  id: string;
  name: string;
  channel: 'facebook' | 'instagram' | 'whatsapp' | 'tiktok' | 'wechat' | 'google_ads';
  icon: string;
  status: 'connected' | 'needs_auth' | 'token_expiring';
  appId: string;
  phoneNumberId?: string;
  wabaId?: string;
  permanentAccessToken?: string;
  webhookVerifyToken?: string;
  webhookSecret: string;
  accountName: string;
  leadsIngestedTotal: number;
  lastWebhookPing: string;
}

export function SettingsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const isUltra = location.pathname.includes('/dashboard/ultra');
  const baseRoute = isUltra ? '/dashboard/ultra/settings' : '/dashboard/settings';

  // Sync active settings tab with URL route
  const getTabFromPath = (): 'channels' | 'workflow' | 'profile' | 'ai-rules' | 'logistics-settings' | 'security-compliance' | 'notifications' => {
    if (location.pathname.includes('/channels') || location.pathname.includes('/api')) return 'channels';
    if (location.pathname.includes('/workflow')) return 'workflow';
    if (location.pathname.includes('/profile')) return 'profile';
    if (location.pathname.includes('/ai-rules')) return 'ai-rules';
    if (location.pathname.includes('/logistics-settings')) return 'logistics-settings';
    if (location.pathname.includes('/security-compliance')) return 'security-compliance';
    if (location.pathname.includes('/notifications')) return 'notifications';
    return 'channels';
  };

  const [activeTab, setActiveTab] = useState<'channels' | 'workflow' | 'profile' | 'ai-rules' | 'logistics-settings' | 'security-compliance' | 'notifications'>(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (tab: 'channels' | 'workflow' | 'profile' | 'ai-rules' | 'logistics-settings' | 'security-compliance' | 'notifications') => {
    setActiveTab(tab);
    navigate(`${baseRoute}/${tab}`);
  };

  // AI Chatbot Builder & Negotiation Engine States
  const [botName, setBotName] = useState('Sarah Chen');
  const [botRole, setBotRole] = useState('Senior Export Account Director');
  const [botTone, setBotTone] = useState('warm_professional');
  const [minMargin, setMinMargin] = useState('25.0');
  const [maxDiscount, setMaxDiscount] = useState('15.0');
  const [maxShipmentDays, setMaxShipmentDays] = useState('15');
  const [sampleDispatchDays, setSampleDispatchDays] = useState('2');
  const [freeSampleEnabled, setFreeSampleEnabled] = useState(true);
  const [autoEscalateAfter, setAutoEscalateAfter] = useState('3');
  const [defaultIncoterms, setDefaultIncoterms] = useState('FOB Shanghai (CNSHA)');
  const [paymentTerm, setPaymentTerm] = useState('30/70 T/T Split');
  const [minCreditScore, setMinCreditScore] = useState('75');
  const [preferredCarrier, setPreferredCarrier] = useState('COSCO Shipping');
  const [factoryName, setFactoryName] = useState('Eco-Toys Craft & Precision Manufacturing Base');
  const [taxId, setTaxId] = useState('CN-91310000MA1FL4892X');
  const [syncingId, setSyncingId] = useState<string | null>(null);

  // Modal State for Editing / Connecting Channel Credentials
  const [editingChannel, setEditingChannel] = useState<ChannelAuthItem | null>(null);

  // Omnichannel API & App Auth Configurations
  const [channels, setChannels] = useState<ChannelAuthItem[]>([
    {
      id: 'ch-wa-3',
      name: 'WhatsApp Business Cloud API (Meta)',
      channel: 'whatsapp',
      icon: 'WA',
      status: 'connected',
      appId: '109481920491829',
      phoneNumberId: '108472910482910',
      wabaId: 'waba_994810293847',
      permanentAccessToken: 'EAAG94810...x9841zK9',
      webhookVerifyToken: 'xisync_wa_webhook_token_2026',
      webhookSecret: 'waba_sec_8471920394817293',
      accountName: '+1 (800) 492-7962 (Verified Exporter)',
      leadsIngestedTotal: 840,
      lastWebhookPing: '5 mins ago',
    },
    {
      id: 'ch-fb-1',
      name: 'Facebook Messenger & Graph API',
      channel: 'facebook',
      icon: 'FB',
      status: 'connected',
      appId: '109284729104820',
      permanentAccessToken: 'EAAFB8491...pL902',
      webhookVerifyToken: 'xisync_fb_verify_token_2026',
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
      permanentAccessToken: 'EAAIG3829...mN102',
      webhookVerifyToken: 'xisync_ig_verify_token_2026',
      webhookSecret: 'ig_sec_38291049281039482',
      accountName: '@ecotoys_craft_official',
      leadsIngestedTotal: 319,
      lastWebhookPing: 'Just now',
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
      triggerToast(`Live Webhook Ping Verified! Incoming leads and chats routing directly to Unified Inbox.`);
    }, 800);
  };

  const handleSaveChannelModal = (updated: ChannelAuthItem) => {
    setChannels((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingChannel(null);
    triggerToast(`Updated API Credentials for ${updated.name}! Webhook & Access Tokens synchronized.`);
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
                System Administration & Omnichannel Controls
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Client Settings & Configuration Hub
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300 font-medium mt-0.5">
              Manage social chat channel authorizations, workflow engines, AI pricing rules, factory credentials, and API webhooks
            </p>
          </div>
        </div>

        <Button
          onClick={() => triggerToast('All configuration settings and live authorization tokens saved!')}
          icon={<Check className="w-4 h-4" />}
        >
          Save All Settings
        </Button>
      </div>

      {/* Settings Sub-Navigation Tabs Synchronized to Routes */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold shadow-xs overflow-x-auto">
        <button
          onClick={() => handleTabChange('channels')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'channels'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Channel API & Auth</span>
        </button>

        <button
          onClick={() => handleTabChange('workflow')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'workflow'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span>Workflow Builder</span>
        </button>

        <button
          onClick={() => handleTabChange('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          <span>Manufacturer Profile</span>
        </button>

        <button
          onClick={() => handleTabChange('ai-rules')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'ai-rules'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Chatbot & Negotiation Rules</span>
        </button>

        <button
          onClick={() => handleTabChange('logistics-settings')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'logistics-settings'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Ship className="w-3.5 h-3.5" />
          <span>Logistics & Freight</span>
        </button>

        <button
          onClick={() => handleTabChange('security-compliance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'security-compliance'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Credit Shield & Security</span>
        </button>

        <button
          onClick={() => handleTabChange('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>API Keys & Webhooks</span>
        </button>
      </div>

      {/* 1. SEPARATE SUB-MENU: Omnichannel Channel API & OAuth Settings */}
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
                  Click <strong>&quot;Configure API Credentials&quot;</strong> on any channel to enter Meta App ID, Permanent Access Token, WABA ID, and Webhook Verify Tokens.
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
                      <span className="text-[10px] text-slate-400 font-mono block">Meta App / Channel ID:</span>
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
                        onClick={() => setEditingChannel(item)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 text-white flex items-center gap-1.5 hover:bg-cyan-600 transition-all shadow-xs"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Configure API</span>
                      </button>

                      <button
                        onClick={() => handleTestWebhook(item.id)}
                        disabled={syncingId === item.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 transition-all shadow-2xs"
                      >
                        <RefreshCw className={`w-3 h-3 ${syncingId === item.id ? 'animate-spin' : ''}`} />
                        <span>Test Ping</span>
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

      {/* 2. SEPARATE SUB-MENU: Visual Workflow Engine Builder */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <VisualWorkflowBuilder />
        </div>
      )}

      {/* 3. SEPARATE SUB-MENU: Manufacturer & Company Profile Settings */}
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

      {/* 4. SEPARATE SUB-MENU: AI Chatbot Builder & Negotiation Rules */}
      {activeTab === 'ai-rules' && (
        <div className="space-y-6">
          {/* Card 1: Chatbot Personality & Identity Customizer */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-500" />
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white">AI Chatbot Profile & Persona Builder</h2>
                  <p className="text-xs text-slate-400">Configure your storefront AI consultant name, tone, role, and human escalation triggers</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300">
                DEEPSEEK AI INTEGRATED
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Chatbot / Agent Name</label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder="e.g. Sarah Chen"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Agent Official Title / Role</label>
                <input
                  type="text"
                  value={botRole}
                  onChange={(e) => setBotRole(e.target.value)}
                  placeholder="e.g. Senior Export Account Director"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Conversational Tone</label>
                <select
                  value={botTone}
                  onChange={(e) => setBotTone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                >
                  <option value="warm_professional">Warm, Natural & Professional (Recommended)</option>
                  <option value="luxury_executive">High-End Luxury Concierge</option>
                  <option value="friendly_casual">Friendly & Approachable Retailer</option>
                  <option value="direct_b2b">Direct Factory Wholesale / Technical</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Auto-Escalate to Human Agent After (Complex Inquiries)
                </label>
                <select
                  value={autoEscalateAfter}
                  onChange={(e) => setAutoEscalateAfter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                >
                  <option value="1">Instant Escalation on Custom OEM / Tooling</option>
                  <option value="3">After 3 Unresolved Technical Questions</option>
                  <option value="manual">Only on Explicit Buyer Request ("Human / Manager")</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Sample Policy Offer in Chat
                </label>
                <div className="flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={freeSampleEnabled}
                      onChange={(e) => setFreeSampleEnabled(e.target.checked)}
                      className="w-4 h-4 rounded text-cyan-600 focus:ring-cyan-500"
                    />
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      Enable "Free Quality Samples (Freight Collect)"
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Autonomous Negotiation & Dynamic Pricing Engine */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-purple-500" />
                <div>
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white">AI Autonomous Negotiation & Shipping Constraints</h2>
                  <p className="text-xs text-slate-400">Set hard financial guardrails for automatic quoting, discount margins, and shipment deadlines</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Target Profit Margin Floor (%)
                </label>
                <input
                  type="number"
                  value={minMargin}
                  onChange={(e) => setMinMargin(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Bot will never quote below this margin</span>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Max Autonomous Discount (%)
                </label>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Maximum tier-2 volume discount allowed</span>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Max Production Lead Time (Days)
                </label>
                <input
                  type="number"
                  value={maxShipmentDays}
                  onChange={(e) => setMaxShipmentDays(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Maximum promised manufacturing days</span>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  Sample Dispatch Lead Time (Days)
                </label>
                <input
                  type="number"
                  value={sampleDispatchDays}
                  onChange={(e) => setSampleDispatchDays(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Promised courier dispatch time</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Default International Incoterms</label>
                <select
                  value={defaultIncoterms}
                  onChange={(e) => setDefaultIncoterms(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                >
                  <option value="FOB Shanghai (CNSHA)">FOB Shanghai (CNSHA)</option>
                  <option value="FOB Ningbo (CNNGB)">FOB Ningbo (CNNGB)</option>
                  <option value="CIF Rotterdam">CIF Rotterdam (NLRTM)</option>
                  <option value="CIF Los Angeles">CIF Los Angeles (USLAX)</option>
                  <option value="DDP Delivered Duty Paid">DDP Delivered Duty Paid</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Standard Payment Terms</label>
                <select
                  value={paymentTerm}
                  onChange={(e) => setPaymentTerm(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                >
                  <option value="30/70 T/T Split">30% Deposit / 70% Against B/L Copy (T/T)</option>
                  <option value="100% Irrevocable L/C at Sight">100% Irrevocable L/C at Sight</option>
                  <option value="OA 60 Days with Sinosure">OA 60 Days (Sinosure Insured)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => triggerToast(`AI Chatbot rules saved! Bot: ${botName} (${botRole}), Max Discount: ${maxDiscount}%, Max Lead Time: ${maxShipmentDays} days.`)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs shadow-md transition-all"
              >
                Save Chatbot & Negotiation Rules
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SEPARATE SUB-MENU: Logistics & Freight */}
      {activeTab === 'logistics-settings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-blue-500" />
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Ocean Freight Defaults & Carrier Integrations</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Preferred Ocean Carrier</label>
                <select
                  value={preferredCarrier}
                  onChange={(e) => setPreferredCarrier(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                >
                  <option value="COSCO Shipping">COSCO Shipping (Direct Terminal Line)</option>
                  <option value="Maersk Line">Maersk Line (Spot Integrated)</option>
                  <option value="MSC Mediterranean">MSC Mediterranean Shipping</option>
                  <option value="CMA CGM Group">CMA CGM Group</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Primary Export Loading Port (POL)</label>
                <input
                  type="text"
                  defaultValue="Ningbo-Zhoushan Port (CNNGB) / Shanghai Port (CNSHA)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => triggerToast('Logistics carrier defaults and port configurations saved!')}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                Save Logistics Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. SEPARATE SUB-MENU: Credit Shield & Security */}
      {activeTab === 'security-compliance' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Credit Shield & Sinosure Risk Scoring</h2>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Minimum Buyer Credit Score for L/C Approval</label>
                <input
                  type="number"
                  value={minCreditScore}
                  onChange={(e) => setMinCreditScore(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-purple-500" />
                  Automated Wire Sanction & Entity List Screening
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Real-time screening against OFAC, EU, UN, and US Department of Commerce entity lists before accepting T/T wire transfers.
                </p>
              </div>
            </div>

            <button
              onClick={() => triggerToast('Credit Shield risk thresholds saved!')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              Save Security Rules
            </button>
          </div>
        </div>
      )}

      {/* 7. SEPARATE SUB-MENU: API Keys & Webhooks */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">API Integration Keys & Notifications</h2>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-500" />
                  XiSync Production Live API Key
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    defaultValue="xi_live_98412849128491284912"
                    readOnly
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 font-mono font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <button
                    onClick={() => triggerToast('API Key copied to clipboard!')}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    Copy Key
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">Omnichannel Lead Webhook Triggers</div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Instant webhook alerts dispatched for Meta Ads, Google Search inquiries, and WhatsApp Direct buyer leads.
                </p>
              </div>
            </div>

            <button
              onClick={() => triggerToast('Notification settings updated!')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              Save API Preferences
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Comprehensive API Credentials & Meta Token Setup */}
      {editingChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 text-left space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                  {editingChannel.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    Configure {editingChannel.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Enter Meta Cloud API credentials, webhook verification tokens, and Phone IDs
                  </p>
                </div>
              </div>

              <button
                onClick={() => setEditingChannel(null)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveChannelModal(editingChannel);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="font-bold text-slate-500 block mb-1">Account / Display Name</label>
                <input
                  type="text"
                  value={editingChannel.accountName}
                  onChange={(e) => setEditingChannel({ ...editingChannel, accountName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">Meta App ID / Client ID</label>
                  <input
                    type="text"
                    value={editingChannel.appId}
                    onChange={(e) => setEditingChannel({ ...editingChannel, appId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold outline-none"
                  />
                </div>

                {editingChannel.channel === 'whatsapp' ? (
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Phone Number ID (Meta WABA)</label>
                    <input
                      type="text"
                      value={editingChannel.phoneNumberId || '108472910482910'}
                      onChange={(e) => setEditingChannel({ ...editingChannel, phoneNumberId: e.target.value })}
                      placeholder="e.g. 108472910482910"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Webhook Secret / App Secret</label>
                    <input
                      type="password"
                      value={editingChannel.webhookSecret}
                      onChange={(e) => setEditingChannel({ ...editingChannel, webhookSecret: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold outline-none"
                    />
                  </div>
                )}
              </div>

              {editingChannel.channel === 'whatsapp' && (
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">WhatsApp Business Account ID (WABA ID)</label>
                    <input
                      type="text"
                      value={editingChannel.wabaId || 'waba_994810293847'}
                      onChange={(e) => setEditingChannel({ ...editingChannel, wabaId: e.target.value })}
                      placeholder="e.g. waba_994810293847"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 block mb-1">Webhook Secret</label>
                    <input
                      type="password"
                      value={editingChannel.webhookSecret}
                      onChange={(e) => setEditingChannel({ ...editingChannel, webhookSecret: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="font-bold text-slate-500 block mb-1">Meta System User Permanent Access Token (Bearer)</label>
                <input
                  type="password"
                  value={editingChannel.permanentAccessToken || 'EAAG94810...x9841zK9'}
                  onChange={(e) => setEditingChannel({ ...editingChannel, permanentAccessToken: e.target.value })}
                  placeholder="EAAG..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-medium outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">Webhook Verify Token (Enter in Meta Developer App)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingChannel.webhookVerifyToken || 'xisync_webhook_verify_token_2026'}
                    readOnly
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 font-mono font-bold outline-none text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => triggerToast('Verify Token copied to clipboard!')}
                    className="px-3 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    Copy Token
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-cyan-900 dark:text-cyan-200 text-xs space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-500" />
                  Meta Webhook Callback URL:
                </div>
                <div className="font-mono font-bold text-[11px] select-all bg-white dark:bg-slate-900 p-2 rounded-lg border border-cyan-100 dark:border-cyan-900">
                  https://api.xisync.com/v1/omnichannel/inbox/webhook?tenant_id=tn_ecotoys_99182
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingChannel(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-extrabold text-xs shadow-md"
                >
                  Save API Credentials
                </button>
              </div>
            </form>
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
