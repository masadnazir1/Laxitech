'use client';

import React, { useEffect, useRef } from 'react';

// Vertex & Fragment Shaders for Fluid Gradient Canvas
const VERTEX_SHADER_SRC = `attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const FRAGMENT_SHADER_SRC = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec3 u_colors[8];
// Seven packed vectors + eight colour vectors = 15 fragment uniform vectors,
// one below WebGL1's guaranteed minimum. Macros preserve the public u_* API.
uniform vec4 u_scene;      // resolution.xy, time, colour count
uniform vec4 u_shape;      // scale, intensity, paramA, warp
uniform vec4 u_surface;    // detail, contrast, brightness, saturation
uniform vec4 u_finish;     // hue, vignette, blur, grain
uniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle
uniform vec4 u_space;      // offset.xy, pointer.xy
uniform vec4 u_cursor;

#define u_resolution u_scene.xy
#define u_time u_scene.z
#define u_colorCount u_scene.w
#define u_scale u_shape.x
#define u_intensity u_shape.y
#define u_paramA u_shape.z
#define u_warp u_shape.w
#define u_detail u_surface.x
#define u_contrast u_surface.y
#define u_brightness u_surface.z
#define u_saturation u_surface.w
#define u_hue u_finish.x
#define u_vignette u_finish.y
#define u_blur u_finish.z
#define u_grain u_finish.w
#ifdef GL_FRAGMENT_PRECISION_HIGH
#define u_seed u_transform.x
#else
// Keep hash inputs inside mediump's guaranteed ±2^14 range.
#define u_seed mod(u_transform.x, 31.0)
#endif
#define u_rotate u_transform.y
#define u_drift u_transform.z
#define u_oklab u_transform.w
#define u_offset u_space.xy
#define u_mouse u_space.zw
#define u_cursorPresence u_cursor.x
#define u_cursorEffect u_cursor.y
#define u_cursorStrength u_cursor.z
#define u_cursorRadius u_cursor.w

float hash21(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// Even, un-structured white noise for film grain (Dave Hoskins hash12).
float grainHash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p) {
#ifndef GL_FRAGMENT_PRECISION_HIGH
  p = mod(p, 31.0);
#endif
  float n = sin(dot(p, vec2(41.0, 289.0)));
  return fract(vec2(15731.743, 7892.321) * n);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),
    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

// --- OKLab colour mixing (perceptual), gated by u_oklab ---
vec3 srgbToLinear(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),
    step(0.04045, c));
}
vec3 linearToSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,
    step(0.0031308, c));
}
vec3 linToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 oklabToLin(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mixColour(vec3 a, vec3 b, float t) {
  if (u_oklab > 0.5) {
    vec3 la = linToOklab(srgbToLinear(a));
    vec3 lb = linToOklab(srgbToLinear(b));
    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);
  }
  return mix(a, b, t);
}

vec3 palette(float x) {
  float n = max(u_colorCount - 1.0, 1.0);
  float f = clamp(x, 0.0, 1.0) * n;
  vec3 col = u_colors[0];
  for (int i = 0; i < 7; i++) {
    if (float(i) < n)
      col = mixColour(col, u_colors[i + 1],
        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));
  }
  return col;
}

vec3 hueRotate(vec3 col, float a) {
  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,
                          0.587, -0.274, -0.523,
                          0.114, -0.322, 0.312);
  const mat3 toRGB = mat3(1.0, 1.0, 1.0,
                          0.956, -0.272, -1.106,
                          0.621, -0.647, 1.703);
  vec3 yiq = toYIQ * col;
  float ca = cos(a), sa = sin(a);
  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);
  return toRGB * yiq;
}

vec3 shade(vec2 uv, vec2 p, float t) {
  vec2 q = p * (1.6 + u_intensity * 2.4);
  float field = 0.0;
  float weight = 0.55;
  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    q += vec2(
      sin(q.y * (1.7 + fi * 0.09) + t * (0.35 + fi * 0.04) + u_seed),
      cos(q.x * (1.5 + fi * 0.11) - t * (0.28 + fi * 0.03))
    ) * (0.22 + u_intensity * 0.14);
    float filaments = abs(sin(q.x + q.y + fi * 0.72));
    field += weight / (0.08 + filaments);
    weight *= 0.62;
    q = q.yx * vec2(-1.08, 1.04);
  }
  float glow = 1.0 - exp(-field * (0.018 + u_paramA * 0.04));
  return palette(clamp(glow, 0.0, 1.0));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 screenUv = uv;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)
    / min(u_resolution.x, u_resolution.y);
  float cursorMask = 0.0;

  if (u_cursorPresence > 0.001) {
    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)
      / min(u_resolution.x, u_resolution.y);
    vec2 cursorDelta = p - cursor;
    if (u_cursorEffect < 0.5) {
      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;
    } else {
      float cursorDistance = length(cursorDelta);
      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);
      cursorMask = u_cursorPresence
        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));
      if (u_cursorEffect < 1.5) {
        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;
      } else if (u_cursorEffect < 2.5) {
        float cursorAngle = cursorMask * u_cursorStrength * 2.2;
        float cc = cos(cursorAngle), cs = sin(cursorAngle);
        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;
      } else if (u_cursorEffect < 3.5) {
        float ripple = sin(
          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);
        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;
      }
    }
  }

  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;
  p *= u_scale;
  if (abs(u_rotate) > 0.0001) {
    float cr = cos(u_rotate), sr = sin(u_rotate);
    p = mat2(cr, -sr, sr, cr) * p;
  }
  p += u_offset;
  if (u_drift > 0.0001)
    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));
  if (u_warp > 0.0) {
    p += u_warp * (vec2(
      fbm(p * u_detail + u_seed),
      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);
  }

  vec3 col;
  if (u_blur > 0.0) {
    float e = u_blur;
    float pe = e * u_scale;
    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;
    col  = shade(uv, p, u_time) * 0.36;
    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;
    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;
    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;
  } else {
    col = shade(uv, p, u_time);
  }

  if (abs(u_contrast - 1.0) > 0.0001)
    col = (col - 0.5) * u_contrast + 0.5;
  if (abs(u_saturation - 1.0) > 0.0001) {
    float luma = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(luma), col, u_saturation);
  }
  if (abs(u_hue) > 0.0001)
    col = hueRotate(col, u_hue);
  if (abs(u_brightness) > 0.0001)
    col += u_brightness;
  if (u_vignette > 0.0001) {
    float vd = length(screenUv - 0.5) * 1.41421356;
    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);
  }
  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)
    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;
  if (u_grain > 0.0001)
    col += (grainHash(
      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;
  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`;

