'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/components/theme/ThemeProvider';

const VERTEX = `
precision highp float;
attribute vec3 position;
void main() { gl_Position = vec4(position, 1.0); }
`;

const FRAGMENT = `
precision highp float;
uniform float iTime;
uniform vec3 iResolution;
uniform vec3 uColor;
uniform float uOpacity;
uniform float uAmplitude;
uniform float uDistance;
uniform vec2 uMouse;

const int u_line_count = 24;
const float u_line_width = 2.0;
const float u_line_blur = 6.0;

float Perlin2D(vec2 P) {
  vec2 Pi = floor(P);
  vec4 Pf_Pfmin1 = P.xyxy - vec4(Pi, Pi + 1.0);
  vec4 Pt = vec4(Pi.xy, Pi.xy + 1.0);
  Pt = Pt - floor(Pt * (1.0 / 71.0)) * 71.0;
  Pt += vec2(26.0, 161.0).xyxy;
  Pt *= Pt;
  Pt = Pt.xzxz * Pt.yyww;
  vec4 hash_x = fract(Pt * (1.0 / 951.135664));
  vec4 hash_y = fract(Pt * (1.0 / 642.949883));
  vec4 grad_x = hash_x - 0.49999;
  vec4 grad_y = hash_y - 0.49999;
  vec4 grad_results = inversesqrt(grad_x * grad_x + grad_y * grad_y)
    * (grad_x * Pf_Pfmin1.xzxz + grad_y * Pf_Pfmin1.yyww);
  grad_results *= 1.4142135623730950;
  vec2 blend = Pf_Pfmin1.xy * Pf_Pfmin1.xy * Pf_Pfmin1.xy
    * (Pf_Pfmin1.xy * (Pf_Pfmin1.xy * 6.0 - 15.0) + 10.0);
  vec4 blend2 = vec4(blend, vec2(1.0 - blend));
  return dot(grad_results, blend2.zxzx * blend2.wwyy);
}

float pixel(float count, vec2 resolution) {
  return count / max(resolution.x, resolution.y);
}

float lineFn(vec2 st, float width, float perc) {
  float split_point = 0.1 + perc * 0.4;
  float amplitude_normal = smoothstep(split_point, 0.7, st.x);
  float finalAmplitude = amplitude_normal * 0.5 * uAmplitude
    * (1.0 + (uMouse.y - 0.5) * 0.2);
  float time_scaled = iTime / 10.0 + (uMouse.x - 0.5);
  float blur = smoothstep(split_point, split_point + 0.05, st.x) * perc;
  float xnoise = mix(
    Perlin2D(vec2(time_scaled, st.x + perc) * 2.5),
    Perlin2D(vec2(time_scaled, st.x + time_scaled) * 3.5) / 1.5,
    st.x * 0.3
  );
  float y = 0.5 + (perc - 0.5) * uDistance + xnoise * 0.5 * finalAmplitude;
  float softWidth = width * 0.5 + u_line_blur * pixel(1.0, iResolution.xy) * blur;
  float line_start = 1.0 - smoothstep(y, y + softWidth, st.y);
  float line_end = 1.0 - smoothstep(y - softWidth, y, st.y);
  return clamp((line_start - line_end)
    * (1.0 - smoothstep(0.0, 1.0, pow(perc, 0.3))), 0.0, 1.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / iResolution.xy;
  float line_strength = 1.0;
  for (int i = 0; i < u_line_count; i++) {
    float p = float(i) / float(u_line_count);
    line_strength *= 1.0 - lineFn(uv, u_line_width * pixel(1.0, iResolution.xy) * (1.0 - p), p);
  }
  float edge = smoothstep(0.0, 0.17, uv.x) * smoothstep(0.0, 0.17, 1.0 - uv.x)
    * smoothstep(0.08, 0.3, uv.y) * smoothstep(0.08, 0.3, 1.0 - uv.y);
  gl_FragColor = vec4(uColor, (1.0 - line_strength) * edge * uOpacity);
}
`;

