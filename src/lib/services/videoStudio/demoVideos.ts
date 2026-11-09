// ====================================================================================
// Shared demo video assets used when no real Veo API key is configured. Marked as
// DEMO everywhere in the UI so nobody mistakes simulation for a real generation.
// ====================================================================================

export const DEMO_VIDEO_SAMPLES: string[] = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
];

export function demoVideoUrlForSegment(index: number): string {
  return DEMO_VIDEO_SAMPLES[index % DEMO_VIDEO_SAMPLES.length];
}
