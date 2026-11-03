'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const SCENES: Record<string, number> = {
  aurora: 0,
  beams: 1,
  silk: 2,
  threads: 3,
  mesh: 4,
  rays: 5,
};

const VERTEX = `
precision highp float;
attribute vec3 position;
void main() { gl_Position = vec4(position, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform float uTime;
uniform float uSceneFrom;
uniform float uSceneTo;
uniform float uSceneMix;
uniform float uOpacity;
uniform float uScroll;
uniform vec2 uResolution;
uniform vec2 uPointer;
uniform vec3 uAccent;
uniform vec3 uSecondary;

float hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1.0, 0.0)), f.x), mix(hash21(i + vec2(0.0, 1.0)), hash21(i + 1.0), f.x), f.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    value += noise2(p) * amplitude;
    p = p * 2.03 + vec2(7.17, 3.31);
    amplitude *= 0.5;
  }
  return value;
}

vec4 auroraScene(vec2 uv) {
  float t = uTime * 0.045 + uScroll * 0.25;
  float warp = fbm(vec2(uv.x * 1.7 + t, uv.y * 1.25 - t * 0.4));
  float ridge = 0.58 + 0.12 * sin(uv.x * 5.5 - t * 2.2) + (warp - 0.5) * 0.24;
  float band = exp(-20.0 * abs(uv.y - ridge));
  float bandTwo = exp(-31.0 * abs(uv.y - ridge + 0.14 + 0.035 * sin(uv.x * 9.0 + t)));
  float fold = pow(0.5 + 0.5 * sin((uv.x + uv.y * 0.42 + warp * 0.18) * 18.0 - t * 1.7), 12.0);
  float pointerGlow = exp(-5.4 * distance(uv, mix(vec2(0.72, 0.62), uPointer, 0.2)));
  float alpha = band * 0.72 + bandTwo * 0.42 + fold * band * 0.3 + pointerGlow * 0.13;
  vec3 color = mix(uSecondary, uAccent, clamp(uv.x * 0.8 + warp * 0.45, 0.0, 1.0));
  return vec4(color * (0.58 + fold * 0.62), alpha);
}

vec4 beamsScene(vec2 uv) {
  vec2 origin = vec2(0.82 + (uPointer.x - 0.5) * 0.08, 1.14);
  vec2 delta = uv - origin;
  float angle = atan(delta.y, delta.x);
  float radius = length(delta);
  float n = noise2(vec2(angle * 4.0, uTime * 0.055));
  float rays = pow(max(0.0, sin(angle * 13.0 + n * 3.2 + uTime * 0.07)), 8.0);
  rays += 0.55 * pow(max(0.0, sin(angle * 21.0 - n * 2.0)), 13.0);
  float shaft = rays * smoothstep(1.2, 0.12, radius) * smoothstep(-0.05, 0.34, uv.y);
  float haze = fbm(uv * vec2(2.2, 3.1) + vec2(0.0, uTime * 0.02)) * 0.14;
  vec3 color = mix(uSecondary, uAccent, 0.72 + 0.28 * sin(angle * 2.0));
  return vec4(color * (0.65 + haze), shaft * 0.82 + haze * smoothstep(0.0, 0.8, uv.y));
}

vec4 silkScene(vec2 uv) {
  float t = uTime * 0.055 + uScroll * 0.18;
  vec2 p = uv * vec2(1.45, 1.1);
  float warp = fbm(p * 2.1 + vec2(t, -t * 0.4));
  float wave = sin((p.x + p.y * 0.46 + warp * 0.22) * 13.0 - t * 2.1);
  float waveTwo = sin((p.x * 0.52 - p.y + warp * 0.15) * 9.0 + t * 1.3);
  float body = 0.5 + 0.5 * wave * waveTwo;
  float sheen = pow(0.5 + 0.5 * wave, 10.0);
  float edge = smoothstep(0.0, 0.17, uv.x) * smoothstep(0.0, 0.17, 1.0 - uv.x);
  vec3 color = mix(uSecondary, uAccent, 0.38 + body * 0.5);
  return vec4(color * (0.45 + sheen * 0.9), (0.15 + body * 0.38 + sheen * 0.32) * edge);
}

vec4 threadsScene(vec2 uv) {
  float t = uTime * 0.04;
  float wave = sin(uv.x * 10.0 + t + fbm(uv * 2.0) * 2.5);
  float glow = exp(-10.0 * distance(uv, vec2(0.5, 0.54 + wave * 0.045)));
  return vec4(mix(uSecondary, uAccent, uv.x), glow * 0.24);
}

vec4 meshScene(vec2 uv) {
  float t = uTime * 0.045 + uScroll * 0.25;
  vec2 p = uv;
  p.y += 0.055 * sin(p.x * 8.0 + t) + 0.028 * sin(p.x * 17.0 - t * 1.3);
  vec2 grid = vec2(p.x * 23.0, p.y * 17.0);
  vec2 cell = fract(grid) - 0.5;
  float wave = 0.55 + 0.45 * sin(grid.x * 0.27 + grid.y * 0.42 - t * 2.0);
  float dotField = (1.0 - smoothstep(0.035, 0.16, length(cell))) * wave;
  float horizon = smoothstep(0.05, 0.36, uv.y) * smoothstep(1.0, 0.48, uv.y);
  float pointer = exp(-10.0 * distance(uv, uPointer)) * 0.22;
  vec3 color = mix(uSecondary, uAccent, uv.x + wave * 0.22);
  return vec4(color, dotField * horizon * 0.7 + pointer);
}

vec4 raysScene(vec2 uv) {
  vec2 origin = vec2(0.5 + (uPointer.x - 0.5) * 0.12, 1.13);
  vec2 delta = uv - origin;
  float angle = atan(delta.x, -delta.y);
  float radius = length(delta);
  float distortion = (noise2(vec2(angle * 5.0, uTime * 0.035)) - 0.5) * 1.2;
  float rays = pow(max(0.0, cos(angle * 12.0 + distortion)), 10.0);
  rays += 0.45 * pow(max(0.0, cos(angle * 19.0 - distortion)), 17.0);
  float fade = smoothstep(1.15, 0.08, radius) * smoothstep(-0.08, 0.4, uv.y);
  float bloom = exp(-7.0 * radius);
  vec3 color = mix(uSecondary, uAccent, 0.68 + 0.22 * sin(angle * 3.0));
  return vec4(color * (0.62 + bloom), rays * fade * 0.78 + bloom * 0.2);
}

vec4 renderScene(float scene, vec2 uv) {
  if (scene < 0.5) return auroraScene(uv);
  if (scene < 1.5) return beamsScene(uv);
  if (scene < 2.5) return silkScene(uv);
  if (scene < 3.5) return threadsScene(uv);
  if (scene < 4.5) return meshScene(uv);
  return raysScene(uv);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec4 fromScene = renderScene(uSceneFrom, uv);
  vec4 toScene = renderScene(uSceneTo, uv);
  float transition = uSceneMix * uSceneMix * (3.0 - 2.0 * uSceneMix);
  vec4 atmosphere = mix(fromScene, toScene, transition);
  float vignette = smoothstep(0.0, 0.12, uv.x) * smoothstep(0.0, 0.12, 1.0 - uv.x) * smoothstep(0.0, 0.08, uv.y) * smoothstep(0.0, 0.08, 1.0 - uv.y);
  float grain = (hash21(gl_FragCoord.xy + floor(uTime * 8.0)) - 0.5) * 0.035;
  gl_FragColor = vec4(max(vec3(0.0), atmosphere.rgb + grain), clamp(atmosphere.a * uOpacity * vignette, 0.0, 0.9));
}
`;

