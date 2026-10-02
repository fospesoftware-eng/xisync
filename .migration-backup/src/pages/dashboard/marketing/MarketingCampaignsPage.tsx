import { useState } from 'react';
import { useI18n } from '../../../lib/i18n';
import { useTheme } from '../../../lib/theme-context';
import { mockCampaigns } from '../../../lib/mockMarketingData';
import { MarketingChannel, BuyerPersona, TargetRegion, Currency, Campaign } from '../../../types/marketing';
import { ChannelIcon } from '../../../components/ui/ChannelIcon';
import {
  Plus,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Send,
  X,
} from 'lucide-react';
import { metaAdsService } from '../../../lib/services/metaAdsService';
import { googleAdsService } from '../../../lib/services/googleAdsService';
import { tiktokAdsService } from '../../../lib/services/tiktokAdsService';

const mockProductsCatalog = [
  {
    id: 'prod-1',
    name: '500ml Vacuum Insulated Stainless Steel Bottle',
    category: 'Drinkware / Outdoor',
    fobPriceUSD: 3.85,
    moq: '500 pcs',
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80',
    descCn: '采用优质 304 双层不锈钢，长效保温保冷 24 小时。支持全彩丝印与激光雕刻 Logo。',
    descEn: 'Premium 304 double-wall stainless steel vacuum flask. Keeps drinks cold/hot for 24h. OEM custom logo supported.',
  },
  {
    id: 'prod-2',
    name: 'IP68 Waterproof Smart Fitness Tracker Watch',
    category: 'Consumer Electronics',
    fobPriceUSD: 14.50,
    moq: '200 pcs',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    descCn: '1.43寸 HD 触摸屏，支持心率血氧监测与 100+ 运动模式，提供 SDK 接口支持平台接入。',
    descEn: '1.43" HD touch screen with heart rate, SpO2 & 100+ sports modes. Full SDK integration ready.',
  },
  {
    id: 'prod-3',
    name: 'Biodegradable Eco Bamboo Fiber Dinnerware Set',
    category: 'Home & Kitchen',
    fobPriceUSD: 5.20,
    moq: '1000 sets',
    image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=600&q=80',
    descCn: '天然竹纤维压制，可生物降解环保餐具。通过 EU LFGB 与 US FDA 食品级认证。',
    descEn: 'Natural bamboo fiber composite dinnerware. 100% biodegradable, LFGB & FDA food-grade passed.',
  },
  {
    id: 'prod-4',
    name: '10kW Hybrid Three Phase Solar Inverter',
    category: 'Renewable Energy',
    fobPriceUSD: 850.00,
    moq: '10 units',
    image: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=600&q=80',
    descCn: '高转换效率智能并离网混合三相太阳能逆变器，防雷防尘耐高温，质保10年。',
    descEn: 'High efficiency smart hybrid 3-phase solar inverter. Weatherproof IP65 with 10-year factory warranty.',
  },
];

