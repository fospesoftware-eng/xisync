import { useState } from 'react';
import { Image, Sliders, Layers } from 'lucide-react';

export interface WallpaperOption {
  id: string;
  nameEn: string;
  nameZh: string;
  url: string;
}

export const WALLPAPERS: WallpaperOption[] = [
  {
    id: 'light-trails',
    nameEn: 'Cinematic Light Trails',
    nameZh: '光影流光极速',
    url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?q=80&w=2400&auto=format&fit=crop',
  },
  {
    id: 'mountain-peak',
    nameEn: 'Sunrise Mountain Peak',
    nameZh: '日出雪山之巅',
    url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2400&auto=format&fit=crop',
  },
  {
    id: 'cyber-blue',
    nameEn: 'Deep Cyber Blue',
    nameZh: '深邃科技蓝',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2400&auto=format&fit=crop',
  },
  {
    id: 'glass-aurora',
    nameEn: 'Minimal Glass Aurora',
    nameZh: '极简透明极光',
    url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2400&auto=format&fit=crop',
  },
  {
    id: 'cosmic-nebula',
    nameEn: 'Cosmic Nebula Glow',
    nameZh: '绚烂星云梦境',
    url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=2400&auto=format&fit=crop',
  },
];

interface UltraWallpaperSelectorProps {
  currentWallpaper: string;
  onSelectWallpaper: (url: string) => void;
  blurLevel: number;
  onBlurChange: (blur: number) => void;
  language: string;
}

export function UltraWallpaperSelector({
  currentWallpaper,
  onSelectWallpaper,
  blurLevel,
  onBlurChange,
  language,
}: UltraWallpaperSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-lg"
      >
        <Image className="w-3.5 h-3.5 text-xisync-cyan-400" />
        <span>{language === 'zh' ? '切换壁纸' : 'Wallpapers'}</span>
      </button>

      {open && (
        <div className="fixed right-20 top-16 z-[100] w-80 p-4 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/20 shadow-2xl text-white space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-xs font-extrabold flex items-center gap-1.5 text-xisync-cyan-300 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              {language === 'zh' ? '沉浸式壁纸与毛玻璃设置' : 'Wallpaper & Ambient Controls'}
            </span>
            <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-white text-xs">
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {WALLPAPERS.map((wp) => (
              <button
                key={wp.id}
                onClick={() => {
                  onSelectWallpaper(wp.url);
                }}
                className={`group relative h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  currentWallpaper === wp.url ? 'border-xisync-cyan-400 ring-2 ring-xisync-cyan-400/50' : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <img src={wp.url} alt={wp.nameEn} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute inset-x-0 bottom-0 bg-slate-950/80 p-1 text-[10px] font-bold text-white text-center truncate">
                  {language === 'zh' ? wp.nameZh : wp.nameEn}
                </span>
              </button>
            ))}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-white/10">
            <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
              <span className="flex items-center gap-1">
                <Sliders className="w-3 h-3 text-xisync-cyan-400" />
                {language === 'zh' ? '玻璃模糊强度 (Backdrop Blur)' : 'Glass Blur Level'}
              </span>
              <span>{blurLevel}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              value={blurLevel}
              onChange={(e) => onBlurChange(Number(e.target.value))}
              className="w-full accent-xisync-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
