'use client';

import React, { useId } from 'react';

export interface CynexEmblemProps {
  className?: string;
  variant?:
    | 'monochrome'
    | 'metallic'
    | 'monument'
    | 'about-mark'
    | 'flower'
    | 'wordmark'
    | 'auto';
  size?: number | string;
  glow?: boolean;
}

/**
 * Geometric CYNEX Vector Emblem
 * Exact 3-facet polygon architecture from image 1 [Vectorized].svg & public/brand/flower.png
 * Aspect ratio and dimensions of the C logo are strictly preserved (never stretched, squeezed, or rotated).
 */
export function CynexEmblem({
  className = 'size-6',
  variant = 'auto',
  size,
  glow = false,
}: CynexEmblemProps) {
  const uid = useId().replace(/:/g, '');

  const p1 =
    'M85.7454 39.5504C101.271 38.6691 100.185 39.9421 107.54 52.2904L118.352 70.5436C120.75 74.6039 128.774 86.9564 129.686 90.3091C130.152 92.0219 130.09 93.3149 129.459 94.9776C127.795 99.3671 124.399 103.625 121.859 107.581C116.598 115.774 111.082 124.016 106.23 132.448C104.916 134.732 102.777 138.172 103.251 140.909C104.013 145.303 122.737 173.854 126.597 180.079C135.513 194.4 144.346 208.772 153.096 223.195C155.381 227.017 157.715 230.816 159.967 234.656C160.821 236.112 162.282 238.565 161.244 240.168C158.849 241.456 149.725 241.03 146.572 241.03L124.625 241.017L99.8179 241.028C91.1094 241.027 80.5749 242.648 75.0669 234.467C72.9361 231.303 70.9551 227.944 68.9486 224.69L55.6971 203.052L37.6349 173.853C33.7084 167.557 29.7479 161.282 25.9936 154.902C21.3537 147.016 20.5934 137.954 23.6193 129.353C24.6742 126.355 27.6586 122.049 29.4089 119.292L38.9359 104.424L74.3286 48.8519C77.5054 43.8816 79.5964 40.9034 85.7454 39.5504Z';

  const p2 =
    'M113.721 38.582C129.41 38.211 146.264 38.5338 162.042 38.528L180.357 38.5068C198.869 38.4815 197.216 38.7198 206.261 54.364L216.849 72.644L228.765 93.1975C230.659 96.456 235.815 104.715 236.683 107.961C236.015 110.54 235.679 111.508 233.411 112.95C229.694 114.29 201.36 113.603 195.859 113.603L175.067 113.622C152.864 113.676 155.412 116.477 144.243 96.979L133.937 79.375L119.942 55.5535C117.374 51.2093 114.716 46.7868 112.245 42.382C111.554 41.1498 111.408 40.8335 111.803 39.6358C112.379 38.9775 112.895 38.8723 113.721 38.582Z';

  const p3 =
    'M157.954 163.346C161.743 163.024 167.667 163.196 171.631 163.193L196.823 163.209L218.22 163.211C223.242 163.182 231.491 162.366 236.028 164.626C238.029 165.904 238.718 168.89 237.524 170.823C234.026 176.483 230.015 181.86 226.206 187.303L201.839 222.125C201.032 223.52 198.673 226.769 197.671 228.193C194.296 232.997 191.11 238.866 185.016 240.458C181.81 241.296 176.098 241.507 173.035 239.937C172.277 239.549 170.947 238.22 170.51 237.486C167.404 232.259 164.392 226.806 161.334 221.558L148.62 199.643C146.64 196.241 141.923 188.771 140.837 185.244C139.91 182.233 149.825 167.733 152.577 165.346C153.532 164.517 156.713 163.677 157.954 163.346Z';

  const style: React.CSSProperties = size
    ? { width: size, height: size }
    : {};

  // ─── 1. Exact 3-C Hexagonal Pyramid Flower Mark (Matches public/brand/flower.png) ───
  if (variant === 'about-mark' || variant === 'flower') {
    return (
      <div
        className={`relative flex items-center justify-center select-none text-fg ${className}`}
        style={{
          ...style,
          maskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.20) 52%, rgba(0,0,0,0.06) 84%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.20) 52%, rgba(0,0,0,0.06) 84%, transparent 100%)',
        }}
        role="img"
        aria-label="CYNEX Flower Emblem"
      >
        <svg
          viewBox="20 36 604 326"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full"
          aria-hidden="true"
        >
          {/* Left Upright C Emblem */}
          <g transform="translate(0, 117)">
            <path d={p1} fill="currentColor" />
            <path d={p2} fill="currentColor" />
            <path d={p3} fill="currentColor" />
          </g>
          {/* Top-Center Upright C Emblem */}
          <g transform="translate(191.3, 0)">
            <path d={p1} fill="currentColor" />
            <path d={p2} fill="currentColor" />
            <path d={p3} fill="currentColor" />
          </g>
          {/* Right Upright C Emblem */}
          <g transform="translate(382.6, 117)">
            <path d={p1} fill="currentColor" />
            <path d={p2} fill="currentColor" />
            <path d={p3} fill="currentColor" />
          </g>
        </svg>
      </div>
    );
  }

  // ─── 2. Footer Monument Watermark: Pure High-Contrast Typographic "CYNEX" Text (Zero Low-Opacity Fade) ───
  if (variant === 'monument') {
    return (
      <div
        className={`relative flex items-center justify-center select-none text-fg ${className}`}
        style={style}
        role="img"
        aria-label="CYNEX"
      >
        <svg
          viewBox="0 0 1260 235"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="h-auto w-full overflow-visible"
          aria-hidden="true"
        >
          <text
            x="630"
            y="194"
            textAnchor="middle"
            fill="currentColor"
            className="font-display font-bold"
            style={{
              fontSize: '232px',
              fontWeight: 700,
              letterSpacing: '0.065em',
              fontFamily: 'var(--font-walsheim), var(--font-display), sans-serif',
            }}
          >
            CYNEX
          </text>
        </svg>
      </div>
    );
  }

  // ─── 3. Solo Logo Mode (Formerly wordmark: now strictly renders ONLY the C logo without YNEX) ───
  if (variant === 'wordmark') {
    return (
      <span className={`inline-flex items-center select-none text-fg ${className}`} style={style}>
        <svg
          viewBox="20 36 220 208"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[26px] w-auto shrink-0"
          aria-hidden="true"
        >
          <path d={p1} fill="currentColor" />
          <path d={p2} fill="currentColor" />
          <path d={p3} fill="currentColor" />
        </svg>
      </span>
    );
  }

  // ─── 4. Metallic Specular Mode (Exact untouched aspect ratio) ───
  if (variant === 'metallic') {
    return (
      <svg
        viewBox="20 36 220 208"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        style={style}
        role="img"
        aria-label="CYNEX Emblem"
      >
        <defs>
          <linearGradient id={`grad-spine-${uid}`} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.92" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="1" />
          </linearGradient>
          <linearGradient id={`grad-top-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.88" />
          </linearGradient>
          <linearGradient id={`grad-bot-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.95" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
          </linearGradient>
          {glow && (
            <filter id={`glow-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          )}
        </defs>
        <g filter={glow ? `url(#glow-${uid})` : undefined}>
          <path d={p1} fill={`url(#grad-spine-${uid})`} />
          <path d={p2} fill={`url(#grad-top-${uid})`} />
          <path d={p3} fill={`url(#grad-bot-${uid})`} />
        </g>
      </svg>
    );
  }

  // ─── 5. Default 'auto' / 'monochrome' Mode: Exact Untouched Aspect Ratio ───
  return (
    <svg
      viewBox="20 36 220 208"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      role="img"
      aria-label="Laxitech"
    >
      <path d={p1} fill="currentColor" />
      <path d={p2} fill="currentColor" />
      <path d={p3} fill="currentColor" />
    </svg>
  );
}
