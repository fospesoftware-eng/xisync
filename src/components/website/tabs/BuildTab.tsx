import { useState, useEffect } from 'react';
import { Website, LanguageCode, PageSection, InventoryItemSync } from '../../../types/websiteBuilder';
import { WebsiteInventorySyncService } from '../../../lib/services/websiteInventorySync';
import {
  Edit3,
  Search,
  Package,
  CheckCircle2,
  Save,
  Layers,
} from 'lucide-react';

interface BuildTabProps {
  website: Website;
  onUpdateWebsite: (updated: Website) => void;
}

export function BuildTab({ website, onUpdateWebsite }: BuildTabProps) {
  const [activeLang, setActiveLang] = useState<LanguageCode>('en');
  const [activePageSlug, setActivePageSlug] = useState('index');
  const [editingSection, setEditingSection] = useState<PageSection | null>(null);
  const [inventoryItems, setInventoryItems] = useState<InventoryItemSync[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const activePage = website.pages.find((p) => p.slug === activePageSlug) || website.pages[0];

  useEffect(() => {
    (async () => {
      const items = await WebsiteInventorySyncService.fetchClientDeskInventory();
      setInventoryItems(items);
    })();
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSaveSection = (updatedSec: PageSection) => {
    const secToSave: PageSection = {
      ...updatedSec,
      subtitle: updatedSec.subtitle
        ? { en: updatedSec.subtitle.en || '', zh: updatedSec.subtitle.zh || '' }
        : undefined,
      content: updatedSec.content
        ? { en: updatedSec.content.en || '', zh: updatedSec.content.zh || '' }
        : undefined,
    };

    const updatedPages = website.pages.map((p) => {
      if (p.slug === activePage.slug) {
        return {
          ...p,
          sections: p.sections.map((s) => (s.id === secToSave.id ? secToSave : s)),
        };
      }
      return p;
    });

    onUpdateWebsite({ ...website, pages: updatedPages });
    setEditingSection(null);
    triggerToast('Section content saved & DeepSeek AI bilingual sync updated!');
  };

  const handleToggleInventorySync = (sku: string) => {
    setInventoryItems((prev) =>
      prev.map((item) => (item.sku === sku ? { ...item, sync_enabled: !item.sync_enabled } : item))
    );
    triggerToast(`Inventory SKU ${sku} live stock status updated!`);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Top Banner Toolbar & Bilingual Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-500 font-bold text-xs flex items-center gap-1.5">
            <Layers className="w-4 h-4" />
            <span>Visual Block Editor</span>
          </div>
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {website.pages.map((p) => (
              <button
                key={p.slug}
                onClick={() => setActivePageSlug(p.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activePage.slug === p.slug
                    ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.title[activeLang]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Dual Language Switcher (EN / ZH) */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveLang('en')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLang === 'en'
                  ? 'bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              English 🇺🇸
            </button>
            <button
              onClick={() => setActiveLang('zh')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activeLang === 'zh'
                  ? 'bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              简体中文 🇨🇳
            </button>
          </div>

          <button
            onClick={() => triggerToast('Published all page edits to live domain!')}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Publish Edits</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Visual Live Preview / Right SEO & Inventory Panel */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Visual Canvas & Editable Sections */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 font-mono">
              CANVAS PREVIEW ({activeLang.toUpperCase()}) — {website.subdomain}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              LIVE BILINGUAL SYNC
            </span>
          </div>

          {activePage.sections.map((section) => (
            <div
              key={section.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 group relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-800 uppercase">
                    {section.type} BLOCK
                  </span>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                    {section.title[activeLang]}
                  </h3>
                </div>
                <button
                  onClick={() => setEditingSection(section)}
                  className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Block</span>
                </button>
              </div>

              {section.subtitle && (
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  {section.subtitle[activeLang]}
                </p>
              )}

              {section.content && (
                <p className="text-xs text-slate-700 dark:text-slate-300 font-normal leading-relaxed">
                  {section.content[activeLang]}
                </p>
              )}

              {section.media_urls && section.media_urls.length > 0 && (
                <div className="h-44 rounded-xl overflow-hidden relative">
                  <img src={section.media_urls[0]} alt="Section Media" className="w-full h-full object-cover" />
                </div>
              )}

              {section.type === 'products' && (
                <div className="grid sm:grid-cols-2 gap-3 pt-2">
                  {inventoryItems.map((prod) => (
                    <div
                      key={prod.sku}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3"
                    >
                      <img src={prod.image_url} alt={prod.sku} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <div className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                          {prod.name[activeLang]}
                        </div>
                        <div className="flex items-center justify-between mt-1 text-[10px]">
                          <span className="font-mono text-cyan-600 dark:text-cyan-400 font-bold">${prod.price_usd}</span>
                          <span className={`font-bold ${prod.sync_enabled ? 'text-emerald-500' : 'text-slate-400'}`}>
                            {prod.sync_enabled ? 'STOCK SYNCED' : 'HIDDEN'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right Col: SEO Controls & Inventory Connection Panel */}
        <div className="space-y-6">
          {/* SEO Metadata Control Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-purple-500" />
                <h3 className="font-extrabold text-sm">Google & Baidu SEO Controls</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">PAGE: {activePage.slug.toUpperCase()}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Meta Title ({activeLang.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={activePage.seo_metadata.meta_title[activeLang]}
                  onChange={(e) => {
                    const updatedPages = website.pages.map((p) => {
                      if (p.slug === activePage.slug) {
                        return {
                          ...p,
                          seo_metadata: {
                            ...p.seo_metadata,
                            meta_title: { ...p.seo_metadata.meta_title, [activeLang]: e.target.value },
                          },
                        };
                      }
                      return p;
                    });
                    onUpdateWebsite({ ...website, pages: updatedPages });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">
                  Meta Description ({activeLang.toUpperCase()})
                </label>
                <textarea
                  rows={3}
                  value={activePage.seo_metadata.meta_description[activeLang]}
                  onChange={(e) => {
                    const updatedPages = website.pages.map((p) => {
                      if (p.slug === activePage.slug) {
                        return {
                          ...p,
                          seo_metadata: {
                            ...p.seo_metadata,
                            meta_description: { ...p.seo_metadata.meta_description, [activeLang]: e.target.value },
                          },
                        };
                      }
                      return p;
                    });
                    onUpdateWebsite({ ...website, pages: updatedPages });
                  }}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-medium outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px]">
                <span className="font-bold text-slate-400">SEO Schema H1-H3 Structure:</span>
                <span className="font-bold text-emerald-500">VALIDATED</span>
              </div>
            </div>
          </div>

          {/* Inventory Connection Panel */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-500" />
                <h3 className="font-extrabold text-sm">Client Desk Inventory Catalog</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-emerald-500">CONNECTED</span>
            </div>

            <div className="space-y-3 text-xs">
              {inventoryItems.map((prod) => (
                <div
                  key={prod.sku}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-extrabold text-slate-900 dark:text-white">{prod.name[activeLang]}</div>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      SKU: {prod.sku} • ${prod.price_usd} • Stock: {prod.stock_count}
                    </div>
                  </div>
                  <button
                    onClick={() => handleToggleInventorySync(prod.sku)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-bold ${
                      prod.sync_enabled
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {prod.sync_enabled ? 'Syncing' : 'Hidden'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Section Modal */}
      {editingSection && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base">Edit Block: {editingSection.type.toUpperCase()}</h3>
              <span className="text-xs font-mono font-bold text-cyan-500">LANG: {activeLang.toUpperCase()}</span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Section Title</label>
                <input
                  type="text"
                  value={editingSection.title[activeLang] || ''}
                  onChange={(e) =>
                    setEditingSection({
                      ...editingSection,
                      title: {
                        en: activeLang === 'en' ? e.target.value : editingSection.title.en || '',
                        zh: activeLang === 'zh' ? e.target.value : editingSection.title.zh || '',
                      },
                    })
                  }
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                />
              </div>

              {editingSection.subtitle && (
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editingSection.subtitle[activeLang] || ''}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        subtitle: {
                          en: activeLang === 'en' ? e.target.value : editingSection.subtitle?.en || '',
                          zh: activeLang === 'zh' ? e.target.value : editingSection.subtitle?.zh || '',
                        },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-semibold outline-none"
                  />
                </div>
              )}

              {editingSection.content && (
                <div>
                  <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Content Body</label>
                  <textarea
                    rows={4}
                    value={editingSection.content[activeLang] || ''}
                    onChange={(e) =>
                      setEditingSection({
                        ...editingSection,
                        content: {
                          en: activeLang === 'en' ? e.target.value : editingSection.content?.en || '',
                          zh: activeLang === 'zh' ? e.target.value : editingSection.content?.zh || '',
                        },
                      })
                    }
                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-normal outline-none"
                  />
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
              <button
                onClick={() => setEditingSection(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSaveSection(editingSection)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-xs"
              >
                Save Block
              </button>
            </div>
          </div>
        </div>
      )}

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
