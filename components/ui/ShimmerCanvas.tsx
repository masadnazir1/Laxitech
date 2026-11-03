'use client';

import React, { useEffect, useRef } from 'react';

const h = new Array(512);
for (let e = 0; e < 256; e++) {
  h[e] = h[e + 256] = Math.floor(256 * Math.random());
}

const m = (e: number) => e * e * e * (e * (6 * e - 15) + 10);
const x = (e: number, t: number, r: number) => t + e * (r - t);
const f = (e: number, t: number, r: number) => {
  const a = 15 & e;
  const s = a < 8 ? t : r;
  const n = a < 4 ? r : 12 === a || 14 === a ? t : 0;
  return ((1 & a) === 0 ? s : -s) + ((2 & a) === 0 ? n : -n);
};

function perlin2D(e: number, t: number) {
  const r = 255 & Math.floor(e);
  const a = 255 & Math.floor(t);
  e -= Math.floor(e);
  t -= Math.floor(t);
  const s = m(e);
  const n = m(t);
  const i = h[r] + a;
  const o = h[r + 1] + a;
  return x(
    n,
    x(s, f(h[i], e, t), f(h[o], e - 1, t)),
    x(s, f(h[i + 1], e, t - 1), f(h[o + 1], e - 1, t - 1))
  );
}

let sharedMaskUrl: string | null = null;

function getSharedShimmerMaskUrl(): string {
  if (sharedMaskUrl !== null) return sharedMaskUrl;
  if (typeof document === 'undefined') return '';

  try {
    // 128x128 Perlin cloud tile mirrored 3x in CPU memory -> single putImageData (zero GPU ReadPixels stall)
    const size = 128;
    const width = size * 3;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      sharedMaskUrl = '';
      return '';
    }

    const imgData = ctx.createImageData(width, size);
    const data = imgData.data;

    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        const val = Math.round(((perlin2D(col / 6.25, row / 6.25) + 1) / 2) * 255);
        const cols = [col, size * 2 - 1 - col, size * 2 + col];
        for (let cIdx = 0; cIdx < 3; cIdx++) {
          const idx = (cols[cIdx] + width * row) * 4;
          data[idx] = val;
          data[idx + 1] = val;
          data[idx + 2] = val;
          data[idx + 3] = 255;
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    sharedMaskUrl = canvas.toDataURL();
    return sharedMaskUrl;
  } catch {
    sharedMaskUrl = '';
    return '';
  }
}

const SHIMMER_COLORS = {
  dark: ['rgb(0,102,255)', 'rgb(139,92,246)', 'rgb(255,255,255)', 'rgb(54,54,54)', 'rgb(34,34,34)'],
  light: ['rgb(37,99,235)', 'rgb(124,58,237)', 'rgb(0,0,0)', 'rgb(171,171,171)', 'rgb(216,216,216)'],
};

const cachedTileCanvases: {
  dark: HTMLCanvasElement | null;
  light: HTMLCanvasElement | null;
} = {
  dark: null,
  light: null,
};

function getDotPatternTile(theme: 'dark' | 'light'): HTMLCanvasElement | null {
  if (typeof document === 'undefined') return null;
  if (cachedTileCanvases[theme]) return cachedTileCanvases[theme];

  const tile = document.createElement('canvas');
  const tileSize = 144;
  tile.width = tileSize;
  tile.height = tileSize;
  const ctx = tile.getContext('2d');
  if (!ctx) return null;

  const palette = SHIMMER_COLORS[theme];
  for (let y = 0; y < tileSize; y += 6) {
    for (let xPos = 0; xPos < tileSize; xPos += 6) {
      const colorBase = palette[Math.floor(Math.random() * palette.length)];
      const alpha = (1 - Math.pow(1 - Math.random(), 2)).toFixed(3);
      ctx.fillStyle = colorBase.replace(')', `,${alpha})`);
      ctx.fillRect(xPos, y, 2, 2);
    }
  }

  cachedTileCanvases[theme] = tile;
  return tile;
}

const themeListeners = new Set<() => void>();
let sharedThemeObserver: MutationObserver | null = null;

function subscribeThemeChange(cb: () => void) {
  if (typeof document === 'undefined' || typeof MutationObserver === 'undefined') {
    return () => {};
  }
  themeListeners.add(cb);
  if (!sharedThemeObserver) {
    sharedThemeObserver = new MutationObserver(() => {
      themeListeners.forEach((fn) => fn());
    });
    sharedThemeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
  }
  return () => {
    themeListeners.delete(cb);
    if (themeListeners.size === 0 && sharedThemeObserver) {
      sharedThemeObserver.disconnect();
      sharedThemeObserver = null;
    }
  };
}

export function ShimmerCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isNear = false;
    let maskApplied = false;

    const renderDots = () => {
      if (!isNear) return;
      if (!maskApplied) {
        const maskUrl = getSharedShimmerMaskUrl();
        if (maskUrl) {
          canvas.style.maskImage = `url(${maskUrl})`;
          canvas.style.webkitMaskImage = `url(${maskUrl})`;
        }
        maskApplied = true;
      }
      const width = parent.offsetWidth;
      const height = parent.offsetHeight;
      if (width <= 0 || height <= 0) return;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      ctx.clearRect(0, 0, width, height);
      const isLight =
        document.documentElement.getAttribute('data-theme') === 'light';
      const tile = getDotPatternTile(isLight ? 'light' : 'dark');
      if (tile) {
        const pattern = ctx.createPattern(tile, 'repeat');
        if (pattern) {
          ctx.fillStyle = pattern;
          ctx.fillRect(0, 0, width, height);
        }
      }
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              const wasNear = isNear;
              isNear = Boolean(entry?.isIntersecting);
              if (isNear && !wasNear) {
                renderDots();
              }
            },
            { rootMargin: '200px 0px' }
          )
        : null;

    if (io) {
      io.observe(parent);
    } else {
      isNear = true;
      renderDots();
    }

    const resizeObserver = new ResizeObserver(() => {
      if (isNear) renderDots();
    });
    resizeObserver.observe(parent);

    const unsubscribeTheme = subscribeThemeChange(renderDots);

    return () => {
      if (io) io.disconnect();
      resizeObserver.disconnect();
      unsubscribeTheme();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`vv-shimmer-mask pointer-events-none absolute inset-0 ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="vv-shimmer size-full"
        style={{ animationDuration: '13333.33ms' }}
      />
    </div>
  );
}
