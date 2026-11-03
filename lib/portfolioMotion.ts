export interface Point2D {
  x: number;
  y: number;
}

export interface GenieQuadCorners {
  tl: Point2D;
  tr: Point2D;
  br: Point2D;
  bl: Point2D;
  topWidth: number;
  bottomWidth: number;
  pinchRatio: number;
  sCurveIntensity: number;
}

export interface GenieCardState {
  index: number;
  /** Normalized Genie visibility progress (0 = minimized in dock, 1 = maximized at center) */
  genieT: number;
  /** Phase of the card ('docked' | 'maximizing' | 'settled' | 'minimizing') */
  phase: 'docked' | 'maximizing' | 'settled' | 'minimizing';
  /** Horizontal offset in vw from center (0 = centered, 42 = bottom-right dock) */
  xVw: number;
  /** Vertical offset in vh from center (0 = centered, 38 = bottom-right dock) */
  yVh: number;
  scaleX: number;
  scaleY: number;
  skewXDeg: number;
  skewYDeg: number;
  rotateZDeg: number;
  opacity: number;
  brightness: number;
  zIndex: number;
  isInteractive: boolean;
  isVisible: boolean;
  /** Local progress of this card's segment (0..1) */
  cardProgress: number;
  /** Precomputed 4-corner Genie funnel geometry & CSS matrix3d */
  corners: GenieQuadCorners;
  matrix3dCss: string;
  transformCss: string;
  stackDepth: number;
}

export interface PortfolioStageState {
  activeIndex: number;
  counterLabel: string;
  orbRotationDeg: number;
  cards: GenieCardState[];
}

export const clamp = (v: number, lo: number, hi: number): number =>
  v < lo ? lo : v > hi ? hi : v;

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const smoothstep = (t: number): number => {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
};

export const smootherstep = (t: number): number => {
  const c = clamp(t, 0, 1);
  return c * c * c * (c * (c * 6 - 15) + 10);
};

export const easeOutCubic = (t: number): number => {
  const c = clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 3);
};

export const easeInCubic = (t: number): number => {
  const c = clamp(t, 0, 1);
  return c * c * c;
};

