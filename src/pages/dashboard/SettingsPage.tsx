import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { VisualWorkflowBuilder } from '../../components/workflow/VisualWorkflowBuilder';
import { useI18n } from '../../lib/i18n';
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
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
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
      triggerToast(t('Live Webhook Ping Verified! Incoming leads and chats routing directly to Unified Inbox.', 'Webhook 实时连通验证成功！新增线索与会话已直接路由至统一收件箱。'));
    }, 800);
  };

  const handleSaveChannelModal = (updated: ChannelAuthItem) => {
    setChannels((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    setEditingChannel(null);
    triggerToast(t(`Updated API Credentials for ${updated.name}! Webhook & Access Tokens synchronized.`, `已更新 ${updated.name} 的 API 凭据！Webhook 与访问令牌已同步。`));
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
                {t('System Administration & Omnichannel Controls', '系统管理与全渠道控制台')}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t('Client Settings & Configuration Hub', '客户设置与配置中心')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300 font-medium mt-0.5">
              {t('Manage social chat channel authorizations, workflow engines, AI pricing rules, factory credentials, and API webhooks', '管理社交会话渠道授权、工作流引擎、AI 定价规则、工厂凭据与 API Webhook')}
            </p>
          </div>
        </div>

        <Button
          onClick={() => triggerToast(t('All configuration settings and live authorization tokens saved!', '所有配置项与实时授权令牌已保存！'))}
          icon={<Check className="w-4 h-4" />}
        >
          {t('Save All Settings', '保存全部设置')}
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
          <span>{t('Channel API & Auth', '渠道 API 与授权')}</span>
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
          <span>{t('Workflow Builder', '工作流构建器')}</span>
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
          <span>{t('Manufacturer Profile', '制造商资料')}</span>
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
          <span>{t('AI Chatbot & Negotiation Rules', 'AI 聊天机器人与谈判规则')}</span>
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
          <span>{t('Logistics & Freight', '物流与货运')}</span>
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
          <span>{t('Credit Shield & Security', '信用盾与安全')}</span>
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
          <span>{t('API Keys & Webhooks', 'API 密钥与 Webhook')}</span>
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
                  <span>{t('Omnichannel Social Chat & Messaging Channels API Hub', '全渠道社交会话与消息渠道 API 中心')}</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t('Click "Configure API Credentials" on any channel to enter Meta App ID, Permanent Access Token, WABA ID, and Webhook Verify Tokens.', '在任一渠道上点击「配置 API 凭据」，即可填写 Meta App ID、长期访问令牌、WABA ID 与 Webhook 验证令牌。')}
                </p>
              </div>

              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 self-start sm:self-auto">
                {t('ALL 5 CHANNELS ACTIVE', '全部 5 个渠道已启用')}
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
                      {t('LIVE CONNECTED', '已在线连接')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">{t('Meta App / Channel ID:', 'Meta App / 渠道 ID：')}</span>
                      <span className="font-bold font-mono text-[11px] truncate block text-slate-900 dark:text-white">
                        {item.appId}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 font-mono block">{t('Total Ingested Leads:', '累计入库线索：')}</span>
                      <span className="font-bold text-cyan-600 dark:text-cyan-400">
                        {item.leadsIngestedTotal.toLocaleString()} {t('leads', '条线索')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400 font-mono">{t('Last Webhook:', '最近 Webhook：')} {item.lastWebhookPing}</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setEditingChannel(item)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-cyan-500 text-white flex items-center gap-1.5 hover:bg-cyan-600 transition-all shadow-xs"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{t('Configure API', '配置 API')}</span>
                      </button>

                      <button
                        onClick={() => handleTestWebhook(item.id)}
                        disabled={syncingId === item.id}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 flex items-center gap-1.5 hover:bg-slate-100 transition-all shadow-2xs"
                      >
                        <RefreshCw className={`w-3 h-3 ${syncingId === item.id ? 'animate-spin' : ''}`} />
                        <span>{t('Test Ping', '测试连通')}</span>
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
                  <span>{t('Unified Omnichannel Webhook Listener Endpoint (Auto-Ingestion to Inbox)', '统一全渠道 Webhook 监听端点（自动入库至收件箱）')}</span>
                </span>
                <button
                  onClick={() => triggerToast(t('Webhook URL copied to clipboard!', 'Webhook URL 已复制到剪贴板！'))}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>{t('Copy', '复制')}</span>
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
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{t('Exporter Factory Profile & Licensing', '出口商工厂资料与资质')}</h2>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                {t('VERIFIED EXPORTER', '认证出口商')}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Official Company / Factory Name', '公司 / 工厂全称')}</label>
                <input
                  type="text"
                  value={factoryName}
                  onChange={(e) => setFactoryName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Unified Social Credit Code (China Tax ID)', '统一社会信用代码（中国税号）')}</label>
                <input
                  type="text"
                  value={taxId}
                  onChange={(e) => setTaxId(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('System Base Accounting Currency', '系统记账本位币')}</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none">
                  <option>{t('USD ($) - United States Dollar (Default Base)', '美元（$）- 美元（默认本位币）')}</option>
                  <option>{t('EUR (€) - Eurozone Settlement Currency', '欧元（€）- 欧元区结算货币')}</option>
                  <option>{t('GBP (£) - British Pound Sterling', '英镑（£）- 英国英镑')}</option>
                  <option>{t('CNY (¥) - Chinese Yuan Renminbi Direct', '人民币（¥）- 人民币直接结算')}</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Main Manufacturing Category', '主营制造品类')}</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none">
                  <option>{t('Eco Wooden Toys & Child Montessori Goods', '环保木制玩具与儿童蒙台梭利产品')}</option>
                  <option>{t('High-Tech Electronics & Machinery', '高科技电子与机械设备')}</option>
                  <option>{t('Solar PV & Energy Storage', '光伏与储能产品')}</option>
                  <option>{t('Apparel, Footwear & Textiles', '服装、鞋履与纺织品')}</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => triggerToast(t('Manufacturer Profile details saved!', '制造商资料已保存！'))}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                {t('Save Factory Profile', '保存工厂资料')}
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
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{t('AI Chatbot Profile & Persona Builder', 'AI 聊天机器人画像与人设构建')}</h2>
                  <p className="text-xs text-slate-400">{t('Configure your storefront AI consultant name, tone, role, and human escalation triggers', '配置店铺端 AI 顾问的姓名、语调、职位与人工升级触发条件')}</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300">
                {t('DEEPSEEK AI INTEGRATED', '已集成 DeepSeek AI')}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Chatbot / Agent Name', '聊天机器人 / 智能体名称')}</label>
                <input
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  placeholder={t('e.g. Sarah Chen', '例如：Sarah Chen')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Agent Official Title / Role', '智能体官方职位 / 角色')}</label>
                <input
                  type="text"
                  value={botRole}
                  onChange={(e) => setBotRole(e.target.value)}
                  placeholder={t('e.g. Senior Export Account Director', '例如：高级出口客户总监')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Conversational Tone', '会话语调')}</label>
                <select
                  value={botTone}
                  onChange={(e) => setBotTone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none focus:border-cyan-500"
                >
                  <option value="warm_professional">{t('Warm, Natural & Professional (Recommended)', '温暖、自然与专业（推荐）')}</option>
                  <option value="luxury_executive">{t('High-End Luxury Concierge', '高端奢华礼宾式')}</option>
                  <option value="friendly_casual">{t('Friendly & Approachable Retailer', '友好亲和的零售商式')}</option>
                  <option value="direct_b2b">{t('Direct Factory Wholesale / Technical', '直接工厂批发 / 技术式')}</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  {t('Auto-Escalate to Human Agent After (Complex Inquiries)', '复杂问询转人工条件')}
                </label>
                <select
                  value={autoEscalateAfter}
                  onChange={(e) => setAutoEscalateAfter(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                >
                  <option value="1">{t('Instant Escalation on Custom OEM / Tooling', '定制 OEM / 模具问询即时转人工')}</option>
                  <option value="3">{t('After 3 Unresolved Technical Questions', '3 个技术问题未解决后转人工')}</option>
                  <option value="manual">{t('Only on Explicit Buyer Request ("Human / Manager")', '仅买家明确要求时（"人工 / 经理"）')}</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  {t('Sample Policy Offer in Chat', '会话中的样品政策')}
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
                      {t('Enable "Free Quality Samples (Freight Collect)"', '启用「免费品质样品（运费到付）」')}
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
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{t('AI Autonomous Negotiation & Shipping Constraints', 'AI 自主谈判与发货约束')}</h2>
                  <p className="text-xs text-slate-400">{t('Set hard financial guardrails for automatic quoting, discount margins, and shipment deadlines', '为自动报价、折扣幅度与发货截止日期设定硬性财务护栏')}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  {t('Target Profit Margin Floor (%)', '目标利润率下限（%）')}
                </label>
                <input
                  type="number"
                  value={minMargin}
                  onChange={(e) => setMinMargin(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">{t('Bot will never quote below this margin', '机器人报价不会低于此利润率')}</span>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  {t('Max Autonomous Discount (%)', '最大自主折扣（%）')}
                </label>
                <input
                  type="number"
                  value={maxDiscount}
                  onChange={(e) => setMaxDiscount(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">{t('Maximum tier-2 volume discount allowed', '允许的二级阶梯量价折扣上限')}</span>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  {t('Max Production Lead Time (Days)', '最大生产交期（天）')}
                </label>
                <input
                  type="number"
                  value={maxShipmentDays}
                  onChange={(e) => setMaxShipmentDays(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">{t('Maximum promised manufacturing days', '承诺的最大生产天数')}</span>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                  {t('Sample Dispatch Lead Time (Days)', '样品发货交期（天）')}
                </label>
                <input
                  type="number"
                  value={sampleDispatchDays}
                  onChange={(e) => setSampleDispatchDays(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none focus:border-purple-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">{t('Promised courier dispatch time', '承诺的快递发货时间')}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Default International Incoterms', '默认国际贸易术语')}</label>
                <select
                  value={defaultIncoterms}
                  onChange={(e) => setDefaultIncoterms(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                >
                  <option value="FOB Shanghai (CNSHA)">{t('FOB Shanghai (CNSHA)', 'FOB 上海（CNSHA）')}</option>
                  <option value="FOB Ningbo (CNNGB)">{t('FOB Ningbo (CNNGB)', 'FOB 宁波（CNNGB）')}</option>
                  <option value="CIF Rotterdam">{t('CIF Rotterdam (NLRTM)', 'CIF 鹿特丹（NLRTM）')}</option>
                  <option value="CIF Los Angeles">{t('CIF Los Angeles (USLAX)', 'CIF 洛杉矶（USLAX）')}</option>
                  <option value="DDP Delivered Duty Paid">{t('DDP Delivered Duty Paid', 'DDP 完税后交货')}</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Standard Payment Terms', '标准付款条款')}</label>
                <select
                  value={paymentTerm}
                  onChange={(e) => setPaymentTerm(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                >
                  <option value="30/70 T/T Split">{t('30% Deposit / 70% Against B/L Copy (T/T)', '30% 预付 / 70% 凭提单副本（T/T）')}</option>
                  <option value="100% Irrevocable L/C at Sight">{t('100% Irrevocable L/C at Sight', '100% 不可撤销即期信用证')}</option>
                  <option value="OA 60 Days with Sinosure">{t('OA 60 Days (Sinosure Insured)', 'OA 60 天（信保承保）')}</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => triggerToast(t(`AI Chatbot rules saved! Bot: ${botName} (${botRole}), Max Discount: ${maxDiscount}%, Max Lead Time: ${maxShipmentDays} days.`, `AI 聊天机器人规则已保存！机器人：${botName}（${botRole}），最大折扣：${maxDiscount}%，最大交期：${maxShipmentDays} 天。`))}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold text-xs shadow-md transition-all"
              >
                {t('Save Chatbot & Negotiation Rules', '保存聊天机器人与谈判规则')}
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
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{t('Ocean Freight Defaults & Carrier Integrations', '海运默认设置与承运人集成')}</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Preferred Ocean Carrier', '首选海运承运人')}</label>
                <select
                  value={preferredCarrier}
                  onChange={(e) => setPreferredCarrier(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                >
                  <option value="COSCO Shipping">{t('COSCO Shipping (Direct Terminal Line)', '中远海运（直达干线）')}</option>
                  <option value="Maersk Line">{t('Maersk Line (Spot Integrated)', '马士基航运（现货接入）')}</option>
                  <option value="MSC Mediterranean">{t('MSC Mediterranean Shipping', 'MSC 地中海航运')}</option>
                  <option value="CMA CGM Group">{t('CMA CGM Group', '达飞轮船集团')}</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Primary Export Loading Port (POL)', '主出口装运港（POL）')}</label>
                <input
                  type="text"
                  defaultValue="Ningbo-Zhoushan Port (CNNGB) / Shanghai Port (CNSHA)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => triggerToast(t('Logistics carrier defaults and port configurations saved!', '物流承运人默认设置与港口配置已保存！'))}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                {t('Save Logistics Settings', '保存物流设置')}
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
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{t('Credit Shield & Sinosure Risk Scoring', '信用盾与中信保风险评分')}</h2>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">{t('Minimum Buyer Credit Score for L/C Approval', 'L/C 审批最低买家信用分')}</label>
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
                  {t('Automated Wire Sanction & Entity List Screening', '电汇制裁与实体清单自动筛查')}
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {t('Real-time screening against OFAC, EU, UN, and US Department of Commerce entity lists before accepting T/T wire transfers.', '在接受 T/T 电汇前，实时比对 OFAC、欧盟、联合国与美国商务部实体清单。')}
                </p>
              </div>
            </div>

            <button
              onClick={() => triggerToast(t('Credit Shield risk thresholds saved!', '信用盾风险阈值已保存！'))}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              {t('Save Security Rules', '保存安全规则')}
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
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">{t('API Integration Keys & Notifications', 'API 集成密钥与通知')}</h2>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-500" />
                  {t('XiSync Production Live API Key', 'XiSync 生产环境正式 API Key')}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    defaultValue="xi_live_98412849128491284912"
                    readOnly
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 font-mono font-bold text-slate-900 dark:text-white outline-none"
                  />
                  <button
                    onClick={() => triggerToast(t('API Key copied to clipboard!', 'API Key 已复制到剪贴板！'))}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    {t('Copy Key', '复制密钥')}
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="font-bold text-slate-900 dark:text-white">{t('Omnichannel Lead Webhook Triggers', '全渠道线索 Webhook 触发器')}</div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {t('Instant webhook alerts dispatched for Meta Ads, Google Search inquiries, and WhatsApp Direct buyer leads.', '为 Meta 广告、Google 搜索询盘与 WhatsApp 直连买家线索即时派发 Webhook 提醒。')}
                </p>
              </div>
            </div>

            <button
              onClick={() => triggerToast(t('Notification settings updated!', '通知设置已更新！'))}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              {t('Save API Preferences', '保存 API 偏好')}
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
                    {t('Configure', '配置')} {editingChannel.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('Enter Meta Cloud API credentials, webhook verification tokens, and Phone IDs', '填写 Meta Cloud API 凭据、Webhook 验证令牌与 Phone ID')}
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
                <label className="font-bold text-slate-500 block mb-1">{t('Account / Display Name', '账户 / 显示名称')}</label>
                <input
                  type="text"
                  value={editingChannel.accountName}
                  onChange={(e) => setEditingChannel({ ...editingChannel, accountName: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-500 block mb-1">{t('Meta App ID / Client ID', 'Meta App ID / 客户端 ID')}</label>
                  <input
                    type="text"
                    value={editingChannel.appId}
                    onChange={(e) => setEditingChannel({ ...editingChannel, appId: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold outline-none"
                  />
                </div>

                {editingChannel.channel === 'whatsapp' ? (
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">{t('Phone Number ID (Meta WABA)', 'Phone Number ID（Meta WABA）')}</label>
                    <input
                      type="text"
                      value={editingChannel.phoneNumberId || '108472910482910'}
                      onChange={(e) => setEditingChannel({ ...editingChannel, phoneNumberId: e.target.value })}
                      placeholder={t('e.g. 108472910482910', '例如：108472910482910')}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold outline-none"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="font-bold text-slate-500 block mb-1">{t('Webhook Secret / App Secret', 'Webhook Secret / 应用密钥')}</label>
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
                    <label className="font-bold text-slate-500 block mb-1">{t('WhatsApp Business Account ID (WABA ID)', 'WhatsApp 商业账户 ID（WABA ID）')}</label>
                    <input
                      type="text"
                      value={editingChannel.wabaId || 'waba_994810293847'}
                      onChange={(e) => setEditingChannel({ ...editingChannel, wabaId: e.target.value })}
                      placeholder={t('e.g. waba_994810293847', '例如：waba_994810293847')}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-slate-500 block mb-1">{t('Webhook Secret', 'Webhook Secret')}</label>
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
                <label className="font-bold text-slate-500 block mb-1">{t('Meta System User Permanent Access Token (Bearer)', 'Meta 系统用户长期访问令牌（Bearer）')}</label>
                <input
                  type="password"
                  value={editingChannel.permanentAccessToken || 'EAAG94810...x9841zK9'}
                  onChange={(e) => setEditingChannel({ ...editingChannel, permanentAccessToken: e.target.value })}
                  placeholder="EAAG..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-medium outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">{t('Webhook Verify Token (Enter in Meta Developer App)', 'Webhook 验证令牌（在 Meta 开发者应用中填写）')}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={editingChannel.webhookVerifyToken || 'xisync_webhook_verify_token_2026'}
                    readOnly
                    className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 font-mono font-bold outline-none text-slate-500"
                  />
                  <button
                    type="button"
                    onClick={() => triggerToast(t('Verify Token copied to clipboard!', '验证令牌已复制到剪贴板！'))}
                    className="px-3 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs"
                  >
                    {t('Copy Token', '复制令牌')}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-cyan-900 dark:text-cyan-200 text-xs space-y-1">
                <div className="font-extrabold flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-cyan-500" />
                  {t('Meta Webhook Callback URL:', 'Meta Webhook 回调 URL：')}
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
                  {t('Cancel', '取消')}
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-extrabold text-xs shadow-md"
                >
                  {t('Save API Credentials', '保存 API 凭据')}
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
