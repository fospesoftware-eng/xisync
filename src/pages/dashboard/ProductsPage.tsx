import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Package, Plus, Search, MoreVertical, Film, RefreshCw, Store, CheckCircle2, Clock } from 'lucide-react';
import { CatalogRepository } from '../../lib/services/marketplace/catalogRepository';
import { MarketplaceSyncService } from '../../lib/services/marketplace/marketplaceSyncService';
import { useI18n } from '../../lib/i18n';
import type { XisyncProduct } from '../../types/marketplace';

const channelBadge: Record<string, { label: string; cls: string }> = {
  ALIBABA: { label: '阿里巴巴', cls: 'bg-orange-50 text-orange-700 border-orange-200' },
  MADE_IN_CHINA: { label: '中国制造网', cls: 'bg-sky-50 text-sky-700 border-sky-200' },
  XISYNC: { label: 'XiSync', cls: 'bg-xisync-cyan-50 text-xisync-cyan-700 border-xisync-cyan-200' },
};

const statusBadge: Record<string, { en: string; zh: string; cls: string }> = {
  ACTIVE: { en: 'Active', zh: '已上架', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  DRAFT: { en: 'Draft', zh: '草稿', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  ARCHIVED: { en: 'Archived', zh: '已归档', cls: 'bg-slate-100 text-slate-600 border-slate-200' },
};

export function ProductsPage() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [syncing, setSyncing] = useState<'ALIBABA' | 'MADE_IN_CHINA' | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const products = useMemo<XisyncProduct[]>(
    () => CatalogRepository.list(),
    [refreshKey]
  );

  const filteredProducts = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.sku.toLowerCase().includes(q) ||
      p.nameEn.toLowerCase().includes(q) ||
      p.nameZh.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  const stats = useMemo(() => {
    const active = products.filter((p) => p.status === 'ACTIVE').length;
    const draft = products.filter((p) => p.status === 'DRAFT').length;
    const imported = products.filter((p) => p.sourceChannel !== 'XISYNC').length;
    const totalStock = products.reduce((sum, p) => sum + p.stockQty, 0);
    return { active, draft, imported, totalStock, total: products.length };
  }, [products]);

  const handleSync = async (channel: 'ALIBABA' | 'MADE_IN_CHINA') => {
    setSyncing(channel);
    try {
      await MarketplaceSyncService.runSync({ channel, direction: 'IMPORT', mode: 'FULL', membershipLabel: '' });
      // Auto-accept all pending import candidates as new DRAFT products
      // so the imported Alibaba/MIC inventory appears immediately in the catalog.
      const queue = MarketplaceSyncService.getImportQueue();
      const pending = queue.filter((c) => c.channel === channel && c.decision === 'PENDING');
      let created = 0;
      for (const cand of pending) {
        try {
          MarketplaceSyncService.acceptImportCandidate(cand.id, cand.matchedSku ? 'RECONCILE' : 'NEW_PRODUCT');
          created += 1;
        } catch {
          // already decided — skip
        }
      }
      setRefreshKey((k) => k + 1);
      const channelName = channel === 'ALIBABA' ? (isZh ? '阿里巴巴' : 'Alibaba.com') : isZh ? '中国制造网' : 'Made-in-China.com';
      setToast(
        isZh
          ? `已从 ${channelName} 导入 ${created} 个产品到目录（草稿状态，完善资料后发布）`
          : `Imported ${created} product(s) from ${channelName} into catalog (draft — complete details to publish)`
      );
    } catch {
      setToast(isZh ? '同步失败，请检查渠道连接' : 'Sync failed. Please check the channel connection.');
    } finally {
      setSyncing(null);
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{t('Global Products & Catalog Center', '全球产品与目录中心')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300 font-medium">
            {t('Manage your B2B trade product catalog, HS codes, MOQ tiers, and global inventory', '管理您的 B2B 贸易产品目录、HS 编码、MOQ 阶梯与全球库存')}
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            variant="secondary"
            icon={<RefreshCw className={`w-4 h-4 ${syncing === 'ALIBABA' ? 'animate-spin' : ''}`} />}
            onClick={() => handleSync('ALIBABA')}
            disabled={syncing !== null}
          >
            {t('Sync from Alibaba', '从阿里巴巴同步')}
          </Button>
          <Button
            variant="secondary"
            icon={<RefreshCw className={`w-4 h-4 ${syncing === 'MADE_IN_CHINA' ? 'animate-spin' : ''}`} />}
            onClick={() => handleSync('MADE_IN_CHINA')}
            disabled={syncing !== null}
          >
            {t('Sync from MIC', '从中国制造网同步')}
          </Button>
          <Button
            variant="secondary"
            icon={<Film className="w-4 h-4" />}
            onClick={() => navigate('/dashboard/products/video-studio')}
          >
            {t('AI Video Ads (Veo)', 'AI 视频广告 (Veo)')}
          </Button>
          <Button icon={<Plus className="w-4 h-4" />}>{t('Add Product', '新增产品')}</Button>
        </div>
      </div>

      {/* KPI Metric Deck */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('Total SKUs', 'SKU 总数')}</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{stats.total}</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            {t('Catalog source of truth', '目录单一数据源')}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('Active Listings', '已上架')}</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">{stats.active}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {t('Ready for export & website', '可用于出口与独立站')}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('Marketplace Imports', '平台回传')}</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-cyan-400 mt-1">{stats.imported}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
            {t('Alibaba / Made-in-China', '阿里巴巴 / 中国制造网')}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{t('Total Stock Units', '库存总量')}</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">
            {stats.totalStock.toLocaleString()}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{t('In-stock now', '当前在库')}</div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('Search by SKU, name, or category...', '按 SKU、名称或类目搜索…')}
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-xisync-cyan-500 font-medium"
          />
        </div>
        {syncing && (
          <span className="text-xs text-slate-500 flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            {t('Syncing from marketplace...', '正在从平台同步…')}
          </span>
        )}
      </div>

      {/* Product List Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 font-extrabold">
              <th className="py-3.5 px-6">{t('Product & Category', '产品与类目')}</th>
              <th className="py-3.5 px-6">{t('SKU', 'SKU')}</th>
              <th className="py-3.5 px-6">{t('Price', '单价')}</th>
              <th className="py-3.5 px-6">{t('MOQ', '起订量')}</th>
              <th className="py-3.5 px-6">{t('Stock', '库存')}</th>
              <th className="py-3.5 px-6">{t('HS Code', 'HS 编码')}</th>
              <th className="py-3.5 px-6">{t('Source', '来源')}</th>
              <th className="py-3.5 px-6">{t('Status', '状态')}</th>
              <th className="py-3.5 px-6 text-right">{t('Actions', '操作')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredProducts.map((prod) => {
              const ch = channelBadge[prod.sourceChannel] || channelBadge.XISYNC;
              const st = statusBadge[prod.status] || statusBadge.DRAFT;
              return (
                <tr key={prod.sku} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-xisync-blue-500 to-xisync-cyan-500 flex items-center justify-center text-white shrink-0">
                        <Package className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-extrabold text-slate-900 dark:text-white text-sm truncate max-w-[260px]">
                          {isZh ? prod.nameZh : prod.nameEn}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-300 font-medium">{prod.category}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-300 font-bold">{prod.sku}</td>
                  <td className="py-4 px-6 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ${prod.priceUsd.toFixed(2)}/{prod.unit}
                  </td>
                  <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-200">
                    {prod.moq.toLocaleString()} {prod.unit}
                  </td>
                  <td className="py-4 px-6 font-mono font-semibold text-slate-800 dark:text-slate-200">
                    {prod.stockQty.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-300 font-bold">{prod.hsCode}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${ch.cls}`}>
                      <Store className="w-3 h-3" />
                      {ch.label}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${st.cls}`}>
                      {prod.status === 'ACTIVE' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {isZh ? st.zh : st.en}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      title={t('More actions', '更多操作')}
                      className="p-1.5 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 text-sm">
                  {t('No products found. Import from Alibaba or Made-in-China to start.', '暂无产品。点击从阿里巴巴或中国制造网同步即可开始。')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm font-medium shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}
    </div>
  );
}
