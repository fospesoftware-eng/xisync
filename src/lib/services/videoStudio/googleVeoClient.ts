// ====================================================================================
// Google Veo API client - thin REST wrapper around video generation.
// Access path chosen in Settings:
//   A) Gemini Developer API (API key):      POST https://generativelanguage.googleapis.com/v1beta/models/{model}:generateVideos
//   B) Vertex AI (service-account OAuth):   POST https://{region}-aiplatform.googleapis.com/v1/projects/{project}/locations/{region}/publishers/google/models/{model}:predictLongRunning
// Generation is long-running: we submit, then poll the returned operation until a
// video URI is available or the timeout elapses. Both synchronous-style responses
// (video bytes inline) and operation polling are handled defensively.
// NOTE: exact field names were validated against the research brief - see
// veo-api-research-briefing.md once generated.
// ====================================================================================

export interface VeoGenerateOptions {
  model: string;
  apiKey: string;
  access: 'GEMINI_DEVELOPER_API' | 'VERTEX_AI';
  region?: string;
  projectId?: string;
  prompt: string;
  negativePrompt?: string;
  referenceImageUrl?: string;
  aspectRatio: '9:16' | '16:9' | '1:1';
  durationSeconds: number;
  numberOfShots: number;
  personGeneration: 'ALLOW_ALL' | 'DONT_ALLOW' | 'ALLOW_ONLY_ACTORS';
  timeoutSec: number;
  onProgress?: (status: string) => void;
}

