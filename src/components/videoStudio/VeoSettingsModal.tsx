import { useState } from 'react';
import {
  X,
  KeyRound,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Loader2,
  Trash2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import {
  SUPPORTED_VEO_MODELS,
  VeoSettingsService,
  maskKey,
} from '../../lib/services/videoStudio/veoSettings';
import type { VeoSettings } from '../../types/videoStudio';

const GEMINI_MODELS_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

export function VeoSettingsModal({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}) {
  const [settings, setSettings] = useState<VeoSettings>(() => VeoSettingsService.load());
  const [keyInput, setKeyInput] = useState('');
  const [busy, setBusy] = useState<'test' | 'save' | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ kind: 'ok' | 'err' | 'info'; text: string } | null>(null);

  if (!open) return null;

  const patch = (p: Partial<VeoSettings>) => setSettings((prev) => ({ ...prev, ...p }));

  const save = () => {
    setBusy('save');
    window.setTimeout(() => {
      const next = VeoSettingsService.update({
        ...settings,
        apiKey: keyInput.trim() !== '' ? keyInput.trim() : settings.apiKey,
      });
      setSettings(next);
      setKeyInput('');
      setStatusMsg({ kind: 'ok', text: 'Settings saved. Veo video generation is now ' + (next.apiKey ? 'live (real Google Veo API).' : 'in DEMO simulation mode.') });
      setBusy(null);
      onSaved?.();
    }, 250);
  };

  const clearKey = () => {
    const next = VeoSettingsService.clearKey();
    setSettings(next);
    setKeyInput('');
    setStatusMsg({ kind: 'info', text: 'API key removed — generation falls back to DEMO simulation.' });
    onSaved?.();
  };

  const testConnection = async () => {
    const effectiveKey = keyInput.trim() !== '' ? keyInput.trim() : settings.apiKey;
    if (!effectiveKey) {
      setStatusMsg({
        kind: 'info',
        text: 'No API key set — the studio runs in DEMO simulation mode (produces sample clips labeled DEMO). Add a Google AI Studio key to generate real Veo videos.',
      });
      return;
    }
    setBusy('test');
    setStatusMsg(null);
    try {
      if (settings.access === 'GEMINI_DEVELOPER_API') {
        const res = await fetch(`${GEMINI_MODELS_ENDPOINT}?key=${encodeURIComponent(effectiveKey)}`);
        if (!res.ok) {
          setStatusMsg({ kind: 'err', text: `API rejected the key (HTTP ${res.status}). Check it at aistudio.google.com/apikey.` });
        } else {
          const data = (await res.json()) as { models?: Array<{ name: string }> };
          const hasVeo = (data.models ?? []).some((m) => m.name.includes('veo'));
          setStatusMsg({
            kind: 'ok',
            text: hasVeo
              ? `Key valid ✅ Veo model is available on this key (${data.models?.length ?? 0} models visible).`
              : `Key valid ✅ (${data.models?.length ?? 0} models visible) — no "veo" model listed, your key may need Veo access enabled (see plan limits at aistudio.google.com).`,
          });
        }
      } else {
        setStatusMsg({
          kind: 'info',
          text: 'Vertex AI needs a service-account/OAuth setup (ADC). For the in-product workflow, choose "Gemini Developer API" with an AI Studio key — identical Veo model, simpler auth.',
        });
      }
    } catch (err) {
      setStatusMsg({ kind: 'err', text: `Network error during test: ${err instanceof Error ? err.message : String(err)}` });
    } finally {
      setBusy(null);
    }
  };

  const inputCls =
    'w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-950/80 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-xisync-cyan-500 font-medium';
  const labelCls = 'block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-2xl max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-white">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">Google Veo — API Settings</h2>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">AI video generation for product ads</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {settings.apiKey && keyInput === '' && (
            <div className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Key configured · {maskKey(settings.apiKey)}
              </span>
              <button onClick={clearKey} className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 hover:underline">
                <Trash2 className="w-3 h-3" /> Remove
              </button>
            </div>
          )}

          <div>
            <label className={labelCls}>Google AI Studio API key</label>
            <input
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder={settings.apiKey ? `Replace key (current: ${maskKey(settings.apiKey)})` : 'AIza… (get one at aistudio.google.com/apikey)'}
              className={inputCls}
              autoComplete="off"
            />
            <div className="mt-1 flex items-center justify-between">
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" /> Stored only in this browser · masked in UI
              </span>
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[10px] font-bold text-xisync-cyan-600 dark:text-xisync-cyan-400 hover:underline"
              >
                Create key <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Model</label>
              <select value={settings.model} onChange={(e) => patch({ model: e.target.value })} className={inputCls}>
                {SUPPORTED_VEO_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Access path</label>
              <select
                value={settings.access}
                onChange={(e) => patch({ access: e.target.value as VeoSettings['access'] })}
                className={inputCls}
              >
                <option value="GEMINI_DEVELOPER_API">Gemini Developer API (API key)</option>
                <option value="VERTEX_AI">Vertex AI (Google Cloud)</option>
              </select>
            </div>
          </div>

          {settings.access === 'VERTEX_AI' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Region</label>
                <input value={settings.region ?? ''} onChange={(e) => patch({ region: e.target.value })} className={inputCls} placeholder="us-central1" />
              </div>
              <div>
                <label className={labelCls}>Project ID (Vertex)</label>
                <input value={settings.projectId ?? ''} onChange={(e) => patch({ projectId: e.target.value })} className={inputCls} placeholder="my-gcp-project" />
              </div>
            </div>
          )}

          <div>
            <label className={labelCls}>People in generated videos</label>
            <select
              value={settings.personGeneration}
              onChange={(e) => patch({ personGeneration: e.target.value as VeoSettings['personGeneration'] })}
              className={inputCls}
            >
              <option value="ALLOW_ALL">Allow people (recommended for UGC selfie ads)</option>
              <option value="ALLOW_ONLY_ACTORS">Only licensed actors</option>
              <option value="DONT_ALLOW">No people — product/warehouse only</option>
            </select>
          </div>

          {statusMsg && (
            <div
              className={`px-3 py-2.5 rounded-xl text-[11px] leading-relaxed font-medium border ${
                statusMsg.kind === 'ok'
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30'
                  : statusMsg.kind === 'err'
                    ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30'
                    : 'bg-sky-50 dark:bg-sky-500/10 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-500/30'
              }`}
            >
              {statusMsg.text}
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Button size="sm" variant="outline" loading={busy === 'test'} onClick={testConnection} icon={<Loader2 className="w-3.5 h-3.5" />}>
              Test connection
            </Button>
            <Button size="sm" loading={busy === 'save'} onClick={save}>
              Save settings
            </Button>
            <button onClick={onClose} className="ml-auto text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-200">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
