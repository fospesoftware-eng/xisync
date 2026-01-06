import { StatsCard } from '../../components/dashboard/StatsCard';
import {
  Building2,
  Users,
  MessageSquare,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  Server,
} from 'lucide-react';

const stats = [
  { title: 'Total Tenants', value: '1,247', change: 8.2, icon: <Building2 className="w-5 h-5" />, iconColor: 'bg-xisync-blue-100 text-xisync-blue-600' },
  { title: 'Active Users', value: '8,934', change: 12.5, icon: <Users className="w-5 h-5" />, iconColor: 'bg-xisync-cyan-100 text-xisync-cyan-600' },
  { title: 'Messages Today', value: '127.4K', change: 5.3, icon: <MessageSquare className="w-5 h-5" />, iconColor: 'bg-xisync-green-100 text-xisync-green-600' },
  { title: 'MRR', value: '$847K', change: 15.2, icon: <DollarSign className="w-5 h-5" />, iconColor: 'bg-xisync-lime-100 text-xisync-lime-600' },
];

const recentTenants = [
  { id: '1', name: 'Shenzhen Electronics Co.', plan: 'Pro', users: 8, status: 'active', created: '2 hours ago' },
  { id: '2', name: 'Hangzhou Textiles Ltd.', plan: 'Business', users: 15, status: 'active', created: '5 hours ago' },
  { id: '3', name: 'Guangzhou Auto Parts', plan: 'Starter', users: 3, status: 'trial', created: '1 day ago' },
  { id: '4', name: 'Ningbo Steel Works', plan: 'Pro', users: 12, status: 'active', created: '1 day ago' },
];

const systemHealth = [
  { name: 'API Gateway', status: 'operational', latency: '45ms' },
  { name: 'Database', status: 'operational', latency: '12ms' },
  { name: 'Message Queue', status: 'operational', latency: '8ms' },
  { name: 'Translation Service', status: 'degraded', latency: '234ms' },
  { name: 'Storage', status: 'operational', latency: '28ms' },
];

const alerts = [
  { id: '1', type: 'warning', message: 'Translation service experiencing high latency', time: '10m ago' },
  { id: '2', type: 'info', message: '3 tenants approaching message limits', time: '1h ago' },
  { id: '3', type: 'error', message: 'WhatsApp webhook failed for tenant ABC Corp', time: '2h ago' },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Platform overview and system health</p>
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
            <h2 className="font-semibold text-gray-900">Recent Tenants</h2>
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
                    <div className="text-sm text-gray-500">{tenant.users} users</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-xisync-cyan-100 text-xisync-cyan-700">
                    {tenant.plan}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    tenant.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {tenant.status}
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
              <h2 className="font-semibold text-gray-900">System Health</h2>
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
              <h2 className="font-semibold text-gray-900">Recent Alerts</h2>
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
          <h3 className="font-semibold text-gray-900 mb-4">Usage Trends</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Messages</span>
                <span className="text-sm font-medium text-gray-900">127.4K / 150K</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-xisync-cyan-500 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Storage</span>
                <span className="text-sm font-medium text-gray-900">2.4TB / 5TB</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-xisync-green-500 rounded-full" style={{ width: '48%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">API Calls</span>
                <span className="text-sm font-medium text-gray-900">8.2M / 10M</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-xisync-blue-500 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-xisync-blue-900 to-xisync-cyan-800 rounded-xl p-6 text-white">
          <h3 className="font-semibold mb-4">Revenue Overview</h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <div className="text-3xl font-bold">$847K</div>
              <div className="text-sm text-xisync-blue-200">Monthly Recurring Revenue</div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-4 h-4 text-xisync-green-400" />
                <span className="text-sm text-xisync-green-400">+15.2%</span>
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold">$10.1M</div>
              <div className="text-sm text-xisync-blue-200">Annual Run Rate</div>
            </div>
            <div>
              <div className="text-2xl font-bold">1,247</div>
              <div className="text-sm text-xisync-blue-200">Paying Customers</div>
            </div>
            <div>
              <div className="text-2xl font-bold">$679</div>
              <div className="text-sm text-xisync-blue-200">Avg. Revenue per Account</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
