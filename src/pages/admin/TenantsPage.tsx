import { useEffect, useState } from 'react';
import { DataTable } from '../../components/dashboard/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase, type Tenant } from '../../lib/supabase';
import { Plus, Building2, Users, Eye, CreditCard as Edit, Ban, X, Loader2 } from 'lucide-react';

type TenantRow = Tenant & {
  userCount: number;
};

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
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [showNewTenantModal, setShowNewTenantModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('tenants')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          const rows: TenantRow[] = data.map((row: Record<string, unknown>) => ({
            id: row.id as string,
            name: (row.name as string) || '—',
            name_cn: (row.name_cn as string) || null,
            slug: (row.slug as string) || '',
            industry: (row.industry as string) || '—',
            region: (row.region as string) || '—',
            timezone: (row.timezone as string) || 'Asia/Shanghai',
            currency: (row.currency as string) || 'USD',
            default_language: (row.default_language as string) || 'zh',
            logo_url: (row.logo_url as string) || null,
            status: row.status as Tenant['status'],
            plan: row.plan as Tenant['plan'],
            settings: (row.settings as Record<string, unknown>) || {},
            trial_ends_at: (row.trial_ends_at as string) || null,
            created_at: row.created_at as string,
            updated_at: row.updated_at as string,
            userCount: 0,
          }));

          setTenants(rows);
        }
      } catch (err) {
        console.error('TenantsPage fetch error:', err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const columns = [
    {
      key: 'name',
      header: 'Tenant',
      sortable: true,
      render: (tenant: TenantRow) => (
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
      render: (tenant: TenantRow) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${planColors[tenant.plan]}`}>
          {tenant.plan}
        </span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (tenant: TenantRow) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[tenant.status]}`}>
          {tenant.status}
        </span>
      ),
    },
    {
      key: 'userCount',
      header: 'Users',
      sortable: true,
      render: (tenant: TenantRow) => (
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{tenant.userCount}</span>
        </div>
      ),
    },
    {
      key: 'industry',
      header: 'Industry',
      sortable: true,
    },
    {
      key: 'created_at',
      header: 'Created',
      sortable: true,
      render: (tenant: TenantRow) => new Date(tenant.created_at).toLocaleDateString(),
    },
  ];

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
          <div className="text-sm text-gray-500">Total Users</div>
          <div className="text-2xl font-bold text-gray-900">
            {tenants.reduce((sum, t) => sum + t.userCount, 0)}
          </div>
        </div>
      </div>

      <DataTable
        data={tenants}
        columns={columns}
        searchable
        searchPlaceholder="Search tenants..."
        actions={() => (
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
            <TenantForm onClose={() => setShowNewTenantModal(false)} onSaved={() => {
              setShowNewTenantModal(false);
              supabase.from('tenants').select('*').order('created_at', { ascending: false })
                .then(({ data }) => {
                  if (data) setTenants(data.map((row: Record<string, unknown>) => ({
                    id: row.id as string,
                    name: (row.name as string) || '—',
                    name_cn: (row.name_cn as string) || null,
                    slug: (row.slug as string) || '',
                    industry: (row.industry as string) || '—',
                    region: (row.region as string) || '—',
                    timezone: (row.timezone as string) || 'Asia/Shanghai',
                    currency: (row.currency as string) || 'USD',
                    default_language: (row.default_language as string) || 'zh',
                    logo_url: (row.logo_url as string) || null,
                    status: row.status as Tenant['status'],
                    plan: row.plan as Tenant['plan'],
                    settings: (row.settings as Record<string, unknown>) || {},
                    trial_ends_at: (row.trial_ends_at as string) || null,
                    created_at: row.created_at as string,
                    updated_at: row.updated_at as string,
                    userCount: 0,
                  })));
                });
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

function TenantForm({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    nameCn: '',
    industry: 'Electronics',
    region: 'China - South',
    plan: 'trial',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const { error } = await supabase.from('tenants').insert({
      name: form.name,
      name_cn: form.nameCn || null,
      slug,
      industry: form.industry,
      region: form.region,
      plan: form.plan,
      status: form.plan === 'trial' ? 'trial' : 'active',
    });
    setSaving(false);
    if (!error) onSaved();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Input label="Company Name" placeholder="Shenzhen Electronics Co." required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label="Company Name (Chinese)" placeholder="" value={form.nameCn} onChange={(e) => setForm({ ...form, nameCn: e.target.value })} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
          <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
            <option>Electronics</option>
            <option>Textiles</option>
            <option>Manufacturing</option>
            <option>Consumer Goods</option>
            <option>Medical</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Region</label>
          <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
            <option>China - South</option>
            <option>China - East</option>
            <option>China - North</option>
            <option>China - West</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">Plan</label>
        <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
          <option value="trial">Trial (14 days)</option>
          <option value="starter">Starter - $49/mo</option>
          <option value="pro">Pro - $149/mo</option>
          <option value="business">Business - $399/mo</option>
          <option value="enterprise">Enterprise - Custom</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Creating...' : 'Create Tenant'}
        </Button>
      </div>
    </form>
  );
}
