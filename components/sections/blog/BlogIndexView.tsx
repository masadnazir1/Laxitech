'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  BlogPostItem,
  filterBlogsByCategory,
  getBlogBreadcrumbJsonLd,
} from '@/data/blogsData';
import { SplitRollText } from '@/components/ui/SplitRollText';
import { ShineBorder } from '@/components/ui/ShineBorder';
import {
  PageHeader,
  MobileCategoryMenu,
  RevealBatch,
  ThreeColFlexGrid,
  FadeInImg,
} from '@/components/ui/PagePrimitives';

function BlogPostCard({
  post,
  eager = false,
}: {
  post: BlogPostItem;
  eager?: boolean;
}) {
  return (
    <div data-reveal>
      <Link
        href={post.href}
        className="group relative flex flex-col gap-3 rounded-[6px] border border-fg/12 bg-bg/30 p-[6px] pb-3 backdrop-blur-[14px] lg:gap-6 lg:rounded-[12px] lg:p-[10px] lg:pb-4"
      >
        <ShineBorder />

        <div
          className="relative overflow-hidden rounded-[3px] bg-surface lg:rounded-[6px]"
          style={{ aspectRatio: '16 / 9' }}
        >
          <FadeInImg
            src={post.image}
            alt={post.title}
            loading={eager ? 'eager' : 'lazy'}
            fetchPriority={eager ? 'high' : undefined}
            decoding="async"
            className="absolute inset-0 size-full object-cover object-center transition-[filter,opacity] duration-500 ease-brand group-hover:[filter:blur(7px)_brightness(0.62)]"
          />
          <span className="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-400 ease-brand group-hover:opacity-100">
            <span className="vv-accent text-[clamp(22px,2.2vw,32px)] leading-none text-white">
              Read Article
            </span>
          </span>
        </div>

        <div className="flex items-end justify-between gap-4 pl-2">
          <div className="flex min-w-0 flex-col gap-1">
            <h2 className="truncate font-display text-[16px] leading-[1.25] font-medium tracking-h3 lg:text-[24px] lg:leading-[1.2]">
              {post.title}
            </h2>
            <p className="text-[13px] leading-[1.3] text-fg-muted lg:text-[16px]">
              {post.date}
              {' · '}
              {post.readTime}
            </p>
          </div>
          <span className="flex shrink-0 flex-col items-end gap-2">
            <span className="hidden rounded-[10px] bg-tint px-4 py-2.5 text-[14px] leading-none font-medium text-fg transition-colors group-hover:bg-tint-strong group-hover:text-fg-strong lg:inline-flex">
              Read post
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
}

export function BlogIndexView({
  initialCategory = 'all',
}: {
  initialCategory?: string;
}) {
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const filteredPosts = useMemo(
    () => filterBlogsByCategory(BLOG_POSTS, activeCategory),
    [activeCategory]
  );
  const breadcrumbJsonLd = getBlogBreadcrumbJsonLd();

  return (
    <main className="relative isolate -mt-[72px]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      <PageHeader lead="Our " trail="Blogs" />

      <nav
        aria-label="Blog categories"
        className="relative z-10 mx-auto max-w-[1425px] px-6 pb-[clamp(32px,4vw,56px)] md:px-8"
      >
        <MobileCategoryMenu
          className="mx-auto w-full max-w-[380px] md:hidden"
          label="Blog categories"
          active={activeCategory}
          onSelect={setActiveCategory}
          options={BLOG_CATEGORIES}
        />

        <div className="hidden flex-wrap justify-center gap-2 md:flex">
          {BLOG_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(cat.key)}
                className={`inline-flex h-[34px] cursor-pointer items-center rounded-[10px] border px-4 text-[15px] leading-none font-medium transition-colors ${
                  isActive
                    ? 'border-transparent bg-fg text-bg'
                    : 'border-line bg-bg text-fg-muted hover:border-line-strong hover:text-fg'
                }`}
              >
                <SplitRollText text={cat.label} />
              </button>
            );
          })}
        </div>
      </nav>

      <RevealBatch refresh={activeCategory}>
        <ThreeColFlexGrid>
          {filteredPosts.map((post, idx) => (
            <BlogPostCard key={post.id} post={post} eager={idx < 3} />
          ))}
        </ThreeColFlexGrid>
      </RevealBatch>
    </main>
  );
}
