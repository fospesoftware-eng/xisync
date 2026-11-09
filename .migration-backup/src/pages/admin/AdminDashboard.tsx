import { StatsCard } from '../../components/dashboard/StatsCard';
import { useI18n } from '../../lib/i18n';
import {
  Building2,
  Users,
  MessageSquare,
  DollarSign,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

export function AdminDashboard() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);

  const stats = [
    { title: t('Total Tenants', '租户总数'), value: '1,247', change: 8.2, icon: <Building2 className="w-5 h-5" />, iconColor: 'bg-xisync-blue-100 text-xisync-blue-600' },
    { title: t('Active Users', '活跃用户'), value: '8,934', change: 12.5, icon: <Users className="w-5 h-5" />, iconColor: 'bg-xisync-cyan-100 text-xisync-cyan-600' },
    { title: t('Messages Today', '今日消息量'), value: '127.4K', change: 5.3, icon: <MessageSquare className="w-5 h-5" />, iconColor: 'bg-xisync-green-100 text-xisync-green-600' },
    { title: t('MRR', '月经常性收入'), value: '$847K', change: 15.2, icon: <DollarSign className="w-5 h-5" />, iconColor: 'bg-xisync-lime-100 text-xisync-lime-600' },
  ];

  const recentTenants = [
    { id: '1', name: 'Shenzhen Electronics Co.', plan: 'Pro', users: 8, status: 'active', created: t('2 hours ago', '2小时前') },
    { id: '2', name: 'Hangzhou Textiles Ltd.', plan: 'Business', users: 15, status: 'active', created: t('5 hours ago', '5小时前') },
    { id: '3', name: 'Guangzhou Auto Parts', plan: 'Starter', users: 3, status: 'trial', created: t('1 day ago', '1天前') },
    { id: '4', name: 'Ningbo Steel Works', plan: 'Pro', users: 12, status: 'active', created: t('1 day ago', '1天前') },
  ];

  const systemHealth = [
    { name: t('API Gateway', 'API 网关'), status: 'operational', latency: '45ms' },
    { name: t('Database', '数据库'), status: 'operational', latency: '12ms' },
    { name: t('Message Queue', '消息队列'), status: 'operational', latency: '8ms' },
    { name: t('Translation Service', '翻译服务'), status: 'degraded', latency: '234ms' },
    { name: t('Storage', '存储'), status: 'operational', latency: '28ms' },
  ];

  const alerts = [
    { id: '1', type: 'warning', message: t('Translation service experiencing high latency', '翻译服务延迟较高'), time: t('10m ago', '10分钟前') },
    { id: '2', type: 'info', message: t('3 tenants approaching message limits', '3 家租户即将达到消息配额上限'), time: t('1h ago', '1小时前') },
    { id: '3', type: 'error', message: t('WhatsApp webhook failed for tenant ABC Corp', '租户 ABC Corp 的 WhatsApp Webhook 调用失败'), time: t('2h ago', '2小时前') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{t('Admin Dashboard', '管理控制台')}</h1>
        <p className="text-gray-600">{t('Platform overview and system health', '平台概览与系统健康度')}</p>
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
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">{t('Recent Tenants', '最新租户')}</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {recentTenants.map((tenant) => (
              <div key={tenant.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-xisync-blue-100 to-xisync-cyan-100 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-xisync-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{tenant.name}</div>
                    <div className="text-sm text-gray-500">{tenant.users} {t('users', '位用户')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-xisync-cyan-100 text-xisync-cyan-700">
                    {tenant.plan}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tenant.status === 'active' ? t('Active', '正常') : t('Trial', '试用中')}
                  </span>
                  <span className="text-sm text-gray-500">{tenant.created}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{t('System Health', '系统健康度')}</h2>
            </div>
            <div className="p-4 space-y-3">
              {systemHealth.map((service) => (
                <div key={service.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'
                    }`} />
                    <span className="text-sm text-gray-700">{service.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{service.latency}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">{t('Recent Alerts', '最近告警')}</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={`w-4 h-4 mt-0.5 ${
                      alert.type === 'error' ? 'text-red-500' :
                      alert.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">{t('Usage Trends', '使用趋势')}</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{t('Messages', '消息')}</span>
                <span className="text-sm font-medium text-gray-900">127.4K / 150K</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-xisync-cyan-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{t('Storage', '存储')}</span>
                <span className="text-sm font-medium text-gray-900">2.4TB / 5TB</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-xisync-green-500 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">{t('API Calls', 'API 调用')}</span>
                <span className="text-sm font-medium text-gray-900">8.2M / 10M</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-xisync-blue-500 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-xisync-blue-900 to-xisync-cyan-800 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-4">{t('Revenue Overview', '收入概览')}</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold">$847K</div>
              <div className="text-sm text-xisync-blue-200">{t('Monthly Recurring Revenue', '月经常性收入')}</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-xisync-green-400" />
                <span className="text-sm text-xisync-green-400">+15.2%</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">$10.1M</div>
              <div className="text-sm text-xisync-blue-200">{t('Annual Run Rate', '年化收入')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-xisync-blue-200">{t('Paying Customers', '付费客户')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$679</div>
              <div className="text-sm text-xisync-blue-200">{t('Avg. Revenue per Account', '每账户平均收入')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
