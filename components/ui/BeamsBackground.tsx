'use client';

/**
 * Beams — Self-contained full-screen animated WebGL background.
 * Uses a streamlined custom Three.js ShaderMaterial with 3D Perlin noise
 * vertex displacement + analytic normal perturbation on stacked ribbon planes,
 * dual Electric Blue + Purple studio lighting, transparent dynamic theme adaptation
 * (shows white in light mode and black in dark mode), ?card lightweight mode,
 * and viewport-gated WebGL context lifecycle.
 */

import React, {
  forwardRef,
  useImperativeHandle,
  useEffect,
  useRef,
} from 'react';
import * as THREE from 'three';
import { getHardwareProfile } from '@/lib/hardwareTier';

const NOISE_GLSL = `
float random(in vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}
float noise(in vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}
vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) { return t * t * t * (t * (t * 6.0 - 15.0) + 10.0); }
float cnoise(vec3 P) {
  vec3 Pi0 = floor(P);
  vec3 Pi1 = Pi0 + vec3(1.0);
  Pi0 = mod(Pi0, 289.0);
  Pi1 = mod(Pi1, 289.0);
  vec3 Pf0 = fract(P);
  vec3 Pf1 = Pf0 - vec3(1.0);
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 / 7.0;
  vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 / 7.0;
  vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x, gy0.x, gz0.x);
  vec3 g100 = vec3(gx0.y, gy0.y, gz0.y);
  vec3 g010 = vec3(gx0.z, gy0.z, gz0.z);
  vec3 g110 = vec3(gx0.w, gy0.w, gz0.w);
  vec3 g001 = vec3(gx1.x, gy1.x, gz1.x);
  vec3 g101 = vec3(gx1.y, gy1.y, gz1.y);
  vec3 g011 = vec3(gx1.z, gy1.z, gz1.z);
  vec3 g111 = vec3(gx1.w, gy1.w, gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x; g010 *= norm0.y; g100 *= norm0.z; g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x; g011 *= norm1.y; g101 *= norm1.z; g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 2.2 * n_xyz;
}
`;

const BEAMS_VERTEX_SHADER = `
varying vec3 vViewPos;
varying vec3 vViewNormal;
varying vec3 vLocalPos;
uniform float time;
uniform float uSpeed;
uniform float uScale;
${NOISE_GLSL}

float getPos(vec3 pos, vec2 uvCoord) {
  vec3 noisePos = vec3(0.0, pos.y - uvCoord.y, pos.z + time * uSpeed * 3.0) * uScale;
  return cnoise(noisePos);
}

vec3 getCurrentPos(vec3 pos, vec2 uvCoord) {
  vec3 newpos = pos;
  newpos.z += getPos(pos, uvCoord);
  return newpos;
}

vec3 getNormal(vec3 pos, vec2 uvCoord) {
  vec3 curpos = getCurrentPos(pos, uvCoord);
  vec3 nextposX = getCurrentPos(pos + vec3(0.01, 0.0, 0.0), uvCoord);
  vec3 nextposZ = getCurrentPos(pos + vec3(0.0, -0.01, 0.0), uvCoord);
  vec3 tangentX = normalize(nextposX - curpos);
  vec3 tangentZ = normalize(nextposZ - curpos);
  return normalize(cross(tangentZ, tangentX));
}

void main() {
  vec3 displaced = getCurrentPos(position, uv);
  vec3 objNormal = getNormal(position, uv);
  vec4 mvPosition = modelViewMatrix * vec4(displaced, 1.0);
  vViewPos = -mvPosition.xyz;
  vViewNormal = normalize(normalMatrix * objNormal);
  vLocalPos = displaced;
  gl_Position = projectionMatrix * mvPosition;
}
`;