export const easeInOutCubic = (t: number): number => {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

/**
 * Computes the 4 deformed quad corners (TL, TR, BR, BL) relative to card center (0, 0)
 * for the authentic two-stage Apple macOS Genie Effect.
 *
 * - At `genieT = 1.0` (Maximized): Full rectangle `[-W/2, W/2] x [-H/2, H/2]`.
 * - From `genieT = 1.0 -> 0.48` (Minimize Stage 1: Funnel Pinch):
 *   The bottom edge rapidly pinches into a narrow genie neck (`~8%` width) and pulls into the
 *   bottom-right Dock icon `(dockOffsetX, dockOffsetY)`, while the top edge stays wide (`~85%` width)
 *   at the upper stage—forming the signature Genie funnel.
 * - From `genieT = 0.48 -> 0.0` (Minimize Stage 2: Conduit Suction):
 *   The wide top edge slides down through the curved S-funnel throat into the Dock icon while
 *   narrowing until the entire window vanishes inside the Dock icon.
 * - Maximizing (`genieT = 0.0 -> 1.0`) traverses the exact reverse trajectory.
 */
export function computeGenieQuadCorners(
  rawGenieT: number,
  width = 960,
  height = 480,
  dockOffsetX = 395,
  dockOffsetY = 305
): GenieQuadCorners {
  const t = clamp(rawGenieT, 0, 1);
  const halfW = width / 2;
  const halfH = height / 2;

  if (t >= 0.999) {
    return {
      tl: { x: -halfW, y: -halfH },
      tr: { x: halfW, y: -halfH },
      br: { x: halfW, y: halfH },
      bl: { x: -halfW, y: halfH },
      topWidth: width,
      bottomWidth: width,
      pinchRatio: 1,
      sCurveIntensity: 0,
    };
  }

  if (t <= 0.001) {
    const dockTopW = width * 0.065;
    const dockBotW = width * 0.028;
    const dockH = 22;
    return {
      tl: { x: dockOffsetX - dockTopW / 2, y: dockOffsetY - dockH },
      tr: { x: dockOffsetX + dockTopW / 2, y: dockOffsetY - dockH },
      br: { x: dockOffsetX + dockBotW / 2, y: dockOffsetY },
      bl: { x: dockOffsetX - dockBotW / 2, y: dockOffsetY },
      topWidth: dockTopW,
      bottomWidth: dockBotW,
      pinchRatio: Math.round((dockTopW / dockBotW) * 100) / 100,
      sCurveIntensity: 0,
    };
  }

  // Split at t = 0.50:
  // [0.00 -> 0.50]: Top edge extrudes up & widens out of dock while bottom neck stays pinched toward dock.
  // [0.50 -> 1.00]: Bottom neck un-pinches and sweeps from dock to center while top locks into place.
  const split = 0.5;

  let topCenterX: number;
  let topYLeft: number;
  let topYRight: number;
  let topWidth: number;

  let botCenterX: number;
  let botYLeft: number;
  let botYRight: number;
  let botWidth: number;

  if (t <= split) {
    const u = clamp(t / split, 0, 1);
    const uRise = easeOutCubic(u);
    const uSweepX = smootherstep(Math.pow(u, 1.2));
    const uWidth = smootherstep(u);

    // Top edge shoots upward out of the dock first, then sweeps horizontally toward center
    topCenterX = lerp(dockOffsetX, width * 0.08, uSweepX);
    const baseTopY = lerp(dockOffsetY - 24, -halfH * 0.86, uRise);
    // Slight banking tilt as the genie head emerges from the right-side dock
    const tilt = Math.sin(u * Math.PI) * 14;
    topYLeft = baseTopY + tilt;
    topYRight = baseTopY - tilt * 0.5;
    topWidth = lerp(width * 0.065, width * 0.76, uWidth);

    // Bottom edge remains pinched (~26% width, ~2.92x taper ratio) so projective division doesn't stretch top chrome
    const uNeck = smoothstep(u);
    botCenterX = lerp(dockOffsetX, dockOffsetX * 0.68, uNeck);
    const baseBotY = lerp(dockOffsetY, dockOffsetY - 38, uNeck);
    botYLeft = baseBotY + 6 * uNeck;
    botYRight = baseBotY - 3 * uNeck;
    botWidth = lerp(width * 0.028, width * 0.26, uNeck);
  } else {
    const v = clamp((t - split) / (1 - split), 0, 1);
    const vTop = easeOutCubic(v);
    const vBotMove = smootherstep(v);
    const vBotWidth = smootherstep(Math.pow(v, 1.15));

    // Top edge settles into exact (-halfW, -halfH) .. (+halfW, -halfH)
    topCenterX = lerp(width * 0.08, 0, vTop);
    topYLeft = lerp(-halfH * 0.86, -halfH, vTop);
    topYRight = lerp(-halfH * 0.86, -halfH, vTop);
    topWidth = lerp(width * 0.76, width, vTop);

    // Bottom neck releases from dock and sweeps along an S-curve to center bottom
    botCenterX = lerp(dockOffsetX * 0.68, 0, vBotMove);
    const baseBotY = lerp(dockOffsetY - 38, halfH, easeOutCubic(v));
    const tailTilt = Math.sin((1 - v) * Math.PI * 0.5) * 8;
    botYLeft = baseBotY + tailTilt * (1 - v);
    botYRight = baseBotY - tailTilt * 0.5 * (1 - v);
    botWidth = lerp(width * 0.26, width, vBotWidth);
  }

  const tl = { x: topCenterX - topWidth / 2, y: topYLeft };
  const tr = { x: topCenterX + topWidth / 2, y: topYRight };
  const br = { x: botCenterX + botWidth / 2, y: botYRight };
  const bl = { x: botCenterX - botWidth / 2, y: botYLeft };

  const pinchRatio = Math.round((topWidth / Math.max(1, botWidth)) * 100) / 100;
  const sCurveIntensity = Math.round(Math.sin(t * Math.PI) * 1000) / 1000;

  return {
    tl,
    tr,
    br,
    bl,
    topWidth: Math.round(topWidth * 100) / 100,
    bottomWidth: Math.round(botWidth * 100) / 100,
    pinchRatio,
    sCurveIntensity,
  };
}

/**
 * Solves the exact 2D-to-2D projective homography mapping the centered card rectangle
 * `[-width/2, width/2] x [-height/2, height/2]` onto the 4 deformed Genie corners
 * `(tl, tr, br, bl)` and returns a GPU-composited CSS `matrix3d(...)` transform string.
 */
export function computeHomographyMatrix3d(
  width: number,
  height: number,
  corners: GenieQuadCorners
): string {
  const { tl, tr, br, bl } = corners;
  const halfW = width / 2;
  const halfH = height / 2;

  // Check if settled at identity
  if (
    Math.abs(tl.x + halfW) < 0.05 &&
    Math.abs(tl.y + halfH) < 0.05 &&
    Math.abs(tr.x - halfW) < 0.05 &&
    Math.abs(tr.y + halfH) < 0.05 &&
    Math.abs(br.x - halfW) < 0.05 &&
    Math.abs(br.y - halfH) < 0.05 &&
    Math.abs(bl.x + halfW) < 0.05 &&
    Math.abs(bl.y - halfH) < 0.05
  ) {
    return 'translate(-50%, -50%)';
  }

  const x0 = tl.x;
  const y0 = tl.y;
  const x1 = tr.x;
  const y1 = tr.y;
  const x2 = br.x;
  const y2 = br.y;
  const x3 = bl.x;
  const y3 = bl.y;

  const dx1 = x1 - x2;
  const dx2 = x3 - x2;
  const sx = x0 - x1 + x2 - x3;

  const dy1 = y1 - y2;
  const dy2 = y3 - y2;
  const sy = y0 - y1 + y2 - y3;

  const det = dx1 * dy2 - dx2 * dy1;
  if (Math.abs(det) < 1e-6) {
    return 'translate(-50%, -50%) scale(0.02)';
  }

  const g = (sx * dy2 - sy * dx2) / det;
  const h = (dx1 * sy - dy1 * sx) / det;

  const a = x1 - x0 + g * x1;
  const b = x3 - x0 + h * x3;
  const c = x0;

  const d = y1 - y0 + g * y1;
  const e = y3 - y0 + h * y3;
  const f = y0;

  // Multiply A * B where B maps centered [-W/2, W/2] x [-H/2, H/2] to unit square [0, 1]^2:
  // s = x / W + 0.5, t = y / H + 0.5
  const invW = 1 / width;
  const invH = 1 / height;

  const m00 = a * invW;
  const m01 = b * invH;
  const m02 = 0.5 * (a + b) + c;

  const m10 = d * invW;
  const m11 = e * invH;
  const m12 = 0.5 * (d + e) + f;

  const m20 = g * invW;
  const m21 = h * invH;
  const m22 = 0.5 * (g + h) + 1;

  if (Math.abs(m22) < 1e-6) {
    return 'translate(-50%, -50%) scale(0.02)';
  }

  const inv22 = 1 / m22;
  const r = (val: number) => Math.round(val * inv22 * 1e6) / 1e6;

  // CSS matrix3d is column-major 4x4:
  // [ m00  m01  0  m02 ]
  // [ m10  m11  0  m12 ]
  // [  0    0   1   0  ]
  // [ m20  m21  0   1  ]
  return `translate(-50%, -50%) matrix3d(${r(m00)}, ${r(m10)}, 0, ${r(
    m20
  )}, ${r(m01)}, ${r(m11)}, 0, ${r(m21)}, 0, 0, 1, 0, ${r(m02)}, ${r(
    m12
  )}, 0, 1)`;
}

/**
 * Converts a single card's normalized `genieT` (0 = docked in dial box, 1 = maximized in center)
 * into a complete `GenieCardState`.
 */
export function buildCardStateFromGenieT(
  index: number,
  genieT: number,
  phase: GenieCardState['phase'],
  cardProgress: number,
  refWidth = 960,
  refHeight = 480,
  dockOffsetX = 395,
  dockOffsetY = 305
): GenieCardState {
  const clampedT = clamp(genieT, 0, 1);
  const corners = computeGenieQuadCorners(
    clampedT,
    refWidth,
    refHeight,
    dockOffsetX,
    dockOffsetY
  );
  const matrix3dCss = computeHomographyMatrix3d(refWidth, refHeight, corners);

  // Derive summary metrics for tests & auxiliary UI effects
  const centerX =
    (corners.tl.x + corners.tr.x + corners.br.x + corners.bl.x) / 4;
  const centerY =
    (corners.tl.y + corners.tr.y + corners.br.y + corners.bl.y) / 4;

  const xVw =
    clampedT <= 0.001
      ? 42
      : clampedT >= 0.999
      ? 0
      : Math.round((centerX / refWidth) * 42 * 1000) / 1000;
  const yVh =
    clampedT <= 0.001
      ? 38
      : clampedT >= 0.999
      ? 0
      : Math.round((centerY / refHeight) * 38 * 1000) / 1000;

  const scaleX =
    clampedT >= 0.999
      ? 1
      : Math.round((corners.topWidth / refWidth) * 1000) / 1000;
  const scaleY =
    clampedT >= 0.999
      ? 1
      : Math.round(
          (Math.abs(corners.bl.y - corners.tl.y) / refHeight) * 1000
        ) / 1000;

  const skewXDeg =
    clampedT >= 0.999
      ? 0
      : Math.round(
          ((corners.tl.x + corners.tr.x - (corners.bl.x + corners.br.x)) /
            refWidth) *
            18 *
            1000
        ) / 1000;

  // Smooth opacity fade right inside the dial box opening (0.00 -> 0.10)
  const opacity =
    clampedT <= 0.002
      ? 0
      : clampedT >= 0.1
      ? 1
      : Math.round(smoothstep(clampedT / 0.1) * 1000) / 1000;

  const isVisible = opacity > 0.005;
  const isInteractive = clampedT >= 0.85;

  return {
    index,
    genieT: Math.round(clampedT * 1000) / 1000,
    phase,
    xVw,
    yVh,
    scaleX,
    scaleY,
    skewXDeg,
    skewYDeg: 0,
    rotateZDeg: 0,
    opacity,
    brightness: 1,
    zIndex: phase === 'settled' || phase === 'maximizing' ? 50 + index : 20 + index,
    isInteractive,
    isVisible,
    cardProgress: Math.round(cardProgress * 1000) / 1000,
    corners,
    matrix3dCss,
    transformCss: matrix3dCss,
    stackDepth: 0,
  };
}

/**
 * Builds a single card's state for the Apple macOS Scale card deck stacking animation.
 * Cards emerge vertically from the center bottom into center stage, then scale down
 * and dim subtly to create depth as subsequent cards stack over them.
 */
export function buildAppleScaleCardState(
  index: number,
  enterProgress: number, // 0 = below screen, 1 = settled at center
  stackDepth: number, // 0 = topmost active, >0 = covered by newer cards
  refWidth = 960,
  refHeight = 480
): GenieCardState {
  const u = clamp(enterProgress, 0, 1);
  const depth = Math.max(0, stackDepth);

  if (u <= 0.001) {
    const defaultCorners = computeGenieQuadCorners(0, refWidth, refHeight, 0, refHeight * 0.9);
    return {
      index,
      genieT: 0,
      phase: 'docked',
      xVw: 0,
      yVh: 45,
      scaleX: 0.88,
      scaleY: 0.88,
      skewXDeg: 0,
      skewYDeg: 0,
      rotateZDeg: 0,
      opacity: 0,
      brightness: 1,
      zIndex: (index + 1) * 10,
      isInteractive: false,
      isVisible: false,
      cardProgress: 0,
      corners: defaultCorners,
      matrix3dCss: `translate(-50%, -50%) translate3d(0, ${Math.round(refHeight * 0.9)}px, 0) scale(0.88)`,
      transformCss: `translate3d(-50%, calc(-50% + ${Math.round(refHeight * 0.9)}px), 0) scale(0.88)`,
      stackDepth: 0,
    };
  }

  const uEased = easeOutCubic(u);
  // Vertical position: rises from center bottom (refHeight * 0.85) to 0, then shifts up slightly (-14px * depth)
  const baseY = lerp(refHeight * 0.85, 0, uEased);
  const translateY = Math.round((baseY - depth * 14) * 10) / 10;

  // Scale: enters at 0.88 -> 1.0, and decreases by 0.048 per stack depth
  const baseScale = lerp(0.88, 1.0, uEased);
  const scale = Math.max(0.72, Math.round((baseScale - depth * 0.048) * 1000) / 1000);

  // Opacity & Brightness:
  const entranceOpacity = clamp(u / 0.12, 0, 1);
  const depthDim = Math.max(0.68, 1.0 - depth * 0.08);
  const opacity = Math.round(entranceOpacity * depthDim * 1000) / 1000;
  const brightness = Math.max(0.55, Math.round((1.0 - depth * 0.16) * 1000) / 1000);

  const isVisible = opacity > 0.01;
  const isInteractive = u >= 0.95 && depth < 0.15;
  const phase: GenieCardState['phase'] = u < 0.999 ? 'maximizing' : 'settled';

  const transformCss =
    translateY === 0 && scale === 1
      ? 'translate(-50%, -50%)'
      : `translate(-50%, -50%) translate3d(0, ${translateY}px, 0) scale(${scale})`;

  const defaultCorners = computeGenieQuadCorners(u, refWidth, refHeight, 0, 0);

  return {
    index,
    genieT: Math.round(u * 1000) / 1000,
    phase,
    xVw: 0,
    yVh: Math.round((translateY / refHeight) * 50 * 100) / 100,
    scaleX: scale,
    scaleY: scale,
    skewXDeg: 0,
    skewYDeg: 0,
    rotateZDeg: 0,
    opacity,
    brightness,
    zIndex: (index + 1) * 10,
    isInteractive,
    isVisible,
    cardProgress: Math.round(u * 1000) / 1000,
    corners: defaultCorners,
    matrix3dCss: transformCss,
    transformCss,
    stackDepth: Math.round(depth * 1000) / 1000,
  };
}

/**
 * Computes the deterministic Apple macOS Scale Card Deck Stacking state for all N portfolio cards
 * given a normalized scroll progress `rawProgress` in [0, 1].
 *
 * 1. **Initial Clean Stage**: `rawProgress <= 0.08` -> empty stage with 0 visible cards.
 * 2. **Emergence**: Each card emerges from center-bottom into center stage with an Apple Scale easing curve.
 * 3. **Stacking**: As each subsequent card enters and lands on top, the previous cards remain visible underneath,
 *    scaling down subtly and dimming to create an authentic multi-window card deck.
 */
export function computePortfolioStageState(
  rawProgress: number,
  totalCards = 5,
  refWidth = 960,
  refHeight = 480,
  _dockOffsetX = 395,
  _dockOffsetY = 305
): PortfolioStageState {
  const count = Math.max(1, totalCards);
  const progress = clamp(rawProgress, 0, 1);
  const leadIn = 0.08;

  // Normalized active progress after the lead-in buffer
  const activeP = progress <= leadIn ? 0 : (progress - leadIn) / (1.0 - leadIn);
  const segment = 1 / count;

  // Compute entrance progress for each card
  const uList: number[] = [];
  for (let i = 0; i < count; i++) {
    const segStart = i * segment;
    const enterDuration = segment * 0.65;
    const u = clamp((activeP - segStart) / enterDuration, 0, 1);
    uList.push(u);
  }

  // Active index is the highest card that has started entering
  let activeIndex = 0;
  for (let i = count - 1; i >= 0; i--) {
    if (uList[i] > 0.05) {
      activeIndex = i;
      break;
    }
  }

  const counterLabel = `${String(activeIndex + 1).padStart(2, '0')} / ${String(
    count
  ).padStart(2, '0')}`;
  const orbRotationDeg = Math.round(progress * 360 * 100) / 100;

  const cards: GenieCardState[] = Array.from({ length: count }, (_, i) => {
    // If we're in the lead-in phase, all cards are docked offscreen below
    if (progress <= leadIn || uList[i] <= 0.001) {
      return buildAppleScaleCardState(i, 0, 0, refWidth, refHeight);
    }

    // Stack depth is the sum of entrance progress of all cards above this one
    let stackDepth = 0;
    for (let j = i + 1; j < count; j++) {
      stackDepth += uList[j];
    }

    return buildAppleScaleCardState(i, uList[i], stackDepth, refWidth, refHeight);
  });

  return {
    activeIndex,
    counterLabel,
    orbRotationDeg,
    cards,
  };
}

/**
 * Pure helper to determine whether an anchor click should trigger the 5-column page transition curtain.
 */
export function shouldInterceptNavigationClick(params: {
  href: string | null;
  target: string | null;
  hasDownload: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
  shiftKey: boolean;
  altKey: boolean;
  button: number;
  currentPathname: string;
}): { shouldIntercept: boolean; targetPath: string } {
  const {
    href,
    target,
    hasDownload,
    metaKey,
    ctrlKey,
    shiftKey,
    altKey,
    button,
    currentPathname,
  } = params;

  if (
    !href ||
    button !== 0 ||
    metaKey ||
    ctrlKey ||
    shiftKey ||
    altKey ||
    hasDownload ||
    (target && target !== '_self')
  ) {
    return { shouldIntercept: false, targetPath: '' };
  }

  if (
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('javascript:') ||
    href.startsWith('#')
  ) {
    return { shouldIntercept: false, targetPath: '' };
  }

  // External URLs
  if (/^https?:\/\//i.test(href)) {
    return { shouldIntercept: false, targetPath: '' };
  }

  // Normalize internal path
  const [pathPart, hashPart] = href.split('#');
  const normalizedPath = pathPart || '/';

  // Same-page hash link (e.g. /#faqs when already on /)
  if (normalizedPath === currentPathname && hashPart) {
    return { shouldIntercept: false, targetPath: '' };
  }

  // Clicking link to the exact current page without hash
  if (normalizedPath === currentPathname) {
    return { shouldIntercept: false, targetPath: '' };
  }

  return {
    shouldIntercept: true,
    targetPath: href,
  };
}

/**
 * Pure state machine helper deciding how RoutePreloader should respond when `pathname` updates.
 * Prevents duplicate curtain flashes if the safety fallback already opened the curtain on a slow network.
 */
export function computeCurtainRevealDecision(params: {
  prevPathname: string;
  nextPathname: string;
  isTransitioning: boolean;
  fallbackRevealedForPath: string | null;
  elapsedMs: number;
  minCloseDurationMs: number;
}): {
  action: 'noop' | 'reveal-after-wait' | 'reveal-immediately' | 'silent-reset';
  waitMs: number;
} {
  const {
    prevPathname,
    nextPathname,
    isTransitioning,
    fallbackRevealedForPath,
    elapsedMs,
    minCloseDurationMs,
  } = params;

  if (prevPathname === nextPathname) {
    return { action: 'noop', waitMs: 0 };
  }

  if (isTransitioning) {
    const remaining = Math.max(0, minCloseDurationMs - elapsedMs);
    if (remaining <= 8) {
      return { action: 'reveal-immediately', waitMs: 0 };
    }
    return { action: 'reveal-after-wait', waitMs: Math.round(remaining) };
  }

  // If the curtain was already opened by the safety fallback for this navigation,
  // or if navigation occurred via browser back/forward without a closed curtain,
  // never flash the curtain closed-and-open a second time!
  if (fallbackRevealedForPath === nextPathname || !isTransitioning) {
    return { action: 'silent-reset', waitMs: 0 };
  }

  return { action: 'silent-reset', waitMs: 0 };
}

