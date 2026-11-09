import { useEffect, useState } from 'react';
import { DataTable } from '../../../components/dashboard/DataTable';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth-context';
import { useI18n } from '../../../lib/i18n';
import {
  Plus,
  Filter,
  Download,
  Upload,
  MoreVertical,
  Mail,
  Phone,
  Building2,
  Globe,
  X,
  Loader2,
} from 'lucide-react';

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified' | 'converted';
  score: number;
  createdAt: string;
};

const statusColors: Record<Lead['status'], string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  unqualified: 'bg-gray-100 text-gray-600',
  converted: 'bg-emerald-100 text-emerald-700',
};

export function LeadsPage() {
  const { tenant } = useAuth();
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        if (tenant) {
          const { data, error } = await supabase
            .from('leads')
            .select('*')
            .eq('tenant_id', tenant.id)
            .order('created_at', { ascending: false });
          if (!error && data && data.length > 0) {
            setLeads(
              data.map((row: Record<string, unknown>) => ({
                id: row.id as string,
                name: (row.contact_name as string) || t('Unknown', '未知'),
                email: (row.email as string) || '',
                company: (row.company_name as string) || '—',
                country: (row.country as string) || '—',
                source: (row.source as string) || '—',
                status: row.status as Lead['status'],
                score: (row.score as number) || 0,
                createdAt: row.created_at as string,
              })),
            );
            return;
          }
        }
      } catch (err) {
        console.error('LeadsPage fetch error:', err);
      } finally {
        setLoading(false);
      }

      // Rich default mock leads for demo account
      setLeads([
        { id: 'ld-1', name: 'David Miller', email: 'david@globaltechdist.com', company: 'Global Tech Distribution LLC', country: 'United States', source: 'WhatsApp Direct Ad', status: 'qualified', score: 94, createdAt: '2026-08-15' },
        { id: 'ld-2', name: 'Hans Mueller', email: 'hans@euromarket.de', company: 'EuroMarket Wholesale GmbH', country: 'Germany', source: 'Google Search Campaign', status: 'contacted', score: 88, createdAt: '2026-08-14' },
        { id: 'ld-3', name: 'Rajesh Patel', email: 'rajesh@indopacific.in', company: 'IndoPacific Traders Ltd', country: 'India', source: 'Website Direct RFQ', status: 'qualified', score: 91, createdAt: '2026-08-12' },
        { id: 'ld-4', name: 'Carlos Silva', email: 'carlos@latamimport.br', company: 'LATAM Import Corp', country: 'Brazil', source: 'Meta B2B Ad', status: 'new', score: 76, createdAt: '2026-08-11' },
        { id: 'ld-5', name: 'Tariq Al-Mansoor', email: 'tariq@gulfwholesale.ae', company: 'Gulf Wholesale Trading EST', country: 'UAE', source: 'TikTok Ads', status: 'converted', score: 98, createdAt: '2026-08-10' },
        { id: 'ld-6', name: 'Klaus Webber', email: 'klaus@nordictrade.se', company: 'Nordic Importers AB', country: 'Sweden', source: 'Google Ads', status: 'qualified', score: 85, createdAt: '2026-08-09' },
      ]);
    })();
  }, [tenant]);

  const statusLabel: Record<Lead['status'], string> = {
    new: t('New', '新建'),
    contacted: t('Contacted', '已联系'),
    qualified: t('Qualified', '已确认'),
    unqualified: t('Unqualified', '不合格'),
    converted: t('Converted', '已转化'),
  };

  const countryZh: Record<string, string> = {
    'United States': '美国',
    Germany: '德国',
    India: '印度',
    Brazil: '巴西',
    UAE: '阿联酋',
    Sweden: '瑞典',
  };

  const sourceZh: Record<string, string> = {
    'WhatsApp Direct Ad': 'WhatsApp 直接广告',
    'Google Search Campaign': '谷歌搜索推广活动',
    'Website Direct RFQ': '独立站直接询盘',
    'Meta B2B Ad': 'Meta B2B 广告',
    'TikTok Ads': 'TikTok 广告',
    'Google Ads': '谷歌广告',
  };

  const columns = [
    {
      key: 'name',
      header: t('Lead', '潜客'),
      sortable: true,
      render: (lead: Lead) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-xisync-blue-400 to-xisync-cyan-400 flex items-center justify-center text-white text-sm font-semibold">
            {lead.name.charAt(0)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{lead.name}</div>
            <div className="text-sm text-gray-500">{lead.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      header: t('Company', '公司'),
      sortable: true,
      render: (lead: Lead) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span>{lead.company}</span>
        </div>
      ),
    },
    {
      key: 'country',
      header: t('Country', '国家'),
      sortable: true,
      render: (lead: Lead) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <span>{isZh ? countryZh[lead.country] || lead.country : lead.country}</span>
        </div>
      ),
    },
    {
      key: 'source',
      header: t('Source', '来源'),
      sortable: true,
      render: (lead: Lead) => (
        <span>{isZh ? sourceZh[lead.source] || lead.source : lead.source}</span>
      ),
    },
    {
      key: 'status',
      header: t('Status', '状态'),
      sortable: true,
      render: (lead: Lead) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[lead.status]}`}>
          {statusLabel[lead.status]}
        </span>
      ),
    },
    {
      key: 'score',
      header: t('Score', '评分'),
      sortable: true,
      render: (lead: Lead) => (
        <div className="flex items-center gap-2">
          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                lead.score >= 80 ? 'bg-xisync-green-500' : lead.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${lead.score}%` }}
            />
          </div>
          <span className="text-sm font-medium">{lead.score}</span>
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: t('Created', '创建时间'),
      sortable: true,
      render: (lead: Lead) => new Date(lead.createdAt).toLocaleDateString(),
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
          <h1 className="text-2xl font-bold text-gray-900">{t('Leads', '潜客')}</h1>
          <p className="text-gray-600">{t('Manage and track your sales leads', '管理和跟踪你的销售潜客')}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
            {t('Import', '导入')}
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            {t('Export', '导出')}
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowNewLeadModal(true)}>
            {t('Add Lead', '新增潜客')}
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          {t('All', '全部')} <span className="ml-1 text-gray-400">({leads.length})</span>
        </Button>
        <Button variant="ghost" size="sm">
          {t('New', '新建')} <span className="ml-1 text-gray-400">({leads.filter(l => l.status === 'new').length})</span>
        </Button>
        <Button variant="ghost" size="sm">
          {t('Contacted', '已联系')} <span className="ml-1 text-gray-400">({leads.filter(l => l.status === 'contacted').length})</span>
        </Button>
        <Button variant="ghost" size="sm">
          {t('Qualified', '已确认')} <span className="ml-1 text-gray-400">({leads.filter(l => l.status === 'qualified').length})</span>
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
          {t('Filter', '筛选')}
        </Button>
      </div>

      <DataTable
        data={leads}
        columns={columns}
        searchable
        searchPlaceholder={t('Search leads...', '搜索潜客…')}
        actions={() => (
          <div className="flex items-center gap-2">
            <button title={t('Email lead', '邮件联系')} className="p-1 text-gray-400 hover:text-gray-600">
              <Mail className="w-4 h-4" />
            </button>
            <button title={t('Call lead', '电话联系')} className="p-1 text-gray-400 hover:text-gray-600">
              <Phone className="w-4 h-4" />
            </button>
            <button title={t('More actions', '更多操作')} className="p-1 text-gray-400 hover:text-gray-600">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      {showNewLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowNewLeadModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 m-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">{t('Add New Lead', '新增潜客')}</h2>
              <button onClick={() => setShowNewLeadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <LeadForm tenantId={tenant?.id} onClose={() => setShowNewLeadModal(false)} onSaved={() => {
              setShowNewLeadModal(false);
              if (tenant) {
                supabase.from('leads').select('*').eq('tenant_id', tenant.id).order('created_at', { ascending: false })
                  .then(({ data }) => {
                    if (data) setLeads(data.map((row: Record<string, unknown>) => ({
                      id: row.id as string,
                      name: (row.contact_name as string) || t('Unknown', '未知'),
                      email: (row.email as string) || '',
                      company: (row.company_name as string) || '—',
                      country: (row.country as string) || '—',
                      source: (row.source as string) || '—',
                      status: row.status as Lead['status'],
                      score: (row.score as number) || 0,
                      createdAt: row.created_at as string,
                    })));
                  });
              }
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

function LeadForm({ tenantId, onClose, onSaved }: { tenantId?: string; onClose: () => void; onSaved: () => void }) {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    contactName: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    source: 'Website',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tenantId) return;
    setSaving(true);
    const { error } = await supabase.from('leads').insert({
      tenant_id: tenantId,
      contact_name: form.contactName,
      email: form.email,
      phone: form.phone,
      company_name: form.company,
      country: form.country,
      source: form.source,
      notes: form.notes,
      status: 'new',
    });
    setSaving(false);
    if (!error) onSaved();
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <Input label={t('Contact Name', '联系人姓名')} placeholder="John Smith" required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} />
      </div>
      <Input label={t('Email', '邮箱')} type="email" placeholder="john@company.com" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <Input label={t('Phone', '电话')} type="tel" placeholder="+1 234 567 890" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <Input label={t('Company', '公司')} placeholder={t('Company name', '公司名称')} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Country', '国家')}</label>
          <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
            <option value="">{t('Select country', '请选择国家')}</option>
            <option value="USA">{t('USA', '美国')}</option>
            <option value="UK">{t('UK', '英国')}</option>
            <option value="Germany">{t('Germany', '德国')}</option>
            <option value="Spain">{t('Spain', '西班牙')}</option>
            <option value="Singapore">{t('Singapore', '新加坡')}</option>
            <option value="UAE">{t('UAE', '阿联酋')}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Source', '来源')}</label>
          <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })}>
            <option value="Website">{t('Website', '独立站')}</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">{t('Email', '邮件')}</option>
            <option value="Alibaba">{t('Alibaba', '阿里巴巴')}</option>
            <option value="WeChat">{t('WeChat', '微信')}</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('Notes', '备注')}</label>
        <textarea
          className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500 resize-none"
          rows={3}
          placeholder={t('Additional notes...', '其他备注…')}
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
      </div>
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onClose}>
          {t('Cancel', '取消')}
        </Button>
        <Button type="submit" disabled={saving}>
          {saving ? t('Saving...', '保存中…') : t('Add Lead', '新增潜客')}
        </Button>
      </div>
    </form>
  );
}
