'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/components/theme/ThemeProvider';
import { LaxitechWordmark } from '@/components/brand/LaxitechWordmark';
import { SplitRollText } from '@/components/ui/SplitRollText';

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Solutions', href: '/solutions' },
  { label: 'Products', href: '/products' },
  { label: 'About', href: '/about' },
  { label: 'Insights', href: '/insights' },
];

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 981px)');
    const closeOnDesktop = () => { if (desktop.matches) setIsMenuOpen(false); };
    desktop.addEventListener('change', closeOnDesktop);
    return () => desktop.removeEventListener('change', closeOnDesktop);
  }, []);

  // ─── 3. Lock Body Scroll & Keyboard Escape Handler when Mobile Menu is Open ───
  useEffect(() => {
    if (isMenuOpen) {
      const previousOverflow = document.body.style.overflow;
      const inactiveContent = [...document.querySelectorAll<HTMLElement>('#vv-main, footer')].map((element) => ({ element, inert: element.inert }));
      inactiveContent.forEach(({ element }) => { element.inert = true; });
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsMenuOpen(false);
          menuButtonRef.current?.focus();
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = previousOverflow;
        inactiveContent.forEach(({ element, inert }) => { element.inert = inert; });
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isMenuOpen]);

  const isLinkActive = (href: string) => {
    if (href === '/') return pathname === '/';
    if (href === '/blogs') {
      return pathname.startsWith('/blogs') || pathname.startsWith('/blog');
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* ─── Fixed Header Shell with Scroll Transitions ─── */}
      <header
        className="site-nav-shell fixed inset-x-0 top-0 z-[200] bg-bg"
      >
        {/* ─── Inner Navigation Bar ─── */}
        <nav
          aria-label="Primary Navigation"
          className="site-container grid grid-cols-[auto_1fr] items-center gap-5 py-4 min-[981px]:grid-cols-[1fr_auto_1fr]"
        >
          {/* Brand Emblem Logo */}
          <Link
            href="/"
            onClick={() => setIsMenuOpen(false)}
            prefetch={true}
            aria-label="Laxitech — Home"
            className="group flex items-center justify-self-start text-fg"
          >
            <LaxitechWordmark />
          </Link>

          {/* Desktop Center Navigation Links */}
          <div className="hidden items-center gap-7 min-[981px]:flex">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  prefetch={true}
                  className={`text-[15px] tracking-[-0.01em] transition-colors hover:text-fg ${
                    active ? 'font-medium text-fg' : 'text-fg-muted'
                  }`}
                >
                  <SplitRollText text={link.label} />
                </Link>
              );
            })}
          </div>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-2 justify-self-end min-[981px]:gap-3.5">
            {/* Theme Switch Toggle */}
            <button
              type="button"
              onClick={(e) => toggleTheme(e)}
              role="switch"
              aria-checked={resolvedTheme === 'light'}
              aria-label={`Switch to ${resolvedTheme === 'dark' ? 'light' : 'dark'} mode`}
              className="grid size-11 place-items-center rounded-full text-fg transition-colors hover:bg-surface-strong cursor-pointer"
            >
              {resolvedTheme === 'dark' ? <Sun className="size-[18px]" strokeWidth={1.6} aria-hidden="true" /> : <Moon className="size-[18px]" strokeWidth={1.6} aria-hidden="true" />}
            </button>

            {/* CTA Button with Split-Character Roll */}
            <Link
              href="/contact"
              onClick={() => setIsMenuOpen(false)}
              prefetch={true}
              className="site-nav-quote hidden h-11 shrink-0 items-center rounded-full bg-fg px-5 text-[13px] font-medium tracking-[-0.01em] whitespace-nowrap text-bg transition-colors min-[430px]:inline-flex"
            >
              <span className="min-[981px]:hidden">
                <SplitRollText text="Quote" />
              </span>
              <span className="hidden min-[981px]:inline">
                <SplitRollText text="Get a Quote" />
              </span>
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-expanded={isMenuOpen}
              aria-controls="laxitech-mobile-navigation"
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              className={`grid size-[44px] shrink-0 place-items-center rounded-[10px] border transition-colors duration-300 ease-brand min-[981px]:hidden cursor-pointer ${
                isMenuOpen ? 'border-fg bg-fg' : 'border-line-strong'
              }`}
            >
              <span className="relative block h-[10px] w-4">
                <span
                  className={`absolute left-0 block h-[1.5px] w-full transition-[rotate,top,background-color] duration-[380ms] ease-brand motion-reduce:transition-none ${
                    isMenuOpen ? 'top-[4.25px] rotate-45 bg-bg' : 'top-0 bg-fg'
                  }`}
                />
                <span
                  className={`absolute left-0 block h-[1.5px] w-full transition-[rotate,top,background-color] duration-[380ms] ease-brand motion-reduce:transition-none ${
                    isMenuOpen ? 'top-[4.25px] -rotate-45 bg-bg' : 'top-[8.5px] bg-fg'
                  }`}
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      {/* ─── Mobile Fullscreen Menu Drawer ─── */}
      <div
        id="laxitech-mobile-navigation"
        aria-hidden={!isMenuOpen}
        inert={!isMenuOpen}
        className={`site-mobile-panel fixed inset-0 z-[190] flex flex-col justify-between bg-bg px-6 pt-[104px] pb-10 transition-[clip-path] duration-[450ms] ease-brand motion-reduce:transition-none min-[981px]:hidden ${
          isMenuOpen
            ? '[clip-path:inset(0)]'
            : 'pointer-events-none [clip-path:inset(0_0_100%_0)]'
        }`}
      >
        <nav aria-label="Mobile Navigation" className="flex flex-col">
          {NAV_LINKS.map((link, idx) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                prefetch={true}
                onClick={() => setIsMenuOpen(false)}
                aria-current={active ? 'page' : undefined}
                style={{
                  transitionDelay: isMenuOpen ? `${180 + 55 * idx}ms` : '0ms',
                }}
                className={`group flex items-baseline gap-4 py-[13px] transition-[opacity,translate] duration-[550ms] ease-brand motion-reduce:transition-none ${
                  isMenuOpen
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-4 opacity-0'
                }`}
              >
                <span
                  className={`font-display text-[26px] leading-[1.1] font-medium tracking-tight transition-colors ${
                    active ? 'text-fg' : 'text-fg-muted group-hover:text-fg'
                  }`}
                >
                    <SplitRollText text={link.label} />
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-6">
          <Link
            href="/contact"
            prefetch={true}
            onClick={() => setIsMenuOpen(false)}
            className="flex h-[48px] w-full items-center justify-center rounded-[10px] bg-fg text-[15px] font-medium text-bg transition-colors hover:bg-fg-strong"
          >
            Get a Quote
          </Link>
        </div>
      </div>
    </>
  );
}
