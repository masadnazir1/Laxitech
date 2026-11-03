/**
 * Next.js Server Instrumentation Hook:
 * Automatically pre-warms all core routes in the background shortly after the server starts,
 * eliminating cold-compilation delays on the first user navigation click.
 */

const CORE_WARMUP_ROUTES = [
  '/',
  '/about-us',
  '/works',
  '/services',
  '/blogs',
  '/templates',
  '/contact',
];

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    setTimeout(async () => {
      for (const route of CORE_WARMUP_ROUTES) {
        try {
          await fetch(`http://localhost:3000${route}`);
        } catch {
          // Ignore transient startup warmup errors
        }
      }
    }, 1200);
  }
}
