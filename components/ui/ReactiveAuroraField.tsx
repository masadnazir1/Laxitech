'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { getHardwareProfile } from '@/lib/hardwareTier';

export interface ReactiveAuroraFieldProps {
  hasActiveReminders?: boolean;
  hasUpcomingReminders?: boolean;
  hasActiveItems?: boolean;
  hasUpcomingItems?: boolean;
  disableCenterDimming?: boolean;
  fixed?: boolean;
  className?: string;
}

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;

  uniform vec2 uResolution;
  uniform vec2 uPointer;
  uniform float uTime;
  uniform float uCenterDimming;
  uniform float uIsLight;
  uniform int uMode;

  varying vec2 vUv;

  mat2 rotate2D(float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return mat2(
      cosine, -sine,
      sine, cosine
    );
  }

  float randomValue(vec2 point) {
    return fract(
      sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123
    );
  }

  float smoothNoise(vec2 point) {
    vec2 cell = floor(point);
    vec2 local = fract(point);
    local = local * local * (3.0 - 2.0 * local);

    float bottomLeft = randomValue(cell);
    float bottomRight = randomValue(cell + vec2(1.0, 0.0));
    float topLeft = randomValue(cell + vec2(0.0, 1.0));
    float topRight = randomValue(cell + vec2(1.0, 1.0));

    return mix(
      mix(bottomLeft, bottomRight, local.x),
      mix(topLeft, topRight, local.x),
      local.y
    );
  }

  // 5-octave Fractal Brownian Motion for sharp, intricate smoke curls and fine filaments
  float layeredNoise(vec2 point) {
    float result = 0.0;
    float strength = 0.5;

    for (int i = 0; i < 5; i++) {
      result += smoothNoise(point) * strength;
      point = rotate2D(0.54) * point * 2.04 + vec2(3.1, 1.7);
      strength *= 0.5;
    }

    return result;
  }

  // Sharp turbulent smoke crease function (ridged multifractal style)
  float smokeTurbulence(vec2 point) {
    float result = 0.0;
    float strength = 0.52;
    for (int i = 0; i < 4; i++) {
      float n = smoothNoise(point);
      float ridge = 1.0 - abs(n * 2.0 - 1.0);
      result += ridge * ridge * strength;
      point = rotate2D(0.68) * point * 2.12 + vec2(1.9, 4.3);
      strength *= 0.5;
    }
    return result;
  }

  // CYNEX Signature Palette: Electric Blue (#0066FF) + Electric Purple (#7C3AED / #8B5CF6)
  vec3 getPaletteA() {
    if (uMode == 1) return vec3(0.04, 0.24, 0.92);
    if (uMode == 2) return vec3(0.06, 0.28, 0.96);
    return vec3(0.03, 0.26, 0.95);
  }

  vec3 getPaletteB() {
    if (uMode == 1) return vec3(0.56, 0.34, 0.97);
    if (uMode == 2) return vec3(0.62, 0.30, 0.99);
    return vec3(0.55, 0.28, 0.96);
  }

  vec3 getPaletteC() {
    if (uMode == 1) return vec3(0.00, 0.44, 1.00);
    if (uMode == 2) return vec3(0.08, 0.50, 1.00);
    return vec3(0.00, 0.42, 1.00);
  }

  void main() {
    vec2 resolution = max(uResolution, vec2(1.0));

    vec2 position =
      (gl_FragCoord.xy - resolution * 0.5) /
      min(resolution.x, resolution.y);

    float time = uTime * 0.095;

    position += uPointer * 0.045;
    position *= rotate2D(sin(time * 0.38) * 0.10);

    vec2 firstWarp = vec2(
      layeredNoise(position * 1.85 + vec2(time, -time * 0.72)),
      layeredNoise(position * 1.85 + vec2(5.8, 2.1 - time))
    );

    vec2 secondWarp = vec2(
      layeredNoise(position * 2.65 + firstWarp * 1.95 + vec2(-time * 0.85, time * 0.48)),
      layeredNoise(position * 2.40 - firstWarp * 1.55 + vec2(7.2, time * 0.65))
    );

    float cloudField = layeredNoise(
      position * 2.45 +
      firstWarp * 1.35 +
      secondWarp * 0.85
    );

    // Sharp smoky filaments & silk folds
    float smokeFolds = smokeTurbulence(
      position * 2.8 + firstWarp * 1.6 - secondWarp * 0.9 + vec2(time * 0.4, -time * 0.3)
    );

    float ribbonWave = sin(
      position.x * 3.6 +
      position.y * 2.4 +
      firstWarp.x * 4.6 -
      secondWarp.y * 3.1 +
      time * 2.1
    );

    float ribbonField = smoothstep(-0.25, 0.72, ribbonWave);
    float sharpCrest = pow(clamp(1.0 - abs(ribbonWave), 0.0, 1.0), 3.4) * smoothstep(0.22, 0.82, smokeFolds);

    float cloud = smoothstep(0.20, 0.84, cloudField);
    float ribbons = (ribbonField * 0.78 + sharpCrest * 0.65) * smoothstep(0.16, 0.78, cloudField);

    vec3 paletteA = getPaletteA(); // Deep Cobalt
    vec3 paletteB = getPaletteB(); // Electric Purple
    vec3 paletteC = getPaletteC(); // Electric Blue

    vec3 baseAtmosphere = mix(
      vec3(0.015, 0.04, 0.20),
      paletteA,
      smoothstep(0.14, 0.78, cloudField)
    );

    vec3 purpleNebula = mix(
      baseAtmosphere,
      paletteB,
      smoothstep(0.18, 0.82, cloud * 0.8 + smokeFolds * 0.35) * 0.78
    );

    vec3 ribbonColor = mix(
      paletteC,
      paletteB,
      smoothstep(-0.15, 0.75, ribbonField) * 0.66
    );

    vec3 cosmicAurora = mix(
      purpleNebula,
      ribbonColor,
      clamp(ribbons * 1.42, 0.0, 1.0)
    );

    float crestEnergy = pow(clamp(ribbons * 1.32 + sharpCrest * 0.6, 0.0, 1.0), 2.1);
    vec3 crestGlow = mix(paletteC * 1.24, paletteB * 1.30, sin(time + position.x * 2.4) * 0.5 + 0.5);
    cosmicAurora = mix(cosmicAurora, crestGlow, clamp(crestEnergy * 0.68, 0.0, 1.0));

    // Crisp pixel-level smoke grain / dithering texture (like LightPillar)
    float grain = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.075;
    cosmicAurora = max(cosmicAurora + grain, vec3(0.0));

    float centerDistance = length(position * vec2(0.92, 1.18));
    float centerDim = mix(
      1.0,
      mix(0.48, 1.0, smoothstep(0.08, 0.62, centerDistance)),
      uCenterDimming
    );

    float vignette = smoothstep(
      1.75,
      0.22,
      length(position * vec2(0.80, 0.95))
    );

    float energy = clamp(
      (cloud * 0.56 + ribbons * 0.92 + sharpCrest * 0.35) * vignette,
      0.0,
      1.0
    );

    vec3 darkRgb = cosmicAurora * mix(0.74, 1.0, centerDim);
    float darkAlpha = clamp(energy * mix(0.78, 1.18, centerDim), 0.0, 0.96);

    vec3 lightPaletteBlue = vec3(0.00, 0.34, 0.98);
    vec3 lightPaletteViolet = vec3(0.44, 0.16, 0.92);
    vec3 lightPaletteCyan = vec3(0.02, 0.52, 1.00);

    vec3 lightPigment = mix(
      lightPaletteBlue,
      lightPaletteViolet,
      clamp(ribbons * 0.72 + smokeFolds * 0.42, 0.0, 1.0)
    );
    lightPigment = mix(
      lightPigment,
      lightPaletteCyan,
      clamp(sharpCrest * 0.75, 0.0, 1.0)
    );
    // Add crisp dark-indigo smoke crease definition so silk folds pop on white
    vec3 deepCrease = vec3(0.06, 0.12, 0.48);
    lightPigment = mix(
      lightPigment,
      deepCrease,
      clamp(pow(smokeFolds, 1.8) * 0.42, 0.0, 0.45)
    );

    float lightCenterClear = smoothstep(0.06, 0.72, length((position - vec2(0.0, 0.16)) * vec2(0.88, 1.25)));
    float lightMask = mix(1.0, mix(0.22, 1.0, lightCenterClear), uCenterDimming);

    float lightStructure = clamp(
      pow(energy, 0.66) * 0.92 + sharpCrest * 0.32 + smokeFolds * 0.24 * vignette,
      0.0,
      1.0
    );
    vec3 lightMist = clamp(lightPigment + grain * 0.48, 0.0, 1.0);
    float lightAlpha = clamp(
      lightStructure * 0.78 * lightMask,
      0.0,
      0.82
    );

    vec3 finalRgb = mix(darkRgb, lightMist, uIsLight);
    float finalAlpha = mix(darkAlpha, lightAlpha, uIsLight);

    gl_FragColor = vec4(finalRgb, finalAlpha);
  }