export function MarketingCampaignsPage() {
  const { language } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [campaignsList, setCampaignsList] = useState<Campaign[]>(mockCampaigns);
  const [showWizard, setShowWizard] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Wizard State
  const [selectedChannels, setSelectedChannels] = useState<MarketingChannel[]>(['meta', 'whatsapp']);
  const [selectedProductId, setSelectedProductId] = useState<string>('prod-1');
  const [buyerPersona, setBuyerPersona] = useState<BuyerPersona>('wholesalers');
  const [targetRegion, setTargetRegion] = useState<TargetRegion>('europe');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [dailyBudget, setDailyBudget] = useState<number>(300);
  const [campaignName, setCampaignName] = useState<string>('2026 Spring Global Export Promotion');
  const [chineseCopy, setChineseCopy] = useState<string>('工厂直供高质量产品，支持小批量 OEM/ODM 定制，样品免费送达，诚招全球批发商分销商合作！');
  const [aiTranslations, setAiTranslations] = useState({
    en: 'Direct factory supply of high-quality products. OEM/ODM customization supported with free sample delivery. Global wholesale & distributor inquiries welcome!',
    es: 'Suministro directo de fábrica de productos de alta calidad. Personalización OEM/ODM compatible con entrega de muestras gratis. ¡Bienvenidos distribuidores mayoristas globales!',
    ar: 'التوريد المباشر من المصنع للمنتجات عالية الجودة. يدعم تخصيص OEM / ODM مع تسليم عينات مجانية. نرحب بالوكلاء والموزعين من جميع أنحاء العالم!',
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const selectedProduct = mockProductsCatalog.find((p) => p.id === selectedProductId) || mockProductsCatalog[0];

  // Currency conversion rates
  const rates = { USD: 1, EUR: 0.92, CNY: 7.23 };
  const ConvertedDailyBudget = (dailyBudget * rates[currency]).toFixed(2);

  const handleTranslateCopy = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setAiTranslations({
        en: `Direct factory supply of ${selectedProduct.name}. OEM/ODM customization supported with free sample delivery. Global wholesale & distributor inquiries welcome!`,
        es: `Suministro directo de fábrica de ${selectedProduct.name}. Personalización OEM/ODM compatible con entrega de muestras gratis.`,
        ar: `التوريد المباشر من المصنع لـ ${selectedProduct.name}. يدعم تخصيص OEM/ODM مع تسليم عينات مجانية.`,
      });
      setIsTranslating(false);
    }, 600);
  };

  const handleToggleChannel = (channel: MarketingChannel) => {
    setSelectedChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    );
  };

  const handlePublishCampaign = async () => {
    setIsPublishing(true);

    if (selectedChannels.includes('meta')) {
      await metaAdsService.publishCampaign({ name: campaignName });
    }
    if (selectedChannels.includes('google')) {
      await googleAdsService.publishCampaign({ name: campaignName });
    }
    if (selectedChannels.includes('tiktok')) {
      await tiktokAdsService.publishCampaign({ name: campaignName });
    }

    const newCmp: Campaign = {
      id: `cmp-${Date.now()}`,
      name: campaignName,
      channels: selectedChannels,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: selectedProduct.image,
      status: 'active',
      buyerPersona,
      targetRegion,
      dailyBudget,
      totalBudget: dailyBudget * 30,
      currency,
      spend: 0,
      impressions: 0,
      clicks: 0,
      ctr: 0,
      cpl: 0,
      leadsCount: 0,
      inquiriesCount: 0,
      pipelineValue: 0,
      startDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      copywriting: {
        cn: chineseCopy,
        en: aiTranslations.en,
        es: aiTranslations.es,
        ar: aiTranslations.ar,
      },
    };

    setCampaignsList((prev) => [newCmp, ...prev]);
    setIsPublishing(false);
    setShowWizard(false);
    setCurrentStep(1);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Header */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm flex items-center justify-between`}>
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'zh' ? '出海广告系列管理 (Unified Campaign Builder)' : 'Global Marketing Campaigns'}
          </h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {language === 'zh'
              ? '跨 Meta (FB/IG)、Google、TikTok 和 WhatsApp 直发布多渠道推广，产品快速同步与 AI 多语言变现'
              : 'Multi-channel ad campaign manager with direct API publishing across Meta, Google, TikTok & WhatsApp.'}
          </p>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white shadow-md hover:opacity-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          {language === 'zh' ? '新建广告系列 Wizard' : 'Launch Campaign Wizard'}
        </button>
      </div>

      {/* Campaigns Table */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between">
          <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'zh' ? '所有已创建系列列表' : 'All Ad Campaigns'} ({campaignsList.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-bold text-slate-400 uppercase tracking-wider ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <th className="py-3 px-3">{language === 'zh' ? '系列名称' : 'Campaign Name'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '渠道' : 'Channels'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '目标客户画像' : 'Persona'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '状态' : 'Status'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '已消耗 / 日预算' : 'Spend / Daily'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '获取线索' : 'Leads'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '建立时间' : 'Created'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {campaignsList.map((c) => (
                <tr key={c.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={c.productImage}
                        alt={c.productName}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 flex-shrink-0"
                      />
                      <div>
                        <div className="font-bold text-xs">{c.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">{c.productName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-1.5">
                      {c.channels.map((ch) => (
                        <ChannelIcon key={ch} channel={ch} size="sm" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 capitalize">
                      {c.buyerPersona} ({c.targetRegion})
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className={`px-2.5 py-0.5 text-[10px] font-extrabold rounded-full uppercase border ${
                      c.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-400 border-slate-300'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-bold">
                    ${c.spend} / ${c.dailyBudget}/d {c.currency}
                  </td>
                  <td className="py-3.5 px-3 font-extrabold text-emerald-600 dark:text-emerald-400">
                    {c.leadsCount} {language === 'zh' ? '条线索' : 'leads'}
                  </td>
                  <td className="py-3.5 px-3 text-[11px] text-slate-500 dark:text-slate-400">
                    {c.startDate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Campaign Creation Wizard Modal */}
      {showWizard && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className={`w-full max-w-4xl rounded-2xl border ${isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'} shadow-2xl overflow-hidden my-8`}>
            {/* Modal Header */}
            <div className={`p-6 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center justify-between bg-gradient-to-r from-xisync-blue-900 to-xisync-cyan-900 text-white`}>
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-xisync-lime-400" />
                  {language === 'zh' ? '全渠道出海广告发布 Wizard' : 'Unified Global Campaign Creator'}
                </h2>
                <p className="text-xs text-xisync-cyan-200 mt-0.5">
                  {language === 'zh' ? `步骤 ${currentStep} / 6` : `Step ${currentStep} of 6`}
                </p>
              </div>
              <button
                onClick={() => setShowWizard(false)}
                className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress Bar */}
            <div className={`px-6 py-3 border-b ${isDark ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-200'} flex items-center justify-between text-xs font-semibold`}>
              {[
                { num: 1, label: language === 'zh' ? '选择渠道' : 'Channels' },
                { num: 2, label: language === 'zh' ? '同步产品' : 'Product' },
                { num: 3, label: language === 'zh' ? '受众定位' : 'Audience' },
                { num: 4, label: language === 'zh' ? '预算与币种' : 'Budget' },
                { num: 5, label: language === 'zh' ? 'AI 多语言文案' : 'AI Creative' },
                { num: 6, label: language === 'zh' ? '发布与同步' : 'Publish' },
              ].map((st) => (
                <div
                  key={st.num}
                  className={`flex items-center gap-1.5 ${
                    currentStep === st.num
                      ? 'text-xisync-cyan-600 dark:text-xisync-cyan-400 font-bold'
                      : currentStep > st.num
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-400'
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                      currentStep === st.num
                        ? 'bg-xisync-cyan-500 text-white'
                        : currentStep > st.num
                        ? 'bg-emerald-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                    }`}
                  >
                    {currentStep > st.num ? <Check className="w-3.5 h-3.5" /> : st.num}
                  </div>
                  <span className="hidden sm:inline">{st.label}</span>
                </div>
              ))}
            </div>

            {/* Wizard Step Body */}
            <div className="p-6 min-h-[380px] max-h-[520px] overflow-y-auto space-y-6">
              {/* Step 1: Select Channel(s) */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold">
                    {language === 'zh' ? '第一步：勾选投放海外渠道 (可多选)' : 'Step 1: Select Overseas Marketing Channels'}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {language === 'zh' ? '一键分发广告至多个平台，获客线索自动回流至统一收件箱' : 'Select channels to run your campaign concurrently.'}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
                    {[
                      { channel: 'meta' as MarketingChannel, name: 'Meta Ads', desc: 'Facebook & Instagram Feed/Stories' },
                      { channel: 'google' as MarketingChannel, name: 'Google Ads', desc: 'Google Search, Shopping & Display' },
                      { channel: 'tiktok' as MarketingChannel, name: 'TikTok Commercial', desc: 'In-Feed Video & Spark Ads' },
                      { channel: 'whatsapp' as MarketingChannel, name: 'WhatsApp Click-to-Chat', desc: 'Direct WhatsApp B2B Inquiries' },
                    ].map((item) => {
                      const isSelected = selectedChannels.includes(item.channel);
                      return (
                        <div
                          key={item.channel}
                          onClick={() => handleToggleChannel(item.channel)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all text-center flex flex-col items-center justify-between ${
                            isSelected
                              ? 'border-xisync-cyan-500 bg-xisync-cyan-50/50 dark:bg-xisync-cyan-900/30 ring-2 ring-xisync-cyan-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <ChannelIcon channel={item.channel} size="md" />
                          <div className="mt-3">
                            <div className="font-bold text-sm">{item.name}</div>
                            <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{item.desc}</div>
                          </div>
                          <div className={`mt-3 w-5 h-5 rounded-full flex items-center justify-center text-xs ${isSelected ? 'bg-xisync-cyan-500 text-white' : 'border border-gray-300'}`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Select Product from Catalog */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base font-bold">
                    {language === 'zh' ? '第二步：选择出海产品 (自动读取参数与 FOB 报价)' : 'Step 2: Select Export Product from Catalog'}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {mockProductsCatalog.map((prod) => {
                      const isSel = prod.id === selectedProductId;
                      return (
                        <div
                          key={prod.id}
                          onClick={() => setSelectedProductId(prod.id)}
                          className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-4 ${
                            isSel
                              ? 'border-xisync-cyan-500 bg-xisync-cyan-50/50 dark:bg-xisync-cyan-900/30 ring-2 ring-xisync-cyan-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-sm line-clamp-1">{prod.name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{prod.category}</div>
                            <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                              <span className="text-emerald-600 dark:text-emerald-400">FOB: ${prod.fobPriceUSD}</span>
                              <span className="text-gray-400">MOQ: {prod.moq}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Audience & Geography */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold">
                    {language === 'zh' ? '第三步：B2B 买家画像与国家目标区域' : 'Step 3: Audience Persona & Geographic Targeting'}
                  </h3>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                      {language === 'zh' ? '选择买家类型预设 (Persona)' : 'Buyer Persona Presets'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { key: 'wholesalers', label: language === 'zh' ? '海外批发商 (Wholesalers)' : 'Wholesalers' },
                        { key: 'distributors', label: language === 'zh' ? '区域代理商 (Distributors)' : 'Distributors' },
                        { key: 'retailers', label: language === 'zh' ? '连锁零售商 (Retailers)' : 'Retailers' },
                        { key: 'oem_partners', label: language === 'zh' ? 'OEM 贴牌伙伴 (OEM Partners)' : 'OEM Partners' },
                        { key: 'importers', label: language === 'zh' ? '进出口贸易商 (Importers)' : 'Importers' },
                      ].map((p) => (
                        <button
                          key={p.key}
                          onClick={() => setBuyerPersona(p.key as BuyerPersona)}
                          className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                            buyerPersona === p.key
                              ? 'border-xisync-cyan-500 bg-xisync-cyan-50 text-xisync-cyan-800 dark:bg-xisync-cyan-900/40 dark:text-xisync-cyan-300 font-bold'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                      {language === 'zh' ? '投放目标国家与地区' : 'Target Region'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { key: 'north_america', label: '北美 (USA / Canada)' },
                        { key: 'europe', label: '欧洲 (EU & UK)' },
                        { key: 'latam', label: '拉美 (Mexico / Brazil)' },
                        { key: 'middle_east', label: '中东 (UAE / Saudi)' },
                        { key: 'southeast_asia', label: '东南亚 (ASEAN)' },
                      ].map((r) => (
                        <button
                          key={r.key}
                          onClick={() => setTargetRegion(r.key as TargetRegion)}
                          className={`p-3 rounded-xl border text-xs font-semibold transition-all ${
                            targetRegion === r.key
                              ? 'border-xisync-cyan-500 bg-xisync-cyan-50 text-xisync-cyan-800 dark:bg-xisync-cyan-900/40 dark:text-xisync-cyan-300 font-bold'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Budget & Schedule */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold">
                    {language === 'zh' ? '第四步：广告预算与多币种实时换算' : 'Step 4: Budget, Currency & Schedule'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                        {language === 'zh' ? '广告系列名称' : 'Campaign Name'}
                      </label>
                      <input
                        type="text"
                        value={campaignName}
                        onChange={(e) => setCampaignName(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                        {language === 'zh' ? '结算币种' : 'Select Currency'}
                      </label>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value as Currency)}
                        className={`w-full px-4 py-2.5 rounded-xl border outline-none text-sm font-medium ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                      >
                        <option value="USD">USD ($ - US Dollar)</option>
                        <option value="EUR">EUR (€ - Euro)</option>
                        <option value="CNY">CNY (¥ - Chinese Yuan)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">
                      {language === 'zh' ? '日均广告预算' : 'Daily Budget'} ({currency})
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min={50}
                        max={2000}
                        step={25}
                        value={dailyBudget}
                        onChange={(e) => setDailyBudget(Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-xl font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400 min-w-[100px]">
                        ${dailyBudget} / d
                      </span>
                    </div>

                    <div className="mt-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 text-xs flex items-center justify-between">
                      <span>{language === 'zh' ? '实时汇率折算:' : 'Real-time Currency Equivalent:'}</span>
                      <span className="font-bold text-gray-900 dark:text-white">
                        {ConvertedDailyBudget} {currency} ({language === 'zh' ? '月度预估:' : 'Est. Monthly:'} ${(dailyBudget * 30).toLocaleString()})
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Creative & AI Multi-lingual Copywriting */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold">
                        {language === 'zh' ? '第五步：中文广告文案及 AI 一键多语种本地化' : 'Step 5: AI Multilingual Ad Copy Generator'}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {language === 'zh' ? '自动检查合规性并将中文文案翻译成地道英文、西班牙文与阿拉伯文' : 'Translate Chinese ad copy into natural English, Spanish, and Arabic.'}
                      </p>
                    </div>
                    <button
                      onClick={handleTranslateCopy}
                      disabled={isTranslating}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-xisync-cyan-500 text-white hover:bg-xisync-cyan-600 flex items-center gap-1.5 shadow-sm"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isTranslating ? 'animate-spin' : ''}`} />
                      {language === 'zh' ? '重新生成 AI 翻译' : 'Regenerate AI Copy'}
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                      {language === 'zh' ? '原始中文广告描述' : 'Original Chinese Ad Copy'}
                    </label>
                    <textarea
                      rows={2}
                      value={chineseCopy}
                      onChange={(e) => setChineseCopy(e.target.value)}
                      className={`w-full p-3 rounded-xl border text-xs outline-none ${isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'}`}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                      <div className="flex items-center justify-between text-xs font-bold text-xisync-blue-600 dark:text-xisync-cyan-400 mb-1">
                        <span>English (Default)</span>
                        <span className="text-[10px] text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full font-normal">Compliance Check Passed 100%</span>
                      </div>
                      <p className="text-xs">{aiTranslations.en}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                      <div className="flex items-center justify-between text-xs font-bold text-xisync-blue-600 dark:text-xisync-cyan-400 mb-1">
                        <span>Español (Spanish)</span>
                      </div>
                      <p className="text-xs">{aiTranslations.es}</p>
                    </div>

                    <div className="p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                      <div className="flex items-center justify-between text-xs font-bold text-xisync-blue-600 dark:text-xisync-cyan-400 mb-1">
                        <span>العربية (Arabic)</span>
                      </div>
                      <p className="text-xs">{aiTranslations.ar}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 6: Review & Direct API Publish */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h3 className="text-base font-bold">
                    {language === 'zh' ? '第六步：确认参数并直接通过 API 发布' : 'Step 6: Review & API Direct Publish'}
                  </h3>

                  <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/40 space-y-3 text-xs">
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-500">{language === 'zh' ? '广告系列名称:' : 'Campaign Name:'}</span>
                      <span className="font-bold">{campaignName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-500">{language === 'zh' ? '投放渠道:' : 'Channels:'}</span>
                      <div className="flex items-center gap-1">
                        {selectedChannels.map((ch) => (
                          <ChannelIcon key={ch} channel={ch} size="sm" />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-500">{language === 'zh' ? '推广产品:' : 'Product:'}</span>
                      <span className="font-bold">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-gray-500">{language === 'zh' ? '目标受众与地区:' : 'Audience:'}</span>
                      <span className="font-bold capitalize">{buyerPersona} ({targetRegion})</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-gray-500">{language === 'zh' ? '每日预算:' : 'Daily Budget:'}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">${dailyBudget} / day ({currency})</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-xisync-blue-50 dark:bg-xisync-blue-900/30 border border-xisync-blue-200 dark:border-xisync-blue-700 text-xs text-xisync-blue-800 dark:text-xisync-blue-200 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 flex-shrink-0 text-xisync-blue-600 dark:text-xisync-cyan-400" />
                    <span>
                      {language === 'zh'
                        ? '系统将使用已连接的 API Token 自动在 Meta、Google 或 TikTok 后台创建广告系列与 Pixel 追踪。'
                        : 'System will use authorized API Tokens to publish campaign and attach tracking pixel automatically.'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className={`p-4 px-6 border-t ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'} flex items-center justify-between`}>
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  {language === 'zh' ? '上一步' : 'Back'}
                </button>
              ) : (
                <div />
              )}

              {currentStep < 6 ? (
                <button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white shadow-md hover:opacity-95 flex items-center gap-1.5"
                >
                  {language === 'zh' ? '下一步' : 'Next Step'}
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handlePublishCampaign}
                  disabled={isPublishing}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg flex items-center gap-2"
                >
                  <Send className={`w-4 h-4 ${isPublishing ? 'animate-bounce' : ''}`} />
                  {isPublishing
                    ? language === 'zh' ? '发布中 API 通讯...' : 'Publishing via API...'
                    : language === 'zh' ? '确认并一键 API 发布' : 'Direct API Publish Now'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
