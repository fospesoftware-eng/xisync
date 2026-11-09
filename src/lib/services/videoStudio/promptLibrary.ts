// ====================================================================================
// Product Video Studio - Prompt Library
// Ad recipes (storyboards of 8s Veo shots), trending style angles and platform
// profiles. Each shot prompt is assembled from the product's own data + format +
// angle so "against each product" you get a unique, on-brand 30s/24s/16s ad.
// ====================================================================================

import type {
  VideoAdFormat,
  VideoTrendAngle,
  VideoTrendAngleId,
  VideoPlatformProfile,
  VideoAspectRatio,
} from '../../../types/videoStudio';
import type { XisyncProduct } from '../../../types/marketplace';

export const VIDEO_AD_FORMATS: VideoAdFormat[] = [
  {
    id: 'SELFIE_PRODUCT_INTRO',
    label: 'Selfie Product Introduction',
    labelZh: '自拍产品介绍 (UGC)',
    description: 'Creator-style selfie intro — trending on TikTok/Reels/Shorts. Best for new product launches.',
    descriptionZh: '博主自拍式产品种草开场，短视频平台当季爆款风格，适合新品发布。',
    defaultSeconds: 30,
    shots: 4,
    emoji: '🤳',
  },
  {
    id: 'FACTORY_WAREHOUSE_TOUR',
    label: 'Factory & Warehouse Tour',
    labelZh: '工厂与仓库实拍巡礼',
    description: 'Cinematic capability tour of factory floor, QC line and export warehouse. Builds B2B trust.',
    descriptionZh: '厂区产线 + QC + 出口仓库的影片级巡礼，建立 B2B 信任感。',
    defaultSeconds: 30,
    shots: 4,
    emoji: '🏭',
  },
  {
    id: 'UNBOXING_POV',
    label: 'POV Unboxing & First Look',
    labelZh: '第一视角开箱',
    description: 'Handheld unboxing POV with genuine reactions. Converts catalog browsers to inquiries.',
    descriptionZh: '手持开箱第一视角 + 真实反应，把浏览者转化为询盘。',
    defaultSeconds: 24,
    shots: 3,
    emoji: '📦',
  },
  {
    id: 'MACRO_PRODUCT_HERO',
    label: 'Macro Product Hero',
    labelZh: '微距产品大片',
    description: 'Slow-motion macro beauty shots with kinetic typography overlays. Premium commercial feel.',
    descriptionZh: '微距慢镜产品大片 + 动态字体排版，高级商业广告质感。',
    defaultSeconds: 24,
    shots: 3,
    emoji: '🎥',
  },
  {
    id: 'B2B_TESTIMONIAL',
    label: 'B2B Buyer Testimonial',
    labelZh: 'B2B 买家证言',
    description: 'Importer/distributor case-study style: pain point → solution → container order. FOB terms on end card.',
    descriptionZh: '进口商/分销商案例型证言：痛点 → 方案 → 整柜下单，结尾卡片强调贸易条款。',
    defaultSeconds: 30,
    shots: 4,
    emoji: '💬',
  },
  {
    id: 'TREND_MONTAGE',
    label: 'Trend Montage',
    labelZh: '热点混剪卡点',
    description: 'Fast-cut montage synced to trending music for maximum short-form reach.',
    descriptionZh: '快速切换蒙太奇卡点流行音乐，最大化短视频触达。',
    defaultSeconds: 16,
    shots: 2,
    emoji: '⚡',
  },
];

export const VIDEO_TREND_ANGLES: VideoTrendAngle[] = [
  {
    id: 'UGC_SELFIE',
    label: 'UGC selfie / handheld',
    labelZh: 'UGC 自拍手持',
    styleDirective:
      'Handheld smartphone selfie camera, natural window light, authentic young creator energy, subtly grainy UGC look, looking directly into the lens while showing the product.',
  },
  {
    id: 'KINETIC_TYPE',
    label: 'Kinetic typography',
    labelZh: '动态字体排版',
    styleDirective:
      'Bold kinetic typography and punchy motion-graphic text overlays, snappy speed-ramp cuts, high-energy transitions synced to a driving beat.',
  },
  {
    id: 'CINEMATIC_SPEC',
    label: 'Cinematic spec',
    labelZh: '电影级产品片',
    styleDirective:
      'Cinematic color grade, shallow depth of field, precise gimbal moves, soft key light with gentle haze, premium slow-motion finish.',
  },
  {
    id: 'CLEAN_COMMERCIAL',
    label: 'Clean commercial',
    labelZh: '纯净商业片',
    styleDirective:
      'Clean minimal studio commercial: seamless white/neutral backdrop, bright even lighting, crisp product geometry, subtle reflections.',
  },
  {
    id: 'MACRO_DETAIL',
    label: 'Extreme macro detail',
    labelZh: '极致微距细节',
    styleDirective:
      'Extreme macro and extreme close-up detail shots of materials, seams, ports and craftsmanship, with slow drift and focus pulls.',
  },
  {
    id: 'MOTION_COMBO',
    label: 'Product + people combo',
    labelZh: '人景结合运镜',
    styleDirective:
      'Combines lifestyle context and product close-ups with smooth orbit motion and a confident color palette.',
  },
];

