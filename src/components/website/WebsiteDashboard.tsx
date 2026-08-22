import { useState } from 'react';
import { Website } from '../../types/websiteBuilder';
import { BuildTab } from './tabs/BuildTab';
import { ThemesTab } from './tabs/ThemesTab';
import { DomainsTab } from './tabs/DomainsTab';
import { StatisticsTab } from './tabs/StatisticsTab';
import {
  Globe,
  Layers,
  Palette,
  ShieldCheck,
  BarChart3,
  ExternalLink,
  Wand2,
} from 'lucide-react';

interface WebsiteDashboardProps {
  website: Website;
  onUpdateWebsite: (updated: Website) => void;
  onResetWizard: () => void;
  initialTab?: 'build' | 'themes' | 'domains' | 'statistics';
}

export function WebsiteDashboard({
  website,
  onUpdateWebsite,
  onResetWizard,
  initialTab = 'build',
}: WebsiteDashboardProps) {
  const [activeTab, setActiveTab] = useState<'build' | 'themes' | 'domains' | 'statistics'>(initialTab);

  const activeDomain = website.custom_domain || website.subdomain;

  return (
    <div className="space-y-6 text-slate-900 dark:text-white bg-slate-50/60 dark:bg-transparent p-2 md:p-4 rounded-3xl min-h-screen">
      {/* Active Website Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white flex items-center justify-center shadow-md">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold tracking-tight">{website.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                ACTIVE BILINGUAL SITE
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <a
                href={`https://${activeDomain}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>https://{activeDomain}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <span>•</span>
              <span className="capitalize">Theme: {website.theme_config?.name || 'Enterprise Sleek'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetWizard}
            className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-500" />
            <span>Re-run AI Wizard</span>
          </button>
        </div>
      </div>

      {/* 4 Core Sub-Menu Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-bold shadow-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('build')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'build'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Build</span>
        </button>

        <button
          onClick={() => setActiveTab('themes')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'themes'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Palette className="w-4 h-4" />
          <span>Themes</span>
        </button>

        <button
          onClick={() => setActiveTab('domains')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'domains'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Domains</span>
        </button>

        <button
          onClick={() => setActiveTab('statistics')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'statistics'
              ? 'bg-gradient-to-r from-xisync-blue-600 via-xisync-cyan-500 to-xisync-lime-400 text-white shadow-xs font-extrabold'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Statistics</span>
        </button>
      </div>

      {/* Render Active Sub-Menu Component */}
      {activeTab === 'build' && <BuildTab website={website} onUpdateWebsite={onUpdateWebsite} />}
      {activeTab === 'themes' && <ThemesTab website={website} onUpdateWebsite={onUpdateWebsite} />}
      {activeTab === 'domains' && <DomainsTab website={website} onUpdateWebsite={onUpdateWebsite} />}
      {activeTab === 'statistics' && <StatisticsTab website={website} />}
    </div>
  );
}
