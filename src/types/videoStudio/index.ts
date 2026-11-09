// ====================================================================================
// TypeScript Core Types: Product Video Studio (AI Video Ads - Google Veo)
// Per-SKU 8-30s product ad generation with Google Veo (Gemini Developer API /
// Vertex AI), tightly coupled to the XiSync product catalog and Creative Studio.
// ====================================================================================

/** Target social/ad surface for the generated ad — drives aspect ratio & pacing. */
export type VideoAdPlatform = 'TIKTOK' | 'META_REELS' | 'YOUTUBE_SHORTS' | 'GOOGLE_ADS' | 'LINKEDIN';

export type VideoAspectRatio = '9:16' | '16:9' | '1:1';

/** One of the ad "recipes" — a storyboard of Veo shots. */
export type VideoAdFormatId =
  | 'SELFIE_PRODUCT_INTRO' // UGC selfie-style product introduction (flagship 30s)
  | 'FACTORY_WAREHOUSE_TOUR' // 源头工厂/产线 capability tour
  | 'UNBOXING_POV' // POV unboxing & first impression
  | 'MACRO_PRODUCT_HERO' // Studio macro hero shots w/ kinetic typography
  | 'B2B_TESTIMONIAL' // Buyer testimonial / case-study style
  | 'TREND_MONTAGE'; // Fast-cut trend montage for short-form

/** Trending creative angle applied on top of any format's shot script. */
export type VideoTrendAngleId =
  | 'UGC_SELFIE'
  | 'KINETIC_TYPE'
  | 'CINEMATIC_SPEC'
  | 'CLEAN_COMMERCIAL'
  | 'MACRO_DETAIL'
  | 'MOTION_COMBO';

export type VideoJobStatus = 'QUEUED' | 'GENERATING' | 'READY' | 'FAILED';
export type SegmentStatus = 'QUEUED' | 'GENERATING' | 'READY' | 'FAILED';

/** One ~8s Veo clip inside the ad. Longer ads = several concatenated segments. */
export interface VideoAdSegment {
  index: number;
  status: SegmentStatus;
  /** Full English prompt sent to Veo for this shot. */
  prompt: string;
  /** Short human description of the shot. */
  shotLabel: string;
  /** Voice-over / on-screen text suggestion. */
  narration: string;
  operationName: string | null; // Long-running operation id returned by the API
  videoUrl: string | null; // Resulting mp4 (remote URL or blob/data)
  error: string | null;
}

export interface VideoAdJob {
  id: string;
  sku: string;
  productNameEn: string;
  formatId: VideoAdFormatId;
  angleId: VideoTrendAngleId;
  platform: VideoAdPlatform;
  aspectRatio: VideoAspectRatio;
  targetSeconds: number; // requested total length (e.g. 30)
  shots: number;
  status: VideoJobStatus;
  generatedBy: 'GOOGLE_VEO' | 'DEMO_SIMULATION'; // honest marker
  segments: VideoAdSegment[];
  finalVideoUrl: string | null;
  coverPosterUrl: string | null; // product image used as poster
  createdAt: string;
  finishedAt: string | null;
  error: string | null;
  log: string[];
}

export interface VideoAdFormat {
  id: VideoAdFormatId;
  label: string;
  labelZh: string;
  description: string;
  descriptionZh: string;
  defaultSeconds: 16 | 24 | 30;
  shots: number; // number of ~8s Veo clips (8s each)
  emoji: string;
}

export interface VideoTrendAngle {
  id: VideoTrendAngleId;
  label: string;
  labelZh: string;
  /** Style phrase injected into every shot prompt. */
  styleDirective: string;
}

export interface VideoPlatformProfile {
  id: VideoAdPlatform;
  label: string;
  aspectRatio: VideoAspectRatio;
  tip: string;
  tipsZh: string;
}

export interface VideoGenerationRequest {
  sku: string;
  formatId: VideoAdFormatId;
  angleId: VideoTrendAngleId;
  platform: VideoAdPlatform;
  referenceImageUrl?: string;
  customPromptPrefix?: string;
  customHookText?: string;
}

export interface VideoGenerationResult {
  job: VideoAdJob;
  usedDemoSimulation: boolean; // true when no API key / API call failed
  message: string;
}

// ------------------------------------------------------------------------------------
// Veo API configuration (editable inside the product - Settings)
// ------------------------------------------------------------------------------------
export interface VeoSettings {
  apiKey: string | null;
  /**
   * Model id used for generation. Current Gemini Developer API ids (paid tier):
   * veo-3.1-generate-preview · veo-3.1-fast-generate-preview · veo-3.1-lite-generate-preview
   * Vertex AI GA ids: veo-3.1-generate-001 · veo-3.1-fast-generate-001
   * (Veo 2.0 / 3.0 / 3 Fast were retired from the Gemini API on 2026-06-30.)
   */
  model: string;
  /** Which access path to use when a key is present. */
  access: 'GEMINI_DEVELOPER_API' | 'VERTEX_AI';
  region?: string; // Vertex: e.g. us-central1 (only supported region for Veo 3.1 GA)
  projectId?: string; // Vertex only
  personGeneration: 'ALLOW_ALL' | 'DONT_ALLOW' | 'ALLOW_ONLY_ACTORS';
  /** Output resolution. 8s clips at 720p/1080p/4k; resolution affects price & access. */
  resolution?: '720p' | '1080p' | '4k';
  /** Veo only produces 9:16 or 16:9 native (no 1:1). 1:1 UI targets are cropped client-side from 9:16. */
  timeoutSecPerSegment: number;
}