export const VIDEO_PLATFORM_PROFILES: VideoPlatformProfile[] = [
  { id: 'TIKTOK', label: 'TikTok', aspectRatio: '9:16', tip: '9:16 vertical, first 1.5s hook is critical', tipsZh: '9:16 竖版，前 1.5 秒钩子决定完播率' },
  { id: 'META_REELS', label: 'Instagram Reels / Facebook', aspectRatio: '9:16', tip: '9:16 vertical with captions on screen', tipsZh: '9:16 竖版，字幕需常驻屏幕' },
  { id: 'YOUTUBE_SHORTS', label: 'YouTube Shorts', aspectRatio: '9:16', tip: '9:16 vertical, loop-friendly ending', tipsZh: '9:16 竖版，结尾适合循环播放' },
  { id: 'GOOGLE_ADS', label: 'Google Ads (YouTube/DV360)', aspectRatio: '16:9', tip: '16:9 landscape, logo + CTA end card', tipsZh: '16:9 横版，结尾品牌卡 + CTA' },
  { id: 'LINKEDIN', label: 'LinkedIn feed', aspectRatio: '1:1', tip: '1:1 square, professional tone, subtitles', tipsZh: '1:1 方形，专业口吻并配字幕' },
];

export const DEFAULT_ASPECT_RATIO_BY_PLATFORM: Record<VideoPlatformProfile['id'], VideoAspectRatio> = {
  TIKTOK: '9:16',
  META_REELS: '9:16',
  YOUTUBE_SHORTS: '9:16',
  GOOGLE_ADS: '16:9',
  LINKEDIN: '1:1',
};

export function formatById(id: VideoAdFormat['id']): VideoAdFormat {
  return VIDEO_AD_FORMATS.find((f) => f.id === id) ?? VIDEO_AD_FORMATS[0];
}

export function angleById(id: VideoTrendAngleId): VideoTrendAngle {
  return VIDEO_TREND_ANGLES.find((a) => a.id === id) ?? VIDEO_TREND_ANGLES[0];
}

export function platformById(id: VideoPlatformProfile['id']): VideoPlatformProfile {
  return VIDEO_PLATFORM_PROFILES.find((p) => p.id === id) ?? VIDEO_PLATFORM_PROFILES[0];
}

export function aspectRatioFor(platform: VideoPlatformProfile['id']): VideoAspectRatio {
  return DEFAULT_ASPECT_RATIO_BY_PLATFORM[platform] ?? '16:9';
}

// ------------------------------------------------------------------------------------
// Shot storyboards (narration + per-shot seed description). The Veo prompt is built
// by interpolating the product's real attributes into each shot's template.
// ------------------------------------------------------------------------------------

interface ShotTemplate {
  shotLabel: string;
  narration: string;
  /** {product}, {category}, {markets}, {cert} placeholders get replaced. */
  scene: string;
}