const DEFAULT_DARK_PALETTE: number[][] = [
  [0, 0, 0],
  [0, 0.36, 0.6],
  [0, 0.6, 1],
  [0.72, 0.96, 1],
];

interface FluidGradientCanvasProps {
  className?: string;
  colors?: number[][];
  colorCount?: number;
}

const contextCache = new WeakMap<HTMLCanvasElement, number>();

export function FluidGradientCanvas({
  className = 'size-full',
  colors = DEFAULT_DARK_PALETTE,
  colorCount = 4,
}: FluidGradientCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    const canvas: HTMLCanvasElement = canvasEl;

    const cachedTimeout = contextCache.get(canvas);
    if (cachedTimeout !== undefined) {
      window.clearTimeout(cachedTimeout);
      contextCache.delete(canvas);
    }

    const glContext = canvas.getContext('webgl', { antialias: false });
    if (!glContext) return;
    const gl: WebGLRenderingContext = glContext;

    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram();
    if (!program) return;

    const vs = createShader(gl.VERTEX_SHADER, VERTEX_SHADER_SRC);
    const fs = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SRC);
    if (!vs || !fs) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      return;
    }

    gl.useProgram(program);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );

    const posAttr = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(posAttr);
    gl.vertexAttribPointer(posAttr, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      colors: gl.getUniformLocation(program, 'u_colors'),
      scene: gl.getUniformLocation(program, 'u_scene'),
      shape: gl.getUniformLocation(program, 'u_shape'),
      surface: gl.getUniformLocation(program, 'u_surface'),
      finish: gl.getUniformLocation(program, 'u_finish'),
      transform: gl.getUniformLocation(program, 'u_transform'),
      space: gl.getUniformLocation(program, 'u_space'),
      cursor: gl.getUniformLocation(program, 'u_cursor'),
    };

    const paletteList = Array.from({ length: 8 }, (_, idx) =>
      colors[idx] ?? colors[colors.length - 1] ?? [0, 0, 0]
    );
    gl.uniform3fv(uniforms.colors, new Float32Array(paletteList.flat()));
    gl.uniform4f(uniforms.shape, 1.26, 0.35, 0.28, 0);
    gl.uniform4f(uniforms.surface, 1.824, 1.005, 0, 1.45);
    gl.uniform4f(uniforms.finish, 0, 0, 0.0012, 0.098);
    gl.uniform4f(uniforms.transform, 1, 0, 0.204, 0);
    gl.uniform4f(uniforms.cursor, 0, 3, 0.45, 0.46);

    let targetMouseX = 0;
    let targetMouseY = 0;
    let targetPresence = 0;
    let currMouseX = 0;
    let currMouseY = 0;
    let currPresence = 0;
    let hasPointer = false;
    let pointerClientX = 0;
    let pointerClientY = 0;
    let rect = canvas.getBoundingClientRect();
    let animId = 0;
    let lastTime: number | null = null;
    let isVisibleDoc = document.visibilityState === 'visible';
    let isIntersecting = true;
    let isDestroyed = false;
    const startTime = performance.now();
    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const speed = 0.86 * (!prefersReducedMotion ? 1 : 0);
    const allowInteraction = !prefersReducedMotion;
    const hasMovement = Math.abs(speed) > 1e-4;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      const scale = Math.min(1, Math.sqrt(2e6 / Math.max(1, w * h)));
      const finalW = Math.max(1, Math.round(w * scale));
      const finalH = Math.max(1, Math.round(h * scale));
      if (canvas.width !== finalW || canvas.height !== finalH) {
        canvas.width = finalW;
        canvas.height = finalH;
        gl.viewport(0, 0, finalW, finalH);
      }
    };

    function requestFrame() {
      if (!isDestroyed && isVisibleDoc && isIntersecting && animId === 0) {
        animId = requestAnimationFrame(render);
      }
    }

    const updatePointerPos = () => {
      if (!hasPointer || rect.width === 0 || rect.height === 0) return;
      if (
        pointerClientX < rect.left ||
        pointerClientX > rect.right ||
        pointerClientY < rect.top ||
        pointerClientY > rect.bottom
      ) {
        targetPresence = 0;
        requestFrame();
        return;
      }
      const nx = ((pointerClientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((pointerClientY - rect.top) / rect.height) * 2 - 1);
      if (targetPresence === 0 && currPresence < 0.01) {
        currMouseX = nx;
        currMouseY = ny;
      }
      targetMouseX = nx;
      targetMouseY = ny;
      targetPresence = 1;
      requestFrame();
    };

    const handlePointerMove = (e: PointerEvent) => {
      hasPointer = true;
      pointerClientX = e.clientX;
      pointerClientY = e.clientY;
      rect = canvas.getBoundingClientRect();
      updatePointerPos();
    };

    const handlePointerLeave = () => {
      hasPointer = false;
      targetPresence = 0;
      requestFrame();
    };

    const handleResize = () => {
      rect = canvas.getBoundingClientRect();
      resize();
      updatePointerPos();
      requestFrame();
    };

    window.addEventListener('resize', handleResize);
    if (allowInteraction) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      window.addEventListener('pointercancel', handlePointerLeave);
      window.addEventListener('scroll', handleResize, true);
      window.addEventListener('blur', handlePointerLeave);
      document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    }

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry?.isIntersecting ?? true;
      if (isIntersecting) {
        requestFrame();
      } else if (animId !== 0) {
        cancelAnimationFrame(animId);
        animId = 0;
        lastTime = null;
      }
    });
    intersectionObserver.observe(canvas);

    const handleVisibility = () => {
      isVisibleDoc = document.visibilityState === 'visible';
      if (isVisibleDoc) {
        requestFrame();
      } else if (animId !== 0) {
        cancelAnimationFrame(animId);
        animId = 0;
        lastTime = null;
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    function render(now: number) {
      animId = 0;
      if (isDestroyed || !isVisibleDoc || !isIntersecting) return;

      const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;
      const smooth = 1 - Math.exp(-12 * dt);
      currMouseX += (targetMouseX - currMouseX) * smooth;
      currMouseY += (targetMouseY - currMouseY) * smooth;
      currPresence += (targetPresence - currPresence) * smooth;
      resize();

      gl.uniform4f(
        uniforms.scene,
        canvas.width,
        canvas.height,
        ((now - startTime) / 1000) * speed,
        colorCount
      );
      gl.uniform4f(uniforms.space, 0, 0, currMouseX, currMouseY);
      gl.uniform4f(uniforms.cursor, allowInteraction ? currPresence : 0, 3, 0.45, 0.46);

      gl.drawArrays(gl.TRIANGLES, 0, 3);

      const moving =
        Math.abs(targetMouseX - currMouseX) > 0.001 ||
        Math.abs(targetMouseY - currMouseY) > 0.001 ||
        Math.abs(targetPresence - currPresence) > 0.001;

      if (hasMovement || moving) {
        requestFrame();
      } else {
        lastTime = null;
      }
    }

    requestFrame();

    return () => {
      isDestroyed = true;
      if (animId !== 0) cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('resize', handleResize);
      if (allowInteraction) {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointercancel', handlePointerLeave);
        window.removeEventListener('scroll', handleResize, true);
        window.removeEventListener('blur', handlePointerLeave);
        document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      }
      if (buf) gl.deleteBuffer(buf);
      if (program) gl.deleteProgram(program);

      const cleanupId = window.setTimeout(() => {
        if (contextCache.get(canvas) === cleanupId) {
          contextCache.delete(canvas);
          gl.getExtension('WEBGL_lose_context')?.loseContext();
          canvas.width = 1;
          canvas.height = 1;
        }
      }, 0);
      contextCache.set(canvas, cleanupId);
    };
  }, [colors, colorCount]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  );
}
