import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth-context';
import { useI18n } from '../../../lib/i18n';
import {
  Plus,
  MoreVertical,
  DollarSign,
  Calendar,
  Loader2,
} from 'lucide-react';

type Deal = {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: 'qualification' | 'discovery' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
};

const stages = [
  { id: 'qualification', name: 'Qualification', zh: '资格确认', color: 'bg-blue-500' },
  { id: 'discovery', name: 'Discovery', zh: '需求挖掘', color: 'bg-cyan-500' },
  { id: 'proposal', name: 'Proposal', zh: '方案报价', color: 'bg-yellow-500' },
  { id: 'negotiation', name: 'Negotiation', zh: '谈判中', color: 'bg-orange-500' },
  { id: 'closed_won', name: 'Won', zh: '已成交', color: 'bg-green-500' },
  { id: 'closed_lost', name: 'Lost', zh: '已流失', color: 'bg-red-500' },
];

export function DealsPage() {
  const { tenant } = useAuth();
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'board' | 'list'>('board');

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (tenant) {
          const { data, error } = await supabase
            .from('deals')
            .select('*, account:accounts(name)')
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            setDeals(
              data.map((row: Record<string, unknown>) => ({
                id: row.id as string,
                name: (row.name as string) || t('Untitled', '未命名'),
                company: ((row.account as { name?: string } | null)?.name) || '—',
                value: Number(row.value) || 0,
                stage: row.stage as Deal['stage'],
                probability: (row.probability as number) || 0,
                expectedCloseDate: (row.expected_close_date as string) || '',
                assignedTo: t('Unassigned', '未分配'),
              })),
            );
            return;
          }
        }
      } catch (err) {
        console.error('DealsPage fetch error:', err);
      } finally {
        setLoading(false);
      }

      // Rich default mock deals for demo account
      setDeals([
        { id: 'dl-1', name: '5,000 Units Commercial Energy Inverters', company: 'Global Tech Distribution LLC', value: 450000, stage: 'proposal', probability: 80, expectedCloseDate: '2026-08-30', assignedTo: 'Sarah Chen' },
        { id: 'dl-2', name: '40ft HC Container Smart LED Panels', company: 'EuroMarket Wholesale GmbH', value: 280000, stage: 'negotiation', probability: 90, expectedCloseDate: '2026-09-05', assignedTo: 'Alex Wong' },
        { id: 'dl-3', name: 'Bulk Micro-Transformers Dispatch Line #3', company: 'IndoPacific Traders Ltd', value: 175000, stage: 'closed_won', probability: 100, expectedCloseDate: '2026-08-14', assignedTo: 'Sarah Chen' },
        { id: 'dl-4', name: 'Solar PV Junction Box Annual Supply', company: 'LATAM Import Corp', value: 520000, stage: 'qualification', probability: 60, expectedCloseDate: '2026-09-20', assignedTo: 'Michael Zhang' },
      ]);
    })();
  }, [tenant]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getStageDeals = (stageId: string) => deals.filter((deal) => deal.stage === stageId);
  const getStageTotalValue = (stageId: string) => getStageDeals(stageId).reduce((sum, deal) => sum + deal.value, 0);

  const stageLabel: Record<Deal['stage'], string> = {
    qualification: t('Qualification', '资格确认'),
    discovery: t('Discovery', '需求挖掘'),
    proposal: t('Proposal', '方案报价'),
    negotiation: t('Negotiation', '谈判中'),
    closed_won: t('Won', '已成交'),
    closed_lost: t('Lost', '已流失'),
  };

  const activeDeals = deals.filter(d => d.stage !== 'closed_lost');
  const totalPipeline = activeDeals.reduce((sum, deal) => sum + deal.value, 0);
  const weightedPipeline = activeDeals.reduce((sum, deal) => sum + (deal.value * deal.probability / 100), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-xisync-cyan-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('Deals', '订单')}</h1>
          <p className="text-gray-600">{t('Track and manage your sales pipeline', '跟踪和管理你的销售管道')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setView('board')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${view === 'board' ? 'bg-xisync-cyan-50 text-xisync-cyan-700' : 'text-gray-600'}`}
            >
              {t('Board', '看板')}
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${view === 'list' ? 'bg-xisync-cyan-50 text-xisync-cyan-700' : 'text-gray-600'}`}
            >
              {t('List', '列表')}
            </button>
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>{t('Add Deal', '新增订单')}</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">{t('Total Pipeline', '销售管道总额')}</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalPipeline)}</div>
          <div className="text-sm text-gray-500 mt-1">{activeDeals.length} {t('deals', '个订单')}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">{t('Weighted Pipeline', '加权管道金额')}</div>
          <div className="text-2xl font-bold text-xisync-cyan-600">{formatCurrency(weightedPipeline)}</div>
          <div className="text-sm text-gray-500 mt-1">{t('Based on probability', '按成交概率加权')}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">{t('Avg. Deal Size', '平均订单金额')}</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(activeDeals.length > 0 ? totalPipeline / activeDeals.length : 0)}
          </div>
          <div className="text-sm text-gray-500 mt-1">{t('Per opportunity', '每个商机')}</div>
        </div>
      </div>

      {view === 'board' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.slice(0, 4).map((stage) => (
            <div key={stage.id} className="flex-shrink-0 w-72">
              <div className="bg-gray-100 rounded-xl p-3">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="font-semibold text-gray-900">{isZh ? stage.zh : stage.name}</span>
                    <span className="text-sm text-gray-500">({getStageDeals(stage.id).length})</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {formatCurrency(getStageTotalValue(stage.id))}
                  </span>
                </div>

                <div className="space-y-3">
                  {getStageDeals(stage.id).map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{deal.name}</h4>
                        <button className="text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{deal.company}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-xisync-cyan-600 font-semibold">
                          <DollarSign className="w-4 h-4" />
                          {formatCurrency(deal.value)}
                        </div>
                        <div className="flex items-center gap-1 text-gray-500">
                          {deal.expectedCloseDate && <Calendar className="w-3 h-3" />}
                          {deal.expectedCloseDate && new Date(deal.expectedCloseDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-xisync-blue-400 to-xisync-cyan-400 flex items-center justify-center text-white text-xs font-semibold">
                            {deal.assignedTo.charAt(0)}
                          </div>
                          <span className="text-xs text-gray-500">{deal.assignedTo}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-xisync-cyan-500 rounded-full"
                              style={{ width: `${deal.probability}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{deal.probability}%</span>
                        </div>
                      </div>
                    </div>
                  ))}

                  {getStageDeals(stage.id).length === 0 && (
                    <div className="text-center py-4 text-sm text-gray-400">{t('No deals', '暂无订单')}</div>
                  )}

                  <button className="w-full py-2 text-sm text-gray-500 hover:text-xisync-cyan-600 hover:bg-white rounded-lg transition-colors flex items-center justify-center gap-1">
                    <Plus className="w-4 h-4" />
                    {t('Add deal', '新增订单')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('Deal', '订单')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('Company', '公司')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('Value', '金额')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('Stage', '阶段')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('Probability', '成交概率')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('Close Date', '预计成交日期')}</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">{t('Owner', '负责人')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {deals.map((deal) => (
                <tr key={deal.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{deal.name}</td>
                  <td className="px-6 py-4 text-gray-600">{deal.company}</td>
                  <td className="px-6 py-4 font-medium text-xisync-cyan-600">{formatCurrency(deal.value)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-xisync-cyan-100 text-xisync-cyan-700 capitalize">
                      {stageLabel[deal.stage]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-xisync-cyan-500 rounded-full"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{deal.probability}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {deal.expectedCloseDate ? new Date(deal.expectedCloseDate).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-xisync-blue-400 to-xisync-cyan-400 flex items-center justify-center text-white text-xs font-semibold">
                        {deal.assignedTo.charAt(0)}
                      </div>
                      <span className="text-gray-600">{deal.assignedTo}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {deals.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">{t('No deals yet', '暂无订单')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
