// ====================================================================================
// Veo API Settings (persisted, editable inside the product)
// Stores the Google AI Studio API key + preferred model for Veo generation in the
// browser (localStorage), mirroring how demo-mode settings are handled elsewhere.
// NEVER expose the full key in the UI - only a masked preview.
// ====================================================================================

import type { VeoSettings } from '../../../types/videoStudio';

const STORAGE_KEY = 'xisync_veo_settings_v1';

export const DEFAULT_VEO_MODEL = 'veo-3.1-generate-preview';
export const SUPPORTED_VEO_MODELS = [
  { id: 'veo-3.1-generate-preview', label: 'Google Veo 3.1 Preview (Gemini Developer API - Recommended)' },
  { id: 'veo-3.1-fast-generate-preview', label: 'Google Veo 3.1 Fast Preview (Low Latency)' },
  { id: 'veo-2.0-generate-001', label: 'Google Veo 2.0 (Gemini Developer API)' },
  { id: 'veo-3.0-generate-001', label: 'Google Veo 3.0 (Gemini Developer API)' },
  { id: 'veo-3.1-generate-001', label: 'Google Veo 3.1 GA (Google Cloud Vertex AI)' },
  { id: 'veo-3.1-fast-generate-001', label: 'Google Veo 3.1 Fast GA (Vertex AI)' },
] as const;

export const DEFAULT_SETTINGS: VeoSettings = {
  apiKey: null,
  model: DEFAULT_VEO_MODEL,
  access: 'GEMINI_DEVELOPER_API',
  region: 'us-central1',
  projectId: '',
  personGeneration: 'ALLOW_ALL',
  resolution: '1080p',
  timeoutSecPerSegment: 120,
};

export function maskKey(key: string | null): string {
  if (!key) return '';
  if (key.length <= 8) return '••••';
  return `${key.slice(0, 4)}••••••••${key.slice(-4)}`;
}

export class VeoSettingsService {
  private static current: VeoSettings | null = null;

  public static load(): VeoSettings {
    if (this.current) return this.current;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<VeoSettings>;
        this.current = { ...DEFAULT_SETTINGS, ...parsed };
        return this.current;
      }
    } catch {
      /* ignore corrupted storage */
    }
    this.current = { ...DEFAULT_SETTINGS };
    return this.current;
  }

  public static save(settings: VeoSettings): VeoSettings {
    this.current = { ...settings };
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.current));
    } catch {
      /* storage may be unavailable (private mode) - keep in-memory copy */
    }
    return this.current;
  }

  public static update(patch: Partial<VeoSettings>): VeoSettings {
    return this.save({ ...this.load(), ...patch });
  }

  public static hasApiKey(): boolean {
    const s = this.load();
    return Boolean(s.apiKey && s.apiKey.trim().length > 0);
  }

  public static maskedKey(): string {
    return maskKey(this.load().apiKey);
  }

  public static clearKey(): VeoSettings {
    return this.update({ apiKey: null });
  }
}