export function KexsioThreads() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const redrawRef = useRef<(() => void) | null>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => { redrawRef.current?.(); }, [resolvedTheme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
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
    const uniforms = {
      iTime: { value: 3.2 },
      iResolution: { value: new THREE.Vector3(1, 1, 1) },
      uColor: { value: new THREE.Vector3(0.34, 0.5, 0.78) },
      uOpacity: { value: 0.28 },
      uAmplitude: { value: 0.8 },
      uDistance: { value: 0.2 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    };
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute([-1, -1, 0, 3, -1, 0, -1, 3, 0], 3));
    const material = new THREE.RawShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms, transparent: true, depthTest: false, depthWrite: false });
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;
    scene.add(mesh);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    const themeColor = new THREE.Color();
    const rgb = { r: 0, g: 0, b: 0 };
    const target = new THREE.Vector2(0.5, 0.5);
    let visible = false;
    let disposed = false;
    let raf = 0;
    let lastPaint = 0;
    let frames = 0;

    function schedule() {
      if (!disposed && visible && !document.hidden && !document.documentElement.dataset.routeTransition && !raf) raf = requestAnimationFrame(render);
    }

    function render(now: number) {
      raf = 0;
      if (disposed || !visible || document.hidden || document.documentElement.dataset.routeTransition) return;
      const fps = software ? 18 : coarse.matches ? 20 : 30;
      if (!lastPaint || now - lastPaint >= 1000 / fps || reduced.matches) {
        if (lastPaint && !reduced.matches) uniforms.iTime.value += Math.min(0.1, (now - lastPaint) / 1000) * 0.55;
        lastPaint = now;
        uniforms.uMouse.value.lerp(target, 0.06);
        renderer.render(scene, camera);
        canvas!.dataset.state = reduced.matches ? 'still' : 'playing';
        canvas!.dataset.frames = String(++frames);
        canvas!.dataset.fps = String(fps);
      }
      if (!reduced.matches) schedule();
    }

    const redraw = () => {
      lastPaint = 0;
      if (reduced.matches) { target.set(0.5, 0.5); uniforms.uMouse.value.copy(target); }
      schedule();
    };
    const syncPalette = () => {
      const styles = getComputedStyle(canvas);
      const accent = styles.getPropertyValue('--lx-accent').trim();
      themeColor.setStyle(accent).getRGB(rgb, THREE.SRGBColorSpace);
      uniforms.uColor.value.set(rgb.r, rgb.g, rgb.b);
      uniforms.uOpacity.value = Number(styles.getPropertyValue('--lx-thread-opacity')) || 0.28;
      canvas.dataset.color = accent;
      redraw();
    };
    const resize = () => {
      const width = host.clientWidth;
      const height = host.clientHeight;
      if (!width || !height) return;
      const ratio = Math.min(1, (software ? 560 : 1100) / Math.max(width, height));
      renderer.setSize(Math.round(width * ratio), Math.round(height * ratio), false);
      uniforms.iResolution.value.set(canvas.width, canvas.height, canvas.width / canvas.height);
      redraw();
    };
    const pause = () => { if (raf) cancelAnimationFrame(raf); raf = 0; lastPaint = 0; canvas.dataset.state = 'paused'; };
    const visibility = () => { if (document.hidden) pause(); else redraw(); };
    const pointer = (event: PointerEvent) => {
      if (reduced.matches || !visible || event.pointerType !== 'mouse') return;
      const rect = host.getBoundingClientRect();
      target.set(0.5 + ((event.clientX - rect.left) / rect.width - 0.5) * 0.35, 0.5 - ((event.clientY - rect.top) / rect.height - 0.5) * 0.35);
    };
    const leave = () => { target.set(0.5, 0.5); };
    const lost = (event: Event) => { event.preventDefault(); disposed = true; pause(); canvas.dataset.state = 'unavailable'; };
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) redraw(); else pause();
    }, { rootMargin: '80px' });
    const sizes = new ResizeObserver(resize);
    const transitions = new MutationObserver(() => { if (document.documentElement.dataset.routeTransition) pause(); else syncPalette(); });
    redrawRef.current = syncPalette;
    sizes.observe(host);
    intersection.observe(host);
    transitions.observe(document.documentElement, { attributes: true, attributeFilter: ['data-route-transition', 'data-theme'] });
    reduced.addEventListener('change', redraw);
    document.addEventListener('visibilitychange', visibility);
    host.addEventListener('pointermove', pointer, { passive: true });
    host.addEventListener('pointerleave', leave);
    canvas.addEventListener('webglcontextlost', lost);
    resize();
    syncPalette();

    return () => {
      disposed = true;
      pause();
      redrawRef.current = null;
      sizes.disconnect();
      intersection.disconnect();
      transitions.disconnect();
      reduced.removeEventListener('change', redraw);
      document.removeEventListener('visibilitychange', visibility);
      host.removeEventListener('pointermove', pointer);
      host.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('webglcontextlost', lost);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="site-capability-threads" data-source="kexsio:bg-threads" aria-hidden="true" />;
}
