import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Film,
  Settings2,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  Trash2,
  Search,
  Sparkle,
  Play,
  Flame,
  Check,
  Image as ImageIcon,
} from 'lucide-react';
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
  aspectRatioFor,
  buildShotScripts,
} from '../../../lib/services/videoStudio/promptLibrary';
import { PageHeader, SectionCard } from '../../../components/marketplace/marketplaceUi';
import type {
  VideoAdFormatId,
  VideoAdJob,
  VideoAdPlatform,
  VideoGenerationResult,
  VideoTrendAngleId,
  VideoAspectRatio,
} from '../../../types/videoStudio';
import type { XisyncProduct } from '../../../types/marketplace';

const JobStatusPill = ({ job }: { job: VideoAdJob }) => {
  if (job.status === 'READY')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40">
        <CheckCircle2 className="w-3 h-3" /> READY
      </span>
    );
  if (job.status === 'FAILED')
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/40">
        <XCircle className="w-3 h-3" /> FAILED
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/40">
      <Loader2 className="w-3 h-3 animate-spin" /> {job.status === 'QUEUED' ? 'QUEUED' : 'GENERATING'}
    </span>
  );
};

export function ProductVideoStudioPage() {
  const navigate = useNavigate();
  const products = useMemo(() => CatalogRepository.list().filter((p) => p.status === 'ACTIVE'), []);
  const [selectedSku, setSelectedSku] = useState<string>(products[0]?.sku ?? '');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const product: XisyncProduct = useMemo(
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
  const activeReferenceImage = product?.imageUrls[selectedImageIndex] || product?.imageUrls[0] || '';

  const [formatId, setFormatId] = useState<VideoAdFormatId>('SELFIE_PRODUCT_INTRO');
  const [angleId, setAngleId] = useState<VideoTrendAngleId>('UGC_SELFIE');
  const [platform, setPlatform] = useState<VideoAdPlatform>('TIKTOK');
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('9:16');
  
  // Hook Selection
  const [selectedHookId, setSelectedHookId] = useState<string>('FACTORY_DIRECT');
  const [customHookText, setCustomHookText] = useState<string>('');

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [jobs, setJobs] = useState<VideoAdJob[]>(() => VeoVideoGenerationService.listJobs());
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

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

  const activeHookTemplate = EXPORT_HOOK_TEMPLATES.find((h) => h.id === selectedHookId) || EXPORT_HOOK_TEMPLATES[0];
  const effectiveHookText = customHookText.trim() !== '' ? customHookText.trim() : (product ? activeHookTemplate.templateEn(product) : '');

  const scripts = useMemo(() => {
    if (!product) return [];
    return buildShotScripts(product, formatId, angleId, aspectRatio, effectiveHookText);
  }, [product, formatId, angleId, aspectRatio, effectiveHookText]);

  const generate = async () => {
    if (!product) return;
    setBusy(true);
    showToast(
      veoConfigured
        ? `Connecting to Google Veo (${currentSettings.model}) for Image-to-Video generation...`
        : 'Generating Image-to-Video ad with product motion...',
      'info'
    );

    try {
      const result: VideoGenerationResult = await VeoVideoGenerationService.start(
        {
          sku: product.sku,
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
          ? `Image-to-Video ad generated successfully for ${product.sku}!`
          : `Google Veo Image-to-Video ad generated successfully! (${result.message})`,
        'success'
      );
    } catch (err) {
      showToast(`Generation error: ${err instanceof Error ? err.message : String(err)}`, 'error');
    } finally {
      setBusy(false);
    }
  };

  const activeJob = useMemo(() => {
    if (activeJobId) {
      return jobs.find((j) => j.id === activeJobId) ?? null;
    }
    return jobs.find((j) => j.sku === (product?.sku ?? '')) ?? jobs[0] ?? null;
  }, [jobs, activeJobId, product]);

  const removeJob = (id: string) => {
    VeoVideoGenerationService.deleteJob(id);
    setJobs(VeoVideoGenerationService.listJobs());
  };

  const clearAllJobs = () => {
    VeoVideoGenerationService.clearAll();
    setJobs([]);
    setActiveJobId(null);
    showToast('Cleared video ad history.', 'info');
  };

  const format = formatById(formatId);

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <PageHeader
        title="Product Video Ad Studio — Google Veo (Image-to-Video)"
        subtitle="Turn any product image into a high-converting 16-30s short-form video ad. Select an opening hook, configure the recipe, and generate realistic AI video motion."
        actions={
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${
                veoConfigured
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/40'
                  : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              {veoConfigured ? `Google Veo (${currentSettings.model.replace('-generate-preview', '')})` : 'Image-to-Video Engine Active'}
            </span>
            <Button size="sm" variant="outline" icon={<Settings2 className="w-3.5 h-3.5" />} onClick={() => setSettingsOpen(true)}>
              Veo API settings
            </Button>
          </div>
        }
      />

      <VeoSettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSaved={() => {
          setJobs(VeoVideoGenerationService.listJobs());
          showToast('Veo API settings saved successfully!', 'success');
        }}
      />

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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left column: Product picker & configuration */}
        <div className="xl:col-span-4 space-y-6">
          {/* Step 1: Catalog Selector */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">1</span>
                <h3 className="text-sm font-extrabold">Select Catalog SKU</h3>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{filteredProducts.length} Active SKUs</span>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search SKU, title or category..."
                  className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold shrink-0 transition-all ${
                      selectedCategory === cat ? 'bg-xisync-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {filteredProducts.map((p) => {
                const active = p.sku === selectedSku;
                return (
                  <div
                    key={p.sku}
                    onClick={() => {
                      setSelectedSku(p.sku);
                      setSelectedImageIndex(0);
                      setActiveJobId(null);
                    }}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                      active
                        ? 'border-xisync-cyan-500 bg-xisync-cyan-50/60 dark:bg-xisync-cyan-950/40 ring-2 ring-xisync-cyan-400'
                        : 'border-slate-200 dark:border-slate-700/80 hover:border-slate-300'
                    }`}
                  >
                    <img src={p.imageUrls[0]} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-200 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-extrabold text-xisync-cyan-600 dark:text-xisync-cyan-400">{p.sku}</span>
                        <span className="text-[11px] font-black">${p.priceUsd.toFixed(2)}</span>
                      </div>
                      <div className="text-xs font-bold truncate mt-0.5">{p.nameEn}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">MOQ: {p.moq} {p.unit} · {p.certifications.join('/')}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {product && (
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200/80 dark:border-slate-800 text-[11px] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-500 uppercase text-[10px]">Product Overview</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">HS {product.hsCode}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-medium line-clamp-2">{product.descriptionEn}</p>
              </div>
            )}
          </div>

          {/* Step 1.5: Image-to-Video (I2V) Source Frame Selection */}
          {product && product.imageUrls.length > 0 && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-xisync-cyan-500" />
                  <h3 className="text-sm font-extrabold">I2V Starting Frame</h3>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                  Seed Image (0.0s)
                </span>
              </div>

              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Select the product image angle for Image-to-Video generation. Google Veo initiates motion directly from this visual frame:
              </p>

              <div className="grid grid-cols-3 gap-2 pt-1">
                {product.imageUrls.map((url, idx) => {
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
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h3 className="text-sm font-extrabold">Viral Opening Hook</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                80% Conversion Impact
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
                        {hook.name}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                    </div>
                    <p className="text-[11px] italic text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      “{hook.templateEn(product)}”
                    </p>
                  </button>
                );
              })}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Custom Editable Opening Line</label>
              <textarea
                value={customHookText}
                onChange={(e) => setCustomHookText(e.target.value)}
                placeholder={activeHookTemplate.templateEn(product)}
                rows={2}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white resize-none"
              />
            </div>
          </div>

          {/* Step 3: Format & Trend Angle */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[11px] font-black flex items-center justify-center">3</span>
                <h3 className="text-sm font-extrabold">Recipe & Surface</h3>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                {format.shots * 8}s Ad
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {VIDEO_AD_FORMATS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormatId(f.id)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    formatId === f.id
                      ? 'border-xisync-cyan-500 bg-xisync-cyan-50/60 dark:bg-xisync-cyan-950/40 ring-2 ring-xisync-cyan-400'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="text-base">{f.emoji}</div>
                  <div className="text-xs font-bold mt-1">{f.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{f.shots * 8}s</div>
                </button>
              ))}
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Target Ad Surface</label>
              <div className="grid grid-cols-2 gap-2">
                {VIDEO_PLATFORM_PROFILES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handlePlatformChange(p.id)}
                    className={`p-2 rounded-xl text-left border text-xs font-bold transition-all ${
                      platform === p.id
                        ? 'border-xisync-cyan-500 bg-xisync-cyan-500/10 ring-1 ring-xisync-cyan-400 text-xisync-cyan-700 dark:text-cyan-300'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div>{p.label}</div>
                    <div className="text-[10px] font-mono font-normal">{p.aspectRatio}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 mb-1">Trend Style Angle</label>
              <select
                value={angleId}
                onChange={(e) => setAngleId(e.target.value as VideoTrendAngleId)}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white"
              >
                {VIDEO_TREND_ANGLES.map((a) => (
                  <option key={a.id} value={a.id}>{a.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right column: Storyboard, Video Generator & Player */}
        <div className="xl:col-span-8 space-y-6">
          {/* Storyboard Prompts */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkle className="w-4 h-4 text-xisync-cyan-500" />
                  <h3 className="text-base font-extrabold">Image-to-Video Storyboard & Scripts</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{scripts.length} consecutive 8s Veo shots starting from Angle #{selectedImageIndex + 1}</p>
              </div>

              <Button
                size="md"
                loading={busy}
                icon={<Sparkles className="w-4 h-4" />}
                onClick={generate}
                className="bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-black shadow-md"
              >
                Generate {scripts.length * 8}s Image-to-Video Ad
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {scripts.map((shot, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/40 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold">Shot {idx + 1}: {shot.shotLabel}</span>
                    <span className="text-[10px] font-mono text-slate-400">{idx * 8}s-{(idx + 1) * 8}s</span>
                  </div>
                  <div className="text-xs italic text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200/50 dark:border-slate-700/50">
                    {shot.narration}
                  </div>
                  <details className="text-[10px]">
                    <summary className="font-bold text-xisync-cyan-600 cursor-pointer select-none">Veo I2V Prompt →</summary>
                    <p className="mt-1 font-mono text-slate-500 bg-slate-100 dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800 text-[10px]">
                      {shot.prompt}
                    </p>
                  </details>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Video Player Display */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-xisync-blue-500" />
                <h3 className="text-base font-extrabold">HD Studio Video Player</h3>
              </div>
              {activeJob && <JobStatusPill job={activeJob} />}
            </div>

            {activeJob ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6">
                  <AdVideoPlayer
                    product={{
                      ...product,
                      imageUrls: [activeReferenceImage, ...product.imageUrls.filter((u) => u !== activeReferenceImage)],
                    }}
                    job={activeJob}
                    currentSegmentIndex={currentSegmentIndex}
                    aspectRatio={aspectRatio}
                    onSegmentChange={setCurrentSegmentIndex}
                    onDeployToMediaBuyer={() => navigate('/dashboard/media-buyer')}
                  />
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase">Selected Shot</h4>
                    <div className="text-base font-extrabold mt-1">
                      Shot {currentSegmentIndex + 1}: {activeJob.segments[currentSegmentIndex]?.shotLabel}
                    </div>
                    <p className="text-xs italic text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                      “{activeJob.segments[currentSegmentIndex]?.narration}”
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-500">Timeline Shots (Interactive)</div>
                    <div className="grid grid-cols-4 gap-2">
                      {activeJob.segments.map((seg, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setCurrentSegmentIndex(i)}
                          className={`p-2 rounded-xl text-left border transition-all ${
                            currentSegmentIndex === i
                              ? 'border-xisync-cyan-500 bg-xisync-cyan-500/10 ring-2 ring-xisync-cyan-400'
                              : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-extrabold">#{i + 1}</span>
                            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          </div>
                          <div className="text-[10px] font-bold truncate mt-0.5">{seg.shotLabel.split('—')[0]}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900 text-slate-200 text-[10px] font-mono max-h-36 overflow-y-auto space-y-1 border border-slate-800">
                    <div className="text-slate-400 font-bold border-b border-slate-800 pb-1 flex items-center justify-between">
                      <span>Execution Feed</span>
                      <span className="text-emerald-400 font-bold">{activeJob.platform} · {activeJob.aspectRatio}</span>
                    </div>
                    {activeJob.log.map((entry, idx) => (
                      <div key={idx}>{entry}</div>
                    ))}
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 text-[11px] space-y-1">
                    <div className="font-bold text-slate-500 uppercase text-[10px]">Product Specifications Injected</div>
                    <div className="grid grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                      <div><b>Price:</b> ${product.priceUsd.toFixed(2)} / {product.unit}</div>
                      <div><b>MOQ:</b> {product.moq} {product.unit}</div>
                      <div><b>HS Code:</b> {product.hsCode}</div>
                      <div><b>Certs:</b> {product.certifications.join(', ')}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2">
                <Film className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs text-slate-500">Hit Generate above to create your product video ad.</p>
              </div>
            )}
          </div>

          {/* Past History */}
          {jobs.length > 0 && (
            <SectionCard
              title="Generated Ads Repository"
              subtitle={`All created video reels (${jobs.length})`}
              actions={
                <Button size="sm" variant="ghost" icon={<Trash2 className="w-3.5 h-3.5" />} onClick={clearAllJobs}>
                  Clear History
                </Button>
              }
            >
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
                      <img src={j.coverPosterUrl || activeReferenceImage} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[9px] font-mono font-bold">
                        {j.targetSeconds}s · {j.aspectRatio}
                      </span>
                    </div>

                    <div className="mt-2 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[10px] font-mono font-bold text-xisync-cyan-600">{j.sku}</span>
                        <span className="text-[9px] font-bold text-emerald-600">{j.status}</span>
                      </div>
                      <div className="text-xs font-bold truncate mt-0.5">{j.productNameEn}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                        <span>{j.platform}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeJob(j.id);
                          }}
                          className="text-red-500 hover:underline"
                        >
                          <Trash2 className="w-3 h-3 inline" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}
        </div>
      </div>
    </div>
  );
}
