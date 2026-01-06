import { useState } from 'react';
import { DataTable } from '../../../components/dashboard/DataTable';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
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
} from 'lucide-react';

type Lead = {
  id: string;
  name: string;
  email: string;
  company: string;
  country: string;
  source: string;
  status: 'new' | 'contacted' | 'qualified' | 'unqualified';
  score: number;
  createdAt: string;
};

const sampleLeads: Lead[] = [
  { id: '1', name: 'John Smith', email: 'john@abccorp.com', company: 'ABC Corp', country: 'USA', source: 'Website', status: 'new', score: 85, createdAt: '2024-01-15' },
  { id: '2', name: 'Maria Garcia', email: 'maria@xyzltd.com', company: 'XYZ Ltd', country: 'Spain', source: 'WhatsApp', status: 'contacted', score: 72, createdAt: '2024-01-14' },
  { id: '3', name: 'James Wilson', email: 'james@techinc.com', company: 'Tech Inc', country: 'UK', source: 'Email', status: 'qualified', score: 91, createdAt: '2024-01-13' },
  { id: '4', name: 'Sophie Chen', email: 'sophie@globaltrade.com', company: 'Global Trade', country: 'Singapore', source: 'Alibaba', status: 'new', score: 68, createdAt: '2024-01-12' },
  { id: '5', name: 'Ahmed Hassan', email: 'ahmed@middleeast.com', company: 'Middle East Trading', country: 'UAE', source: 'WeChat', status: 'contacted', score: 79, createdAt: '2024-01-11' },
  { id: '6', name: 'Lisa Brown', email: 'lisa@eurogoods.com', company: 'Euro Goods', country: 'Germany', source: 'Website', status: 'qualified', score: 88, createdAt: '2024-01-10' },
];

const statusColors: Record<Lead['status'], string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-yellow-100 text-yellow-700',
  qualified: 'bg-green-100 text-green-700',
  unqualified: 'bg-gray-100 text-gray-600',
};

export function LeadsPage() {
  const [showNewLeadModal, setShowNewLeadModal] = useState(false);
  const [leads] = useState<Lead[]>(sampleLeads);

  const columns = [
    {
      key: 'name',
      header: 'Lead',
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
      header: 'Company',
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
      header: 'Country',
      sortable: true,
      render: (lead: Lead) => (
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-gray-400" />
          <span>{lead.country}</span>
        </div>
      ),
    },
    {
      key: 'source',
      header: 'Source',
      sortable: true,
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (lead: Lead) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[lead.status]}`}>
          {lead.status}
        </span>
      ),
    },
    {
      key: 'score',
      header: 'Score',
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
      header: 'Created',
      sortable: true,
      render: (lead: Lead) => new Date(lead.createdAt).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
          <p className="text-gray-600">Manage and track your sales leads</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" icon={<Upload className="w-4 h-4" />}>
            Import
          </Button>
          <Button variant="outline" icon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button icon={<Plus className="w-4 h-4" />} onClick={() => setShowNewLeadModal(true)}>
            Add Lead
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm">
          All <span className="ml-1 text-gray-400">({leads.length})</span>
        </Button>
        <Button variant="ghost" size="sm">
          New <span className="ml-1 text-gray-400">({leads.filter(l => l.status === 'new').length})</span>
        </Button>
        <Button variant="ghost" size="sm">
          Contacted <span className="ml-1 text-gray-400">({leads.filter(l => l.status === 'contacted').length})</span>
        </Button>
        <Button variant="ghost" size="sm">
          Qualified <span className="ml-1 text-gray-400">({leads.filter(l => l.status === 'qualified').length})</span>
        </Button>
        <div className="flex-1" />
        <Button variant="outline" size="sm" icon={<Filter className="w-4 h-4" />}>
          Filter
        </Button>
      </div>

      <DataTable
        data={leads}
        columns={columns}
        searchable
        searchPlaceholder="Search leads..."
        actions={(lead) => (
          <div className="flex items-center gap-2">
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Mail className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <Phone className="w-4 h-4" />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-600">
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
              <h2 className="text-xl font-bold text-gray-900">Add New Lead</h2>
              <button onClick={() => setShowNewLeadModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="First Name" placeholder="John" required />
                <Input label="Last Name" placeholder="Smith" required />
              </div>
              <Input label="Email" type="email" placeholder="john@company.com" required />
              <Input label="Phone" type="tel" placeholder="+1 234 567 890" />
              <Input label="Company" placeholder="Company name" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country</label>
                  <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500">
                    <option>Select country</option>
                    <option>USA</option>
                    <option>UK</option>
                    <option>Germany</option>
                    <option>Spain</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Source</label>
                  <select className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500">
                    <option>Website</option>
                    <option>WhatsApp</option>
                    <option>Email</option>
                    <option>Alibaba</option>
                    <option>WeChat</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                <textarea
                  className="w-full px-4 py-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-xisync-cyan-500 resize-none"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" type="button" onClick={() => setShowNewLeadModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Lead</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
