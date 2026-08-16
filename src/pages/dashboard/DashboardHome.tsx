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
  const [leadCount, setLeadCount] = useState(1284);
  const [conversationCount, setConversationCount] = useState(342);
  const [shipmentCount, setShipmentCount] = useState(89);
  const [pipelineValue, setPipelineValue] = useState(1480000);
  const [recentLeads, setRecentLeads] = useState<RecentLead[]>([
    { id: 'ld-1', name: 'David Miller', company: 'Global Tech Distribution LLC', source: 'WhatsApp Direct Ad', status: 'New Qualified' },
    { id: 'ld-2', name: 'Hans Mueller', company: 'EuroMarket Wholesale GmbH', source: 'Google Search Campaign', status: 'RFQ In Progress' },
    { id: 'ld-3', name: 'Rajesh Patel', company: 'IndoPacific Traders Ltd', source: 'Website Direct RFQ', status: 'Sample Dispatched' },
    { id: 'ld-4', name: 'Carlos Silva', company: 'LATAM Import Corp', source: 'Meta B2B Ad', status: 'Contract Pending' },
  ]);
  const [recentConversations, setRecentConversations] = useState<RecentConversation[]>([
    { id: 'cv-1', contact: 'David Miller', channel: 'WhatsApp', preview: 'Inquiring about 40ft container spot rates from Shanghai Pudong', time: '10:42 AM' },
    { id: 'cv-2', contact: 'Hans Mueller', channel: 'Email', preview: 'Revised L/C payment split proposal (30/70 T/T terms)', time: '09:15 AM' },
    { id: 'cv-3', contact: 'Rajesh Patel', channel: 'WeChat', preview: 'Golden sample approval confirmation for Factory Line #3', time: 'Yesterday' },
  ]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (tenant) {
          const [leadsRes, convsRes, shipsRes, dealsRes] = await Promise.all([
            supabase.from('leads').select('id,contact_name,company_name,source,status,created_at').eq('tenant_id', tenant.id).order('created_at', { ascending: false }).limit(5),
            supabase.from('conversations').select('id,subject,channel_type,last_message_at,contact:contacts(first_name,last_name)').eq('tenant_id', tenant.id).order('last_message_at', { ascending: false }).limit(3),
            supabase.from('shipments').select('id,status,shipment_number').eq('tenant_id', tenant.id),
            supabase.from('deals').select('value,stage').eq('tenant_id', tenant.id),
          ]);

          if (leadsRes.data && leadsRes.data.length > 0) {
            setLeadCount(leadsRes.data.length);
            setRecentLeads((leadsRes.data as Record<string, unknown>[]).map(row => ({
              id: row.id as string,
              name: (row.contact_name as string) || 'Unknown',
              company: (row.company_name as string) || '—',
              source: (row.source as string) || '—',
              status: (row.status as string) || 'new',
            })));
          }

          if (convsRes.data && convsRes.data.length > 0) {
            setConversationCount(convsRes.data.length);
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

          if (shipsRes.data && shipsRes.data.length > 0) {
            setShipmentCount(shipsRes.data.length);
          }

          if (dealsRes.data && dealsRes.data.length > 0) {
            const deals = (dealsRes.data as { value: number; stage: string }[]) || [];
            const active = deals.filter(d => d.stage !== 'closed_lost');
            setPipelineValue(active.reduce((sum, d) => sum + Number(d.value || 0), 0));
          }
        }
      } catch (err) {
        console.error('DashboardHome fetch error:', err);
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
      change: 14.2,
      icon: <Users className="w-5 h-5" />,
      iconColor: theme === 'dark' ? 'bg-xisync-blue-900/50 text-xisync-blue-400' : 'bg-xisync-blue-100 text-xisync-blue-600',
    },
    {
      title: language === 'zh' ? '进行中的对话' : 'Open Conversations',
      value: conversationCount.toLocaleString(),
      change: 8.7,
      icon: <MessageSquare className="w-5 h-5" />,
      iconColor: theme === 'dark' ? 'bg-xisync-cyan-900/50 text-xisync-cyan-400' : 'bg-xisync-cyan-100 text-xisync-cyan-600',
    },
    {
      title: t.dashboard.stats.shipments,
      value: shipmentCount.toLocaleString(),
      change: 22.4,
      icon: <Package className="w-5 h-5" />,
      iconColor: theme === 'dark' ? 'bg-xisync-green-900/50 text-xisync-green-400' : 'bg-xisync-green-100 text-xisync-green-600',
    },
    {
      title: t.dashboard.stats.revenue,
      value: `$${(pipelineValue / 1000000).toFixed(2)}M`,
      change: 18.9,
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
            change={stat.change}
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
                  Monthly B2B Revenue & Container Freight Growth
                </h3>
                <p className="text-xs text-slate-400 font-medium">Export container volume vs. gross pipeline revenue</p>
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
              {[
                { month: 'Jan', rev: 420, fcl: 34, heightRev: '42%', heightFcl: '34%' },
                { month: 'Feb', rev: 580, fcl: 48, heightRev: '58%', heightFcl: '48%' },
                { month: 'Mar', rev: 740, fcl: 62, heightRev: '74%', heightFcl: '62%' },
                { month: 'Apr', rev: 610, fcl: 51, heightRev: '61%', heightFcl: '51%' },
                { month: 'May', rev: 890, fcl: 76, heightRev: '89%', heightFcl: '76%' },
                { month: 'Jun', rev: 1120, fcl: 94, heightRev: '95%', heightFcl: '88%' },
                { month: 'Jul', rev: 1350, fcl: 110, heightRev: '100%', heightFcl: '96%' },
              ].map((bar) => (
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
              <span className="flex items-center gap-1 text-emerald-500 font-bold">
                <TrendingUp className="w-4 h-4" />
                +28.4% Average Export Velocity Increase
              </span>
              <span>Target Q3: $1.80M Revenue</span>
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
              <span className="text-[10px] font-mono font-bold text-slate-400">Q2 REAL-TIME</span>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { region: 'North America (USLAX / USNYC)', share: '42%', color: 'bg-blue-500' },
                { region: 'European Union (NLRTM / DEHAM)', share: '28%', color: 'bg-cyan-500' },
                { region: 'South Asia & India (INNSA / INMUN)', share: '18%', color: 'bg-amber-500' },
                { region: 'Middle East (AEDXB / Jebel Ali)', share: '12%', color: 'bg-emerald-500' },
              ].map((item) => (
                <div key={item.region} className="space-y-1">
                  <div className="flex justify-between font-extrabold text-slate-700 dark:text-slate-200">
                    <span>{item.region}</span>
                    <span className="font-mono text-cyan-600 dark:text-cyan-400">{item.share}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: item.share }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Protection Safeguard */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-md border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">AI Shield Status</span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ACTIVE
              </span>
            </div>
            <div className="font-extrabold text-sm">Protected Deal Margins: +$142,500 Saved</div>
            <p className="text-xs text-slate-300 font-medium leading-relaxed">
              Auto-negotiation copilot prevented $142.5K in imposter discount loss across 24 active wholesale RFQs.
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
            {recentLeads.map((lead) => (
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
            {recentConversations.map((conv) => (
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
