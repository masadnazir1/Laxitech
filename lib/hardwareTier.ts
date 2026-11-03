'use client';

import { useSyncExternalStore } from 'react';

export type HardwareTier = 'high' | 'balanced' | 'low';

export interface HardwareProfile {
  tier: HardwareTier;
  isMobile: boolean;
  renderer: string;
  maxDpr: number;
  allowSecondaryWebGL: boolean;
}

const WEAK_GPU_PATTERNS = [
  /itel/i,
  /unisoc/i,
  /spreadtrum/i,
  /mali-g52/i,
  /mali-g57/i,
  /mali-g31/i,
  /mali-t/i,
  /mali-4/i,
  /powervr/i,
  /adreno\s*(3|4|5|610|612|615|616|618|619)/i,
  /vivante/i,
  /videocore/i,
  /swiftshader/i,
  /llvmpipe/i,
];

let cachedProfile: HardwareProfile | null = null;
const subscribers = new Set<(profile: HardwareProfile) => void>();
let fpsProbeStarted = false;
const SERVER_PROFILE: HardwareProfile = {
  tier: 'high',
  isMobile: false,
  renderer: 'ssr',
  maxDpr: 1.5,
  allowSecondaryWebGL: true,
};

function detectInitialHardwareProfile(): HardwareProfile {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      tier: 'high',
      isMobile: false,
      renderer: 'ssr',
      maxDpr: 1.5,
      allowSecondaryWebGL: true,
    };
  }

  if (cachedProfile) return cachedProfile;

  const ua = navigator.userAgent || '';
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua) ||
    (typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches);

  const reducedMotion =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const cores = navigator.hardwareConcurrency || 8;

  let unmaskedRenderer = '';
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        unmaskedRenderer =
          gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    }
  } catch {
    unmaskedRenderer = '';
  }

  const combinedSignature = `${ua} ${unmaskedRenderer}`;
  const isKnownWeakGpu = WEAK_GPU_PATTERNS.some((pattern) =>
    pattern.test(combinedSignature)
  );
  const isLowMemoryOrCores =
    (typeof deviceMemory === 'number' && deviceMemory <= 4) || cores <= 4;

  let tier: HardwareTier = 'high';
  if (reducedMotion || (isMobile && (isKnownWeakGpu || isLowMemoryOrCores))) {
    tier = 'low';
  } else if (isMobile) {
    tier = 'balanced';
  }

  cachedProfile = {
    tier,
    isMobile,
    renderer: unmaskedRenderer || 'standard',
    maxDpr: tier === 'high' ? 1.5 : tier === 'balanced' ? 1.0 : 0.8,
    allowSecondaryWebGL: tier !== 'low',
  };

  if (typeof document !== 'undefined') {
    document.documentElement.dataset.gpuTier = tier;
  }

  // Run a lightweight 25-frame runtime FPS probe on mobile devices in 'balanced' mode
  // to automatically downgrade to 'low' if real-world frame rate drops below 26fps
  if (isMobile && tier === 'balanced' && !fpsProbeStarted) {
    fpsProbeStarted = true;
    let frames = 0;
    let startTime = 0;
    const step = (now: number) => {
      if (startTime === 0) startTime = now;
      frames += 1;
      if (frames < 25) {
        requestAnimationFrame(step);
      } else {
        const elapsed = now - startTime;
        const avgFps = (frames * 1000) / Math.max(1, elapsed);
        if (avgFps < 26 && cachedProfile && cachedProfile.tier !== 'low') {
          cachedProfile = {
            ...cachedProfile,
            tier: 'low',
            maxDpr: 0.75,
            allowSecondaryWebGL: false,
          };
          if (typeof document !== 'undefined') {
            document.documentElement.dataset.gpuTier = 'low';
          }
          subscribers.forEach((cb) => cachedProfile && cb(cachedProfile));
        }
      }
    };
    requestAnimationFrame(step);
  }

  return cachedProfile;
}

export function getHardwareProfile(): HardwareProfile {
  return detectInitialHardwareProfile();
}

export function useHardwareTier(): HardwareProfile {
  return useSyncExternalStore(subscribeHardware, getHardwareSnapshot, getServerHardwareSnapshot);
}

function subscribeHardware(listener: () => void) {
  subscribers.add(listener);
  detectInitialHardwareProfile();
  return () => { subscribers.delete(listener); };
}

function getHardwareSnapshot() {
  return cachedProfile ?? SERVER_PROFILE;
}

function getServerHardwareSnapshot() {
  return SERVER_PROFILE;
}
