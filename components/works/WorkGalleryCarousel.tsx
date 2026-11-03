'use client';

import React, { useState } from 'react';

export function WorkGalleryCarousel({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const slides =
    images.length >= 4
      ? [...images, ...images]
      : [...images, ...images, ...images];

  const [index, setIndex] = useState(1);

  const handlePrev = () => {
    setIndex((prev) => (prev <= 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      aria-label="Project gallery"
      className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y"
      style={{
        height: 344,
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 'calc(50vw - 283px)',
        borderColor: 'var(--vv-card-rule)',
      }}
    >
      <div
        className="flex items-center transition-transform duration-500 ease-brand will-change-transform"
        style={{
          gap: 12,
          transform: `translate3d(${-index * 577}px, 0px, 0px)`,
        }}
      >
        {slides.map((src, idx) => (
          <div
            key={`${src}-${idx}`}
            className="relative shrink-0 overflow-hidden rounded-[4px] bg-surface"
            style={{ width: 565, height: 318 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${title} screenshot ${(idx % images.length) + 1}`}
              loading="eager"
              decoding="async"
              className="block size-full object-cover object-top"
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        onClick={handlePrev}
        className="absolute top-1/2 left-3 z-10 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/55 text-white backdrop-blur-[8px] transition-colors hover:bg-black/75 md:left-5 md:size-10"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <button
        type="button"
        aria-label="Next slide"
        onClick={handleNext}
        className="absolute top-1/2 right-3 z-10 grid size-9 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-black/55 text-white backdrop-blur-[8px] transition-colors hover:bg-black/75 md:right-5 md:size-10"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </section>
  );
}
