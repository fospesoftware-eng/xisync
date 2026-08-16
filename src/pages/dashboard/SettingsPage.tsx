import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { CurrencySwitcher } from '../../components/ui/CurrencySwitcher';
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
  Percent,
  Sliders,
  Check,
  Lock,
} from 'lucide-react';

export function SettingsPage() {
  const location = useLocation();
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Sync active settings tab
  const getTabFromPath = () => {
    if (location.pathname.includes('/profile')) return 'profile';
    if (location.pathname.includes('/ai-rules')) return 'ai-rules';
    if (location.pathname.includes('/logistics-settings')) return 'logistics-settings';
    if (location.pathname.includes('/security-compliance')) return 'security-compliance';
    if (location.pathname.includes('/notifications')) return 'notifications';
    return 'workflow';
  };

  const [activeTab, setActiveTab] = useState<'workflow' | 'profile' | 'ai-rules' | 'logistics-settings' | 'security-compliance' | 'notifications'>(getTabFromPath());

  // Form states
  const [minMargin, setMinMargin] = useState('25.0');
  const [maxDiscount, setMaxDiscount] = useState('5.0');
  const [defaultIncoterms, setDefaultIncoterms] = useState('FOB Shanghai');
  const [paymentTerm, setPaymentTerm] = useState('30/70 T/T Split');
  const [minCreditScore, setMinCreditScore] = useState('75');
  const [preferredCarrier, setPreferredCarrier] = useState('COSCO Shipping');
  const [factoryName, setFactoryName] = useState('XiSync Precision Electronics Manufacturing Co., Ltd.');
  const [taxId, setTaxId] = useState('CN-91310000MA1FL4892X');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
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
                System Administration & Automation Controls
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              System Settings & Workflow Control Hub
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300 font-medium mt-0.5">
              Configure global trade workflows, AI copilot thresholds, manufacturer profiles, and security parameters
            </p>
          </div>
        </div>

        <Button
          onClick={() => triggerToast('Global System Settings & Base Currency preferences saved!')}
          icon={<Check className="w-4 h-4" />}
        >
          Save All Settings
        </Button>
      </div>

      {/* Settings Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold shadow-xs overflow-x-auto">
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
          <span>Credit Shield & Security</span>
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
          <span>API & Notifications</span>
        </button>
      </div>

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
                <CurrencySwitcher />
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  Default base system currency (USD $) used for ledger accounting & pricing benchmarks.
                </p>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Client Onboarding Default Currency</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none">
                  <option>USD ($) - US & International Standard</option>
                  <option>EUR (€) - European Union Exporters</option>
                  <option>GBP (£) - UK & Commonwealth Import Buyers</option>
                  <option>CNY (¥) - Chinese Domestic Direct Settlement</option>
                </select>
                <p className="text-[10px] text-slate-400 font-medium mt-1">
                  Assigned automatically to new international buyer accounts during client onboarding.
                </p>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Main Manufacturing Category</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none">
                  <option>High-Tech Electronics & Machinery</option>
                  <option>Solar PV & Energy Storage</option>
                  <option>Apparel, Footwear & Textiles</option>
                  <option>Precision Hardware & Automotive Parts</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Factory Location & Port Hub</label>
                <input
                  type="text"
                  defaultValue="Pudong New Area, Shanghai 201203, China (CNSHA)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                />
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

      {/* MODULE 3: AI Copilot & Pricing Negotiation Rules */}
      {activeTab === 'ai-rules' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-cyan-500" />
                  <h2 className="font-extrabold text-base text-slate-900 dark:text-white">AI Autonomous Negotiation Rules</h2>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1 flex items-center gap-1.5">
                    <Percent className="w-3.5 h-3.5 text-emerald-500" />
                    Minimum Protected Margin Floor (%)
                  </label>
                  <input
                    type="number"
                    value={minMargin}
                    onChange={(e) => setMinMargin(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-blue-500" />
                    Max Automated Discount Ceiling (%)
                  </label>
                  <input
                    type="number"
                    value={maxDiscount}
                    onChange={(e) => setMaxDiscount(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Default International Payment Term</label>
                  <select
                    value={paymentTerm}
                    onChange={(e) => setPaymentTerm(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                  >
                    <option>30/70 T/T Split (30% Deposit, 70% Bill of Lading)</option>
                    <option>L/C Irrevocable at Sight</option>
                    <option>100% Advance T/T Wire Transfer</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => triggerToast('AI Negotiation rules & margin floor updated!')}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
              >
                Save AI Pricing Rules
              </button>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Automated Imposter Counter-Offers</h3>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">Price Sensitivity Simulator</div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    AI automatically simulates buyer pushback before generating official counter-quotation PDFs.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">Incoterms Compliance</div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Auto-attaches ICC 2026 FOB/CIF clause templates tailored to US, EU, and Middle East buyers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4: Logistics & Freight Defaults Settings */}
      {activeTab === 'logistics-settings' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Ship className="w-5 h-5 text-blue-500" />
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">Global Freight Defaults & Carrier Preferences</h2>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Preferred Carrier Line</label>
                <select
                  value={preferredCarrier}
                  onChange={(e) => setPreferredCarrier(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                >
                  <option>COSCO Shipping Lines (Primary)</option>
                  <option>Maersk Ocean Line</option>
                  <option>Hapag-Lloyd Express</option>
                  <option>CMA CGM Ocean Line</option>
                </select>
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Default Departure Port</label>
                <input
                  type="text"
                  defaultValue="Shanghai Port (CNSHA) / Ningbo (CNNGB)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Default Shipping Terms</label>
                <input
                  type="text"
                  value={defaultIncoterms}
                  onChange={(e) => setDefaultIncoterms(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div>
                <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">Container Preference</label>
                <select className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white outline-none">
                  <option>40ft High Cube FCL (Full Container Load)</option>
                  <option>20ft Standard FCL</option>
                  <option>LCL Consolidated Cargo</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => triggerToast('Logistics carrier defaults updated!')}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs"
            >
              Save Logistics Defaults
            </button>
          </div>
        </div>
      )}

      {/* MODULE 5: Credit Shield & Security Compliance Settings */}
      {activeTab === 'security-compliance' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-purple-500" />
                <h2 className="font-extrabold text-base text-slate-900 dark:text-white">AI Credit Shield & Fraud Risk Safeguards</h2>
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
                  Automated Wire Sanction Screening
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

      {/* MODULE 6: API Keys & Omnichannel Notifications */}
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
