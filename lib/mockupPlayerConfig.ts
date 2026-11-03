export interface DirectionalRange {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SpotLightSpec {
  name: string;
  aliases: string[];
  color: number;
  intensity: number;
  angleDeg: number;
  penumbra: number;
  position: [number, number, number];
}

export const DEFAULT_MOCKUP_ID = '303947ea-33f5-4ba1-bdfa-bd5064731f9c';
export const MOCKUP_GLB_PATH = '/models/studio-macbook-scene.glb';
export const MOCKUP_DRACO_PATH = '/draco/';

export const MOCKUP_SCENE_SETTINGS = {
  uid: DEFAULT_MOCKUP_ID,
  name: 'MacBook',
  aspectRatio: '4 / 3',
  backgroundColor: '#000000',
  authoredFovDeg: 12.83757, // 0.22405791282653809 rad in GLB Camera001
  cameraZoomAttr: 11.600000000000001,
  masterDurationSec: 13.333333,
  lidOpenDurationSec: 9.983334,
  screenDimensions: {
    width: 3024,
    height: 1964,
    offsetY: 43.46560846560847,
    zoom: 100,
  },
  screenGlow: 132,
  orbitPivot: [0.342812836, -0.152148694, 0.871068358] as [
    number,
    number,
    number,
  ],
  lights: [
    {
      name: 'Spot',
      aliases: ['Spot'],
      color: 0xff0000, // 16711680 crimson key accent from scene_settings
      intensity: 10,
      angleDeg: 83,
      penumbra: 0.15,
      position: [1.32017207, -0.3883374, 1.92017245],
    },
    {
      name: 'Spot001',
      aliases: ['Spot001', 'Spot.001', 'Spot_1'],
      color: 0xffffff, // 16777215 cool rim light
      intensity: 0.55,
      angleDeg: 27,
      penumbra: 1.0,
      position: [-1.18959332, 0.92468435, -0.43939847],
    },
    {
      name: 'Spot002',
      aliases: ['Spot002', 'Spot.002', 'Spot_2'],
      color: 0xfcfcfb, // 16580603 overhead sweep spotlight
      intensity: 9.7,
      angleDeg: 59,
      penumbra: 1.0,
      position: [2.39892197, 0.36993074, 0.63392079],
    },
  ] satisfies SpotLightSpec[],
} as const;

const ZOOM_MIN = 0.3;
const ZOOM_MAX = 3.0;

/**
 * Exact camera zoom mapping from mckp.live (`$F = 0.3, ode = 3, JF = n => $F + (n/100)*(ode - $F)`).
 * For camera-zoom="11.600000000000001", returns 0.6132.
 */
export function computeCameraZoom(zoomAttr: number | string | undefined): number {
  const parsed =
    typeof zoomAttr === 'string' ? Number.parseFloat(zoomAttr) : zoomAttr;
  const clamped = Number.isFinite(parsed)
    ? Math.max(0, Math.min(100, parsed as number))
    : MOCKUP_SCENE_SETTINGS.cameraZoomAttr;
  return Number((ZOOM_MIN + (clamped / 100) * (ZOOM_MAX - ZOOM_MIN)).toFixed(6));
}

/**
 * Parses a 1..4 token CSS-style range string (e.g. "1-1-1-1") into directional bounds.
 */
export function parseRangeAttribute(
  rawRange: string | undefined | null,
  fallback = 1
): DirectionalRange {
  if (!rawRange || typeof rawRange !== 'string') {
    return { top: fallback, right: fallback, bottom: fallback, left: fallback };
  }
  const parts = rawRange
    .trim()
    .split(/[\s-]+/)
    .map((token) => Number.parseFloat(token))
    .filter((n) => Number.isFinite(n));

  switch (parts.length) {
    case 1:
      return {
        top: parts[0],
        right: parts[0],
        bottom: parts[0],
        left: parts[0],
      };
    case 2:
      return {
        top: parts[0],
        right: parts[1],
        bottom: parts[0],
        left: parts[1],
      };
    case 3:
      return {
        top: parts[0],
        right: parts[1],
        bottom: parts[2],
        left: parts[1],
      };
    case 4:
      return {
        top: parts[0],
        right: parts[1],
        bottom: parts[2],
        left: parts[3],
      };
    default:
      return {
        top: fallback,
        right: fallback,
        bottom: fallback,
        left: fallback,
      };
  }
}

/**
 * Computes subtle orbital yaw/pitch (in radians) from normalized pointer coordinates [-1, 1]
 * and directional cursor/click range limits.
 */
export function computeOrbitAngles(
  normX: number,
  normY: number,
  cursorRange: DirectionalRange,
  clickRange: DirectionalRange,
  clickImpulse = 0
): { yawRad: number; pitchRad: number } {
  const clampedX = Math.max(-1, Math.min(1, normX));
  const clampedY = Math.max(-1, Math.min(1, normY));
  const impulse = Math.max(0, Math.min(1, clickImpulse));

  const horizLimitDeg =
    clampedX >= 0
      ? cursorRange.right + impulse * clickRange.right
      : cursorRange.left + impulse * clickRange.left;
  const vertLimitDeg =
    clampedY >= 0
      ? cursorRange.bottom + impulse * clickRange.bottom
      : cursorRange.top + impulse * clickRange.top;

  const degToRad = Math.PI / 180;
  // Scale factor matches mckp.live subtle studio orbit feel
  const yawRad = clampedX * horizLimitDeg * 0.35 * degToRad;
  const pitchRad = clampedY * vertLimitDeg * 0.28 * degToRad;

  return { yawRad, pitchRad };
}

/**
 * Computes vertical scroll progress [0..1] for full-page portfolio screenshots
 * rendered onto the 3D MacBook screen during the 13.33s animation cycle.
 */
export function computeScreenScrollProgress(
  elapsedSec: number,
  durationSec: number = MOCKUP_SCENE_SETTINGS.masterDurationSec
): number {
  if (!Number.isFinite(elapsedSec) || durationSec <= 0) return 0;
  const cycleTime = ((elapsedSec % durationSec) + durationSec) % durationSec;
  // Hold at hero top while lid begins opening (0..3.2s), then smoothly scroll down (3.2s..11.2s) and settle
  const startScroll = 3.2;
  const endScroll = 11.5;
  if (cycleTime <= startScroll) return 0;
  if (cycleTime >= endScroll) return 1;
  const t = (cycleTime - startScroll) / (endScroll - startScroll);
  // Smoothstep easing
  return t * t * (3 - 2 * t);
}

/**
 * Parses aspect-ratio attribute like "4 / 3" or "16 / 10" into a numeric width/height ratio.
 */
export function parseAspectRatio(raw: string | undefined | null): number {
  if (!raw) return 4 / 3;
  const parts = raw.split('/').map((s) => Number.parseFloat(s.trim()));
  if (
    parts.length === 2 &&
    Number.isFinite(parts[0]) &&
    Number.isFinite(parts[1]) &&
    parts[0] > 0 &&
    parts[1] > 0
  ) {
    return parts[0] / parts[1];
  }
  const single = Number.parseFloat(raw);
  return Number.isFinite(single) && single > 0 ? single : 4 / 3;
}
