import { useState } from 'react';
import { ShieldCheck, Globe } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../lib/i18n';

type ComplianceRecord = {
  id: string;
  region: { en: string; zh: string };
  standard: { en: string; zh: string };
  status: 'compliant' | 'review' | 'expired';
  validUntil: string;
  auditScore: number;
};

const sampleRecords: ComplianceRecord[] = [
  { id: '1', region: { en: 'European Union (EU)', zh: '欧盟（EU）' }, standard: { en: 'CE Declaration & RoHS Directive 2011/65/EU', zh: 'CE 符合性声明与 RoHS 指令 2011/65/EU' }, status: 'compliant', validUntil: '2026-12-31', auditScore: 98 },
  { id: '2', region: { en: 'United States (USA)', zh: '美国（USA）' }, standard: { en: 'FCC Part 15 Class B & FDA Registration', zh: 'FCC 第 15 部分 B 类与 FDA 注册' }, status: 'compliant', validUntil: '2025-09-15', auditScore: 96 },
  { id: '3', region: { en: 'United Kingdom (UK)', zh: '英国（UK）' }, standard: { en: 'UKCA Conformity Assessment', zh: 'UKCA 合格评定' }, status: 'compliant', validUntil: '2026-06-30', auditScore: 94 },
  { id: '4', region: { en: 'Middle East (UAE/KSA)', zh: '中东（阿联酋/沙特）' }, standard: { en: 'SASO Saber Clearance & G-Mark Certification', zh: 'SASO Saber 清关与 G-Mark 认证' }, status: 'expired', validUntil: '2024-11-20', auditScore: 82 },
  { id: '5', region: { en: 'Southeast Asia (ASEAN)', zh: '东南亚（东盟）' }, standard: { en: 'IEC 62368-1 International Electrical Safety', zh: 'IEC 62368-1 国际电气安全标准' }, status: 'compliant', validUntil: '2027-01-10', auditScore: 100 },
];

export function CompliancePage() {
  const { language } = useI18n();
  const isZh = language === 'zh';
  const t = (en: string, zh: string) => (isZh ? zh : en);
  const [records] = useState<ComplianceRecord[]>(sampleRecords);

  const statusLabel = (s: ComplianceRecord['status']) =>
    s === 'compliant' ? t('Compliant', '合规') : s === 'review' ? t('Under Review', '审核中') : t('Expired', '已过期');

  const cards = [
    { label: t('Global Compliance Index', '全球合规指数'), value: '96.8 / 100', sub: t('Low Customs Risk', '海关低风险'), color: 'text-emerald-600 dark:text-emerald-400' },
    { label: t('Active Certifications', '有效认证'), value: t('28 Standards', '28 项标准'), sub: t('Covering 42 Markets', '覆盖 42 个市场'), color: 'text-slate-900 dark:text-white' },
    { label: t('Expired Certifications', '已过期认证'), value: t('1 Standard', '1 项标准'), sub: t('UAE SASO — Renew Now', '阿联酋 SASO — 需立即续期'), color: 'text-red-600 dark:text-red-400' },
    { label: t('Customs Clearance Rate', '清关通过率'), value: '99.4%', sub: t('Zero Tariff Violations', '零关税违规'), color: 'text-blue-600 dark:text-cyan-400' },
  ];

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{t('Global Trade Compliance & Audit Center', '全球贸易合规与审核中心')}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-300 font-medium">
            {t(
              'Monitor international trade certification, CE/FCC regulatory standards, and export customs compliance',
              '监控国际贸易认证、CE/FCC 法规标准与出口海关合规情况'
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button icon={<ShieldCheck className="w-4 h-4" />}>{t('Run Audit Inspection', '执行合规审核')}</Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="p-4 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">{c.label}</div>
            <div className={`text-2xl font-extrabold mt-1 ${c.color}`}>{c.value}</div>
            <div className={`text-xs font-bold mt-1 ${c.color}`}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Compliance Records Table */}
      <div className="rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-200 font-extrabold">
              <th className="py-3.5 px-6">{t('Target Export Market', '目标出口市场')}</th>
              <th className="py-3.5 px-6">{t('Regulatory Standard & Certification', '法规标准与认证')}</th>
              <th className="py-3.5 px-6">{t('Audit Status', '审核状态')}</th>
              <th className="py-3.5 px-6">{t('Audit Score', '审核评分')}</th>
              <th className="py-3.5 px-6">{t('Validity Period', '有效期至')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {records.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                <td className="py-4 px-6 font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-xisync-cyan-500" />
                  <span>{isZh ? r.region.zh : r.region.en}</span>
                </td>
                <td className="py-4 px-6 font-medium text-slate-700 dark:text-slate-200">{isZh ? r.standard.zh : r.standard.en}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                      r.status === 'compliant'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border dark:border-emerald-500/40'
                        : r.status === 'review'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 dark:border dark:border-amber-500/40'
                        : 'bg-red-100 text-red-800 dark:bg-red-950/80 dark:text-red-300 dark:border dark:border-red-500/40'
                    }`}
                  >
                    {statusLabel(r.status)}
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
