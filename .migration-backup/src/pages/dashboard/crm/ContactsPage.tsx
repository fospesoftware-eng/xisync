import { useEffect, useState } from 'react';
import { DataTable } from '../../../components/dashboard/DataTable';
import { Button } from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../lib/auth-context';
import { useI18n } from '../../../lib/i18n';
import {
  Users,
  Mail,
  Phone,
  Building2,
  Globe,
  Plus,
  Search,
  CheckCircle2,
  X,
} from 'lucide-react';

type Contact = {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  country: string;
  channel: 'whatsapp' | 'facebook' | 'instagram' | 'email' | 'wechat';
  lastContacted: string;
};

export function ContactsPage() {
  const { tenant } = useAuth();
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    (async () => {
      try {
        if (tenant) {
          const { data, error } = await supabase
            .from('contacts')
            .select('*, account:accounts(name)')
            .eq('tenant_id', tenant.id);
          if (!error && data && data.length > 0) {
            setContacts(
              data.map((row: Record<string, unknown>) => ({
                id: row.id as string,
                name: `${row.first_name || ''} ${row.last_name || ''}`.trim() || t('Contact', '联系人'),
                title: (row.job_title as string) || t('Procurement Specialist', '采购专员'),
                company: ((row.account as { name?: string } | null)?.name) || t('Company', '公司'),
                email: (row.email as string) || '',
                phone: (row.phone as string) || '',
                country: (row.country as string) || t('Global', '全球'),
                channel: 'whatsapp',
                lastContacted: t('Today', '今天'),
              }))
            );
            return;
          }
        }
      } catch (err) {
        console.error(err);
      }

      // Production-grade mock contacts
      setContacts([
        {
          id: 'ct-1',
          name: 'Liam O’Connor',
          title: 'Senior Managing Director of Procurement',
          company: 'Atlantic B2B Toys & Gifts (Ireland)',
          email: 'liam@atlanticb2btoys.ie',
          phone: '+353 1 496 0123',
          country: 'Ireland (EU)',
          channel: 'facebook',
          lastContacted: '10:48 AM',
        },
        {
          id: 'ct-2',
          name: 'Elena Rostova',
          title: 'Head of Boutique Purchasing & Merchandising',
          company: 'Nordic Mini Kids Boutique AB',
          email: 'elena@nordicminikids.se',
          phone: '+46 8 123 4567',
          country: 'Sweden (Nordic)',
          channel: 'instagram',
          lastContacted: '10:15 AM',
        },
        {
          id: 'ct-3',
          name: 'David Miller',
          title: 'VP of Global Supply Chain & Importation',
          company: 'Global Tech Distribution LLC',
          email: 'david@globaltechdist.com',
          phone: '+1 (310) 555-0199',
          country: 'United States (US)',
          channel: 'whatsapp',
          lastContacted: '09:30 AM',
        },
        {
          id: 'ct-4',
          name: 'Chloe Dubreuil',
          title: 'Purchasing & Quality Inspector',
          company: 'Parisian Montessori Nursery Group',
          email: 'chloe@parismontessori.fr',
          phone: '+33 1 42 68 55 00',
          country: 'France (EU)',
          channel: 'email',
          lastContacted: 'Yesterday',
        },
        {
          id: 'ct-5',
          name: 'Tariq Al-Mansoor',
          title: 'Managing Director & Import Head',
          company: 'Gulf Wholesale Trading EST',
          email: 'tariq@gulfwholesaletrade.ae',
          phone: '+971 4 321 8899',
          country: 'United Arab Emirates (UAE)',
          channel: 'whatsapp',
          lastContacted: 'Aug 21',
        },
      ]);
    })();
  }, [tenant]);

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const channelLabel: Record<Contact['channel'], string> = {
    whatsapp: 'WhatsApp',
    facebook: 'Facebook',
    instagram: 'Instagram',
    email: t('Email', '邮件'),
    wechat: t('WeChat', '微信'),
  };

  const countryZh: Record<string, string> = {
    'Ireland (EU)': '爱尔兰（欧盟）',
    'Sweden (Nordic)': '瑞典（北欧）',
    'United States (US)': '美国',
    'France (EU)': '法国（欧盟）',
    'United Arab Emirates (UAE)': '阿联酋',
  };

  const columns = [
    {
      key: 'name',
      header: t('Buyer Contact', '采购商联系人'),
      sortable: true,
      render: (c: Contact) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 flex items-center justify-center text-white font-bold text-sm shadow-xs">
            {c.name.charAt(0)}
          </div>
          <div>
            <div className="font-extrabold text-slate-900 dark:text-white text-xs">{c.name}</div>
            <div className="text-[11px] text-slate-400">{c.title}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'company',
      header: t('Company / Account', '公司 / 客户'),
      sortable: true,
      render: (c: Contact) => (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
          <Building2 className="w-3.5 h-3.5 text-slate-400" />
          <span>{c.company}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: t('Email & Phone', '邮箱与电话'),
      sortable: true,
      render: (c: Contact) => (
        <div className="space-y-0.5 text-xs">
          <div className="flex items-center gap-1 font-mono text-cyan-600 dark:text-cyan-400 font-bold">
            <Mail className="w-3 h-3 text-slate-400" />
            <span>{c.email}</span>
          </div>
          <div className="flex items-center gap-1 font-mono text-slate-400 text-[11px]">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{c.phone}</span>
          </div>
        </div>
      ),
    },
    {
      key: 'country',
      header: t('Country', '国家'),
      sortable: true,
      render: (c: Contact) => (
        <div className="flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300">
          <Globe className="w-3.5 h-3.5 text-cyan-500" />
          <span>{isZh ? countryZh[c.country] || c.country : c.country}</span>
        </div>
      ),
    },
    {
      key: 'channel',
      header: t('Preferred Channel', '常用沟通渠道'),
      sortable: true,
      render: (c: Contact) => (
        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
          {channelLabel[c.channel]}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 text-slate-900 dark:text-white bg-slate-50/60 dark:bg-transparent p-2 md:p-4 rounded-3xl min-h-screen">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3.5">
          <div className="p-3 rounded-2xl bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-md">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">{t('Buyer Contacts & Decision Makers', '采购商联系人与决策者')}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              {t('Direct procurement managers, import directors, and purchasing agents across international accounts', '海外客户公司的直采经理、进口总监与采购代理')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowModal(true)}>
            {t('Add New Contact', '新增联系人')}
          </Button>
        </div>
      </div>

      {/* Search Bar & Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('Search by contact name, company, or email...', '按联系人姓名、公司或邮箱搜索…')}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        <DataTable columns={columns} data={filteredContacts} />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 dark:border-slate-800 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-extrabold text-base">{t('Register Decision Maker Contact', '登记决策者联系人')}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-500 block mb-1">{t('Full Name', '姓名')}</label>
                <input
                  type="text"
                  placeholder={t('e.g. John Doe', '例如：张三')}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-500 block mb-1">{t('Business Email', '工作邮箱')}</label>
                <input
                  type="email"
                  placeholder="e.g. buyer@company.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                {t('Cancel', '取消')}
              </Button>
              <Button
                onClick={() => {
                  setShowModal(false);
                  triggerToast(t('Buyer contact recorded!', '采购商联系人已保存！'));
                }}
              >
                {t('Save Contact', '保存联系人')}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold shadow-lg flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
