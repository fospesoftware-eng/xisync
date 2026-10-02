import { useState } from 'react';
import { useI18n } from '../../../lib/i18n';
import { useTheme } from '../../../lib/theme-context';
import { mockLeadAttributions } from '../../../lib/mockMarketingData';
import { ChannelIcon } from '../../../components/ui/ChannelIcon';
import {
  ExternalLink,
  Search,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function MarketingAttributionPage() {
  const { language } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [attributions] = useState(mockLeadAttributions);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = attributions.filter(
    (a) =>
      a.leadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm flex items-center justify-between`}>
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {language === 'zh' ? '广告引流获客全链路归因 (Full-Funnel Lead Attribution)' : 'Full Funnel Ad Click to Lead Attribution'}
          </h1>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {language === 'zh'
              ? '追溯海外买家从广告点击 (UTM 参数)、转化会话到 XiSync CRM 线索与商机货值全流程'
              : 'Track buyer touchpoints from first ad click (UTM Parameters) to qualified CRM leads and deals.'}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4`}>
        <div className={`flex items-center gap-2 rounded-xl px-3 py-2 w-full sm:w-80 border ${isDark ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}>
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'zh' ? '搜索买家姓名、公司或国家...' : 'Search buyer name, company, or region...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-xs outline-none flex-1"
          />
        </div>

        <div className="text-xs text-slate-500 font-semibold">
          {language === 'zh' ? `共归因 ${filtered.length} 条有效买家线索` : `Showing ${filtered.length} attributed leads`}
        </div>
      </div>

      {/* Lead Attribution Table */}
      <div className={`p-6 rounded-2xl border ${isDark ? 'bg-slate-800/80 border-slate-700/80' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className={`border-b text-[11px] font-bold text-slate-400 uppercase tracking-wider ${isDark ? 'border-slate-700' : 'border-slate-200'}`}>
                <th className="py-3 px-3">{language === 'zh' ? '买家 & 公司信息' : 'Buyer & Company'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '广告来源渠道' : 'Channel'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '关联广告系列 / UTM 维度' : 'Campaign & UTM'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '地区' : 'Region'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '转化时间' : 'Converted At'}</th>
                <th className="py-3 px-3">{language === 'zh' ? 'CRM 状态' : 'CRM Status'}</th>
                <th className="py-3 px-3">{language === 'zh' ? '估算意向金额' : 'Est. Deal Value'}</th>
                <th className="py-3 px-3 text-right">{language === 'zh' ? '操作' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {filtered.map((item) => (
                <tr key={item.id} className={`hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  <td className="py-3.5 px-3">
                    <div>
                      <div className="font-bold text-xs">{item.leadName}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{item.companyName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{item.email}</div>
                    </div>
                  </td>
                  <td className="py-3.5 px-3">
                    <ChannelIcon channel={item.channel} size="sm" />
                  </td>
                  <td className="py-3.5 px-3">
                    <div className="font-bold text-xs text-slate-900 dark:text-white">{item.campaignName}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {item.utmSource} / {item.utmMedium} / {item.utmCampaign}
                    </div>
                  </td>
                  <td className="py-3.5 px-3 text-xs font-semibold">
                    {item.region}
                  </td>
                  <td className="py-3.5 px-3 text-xs text-slate-500 dark:text-slate-400">
                    {new Date(item.convertedAt).toLocaleString()}
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-xisync-blue-100 text-xisync-blue-800 dark:bg-xisync-blue-950/60 dark:text-xisync-blue-300 uppercase border border-xisync-blue-200 dark:border-xisync-blue-800/60">
                      {item.dealStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-extrabold text-emerald-600 dark:text-emerald-400">
                    ${item.estimatedValueUSD.toLocaleString()} USD
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <Link
                      to="/dashboard/crm/leads"
                      className="inline-flex items-center gap-1 text-xs font-bold text-xisync-cyan-600 hover:text-xisync-cyan-700 dark:text-xisync-cyan-400"
                    >
                      {language === 'zh' ? '在 CRM 查看' : 'View CRM'} <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
