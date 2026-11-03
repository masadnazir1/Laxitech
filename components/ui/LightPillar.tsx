'use client';

/* LightPillar — self-contained volumetric column background.
   Configured with Electric Blue (#0066FF) to Electric Purple (#7C3AED) color grading,
   viewport-gated rendering, and route-transition pause so page switches remain instant. */

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { useHardwareTier } from '@/lib/hardwareTier';

export interface LightPillarProps {
  topColor?: string;
  bottomColor?: string;
  intensity?: number;
  rotationSpeed?: number;
  interactive?: boolean;
  className?: string;
  glowAmount?: number;
  pillarWidth?: number;
  pillarHeight?: number;
  noiseIntensity?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  pillarRotation?: number;
  quality?: 'low' | 'medium' | 'high';
}

export function LightPillar({
  topColor = '#0066FF',
  bottomColor = '#7C3AED',
  intensity = 1.0,
  rotationSpeed = 0.3,
  interactive = false,
  className = '',
  glowAmount = 0.003,
  pillarWidth = 4.8,
  pillarHeight = 0.4,
  noiseIntensity = 0.65,
  mixBlendMode = 'normal',
  pillarRotation = 15,
  quality = 'high',
}: LightPillarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const geometryRef = useRef<THREE.PlaneGeometry | null>(null);
  const mouseRef = useRef<THREE.Vector2>(new THREE.Vector2(0, 0));
  const timeRef = useRef(0);
  const rotationSpeedRef = useRef(rotationSpeed);
  const [webGLSupported, setWebGLSupported] = useState<boolean>(true);
  const hw = useHardwareTier();
  const isLowGpuTier = !hw.allowSecondaryWebGL || hw.tier === 'low';

  useEffect(() => {
    if (!containerRef.current || !webGLSupported || isLowGpuTier) return;
    const container = containerRef.current;
    let cleanup: (() => void) | undefined;

    const initialize = () => {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const effectiveQuality =
      hw.tier === 'balanced' ? 'medium' : quality;
    const dpr =
      typeof window !== 'undefined'
        ? Math.min(window.devicePixelRatio || 1, hw.maxDpr)
        : 1.0;

    const qualitySettings = {
      low: {
        iterations: 28,
        waveIterations: 2,
        pixelRatio: Math.min(dpr, 0.8),
        precision: 'mediump',
        stepMultiplier: 1.3,
      },
      medium: {
        iterations: 38,
        waveIterations: 3,
        pixelRatio: dpr,
        precision: 'highp',
        stepMultiplier: 1.08,
      },
      high: {
        iterations: 48,
        waveIterations: 4,
        pixelRatio: dpr,
        precision: 'highp',
        stepMultiplier: 1.0,
      },
    };

    const settings =
      qualitySettings[effectiveQuality] || qualitySettings.high;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: 'low-power',
        precision: settings.precision as 'highp' | 'mediump' | 'lowp',
        stencil: false,
        depth: false,
      });
    } catch {
      setWebGLSupported(false);
      return;
    }

    renderer.setSize(width, height, false);
    renderer.setPixelRatio(settings.pixelRatio);
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const parseColor = (hex: string): THREE.Vector3 => {
      const color = new THREE.Color(hex);
      return new THREE.Vector3(color.r, color.g, color.b);
    };

    const isLightMode = () =>
      typeof document !== 'undefined' &&
      document.documentElement.getAttribute('data-theme') === 'light'
        ? 1.0
        : 0.0;

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision ${settings.precision} float;

      uniform float uTime;
      uniform vec2 uResolution;
      uniform vec2 uMouse;
      uniform vec3 uTopColor;
      uniform vec3 uBottomColor;
      uniform float uIntensity;
      uniform bool uInteractive;
      uniform float uGlowAmount;
      uniform float uPillarWidth;
      uniform float uPillarHeight;
      uniform float uNoiseIntensity;
      uniform float uRotCos;
      uniform float uRotSin;
      uniform float uPillarRotCos;
      uniform float uPillarRotSin;
      uniform float uWaveSin;
      uniform float uWaveCos;
      uniform float uIsLight;
      varying vec2 vUv;

      const float STEP_MULT = ${settings.stepMultiplier.toFixed(1)};
      const int MAX_ITER = ${settings.iterations};
      const int WAVE_ITER = ${settings.waveIterations};

      void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);
        uv = vec2(uPillarRotCos * uv.x - uPillarRotSin * uv.y, uPillarRotSin * uv.x + uPillarRotCos * uv.y);

        vec3 ro = vec3(0.0, 0.0, -10.0);
        vec3 rd = normalize(vec3(uv, 1.0));

        float rotC = uRotCos;
        float rotS = uRotSin;
        if(uInteractive && (uMouse.x != 0.0 || uMouse.y != 0.0)) {
          float a = uMouse.x * 6.283185;
          rotC = cos(a);
          rotS = sin(a);
        }

        vec3 col = vec3(0.0);
        float t = 0.1;
        
        for(int i = 0; i < MAX_ITER; i++) {
          vec3 p = ro + rd * t;
          p.xz = vec2(rotC * p.x - rotS * p.z, rotS * p.x + rotC * p.z);

          vec3 q = p;
          q.y = p.y * uPillarHeight + uTime;
          
          float freq = 1.0;
          float amp = 1.0;
          for(int j = 0; j < WAVE_ITER; j++) {
            q.xz = vec2(uWaveCos * q.x - uWaveSin * q.z, uWaveSin * q.x + uWaveCos * q.z);
            q += cos(q.zxy * freq - uTime * float(j) * 2.0) * amp;
            freq *= 2.0;
            amp *= 0.5;
          }
          
          float d = length(cos(q.xz)) - 0.2;
          float bound = length(p.xz) - uPillarWidth;
          float k = 4.0;
          float h = max(k - abs(d - bound), 0.0);
          d = max(d, bound) + h * h * 0.0625 / k;
          d = abs(d) * 0.15 + 0.01;

          float grad = clamp((15.0 - p.y) / 30.0, 0.0, 1.0);
          col += mix(uBottomColor, uTopColor, grad) / d;

          t += d * STEP_MULT;
          if(t > 50.0) break;
        }

        float widthNorm = uPillarWidth / 3.0;
        col = tanh(col * uGlowAmount / widthNorm);
        
        col -= fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 15.0 * uNoiseIntensity;
        
        vec3 beamRgb = max(col * uIntensity, vec3(0.0));
        float lum = clamp(max(beamRgb.r, max(beamRgb.g, beamRgb.b)) * 1.45, 0.0, 1.0);
        float alpha = mix(
          clamp(pow(lum, 0.85) * 0.96, 0.0, 0.96),
          clamp(pow(lum, 0.68) * 0.84, 0.0, 0.88),
          uIsLight
        );
        vec3 vividLightBeam = mix(
          vec3(0.42, 0.14, 0.90),
          vec3(0.00, 0.34, 0.98),
          clamp(vUv.y * 0.85 + lum * 0.25, 0.0, 1.0)
        );
        vec3 lightTint = mix(
          vividLightBeam,
          vec3(0.05, 0.14, 0.55),
          clamp(pow(lum, 1.6) * 0.38, 0.0, 0.45)
        );
        vec3 finalRgb = mix(beamRgb, lightTint, uIsLight);
        gl_FragColor = vec4(finalRgb, alpha);
      }
    `;

    const pillarRotRad = (pillarRotation * Math.PI) / 180;
    const waveSin = Math.sin(0.4);
    const waveCos = Math.cos(0.4);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: new THREE.Vector2(width, height) },
        uMouse: { value: mouseRef.current },
        uTopColor: { value: parseColor(topColor) },
        uBottomColor: { value: parseColor(bottomColor) },
        uIntensity: { value: intensity },
        uInteractive: { value: interactive },
        uGlowAmount: { value: glowAmount },
        uPillarWidth: { value: pillarWidth },
        uPillarHeight: { value: pillarHeight },
        uNoiseIntensity: { value: noiseIntensity },
        uRotCos: { value: 1.0 },
        uRotSin: { value: 0.0 },
        uPillarRotCos: { value: Math.cos(pillarRotRad) },
        uPillarRotSin: { value: Math.sin(pillarRotRad) },
        uWaveSin: { value: waveSin },
        uWaveCos: { value: waveCos },
        uIsLight: { value: isLightMode() },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    materialRef.current = material;

    const geometry = new THREE.PlaneGeometry(2, 2);
    geometryRef.current = geometry;
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let lastTime = performance.now();
    const frameTime = 1000 / 30; // Smooth 30fps cap

    // Start false until IntersectionObserver confirms section is near viewport
    let isInView = false;
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            ([entry]) => {
              isInView = Boolean(entry?.isIntersecting);
            },
            { rootMargin: '200px 0px', threshold: 0 }
          )
        : null;

    if (io) {
      io.observe(container);
    } else {
      isInView = true;
    }

    const themeObserver =
      typeof MutationObserver !== 'undefined'
        ? new MutationObserver(() => {
            if (materialRef.current) {
              materialRef.current.uniforms.uIsLight.value = isLightMode();
              if (
                rendererRef.current &&
                sceneRef.current &&
                cameraRef.current
              ) {
                rendererRef.current.render(
                  sceneRef.current,
                  cameraRef.current
                );
              }
            }
          })
        : null;
    if (themeObserver && typeof document !== 'undefined') {
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });
    }

    // Render 1 initial frame so canvas is never blank if already in view
    renderer.render(scene, camera);

    const animate = (currentTime: number) => {
      if (
        !materialRef.current ||
        !rendererRef.current ||
        !sceneRef.current ||
        !cameraRef.current
      )
        return;

      rafRef.current = requestAnimationFrame(animate);

      if (
        !isInView ||
        document.documentElement.dataset.routeTransition === 'active'
      ) {
        return;
      }

      const deltaTime = currentTime - lastTime;
      if (deltaTime >= frameTime) {
        timeRef.current += 0.032 * rotationSpeedRef.current;
        const t = timeRef.current;
        materialRef.current.uniforms.uTime.value = t;
        materialRef.current.uniforms.uRotCos.value = Math.cos(t * 0.3);
        materialRef.current.uniforms.uRotSin.value = Math.sin(t * 0.3);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
        lastTime = currentTime - (deltaTime % frameTime);
      }
    };
    rafRef.current = requestAnimationFrame(animate);

    let resizeTimeout: number | null = null;
    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }

      resizeTimeout = window.setTimeout(() => {
        if (
          !rendererRef.current ||
          !materialRef.current ||
          !containerRef.current
        )
          return;
        const newWidth = containerRef.current.clientWidth;
        const newHeight = containerRef.current.clientHeight;
        if (newWidth <= 0 || newHeight <= 0) return;
        rendererRef.current.setSize(newWidth, newHeight, false);
        materialRef.current.uniforms.uResolution.value.set(newWidth, newHeight);
      }, 150);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      if (resizeTimeout !== null) window.clearTimeout(resizeTimeout);
      if (io) io.disconnect();
      if (themeObserver) themeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
      }
      if (materialRef.current) {
        materialRef.current.dispose();
      }
      if (geometryRef.current) {
        geometryRef.current.dispose();
      }

      rendererRef.current = null;
      materialRef.current = null;
      sceneRef.current = null;
      cameraRef.current = null;
      geometryRef.current = null;
      rafRef.current = null;
    };
    };

    const activationObserver = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      activationObserver.disconnect();
      cleanup = initialize();
    }, { rootMargin: '180px' });
    activationObserver.observe(container);
    return () => {
      activationObserver.disconnect();
      cleanup?.();
    };
  }, [webGLSupported, quality, hw, isLowGpuTier, topColor, bottomColor, glowAmount, intensity, interactive, noiseIntensity, pillarHeight, pillarRotation, pillarWidth]);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    if (!materialRef.current) return;
    const parseColor = (hex: string) => {
      const color = new THREE.Color(hex);
      return new THREE.Vector3(color.r, color.g, color.b);
    };
    materialRef.current.uniforms.uTopColor.value = parseColor(topColor);
  }, [topColor]);

  useEffect(() => {
    if (!materialRef.current) return;
    const parseColor = (hex: string) => {
      const color = new THREE.Color(hex);
      return new THREE.Vector3(color.r, color.g, color.b);
    };
    materialRef.current.uniforms.uBottomColor.value = parseColor(bottomColor);
  }, [bottomColor]);

  if (!webGLSupported || isLowGpuTier) {
    return (
      <div
        aria-hidden="true"
        className={`light-pillar-fallback pointer-events-none absolute inset-0 size-full overflow-hidden ${className}`}
        style={{
          mixBlendMode,
          background:
            'radial-gradient(48% 58% at 50% 42%, rgba(0, 102, 255, 0.28) 0%, rgba(124, 58, 237, 0.20) 46%, transparent 82%)',
        }}
      />
    );
  }

  return (
    <div
      ref={containerRef}
      className={`light-pillar-container absolute inset-0 size-full overflow-hidden ${className}`}
      style={{ mixBlendMode }}
      aria-hidden="true"
    />
  );
}

export default LightPillar;
