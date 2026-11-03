import test from 'node:test';
import assert from 'node:assert/strict';
import {
  computeGenieQuadCorners,
  computeHomographyMatrix3d,
  computePortfolioStageState,
  shouldInterceptNavigationClick,
} from './portfolioMotion.ts';

test('computeGenieQuadCorners produces true macOS Genie funnel pinch where bottom neck is much narrower than top edge', () => {
  // At midpoint (genieT = 0.50), the top edge is wide near center while bottom neck is pinched toward the dock
  const mid = computeGenieQuadCorners(0.5, 960, 480, 395, 305);
  assert.ok(
    mid.topWidth > 700,
    `Expected wide top edge (>700px), got ${mid.topWidth}`
  );
  assert.ok(
    mid.bottomWidth < 260,
    `Expected pinched bottom neck (<260px), got ${mid.bottomWidth}`
  );
  assert.ok(
    mid.pinchRatio > 2.8,
    `Expected strong Genie funnel pinch ratio (>2.8x), got ${mid.pinchRatio}`
  );

  // At genieT = 1.0, full un-warped rectangle
  const full = computeGenieQuadCorners(1.0, 960, 480, 395, 305);
  assert.equal(full.topWidth, 960);
  assert.equal(full.bottomWidth, 960);
  assert.equal(full.pinchRatio, 1);
  assert.equal(
    computeHomographyMatrix3d(960, 480, full),
    'translate(-50%, -50%)'
  );
});

test('computePortfolioStageState provides a clean empty stage during lead-in (progress <= 0.08)', () => {
  const state = computePortfolioStageState(0.04, 5);
  assert.equal(state.activeIndex, 0);
  assert.equal(state.counterLabel, '01 / 05');
  assert.equal(state.cards.length, 5);
  // All cards are docked offscreen below stage with 0 opacity
  for (let i = 0; i < 5; i++) {
    assert.equal(state.cards[i].isVisible, false);
    assert.equal(state.cards[i].opacity, 0);
    assert.equal(state.cards[i].phase, 'docked');
  }
});

test('computePortfolioStageState expands card 1 into center stage with Apple Scale easing', () => {
  // Card 1 enters after lead-in (0.08) and settles by ~0.20
  const state = computePortfolioStageState(0.20, 5);
  assert.equal(state.activeIndex, 0);
  assert.equal(state.counterLabel, '01 / 05');
  assert.equal(state.cards[0].phase, 'settled');
  assert.equal(state.cards[0].isVisible, true);
  assert.equal(state.cards[0].scaleX, 1);
  assert.equal(state.cards[0].opacity, 1);
  assert.equal(state.cards[0].brightness, 1);
  assert.equal(state.cards[0].isInteractive, true);
  assert.equal(state.cards[0].matrix3dCss, 'translate(-50%, -50%)');
  // Later cards have not emerged yet
  assert.equal(state.cards[1].isVisible, false);
});

test('computePortfolioStageState stacks card 2 directly on top of card 1 with physical depth scaling and dimming', () => {
  // At progress ~0.40, Card 2 is settled at center and Card 1 is stacked underneath
  const state = computePortfolioStageState(0.40, 5);
  assert.equal(state.activeIndex, 1);
  assert.equal(state.counterLabel, '02 / 05');

  // Card 1 remains visible underneath with scaled depth and slight dimming
  assert.equal(state.cards[0].isVisible, true);
  assert.ok(state.cards[0].scaleX < 1.0, `Card 1 scale should be < 1.0, got ${state.cards[0].scaleX}`);
  assert.ok(state.cards[0].brightness < 1.0, `Card 1 brightness should be < 1.0, got ${state.cards[0].brightness}`);
  assert.equal(state.cards[0].stackDepth, 1);
  assert.equal(state.cards[0].zIndex, 10);

  // Card 2 is topmost active window at full scale and brightness
  assert.equal(state.cards[1].isVisible, true);
  assert.equal(state.cards[1].scaleX, 1);
  assert.equal(state.cards[1].brightness, 1);
  assert.equal(state.cards[1].zIndex, 20);
  assert.equal(state.cards[1].isInteractive, true);
  assert.ok(state.cards[1].zIndex > state.cards[0].zIndex);
});