const STORYBOARDS: Record<VideoAdFormat['id'], ShotTemplate[]> = {
  SELFIE_PRODUCT_INTRO: [
    {
      shotLabel: 'Hook — selfie intro',
      narration: '“This is the {product} — and here is why importers keep reordering it.”',
      scene:
        'Young supplier sales creator holds {product} up to a phone selfie camera in a bright modern export office, looks into the lens and starts speaking energetically; genuine UGC vlog feel; text overlay “Factory direct · {cert}”',
    },
    {
      shotLabel: 'Feature pass — in hand',
      narration: '“Check the build — {category} quality you can feel.”',
      scene:
        'Close handheld pass showing key features and craftsmanship of the {product}; fingers point at details; quick punch-in cuts; overlay bullet text of key spec highlights.',
    },
    {
      shotLabel: 'Proof — stock & MOQ',
      narration: '“Ready stock, MOQ from {moq}, shipped to {markets}.”',
      scene:
        'Pans across neat export warehouse shelves stacked with {product} cartons and a QC table with a measuring gauge; confident creator voice; text: “MOQ {moq} · FOB Shenzhen”.',
    },
    {
      shotLabel: 'CTA end card',
      narration: '“DM me for the wholesale catalog and free samples.”',
      scene:
        'Creator returns to selfie framing, smiles, points to a call-to-action end card with the brand logo and WhatsApp/website URL; text overlay: “Request Wholesale Catalog”.',
    },
  ],
  FACTORY_WAREHOUSE_TOUR: [
    {
      shotLabel: 'Aerial factory establishing',
      narration: '“Inside our {category} factory — 12 production lines.”',
      scene:
        'Slow cinematic aerial/drone-style establishing shot sweeping over a modern manufacturing facility while workers move {product} along clean assembly lines; subtle dust and warm grade.',
    },
    {
      shotLabel: 'Production & QC line',
      narration: '“Every unit passes {cert} QC before it ships.”',
      scene:
        'Documentary-style gimbal walk-through past CNC/machinery stations and engineers testing {product} with gauges and instruments; overlay “ISO/CE certified QC”.',
    },
    {
      shotLabel: 'Warehouse & export pack',
      narration: '“Container-loading export warehouse, MOQ {moq}.”',
      scene:
        'Wide push-in toward pallet racking stacked with shrink-wrapped {product}; forklift loading an export container; end-of-shot focus on carton markings.',
    },
    {
      shotLabel: 'Team & CTA',
      narration: '“Your OEM partner in Shenzhen — request a quote today.”',
      scene:
        'Friendly factory sales team waves from the warehouse floor as the camera pulls back, brand logo fades in with “Request Wholesale Catalog / FOB Shenzhen” end card.',
    },
  ],
  UNBOXING_POV: [
    {
      shotLabel: 'Box reveal',
      narration: '“Okay, first look at this {product} from our supplier.”',
      scene:
        'First-person POV hands unbox a shipping carton containing {product}; genuine curious reaction, tearing tape and opening branded packaging; natural home-office light.',
    },
    {
      shotLabel: 'First impression & setup',
      narration: '“Feels premium — let’s see it in action.”',
      scene:
        'POV hands lift {product}, rotate it slowly to camera light, then demonstrate it working/setting up on a desk; macro inserts of buttons, ports and finish.',
    },
    {
      shotLabel: 'Verdict + CTA',
      narration: '“For importers: request samples via the wholesale catalog.”',
      scene:
        'POV places {product} neatly on the desk and thumbs-up; text end card with brand, website and “Request Sample” CTA.',
    },
  ],
  MACRO_PRODUCT_HERO: [
    {
      shotLabel: 'Macro texture open',
      narration: '— (music / SFX only)',
      scene:
        'Extreme macro slow-motion of {product} material texture and edges with light sweeping across surface; floating specks, shallow focus, elegant color grade.',
    },
    {
      shotLabel: 'Geometry & assembly',
      narration: '— (music / SFX only)',
      scene:
        'Macro dolly and orbit around {product} showing precise geometry, seams and craftsmanship; subtle smoke/light rays; kinetic typography reveals key spec words.',
    },
    {
      shotLabel: 'Hero reveal & logo',
      narration: '“{product} — {category} engineered for export.”',
      scene:
        'The {product} hero shot settles on a clean neutral backdrop, soft reflection beneath; bold kinetic typography writes the product name and “FOB Shenzhen · {cert}”; logo end card.',
    },
  ],
  B2B_TESTIMONIAL: [
    {
      shotLabel: 'Pain point intro',
      narration: '“We kept missing delivery windows with our old supplier.”',
      scene:
        'A professional importer/distributor talks to camera from their office, slight frustration then engagement; B-roll cuts of spreadsheets and shipments; subtitle captions.',
    },
    {
      shotLabel: 'Solution with product',
      narration: '“Then we switched to {product} from this factory — night and day.”',
      scene:
        'Importer holds or gestures to the {product}, warehouse b-roll shows cartons arriving; on-screen captions repeat key claims; brand trust tone.',
    },
    {
      shotLabel: 'Results & metrics',
      narration: '“Consistent QC, MOQ {moq}, on-time every container.”',
      scene:
        'Split-screen b-roll: QC checks, container loading, a satisfied handshake at the trade show; kinetic data captions appear (“+38% reorder rate” style is not claimed — use generic factual overlays).',
    },
    {
      shotLabel: 'CTA end card',
      narration: '“Ready to switch? Get the wholesale catalog.”',
      scene:
        'Importer smiles and nods to camera; clean end card with brand logo and “Request Wholesale Catalog” CTA and website.',
    },
  ],
  TREND_MONTAGE: [
    {
      shotLabel: 'Fast intro beats',
      narration: '— (trending audio)',
      scene:
        'Ultra fast-cut montage (0.5-1s shots) flashing {product} details, factory sparks and boxes to a trending beat; flash-frame text pop-ins of “Factory Direct”.',
    },
    {
      shotLabel: 'Peak & end card',
      narration: '— (trending audio)',
      scene:
        'Beat drop reveals the {product} hero shot with kinetic typography and a hand pointing to “Request Catalog” end card; loop-friendly final frame.',
    },
  ],
};

