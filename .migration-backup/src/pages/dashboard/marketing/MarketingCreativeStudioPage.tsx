import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../../lib/i18n';
import { useTheme } from '../../../lib/theme-context';
import { mockCreatives } from '../../../lib/mockMarketingData';
import { Button } from '../../../components/ui/Button';
import { VeoSettingsModal } from '../../../components/videoStudio/VeoSettingsModal';
import { AdVideoPlayer } from '../../../components/videoStudio/AdVideoPlayer';
import { VeoSettingsService } from '../../../lib/services/videoStudio/veoSettings';
import { VeoVideoGenerationService } from '../../../lib/services/videoStudio/veoVideoService';
import { CatalogRepository } from '../../../lib/services/marketplace/catalogRepository';
import {
  VIDEO_AD_FORMATS,
  VIDEO_TREND_ANGLES,
  VIDEO_PLATFORM_PROFILES,
  EXPORT_HOOK_TEMPLATES,
  formatById,
  angleById,
  aspectRatioFor,
  buildShotScripts,
} from '../../../lib/services/videoStudio/promptLibrary';
import type {
  VideoAdFormatId,
  VideoAdJob,
  VideoAdPlatform,
  VideoGenerationResult,
  VideoTrendAngleId,
  VideoAspectRatio,
} from '../../../types/videoStudio';
import {
  CheckCircle,
  Copy,
  Image as ImageIcon,
  Video,
  Wand2,
  Check,
  Film,
  Settings2,
  Sparkles,
  Play,
  Download,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Search,
  ShieldCheck,
  Sparkle,
  Flame,
  Trash2,
} from 'lucide-react';