const BEAMS_FRAGMENT_SHADER = `
varying vec3 vViewPos;
varying vec3 vViewNormal;
varying vec3 vLocalPos;
uniform vec3 uBaseColor;
uniform vec3 uLightColor;
uniform vec3 uSecondaryColor;
uniform vec3 uLightDir;
uniform float uLightIntensity;
uniform float uAmbientIntensity;
uniform float uRoughness;
uniform float uMetalness;
uniform float uNoiseIntensity;
uniform float uIsLight;
uniform float time;
${NOISE_GLSL}

#define PI 3.14159265359

float D_GGX(float alpha, float NdotH) {
  float a2 = alpha * alpha;
  float denom = (NdotH * NdotH) * (a2 - 1.0) + 1.0;
  return a2 / max(PI * denom * denom, 0.0001);
}

float G_Smith(float alpha, float NdotV, float NdotL) {
  float a2 = alpha * alpha;
  float gv = NdotL * sqrt(NdotV * NdotV * (1.0 - a2) + a2);
  float gl = NdotV * sqrt(NdotL * NdotL * (1.0 - a2) + a2);
  return 0.5 / max(gv + gl, 0.0001);
}

vec3 F_Schlick(float VdotH, vec3 f0) {
  return f0 + (1.0 - f0) * pow(clamp(1.0 - VdotH, 0.0, 1.0), 5.0);
}

void main() {
  vec3 N = normalize(vViewNormal);
  vec3 V = normalize(vViewPos);
  vec3 L = normalize(uLightDir);
  vec3 H = normalize(V + L);

  float NdotL = clamp(dot(N, L), 0.0, 1.0);
  float NdotV = clamp(abs(dot(N, V)), 0.001, 1.0);
  float NdotH = clamp(dot(N, H), 0.0, 1.0);
  float VdotH = clamp(dot(V, H), 0.0, 1.0);

  // Blend Electric Blue + Purple smoothly across ribbon coordinates and time
  float gradMix = clamp(0.5 + 0.5 * sin(vLocalPos.x * 0.22 + vLocalPos.y * 0.14 + time * 1.2), 0.0, 1.0);
  vec3 dualAccent = mix(uLightColor, uSecondaryColor, gradMix);

  vec3 diffuseColor = uBaseColor * (1.0 - uMetalness);
  vec3 f0 = mix(vec3(0.045), dualAccent, uMetalness);
  float alpha = max(uRoughness * uRoughness, 0.04);

  float D = D_GGX(alpha, NdotH);
  float G = G_Smith(alpha, NdotV, NdotL);
  vec3 F = F_Schlick(VdotH, f0);

  vec3 specularBRDF = D * G * F;
  vec3 diffuseBRDF = diffuseColor / PI;

  vec3 directLight = (diffuseBRDF + specularBRDF) * dualAccent * uLightIntensity * NdotL * PI;
  vec3 ambientLight = mix(diffuseColor, dualAccent * 0.32, 0.52) * uAmbientIntensity * 0.42;

  vec3 col = directLight + ambientLight;

  // ACES-like soft highlight roll-off + sRGB gamma encoding
  col = (col * 1.32) / (col * 0.82 + vec3(0.88));
  col = pow(max(col, vec3(0.0)), vec3(1.0 / 2.2));

  float randomNoise = noise(gl_FragCoord.xy);
  col -= (randomNoise / 22.0) * uNoiseIntensity;
  col = clamp(col, 0.0, 1.0);

  // Compute ribbon luminance so flat background areas stay transparent,
  // dynamically revealing the website's white background in light mode and black in dark mode.
  float lum = clamp(max(max(col.r, col.g), col.b) * 1.75 + NdotL * 0.38, 0.0, 1.0);
  vec3 lightModeCol = mix(uLightColor, uSecondaryColor, gradMix) * (0.42 + 0.58 * NdotH);
  vec3 finalRgb = mix(col, lightModeCol, uIsLight * 0.76);
  float finalAlpha = mix(clamp(lum * 1.42, 0.14, 0.98), clamp(lum * 0.85, 0.08, 0.84), uIsLight);

  gl_FragColor = vec4(finalRgb, finalAlpha);
}
`;