export function LiveAtmosphereField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' });
    } catch {
      canvas.dataset.state = 'unavailable';
      return;
    }

    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(1);
    const context = renderer.getContext();
    const debug = context.getExtension('WEBGL_debug_renderer_info');
    const software = debug ? /SwiftShader|Software|llvmpipe/i.test(String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL))) : false;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const uniforms = {
      uTime: { value: 0 },
      uSceneFrom: { value: 0 },
      uSceneTo: { value: 0 },
      uSceneMix: { value: 1 },
      uOpacity: { value: 0.72 },
      uScroll: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uAccent: { value: new THREE.Vector3(0.55, 0.69, 1) },
      uSecondary: { value: new THREE.Vector3(0.55, 0.36, 0.96) },
    };
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    const material = new THREE.RawShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms, transparent: true, depthTest: false, depthWrite: false });
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);

    const accentColor = new THREE.Color();
    const secondaryColor = new THREE.Color();
    const rgb = { r: 0, g: 0, b: 0 };
    const targetPointer = new THREE.Vector2(0.5, 0.5);
    let regions: Element[] = [];
    let regionObserver: IntersectionObserver | null = null;
    let rootObserver: MutationObserver | null = null;
    let scanRaf = 0;
    let raf = 0;
    let lastPaint = 0;
    let lastTime = 0;
    let frames = 0;
    let disposed = false;
    let targetScroll = window.scrollY;
    let currentScroll = targetScroll;
    let targetScene = 0;

    const readColor = (value: string, target: THREE.Vector3) => {
      accentColor.setStyle(value).getRGB(rgb, THREE.SRGBColorSpace);
      target.set(rgb.r, rgb.g, rgb.b);
    };

    const syncPalette = () => {
      const styles = getComputedStyle(canvas);
      const accent = styles.getPropertyValue('--lx-accent').trim();
      const secondary = styles.getPropertyValue('--vv-cynex-purple').trim();
      readColor(accent, uniforms.uAccent.value);
      secondaryColor.setStyle(secondary).getRGB(rgb, THREE.SRGBColorSpace);
      uniforms.uSecondary.value.set(rgb.r, rgb.g, rgb.b);
      uniforms.uOpacity.value = Number(styles.getPropertyValue('--lx-atmosphere-opacity')) || 0.72;
      canvas.dataset.color = `${accent},${secondary}`;
    };

    const setScene = (value: number, name: string) => {
      if (value === targetScene && canvas.dataset.scene) return;
      uniforms.uSceneFrom.value = uniforms.uSceneMix.value < 0.5 ? uniforms.uSceneFrom.value : uniforms.uSceneTo.value;
      uniforms.uSceneTo.value = value;
      uniforms.uSceneMix.value = 0;
      targetScene = value;
      canvas.dataset.scene = name;
      lastPaint = 0;
      schedule();
    };

    const chooseScene = () => {
      let best: Element | null = null;
      let distance = Infinity;
      for (const region of regions) {
        const rect = region.getBoundingClientRect();
        if (rect.bottom <= 0 || rect.top >= window.innerHeight) continue;
        const currentDistance = Math.abs(rect.top + rect.height / 2 - window.innerHeight / 2);
        if (currentDistance < distance) { distance = currentDistance; best = region; }
      }
      const name = best?.getAttribute('data-atmosphere') || 'aurora';
      setScene(SCENES[name] ?? 0, name);
    };

    const scanRegions = () => {
      if (scanRaf) cancelAnimationFrame(scanRaf);
      scanRaf = requestAnimationFrame(() => {
        scanRaf = 0;
        regionObserver?.disconnect();
        regions = [...document.querySelectorAll('[data-atmosphere]')];
        regionObserver = new IntersectionObserver(chooseScene, { threshold: [0, 0.2, 0.45, 0.7] });
        regions.forEach(region => regionObserver?.observe(region));
        chooseScene();
      });
    };

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = Math.min(1, (software ? 620 : coarse.matches ? 900 : 1180) / Math.max(width, height));
      renderer.setSize(Math.round(width * ratio), Math.round(height * ratio), false);
      uniforms.uResolution.value.set(canvas.width, canvas.height);
      canvas.dataset.buffer = `${canvas.width}x${canvas.height}`;
      lastPaint = 0;
      schedule();
    };

    const schedule = () => {
      if (!disposed && !document.hidden && !document.documentElement.dataset.routeTransition && !raf) raf = requestAnimationFrame(render);
    };

    const render = (time: number) => {
      raf = 0;
      if (disposed || document.hidden || document.documentElement.dataset.routeTransition) return;
      const fps = software ? 12 : coarse.matches ? 18 : 24;
      if (!lastPaint || time - lastPaint >= 1000 / fps || reduced.matches) {
        const delta = lastTime ? Math.min(0.1, (time - lastTime) / 1000) : 0;
        lastTime = time;
        lastPaint = time;
        if (!reduced.matches) uniforms.uTime.value += delta;
        uniforms.uSceneMix.value = reduced.matches ? 1 : Math.min(1, uniforms.uSceneMix.value + delta * 1.4);
        uniforms.uPointer.value.lerp(targetPointer, reduced.matches ? 1 : 0.055);
        currentScroll += (targetScroll - currentScroll) * (reduced.matches ? 1 : 0.075);
        uniforms.uScroll.value = currentScroll * 0.001;
        renderer.render(scene, camera);
        canvas.dataset.frames = String(++frames);
        canvas.dataset.fps = String(fps);
        canvas.dataset.state = reduced.matches ? 'still' : 'playing';
      }
      if (!reduced.matches) schedule();
    };

    const pause = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastPaint = 0;
      lastTime = 0;
      canvas.dataset.state = 'paused';
    };

    const sync = () => {
      syncPalette();
      if (document.hidden || document.documentElement.dataset.routeTransition) pause();
      else {
        lastPaint = 0;
        schedule();
      }
    };

    const pointer = (event: PointerEvent) => {
      if (reduced.matches || event.pointerType !== 'mouse') return;
      targetPointer.set(event.clientX / window.innerWidth, 1 - event.clientY / window.innerHeight);
    };
    const leave = () => targetPointer.set(0.5, 0.5);
    const scroll = () => { targetScroll = window.scrollY; chooseScene(); };
    const visibility = () => document.hidden ? pause() : sync();
    const contextLost = (event: Event) => { event.preventDefault(); pause(); canvas.dataset.state = 'unavailable'; };

    rootObserver = new MutationObserver((entries) => {
      if (entries.some(entry => entry.type === 'childList')) scanRegions();
      sync();
    });
    rootObserver.observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-theme', 'data-route-transition'] });
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', pointer, { passive: true });
    window.addEventListener('pointerleave', leave);
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    reduced.addEventListener('change', sync);
    coarse.addEventListener('change', resize);
    canvas.addEventListener('webglcontextlost', contextLost);
    syncPalette();
    resize();
    scanRegions();
    sync();

    return () => {
      disposed = true;
      pause();
      if (scanRaf) cancelAnimationFrame(scanRaf);
      regionObserver?.disconnect();
      rootObserver?.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', pointer);
      window.removeEventListener('pointerleave', leave);
      window.removeEventListener('scroll', scroll);
      document.removeEventListener('visibilitychange', visibility);
      reduced.removeEventListener('change', sync);
      coarse.removeEventListener('change', resize);
      canvas.removeEventListener('webglcontextlost', contextLost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="site-live-atmosphere" data-source="kexsio:adaptive-atmosphere" data-state="loading" aria-hidden="true" />;
}