export function MarketingCreativeStudioPage() {
  const { language } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const navigate = useNavigate();

  // Active top-level tab
  const [activeTab, setActiveTab] = useState<'video_studio' | 'copy_translator' | 'compliance' | 'asset_hub'>('video_studio');

  // Product catalog & Video generation state
  const products = useMemo(() => CatalogRepository.list().filter((p) => p.status === 'ACTIVE'), []);
  const [selectedSku, setSelectedSku] = useState<string>(products[0]?.sku ?? '');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const selectedProduct = useMemo(
    () => products.find((p) => p.sku === selectedSku) ?? products[0],
    [products, selectedSku]
  );

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['ALL', ...Array.from(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.nameEn.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.nameZh.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase());
      const matchCat = selectedCategory === 'ALL' || p.category === selectedCategory;
      return matchSearch && matchCat;
    });
  }, [products, productSearch, selectedCategory]);

  // Image-to-Video (I2V) Source Frame selection
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const activeReferenceImage = selectedProduct?.imageUrls[selectedImageIndex] || selectedProduct?.imageUrls[0] || '';

  // Video Ad Recipe & Configuration
  const [formatId, setFormatId] = useState<VideoAdFormatId>('SELFIE_PRODUCT_INTRO');
  const [angleId, setAngleId] = useState<VideoTrendAngleId>('UGC_SELFIE');
  const [platform, setPlatform] = useState<VideoAdPlatform>('TIKTOK');
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('9:16');

  // Hook selection
  const [selectedHookId, setSelectedHookId] = useState<string>('FACTORY_DIRECT');
  const [customHookText, setCustomHookText] = useState<string>('');

  const activeHookTemplate = EXPORT_HOOK_TEMPLATES.find((h) => h.id === selectedHookId) || EXPORT_HOOK_TEMPLATES[0];
  const effectiveHookText = customHookText.trim() !== '' ? customHookText.trim() : (selectedProduct ? activeHookTemplate.templateEn(selectedProduct) : '');

  // Storyboard editing
  const initialScripts = useMemo(() => {
    if (!selectedProduct) return [];
    return buildShotScripts(selectedProduct, formatId, angleId, aspectRatio, effectiveHookText);
  }, [selectedProduct, formatId, angleId, aspectRatio, effectiveHookText]);

  // Generation & playback
  const [busy, setBusy] = useState(false);
  const [jobs, setJobs] = useState<VideoAdJob[]>(() => VeoVideoGenerationService.listJobs());
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Veo Settings Modal
  const [veoSettingsOpen, setVeoSettingsOpen] = useState(false);
  const [, setVeoVersion] = useState(0);

  // Copywriting tab state
  const [creatives] = useState(mockCreatives);
  const [selectedCreative, setSelectedCreative] = useState(mockCreatives[0]);
  const [activeLang, setActiveLang] = useState<'en' | 'es' | 'ar' | 'de' | 'fr'>('en');
  const [copied, setCopied] = useState(false);

  const veoConfigured = VeoSettingsService.hasApiKey();
  const currentSettings = VeoSettingsService.load();

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 6000);
  };

  const refreshJobs = (updatedJob?: VideoAdJob) => {
    const list = VeoVideoGenerationService.listJobs();
    setJobs(list);
    if (updatedJob) setActiveJobId(updatedJob.id);
  };

  const handlePlatformChange = (p: VideoAdPlatform) => {
    setPlatform(p);
    const aspect = aspectRatioFor(p);
    setAspectRatio(aspect);
  };

  const activeJob = useMemo(() => {
    if (activeJobId) {
      return jobs.find((j) => j.id === activeJobId) ?? null;
    }
    return jobs.find((j) => j.sku === selectedSku) ?? jobs[0] ?? null;
  }, [jobs, activeJobId, selectedSku]);

  const handleGenerateVideo = async () => {
    if (!selectedProduct) return;
    setBusy(true);
    showToast(
      veoConfigured
        ? `Connecting to Google Veo (${currentSettings.model}) for Image-to-Video generation...`
        : 'Starting Image-to-Video generation with product visuals & animations...',
      'info'
    );

    try {
      const result: VideoGenerationResult = await VeoVideoGenerationService.start(
        {
          sku: selectedProduct.sku,
          formatId,
          angleId,
          platform,
          referenceImageUrl: activeReferenceImage,
          customHookText: effectiveHookText,
        },
        refreshJobs
      );
      refreshJobs(result.job);
      setCurrentSegmentIndex(0);
      showToast(
        result.usedDemoSimulation
          ? `Video ad ready for ${selectedProduct.sku}!`
          : `Google Veo video ad generated successfully! (${result.message})`,
        'success'
      );
    } catch (err) {
      showToast(`Generation error: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePushToMediaBuyer = () => {
    if (!selectedProduct) return;
    showToast(
      language === 'zh'
        ? `已将产品 ${selectedProduct.sku} 与 Veo 视频广告推送到 Media Buyer 投流引擎！`
        : `Product ${selectedProduct.sku} and Veo Video Ad pushed to Media Buyer Campaign engine!`,
      'success'
    );
    navigate('/dashboard/media-buyer');
  };

  const activeFormat = formatById(formatId);
  const activeAngle = angleById(angleId);

  return (
    <div className="space-y-6">
      {/* Veo settings modal */}
      <VeoSettingsModal
        open={veoSettingsOpen}
        onClose={() => setVeoSettingsOpen(false)}
        onSaved={() => {
          setVeoVersion((v) => v + 1);
          showToast('Veo API settings saved successfully!', 'success');
        }}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl border text-xs font-bold flex items-center gap-2.5 transition-all animate-in fade-in slide-in-from-top-4 ${
            toast.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/90 dark:text-emerald-200 dark:border-emerald-800'
              : toast.type === 'error'
                ? 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/90 dark:text-red-200 dark:border-red-800'
                : 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-950/90 dark:text-blue-200 dark:border-blue-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : toast.type === 'error' ? (
            <XCircle className="w-4 h-4 text-red-500" />
          ) : (
            <Sparkles className="w-4 h-4 text-blue-500" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Header & Status Deck */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-sm">
                Google Veo 3.1 & Multimodal AI
              </span>
              <span className="text-xs font-mono text-slate-400">v2.6 Enterprise Engine</span>
            </div>
            <h1 className={`text-xl font-bold tracking-tight mt-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'zh'
                ? '出海素材工坊与 AI 视频引擎 (Creative Studio)'
                : 'Export Creative Studio & AI Video Engine'}
            </h1>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              {language === 'zh'
                ? '直接联动产品目录与 Google Veo 视频模型，一键生成 16-30 秒高转化短视频广告、多语种文案并执行合规检测'
                : 'Generate high-converting 16-30s short-form video ads directly from your product catalog with Google Veo, localize multi-lingual ad copy, and verify export ad compliance.'}
            </p>
          </div>

          {/* Veo product-video integration status & settings */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                veoConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40'
                  : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {veoConfigured
                ? `${language === 'zh' ? 'Google Veo 已连接' : 'Google Veo Connected'} (${currentSettings.model.replace('-generate-preview', '')})`
                : language === 'zh'
                  ? 'Google Veo 交互演示模式'
                  : 'Google Veo Demo Mode'}
            </span>

            <Button
              size="sm"
              variant="outline"
              icon={<Settings2 className="w-3.5 h-3.5" />}
              onClick={() => setVeoSettingsOpen(true)}
            >
              {language === 'zh' ? 'Veo API 配置' : 'Veo API Settings'}
            </Button>

            <Button
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
              onClick={() => navigate('/dashboard/media-buyer')}
            >
              {language === 'zh' ? '前往投流引擎 (Media Buyer)' : 'Go to Media Buyer'}
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/80 overflow-x-auto">
          {[
            {
              id: 'video_studio',
              icon: Film,
              label: language === 'zh' ? '🎬 产品视频广告工坊 (Google Veo)' : '🎬 AI Product Video Studio (Veo)',
              badge: `${jobs.length} Generated`,
            },
            {
              id: 'copy_translator',
              icon: Wand2,
              label: language === 'zh' ? '✍️ AI 多语种文案 & 旁白' : '✍️ AI Multilingual Ad Copy',
              badge: '5 Languages',
            },
            {
              id: 'compliance',
              icon: ShieldCheck,
              label: language === 'zh' ? '🛡️ 出海广告合规检测' : '🛡️ Export Ad Compliance Shield',
              badge: '100% Passed',
            },
            {
              id: 'asset_hub',
              icon: ImageIcon,
              label: language === 'zh' ? '🖼️ 素材库与产品媒体' : '🖼️ Synced Visual Asset Hub',
              badge: `${creatives.length} Assets`,
            },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  active
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                    active
                      ? 'bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                  }`}
                >
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: AI PRODUCT VIDEO STUDIO (GOOGLE VEO) */}
      {activeTab === 'video_studio' && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* LEFT 4 COLS: Product Selector & Recipe Configurator */}
          <div className="xl:col-span-4 space-y-6">
            {/* Step 1: Select Catalog Product */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">
                    1
                  </span>
                  <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'zh' ? '选择产品 (Catalog SKU)' : 'Select Catalog Product'}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-slate-400">
                  {filteredProducts.length} {language === 'zh' ? '个在售产品' : 'SKUs Available'}
                </span>
              </div>

              {/* Product search & filter */}
              <div className="space-y-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder={language === 'zh' ? '搜索 SKU、品名或类目...' : 'Search SKU, title or specs...'}
                    className={`w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border ${
                      isDark
                        ? 'bg-slate-900/80 border-slate-700 text-white placeholder-slate-500'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
                    } focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500`}
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                        selectedCategory === cat
                          ? 'bg-xisync-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product List Deck */}
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {filteredProducts.map((p) => {
                  const isSelected = p.sku === selectedSku;
                  return (
                    <div
                      key={p.sku}
                      onClick={() => {
                        setSelectedSku(p.sku);
                        setSelectedImageIndex(0);
                        setActiveJobId(null);
                      }}
                      className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-xisync-cyan-500 bg-xisync-cyan-50/60 dark:bg-xisync-cyan-950/40 ring-2 ring-xisync-cyan-400'
                          : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <img
                        src={p.imageUrls[0]}
                        alt={p.nameEn}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono font-extrabold text-xisync-cyan-600 dark:text-xisync-cyan-400">
                            {p.sku}
                          </span>
                          <span className="text-[11px] font-black text-slate-900 dark:text-white">
                            ${p.priceUsd.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                          {language === 'zh' ? p.nameZh : p.nameEn}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>MOQ: {p.moq} {p.unit}</span>
                          <span>·</span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                            {p.certifications.join('/')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active Product Details Badge */}
              {selectedProduct && (
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 text-[11px] space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-500 uppercase text-[10px]">
                      {language === 'zh' ? '选定产品属性' : 'Selected Product Specs'}
                    </span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 text-[10px]">
                      <CheckCircle2 className="w-3 h-3" /> HS {selectedProduct.hsCode}
                    </span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium line-clamp-2">
                    {selectedProduct.descriptionEn}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-[10px] font-bold">
                      FOB Shenzhen
                    </span>
                    {selectedProduct.targetMarkets.map((m) => (
                      <span key={m} className="px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Step 1.5: Image-to-Video (I2V) Source Frame Selection */}
            {selectedProduct && selectedProduct.imageUrls.length > 0 && (
              <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-3`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-xisync-cyan-500" />
                    <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {language === 'zh' ? '图生视频 (I2V) 起始首帧' : 'I2V Starting Source Frame'}
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                    Seed Frame (0.0s)
                  </span>
                </div>

                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {language === 'zh'
                    ? '选择图生视频的产品首帧角度。Google Veo 将基于此图片直接生成连续动态视频：'
                    : 'Select the product image angle for Image-to-Video generation. Google Veo initiates motion directly from this frame:'}
                </p>

                <div className="grid grid-cols-3 gap-2 pt-1">
                  {selectedProduct.imageUrls.map((url, idx) => {
                    const isSelected = selectedImageIndex === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all group ${
                          isSelected
                            ? 'border-xisync-cyan-500 ring-2 ring-xisync-cyan-400 shadow-md'
                            : 'border-slate-200 dark:border-slate-700 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute bottom-1 left-1 px-1 rounded bg-black/75 text-white text-[9px] font-mono font-bold">
                          Angle {idx + 1}
                        </span>
                        {isSelected && (
                          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-xisync-cyan-500 text-white flex items-center justify-center text-[10px] font-bold">
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 2: High-Converting Hook Selector */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-500" />
                  <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'zh' ? '爆款黄金 3 秒钩子 (Opening Hook)' : 'Viral Opening Hook'}
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                  {language === 'zh' ? '完播率核心' : '80% ROAS Impact'}
                </span>
              </div>

              <div className="space-y-2">
                {EXPORT_HOOK_TEMPLATES.map((hook) => {
                  const isSelected = selectedHookId === hook.id;
                  return (
                    <button
                      key={hook.id}
                      type="button"
                      onClick={() => {
                        setSelectedHookId(hook.id);
                        setCustomHookText('');
                      }}
                      className={`w-full p-2.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30 ring-1 ring-amber-400'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {language === 'zh' ? hook.nameZh : hook.name}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                      </div>
                      <p className="text-[11px] italic text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        “{language === 'zh' ? hook.templateZh(selectedProduct) : hook.templateEn(selectedProduct)}”
                      </p>
                    </button>
                  );
                })}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-500 mb-1">
                  {language === 'zh' ? '自定义首句台词 (Editable Script Line)' : 'Custom Editable Opening Line'}
                </label>
                <textarea
                  value={customHookText}
                  onChange={(e) => setCustomHookText(e.target.value)}
                  placeholder={language === 'zh' ? activeHookTemplate.templateZh(selectedProduct) : activeHookTemplate.templateEn(selectedProduct)}
                  rows={2}
                  className={`w-full p-2.5 text-xs rounded-xl border ${
                    isDark ? 'bg-slate-900 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  } resize-none`}
                />
              </div>
            </div>

            {/* Step 3: Video Recipe & Storyboard Format */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">
                    3
                  </span>
                  <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'zh' ? '广告剧本模式 (Video Format)' : 'Video Recipe Format'}
                  </h3>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                  {activeFormat.shots} Shots · {activeFormat.shots * 8}s Ad
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {VIDEO_AD_FORMATS.map((f) => {
                  const isSelected = f.id === formatId;
                  return (
                    <div
                      key={f.id}
                      onClick={() => setFormatId(f.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-xisync-cyan-500 bg-xisync-cyan-50/60 dark:bg-xisync-cyan-950/40 ring-2 ring-xisync-cyan-400'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-base">{f.emoji}</span>
                        <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                          {f.shots * 8}s
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white mt-1">
                        {language === 'zh' ? f.labelZh : f.label}
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                        {language === 'zh' ? f.descriptionZh : f.description}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Platform, Aspect Ratio & Trend Angle */}
            <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">
                    3
                  </span>
                  <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'zh' ? '投放平台与画幅风格' : 'Platform & Style Angle'}
                  </h3>
                </div>
              </div>

              {/* Ad Surface & Aspect Ratio */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  {language === 'zh' ? '目标投放渠道 (Target Surface)' : 'Target Ad Surface'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VIDEO_PLATFORM_PROFILES.map((p) => {
                    const isSelected = p.id === platform;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePlatformChange(p.id)}
                        className={`p-2 rounded-xl text-left border transition-all ${
                          isSelected
                            ? 'border-xisync-cyan-500 bg-xisync-cyan-50/60 dark:bg-xisync-cyan-950/40 text-slate-900 dark:text-white ring-1 ring-xisync-cyan-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <div className="text-xs font-bold">{p.label}</div>
                        <div className="text-[10px] font-mono text-xisync-cyan-600 dark:text-xisync-cyan-400 mt-0.5">
                          {p.aspectRatio} · {p.tip}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Trend Style Angle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                  {language === 'zh' ? '创意视觉角度 (Creative Angle)' : 'Creative Style Directive'}
                </label>
                <select
                  value={angleId}
                  onChange={(e) => setAngleId(e.target.value as any)}
                  className={`w-full px-3 py-2 text-xs rounded-xl border ${
                    isDark
                      ? 'bg-slate-900/80 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500 font-medium`}
                >
                  {VIDEO_TREND_ANGLES.map((a) => (
                    <option key={a.id} value={a.id}>
                      {language === 'zh' ? a.labelZh : a.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400 italic">
                  “{activeAngle.styleDirective}”
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT 8 COLS: Live Storyboard, Veo Generator & High-Def Video Player */}
          <div className="xl:col-span-8 space-y-6">
            {/* Storyboard Prompts Inspector & Editor */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkle className="w-4 h-4 text-xisync-cyan-500" />
                    <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {language === 'zh' ? 'AI 视频分镜与 Veo 提示词构建器' : 'AI Storyboard & Veo Prompt Compiler'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {language === 'zh'
                      ? `针对 ${selectedProduct?.sku} 自动编译的 ${initialScripts.length} 个 8s 分镜序列`
                      : `Auto-compiled ${initialScripts.length} consecutive 8s Veo shots tailored for ${selectedProduct?.sku}`}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={<Copy className="w-3.5 h-3.5" />}
                    onClick={() => {
                      const fullScript = initialScripts
                        .map((s, i) => `Shot ${i + 1} (${s.shotLabel}):\nNarration: ${s.narration}\nVeo Prompt: ${s.prompt}`)
                        .join('\n\n');
                      handleCopyText(fullScript);
                      showToast('Full storyboard & prompts copied to clipboard!', 'success');
                    }}
                  >
                    {language === 'zh' ? '复制完整剧本' : 'Copy Full Script'}
                  </Button>

                  <Button
                    size="md"
                    loading={busy}
                    icon={<Sparkles className="w-4 h-4" />}
                    onClick={handleGenerateVideo}
                    className="bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 hover:from-xisync-blue-700 hover:to-xisync-cyan-600 text-white font-black shadow-md"
                  >
                    {language === 'zh'
                      ? `生成 ${initialScripts.length * 8} 秒 Google Veo 视频广告`
                      : `Generate ${initialScripts.length * 8}s Google Veo Video Ad`}
                  </Button>
                </div>
              </div>

              {/* Storyboard Shot Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                {initialScripts.map((shot, idx) => {
                  return (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-xl border ${
                        isDark ? 'bg-slate-900/60 border-slate-700/80' : 'bg-slate-50/80 border-slate-200/80'
                      } space-y-2`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-md bg-xisync-cyan-500/20 text-xisync-cyan-600 dark:text-xisync-cyan-400 text-xs font-black flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                            {shot.shotLabel}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-slate-400">
                          {idx * 8}s - {(idx + 1) * 8}s (8s clip)
                        </span>
                      </div>

                      <div className="text-xs italic text-slate-700 dark:text-slate-300 font-medium bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                        {shot.narration}
                      </div>

                      <details className="text-[10px]">
                        <summary className="font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400 cursor-pointer select-none">
                          Google Veo Prompt →
                        </summary>
                        <p className="mt-1 font-mono text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-100 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800 text-[10px]">
                          {shot.prompt}
                        </p>
                      </details>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Video Player & Live Generation Console */}
            <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-5`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Film className="w-4 h-4 text-xisync-blue-500" />
                  <h3 className={`text-base font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'zh' ? '视频生成与高清播放器' : 'HD Studio Video Player & Output'}
                  </h3>
                </div>

                {activeJob && (
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        activeJob.status === 'READY'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40'
                          : activeJob.status === 'FAILED'
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/40'
                            : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/40'
                      }`}
                    >
                      {activeJob.status === 'READY' ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : activeJob.status === 'FAILED' ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      )}
                      {activeJob.status} ({activeJob.generatedBy === 'GOOGLE_VEO' ? 'Google Veo' : 'Demo Simulation'})
                    </span>
                  </div>
                )}
              </div>

              {/* Video Player Display Container */}
              {activeJob && activeJob.segments.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-6">
                    <AdVideoPlayer
                      product={{
                        ...selectedProduct,
                        imageUrls: [activeReferenceImage, ...selectedProduct.imageUrls.filter((u) => u !== activeReferenceImage)],
                      }}
                      job={activeJob}
                      currentSegmentIndex={currentSegmentIndex}
                      aspectRatio={aspectRatio}
                      onSegmentChange={setCurrentSegmentIndex}
                      onDeployToMediaBuyer={() => navigate('/dashboard/media-buyer')}
                    />
                  </div>

                  {/* Player Controls & Segment Details */}
                  <div className="lg:col-span-6 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase">
                        {language === 'zh' ? '当前播放分镜' : 'Current Shot Segment'}
                      </h4>
                      <div className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                        Shot {currentSegmentIndex + 1}: {activeJob.segments[currentSegmentIndex]?.shotLabel}
                      </div>
                      <p className="text-xs italic text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                        “{activeJob.segments[currentSegmentIndex]?.narration}”
                      </p>
                    </div>

                    {/* Timeline Segment Switcher */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-500">
                        {language === 'zh' ? '分镜时间线 (Timeline)' : 'Ad Timeline (8s per clip)'}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {activeJob.segments.map((seg, i) => (
                          <button
                            key={i}
                            type="button"
                            onClick={() => setCurrentSegmentIndex(i)}
                            className={`p-2 rounded-xl text-left border transition-all ${
                              currentSegmentIndex === i
                                ? 'border-xisync-cyan-500 bg-xisync-cyan-500/10 ring-2 ring-xisync-cyan-400'
                                : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono font-extrabold">#{i + 1}</span>
                              {seg.status === 'READY' ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                              ) : seg.status === 'FAILED' ? (
                                <XCircle className="w-3 h-3 text-red-500" />
                              ) : (
                                <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                              )}
                            </div>
                            <div className="text-[10px] font-bold truncate mt-0.5 text-slate-800 dark:text-slate-200">
                              {seg.shotLabel.split('—')[0]}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Generation Log & Audit Feed */}
                    <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[10px] font-mono max-h-36 overflow-y-auto space-y-1 border border-slate-800">
                      <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
                        <span>Veo Generation Log</span>
                        <span className="text-emerald-400 font-bold">{activeJob.platform} · {activeJob.aspectRatio}</span>
                      </div>
                      {activeJob.log.map((entry, idx) => (
                        <div key={idx} className="leading-relaxed">
                          {entry}
                        </div>
                      ))}
                    </div>

                    {/* Output Actions */}
                    <div className="flex items-center gap-2 pt-2 flex-wrap">
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<Download className="w-3.5 h-3.5" />}
                        onClick={() => {
                          const currentUrl = activeJob.segments[currentSegmentIndex]?.videoUrl;
                          if (currentUrl) {
                            window.open(currentUrl, '_blank');
                            showToast('Opening video download stream...', 'info');
                          }
                        }}
                      >
                        {language === 'zh' ? '下载当前分镜 MP4' : 'Download MP4'}
                      </Button>

                      <Button
                        size="sm"
                        variant="primary"
                        icon={<Send className="w-3.5 h-3.5" />}
                        onClick={handlePushToMediaBuyer}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                      >
                        {language === 'zh' ? '一键推送到 Media Buyer 投流' : 'Deploy to Media Buyer'}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 px-4 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 flex items-center justify-center mx-auto">
                    <Film className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {language === 'zh' ? '尚未生成视频广告' : 'No Video Ads Generated Yet'}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    {language === 'zh'
                      ? '在左侧选择产品与剧本格式，点击上方“生成 Google Veo 视频广告”按钮即可启动生成。'
                      : 'Select a product and recipe format on the left, then click Generate above to create your Google Veo product ad.'}
                  </p>
                </div>
              )}
            </div>

            {/* Saved Video Ads Gallery for this SKU & Catalog */}
            {jobs.length > 0 && (
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
                <div className="flex items-center justify-between">
                  <h3 className={`text-sm font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {language === 'zh' ? '已生成的视频广告素材库' : 'Generated Video Ads Repository'} ({jobs.length})
                  </h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={<Trash2 className="w-3.5 h-3.5" />}
                    onClick={() => {
                      VeoVideoGenerationService.clearAll();
                      setJobs([]);
                      setActiveJobId(null);
                      showToast('Cleared video ad history.', 'info');
                    }}
                  >
                    {language === 'zh' ? '清空历史' : 'Clear History'}
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {jobs.map((j) => (
                    <div
                      key={j.id}
                      onClick={() => {
                        setActiveJobId(j.id);
                        setCurrentSegmentIndex(0);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        activeJobId === j.id
                          ? 'border-xisync-cyan-500 bg-xisync-cyan-50/50 dark:bg-xisync-cyan-950/40 ring-2 ring-xisync-cyan-400'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-slate-900">
                        <img
                          src={j.coverPosterUrl || 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80'}
                          alt={j.productNameEn}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <Play className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                        <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-mono font-bold">
                          {j.targetSeconds}s · {j.aspectRatio}
                        </span>
                      </div>

                      <div className="mt-2 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400">
                            {j.sku}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400">
                            {j.status}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate mt-0.5">
                          {j.productNameEn}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {j.platform} · {j.generatedBy === 'GOOGLE_VEO' ? 'Google Veo' : 'Demo'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI MULTILINGUAL AD COPY & SCRIPTS */}
      {activeTab === 'copy_translator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left List of Assets */}
          <div className="space-y-4">
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'zh' ? '素材库资源 (' : 'Synced Visual Assets ('}{creatives.length})
            </h3>
            <div className="space-y-3">
              {creatives.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedCreative(item)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-start gap-4 ${
                    selectedCreative.id === item.id
                      ? 'border-xisync-cyan-500 bg-xisync-cyan-50/50 dark:bg-xisync-cyan-950/40 ring-2 ring-xisync-cyan-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-slate-900 text-white p-1 rounded-md text-[10px]">
                      {item.type === 'video' ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-xs line-clamp-1">{item.title}</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{item.productName}</div>
                    <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-emerald-500" /> 合规检测 100%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Active Asset Detail & AI Translator */}
          <div className={`lg:col-span-2 p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{selectedCreative.title}</h2>
                <div className="text-xs text-slate-400 font-mono mt-0.5">Product ID: {selectedCreative.productId}</div>
              </div>

              <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/60 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                {language === 'zh' ? '出海广告合规通过' : 'Ad Compliance Verified'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img
                  src={selectedCreative.imageUrl}
                  alt={selectedCreative.title}
                  className="w-full h-56 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                />
                <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-700/60 text-xs">
                  <span className="font-bold text-slate-500 uppercase block mb-1">
                    {language === 'zh' ? '原始中文素材描述' : 'Original Chinese Script'}
                  </span>
                  <p className="text-slate-800 dark:text-slate-200 font-medium">{selectedCreative.originalCopyCn}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Wand2 className="w-4 h-4 text-xisync-cyan-500" />
                    {language === 'zh' ? 'AI 多语种广告文案切换' : 'AI Multi-lingual Ad Copy'}
                  </span>

                  <button
                    onClick={() => handleCopyText(selectedCreative.translatedCopies[activeLang])}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-xisync-cyan-50 text-xisync-cyan-700 dark:bg-xisync-cyan-950/60 dark:text-xisync-cyan-300 border border-xisync-cyan-200 dark:border-xisync-cyan-800/60 flex items-center gap-1 transition-all"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? (language === 'zh' ? '已复制' : 'Copied') : (language === 'zh' ? '复制文案' : 'Copy')}
                  </button>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'es', label: 'Español' },
                    { code: 'ar', label: 'العربية' },
                    { code: 'de', label: 'Deutsch' },
                    { code: 'fr', label: 'Français' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setActiveLang(l.code as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        activeLang === l.code
                          ? 'bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-700/30 text-xs leading-relaxed font-semibold text-slate-800 dark:text-slate-200">
                  {selectedCreative.translatedCopies[activeLang]}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: EXPORT AD COMPLIANCE SHIELD */}
      {activeTab === 'compliance' && (
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {language === 'zh' ? '出海跨国广告合规盾 (Global Export Ad Compliance Shield)' : 'Global Export Ad Compliance Shield'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {language === 'zh'
                  ? '自动检测广告素材与文案中的禁用词、夸大宣传、商标侵权及 FTC / CE 认证规范'
                  : 'Automated compliance screening across FTC regulations, trademark infringements, and platform policies for Google, Meta, and TikTok.'}
              </p>
            </div>
            <span className="px-3 py-1 text-xs font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> 100% Passed All Filters
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Meta / Facebook Ads Policy',
                status: 'PASSED',
                items: ['No deceptive claims', 'Image text ratio compliant', 'Landing page URL matched'],
              },
              {
                title: 'Google Ads / YouTube Spec',
                status: 'PASSED',
                items: ['16:9 / 9:16 aspect standards', 'Clear brand attribution', 'No trademark violations'],
              },
              {
                title: 'TikTok Ads B2B Guidelines',
                status: 'PASSED',
                items: ['Safe zone adherence', 'Audio licensing compliant', 'High-res video asset quality'],
              },
            ].map((rule, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">{rule.title}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {rule.status}
                  </span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-600 dark:text-slate-400">
                  {rule.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CREATIVE ASSET HUB */}
      {activeTab === 'asset_hub' && (
        <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {language === 'zh' ? '全渠道产品视觉与视频素材库' : 'Multi-Channel Visual & Video Assets'}
            </h2>
            <Button size="sm" icon={<Film className="w-3.5 h-3.5" />} onClick={() => setActiveTab('video_studio')}>
              {language === 'zh' ? '新建 Veo 视频' : 'Create Veo Video'}
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {products.map((prod) => (
              <div
                key={prod.sku}
                className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 space-y-2"
              >
                <img
                  src={prod.imageUrls[0]}
                  alt={prod.nameEn}
                  className="w-full h-36 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-mono font-bold text-xisync-cyan-600">{prod.sku}</span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{prod.nameEn}</div>
                  <div className="text-[11px] font-bold text-slate-500 mt-0.5">${prod.priceUsd.toFixed(2)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSku(prod.sku);
                    setActiveTab('video_studio');
                  }}
                  className="w-full py-1.5 rounded-lg text-xs font-bold bg-xisync-cyan-500/10 text-xisync-cyan-600 dark:text-xisync-cyan-400 hover:bg-xisync-cyan-500/20 transition-all flex items-center justify-center gap-1"
                >
                  <Sparkles className="w-3 h-3" /> {language === 'zh' ? '制作 Veo 视频广告' : 'Make Veo Ad'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
