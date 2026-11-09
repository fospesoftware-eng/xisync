import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { useI18n } from '../../lib/i18n';
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
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
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
    { title: t('AI Deals Negotiated', 'AI 促成谈判交易额'), value: '$847,200', change: 18.5, icon: <Bot className="w-5 h-5" />, iconColor: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950/80 dark:text-cyan-400' },
    { title: t('Avg Margin Protected', '平均利润保障'), value: '28.4%', change: 4.2, icon: <Percent className="w-5 h-5" />, iconColor: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400' },
    { title: t('Idle Factory Matched', '匹配闲置产能'), value: t('8,500 Units', '8,500 件'), change: 12.1, icon: <Factory className="w-5 h-5" />, iconColor: 'bg-blue-100 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400' },
    { title: t('Credit Shield Intercepts', '信用盾拦截'), value: t('12 Fraud Alerts', '12 条欺诈预警'), change: -15, icon: <ShieldCheck className="w-5 h-5" />, iconColor: 'bg-purple-100 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400' },
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
                {t('Autonomous Trade Intelligence', '自主贸易智能')}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t('Autonomous AI Trade Copilot', '自主 AI 贸易助手')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-300 font-medium mt-0.5">
              {t('Automated B2B negotiation, predictive international demand forecasting, and credit risk safeguards', '自动化 B2B 谈判、国际需求预测以及信用风险防护')}
            </p>
          </div>
        </div>

        <Button
          onClick={() => triggerToast(t('AI Negotiation Copilot is actively monitoring live buyer chats!', 'AI 谈判助手正在实时监控买家对话！'))}
          icon={<Bot className="w-4 h-4" />}
        >
          {t('Activate Copilot', '启动 AI 助手')}
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
          <span>{t('AI Autonomous Negotiation', 'AI 自主谈判')}</span>
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
          <span>{t('Predictive Demand Forecast', '需求预测')}</span>
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
          <span>{t('AI Credit & Fraud Shield', 'AI 信用与欺诈盾')}</span>
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
                    <h2 className="font-bold text-sm text-slate-900 dark:text-white">{t('Optimal Pricing & Margin Engine', '智能定价与利润引擎')}</h2>
                    <span className="text-xs text-slate-400 font-medium">{t('Dynamic deal margin calculator based on raw materials & MOQ', '基于原材料成本与起订量的动态利润计算器')}</span>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300">
                  {t('REAL-TIME BENCHMARK', '实时基准')}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
                  <div>
                    <label className="text-slate-500 dark:text-slate-400 font-bold block mb-1">
                      {t('Raw Material Index Cost ($ / kg)', '原材料指数成本（美元/公斤）')}
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
                      {t('Order MOQ Volume (Units)', '订单起订量（件）')}
                    </label>
                    <select
                      value={selectedMoq}
                      onChange={(e) => setSelectedMoq(parseInt(e.target.value))}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white outline-none"
                    >
                      <option value={1000}>{t('1,000 Units (Sample MOQ)', '1,000 件（样品起订）')}</option>
                      <option value={5000}>{t('5,000 Units (Standard MOQ)', '5,000 件（标准起订）')}</option>
                      <option value={20000}>{t('20,000 Units (Wholesale Container)', '20,000 件（整柜批发）')}</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t('AI Recommended Unit Price', 'AI 建议单价')}</span>
                    <div className="text-3xl font-black font-mono text-cyan-400">${recommendedPrice} {t('/ unit', '/ 件')}</div>
                  </div>

                  <div className="flex items-center justify-between text-xs border-t border-slate-800 pt-2">
                    <span className="text-slate-400 font-medium">{t('Calculated Profit Margin:', '测算利润率：')}</span>
                    <span className="font-mono font-bold text-emerald-400">{calculatedMargin}%</span>
                  </div>

                  <button
                    onClick={() => triggerToast(t(`Applied unit price $${recommendedPrice} to live buyer offer!`, `已将单价 $${recommendedPrice} 应用至买家实时报价！`))}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-bold text-xs shadow-xs"
                  >
                    {t('Apply Price to Live Offer', '应用价格至实时报价')}
                  </button>
                </div>
              </div>
            </div>

            {/* Feature 2: Auto Counter-Offers & Imposter Protection */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('Imposter Protection & Terms', '冒名防护与条款')}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300">
                  {t('PASSED', '已通过')}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-purple-500" />
                    {t('Buyer Price Sensitivity Simulation', '买家价格敏感度模拟')}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {isZh ? (
                      <>ABC 公司价格弹性模拟：买家可接受区间为 <strong>17.80 - 18.50 美元</strong>，接受率 92%。</>
                    ) : (
                      <>Simulated ABC Corp price elasticity: Buyer expected tolerance is <strong>$17.80 - $18.50</strong> with 92% acceptance rate.</>
                    )}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    {t('Auto Legal B2B Contract Terms', '自动生成 B2B 合同法律条款')}
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    {t('Drafted L/C Irrevocable @ Sight & 30/70 T/T split schedule under US Incoterms 2026.', '已依据 Incoterms 2026 起草不可撤销即期信用证及 30/70 电汇付款计划。')}
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
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('Global Demand Shortage Alerts', '全球需求短缺预警')}</h3>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {[
                  { region: 'North America 🇺🇸', product: 'High-Efficiency Heat Pumps', surge: '+42% DoD', alert: 'Factory stock shortage expected in 14 days' },
                  { region: 'Western Europe 🇪🇺', product: 'Solar Inverters & Batteries', surge: '+28% DoD', alert: 'High wholesale demand from German buyers' },
                ].map((item, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-cyan-50/70 dark:bg-slate-950/70 border border-cyan-200 dark:border-slate-800 space-y-1">
                    <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                      <span>{t(item.region, item.region === 'North America 🇺🇸' ? '北美 🇺🇸' : '西欧 🇪🇺')}</span>
                      <span className="text-cyan-600 dark:text-cyan-400 font-mono">{item.surge}</span>
                    </div>
                    <div className="text-slate-600 dark:text-slate-300 font-medium">{t(item.product, item.product === 'High-Efficiency Heat Pumps' ? '高效热泵' : '太阳能逆变器与电池')}</div>
                    <div className="text-[10px] text-slate-400">{t(item.alert, idx === 0 ? '预计 14 天后工厂库存短缺' : '德国买家批发需求旺盛')}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Idle Capacity Factory Matching */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Factory className="w-4 h-4 text-blue-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('Idle Production Capacity Matcher', '闲置产能匹配')}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{t('Factory Line #3 (Idle Feb 10 - Feb 25)', '3 号生产线（2 月 10 日 - 2 月 25 日闲置）')}</span>
                  <span className="text-emerald-600 font-bold">{t('MATCH FOUND', '已匹配')}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                  {isZh ? (
                    <>AI 已自动将闲置产能与 <strong>Global Trade UK（英国）8,500 件</strong>已验证批发询价单匹配。</>
                  ) : (
                    <>AI automatically linked unallocated production capacity with verified wholesale RFQ from <strong>Global Trade UK (8,500 Units)</strong>.</>
                  )}
                </p>
                <button
                  onClick={() => triggerToast(t('Production Line #3 successfully locked for Global Trade UK RFQ!', '3 号生产线已成功为 Global Trade UK 询价单锁定！'))}
                  className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors"
                >
                  {t('Accept & Allocate Line #3', '接受并分配 3 号线')}
                </button>
              </div>
            </div>

            {/* Dynamic Seasonal Price Shifts */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('Dynamic Seasonal Price Shifts', '季节性动态调价')}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="font-bold text-slate-900 dark:text-white">{t('Spring Buyer Peak Season', '春季采购旺季')}</div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {t('Recommending +6.5% price adjustment for European buyers entering Q2 procurement cycle.', '建议针对进入第二季度采购周期的欧洲买家上调价格 6.5%。')}
                </p>
                <div className="text-amber-600 font-mono font-bold">{t('+6.5% Target Growth', '+6.5% 目标增长')}</div>
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
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('Importer Credit-Worthiness Score', '进口商信用评分')}</h3>
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
                      <span className={`font-mono ${item.color}`}>{t(item.score, idx === 2 ? '42 / 100 高风险' : item.score)}</span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 font-medium">
                      {t(item.status, idx === 0 ? '批准 60 天信用证' : idx === 1 ? '批准 30/70 电汇' : '要求 100% 预付电汇')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tariff Shift & Shipping Prompts */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('Tariff Shift & Route Prompts', '关税变动与路线提示')}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-slate-950/70 border border-amber-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  {t('US Section 301 Tariff Update', '美国 301 关税更新')}
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {isZh ? (
                    <>美国东海岸直航进口新增 7.5% 关税。建议经墨西哥自贸仓中转，每个集装箱可节省 <strong>2,800 美元</strong>。</>
                  ) : (
                    <>New 7.5% tariff applied to direct US East Coast imports. Suggested transshipment via Mexico free trade warehouse to save <strong>$2,800 / container</strong>.</>
                  )}
                </p>
              </div>
            </div>

            {/* Sanction & Wire Transfer Screening */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-500" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{t('Sanction & Wire Transfer Check', '制裁与电汇核查')}</h3>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span>{t('SWIFT Wire Transfer #98412', 'SWIFT 电汇 #98412')}</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {t('CLEAN', '无异常')}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium">
                  {t('Verified against OFAC, EU, and UN sanction databases. Zero compliance flag.', '已通过 OFAC、欧盟及联合国制裁数据库核查，无合规风险标记。')}
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