export interface VideoHookOption {
  id: string;
  name: string;
  nameZh: string;
  category: string;
  templateEn: (p: XisyncProduct) => string;
  templateZh: (p: XisyncProduct) => string;
}

export const EXPORT_HOOK_TEMPLATES: VideoHookOption[] = [
  {
    id: 'FACTORY_DIRECT',
    name: 'Direct Manufacturer Reveal',
    nameZh: '源头工厂直销降本',
    category: 'Price & Margin',
    templateEn: (p) => `Stop paying 3x markup to trading middlemen. Here is how direct factory sourcing for ${p.nameEn} works at $${p.priceUsd.toFixed(2)}/unit.`,
    templateZh: (p) => `告别中间商 3 倍溢价！源头工厂直供 ${p.nameZh}，单价仅 $${p.priceUsd.toFixed(2)}。`,
  },
  {
    id: 'PRICE_MOQ',
    name: 'Low Container MOQ Advantage',
    nameZh: '小批量整柜拼箱 MOQ',
    category: 'MOQ / Logistics',
    templateEn: (p) => `Looking for ${p.category} with low MOQ? This ${p.sku} is ready to ship with MOQ ${p.moq} ${p.unit} starting at $${p.priceUsd.toFixed(2)}.`,
    templateZh: (p) => `寻找低起订量 ${p.category}？${p.sku} 现货支持 ${p.moq} ${p.unit} 起订，支持拼箱与整柜。`,
  },
  {
    id: 'QUALITY_PROOF',
    name: 'Certifications & Lab Proof',
    nameZh: '国际认证与严苛质检',
    category: 'Trust & Compliance',
    templateEn: (p) => `100% verified ${p.certifications.join(' & ')} compliant! See why top global buyers in ${p.targetMarkets.join(', ')} trust ${p.sku}.`,
    templateZh: (p) => `全项通过 ${p.certifications.join('/')} 认证！${p.targetMarkets.join('、')} 头部买家信赖的 ${p.sku} 实测表现。`,
  },
  {
    id: 'UNBOXING',
    name: 'POV First Look & QC Inspection',
    nameZh: '第一视角开箱实测',
    category: 'Product Experience',
    templateEn: (p) => `First unboxing of the ${p.nameEn} straight off our ISO9001 production line. Check the finish and build quality.`,
    templateZh: (p) => `产线直出！第一视角开箱实测 ${p.nameZh}，近距离看工艺与做工细节。`,
  },
  {
    id: 'PAIN_POINT',
    name: 'Importer Problem Solver',
    nameZh: '解决交期与品质痛点',
    category: 'B2B Solution',
    templateEn: (p) => `Tired of delayed shipments and failed quality audits? Here is why ${p.sku} has a 99.8% repeat order rate.`,
    templateZh: (p) => `受够了交期延误与质检不达标？看看 ${p.sku} 99.8% 复购率背后的品控体系。`,
  },
];

export interface ShotScript {
  shotLabel: string;
  narration: string;
  prompt: string;
}

/** Builds the full per-shot Veo prompt set for a product + format + angle + hook. */
export function buildShotScripts(
  product: XisyncProduct,
  formatId: VideoAdFormat['id'],
  angleId: VideoTrendAngleId,
  aspectRatio: VideoAspectRatio,
  customHookText?: string
): ShotScript[] {
  const angle = angleById(angleId);
  const storyboard = STORYBOARDS[formatId];

  const cert = product.certifications.length > 0 ? product.certifications.join('/') : 'ISO-compliant';
  const markets = product.targetMarkets.slice(0, 3).join(', ') || 'US/EU';
  const fill = (s: string) =>
    s
      .split('{product}').join(product.nameEn)
      .split('{category}').join(product.category)
      .split('{markets}').join(markets)
      .split('{cert}').join(cert)
      .split('{moq}').join(String(product.moq));

  return storyboard.map((t, idx) => {
    let narration = fill(t.narration);
    // If it's the first shot (hook) and a custom hook is provided, use it!
    if (idx === 0 && customHookText && customHookText.trim() !== '') {
      narration = customHookText.trim();
    }

    const scene = fill(t.scene);
    const prompt = [
      `Create a ${aspectRatio} AI product-ad video shot for ${product.nameEn} (${product.sku}).`,
      angle.styleDirective,
      scene,
      `Product reference features: ${product.descriptionEn}. Certifications: ${cert}.`,
      `Keep all on-screen text in English. No third-party trademarks.`,
      `Realistic physics and materials; high detail; professional commercial video quality.`,
    ].join(' ');

    return {
      shotLabel: t.shotLabel,
      narration,
      prompt,
    };
  });
}
