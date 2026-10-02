import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { StatsCard } from '../../components/dashboard/StatsCard';
import {
  Sparkles,
  Bot,
  TrendingUp,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Zap,
  CheckCircle2,
  Lock,
  Factory,
  Globe,
  Scale,
  Percent,
  Check,
} from 'lucide-react';

export function AICopilotPage() {
  const location = useLocation();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [selectedMoq, setSelectedMoq] = useState(5000);
  const [rawMaterialPrice, setRawMaterialPrice] = useState(12.5);
  const [calculatedMargin, setCalculatedMargin] = useState(28.4);
  const [recommendedPrice, setRecommendedPrice] = useState(18.2);

  // Re-calculate margins dynamically based on raw material cost & MOQ
  useEffect(() => {
    const baseMargin = 32.0;
    const moqDiscount = Math.min((selectedMoq / 10000) * 4, 6);
    const materialImpact = (rawMaterialPrice - 10) * 0.8;
    const finalMargin = (baseMargin - materialImpact - moqDiscount).toFixed(1);
    const finalPrice = ((rawMaterialPrice * 1.25) / (1 - parseFloat(finalMargin) / 100)).toFixed(2);
    setCalculatedMargin(parseFloat(finalMargin));
    setRecommendedPrice(parseFloat(finalPrice));
  }, [selectedMoq, rawMaterialPrice]);

  // Sync sub-menu state with location path
  const getTabFromPath = () => {
    if (location.pathname.includes('/forecast')) return 'forecast';
    if (location.pathname.includes('/credit-shield')) return 'credit-shield';
    return 'negotiation';
  };

  const [activeTab, setActiveTab] = useState<'negotiation' | 'forecast' | 'credit-shield'>(getTabFromPath());

  useEffect(() => {
    setActiveTab(getTabFromPath());
  }, [location.pathname]);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const isUltra = location.pathname.startsWith('/dashboard/ultra');
  const basePath = isUltra ? '/dashboard/ultra/ai-copilot' : '/dashboard/ai-copilot';

  const copilotStats = [
    { title: 'AI Deals Negotiated', value: '$847,200', change: 18.5, icon: <Bot className="w-5 h-5" />, iconColor: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400' },
    { title: 'Avg Margin Protected', value: '28.4%', change: 4.2, icon: <Percent className="w-5 h-5" />, iconColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400' },
    { title: 'Idle Factory Matched', value: '8,500 Units', change: 12.1, icon: <Factory className="w-5 h-5" />, iconColor: 'bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400' },
    { title: 'Credit Shield Intercepts', value: '12 Fraud Alerts', change: -15, icon: <ShieldCheck className="w-5 h-5" />, iconColor: 'bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400' },
  ];

  return (
    <div className="space-y-6 text-slate-900 dark:text-white bg-slate-50/60 dark:bg-transparent p-2 md:p-4 rounded-3xl min-h-screen">
      {/* Executive Copilot Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-md">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Autonomous Trade Intelligence
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Autonomous AI Trade Copilot
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300 font-medium mt-0.5">
              Automated B2B negotiation, predictive international demand forecasting, and credit risk safeguards
            </p>
          </div>
        </div>

        <Button
          onClick={() => triggerToast('AI Negotiation Copilot is actively monitoring live buyer chats!')}
          icon={<Bot className="w-4 h-4" />}
        >
          Activate Copilot
        </Button>
      </div>

      {/* Stats Deck */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {copilotStats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      {/* Sub-Navigation Menu Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold shadow-xs overflow-x-auto">
        <Link
          to={`${basePath}/negotiation`}
          onClick={() => setActiveTab('negotiation')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'negotiation'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>AI Autonomous Negotiation</span>
        </Link>

        <Link
          to={`${basePath}/forecast`}
          onClick={() => setActiveTab('forecast')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'forecast'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Predictive Demand Forecast</span>
        </Link>

        <Link
          to={`${basePath}/credit-shield`}
          onClick={() => setActiveTab('credit-shield')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'credit-shield'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-bold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>AI Credit & Fraud Shield</span>
        </Link>
      </div>

      {/* MODULE 1: AI Autonomous Negotiation */}
      {activeTab === 'negotiation' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Feature 1: Optimal Pricing Engine (Interactive Calculator) */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xisync-cyan-600">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white">Optimal Pricing & Margin Engine</h2>
                    <span className="text-xs text-slate-400 font-medium">Dynamic deal margin calculator based on raw materials & MOQ</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  REAL-TIME BENCHMARK
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                      Raw Material Index Cost ($ / kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={rawMaterialPrice}
                      onChange={(e) => setRawMaterialPrice(parseFloat(e.target.value) || 0)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                      Order MOQ Volume (Units)
                    </label>
                    <select
                      value={selectedMoq}
                      onChange={(e) => setSelectedMoq(parseInt(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none"
                    >
                      <option value={1000}>1,000 Units (Sample MOQ)</option>
                      <option value={5000}>5,000 Units (Standard MOQ)</option>
                      <option value={20000}>20,000 Units (Wholesale Container)</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Recommended Unit Price</span>
                    <div className="text-3xl font-black font-mono text-cyan-400">${recommendedPrice} / unit</div>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
                    <span className="text-slate-400 font-medium">Calculated Profit Margin:</span>
                    <span className="font-mono font-bold text-emerald-400">{calculatedMargin}%</span>
                  </div>

                  <button
                    onClick={() => triggerToast(`Applied unit price $${recommendedPrice} to live buyer offer!`)}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-bold text-xs shadow-xs"
                  >
                    Apply Price to Live Offer
                  </button>
                </div>
              </div>
            </div>

            {/* Feature 2: Auto Counter-Offers & Imposter Protection */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Imposter Protection & Terms</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
                  PASSED
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-500" />
                    Buyer Price Sensitivity Simulation
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Simulated ABC Corp price elasticity: Buyer expected tolerance is <strong>$17.80 - $18.50</strong> with 92% acceptance rate.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    Auto Legal B2B Contract Terms
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Drafted L/C Irrevocable @ Sight & 30/70 T/T split schedule under US Incoterms 2026.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 2: Predictive Demand Forecast */}
      {activeTab === 'forecast' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Global Demand Shortage Alerts */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-cyan-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Global Demand Shortage Alerts</h3>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { region: 'North America 🇺🇸', product: 'High-Efficiency Heat Pumps', surge: '+42% DoD', alert: 'Factory stock shortage expected in 14 days' },
                  { region: 'Western Europe 🇪🇺', product: 'Solar Inverters & Batteries', surge: '+28% DoD', alert: 'High wholesale demand from German buyers' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-cyan-50/70 dark:bg-slate-950/70 border border-cyan-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{item.region}</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-mono">{item.surge}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 font-medium">{item.product}</div>
                    <div className="text-[10px] text-slate-400">{item.alert}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Idle Capacity Factory Matching */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-blue-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Idle Production Capacity Matcher</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>Factory Line #3 (Idle Feb 10 - Feb 25)</span>
                  <span className="text-emerald-600 font-bold">MATCH FOUND</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  AI automatically linked unallocated production capacity with verified wholesale RFQ from <strong>Global Trade UK (8,500 Units)</strong>.
                </p>
                <button
                  onClick={() => triggerToast('Production Line #3 successfully locked for Global Trade UK RFQ!')}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  Accept & Allocate Line #3
                </button>
              </div>
            </div>

            {/* Dynamic Seasonal Price Shifts */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Dynamic Seasonal Price Shifts</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">Spring Buyer Peak Season</div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  Recommending +6.5% price adjustment for European buyers entering Q2 procurement cycle.
                </p>
                <div className="text-amber-600 font-mono font-bold">+6.5% Target Growth</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 3: AI Credit & Fraud Shield */}
      {activeTab === 'credit-shield' && (
        <div className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Importer Credit Scoring */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Importer Credit-Worthiness Score</h3>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { company: 'ABC Corp (USA)', score: '94 / 100 AAA', status: 'Approved for L/C 60 Days', color: 'text-emerald-600' },
                  { company: 'XYZ Ltd (UK)', score: '88 / 100 AA', status: 'Approved for 30/70 T/T', color: 'text-emerald-600' },
                  { company: 'Unknown Trade LLC', score: '42 / 100 High Risk', status: 'Require 100% Advance T/T', color: 'text-rose-600' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{item.company}</span>
                      <span className={`font-mono ${item.color}`}>{item.score}</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 font-medium">{item.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tariff Shift & Shipping Prompts */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tariff Shift & Route Prompts</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-slate-950/70 border border-amber-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  US Section 301 Tariff Update
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  New 7.5% tariff applied to direct US East Coast imports. Suggested transshipment via Mexico free trade warehouse to save <strong>$2,800 / container</strong>.
                </p>
              </div>
            </div>

            {/* Sanction & Wire Transfer Screening */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Sanction & Wire Transfer Check</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>SWIFT Wire Transfer #98412</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> CLEAN
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  Verified against OFAC, EU, and UN sanction databases. Zero compliance flag.
                </p>
              </div>
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
