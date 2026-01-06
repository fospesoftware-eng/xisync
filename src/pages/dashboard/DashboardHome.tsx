import { StatsCard } from '../../components/dashboard/StatsCard';
import { useI18n } from '../../lib/i18n';
import { useTheme } from '../../lib/theme-context';
import {
  Users,
  MessageSquare,
  Package,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export function DashboardHome() {
  const { t, language } = useI18n();
  const { theme } = useTheme();

  const stats = [
    {
      title: t.dashboard.stats.totalLeads,
      value: '2,847',
      change: 12.5,
      icon: <Users className="w-5 h-5" />,
      iconColor: theme === 'dark'
        ? 'bg-xisync-blue-900/50 text-xisync-blue-400'
        : 'bg-xisync-blue-100 text-xisync-blue-600',
    },
    {
      title: language === 'zh' ? '进行中的对话' : 'Open Conversations',
      value: '156',
      change: -3.2,
      icon: <MessageSquare className="w-5 h-5" />,
      iconColor: theme === 'dark'
        ? 'bg-xisync-cyan-900/50 text-xisync-cyan-400'
        : 'bg-xisync-cyan-100 text-xisync-cyan-600',
    },
    {
      title: t.dashboard.stats.shipments,
      value: '42',
      change: 8.1,
      icon: <Package className="w-5 h-5" />,
      iconColor: theme === 'dark'
        ? 'bg-xisync-green-900/50 text-xisync-green-400'
        : 'bg-xisync-green-100 text-xisync-green-600',
    },
    {
      title: t.dashboard.stats.revenue,
      value: '$127.4K',
      change: 23.5,
      icon: <DollarSign className="w-5 h-5" />,
      iconColor: theme === 'dark'
        ? 'bg-xisync-lime-900/50 text-xisync-lime-400'
        : 'bg-xisync-lime-100 text-xisync-lime-600',
    },
  ];

  const recentLeads = [
    { id: 1, name: 'John Smith', company: 'ABC Corp', source: 'Website', status: 'new' },
    { id: 2, name: 'Maria Garcia', company: 'XYZ Ltd', source: 'WhatsApp', status: 'contacted' },
    { id: 3, name: 'James Wilson', company: 'Tech Inc', source: 'Email', status: 'qualified' },
    { id: 4, name: 'Sophie Chen', company: 'Global Trade', source: 'Alibaba', status: 'new' },
  ];

  const recentConversations = [
    { id: 1, contact: 'John Smith', channel: 'WhatsApp', preview: language === 'zh' ? '关于价格...' : 'About the pricing for...', time: language === 'zh' ? '5分钟前' : '5m ago' },
    { id: 2, contact: 'Maria Garcia', channel: 'Email', preview: language === 'zh' ? '回复：报价请求' : 'Re: Quote Request', time: language === 'zh' ? '23分钟前' : '23m ago' },
    { id: 3, contact: 'James Wilson', channel: 'WeChat', preview: language === 'zh' ? '能否发送...' : 'Can you send the...', time: language === 'zh' ? '1小时前' : '1h ago' },
  ];

  const pendingTasks = [
    { id: 1, title: language === 'zh' ? '跟进ABC公司' : 'Follow up with ABC Corp', due: language === 'zh' ? '今天' : 'Today', priority: 'high' },
    { id: 2, title: language === 'zh' ? '发送报价给XYZ' : 'Send quote to XYZ Ltd', due: language === 'zh' ? '明天' : 'Tomorrow', priority: 'medium' },
    { id: 3, title: language === 'zh' ? '更新合规文档' : 'Update compliance docs', due: language === 'zh' ? '3天内' : 'In 3 days', priority: 'low' },
  ];

  const shipmentAlerts = [
    { id: 1, number: 'SH-2024-001', status: language === 'zh' ? '延迟' : 'Delayed', message: language === 'zh' ? '目的地海关扣留' : 'Customs hold at destination' },
    { id: 2, number: 'SH-2024-002', status: language === 'zh' ? '异常' : 'Exception', message: language === 'zh' ? '缺少文件' : 'Missing documentation' },
  ];

  const statusLabels: Record<string, string> = {
    new: language === 'zh' ? '新建' : 'new',
    contacted: language === 'zh' ? '已联系' : 'contacted',
    qualified: language === 'zh' ? '已确认' : 'qualified',
  };

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
            change={stat.change}
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
            {recentLeads.map((lead) => (
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
                    {statusLabels[lead.status]}
                  </span>
                </div>
              </div>
            ))}
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
              {recentConversations.map((conv) => (
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
              ))}
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
              {pendingTasks.map((task) => (
                <div key={task.id} className={`p-4 ${theme === 'dark' ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-start gap-3">
                    <input type="checkbox" className={`mt-1 rounded ${theme === 'dark' ? 'bg-gray-700 border-gray-600' : 'border-gray-300'}`} />
                    <div className="flex-1">
                      <div className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{task.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className={`w-3 h-3 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                        <span className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>{task.due}</span>
                        <span
                          className={`text-xs px-1.5 py-0.5 rounded ${
                            task.priority === 'high'
                              ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                              : task.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                                : theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {task.priority === 'high' ? (language === 'zh' ? '高' : 'high') : task.priority === 'medium' ? (language === 'zh' ? '中' : 'medium') : (language === 'zh' ? '低' : 'low')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.status === (language === 'zh' ? '延迟' : 'Delayed')
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                  }`}
                >
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
                <div className="text-3xl font-bold">$847K</div>
                <div className="text-sm text-xisync-blue-200">
                  {language === 'zh' ? '总管道' : 'Total Pipeline'}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold">23</div>
                <div className="text-sm text-xisync-blue-200">
                  {t.dashboard.stats.activeDeals}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold flex items-center gap-1">
                  <TrendingUp className="w-6 h-6" />
                  15%
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
