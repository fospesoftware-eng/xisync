import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Download,
  Sparkles,
} from 'lucide-react';
import { Button } from '../ui/Button';
import type { VideoAdJob, VideoAspectRatio } from '../../types/videoStudio';
import type { XisyncProduct } from '../../types/marketplace';

interface AdVideoPlayerProps {
  product: XisyncProduct;
  job: VideoAdJob;
  currentSegmentIndex: number;
  aspectRatio: VideoAspectRatio;
  onSegmentChange: (index: number) => void;
  onDeployToMediaBuyer?: () => void;
}

export function AdVideoPlayer({
  product,
  job,
  currentSegmentIndex,
  aspectRatio,
  onSegmentChange,
  onDeployToMediaBuyer,
}: AdVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [, setProgress] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeSegment = job.segments[currentSegmentIndex] || job.segments[0];

  const hasRealVeoVideo =
    Boolean(activeSegment?.videoUrl) &&
    !activeSegment.videoUrl?.includes('gtv-videos-bucket') &&
    job.generatedBy === 'GOOGLE_VEO';

  const segmentDuration = 8;

  // Spoken narration speech synthesis
  useEffect(() => {
    if (!isPlaying || isMuted || hasRealVeoVideo || typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    if (activeSegment?.narration) {
      const utterance = new SpeechSynthesisUtterance(activeSegment.narration);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentSegmentIndex, isPlaying, isMuted, activeSegment, hasRealVeoVideo]);

  // Dynamic canvas animation loop for product-aware visuals
  useEffect(() => {
    if (hasRealVeoVideo) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let startTime = performance.now();
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = product.imageUrls[0] || 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=800&q=80';

    let isRunning = true;

    const render = (now: number) => {
      if (!isRunning) return;

      const elapsedSec = ((now - startTime) / 1000) % segmentDuration;
      const progressRatio = elapsedSec / segmentDuration;
      setProgress(progressRatio * 100);

      // Auto-advance segment if loop ends
      if (isPlaying && elapsedSec < 0.05 && now - startTime > 1000) {
        const nextIdx = (currentSegmentIndex + 1) % job.segments.length;
        onSegmentChange(nextIdx);
        startTime = now;
      }

      const w = canvas.width;
      const h = canvas.height;

      // 1. Background dark gradient
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, w, h);

      // 2. Animated Product Image with Cinematic Motion (Ken-Burns Pan / Zoom)
      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        const zoom = 1.05 + Math.sin(progressRatio * Math.PI) * 0.12;
        const panX = Math.sin(progressRatio * Math.PI * 2) * 12;
        const panY = Math.cos(progressRatio * Math.PI * 2) * 8;

        ctx.translate(w / 2 + panX, h / 2 + panY - 30);
        ctx.scale(zoom, zoom);

        const imgAspect = (img.naturalWidth || 1) / (img.naturalHeight || 1);
        let drawW = w * 0.85;
        let drawH = drawW / imgAspect;
        if (drawH > h * 0.55) {
          drawH = h * 0.55;
          drawW = drawH * imgAspect;
        }

        ctx.shadowColor = 'rgba(0, 240, 255, 0.3)';
        ctx.shadowBlur = 35;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      } else {
        ctx.save();
        ctx.translate(w / 2, h / 2 - 30);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-120, -120, 240, 240);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.strokeRect(-120, -120, 240, 240);
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(product.sku, 0, -10);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(product.nameEn.slice(0, 28), 0, 20);
        ctx.restore();
      }

      // 3. Cinematic lighting gradient overlays
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, 'rgba(10, 15, 30, 0.85)');
      grad.addColorStop(0.3, 'rgba(10, 15, 30, 0.1)');
      grad.addColorStop(0.7, 'rgba(10, 15, 30, 0.4)');
      grad.addColorStop(1, 'rgba(5, 8, 18, 0.95)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // 4. Header Badge
      ctx.save();
      ctx.fillStyle = 'rgba(0, 229, 255, 0.15)';
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.6)';
      ctx.lineWidth = 1.5;
      const badgeW = 230;
      const badgeH = 28;
      const badgeX = (w - badgeW) / 2;
      const badgeY = 20;
      ctx.beginPath();
      ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#00f0ff';
      ctx.font = 'bold 11px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        `● SHOT ${currentSegmentIndex + 1}/${job.segments.length}: ${activeSegment?.shotLabel?.toUpperCase() || 'AD HOOK'}`,
        w / 2,
        badgeY + badgeH / 2
      );
      ctx.restore();

      // 5. Product Price & Certifications Bar
      ctx.save();
      const cardY = h - 210;
      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(18, cardY, w - 36, 52, 14);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(product.nameEn.length > 28 ? product.nameEn.slice(0, 28) + '…' : product.nameEn, 32, cardY + 22);

      ctx.fillStyle = '#10b981';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(`$${product.priceUsd.toFixed(2)}/u`, 32, cardY + 40);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px system-ui, sans-serif';
      ctx.fillText(`· MOQ ${product.moq} ${product.unit} · ${product.certifications.join('/')}`, 108, cardY + 40);
      ctx.restore();

      // 6. Kinetic Spoken Subtitles (Dynamic TikTok / Reels Caption Card)
      ctx.save();
      const subBoxY = h - 142;
      const subBoxH = 76;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(16, subBoxY, w - 32, subBoxH, 16);
      ctx.fill();
      ctx.stroke();

      const narrationText = activeSegment?.narration ? `“${activeSegment.narration}”` : `“${product.nameEn}”`;
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 13px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const words = narrationText.split(' ');
      let line1 = '';
      let line2 = '';
      for (const word of words) {
        if (ctx.measureText(line1 + ' ' + word).width < w - 50 && !line2) {
          line1 += (line1 ? ' ' : '') + word;
        } else {
          line2 += (line2 ? ' ' : '') + word;
        }
      }

      ctx.fillText(line1, w / 2, subBoxY + 16);
      if (line2) {
        ctx.fillStyle = '#ffffff';
        ctx.fillText(line2.length > 38 ? line2.slice(0, 36) + '…' : line2, w / 2, subBoxY + 38);
      }

      // Progress bar at the bottom
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.fillRect(16, subBoxY + subBoxH - 6, w - 32, 4);

      ctx.fillStyle = '#00f0ff';
      ctx.fillRect(16, subBoxY + subBoxH - 6, (w - 32) * progressRatio, 4);
      ctx.restore();

      if (isPlaying) {
        animationFrameRef.current = requestAnimationFrame(render);
      }
    };

    if (isPlaying) {
      animationFrameRef.current = requestAnimationFrame(render);
    } else {
      render(performance.now());
    }

    return () => {
      isRunning = false;
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [product, activeSegment, currentSegmentIndex, isPlaying, segmentDuration, hasRealVeoVideo, job.segments.length, onSegmentChange]);

  const handleDownload = () => {
    if (hasRealVeoVideo && activeSegment.videoUrl) {
      window.open(activeSegment.videoUrl, '_blank');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsExporting(true);
    const link = document.createElement('a');
    link.download = `${product.sku}_ad_shot_${currentSegmentIndex + 1}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    setTimeout(() => setIsExporting(false), 800);
  };

  const getDimensions = () => {
    if (aspectRatio === '9:16') return { width: 360, height: 640, class: 'w-[270px] h-[480px]' };
    if (aspectRatio === '1:1') return { width: 500, height: 500, class: 'w-[340px] h-[340px]' };
    return { width: 640, height: 360, class: 'w-full h-[280px]' };
  };

  const dims = getDimensions();

  return (
    <div className="space-y-4">
      {/* Video Viewport */}
      <div className="flex justify-center bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className={`relative rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-lg ${dims.class}`}>
          {hasRealVeoVideo ? (
            <video
              ref={videoRef}
              key={activeSegment.videoUrl || 'video'}
              src={activeSegment.videoUrl || undefined}
              controls
              autoPlay={isPlaying}
              loop
              className="w-full h-full object-cover"
              poster={job.coverPosterUrl || product.imageUrls[0] || undefined}
            />
          ) : (
            <canvas
              ref={canvasRef}
              width={dims.width}
              height={dims.height}
              className="w-full h-full object-cover"
            />
          )}

          {/* Floating Live Badge */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white text-[10px] font-extrabold pointer-events-none">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{job.generatedBy === 'GOOGLE_VEO' ? 'GOOGLE VEO' : 'AI MOTION AD'}</span>
          </div>

          {/* Audio voiceover indicator */}
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="absolute top-3 right-3 p-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/15 text-white hover:text-xisync-cyan-400 transition-all"
            title={isMuted ? 'Unmute voiceover narration' : 'Mute voiceover'}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Playback Controls & Timeline Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>

          <Button
            size="sm"
            variant="ghost"
            icon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              onSegmentChange(0);
              setProgress(0);
            }}
          >
            Replay
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            icon={<Download className="w-3.5 h-3.5" />}
            onClick={handleDownload}
            loading={isExporting}
          >
            Download Shot
          </Button>

          {onDeployToMediaBuyer && (
            <Button
              size="sm"
              variant="primary"
              icon={<Sparkles className="w-3.5 h-3.5" />}
              onClick={onDeployToMediaBuyer}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
            >
              Push to Media Buyer
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
