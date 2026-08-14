import { useEffect, useState } from 'react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../lib/i18n';
import { useTheme } from '../../lib/theme-context';
import {
  Users,
  MessageSquare,
  Package,
  DollarSign,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

type RecentLead = {
  id: string;
  name: string;
  company: string;
  source: string;
  status: string;
};

type RecentConversation = {
  id: string;
  contact: string;
  channel: string;
  preview: string;
  time: string;
};

export function DashboardHome() {
  const { t, language } = useI18n();
  const { theme } = useTheme();
  const { tenant } = useAuth();
  const [loading, setLoading] = useState(true);
  const [leadCount, setLeadCount] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);
  const [shipmentCount, setShipmentCount] = useState(0);
  const [pipelineValue, setPipelineValue] = useState(0);
  const [activeDeals, setActiveDeals] = useState(0);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const [shipmentAlerts, setShipmentAlerts] = useState<{ id: string; number: string; status: string; message: string }[]>([]);

  useEffect(() => {
    if (!tenant) return;
    (async () => {
      setLoading(true);

      const [leadsRes, convsRes, shipsRes, dealsRes, exceptionsRes] = await Promise.all([
        supabase.from('leads').select('id,contact_name,company_name,source,status,created_at').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('conversations').select('id,subject,channel_type,last_message_at,contact:contacts(first_name,last_name)').eq('tenant_id', tenant.id).order('last_message_at', { ascending: false }).limit(3),
        supabase.from('shipments').select('id,status,shipment_number').eq('tenant_id', tenant.id),
        supabase.from('deals').select('value,stage').eq('tenant_id', tenant.id),
        supabase.from('shipments').select('id,shipment_number,status').eq('tenant_id', tenant.id).eq('status', 'exception'),
      ]);

      setLeadCount((leadsRes.data as { id: string }[] | null)?.length || 0);
      setConversationCount((convsRes.data as { id: string }[] | null)?.length || 0);
      setShipmentCount((shipsRes.data as { id: string }[] | null)?.length || 0);

      const deals = (dealsRes.data as { value: number; stage: string }[] | null) || [];
      const active = deals.filter(d => d.stage !== 'closed_lost');
      setPipelineValue(active.reduce((sum, d) => sum + Number(d.value || 0), 0));
      setActiveDeals(active.length);

      if (leadsRes.data) {
        setRecentLeads((leadsRes.data as Record<string, unknown>[]).map(row => ({
          id: row.id as string,
          name: (row.contact_name as string) || 'Unknown',
          company: (row.company_name as string) || '—',
          source: (row.source as string) || '—',
          status: (row.status as string) || 'new',
        })));
      }

      if (convsRes.data) {
        setRecentConversations((convsRes.data as Record<string, unknown>[]).map(row => {
          const contact = row.contact as { first_name?: string; last_name?: string } | null;
          return {
            id: row.id as string,
            contact: contact ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim() || 'Unknown' : 'Unknown',
            channel: (row.channel_type as string) || 'email',
            preview: (row.subject as string) || '—',
            time: row.last_message_at ? new Date(row.last_message_at as string).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          };
        }));
      }

      if (exceptionsRes.data) {
        setShipmentAlerts((exceptionsRes.data as Record<string, unknown>[]).map(row => ({
          id: row.id as string,
          number: (row.shipment_number as string) || '—',
          status: language === 'zh' ? '异常' : 'Exception',
          message: language === 'zh' ? '需要关注' : 'Needs attention',
        })));
      }

      setLoading(false);
    })();
  }, [tenant, language]);

  const stats = [
    {
      title: t.dashboard.stats.totalLeads,
      value: leadCount.toLocaleString(),
      icon: <Users className="w-5 h-5" />,
      iconColor: theme === 'dark' ? 'bg-xisync-blue-900/50 text-xisync-blue-400' : 'bg-xisync-blue-100 text-xisync-blue-600',
    },
    {
      title: language === 'zh' ? '进行中的对话' : 'Open Conversations',
      value: conversationCount.toLocaleString(),
      icon: <MessageSquare className="w-5 h-5" />,
      iconColor: theme === 'dark' ? 'bg-xisync-cyan-900/50 text-xisync-cyan-400' : 'bg-xisync-cyan-100 text-xisync-cyan-600',
    },
    {
      title: t.dashboard.stats.shipments,
      value: shipmentCount.toLocaleString(),
      icon: <Package className="w-5 h-5" />,
      iconColor: theme === 'dark' ? 'bg-xisync-green-900/50 text-xisync-green-400' : 'bg-xisync-green-100 text-xisync-green-600',
    },
    {
      title: t.dashboard.stats.revenue,
      value: `$${(pipelineValue / 1000).toFixed(1)}K`,
      icon: <DollarSign className="w-5 h-5" />,
      iconColor: theme === 'dark' ? 'bg-xisync-lime-900/50 text-xisync-lime-400' : 'bg-xisync-lime-100 text-xisync-lime-600',
    },
  ];

  const statusLabels: Record<string, string> = {
    new: language === 'zh' ? '新建' : 'new',
    contacted: language === 'zh' ? '已联系' : 'contacted',
    qualified: language === 'zh' ? '已确认' : 'qualified',
  };

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
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            {t.dashboard.title}
          </h1>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            {t.dashboard.welcome}! {language === 'zh' ? '以下是今天的动态。' : "Here's what's happening today."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dashboard/crm/leads/new">
            <Button>{language === 'zh' ? '添加潜在客户' : 'Add Lead'}</Button>
          </Link>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            iconColor={stat.iconColor}
          />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-2 rounded-xl border shadow-sm ${
          theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
          <div className={`flex items-center justify-between p-6 border-b ${
            theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {language === 'zh' ? '最近潜在客户' : 'Recent Leads'}
            </h2>
            <Link
              to="/dashboard/crm/leads"
              className="text-sm text-xisync-cyan-600 hover:text-xisync-cyan-700 font-medium flex items-center gap-1"
            >
              {t.nav.viewAll} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-100'}`}>
            {recentLeads.length === 0 ? (
              <div className={`p-6 text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {language === 'zh' ? '暂无潜在客户' : 'No leads yet'}
              </div>
            ) : (
              recentLeads.map((lead) => (
                <div key={lead.id} className={`flex items-center justify-between p-4 ${
                  theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-xisync-blue-400 to-xisync-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
                      {lead.name.charAt(0)}
                    </div>
                    <div>
                      <div className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{lead.name}</div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{lead.company}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{lead.source}</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        lead.status === 'new'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                          : lead.status === 'contacted'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                      }`}
                    >
                      {statusLabels[lead.status] || lead.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className={`rounded-xl border shadow-sm ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'zh' ? '最近消息' : 'Recent Messages'}
              </h2>
              <Link
                to="/dashboard/inbox"
                className="text-sm text-xisync-cyan-600 hover:text-xisync-cyan-700 font-medium"
              >
                {t.nav.viewAll}
              </Link>
            </div>
            <div className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-100'}`}>
              {recentConversations.length === 0 ? (
                <div className={`p-6 text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                  {language === 'zh' ? '暂无消息' : 'No messages'}
                </div>
              ) : (
                recentConversations.map((conv) => (
                  <div key={conv.id} className={`p-4 ${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{conv.contact}</span>
                      <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{conv.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {conv.channel}
                      </span>
                      <span className={`text-sm truncate ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{conv.preview}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className={`rounded-xl border shadow-sm ${
            theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
          }`}>
            <div className={`flex items-center justify-between p-6 border-b ${
              theme === 'dark' ? 'border-gray-700' : 'border-gray-100'
            }`}>
              <h2 className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                {language === 'zh' ? '待处理任务' : 'Pending Tasks'}
              </h2>
            </div>
            <div className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-100'}`}>
              <div className={`p-4 text-center text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                {language === 'zh' ? '暂无任务' : 'No pending tasks'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {shipmentAlerts.length > 0 && (
        <div className={`rounded-xl p-4 ${
          theme === 'dark' ? 'bg-yellow-900/30 border border-yellow-800' : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} />
            <h3 className={`font-semibold ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'}`}>
              {language === 'zh' ? '货运提醒' : 'Shipment Alerts'}
            </h3>
          </div>
          <div className="space-y-2">
            {shipmentAlerts.map((alert) => (
              <div key={alert.id} className={`flex items-center justify-between rounded-lg p-3 ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              }`}>
                <div>
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{alert.number}</span>
                  <span className={`mx-2 ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>-</span>
                  <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>{alert.message}</span>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">
                  {alert.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-xisync-blue-900 via-xisync-cyan-800 to-xisync-green-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {language === 'zh' ? '管道概览' : 'Pipeline Overview'}
            </h3>
            <div className="flex items-center gap-6">
              <div>
                <div className="text-3xl font-bold">${(pipelineValue / 1000).toFixed(1)}K</div>
                <div className="text-sm text-xisync-blue-200">
                  {language === 'zh' ? '总管道' : 'Total Pipeline'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">{activeDeals}</div>
                <div className="text-sm text-xisync-blue-200">
                  {t.dashboard.stats.activeDeals}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold flex items-center gap-1">
                  <TrendingUp className="w-6 h-6" />
                  {activeDeals > 0 ? Math.round((activeDeals / (activeDeals + 1)) * 100) : 0}%
                </div>
                <div className="text-sm text-xisync-blue-200">
                  {language === 'zh' ? '成单率' : 'Win Rate'}
                </div>
              </div>
            </div>
          </div>
          <Link to="/dashboard/crm/deals">
            <Button className="bg-white text-xisync-blue-900 hover:bg-gray-100">
              {language === 'zh' ? '查看管道' : 'View Pipeline'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
