import { useState } from 'react';
import { DataTable } from '../../components/dashboard/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Building2,
  Users,
  Eye,
  Edit,
  Ban,
  X,
} from 'lucide-react';

type Tenant = {
  id: string;
  name: string;
  slug: string;
  plan: 'trial' | 'starter' | 'pro' | 'business' | 'enterprise';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  users: number;
  industry: string;
  region: string;
  mrr: number;
  createdAt: string;
};

const sampleTenants: Tenant[] = [
  { id: '1', name: 'Shenzhen Electronics Co.', slug: 'shenzhen-electronics', plan: 'pro', status: 'active', users: 8, industry: 'Electronics', region: 'China - South', mrr: 149, createdAt: '2023-06-15' },
  { id: '2', name: 'Hangzhou Textiles Ltd.', slug: 'hangzhou-textiles', plan: 'business', status: 'active', users: 15, industry: 'Textiles', region: 'China - East', mrr: 399, createdAt: '2023-04-20' },
  { id: '3', name: 'Guangzhou Auto Parts', slug: 'guangzhou-auto', plan: 'starter', status: 'trial', users: 3, industry: 'Automotive', region: 'China - South', mrr: 0, createdAt: '2024-01-10' },
  { id: '4', name: 'Ningbo Steel Works', slug: 'ningbo-steel', plan: 'pro', status: 'active', users: 12, industry: 'Manufacturing', region: 'China - East', mrr: 149, createdAt: '2023-08-05' },
  { id: '5', name: 'Shanghai Medical Devices', slug: 'shanghai-medical', plan: 'enterprise', status: 'active', users: 45, industry: 'Medical', region: 'China - East', mrr: 999, createdAt: '2022-11-12' },
  { id: '6', name: 'Dongguan Toys Factory', slug: 'dongguan-toys', plan: 'pro', status: 'suspended', users: 6, industry: 'Consumer Goods', region: 'China - South', mrr: 0, createdAt: '2023-09-25' },
];

const planColors: Record<Tenant['plan'], string> = {
  trial: 'bg-gray-100 text-gray-700',
  starter: 'bg-blue-100 text-blue-700',
  pro: 'bg-cyan-100 text-cyan-700',
  business: 'bg-green-100 text-green-700',
  enterprise: 'bg-yellow-100 text-yellow-700',
};

const statusColors: Record<Tenant['status'], string> = {
  active: 'bg-green-100 text-green-700',
  trial: 'bg-blue-100 text-blue-700',
  suspended: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-700',
};

export function TenantsPage() {
  const [tenants] = useState<Tenant[]>(sampleTenants);
  const [showNewTenantModal, setShowNewTenantModal] = useState(false);

  const columns = [
    {
      key: 'name',
      header: 'Tenant',
      sortable: true,
      render: (tenant: Tenant) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-xisync-blue-100 to-xisync-cyan-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-xisync-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{tenant.name}</div>
            <div className="text-sm text-gray-500">{tenant.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      header: 'Plan',
      sortable: true,
      render: (tenant: Tenant) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${planColors[tenant.plan]}`}>
          {tenant.plan}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (tenant: Tenant) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[tenant.status]}`}>
          {tenant.status}
        </span>
      ),
    },
    {
      key: 'users',
      header: 'Users',
      sortable: true,
      render: (tenant: Tenant) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{tenant.users}</span>
        </div>
      ),
    },
    {
      key: 'industry',
      header: 'Industry',
      sortable: true,
    },
    {
      key: 'mrr',
      header: 'MRR',
      sortable: true,
      render: (tenant: Tenant) => (
        <span className="font-medium">${tenant.mrr}</span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (tenant: Tenant) => new Date(tenant.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tenants</h1>
          <p className="text-gray-600">Manage all platform tenants</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowNewTenantModal(true)}>
          Add Tenant
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-sm text-gray-500">Total Tenants</div>
          <div className="text-2xl font-bold text-gray-900">{tenants.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-sm text-gray-500">Active</div>
          <div className="text-2xl font-bold text-green-600">
            {tenants.filter(t => t.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-sm text-gray-500">Trial</div>
          <div className="text-2xl font-bold text-blue-600">
            {tenants.filter(t => t.status === 'trial').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-sm text-gray-500">Total MRR</div>
          <div className="text-2xl font-bold text-gray-900">
            ${tenants.reduce((sum, t) => sum + t.mrr, 0).toLocaleString()}
          </div>
        </div>
      </div>

      <DataTable
        data={tenants}
        columns={columns}
        searchable
        searchPlaceholder="Search tenants..."
        actions={(tenant) => (
          <div className="flex items-center gap-1">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
              <Eye className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded">
              <Ban className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {showNewTenantModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNewTenantModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Tenant</h2>
              <button onClick={() => setShowNewTenantModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4">
              <Input label="Company Name" placeholder="Shenzhen Electronics Co." required />
              <Input label="Company Name (Chinese)" placeholder="" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
                  <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500">
                    <option>Electronics</option>
                    <option>Textiles</option>
                    <option>Manufacturing</option>
                    <option>Consumer Goods</option>
                    <option>Medical</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
                  <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500">
                    <option>China - South</option>
                    <option>China - East</option>
                    <option>China - North</option>
                    <option>China - West</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan</label>
                <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500">
                  <option>Trial (14 days)</option>
                  <option>Starter - $49/mo</option>
                  <option>Pro - $149/mo</option>
                  <option>Business - $399/mo</option>
                  <option>Enterprise - Custom</option>
                </select>
              </div>
              <Input label="Admin Email" type="email" placeholder="admin@company.com" required />
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowNewTenantModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Tenant</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
