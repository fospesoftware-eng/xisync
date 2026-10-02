#!/usr/bin/env python3
"""Generate a seamless-looping cinematic aurora background video for the XiSync hero.

Renders 960x540 @ 24fps for 6s using numpy (gaussian light blobs over a deep
navy base, additive glow, gentle tonemap + vignette) then encodes to
public/hero-bg.mp4 with a JPEG poster. All motion uses periodic functions so
frame 0 == frame N for a perfect loop.
"""
import numpy as np
import os
import subprocess
import sys
from PIL import Image

W, H = 960, 540
FPS = 24
DURATION = 6.0
N_FRAMES = int(FPS * DURATION)  # 144
FREQ = 1.0 / DURATION
OUT_DIR = "/tmp/xisync_hero_frames"
MP4_OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "hero-bg.mp4")
POSTER_OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "hero-bg-poster.jpg")
FFMPEG = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "vendor-pip",
                      "imageio_ffmpeg", "binaries", "ffmpeg-macos-aarch64-v7.1")

TOP = np.array([5, 11, 31], dtype=np.float32)      # #050b1f
BOTTOM = np.array([10, 30, 63], dtype=np.float32)  # #0a1e3f

# (bx, by, radius_frac, (r,g,b), phase, speed_mult)
BLOBS = [
    (0.18, 0.30, 0.34, (34, 211, 238), 0.0, 1.0),   # cyan
    (0.82, 0.22, 0.30, (59, 130, 246), 2.1, 0.8),   # blue
    (0.55, 0.72, 0.36, (139, 92, 246), 4.2, 0.6),   # violet
    (0.30, 0.75, 0.26, (45, 212, 191), 1.3, 1.2),   # teal
    (0.95, 0.65, 0.28, (34, 197, 94), 3.4, 0.9),    # green
    (0.05, 0.55, 0.24, (56, 189, 248), 5.2, 1.1),   # sky
    (0.68, 0.45, 0.20, (129, 140, 248), 2.9, 0.7),  # indigo
]

ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
base = np.zeros((H, W, 3), dtype=np.float32)
for c in range(3):
    base[:, :, c] = TOP[c] + (BOTTOM[c] - TOP[c]) * (ys / H)

vx = (xs / W - 0.5) * 2.0
vy = (ys / H - 0.5) * 2.0
vig = 1.0 - 0.42 * np.clip(np.sqrt(vx * vx + vy * vy), 0.0, 1.2)
vig = vig[:, :, None]

blob_cache = {}
for i, (bx, by, rfrac, col, phase, smult) in enumerate(BLOBS):
    r = rfrac * max(W, H)
    blob_cache[i] = (r, col)


def render_frame(frame_idx):
    t = frame_idx / FPS
    img = base.copy()
    for i, (bx, by, rfrac, col, phase, smult) in enumerate(BLOBS):
        r, col = blob_cache[i]
        cx = (bx + 0.16 * np.sin(2 * np.pi * FREQ * t * smult + phase)) * W
        cy = (by + 0.13 * np.cos(2 * np.pi * FREQ * t * smult * 1.3 + phase * 1.7)) * H
        inten = 0.8 + 0.2 * np.sin(2 * np.pi * FREQ * t * 0.5 + phase * 2.0)
        d2 = (xs - cx) ** 2 + (ys - cy) ** 2
        g = np.exp(-d2 / (2.0 * r * r)) * inten
        img += np.stack(
            [g * (col[0] / 255.0), g * (col[1] / 255.0), g * (col[2] / 255.0)], axis=-1
        ) * 150.0

    # gentle tonemap so overlapping glows bloom instead of clipping
    img = img / (1.0 + img / 320.0)
    img *= vig
    return Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    print(f"Rendering {N_FRAMES} frames at {W}x{H}...")
    for i in range(N_FRAMES):
        frame = render_frame(i)
        frame.save(os.path.join(OUT_DIR, f"{i:04d}.png"))
        if i % 24 == 0:
            print(f"  frame {i}/{N_FRAMES}")
    print("Encoding mp4...")
    cmd = [
        FFMPEG, "-y", "-framerate", str(FPS), "-i",
        os.path.join(OUT_DIR, "%04d.png"),
        "-c:v", "libx264", "-preset", "slow", "-crf", "21",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
        MP4_OUT,
    ]
    subprocess.run(cmd, check=True)
    Image.open(os.path.join(OUT_DIR, "0000.png")).convert("RGB").save(POSTER_OUT, "JPEG", quality=88)
    print("Poster:", POSTER_OUT)
    print("Video:", MP4_OUT)


if __name__ == "__main__":
    main()