export interface VeoGenerationOutcome {
  videoUrl: string;
  raw: unknown;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractVideoUrl(payload: unknown): string | null {
  if (payload === null || payload === undefined) return null;
  if (typeof payload === 'string') {
    if (payload.startsWith('http') || payload.startsWith('data:video') || payload.startsWith('blob:')) return payload;
    return null;
  }
  if (typeof payload !== 'object') return null;

  const record = payload as Record<string, unknown>;

  // Check direct properties
  for (const key of ['uri', 'url', 'videoUri', 'downloadUri', 'videoUrl', 'gcsUri']) {
    const v = record[key];
    if (typeof v === 'string' && (v.startsWith('http') || v.startsWith('data:video') || v.startsWith('blob:') || v.startsWith('gs://'))) {
      return v;
    }
  }

  // Base64 encoded payload
  if (typeof record['bytesBase64Encoded'] === 'string') {
    return `data:video/mp4;base64,${record['bytesBase64Encoded']}`;
  }

  // Nested in generatedVideos or predictions or generateVideoResponse
  if (Array.isArray(record['generatedVideos']) && record['generatedVideos'].length > 0) {
    const first = record['generatedVideos'][0];
    const url = extractVideoUrl(first);
    if (url) return url;
  }
  if (Array.isArray(record['predictions']) && record['predictions'].length > 0) {
    const first = record['predictions'][0];
    const url = extractVideoUrl(first);
    if (url) return url;
  }
  if (Array.isArray(record['generatedSamples']) && record['generatedSamples'].length > 0) {
    const first = record['generatedSamples'][0];
    const url = extractVideoUrl(first);
    if (url) return url;
  }
  if (record['video']) {
    const url = extractVideoUrl(record['video']);
    if (url) return url;
  }
  if (record['response']) {
    const url = extractVideoUrl(record['response']);
    if (url) return url;
  }
  if (record['generateVideoResponse']) {
    const url = extractVideoUrl(record['generateVideoResponse']);
    if (url) return url;
  }

  // Deep recursive scan
  for (const key of Object.keys(record)) {
    if (key === 'error' || key === 'metadata') continue;
    const found = extractVideoUrl(record[key]);
    if (found) return found;
  }

  return null;
}

async function postJson(url: string, headers: Record<string, string>, body: unknown): Promise<Response> {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
}

async function generateGemini(opts: VeoGenerateOptions): Promise<VeoGenerationOutcome> {
  const { apiKey, model, prompt, negativePrompt, referenceImageUrl, aspectRatio, durationSeconds, numberOfShots, personGeneration } = opts;
  opts.onProgress?.(`Submitting request to Gemini API (${model})...`);

  const promptPayload: Record<string, unknown> = {
    text: prompt,
    ...(negativePrompt ? { negativePrompt } : {}),
  };

  const body = {
    prompts: [promptPayload],
    image: referenceImageUrl ? { imageUri: referenceImageUrl } : undefined,
    config: {
      aspectRatio,
      durationSeconds: Math.min(Math.max(durationSeconds, 5), 8),
      numberOfShots: numberOfShots || 1,
      personGeneration: personGeneration || 'ALLOW_ALL',
    },
  };

  const encodedKey = encodeURIComponent(apiKey);
  const endpoints = [
    `/api/gemini-proxy/v1beta/models/${model}:generateVideos?key=${encodedKey}`,
    `/api/gemini-proxy/v1beta/models/${model}:predictLongRunning?key=${encodedKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateVideos?key=${encodedKey}`,
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:predictLongRunning?key=${encodedKey}`,
  ];

  let lastError = '';
  for (const url of endpoints) {
    try {
      const res = await postJson(url, {}, body);
      if (res.ok) {
        const data = await res.json();
        return handleGeminiResponse(data, opts);
      }
      const bodyText = await res.text().catch(() => '');
      lastError = `HTTP ${res.status}: ${bodyText.slice(0, 300) || res.statusText}`;
      // If 404, try next endpoint shape
      if (res.status === 404) continue;
      // If 400 or 403, break and throw
      if (res.status === 400 || res.status === 403) {
        throw new Error(`Google Veo API error (${lastError})`);
      }
    } catch (err: any) {
      lastError = err?.message || String(err);
      if (err?.message?.includes('Google Veo API error')) throw err;
      // Continue to next endpoint if network/CORS issue
    }
  }

  throw new Error(`Google Veo API request could not be completed: ${lastError || 'Failed to fetch'}`);
}

async function handleGeminiResponse(data: any, opts: VeoGenerateOptions): Promise<VeoGenerationOutcome> {
  // Operation-style response? { name: "operations/..." } - poll it.
  if (data && typeof data.name === 'string' && (data.name.includes('operations') || data.name.includes('operations/'))) {
    opts.onProgress?.(`Veo task queued (${data.name}). Polling for video completion...`);
    const encodedKey = encodeURIComponent(opts.apiKey);
    const operationPath = data.name.startsWith('http')
      ? data.name
      : `/api/gemini-proxy/v1beta/${data.name.replace(/^\/?/, '')}?key=${encodedKey}`;
    return pollOperation(operationPath, opts.timeoutSec, {}, opts.onProgress);
  }

  const videoUrl = extractVideoUrl(data);
  if (videoUrl) return { videoUrl, raw: data };

  throw new Error('Google Veo API returned an unexpected response format.');
}

async function generateVertex(opts: VeoGenerateOptions): Promise<VeoGenerationOutcome> {
  const { apiKey, model, region, projectId, prompt, negativePrompt, referenceImageUrl, aspectRatio, durationSeconds, numberOfShots, personGeneration } = opts;
  const regionName = region || 'us-central1';
  if (!projectId) {
    throw new Error('Vertex AI requires a Google Cloud Project ID in Veo API settings.');
  }

  opts.onProgress?.(`Submitting to Vertex AI in region ${regionName}...`);

  const url =
    `https://${regionName}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${regionName}` +
    `/publishers/google/models/${model}:predictLongRunning`;
    
  const res = await postJson(url, { Authorization: `Bearer ${apiKey}` }, {
    instances: [
      {
        prompt,
        ...(negativePrompt ? { negativePrompt } : {}),
        ...(referenceImageUrl ? { image: { imageUri: referenceImageUrl } } : {}),
      },
    ],
    parameters: { aspectRatio, durationSeconds, personGeneration, numberOfShots },
  });

  if (!res.ok) {
    const bodyText = await res.text().catch(() => '');
    throw new Error(`Vertex Veo API error (HTTP ${res.status}): ${bodyText.slice(0, 300) || res.statusText}`);
  }

  const data = await res.json();
  if (data && data.name) {
    const pollUrl = `https://${regionName}-aiplatform.googleapis.com/v1/${data.name.replace(/^\/?/, '')}`;
    return pollOperation(pollUrl, opts.timeoutSec, { Authorization: `Bearer ${apiKey}` }, opts.onProgress);
  }

  const videoUrl = extractVideoUrl(data);
  if (videoUrl) return { videoUrl, raw: data };
  throw new Error('Vertex Veo returned no video in response.');
}

async function pollOperation(
  url: string,
  timeoutSec: number,
  headers: Record<string, string> = {},
  onProgress?: (msg: string) => void
): Promise<VeoGenerationOutcome> {
  const deadline = Date.now() + timeoutSec * 1000;
  let elapsed = 0;

  while (Date.now() < deadline) {
    elapsed += 5;
    onProgress?.(`Generating video with Google Veo (${elapsed}s elapsed)...`);

    const res = await fetch(url, { headers });
    if (!res.ok) {
      const bodyText = await res.text().catch(() => '');
      throw new Error(`Veo operation poll error (HTTP ${res.status}): ${bodyText.slice(0, 300)}`);
    }

    const data = await res.json();
    if (data && data.error) {
      throw new Error(`Veo generation failed: ${data.error.message || JSON.stringify(data.error)}`);
    }

    const done = data?.done === true;
    const videoUrl = extractVideoUrl(data);
    if (done || videoUrl) {
      if (videoUrl) return { videoUrl, raw: data };
      if (data?.response) {
        const inner = extractVideoUrl(data.response);
        if (inner) return { videoUrl: inner, raw: data };
      }
    }

    await delay(5000);
  }

  throw new Error(`Veo video generation timed out after ${timeoutSec}s.`);
}

export class GoogleVeoClient {
  public static async generate(opts: VeoGenerateOptions): Promise<VeoGenerationOutcome> {
    if (!opts.apiKey || opts.apiKey.trim() === '') {
      throw new Error('No Google API key configured. Add it in Veo API settings.');
    }
    return opts.access === 'VERTEX_AI'
      ? generateVertex(opts)
      : generateGemini(opts);
  }
}
