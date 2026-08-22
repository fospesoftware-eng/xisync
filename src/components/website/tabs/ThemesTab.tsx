import { useState } from 'react';
import { Website, ThemeConfig } from '../../../types/websiteBuilder';
import { CheckCircle2, Palette } from 'lucide-react';

interface ThemesTabProps {
  website: Website;
  onUpdateWebsite: (updated: Website) => void;
}

const AVAILABLE_THEMES: ThemeConfig[] = [
  {
    id: 'theme-enterprise',
    name: 'Enterprise Sleek',
    name_zh: '商务科技精英',
    description: 'High-contrast sapphire theme tailored for global industrial machinery & B2B exporters.',
    preview_image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    color_palette: {
      primary: '#0284c7',
      secondary: '#0f172a',
      background: '#020617',
      text: '#f8fafc',
      accent: '#38bdf8',
    },
    typography: { font_family_en: 'Inter', font_family_zh: 'PingFang SC', base_font_size: '15px' },
    component_style: { border_radius: 'rounded-2xl', shadow: 'shadow-md' },
  },
  {
    id: 'theme-cyber',
    name: 'Cyber Matrix Ultra',
    name_zh: '赛博光影矩阵',
    description: 'Futuristic glowing dark theme designed for solar PV, electronics, & smart hardware.',
    preview_image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=80',
    color_palette: {
      primary: '#10b981',
      secondary: '#090d16',
      background: '#030712',
      text: '#ffffff',
      accent: '#06b6d4',
    },
    typography: { font_family_en: 'Plus Jakarta Sans', font_family_zh: 'Noto Sans SC', base_font_size: '15px' },
    component_style: { border_radius: 'rounded-2xl', shadow: 'shadow-xl' },
  },
  {
    id: 'theme-nordic',
    name: 'Nordic Clean Light',
    name_zh: '北欧极简冰白',
    description: 'Clean minimalist layout with high readability for consumer goods & apparel wholesale.',
    preview_image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
    color_palette: {
      primary: '#2563eb',
      secondary: '#f8fafc',
      background: '#ffffff',
      text: '#0f172a',
      accent: '#3b82f6',
    },
    typography: { font_family_en: 'Inter', font_family_zh: 'Source Han Sans CN', base_font_size: '15px' },
    component_style: { border_radius: 'rounded-md', shadow: 'shadow-sm' },
  },
];

export function ThemesTab({ website, onUpdateWebsite }: ThemesTabProps) {
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(website.theme_config || AVAILABLE_THEMES[0]);
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectTheme = (t: ThemeConfig) => {
    setActiveTheme(t);
    onUpdateWebsite({ ...website, active_theme_id: t.id, theme_config: t });
    triggerToast(`Switched theme to ${t.name}! All DeepSeek bilingual content preserved.`);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Active Theme Manager & Styling Controls</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Swap visual layout themes without losing your DeepSeek-generated bilingual content and SEO metadata
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            ACTIVE: {activeTheme.name}
          </span>
        </div>
      </div>

      {/* Main Grid: Theme Cards & Styling Panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Theme Selector Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {AVAILABLE_THEMES.map((theme) => (
              <div
                key={theme.id}
                onClick={() => handleSelectTheme(theme)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-4 ${
                  activeTheme.id === theme.id
                    ? 'border-cyan-500 bg-cyan-500/5 dark:bg-cyan-950/20 shadow-md'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-900'
                }`}
              >
                <div className="h-36 rounded-xl overflow-hidden relative">
                  <img src={theme.preview_image} alt={theme.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-950/40 p-3 flex items-end justify-between">
                    <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-slate-900/80 font-mono">
                      {theme.name_zh}
                    </span>
                    {activeTheme.id === theme.id && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-white">
                        ACTIVE
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-extrabold text-base">{theme.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed">
                    {theme.description}
                  </p>
                </div>

                {/* Color Palette Pill Preview */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-slate-400">PALETTE:</span>
                  <div className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.color_palette.primary }} />
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.color_palette.secondary }} />
                    <span className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: theme.color_palette.accent }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Quick Styling Controls */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 text-xs">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Palette className="w-4 h-4 text-cyan-500" />
              <h3 className="font-extrabold text-sm">Theme Styling Controls</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Primary Color Accent</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={activeTheme.color_palette.primary}
                    onChange={(e) => {
                      const updated = {
                        ...activeTheme,
                        color_palette: { ...activeTheme.color_palette, primary: e.target.value },
                      };
                      setActiveTheme(updated);
                      onUpdateWebsite({ ...website, theme_config: updated });
                    }}
                    className="w-9 h-9 rounded-xl cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono font-bold text-slate-900 dark:text-white uppercase">
                    {activeTheme.color_palette.primary}
                  </span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Component Border Radius</label>
                <select
                  value={activeTheme.component_style.border_radius}
                  onChange={(e) => {
                    const updated = {
                      ...activeTheme,
                      component_style: {
                        ...activeTheme.component_style,
                        border_radius: e.target.value as any,
                      },
                    };
                    setActiveTheme(updated);
                    onUpdateWebsite({ ...website, theme_config: updated });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                >
                  <option value="none">Square (0px)</option>
                  <option value="rounded-md">Medium (6px)</option>
                  <option value="rounded-2xl">Rounded (16px)</option>
                  <option value="rounded-full">Pill Radius (Full)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">English Font Family</label>
                <select
                  value={activeTheme.typography.font_family_en}
                  onChange={(e) => {
                    const updated = {
                      ...activeTheme,
                      typography: { ...activeTheme.typography, font_family_en: e.target.value },
                    };
                    setActiveTheme(updated);
                    onUpdateWebsite({ ...website, theme_config: updated });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                >
                  <option>Inter (Clean Corporate)</option>
                  <option>Plus Jakarta Sans (Modern B2B)</option>
                  <option>Roboto (Standard)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Chinese Font Family</label>
                <select
                  value={activeTheme.typography.font_family_zh}
                  onChange={(e) => {
                    const updated = {
                      ...activeTheme,
                      typography: { ...activeTheme.typography, font_family_zh: e.target.value },
                    };
                    setActiveTheme(updated);
                    onUpdateWebsite({ ...website, theme_config: updated });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                >
                  <option>PingFang SC (Apple Simplified)</option>
                  <option>Noto Sans SC (Google Simplified)</option>
                  <option>Source Han Sans CN (Adobe Chinese)</option>
                </select>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => triggerToast('Theme styling preferences saved!')}
                className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs"
              >
                Save Styling Preferences
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
