import { useEffect, useState } from 'react';
import { DataTable } from '../../components/dashboard/DataTable';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { supabase, type Tenant } from '../../lib/supabase';
import { useI18n } from '../../lib/i18n';
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
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const planLabel = (plan: Tenant['plan']) =>
    plan === 'trial' ? t('Trial', '试用版')
    : plan === 'starter' ? t('Starter', '入门版')
    : plan === 'pro' ? t('Pro', '专业版')
    : plan === 'business' ? t('Business', '商业版')
    : t('Enterprise', '企业版');
  const statusLabel = (status: Tenant['status']) =>
    status === 'active' ? t('Active', '正常')
    : status === 'trial' ? t('Trial', '试用中')
    : status === 'suspended' ? t('Suspended', '已停用')
    : t('Cancelled', '已取消');
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
          return;
        }
      } catch (err) {
        console.error('TenantsPage fetch error:', err);
      } finally {
        setLoading(false);
      }

      // Rich default mock tenants for admin console
      setTenants([
        { id: 't-1', name: 'XiSync Precision Manufacturing Ltd.', name_cn: 'XiSync精密电子制造有限公司', slug: 'xisync-precision', industry: 'Electronics & Machinery', region: 'Asia/Shanghai', timezone: 'Asia/Shanghai', currency: 'USD', default_language: 'en', logo_url: null, status: 'active', plan: 'enterprise', settings: {}, trial_ends_at: null, created_at: '2026-01-01', updated_at: '2026-08-16', userCount: 42 },
        { id: 't-2', name: 'EuroMarket Logistics GmbH', name_cn: null, slug: 'euromarket', industry: 'Wholesale Trade', region: 'Europe/Berlin', timezone: 'Europe/Berlin', currency: 'EUR', default_language: 'de', logo_url: null, status: 'active', plan: 'pro', settings: {}, trial_ends_at: null, created_at: '2026-02-15', updated_at: '2026-08-16', userCount: 18 },
        { id: 't-3', name: 'Global Tech Distribution LLC', name_cn: null, slug: 'global-tech', industry: 'Importer / Exporter', region: 'America/Los_Angeles', timezone: 'America/Los_Angeles', currency: 'USD', default_language: 'en', logo_url: null, status: 'active', plan: 'enterprise', settings: {}, trial_ends_at: null, created_at: '2026-03-10', updated_at: '2026-08-16', userCount: 28 },
      ]);
    })();
  }, []);

  const columns = [
    {
      key: 'name',
      header: t('Tenant', '租户'),
      sortable: true,
      render: (tenant: TenantRow) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-xisync-blue-100 to-xisync-cyan-100 flex items-center justify-center">
            <Building2 className="w-5 h-5 text-xisync-blue-600" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{isZh && tenant.name_cn ? tenant.name_cn : tenant.name}</div>
            <div className="text-sm text-gray-500">{tenant.slug}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'plan',
      header: t('Plan', '套餐'),
      sortable: true,
      render: (tenant: TenantRow) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${planColors[tenant.plan]}`}>
          {planLabel(tenant.plan)}
        </span>
      ),
    },
    {
      key: 'status',
      header: t('Status', '状态'),
      sortable: true,
      render: (tenant: TenantRow) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[tenant.status]}`}>
          {statusLabel(tenant.status)}
        </span>
      ),
    },
    {
      key: 'userCount',
      header: t('Users', '用户'),
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
      header: t('Industry', '行业'),
      sortable: true,
    },
    {
      key: 'created_at',
      header: t('Created', '开通时间'),
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
          <h1 className="text-2xl font-bold text-gray-900">{t('Tenants', '租户企业')}</h1>
          <p className="text-gray-600">{t('Manage all platform tenants', '管理平台上的所有租户企业')}</p>
        </div>
        <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowNewTenantModal(true)}>
          {t('Add Tenant', '新增租户')}
        </Button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-sm text-gray-500">{t('Total Tenants', '租户总数')}</div>
          <div className="text-2xl font-bold text-gray-900">{tenants.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-sm text-gray-500">{t('Active', '正常')}</div>
          <div className="text-2xl font-bold text-green-600">
            {tenants.filter(t => t.status === 'active').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-sm text-gray-500">{t('Trial', '试用中')}</div>
          <div className="text-2xl font-bold text-blue-600">
            {tenants.filter(t => t.status === 'trial').length}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-sm text-gray-500">{t('Total Users', '用户总数')}</div>
          <div className="text-2xl font-bold text-gray-900">
            {tenants.reduce((sum, t) => sum + t.userCount, 0)}
          </div>
        </div>
      </div>

      <DataTable
        data={tenants}
        columns={columns}
        searchable
        searchPlaceholder={t('Search tenants...', '搜索租户…')}
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
              <h2 className="text-xl font-bold text-gray-900">{t('Create New Tenant', '创建新租户')}</h2>
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
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
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
      <Input label={t('Company Name', '公司名称')} placeholder="Shenzhen Electronics Co." required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <Input label={t('Company Name (Chinese)', '公司名称（中文）')} placeholder="" value={form.nameCn} onChange={(e) => setForm({ ...form, nameCn: e.target.value })} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Industry', '行业')}</label>
          <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
            <option value="Electronics">{t('Electronics', '电子')}</option>
            <option value="Textiles">{t('Textiles', '纺织')}</option>
            <option value="Manufacturing">{t('Manufacturing', '制造业')}</option>
            <option value="Consumer Goods">{t('Consumer Goods', '消费品')}</option>
            <option value="Medical">{t('Medical', '医疗')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Region', '地区')}</label>
          <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500" value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })}>
            <option value="China - South">{t('China - South', '华南')}</option>
            <option value="China - East">{t('China - East', '华东')}</option>
            <option value="China - North">{t('China - North', '华北')}</option>
            <option value="China - West">{t('China - West', '华西')}</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Plan', '套餐')}</label>
        <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500" value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
          <option value="trial">{t('Trial (14 days)', '试用（14 天）')}</option>
          <option value="starter">{t('Starter - $49/mo', '入门版 - $49/月')}</option>
          <option value="pro">{t('Pro - $149/mo', '专业版 - $149/月')}</option>
          <option value="business">{t('Business - $399/mo', '商业版 - $399/月')}</option>
          <option value="enterprise">{t('Enterprise - Custom', '企业版 - 定制')}</option>
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          {t('Cancel', '取消')}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? t('Creating...', '创建中…') : t('Create Tenant', '创建租户')}
        </Button>
      </div>
    </form>
  );
}
