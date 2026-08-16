import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth-context';
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
  { id: 'qualification', name: 'Qualification', color: 'bg-blue-500' },
  { id: 'discovery', name: 'Discovery', color: 'bg-cyan-500' },
  { id: 'proposal', name: 'Proposal', color: 'bg-yellow-500' },
  { id: 'negotiation', name: 'Negotiation', color: 'bg-orange-500' },
  { id: 'closed_won', name: 'Won', color: 'bg-green-500' },
  { id: 'closed_lost', name: 'Lost', color: 'bg-red-500' },
];

export function DealsPage() {
  const { tenant } = useAuth();
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
          if (!error && data) {
            setDeals(
              data.map((row: Record<string, unknown>) => ({
                id: row.id as string,
                name: (row.name as string) || 'Untitled',
                company: ((row.account as { name?: string } | null)?.name) || '—',
                value: Number(row.value) || 0,
                stage: row.stage as Deal['stage'],
                probability: (row.probability as number) || 0,
                expectedCloseDate: (row.expected_close_date as string) || '',
                assignedTo: 'Unassigned',
              })),
            );
          }
        }
      } catch (err) {
        console.error('DealsPage fetch error:', err);
      } finally {
        setLoading(false);
      }
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
          <h1 className="text-2xl font-bold text-gray-900">Deals</h1>
          <p className="text-gray-600">Track and manage your sales pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setView('board')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${view === 'board' ? 'bg-xisync-cyan-50 text-xisync-cyan-700' : 'text-gray-600'}`}
            >
              Board
            </button>
            <button
              onClick={() => setView('list')}
              className={`px-3 py-1.5 rounded text-sm font-medium ${view === 'list' ? 'bg-xisync-cyan-50 text-xisync-cyan-700' : 'text-gray-600'}`}
            >
              List
            </button>
          </div>
          <Button icon={<Plus className="w-4 h-4" />}>Add Deal</Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total Pipeline</div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalPipeline)}</div>
          <div className="text-sm text-gray-500 mt-1">{activeDeals.length} deals</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Weighted Pipeline</div>
          <div className="text-2xl font-bold text-xisync-cyan-600">{formatCurrency(weightedPipeline)}</div>
          <div className="text-sm text-gray-500 mt-1">Based on probability</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Avg. Deal Size</div>
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(activeDeals.length > 0 ? totalPipeline / activeDeals.length : 0)}
          </div>
          <div className="text-sm text-gray-500 mt-1">Per opportunity</div>
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
                    <span className="font-semibold text-gray-900">{stage.name}</span>
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
                    <div className="text-center py-4 text-sm text-gray-400">No deals</div>
                  )}

                  <button className="w-full py-2 text-sm text-gray-500 hover:text-xisync-cyan-600 hover:bg-white rounded-lg transition-colors flex items-center justify-center gap-1">
                    <Plus className="w-4 h-4" />
                    Add deal
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
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Company</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Stage</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Probability</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Close Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Owner</th>
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
                      {deal.stage.replace('_', ' ')}
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
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">No deals yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
