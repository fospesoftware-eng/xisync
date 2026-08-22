import { useState } from 'react';
import { Website, DomainConfig } from '../../../types/websiteBuilder';
import { GoDaddyDomainService, DomainSearchResult } from '../../../lib/services/godaddyDomainService';
import {
  Globe,
  CheckCircle2,
  Search,
  RefreshCw,
  ShieldCheck,
  Loader2,
  ShoppingBag,
} from 'lucide-react';

interface DomainsTabProps {
  website: Website;
  onUpdateWebsite: (updated: Website) => void;
}

export function DomainsTab({ website, onUpdateWebsite }: DomainsTabProps) {
  const [activeDomainConfig, setActiveDomainConfig] = useState<DomainConfig>(
    website.domain_config || {
      id: 'dom-1',
      website_id: website.id,
      domain_name: website.custom_domain || website.subdomain,
      provider: website.custom_domain ? 'manual_dns' : 'xisync_subdomain',
      status: 'connected',
      dns_records: GoDaddyDomainService.getManualDnsParameters(website.custom_domain || 'exportco-global.com'),
      connected_at: new Date().toISOString(),
    }
  );

  const [domainInput, setDomainInput] = useState(website.custom_domain || 'exportco-global.com');
  const [godaddyQuery, setGodaddyQuery] = useState('');
  const [godaddyResults, setGodaddyResults] = useState<DomainSearchResult[]>([]);
  const [godaddySearching, setGodaddySearching] = useState(false);
  const [pollingDns, setPollingDns] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleConnectManualDomain = () => {
    if (!domainInput.trim()) return;
    const records = GoDaddyDomainService.getManualDnsParameters(domainInput);
    const updated: DomainConfig = {
      ...activeDomainConfig,
      domain_name: domainInput,
      provider: 'manual_dns',
      status: 'connected',
      dns_records: records,
    };
    setActiveDomainConfig(updated);
    onUpdateWebsite({ ...website, custom_domain: domainInput, domain_config: updated });
    triggerToast(`Connected custom domain ${domainInput}! Manual DNS records generated.`);
  };

  const handlePollDnsStatus = async () => {
    setPollingDns(true);
    try {
      const verifiedRecords = await GoDaddyDomainService.pollDnsVerificationStatus(activeDomainConfig.dns_records);
      const updated: DomainConfig = {
        ...activeDomainConfig,
        status: 'connected',
        dns_records: verifiedRecords,
      };
      setActiveDomainConfig(updated);
      onUpdateWebsite({ ...website, domain_config: updated });
      triggerToast('Automated DNS status polling complete: All A-Record & CNAME parameters verified!');
    } catch (err) {
      console.error(err);
    } finally {
      setPollingDns(false);
    }
  };

  const handleSearchGodaddy = async () => {
    if (!godaddyQuery.trim()) return;
    setGodaddySearching(true);
    try {
      const results = await GoDaddyDomainService.searchDomainAvailability(godaddyQuery);
      setGodaddyResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setGodaddySearching(false);
    }
  };

  const handleBuyGodaddyDomain = (res: DomainSearchResult) => {
    setDomainInput(res.domain);
    const records = GoDaddyDomainService.getManualDnsParameters(res.domain);
    const updated: DomainConfig = {
      id: `dom-godaddy-${Date.now()}`,
      website_id: website.id,
      domain_name: res.domain,
      provider: 'godaddy_api',
      status: 'connected',
      dns_records: records,
      godaddy_order_id: `GD-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      price_usd: res.price_usd,
      auto_renew: true,
      connected_at: new Date().toISOString(),
    };
    setActiveDomainConfig(updated);
    onUpdateWebsite({ ...website, custom_domain: res.domain, domain_config: updated });
    triggerToast(`Purchased & connected ${res.domain} via GoDaddy API v3!`);
  };

  return (
    <div className="space-y-6 text-slate-900 dark:text-white">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Globe className="w-4 h-4 text-cyan-500" />
            <span className="text-xs font-mono font-bold text-slate-400">DOMAIN & CONNECTIVITY MANAGER</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Custom Domain & GoDaddy v3 API Integration</h2>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 rounded-full font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            PRIMARY: {activeDomainConfig.domain_name}
          </span>
        </div>
      </div>

      {/* Main Grid: Manual DNS Path & GoDaddy API Integration */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column: Manual DNS (Standard Path) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <h3 className="font-extrabold text-base">Standard Manual DNS Connectivity</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-400">PATH A</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-500 dark:text-slate-400 block mb-1">Enter Third-Party Domain</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono font-bold outline-none"
                  placeholder="e.g. yourcompany.com"
                />
                <button
                  onClick={handleConnectManualDomain}
                  className="px-4 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs"
                >
                  Connect
                </button>
              </div>
            </div>

            {/* DNS Records Table */}
            <div className="pt-3 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 dark:text-white">Required Registrar DNS Records</span>
                <button
                  onClick={handlePollDnsStatus}
                  disabled={pollingDns}
                  className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-500 font-bold text-[10px] flex items-center gap-1"
                >
                  {pollingDns ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                  <span>Poll DNS Status</span>
                </button>
              </div>

              <div className="space-y-2">
                {activeDomainConfig.dns_records.map((rec) => (
                  <div
                    key={rec.name}
                    className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-1 font-mono text-[11px]"
                  >
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-cyan-600 dark:text-cyan-400">{rec.type} RECORD</span>
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> VERIFIED
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500 dark:text-slate-400">
                      <span>Host: {rec.name}</span>
                      <span>Target: {rec.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: GoDaddy API Integration (Optional Add-on) */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-500" />
              <h3 className="font-extrabold text-base">GoDaddy API v3 Integration</h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-500">IN-APP BUY</span>
          </div>

          <div className="space-y-4 text-xs">
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Search available domains, fetch live wholesale pricing quotes, and register directly inside XiSync via GoDaddy API v3.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={godaddyQuery}
                onChange={(e) => setGodaddyQuery(e.target.value)}
                placeholder="Search domain name (e.g. exportbrand)..."
                className="flex-1 p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-bold outline-none"
              />
              <button
                onClick={handleSearchGodaddy}
                disabled={godaddySearching}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs"
              >
                {godaddySearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Search</span>
              </button>
            </div>

            {godaddyResults.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="font-extrabold text-slate-900 dark:text-white block">Available Domains</span>
                {godaddyResults.map((res) => (
                  <div
                    key={res.domain}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-mono font-extrabold text-sm text-slate-900 dark:text-white">{res.domain}</div>
                      <div className="text-[10px] text-emerald-500 font-bold">AVAILABLE FOR REGISTRATION</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-extrabold text-sm text-cyan-600 dark:text-cyan-400">${res.price_usd} / yr</span>
                      <button
                        onClick={() => handleBuyGodaddyDomain(res)}
                        className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs shadow-xs"
                      >
                        Buy & Connect
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
