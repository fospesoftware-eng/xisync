import { useState } from 'react';
import { useI18n } from '../../../lib/i18n';
import { useTheme } from '../../../lib/theme-context';
import { mockCreatives } from '../../../lib/mockMarketingData';
import {
  CheckCircle,
  Copy,
  Image as ImageIcon,
  Video,
  Wand2,
  Check,
} from 'lucide-react';

export function MarketingCreativeStudioPage() {
  const { language } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [creatives] = useState(mockCreatives);
  const [selectedCreative, setSelectedCreative] = useState(mockCreatives[0]);
  const [activeLang, setActiveLang] = useState<'en' | 'es' | 'ar' | 'de' | 'fr'>('en');
  const [copied, setCopied] = useState(false);

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm flex items-center justify-between`}>
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'zh' ? '出海素材工坊与 AI 多语言引擎 (Creative Studio)' : 'Export Creative Studio & AI Localization Engine'}
          </h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {language === 'zh'
              ? '直接同步产品图库与视频，AI 自动生成高转化率多语种广告文案并进行出海广告合规检测'
              : 'Sync product visuals and leverage AI to generate localized ad copy passed through export compliance engines.'}
          </p>
        </div>
      </div>

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
    </div>
  );
}
