'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export interface WorkItem {
  slug: string;
  title: string;
  image: string;
}

const VERTEX_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float poleFlare;
  uniform float wind;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    // Bend the pole outward toward its ends: the trumpet flare.
    float yDist = worldPos.y;
    vec2 outward = length(worldPos.xz) > 0.0001 ? normalize(worldPos.xz) : vec2(0.0, 1.0);
    float expansion = (yDist * yDist) * poleFlare;
    worldPos.xz += outward * expansion;
    // Wind: inertial flutter from scroll velocity.
    float windFlutter = sin(vUv.x * 3.1415) * wind * 30.0;
    worldPos.y -= windFlutter;
    worldPos.xz -= outward * (vUv.y - 0.5) * wind * 20.0;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const FRAGMENT_SHADER = `
  #ifdef GL_FRAGMENT_PRECISION_HIGH
  precision highp float;
  #else
  precision mediump float;
  #endif
  varying vec2 vUv;
  uniform sampler2D map;
  uniform vec2 planeSize;
  uniform float borderRadius;
  uniform float opacity;
  uniform float imageAspect;
  void main() {
    vec2 px = vUv * planeSize;
    vec2 halfSize = planeSize * 0.5;
    // SDF for crisp rounded corners on the curved surface.
    vec2 d = abs(px - halfSize) - halfSize + vec2(borderRadius);
    float dist = length(max(d, 0.0)) - borderRadius;
    float edgeWidth = 0.02;
    float alpha = 1.0 - smoothstep(-edgeWidth, edgeWidth, dist);
    if (alpha < 0.01) discard;
    // object-fit: cover, hung from the top edge for taller artwork — the
    // same masthead-first crop every card on the site uses.
    float pa = planeSize.x / planeSize.y;
    vec2 tuv = vUv;
    if (imageAspect > pa) {
      tuv.x = 0.5 + (vUv.x - 0.5) * (pa / imageAspect);
    } else {
      tuv.y = 1.0 - (1.0 - vUv.y) * (imageAspect / pa);
    }
    // No colour management: the bytes from the file land in the framebuffer
    // untouched, as a DOM <img> would paint them.
    vec4 texColor = texture2D(map, tuv);
    gl_FragColor = vec4(texColor.rgb, texColor.a * alpha * opacity);
  }
`;

function createProjectionMatrix(fov: number, aspect: number, near: number, far: number) {
  const s = 1 / Math.tan((fov * Math.PI) / 360);
  const n = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = s / aspect;
  out[5] = s;
  out[10] = (far + near) * n;
  out[11] = -1;
  out[14] = 2 * far * near * n;
  return out;
}

function compileShader(gl: WebGLRenderingContext | WebGL2RenderingContext, type: number, src: string) {
  try {
    if (gl.isContextLost && gl.isContextLost()) return null;
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    const compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (compiled !== true) {
      const info = gl.getShaderInfoLog(shader);
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Works coil shader compile issue:', info);
      }
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  } catch (err) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Works coil shader compile exception:', err);
    }
    return null;
  }
}

const U_PARAM = 30 / 14;

interface WorksCoilCanvasProps {
  items: WorkItem[];
  progressRef: React.RefObject<number>;
  onOpen?: (item: WorkItem) => void;
}

