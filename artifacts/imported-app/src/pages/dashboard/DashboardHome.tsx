import { useEffect, useState } from 'react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { apiRequest } from '../../lib/xisync-api';
import { useAuth } from '../../lib/auth-context';
import { useI18n } from '../../lib/i18n';
import { useTheme } from '../../lib/theme-context';
import {
  Users,
  MessageSquare,
  Package,
  DollarSign,
  TrendingUp,
  BarChart3,
  Globe,
  Bot,
  Sparkles,
  PieChart,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([]);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([]);
  const trendBars: { month: string; rev: number; fcl: number; heightRev: string; heightFcl: string }[] = [];

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (tenant) {
          const data = await apiRequest<{
            lead_count: number;
            conversation_count: number;
            shipment_count: number;
            pipeline_value: number;
            recent_leads: { id: string; contact_name: string | null; company_name: string | null; source: string | null; status: string }[];
            recent_conversations: { id: string; subject: string | null; channel_type: string | null; last_message_at: string | null; contact: { first_name: string | null; last_name: string | null } | null }[];
          }>('/api/xisync/dashboard');
          setLeadCount(data.lead_count);
          setConversationCount(data.conversation_count);
          setShipmentCount(data.shipment_count);
          setPipelineValue(data.pipeline_value);
          setRecentLeads(data.recent_leads.map(row => ({
            id: row.id,
            name: row.contact_name || 'Unknown',
            company: row.company_name || '—',
            source: row.source || '—',
            status: row.status || 'new',
          })));
          setRecentConversations(data.recent_conversations.map(row => ({
            id: row.id,
            contact: row.contact ? `${row.contact.first_name || ''} ${row.contact.last_name || ''}`.trim() || 'Unknown' : 'Unknown',
            channel: row.channel_type || 'email',
            preview: row.subject || '—',
            time: row.last_message_at ? new Date(row.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          })));
        }
      } catch (err) {
        console.error('DashboardHome fetch error:', err);
        setLeadCount(0);
        setConversationCount(0);
        setShipmentCount(0);
        setPipelineValue(0);
        setRecentLeads([]);
        setRecentConversations([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [tenant, language]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-xisync-cyan-500" />
      </div>
    );
  }

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
      value: `$${(pipelineValue / 1000000).toFixed(2)}M`,
      icon: <DollarSign className="w-5 h-5" />,
      iconColor: theme === 'dark' ? 'bg-xisync-lime-900/50 text-xisync-lime-400' : 'bg-xisync-lime-100 text-xisync-lime-600',
    },
  ];

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Top Banner Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
              XiSync Global Trade Intelligence
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {t.dashboard.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-300 font-medium mt-0.5">
            {t.dashboard.overview}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/dashboard/logistics/map">
            <button className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-all flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-500" />
              <span>Shipping Map</span>
            </button>
          </Link>

          <Link to="/dashboard/ai-copilot/negotiation">
            <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 hover:opacity-90 text-white font-extrabold text-xs shadow-xs transition-all flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Trade Copilot</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Primary KPI Stats Deck */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Main Analytics Visualizations & Charts Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Monthly Trade Growth & Freight Analytics Chart */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-500">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Workspace revenue and shipment activity
                </h3>
                <p className="text-xs text-slate-400 font-medium">Pipeline totals and shipment volumes from saved records</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500" />
                <span>Revenue ($)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-400" />
                <span>FCL Containers</span>
              </div>
            </div>
          </div>

          {/* Interactive SVG Analytics Bar & Smooth Curve Chart */}
          <div className="space-y-4">
            <div className="h-56 w-full relative flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100 dark:border-slate-800">
              {trendBars.length === 0 ? (
                <div className="flex h-full flex-1 items-center justify-center text-sm text-slate-500">
                  Revenue and shipment trends will appear after you add records.
                </div>
              ) : trendBars.map((bar) => (
                <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: bar.heightRev }}
                      className="w-1/2 max-w-[24px] rounded-t-lg bg-gradient-to-t from-xisync-blue-600 to-xisync-cyan-400 group-hover:opacity-90 transition-all duration-300 shadow-xs relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono font-bold whitespace-nowrap z-20 pointer-events-none transition-opacity">
                        ${bar.rev}K
                      </div>
                    </div>

                    {/* Containers Bar */}
                    <div
                      style={{ height: bar.heightFcl }}
                      className="w-1/2 max-w-[24px] rounded-t-lg bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:opacity-90 transition-all duration-300 shadow-xs relative"
                    >
                      <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded bg-slate-900 text-white text-[10px] font-mono font-bold whitespace-nowrap z-20 pointer-events-none transition-opacity">
                        {bar.fcl} FCL
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400">{bar.month}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2">
              <span className="flex items-center gap-1 text-slate-500 font-medium">
                <TrendingUp className="w-4 h-4" />
                Workspace trends
              </span>
              <span>Historical comparisons are not available yet.</span>
            </div>
          </div>
        </div>

        {/* Right Col: Regional Export Markets & AI Shield Summary */}
        <div className="space-y-6">
          {/* Regional Export Breakdown */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-purple-500" />
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Regional Export Share</h3>
              </div>
              <span className="text-[10px] font-mono font-bold text-slate-400">WORKSPACE</span>
            </div>

            <div className="py-3 text-xs leading-5 text-slate-500">
              Regional shipping metrics will appear when shipment records are added.
            </div>
          </div>

          {/* AI Protection Safeguard */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Workspace status</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                CONNECTED
              </span>
            </div>
            <div className="font-extrabold text-sm">Workspace data connected</div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Activity and analytics are based on records saved in your private XiSync workspace.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Inbound Buyer Leads & Omnichannel Activity */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Inbound Leads */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Recent Inbound Exporter Leads</h3>
            </div>
            <Link to="/dashboard/crm/leads" className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {recentLeads.length === 0 ? (
              <p className="py-4 text-slate-500">No leads have been added yet.</p>
            ) : recentLeads.map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="font-extrabold text-slate-900 dark:text-white text-sm">{lead.name}</div>
                  <div className="text-slate-500 dark:text-slate-400 font-medium">{lead.company}</div>
                  <div className="text-[10px] text-cyan-600 dark:text-cyan-400 font-mono mt-0.5">{lead.source}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  {lead.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Omnichannel Conversations */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-500" />
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Live Omnichannel Conversations</h3>
            </div>
            <Link to="/dashboard/inbox" className="text-xs text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
              Open Inbox
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {recentConversations.length === 0 ? (
              <p className="py-4 text-slate-500">No conversations yet.</p>
            ) : recentConversations.map((conv) => (
              <div
                key={conv.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200/80 dark:border-slate-800/80 space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 dark:text-white">{conv.contact}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{conv.time}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 font-medium truncate">{conv.preview}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
