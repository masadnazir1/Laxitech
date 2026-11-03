export const HERO_CAMERA_TIME = 13.333333;
export const HERO_LID_START = 3;
export const HERO_LID_END = 9.983333;
export const HERO_SHOT_DURATION = 2.6;
export const HERO_SCREEN_WIDTH = 1200;
export const HERO_SCREEN_HEIGHT = HERO_SCREEN_WIDTH * 1964 / 3024;

export interface ScreenPoint {
  x: number;
  y: number;
}

export type ScreenQuad = readonly [ScreenPoint, ScreenPoint, ScreenPoint, ScreenPoint];

export function getHeroFrame(elapsed: number, reducedMotion = false) {
  const safeElapsed = Number.isFinite(elapsed) ? Math.max(0, elapsed) : 0;
  const localTime = reducedMotion ? HERO_SHOT_DURATION : Math.min(safeElapsed, HERO_SHOT_DURATION);
  const progress = localTime / HERO_SHOT_DURATION;
  const eased = progress * progress * (3 - 2 * progress);
  const screenProgress = Math.max(0, Math.min(1, (progress - 0.3) / 0.3));

  return {
    cameraTime: HERO_CAMERA_TIME,
    lidTime: HERO_LID_START + (HERO_LID_END - HERO_LID_START) * eased,
    progress,
    finished: localTime >= HERO_SHOT_DURATION,
    screenOpacity: screenProgress * screenProgress * (3 - 2 * screenProgress),
  };
}

export function screenQuadMatrix(width: number, height: number, quad: ScreenQuad): string | null {
  if (width <= 0 || height <= 0 || !Number.isFinite(width + height)) return null;
  if (quad.some((point) => !Number.isFinite(point.x + point.y))) return null;

  const [tl, tr, br, bl] = quad;
  const dx1 = tr.x - br.x;
  const dx2 = bl.x - br.x;
  const dy1 = tr.y - br.y;
  const dy2 = bl.y - br.y;
  const sx = tl.x - tr.x + br.x - bl.x;
  const sy = tl.y - tr.y + br.y - bl.y;
  const determinant = dx1 * dy2 - dx2 * dy1;
  if (Math.abs(determinant) < 0.0001) return null;

  const g = (sx * dy2 - sy * dx2) / determinant;
  const h = (dx1 * sy - dy1 * sx) / determinant;
  const a = tr.x - tl.x + g * tr.x;
  const b = bl.x - tl.x + h * bl.x;
  const d = tr.y - tl.y + g * tr.y;
  const e = bl.y - tl.y + h * bl.y;
  const values = [a / width, d / width, 0, g / width, b / height, e / height, 0, h / height, 0, 0, 1, 0, tl.x, tl.y, 0, 1];
  return `matrix3d(${values.map((value) => Number(value.toFixed(9))).join(',')})`;
}