export function WorksCoilCanvas({ items, progressRef, onOpen }: WorksCoilCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const itemCount = items.length;
    const gl =
      canvas.getContext('webgl2', {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      }) ??
      canvas.getContext('webgl', {
        alpha: true,
        antialias: true,
        premultipliedAlpha: false,
      });

    if (!gl || (gl.isContextLost && gl.isContextLost())) return;

    const isWebGL2 =
      typeof WebGL2RenderingContext !== 'undefined' &&
      gl instanceof WebGL2RenderingContext;

    const program = gl.createProgram();
    if (!program) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      gl.deleteProgram(program);
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (gl.getProgramParameter(program, gl.LINK_STATUS) !== true) {
      const linkInfo = gl.getProgramInfoLog(program);
      if (process.env.NODE_ENV !== 'production') {
        console.warn('Works coil program link issue:', linkInfo);
      }
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(program);
      return;
    }

    gl.useProgram(program);

    const attribs = {
      position: gl.getAttribLocation(program, 'position'),
      uv: gl.getAttribLocation(program, 'uv'),
    };

    const uniforms = {
      model: gl.getUniformLocation(program, 'modelMatrix'),
      view: gl.getUniformLocation(program, 'viewMatrix'),
      projection: gl.getUniformLocation(program, 'projectionMatrix'),
      poleFlare: gl.getUniformLocation(program, 'poleFlare'),
      wind: gl.getUniformLocation(program, 'wind'),
      map: gl.getUniformLocation(program, 'map'),
      planeSize: gl.getUniformLocation(program, 'planeSize'),
      borderRadius: gl.getUniformLocation(program, 'borderRadius'),
      opacity: gl.getUniformLocation(program, 'opacity'),
      imageAspect: gl.getUniformLocation(program, 'imageAspect'),
    };

    // Build curved cylinder sector mesh (16 vertical segments, 64 circumferential)
    const geometry = (() => {
      const thetaStart = Math.PI / 2 - 0.3246753246753247;
      const posArray: number[] = [];
      const uvArray: number[] = [];
      const indexArray: number[] = [];

      for (let yStep = 0; yStep <= 16; yStep++) {
        const s = yStep / 16;
        const yPos = -(3.75 * s) + 1.875;
        for (let xStep = 0; xStep <= 64; xStep++) {
          const uStep = xStep / 64;
          const theta = thetaStart + 0.6493506493506493 * uStep;
          posArray.push(7.7 * Math.sin(theta), yPos, 7.7 * Math.cos(theta));
          uvArray.push(uStep, 1 - s);
        }
      }

      for (let y = 0; y < 16; y++) {
        for (let x = 0; x < 64; x++) {
          const p1 = 65 * y + x;
          const p2 = (y + 1) * 65 + x;
          const p3 = (y + 1) * 65 + x + 1;
          const p4 = 65 * y + x + 1;
          indexArray.push(p1, p2, p4, p2, p3, p4);
        }
      }

      return {
        positions: new Float32Array(posArray),
        uvs: new Float32Array(uvArray),
        indices: new Uint16Array(indexArray),
        thetaStart,
        thetaEnd: thetaStart + 0.6493506493506493,
      };
    })();

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribs.position);
    gl.vertexAttribPointer(attribs.position, 3, gl.FLOAT, false, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, geometry.uvs, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(attribs.uv);
    gl.vertexAttribPointer(attribs.uv, 2, gl.FLOAT, false, 0, 0);

    const elemBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elemBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.indices, gl.STATIC_DRAW);
    const indexCount = geometry.indices.length;

    gl.uniform1f(uniforms.poleFlare, 0.028);
    gl.uniform2f(uniforms.planeSize, 5, 3.75);
    gl.uniform1f(uniforms.borderRadius, 0.2);
    gl.uniform1i(uniforms.map, 0);

    const viewMatrix = new Float32Array(16);
    viewMatrix[0] = viewMatrix[5] = viewMatrix[10] = viewMatrix[15] = 1;
    viewMatrix[14] = -22;
    gl.uniformMatrix4fv(uniforms.view, false, viewMatrix);

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA
    );
    gl.disable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 0);

    const textures: (WebGLTexture | null)[] = Array(itemCount).fill(null);
    const aspectRatios = new Float32Array(itemCount).fill(5 / 3.75);
    const textureOpacities = new Float32Array(itemCount);
    const extAniso = gl.getExtension('EXT_texture_filter_anisotropic');
    const imageElements: HTMLImageElement[] = [];
    let isMounted = true;

    items.forEach((item, idx) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.decoding = 'async';
      img.onload = () => {
        if (!isMounted) return;
        const tex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        const isPowerOfTwo =
          (img.width & (img.width - 1)) === 0 && (img.height & (img.height - 1)) === 0;

        if (isWebGL2 || isPowerOfTwo) {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
          gl.generateMipmap(gl.TEXTURE_2D);
        } else {
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        if (extAniso) {
          gl.texParameterf(gl.TEXTURE_2D, extAniso.TEXTURE_MAX_ANISOTROPY_EXT, 8);
        }

        textures[idx] = tex;
        aspectRatios[idx] = img.width / img.height;
      };
      img.src = item.image;
      imageElements.push(img);
    });

    let projMatrix = createProjectionMatrix(45, 1, 0.1, 1000);
    let clientWidth = 1;
    let clientHeight = 1;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      clientWidth = canvas.clientWidth || 1;
      clientHeight = canvas.clientHeight || 1;
      const targetW = Math.round(clientWidth * dpr);
      const targetH = Math.round(clientHeight * dpr);
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
      }
      gl.viewport(0, 0, targetW, targetH);
      projMatrix = createProjectionMatrix(45, clientWidth / clientHeight, 0.1, 1000);
      gl.uniformMatrix4fv(uniforms.projection, false, projMatrix);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(canvas);

    let smoothedProgress = progressRef.current ?? 0;
    let windVelocity = 0;
    let lastTimestamp = performance.now();
    let animFrameId = 0;
    let isIntersecting = true;

    const slots = Array.from({ length: 14 }, () => ({
      idx: 0,
      y: 0,
      u: 0,
      opacity: 0,
      active: false,
    }));
    const slotIndices = slots.map((_, i) => i);
    const modelMatrixArray = new Float32Array(16);

    const makeModelMatrix = (out: Float32Array, yPos: number, angle: number) => {
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      out.fill(0);
      out[0] = cosA;
      out[2] = -sinA;
      out[5] = 1;
      out[8] = sinA;
      out[10] = cosA;
      out[13] = yPos;
      out[15] = 1;
      return out;
    };

    const render = (now: number) => {
      animFrameId = isIntersecting ? requestAnimationFrame(render) : 0;
      const dt = Math.min((now - lastTimestamp) / 1000, 0.1);
      lastTimestamp = now;

      const smoothFactor = 1 - Math.exp(-6 * dt);
      const targetProgress = progressRef.current ?? 0;
      const prevProgress = smoothedProgress;
      smoothedProgress += (targetProgress - smoothedProgress) * smoothFactor;
      windVelocity = 0.8 * windVelocity + (smoothedProgress - prevProgress) * 0.2;

      for (let i = 0; i < itemCount; i++) {
        if (textures[i] && textureOpacities[i] < 1) {
          textureOpacities[i] = Math.min(1, textureOpacities[i] + dt / 0.35);
        }
      }

      for (let sIdx = 0; sIdx < 14; sIdx++) {
        const slotPos = sIdx / 14 + smoothedProgress;
        const floorPos = Math.floor(slotPos);
        const fracPos = slotPos - floorPos;
        const workIdx = itemCount ? (((7 - sIdx + 14 * floorPos) % itemCount) + itemCount) % itemCount : 0;

        let edgeFade = 1;
        if (fracPos < 0.25) {
          edgeFade = fracPos / 0.25;
        } else if (fracPos > 0.75) {
          edgeFade = (1 - fracPos) / 0.25;
        }

        const slot = slots[sIdx];
        slot.idx = workIdx;
        slot.opacity = Math.sin((Math.PI / 2) * edgeFade) * (textureOpacities[workIdx] ?? 0);
        slot.y = (fracPos - 0.5) * U_PARAM * 14;
        slot.u = fracPos * Math.PI * 3;
        slot.active = -Math.sin(slot.u) > 0.55 && slot.opacity > 0.5;
      }

      // Depth sort back to front
      slotIndices.sort((a, b) => -Math.sin(slots[a].u) - -Math.sin(slots[b].u));

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.uniform1f(uniforms.wind, 0.5 * windVelocity);

      for (const sIdx of slotIndices) {
        const slot = slots[sIdx];
        const tex = textures[slot.idx];
        if (!tex || slot.opacity <= 0.001) continue;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.uniform1f(uniforms.imageAspect, aspectRatios[slot.idx]);
        gl.uniform1f(uniforms.opacity, slot.opacity);
        gl.uniformMatrix4fv(
          uniforms.model,
          false,
          makeModelMatrix(modelMatrixArray, slot.y, slot.u)
        );
        gl.drawElements(gl.TRIANGLES, indexCount, gl.UNSIGNED_SHORT, 0);
      }
    };

    animFrameId = requestAnimationFrame(render);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting && !animFrameId) {
        lastTimestamp = performance.now();
        animFrameId = requestAnimationFrame(render);
      }
    });
    intersectionObserver.observe(canvas);

    // 4 Corner Vertices for Raycasting hit test
    const cornerVertices = [
      [7.7 * Math.sin(geometry.thetaStart), 1.875, 7.7 * Math.cos(geometry.thetaStart)],
      [7.7 * Math.sin(geometry.thetaEnd), 1.875, 7.7 * Math.cos(geometry.thetaEnd)],
      [7.7 * Math.sin(geometry.thetaEnd), -1.875, 7.7 * Math.cos(geometry.thetaEnd)],
      [7.7 * Math.sin(geometry.thetaStart), -1.875, 7.7 * Math.cos(geometry.thetaStart)],
    ];

    const projectToScreen = (coord3d: number[], yPos: number, angle: number): [number, number] => {
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const rx = cosA * coord3d[0] + sinA * coord3d[2];
      const ry = coord3d[1] + yPos;
      const rz = -sinA * coord3d[0] + cosA * coord3d[2] - 22;
      const px = projMatrix[0] * rx;
      const py = projMatrix[5] * ry;
      const pz = -rz;
      return [((px / pz + 1) / 2) * clientWidth, ((1 - py / pz) / 2) * clientHeight];
    };

    const isPointInConvexPolygon = (point: [number, number], polygon: [number, number][]) => {
      let sign = 0;
      for (let i = 0; i < polygon.length; i++) {
        const p1 = polygon[i];
        const p2 = polygon[(i + 1) % polygon.length];
        const cross = (p2[0] - p1[0]) * (point[1] - p1[1]) - (p2[1] - p1[1]) * (point[0] - p1[0]);
        const currentSign = cross > 0 ? 1 : cross < 0 ? -1 : 0;
        if (currentSign !== 0) {
          if (sign === 0) sign = currentSign;
          else if (sign !== currentSign) return false;
        }
      }
      return true;
    };

    const getHitWorkItem = (e: MouseEvent | PointerEvent): WorkItem | null => {
      const rect = canvas.getBoundingClientRect();
      const pointerPt: [number, number] = [e.clientX - rect.left, e.clientY - rect.top];

      for (const slot of slots) {
        if (!slot.active) continue;
        const screenCorners = cornerVertices.map((v) => projectToScreen(v, slot.y, slot.u));
        if (isPointInConvexPolygon(pointerPt, screenCorners)) {
          return items[slot.idx] ?? null;
        }
      }
      return null;
    };

    const handlePointerMove = (e: PointerEvent) => {
      canvas.style.cursor = getHitWorkItem(e) ? 'pointer' : '';
    };

    const handlePointerLeave = () => {
      canvas.style.cursor = '';
    };

    const handleClick = (e: MouseEvent) => {
      const hit = getHitWorkItem(e);
      if (hit) {
        if (onOpen) {
          onOpen(hit);
        } else {
          router.push(`/works/${hit.slug}`);
        }
      }
    };

    canvas.addEventListener('pointermove', handlePointerMove);
    canvas.addEventListener('pointerleave', handlePointerLeave);
    canvas.addEventListener('click', handleClick);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      if (animFrameId) cancelAnimationFrame(animFrameId);
      animFrameId = 0;
    };
    canvas.addEventListener('webglcontextlost', handleContextLost);

    return () => {
      isMounted = false;
      if (animFrameId) cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('webglcontextlost', handleContextLost);

      for (const img of imageElements) {
        img.src = '';
      }
      for (const tex of textures) {
        if (tex) gl.deleteTexture(tex);
      }
      gl.deleteBuffer(posBuffer);
      gl.deleteBuffer(uvBuffer);
      gl.deleteBuffer(elemBuffer);
      gl.deleteProgram(program);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [items, progressRef, onOpen, router]);

  return (
    <>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 block h-full w-full"
      />
      {/* Screen-reader navigation fallback */}
      <nav aria-label="Featured work" className="sr-only">
        <ul>
          {items.map((item) => (
            <li key={item.slug}>
              <a href={`/works/${item.slug}`}>{item.title}</a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