test('computePortfolioStageState maintains stacked card deck through card 5 at progress 1.0', () => {
  const state = computePortfolioStageState(1.0, 5);
  assert.equal(state.activeIndex, 4);
  assert.equal(state.counterLabel, '05 / 05');
  assert.equal(state.orbRotationDeg, 360);

  // Card 5 is topmost active window
  assert.equal(state.cards[4].phase, 'settled');
  assert.equal(state.cards[4].scaleX, 1);
  assert.equal(state.cards[4].brightness, 1);
  assert.equal(state.cards[4].zIndex, 50);
  assert.equal(state.cards[4].isInteractive, true);

  // All previous 4 cards remain layered in the deck underneath
  for (let i = 0; i < 4; i++) {
    assert.equal(state.cards[i].isVisible, true);
    assert.ok(state.cards[i].scaleX < 1.0);
    assert.ok(state.cards[i].zIndex < state.cards[4].zIndex);
  }
});

test('shouldInterceptNavigationClick intercepts valid internal route changes and ignores external or modifier clicks', () => {
  assert.deepEqual(
    shouldInterceptNavigationClick({
      href: '/about-us',
      target: null,
      hasDownload: false,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      button: 0,
      currentPathname: '/',
    }),
    { shouldIntercept: true, targetPath: '/about-us' }
  );

  // Same page should not trigger curtain
  assert.deepEqual(
    shouldInterceptNavigationClick({
      href: '/about-us',
      target: null,
      hasDownload: false,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      button: 0,
      currentPathname: '/about-us',
    }),
    { shouldIntercept: false, targetPath: '' }
  );

  // External link should not trigger curtain
  assert.deepEqual(
    shouldInterceptNavigationClick({
      href: 'https://github.com/Abdul-Manan-C',
      target: '_blank',
      hasDownload: false,
      metaKey: false,
      ctrlKey: false,
      shiftKey: false,
      altKey: false,
      button: 0,
      currentPathname: '/',
    }),
    { shouldIntercept: false, targetPath: '' }
  );
});

test('computeCurtainRevealDecision prevents duplicate curtain flashes and computes exact reveal wait', async () => {
  const { computeCurtainRevealDecision } = await import('./portfolioMotion.ts');

  // 1. Fast prefetched navigation (elapsed = 60ms, minClose = 135ms) -> wait 75ms then reveal
  assert.deepEqual(
    computeCurtainRevealDecision({
      prevPathname: '/',
      nextPathname: '/works',
      isTransitioning: true,
      fallbackRevealedForPath: null,
      elapsedMs: 60,
      minCloseDurationMs: 135,
    }),
    { action: 'reveal-after-wait', waitMs: 75 }
  );

  // 2. Navigation where close sweep already finished (elapsed = 180ms >= 135ms) -> reveal immediately
  assert.deepEqual(
    computeCurtainRevealDecision({
      prevPathname: '/works',
      nextPathname: '/services',
      isTransitioning: true,
      fallbackRevealedForPath: null,
      elapsedMs: 180,
      minCloseDurationMs: 135,
    }),
    { action: 'reveal-immediately', waitMs: 0 }
  );

  // 3. If fallback already opened curtain, subsequent pathname commit must do a silent reset (no double animation!)
  assert.deepEqual(
    computeCurtainRevealDecision({
      prevPathname: '/',
      nextPathname: '/contact',
      isTransitioning: false,
      fallbackRevealedForPath: '/contact',
      elapsedMs: 5200,
      minCloseDurationMs: 135,
    }),
    { action: 'silent-reset', waitMs: 0 }
  );
});

