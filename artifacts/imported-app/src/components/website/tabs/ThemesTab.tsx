import { useState } from 'react';
import { Website, ThemeConfig } from '../../../types/websiteBuilder';
import {
  Palette,
  Image as ImageIcon,
  Type,
  CheckCircle2,
  Sparkles,
  Layout,
} from 'lucide-react';

interface ThemesTabProps {
  website: Website;
  onUpdateWebsite: (updated: Website) => void;
}

const AVAILABLE_THEMES: ThemeConfig[] = [
  {
    id: 'theme-ecotoys',
    name: 'Eco-Toys Pastel (Soft Craft)',
    name_zh: '生态玩具 / 婴童木作 (莫兰迪柔蓝)',
    description: 'Bespoke soft pastel sky-blue theme with rounded cards, cloud accents, and circular CTA badges tailored for toys, kids & crafts.',
    preview_image: 'https://images.unsplash.com/photo-1559454403-b8fb88521f11?auto=format&fit=crop&w=600&q=80',
    color_palette: {
      primary: '#1E3A5F',
      secondary: '#DDECF0',
      background: '#DDECF0',
      text: '#1E3A5F',
      accent: '#A9D0E4',
    },
    typography: { font_family_en: 'Playfair Display', font_family_zh: 'Noto Serif SC', base_font_size: '15px' },
    component_style: { border_radius: 'rounded-2xl', shadow: 'shadow-sm' },
  },
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
  const [siteName, setSiteName] = useState(website.name || 'Eco-Toys Craft Workshop');
  const [logoUrl, setLogoUrl] = useState(website.logo_url || '');
  const [logoText, setLogoText] = useState(website.logo_text || '🧸 ECO-TOYS');
  const [primaryColor, setPrimaryColor] = useState(activeTheme.color_palette.primary);
  const [secondaryColor, setSecondaryColor] = useState(activeTheme.color_palette.secondary);
  const [bgColor, setBgColor] = useState(activeTheme.color_palette.background);
  const [accentColor, setAccentColor] = useState(activeTheme.color_palette.accent);
  const [fontFamily, setFontFamily] = useState(activeTheme.typography.font_family_en);
  const [borderRadius, setBorderRadius] = useState(activeTheme.component_style.border_radius);
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectTheme = (t: ThemeConfig) => {
    setActiveTheme(t);
    setPrimaryColor(t.color_palette.primary);
    setSecondaryColor(t.color_palette.secondary);
    setBgColor(t.color_palette.background);
    setAccentColor(t.color_palette.accent);
    setFontFamily(t.typography.font_family_en);
    setBorderRadius(t.component_style.border_radius);

    onUpdateWebsite({
      ...website,
      active_theme_id: t.id,
      theme_config: t,
    });
    triggerToast(`Switched theme to ${t.name}!`);
  };

  const handleApplyCustomizations = () => {
    const updatedTheme: ThemeConfig = {
      ...activeTheme,
      color_palette: {
        ...activeTheme.color_palette,
        primary: primaryColor,
        secondary: secondaryColor,
        background: bgColor,
        accent: accentColor,
      },
      typography: {
        ...activeTheme.typography,
        font_family_en: fontFamily,
      },
      component_style: {
        ...activeTheme.component_style,
        border_radius: borderRadius as any,
      },
    };

    onUpdateWebsite({
      ...website,
      name: siteName,
      logo_url: logoUrl,
      logo_text: logoText,
      theme_config: updatedTheme,
    });

    triggerToast('Custom branding, colors, logo, and typography updated!');
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">WordPress-Style Theme & Brand Customizer (CMS)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            Customize logo, brand colors, typography, and visual layout presets with instant live preview updates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleApplyCustomizations}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-extrabold text-xs shadow-md hover:opacity-90 transition-all flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save Customizer Settings</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Theme Presets & WordPress Customizer Panel */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Left 7 Cols: Available Theme Templates */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-bold">
            <Layout className="w-4 h-4 text-cyan-500" />
            <span>Select Active Industry Theme Template</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {AVAILABLE_THEMES.map((theme) => (
              <div
                key={theme.id}
                onClick={() => handleSelectTheme(theme)}
                className={`p-5 rounded-2xl border-2 cursor-pointer transition-all space-y-3 ${
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
                  <h3 className="font-extrabold text-sm">{theme.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1 leading-relaxed line-clamp-2">
                    {theme.description}
                  </p>
                </div>

                {/* Color Palette Pill Preview */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-[10px] font-mono font-bold text-slate-400">COLORS:</span>
                  <div className="flex items-center gap-1">
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: theme.color_palette.primary }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: theme.color_palette.secondary }} />
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: theme.color_palette.accent }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: WordPress-Style Live Customizer Inspector Panel */}
        <div className="lg:col-span-5 space-y-6">
          {/* 1. Logo & Brand Identity */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ImageIcon className="w-4 h-4 text-cyan-500" />
              <h3 className="font-extrabold text-sm">Site Identity & Logo</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Company / Site Name</label>
                <input
                  type="text"
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Header Logo Badge / Text</label>
                <input
                  type="text"
                  value={logoText}
                  onChange={(e) => setLogoText(e.target.value)}
                  placeholder="e.g. 🧸 ECO-TOYS"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Logo Image URL (Optional)</label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* 2. Color Palette Customizer */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Palette className="w-4 h-4 text-purple-500" />
              <h3 className="font-extrabold text-sm">Theme Color Palette</h3>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Primary Color</label>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono font-bold">{primaryColor}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Background Canvas</label>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono font-bold">{bgColor}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Accent CTA Color</label>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono font-bold">{accentColor}</span>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Secondary Tint</label>
                <div className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950">
                  <input
                    type="color"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="font-mono font-bold">{secondaryColor}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Typography & Corner Radius Styling */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Type className="w-4 h-4 text-emerald-500" />
              <h3 className="font-extrabold text-sm">Typography & Card Radii</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                >
                  <option value="Playfair Display">Playfair Display (Boutique Serif)</option>
                  <option value="Inter">Inter (Clean Modern Sans)</option>
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Contemporary)</option>
                  <option value="Outfit">Outfit (Geometric Friendly)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Component Corner Radius</label>
                <select
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                >
                  <option value="rounded-2xl">Rounded Extra Large (Pill Smooth)</option>
                  <option value="rounded-md">Rounded Medium (Subtle)</option>
                  <option value="rounded-full">Fully Circular (Organic)</option>
                  <option value="none">Sharp Corners (None)</option>
                </select>
              </div>
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