function createStackedPlanesBufferGeometry(
  n: number,
  width: number,
  height: number,
  spacing: number,
  heightSegments: number
): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  const numVertices = n * (heightSegments + 1) * 2;
  const numFaces = n * heightSegments * 2;
  const positions = new Float32Array(numVertices * 3);
  const indices = new Uint32Array(numFaces * 3);
  const uvs = new Float32Array(numVertices * 2);

  let vertexOffset = 0;
  let indexOffset = 0;
  let uvOffset = 0;
  const totalWidth = n * width + (n - 1) * spacing;
  const xOffsetBase = -totalWidth / 2;

  for (let i = 0; i < n; i++) {
    const xOffset = xOffsetBase + i * (width + spacing);
    const uvXOffset = ((i * 73 + 19) % 251) + 11;
    const uvYOffset = ((i * 137 + 43) % 241) + 17;

    for (let j = 0; j <= heightSegments; j++) {
      const y = height * (j / heightSegments - 0.5);
      const v0 = [xOffset, y, 0];
      const v1 = [xOffset + width, y, 0];
      positions.set([...v0, ...v1], vertexOffset * 3);

      const uvY = j / heightSegments;
      uvs.set(
        [uvXOffset, uvY + uvYOffset, uvXOffset + 1, uvY + uvYOffset],
        uvOffset
      );

      if (j < heightSegments) {
        const a = vertexOffset;
        const b = vertexOffset + 1;
        const c = vertexOffset + 2;
        const d = vertexOffset + 3;
        indices.set([a, b, c, c, b, d], indexOffset);
        indexOffset += 6;
      }
      vertexOffset += 2;
      uvOffset += 4;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  return geometry;
}

export interface BeamsProps {
  beamWidth?: number;
  beamHeight?: number;
  beamNumber?: number;
  lightColor?: string;
  secondaryColor?: string;
  speed?: number;
  noiseIntensity?: number;
  scale?: number;
  rotation?: number;
  className?: string;
  cardMode?: boolean;
  forceDark?: boolean;
}

export const Beams = forwardRef<HTMLDivElement, BeamsProps>(
  (
    {
      beamWidth = 2,
      beamHeight = 15,
      beamNumber = 12,
      lightColor = '#0066FF',
      secondaryColor = '#7C3AED',
      speed = 2,
      noiseIntensity = 1.65,
      scale = 0.2,
      rotation = 30,
      className = 'size-full',
      cardMode = false,
      forceDark = false,
    },
    ref
  ) => {
    const mountRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => mountRef.current as HTMLDivElement);

    useEffect(() => {
      const container = mountRef.current;
      if (!container) return;

      const hw = getHardwareProfile();
      if (!hw.allowSecondaryWebGL || hw.tier === 'low') {
        return;
      }

      const isHeadless =
        typeof navigator !== 'undefined' &&
        (navigator.webdriver || /HeadlessChrome/i.test(navigator.userAgent));

      const isCardQuery =
        cardMode ||
        (typeof window !== 'undefined' &&
          new URLSearchParams(window.location.search).has('card'));

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const isLightTheme = () =>
        !forceDark &&
        document.documentElement.getAttribute('data-theme') === 'light';

      const effectiveBeams = isCardQuery
        ? Math.max(6, Math.round(beamNumber * 0.6))
        : beamNumber;
      const effectiveSegments = isHeadless || isCardQuery ? 36 : 72;

      let unmounted = false;
      let rafId = 0;
      let initRafId = 0;
      let isNearViewport = false;
      let isVisibleDoc = document.visibilityState === 'visible';
      let lastTime = performance.now();
      let timeAcc = 0;

      let renderer: THREE.WebGLRenderer | null = null;
      let scene: THREE.Scene | null = null;
      let camera: THREE.PerspectiveCamera | null = null;
      let geometry: THREE.BufferGeometry | null = null;
      let beamMaterial: THREE.ShaderMaterial | null = null;

      const rotRad = THREE.MathUtils.degToRad(rotation);
      const baseLightVec = new THREE.Vector3(0, 3, 10)
        .applyAxisAngle(new THREE.Vector3(0, 0, 1), rotRad)
        .normalize();

      const applyThemeColors = () => {
        if (!scene || !beamMaterial) return;
        const light = isLightTheme();
        scene.background = null;
        beamMaterial.uniforms.uIsLight.value = light ? 1.0 : 0.0;
        beamMaterial.uniforms.uBaseColor.value.set(
          light ? '#eef2ff' : '#05050a'
        );
        beamMaterial.uniforms.uRoughness.value = light ? 0.34 : 0.28;
        beamMaterial.uniforms.uMetalness.value = light ? 0.25 : 0.36;
        beamMaterial.uniforms.uLightColor.value.set(lightColor);
        beamMaterial.uniforms.uSecondaryColor.value.set(secondaryColor);
        beamMaterial.uniforms.uLightIntensity.value = light ? 2.15 : 1.95;
        beamMaterial.uniforms.uAmbientIntensity.value = light ? 1.85 : 1.55;
      };

      const resize = () => {
        if (!container || !renderer || !camera) return;
        const rect = container.getBoundingClientRect();
        const w = Math.max(1, Math.round(rect.width));
        const h = Math.max(1, Math.round(rect.height));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
      };

      const destroyWebGL = () => {
        if (rafId !== 0) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
        if (initRafId !== 0) {
          cancelAnimationFrame(initRafId);
          initRafId = 0;
        }
        if (geometry) {
          geometry.dispose();
          geometry = null;
        }
        if (beamMaterial) {
          beamMaterial.dispose();
          beamMaterial = null;
        }
        if (renderer) {
          try {
            renderer.dispose();
            renderer.forceContextLoss();
          } catch {
            // Ignore disposal errors
          }
          if (
            renderer.domElement &&
            renderer.domElement.parentNode === container
          ) {
            container.removeChild(renderer.domElement);
          }
          renderer = null;
        }
        scene = null;
        camera = null;
      };

      const renderFrame = (now: number) => {
        rafId = 0;
        if (
          unmounted ||
          !isNearViewport ||
          !isVisibleDoc ||
          !renderer ||
          !scene ||
          !camera ||
          !beamMaterial
        ) {
          return;
        }

        const delta = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;

        if (!prefersReducedMotion) {
          timeAcc += 0.1 * delta;
          beamMaterial.uniforms.time.value = timeAcc;
        }

        renderer.render(scene, camera);

        if (!isHeadless && !prefersReducedMotion) {
          rafId = requestAnimationFrame(renderFrame);
        }
      };

      const startLoop = () => {
        if (
          rafId === 0 &&
          isNearViewport &&
          isVisibleDoc &&
          renderer &&
          !isHeadless &&
          !prefersReducedMotion
        ) {
          lastTime = performance.now();
          rafId = requestAnimationFrame(renderFrame);
        }
      };

      const ensureWebGLInitialized = () => {
        if (unmounted || renderer || initRafId !== 0) return;

        initRafId = requestAnimationFrame(() => {
          initRafId = 0;
          if (unmounted || !isNearViewport || renderer) return;

          try {
            renderer = new THREE.WebGLRenderer({
              antialias: !isHeadless && !isCardQuery,
              powerPreference: 'high-performance',
              alpha: true,
            });
          } catch {
            renderer = null;
            return;
          }

          const dpr = isHeadless
            ? 1
            : Math.min(
                window.devicePixelRatio || 1,
                isCardQuery ? 1.25 : 1.75
              );
          renderer.setPixelRatio(dpr);
          renderer.setClearColor(0x000000, 0);
          renderer.outputColorSpace = THREE.SRGBColorSpace;
          renderer.domElement.style.display = 'block';
          renderer.domElement.style.width = '100%';
          renderer.domElement.style.height = '100%';

          scene = new THREE.Scene();
          camera = new THREE.PerspectiveCamera(30, 1, 0.1, 1000);
          camera.position.set(0, 0, 20);

          beamMaterial = new THREE.ShaderMaterial({
            vertexShader: BEAMS_VERTEX_SHADER,
            fragmentShader: BEAMS_FRAGMENT_SHADER,
            transparent: true,
            depthWrite: false,
            uniforms: {
              time: { value: timeAcc },
              uSpeed: { value: speed },
              uScale: { value: scale },
              uNoiseIntensity: { value: noiseIntensity },
              uBaseColor: { value: new THREE.Color('#05050a') },
              uLightColor: { value: new THREE.Color(lightColor) },
              uSecondaryColor: { value: new THREE.Color(secondaryColor) },
              uLightDir: { value: baseLightVec },
              uLightIntensity: { value: 1.18 },
              uAmbientIntensity: { value: 1.05 },
              uRoughness: { value: 0.28 },
              uMetalness: { value: 0.36 },
              uIsLight: { value: isLightTheme() ? 1.0 : 0.0 },
            },
          });

          geometry = createStackedPlanesBufferGeometry(
            effectiveBeams,
            beamWidth,
            beamHeight,
            0,
            effectiveSegments
          );

          const group = new THREE.Group();
          group.rotation.set(0, 0, rotRad);
          const mesh = new THREE.Mesh(geometry, beamMaterial);
          group.add(mesh);
          scene.add(group);

          applyThemeColors();
          container.innerHTML = '';
          container.appendChild(renderer.domElement);
          resize();
          renderer.render(scene, camera);
          startLoop();
        });
      };

      const resizeObserver = new ResizeObserver(() => {
        if (renderer && scene && camera) {
          resize();
          renderer.render(scene, camera);
        }
      });
      resizeObserver.observe(container);

      const intersectionObserver = new IntersectionObserver(
        ([entry]) => {
          isNearViewport = entry?.isIntersecting ?? false;
          if (isNearViewport) {
            if (!renderer) {
              ensureWebGLInitialized();
            } else {
              startLoop();
            }
          } else {
            if (rafId !== 0) {
              cancelAnimationFrame(rafId);
              rafId = 0;
            }
          }
        },
        { rootMargin: '350px 0px' }
      );
      intersectionObserver.observe(container);

      const themeObserver = new MutationObserver(() => {
        if (renderer && scene && camera) {
          applyThemeColors();
          renderer.render(scene, camera);
        }
      });
      themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme'],
      });

      const handleVisibility = () => {
        isVisibleDoc = document.visibilityState === 'visible';
        if (isVisibleDoc) {
          startLoop();
        } else if (rafId !== 0) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      };
      document.addEventListener('visibilitychange', handleVisibility);

      return () => {
        unmounted = true;
        resizeObserver.disconnect();
        intersectionObserver.disconnect();
        themeObserver.disconnect();
        document.removeEventListener('visibilitychange', handleVisibility);
        destroyWebGL();
      };
    }, [
      beamWidth,
      beamHeight,
      beamNumber,
      lightColor,
      secondaryColor,
      speed,
      noiseIntensity,
      scale,
      rotation,
      cardMode,
      forceDark,
    ]);

    return (
      <div
        ref={mountRef}
        aria-hidden="true"
        className={`pointer-events-none relative overflow-hidden ${className}`}
        style={{
          background:
            'radial-gradient(68% 64% at 50% 38%, rgba(0, 102, 255, 0.28) 0%, rgba(124, 58, 237, 0.22) 48%, transparent 82%)',
        }}
      />
    );
  }
);

Beams.displayName = 'Beams';

export function BeamsBackground({
  className = 'size-full',
  ...props
}: BeamsProps) {
  return (
    <Beams
      beamWidth={2.4}
      beamHeight={18}
      beamNumber={14}
      lightColor="#0066FF"
      secondaryColor="#7C3AED"
      speed={2}
      noiseIntensity={1.55}
      scale={0.2}
      rotation={30}
      className={className}
      {...props}
    />
  );
}

export default Beams;