`;

interface SharedAuroraEngine {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  material: THREE.ShaderMaterial;
  uniforms: {
    uResolution: { value: THREE.Vector2 };
    uPointer: { value: THREE.Vector2 };
    uTime: { value: number };
    uMode: { value: number };
    uCenterDimming: { value: number };
    uIsLight: { value: number };
  };
}

let sharedEngine: SharedAuroraEngine | null = null;
let sharedEngineFailed = false;

function getIsLightMode(): number {
  return typeof document !== 'undefined' &&
    document.documentElement.getAttribute('data-theme') === 'light'
    ? 1.0
    : 0.0;
}

function getOrCreateAuroraEngine(): SharedAuroraEngine | null {
  if (sharedEngine) return sharedEngine;
  if (sharedEngineFailed || typeof window === 'undefined') return null;

  try {
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: 'high-performance',
      depth: false,
      stencil: false,
    });
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.setAttribute('aria-hidden', 'true');

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const uniforms = {
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uTime: { value: 0 },
      uMode: { value: 0 },
      uCenterDimming: { value: 1 },
      uIsLight: { value: getIsLightMode() },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    sharedEngine = {
      renderer,
      scene,
      camera,
      material,
      uniforms,
    };
    return sharedEngine;
  } catch {
    sharedEngineFailed = true;
    return null;
  }
}

/**
 * Full-screen / Hero Animated Aurora Nebula Background
 * ----------------------------------------------------
 * Uses a persistent singleton Three.js WebGLRenderer & pre-compiled GLSL shader
 * that reparents cleanly across route transitions (HeroHeader <-> PageHeader)
 * with 0ms shader compilation overhead on page switches.
 */
export function ReactiveAuroraField({
  hasActiveReminders = false,
  hasUpcomingReminders = false,
  hasActiveItems = false,
  hasUpcomingItems = false,
  disableCenterDimming = false,
  fixed = false,
  className = '',
}: ReactiveAuroraFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const isActive = hasActiveReminders || hasActiveItems;
  const isUpcoming = hasUpcomingReminders || hasUpcomingItems;

  useEffect(() => {
    const engine = getOrCreateAuroraEngine();
    if (!engine) return;
    engine.uniforms.uMode.value = isActive ? 1 : isUpcoming ? 2 : 0;
    engine.uniforms.uCenterDimming.value = disableCenterDimming ? 0 : 1;
  }, [isActive, isUpcoming, disableCenterDimming]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const engine = getOrCreateAuroraEngine();
    if (!engine) return;

    const { renderer, scene, camera, uniforms } = engine;
    uniforms.uIsLight.value = getIsLightMode();
    container.appendChild(renderer.domElement);

    const pointerTarget = new THREE.Vector2();
    const pointerCurrent = new THREE.Vector2();

    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const isTouchDevice =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(pointer: coarse)').matches;

    let isInView = true;

    const hw = getHardwareProfile();

    const resizeRenderer = () => {
      if (!container) return;
      const { width, height } = container.getBoundingClientRect();
      if (width <= 0 || height <= 0) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, hw.maxDpr);

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(Math.max(1, Math.round(width)), Math.max(1, Math.round(height)), false);
      renderer.getDrawingBufferSize(uniforms.uResolution.value);
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (isTouchDevice || !isInView) return;
      const bounds = container.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      pointerTarget.set(
        ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
        -(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
      );
    };

    const handlePointerLeave = () => {
      pointerTarget.set(0, 0);
    };

    const resizeObserver = new ResizeObserver(resizeRenderer);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isInView = entry?.isIntersecting ?? true;
      },
      { rootMargin: '150px 0px' }
    );
    intersectionObserver.observe(container);

    const themeObserver = new MutationObserver(() => {
      uniforms.uIsLight.value = getIsLightMode();
      if (isInView) {
        renderer.render(scene, camera);
      }
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    if (!isTouchDevice) {
      window.addEventListener('pointermove', handlePointerMove, {
        passive: true,
      });
      window.addEventListener('blur', handlePointerLeave);
    }

    resizeRenderer();

    const startTime = performance.now();
    let lastFrameTime = 0;
    const frameInterval = 1000 / 30; // Smooth 30fps cap for slow atmospheric drift
    let rafId = 0;

    // Render initial frame immediately
    uniforms.uTime.value = (performance.now() - startTime) * 0.001;
    renderer.render(scene, camera);

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);

      // Pause shader evaluation while route transition curtain is sweeping so 100% of CPU/GPU goes to navigation
      if (
        !isInView ||
        document.documentElement.dataset.routeTransition === 'active'
      ) {
        return;
      }

      if (now - lastFrameTime < frameInterval) return;
      lastFrameTime = now;

      const elapsedSeconds = (now - startTime) * 0.001;
      pointerCurrent.lerp(pointerTarget, reducedMotion ? 0.015 : 0.045);
      uniforms.uPointer.value.copy(pointerCurrent);
      uniforms.uTime.value = reducedMotion ? elapsedSeconds * 0.12 : elapsedSeconds;

      renderer.render(scene, camera);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      themeObserver.disconnect();

      if (!isTouchDevice) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('blur', handlePointerLeave);
      }

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{
        position: fixed ? 'fixed' : 'absolute',
        inset: 0,
        width: '100%',
        height: fixed ? '100dvh' : '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        background: 'transparent',
      }}
    />
  );
}

export default ReactiveAuroraField;
