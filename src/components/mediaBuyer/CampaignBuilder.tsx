import { useState } from 'react';
import {
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AdComplianceScreener } from '../../lib/services/mediaBuyer/complianceScreener';
import { GoogleAdsAdapter } from '../../lib/adapters/googleAds';
import { MetaAdsAdapter } from '../../lib/adapters/metaAds';
import { TikTokAdsAdapter } from '../../lib/adapters/tiktokAds';
import { ManagedCampaign, PlatformType } from '../../types/mediaBuyer';

interface CampaignBuilderProps {
  tenantId: string;
  walletBalanceUsd: number;
  onCampaignCreated: (campaign: ManagedCampaign) => void;
  onTopUpRequested: () => void;
}

export function CampaignBuilder({
  tenantId,
  walletBalanceUsd,
  onCampaignCreated,
  onTopUpRequested,
}: CampaignBuilderProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [objective, setObjective] = useState<'B2B_LEAD_GEN' | 'INQUIRY_MAX' | 'CATALOG_SALES' | 'VIDEO_VIEWS'>('B2B_LEAD_GEN');
  const [campaignName, setCampaignName] = useState('2026 EU/US Eco Toy Wholesale Direct');
  const [dailyBudget, setDailyBudget] = useState(150);
  const [totalDays, setTotalDays] = useState(30);

  // Platform Budget Distribution
  const [ratios, setRatios] = useState<Record<PlatformType, number>>({
    GOOGLE_ADS: 0.40,
    META_ADS: 0.35,
    TIKTOK_ADS: 0.25,
    LINKEDIN_ADS: 0.0,
    MICROSOFT_ADS: 0.0,
  });

  // Target Markets
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(['US', 'DE', 'FR', 'SA', 'AE']);

  // Copy & Creative
  const [chineseHeadline, setChineseHeadline] = useState('源头工厂直供：100%纯天然有机亚麻玩偶与实木蒙氏教具 (支持OEM定制)');
  const [englishHeadline, setEnglishHeadline] = useState('Factory Direct: 100% Organic Linen Plush Toys & Montessori Wooden Sets');
  const [englishDescription, setEnglishDescription] = useState('ISO 9001 certified eco toy manufacturer. Low MOQ starting at 50 pcs. Fast 3-day sample dispatch & global FOB/DDP shipping.');
  const [landingPage, setLandingPage] = useState('https://ecotoys.xisync.site/site/ecotoys');
  const [callToAction, setCallToAction] = useState('REQUEST_WHOLESALE_CATALOG');

  // AI Compliance State
  const [complianceResult, setComplianceResult] = useState(() =>
    AdComplianceScreener.evaluateAdCopy(englishHeadline, englishDescription, landingPage)
  );

  const [isDeploying, setIsDeploying] = useState(false);

  const handleCopyChange = (head: string, desc: string) => {
    setEnglishHeadline(head);
    setEnglishDescription(desc);
    const result = AdComplianceScreener.evaluateAdCopy(head, desc, landingPage);
    setComplianceResult(result);
  };

  const handleDeployCampaign = async () => {
    setIsDeploying(true);

    try {
      const google = new GoogleAdsAdapter();
      const meta = new MetaAdsAdapter();
      const tiktok = new TikTokAdsAdapter();

      // Parallel Deployment to configured platforms
      const deployPromises: Promise<any>[] = [];
      if (ratios.GOOGLE_ADS > 0) {
        deployPromises.push(
          google.deployCampaign({
            tenantId,
            campaignName,
            objective,
            dailyBudgetUsd: dailyBudget * ratios.GOOGLE_ADS,
            targetMarkets: selectedMarkets,
            targetIndustries: ['Eco Toys', 'Baby & Children'],
            headline: englishHeadline,
            description: englishDescription,
            landingPageUrl: landingPage,
            callToAction,
          })
        );
      }
      if (ratios.META_ADS > 0) {
        deployPromises.push(
          meta.deployCampaign({
            tenantId,
            campaignName,
            objective,
            dailyBudgetUsd: dailyBudget * ratios.META_ADS,
            targetMarkets: selectedMarkets,
            targetIndustries: ['Eco Toys', 'Baby & Children'],
            headline: englishHeadline,
            description: englishDescription,
            landingPageUrl: landingPage,
            callToAction,
          })
        );
      }
      if (ratios.TIKTOK_ADS > 0) {
        deployPromises.push(
          tiktok.deployCampaign({
            tenantId,
            campaignName,
            objective,
            dailyBudgetUsd: dailyBudget * ratios.TIKTOK_ADS,
            targetMarkets: selectedMarkets,
            targetIndustries: ['Eco Toys', 'Baby & Children'],
            headline: englishHeadline,
            description: englishDescription,
            landingPageUrl: landingPage,
            callToAction,
          })
        );
      }

      await Promise.all(deployPromises);

      const newCampaign: ManagedCampaign = {
        id: `camp-${Date.now()}`,
        tenantId,
        name: campaignName,
        objective,
        targetMarkets: selectedMarkets,
        targetIndustries: ['Eco Toys', 'Baby & Children'],
        dailyBudgetUsd: dailyBudget,
        totalBudgetUsd: dailyBudget * totalDays,
        spentAmountUsd: 0,
        cpaTargetUsd: 15.0,
        status: 'ACTIVE',
        autoRebalanceEnabled: true,
        startDate: new Date().toISOString(),
        chineseHeadline,
        englishHeadline,
        landingPageUrl: landingPage,
        callToAction,
        complianceScore: complianceResult.score,
        complianceViolations: complianceResult.violations,
        platformRatios: ratios,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      onCampaignCreated(newCampaign);
    } catch (err) {
      console.error('Campaign deployment failed:', err);
    } finally {
      setIsDeploying(false);
    }
  };

  const totalRequiredBudget = dailyBudget * totalDays;
  const isBalanceSufficient = walletBalanceUsd >= dailyBudget * 3; // At least 3 days buffer

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden text-slate-900">
      {/* Wizard Progress Header */}
      <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-300 font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>AI Automated Multi-Channel Media Buyer</span>
          </div>
          <h2 className="text-xl font-black">创建一站式海外多渠道推广广告 (One-Click Campaign Provisioner)</h2>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {[
            { num: 1, label: '推广目标' },
            { num: 2, label: '渠道预算' },
            { num: 3, label: 'AI创意合规' },
            { num: 4, label: '即时投放' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setStep(s.num as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                step === s.num
                  ? 'bg-cyan-400 text-slate-950 shadow-xs'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              {s.num}. {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* STEP 1: OBJECTIVE & MARKETS */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">第 1 步：选择海外推广目标与国家地区</h3>
              <p className="text-xs text-slate-500">根据您的外贸出海阶段，选择以精准买家询盘为主或独立站大宗目录曝光</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'B2B_LEAD_GEN',
                  title: '海外买家 WhatsApp / 表单询盘',
                  titleEn: 'B2B Direct Inquiries',
                  desc: '高意向进口商、批发商直接通过 WhatsApp 消息或 RFQ 表单进行采购询盘。',
                  icon: '💬',
                  badge: '推荐 · 最优ROI',
                },
                {
                  id: 'INQUIRY_MAX',
                  title: '最大化询盘量 (Performance Max)',
                  titleEn: 'Inquiry Volume Maximizer',
                  desc: '基于 Google & Meta 智能竞价算法，以最低单次询盘成本获取海量潜在客户。',
                  icon: '📈',
                  badge: '高转化',
                },
                {
                  id: 'CATALOG_SALES',
                  title: '独立站样品与大宗目录采购',
                  titleEn: 'Catalog & Sample Orders',
                  desc: '直接引流至 XiSync 独立站，促进海外买家在线申请样品与生成 Proforma 订单。',
                  icon: '🧸',
                  badge: '闭环出单',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setObjective(item.id as any)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                    objective === item.id
                      ? 'border-indigo-600 bg-indigo-50/30 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="absolute top-3 right-3 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                    {item.badge}
                  </span>
                  <div className="text-3xl mb-3">{item.icon}</div>
                  <div className="font-extrabold text-sm text-slate-900">{item.title}</div>
                  <div className="text-xs text-indigo-600 font-mono font-semibold mb-2">{item.titleEn}</div>
                  <div className="text-xs text-slate-500 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
              <div>
                <label className="font-bold text-slate-700 block mb-1">广告系列名称 (Campaign Name)</label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">目标海外出口区域 (Target Markets)</label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['US (北美)', 'DE (德国/欧洲)', 'SA (沙特/中东)', 'AE (阿联酋)', 'BR (巴西)', 'JP (日本)'].map((m) => {
                    const code = m.slice(0, 2);
                    const isSelected = selectedMarkets.includes(code);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() =>
                          setSelectedMarkets(
                            isSelected ? selectedMarkets.filter((x) => x !== code) : [...selectedMarkets, code]
                          )
                        }
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                          isSelected
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <Button onClick={() => setStep(2)}>下一步：配置渠道预算分配 ➔</Button>
            </div>
          </div>
        )}

        {/* STEP 2: CHANNEL SELECTION & BUDGET ALLOCATION */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">第 2 步：多渠道预算分配与智能加权</h3>
              <p className="text-xs text-slate-500">支持 Google 搜索/PMax、Meta 商业广告与 TikTok 短视频海外同步投放</p>
            </div>

            {/* Daily & Total Budget Card */}
            <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">每日总预算 (Daily Budget USD)</label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={dailyBudget}
                    onChange={(e) => setDailyBudget(Math.max(20, parseInt(e.target.value) || 20))}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-indigo-200 font-mono font-bold text-sm text-slate-900 bg-white"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">约 ¥{(dailyBudget * 7.235).toFixed(0)} 人民币/天</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">计划投放周期 (Days)</label>
                <input
                  type="number"
                  value={totalDays}
                  onChange={(e) => setTotalDays(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 rounded-xl border border-indigo-200 font-mono font-bold text-sm text-slate-900 bg-white"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">总预算: ${totalRequiredBudget.toLocaleString()} USD</span>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">当前账户可用资金 (Usable Balance)</label>
                <div className="p-2.5 rounded-xl bg-white border border-indigo-200">
                  <div className="text-base font-black text-emerald-600">${walletBalanceUsd.toFixed(2)} USD</div>
                  <div className="text-[10px] text-slate-500">
                    {isBalanceSufficient ? (
                      <span className="text-emerald-600 font-bold">✓ 资金充足可直接上线</span>
                    ) : (
                      <span className="text-rose-600 font-bold">⚠️ 建议先充值补足 3 天预算</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Sliders */}
            <div className="space-y-4">
              <div className="font-bold text-xs text-slate-700">各渠道预算分配比例 (Channel Split):</div>

              {[
                {
                  platform: 'GOOGLE_ADS' as PlatformType,
                  name: 'Google Ads (Search + Performance Max)',
                  icon: '🔍',
                  share: ratios.GOOGLE_ADS,
                  color: 'accent-blue-600',
                  desc: '拦截海外买家 Google 核心商业搜索词与采购意图。',
                },
                {
                  platform: 'META_ADS' as PlatformType,
                  name: 'Meta Ads (Facebook & Instagram Feed / Reels)',
                  icon: '📱',
                  share: ratios.META_ADS,
                  color: 'accent-indigo-600',
                  desc: '针对欧美/中东批发商与企业采购负责人定向图文与视频触达。',
                },
                {
                  platform: 'TIKTOK_ADS' as PlatformType,
                  name: 'TikTok For Business (Spark Ads & Lead Gen)',
                  icon: '🎵',
                  share: ratios.TIKTOK_ADS,
                  color: 'accent-cyan-600',
                  desc: '通过工厂实拍工艺与实木玩具制造短视频获取高互动询盘。',
                },
              ].map((p) => {
                const allocated = dailyBudget * p.share;
                return (
                  <div key={p.platform} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{p.icon}</span>
                        <div>
                          <span className="font-extrabold text-slate-900">{p.name}</span>
                          <p className="text-[11px] text-slate-500">{p.desc}</p>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="font-extrabold text-sm text-indigo-600">${allocated.toFixed(1)}/天</span>
                        <span className="text-slate-400 text-[10px] ml-1.5">({(p.share * 100).toFixed(0)}%)</span>
                      </div>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={p.share}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        setRatios({ ...ratios, [p.platform]: val });
                      }}
                      className={`w-full ${p.color}`}
                    />
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                上一步
              </Button>
              <Button onClick={() => setStep(3)}>下一步：AI 创意与合规预检 ➔</Button>
            </div>
          </div>
        )}

        {/* STEP 3: CREATIVES & PRE-FLIGHT COMPLIANCE */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">第 3 步：多语种出海广告文案 & AI 广告法合规预检</h3>
              <p className="text-xs text-slate-500">智能筛查绝对化极限词、违规夸大承诺与商标侵权风险</p>
            </div>

            {/* AI Compliance Pill Card */}
            <div
              className={`p-5 rounded-2xl border flex items-start gap-4 text-xs ${
                complianceResult.isPassed
                  ? 'bg-emerald-50/60 border-emerald-200 text-emerald-950'
                  : 'bg-rose-50/60 border-rose-200 text-rose-950'
              }`}
            >
              <div className="text-2xl">
                {complianceResult.isPassed ? '🛡️' : '⚠️'}
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm">
                    {complianceResult.isPassed ? 'AI 合规体检通过 (100分)' : '检测到广告法或平台受限词 (需要修正)'}
                  </span>
                  <span className="font-mono font-extrabold px-2.5 py-0.5 rounded-full bg-white text-slate-900 text-[11px] shadow-2xs">
                    Score: {complianceResult.score}/100
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {complianceResult.isPassed
                    ? '文案已通过 Meta & Google B2B 广告政策审核，未包含违禁绝对化用词，符合出海准入标准。'
                    : '包含可能导致海外广告账户审核被拒的词汇，请点击下方“一键智能采纳”完成替换。'}
                </p>

                {complianceResult.violations.length > 0 && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-rose-200">
                    {complianceResult.violations.map((v, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white border border-rose-100 flex items-center justify-between gap-3 text-[11px]">
                        <div>
                          <strong className="text-rose-600">违规风险:</strong> {v.reason}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopyChange(v.suggestedReplacement, englishDescription)}
                          className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold whitespace-nowrap hover:bg-rose-700 shadow-2xs"
                        >
                          一键采纳合规词
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">中文核心卖点 (Chinese Master Pitch)</label>
                <input
                  type="text"
                  value={chineseHeadline}
                  onChange={(e) => setChineseHeadline(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">英文出海广告主标题 (English Ad Headline)</label>
                <input
                  type="text"
                  value={englishHeadline}
                  onChange={(e) => handleCopyChange(e.target.value, englishDescription)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-900 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">英文广告描述与采购政策 (Ad Description)</label>
                <textarea
                  rows={3}
                  value={englishDescription}
                  onChange={(e) => handleCopyChange(englishHeadline, e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 font-medium text-slate-800 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">独立站承接落地页 (Landing Page URL)</label>
                  <input
                    type="url"
                    value={landingPage}
                    onChange={(e) => setLandingPage(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 font-mono text-slate-900 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">行动号召转化按钮 (Call to Action)</label>
                  <select
                    value={callToAction}
                    onChange={(e) => setCallToAction(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 font-bold text-slate-900 outline-none"
                  >
                    <option value="REQUEST_WHOLESALE_CATALOG">索取大宗批发画册 (Request Catalog)</option>
                    <option value="CONTACT_EXPORTER_WHATSAPP">WhatsApp 业务直联 (Chat on WhatsApp)</option>
                    <option value="GET_FREE_QUALITY_SAMPLES">申请免费打样 (Free Samples)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(2)}>
                上一步
              </Button>
              <Button onClick={() => setStep(4)}>下一步：确认并即时上线 ➔</Button>
            </div>
          </div>
        )}

        {/* STEP 4: FINAL REVIEW & DEPLOY */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div>
              <h3 className="font-extrabold text-base text-slate-900 mb-1">第 4 步：最终核对与一键发布到海外广告网络</h3>
              <p className="text-xs text-slate-500">系统将自动调用 Google Ads MCC、Meta BM 及 TikTok API 完成跨平台广告组创建</p>
            </div>

            {/* Final Order Confirmation Card */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-bold text-sm text-cyan-400">{campaignName}</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 font-mono text-xs font-bold">
                  Ready to Deploy
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div>
                  <div className="text-slate-400 font-sans">每日预算</div>
                  <div className="text-base font-bold text-white">${dailyBudget} USD/天</div>
                </div>
                <div>
                  <div className="text-slate-400 font-sans">投放天数</div>
                  <div className="text-base font-bold text-white">{totalDays} 天</div>
                </div>
                <div>
                  <div className="text-slate-400 font-sans">目标国家</div>
                  <div className="text-base font-bold text-white">{selectedMarkets.join(', ')}</div>
                </div>
                <div>
                  <div className="text-slate-400 font-sans">合规体检</div>
                  <div className="text-base font-bold text-emerald-400">{complianceResult.score}分 合规</div>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
                <div className="text-slate-400">广告主标题 (Ad Headline):</div>
                <div className="font-bold text-white">{englishHeadline}</div>
                <div className="text-slate-400 pt-1">落地页: <span className="text-indigo-300 font-mono">{landingPage}</span></div>
              </div>
            </div>

            {/* Insufficient balance warning if needed */}
            {!isBalanceSufficient && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>当前账户余额为 <strong>${walletBalanceUsd.toFixed(2)} USD</strong>。为了确保广告顺利跑通前 3 天冷启动期，建议先充值人民币。</span>
                </div>
                <button
                  type="button"
                  onClick={onTopUpRequested}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold whitespace-nowrap shadow-xs"
                >
                  立即人民币充值
                </button>
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(3)}>
                上一步
              </Button>
              <Button
                onClick={handleDeployCampaign}
                disabled={isDeploying}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black px-8 shadow-md"
              >
                {isDeploying ? '正在同步分发到 Google/Meta/TikTok...' : '🚀 确认并立即上线海外广告'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
