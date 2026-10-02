import { useState } from 'react';
import { ShieldCheck, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';

type ComplianceRecord = {
  id: string;
  region: string;
  standard: string;
  status: 'compliant' | 'review' | 'expired';
  validUntil: string;
  auditScore: number;
};

const sampleRecords: ComplianceRecord[] = [
  { id: '1', region: 'European Union (EU)', standard: 'CE Declaration & RoHS Directive 2011/65/EU', status: 'compliant', validUntil: '2026-12-31', auditScore: 98 },
  { id: '2', region: 'United States (USA)', standard: 'FCC Part 15 Class B & FDA Registration', status: 'compliant', validUntil: '2025-09-15', auditScore: 96 },
  { id: '3', region: 'United Kingdom (UK)', standard: 'UKCA Conformity Assessment', status: 'compliant', validUntil: '2026-06-30', auditScore: 94 },
  { id: '4', region: 'Middle East (UAE/KSA)', standard: 'SASO Saber Clearance & G-Mark Certification', status: 'review', validUntil: '2024-11-20', auditScore: 82 },
  { id: '5', region: 'Southeast Asia (ASEAN)', standard: 'IEC 62368-1 International Electrical Safety', status: 'compliant', validUntil: '2027-01-10', auditScore: 100 },
];

export function CompliancePage() {
  const [records] = useState<ComplianceRecord[]>(sampleRecords);

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Global Trade Compliance & Audit Center</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300 font-medium">
            Monitor international trade certification, CE/FCC regulatory standards, and export customs compliance
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button icon={<ShieldCheck className="w-4 h-4" />}>Run Audit Inspection</Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Global Compliance Index</div>
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">96.8 / 100</div>
          <div className="text-xs text-emerald-600 dark:text-emerald-400 font-bold mt-1">Low Customs Risk</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Active Certifications</div>
          <div className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">28 Standards</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Covering 42 Markets</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Pending Review</div>
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400 mt-1">1 Standard</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">UAE SASO Renewal</div>
        </div>
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">Customs Clearance Rate</div>
          <div className="text-2xl font-extrabold text-blue-600 dark:text-cyan-400 mt-1">99.4%</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">Zero Tariff Violations</div>
        </div>
      </div>

      {/* Compliance Records Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 font-extrabold">
              <th className="py-3.5 px-6">Target Export Market</th>
              <th className="py-3.5 px-6">Regulatory Standard & Certification</th>
              <th className="py-3.5 px-6">Audit Status</th>
              <th className="py-3.5 px-6">Audit Score</th>
              <th className="py-3.5 px-6">Validity Period</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-xisync-cyan-500" />
                  <span>{r.region}</span>
                </td>
                <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-200">{r.standard}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-extrabold capitalize ${
                      r.status === 'compliant'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-500/40'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-500/40'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>
                <td className="py-4 px-6 font-mono font-extrabold text-emerald-600 dark:text-emerald-400">{r.auditScore} / 100</td>
                <td className="py-4 px-6 font-mono text-slate-500 dark:text-slate-300">{r.validUntil}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
