import { useState } from 'react';
import { Website } from '../../types/websiteBuilder';
import {
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
  Copy,
  Check,
  X,
  Lock,
} from 'lucide-react';
import { PublishedWebsiteView } from '../../pages/public/PublishedWebsiteView';

interface DevicePreviewModalProps {
  website: Website;
  onClose: () => void;
}

export function DevicePreviewModal({ website, onClose }: DevicePreviewModalProps) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);

  const previewUrl = `${window.location.origin}/site/${website.subdomain.split('.')[0] || 'exportco'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(previewUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getContainerWidth = () => {
    switch (device) {
      case 'mobile':
        return 'max-w-[390px] h-[780px]';
      case 'tablet':
        return 'max-w-[768px] h-[850px]';
      case 'desktop':
      default:
        return 'w-full h-[90vh]';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-2 md:p-6 animate-in fade-in">
      <div className="w-full max-w-7xl h-full flex flex-col space-y-4">
        {/* Header Toolbar with Device Switcher & URL Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
          {/* Left: Device Switchers */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setDevice('desktop')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                device === 'desktop' ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                device === 'tablet' ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tablet className="w-4 h-4" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              onClick={() => setDevice('mobile')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                device === 'mobile' ? 'bg-cyan-500 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>

          {/* Center: Live URL Address Bar */}
          <div className="flex-1 max-w-lg mx-auto flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-bold truncate">
              https://{website.custom_domain || website.subdomain}
            </span>
          </div>

          {/* Right: Copy Link, Open Tab, Close */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-all flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Link!' : 'Copy Preview URL'}</span>
            </button>

            <a
              href={previewUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-xisync-blue-600 to-xisync-cyan-500 text-white font-extrabold text-xs shadow-xs hover:opacity-90 transition-all flex items-center gap-1.5"
            >
              <span>Open in New Tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Live Device Frame Container */}
        <div className="flex-1 flex items-center justify-center overflow-hidden bg-slate-950/60 rounded-3xl border border-slate-800/80 p-2">
          <div
            className={`${getContainerWidth()} mx-auto rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950 transition-all duration-300 overflow-y-auto`}
          >
            <PublishedWebsiteView />
          </div>
        </div>
      </div>
    </div>
  );
}
