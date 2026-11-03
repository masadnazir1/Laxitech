'use client';

import React, { useEffect, useState } from 'react';
import { getProjectSnapshotSequence } from '@/data/assetRegistry';

export interface SnapshotScrollPreviewProps {
  slug: string;
  primaryImage: string;
  title: string;
  active?: boolean;
  autoCycleOnMobile?: boolean;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}

export function SnapshotScrollPreview({
  slug,
  primaryImage,
  title,
  active = false,
  className = '',
  imageClassName = '',
  priority = false,
}: SnapshotScrollPreviewProps) {
  const [hovered, setHovered] = useState(false);
  const [frameIdx, setFrameIdx] = useState(0);

  const frames = getProjectSnapshotSequence(slug, primaryImage);
  const isCycling = hovered;

  useEffect(() => {
    if (!isCycling || frames.length <= 1) {
      return;
    }
    const timer = window.setInterval(() => {
      setFrameIdx((prev) => (prev + 1) % frames.length);
    }, 1150);
    return () => window.clearInterval(timer);
  }, [isCycling, frames.length]);

  const displayedSrc = frames[isCycling ? frameIdx : 0] ?? primaryImage;

  return (
    <div
      onMouseEnter={() => { setFrameIdx(0); setHovered(true); }}
      onMouseLeave={() => setHovered(false)}
      data-active={active ? 'true' : 'false'}
      className={`absolute inset-0 size-full overflow-hidden bg-surface select-none ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={displayedSrc}
        alt={title}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        draggable={false}
        className={`block size-full object-cover object-top transition-[transform,filter] duration-500 ease-brand ${imageClassName}`}
      />
    </div>
  );
}
