'use client';

import React, { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import {
  DEFAULT_MOCKUP_ID,
  MOCKUP_DRACO_PATH,
  MOCKUP_GLB_PATH,
  MOCKUP_SCENE_SETTINGS,
  computeCameraZoom,
  computeOrbitAngles,
  computeScreenScrollProgress,
  parseAspectRatio,
  parseRangeAttribute,
} from '@/lib/mockupPlayerConfig';

const SCREEN_CANVAS_W = 1024;
const SCREEN_CANVAS_H = 665; // Matches 3024:1964 MacBook Retina ratio

interface ScreenSurfaceEntry {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: THREE.CanvasTexture;
  image: HTMLImageElement | null;
  loaded: boolean;
  lastScrollProgress: number;
}

interface SharedEngineState {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  mixer: THREE.AnimationMixer;
  actions: THREE.AnimationAction[];
  screenMaterials: THREE.MeshBasicMaterial[];
  orbitPivot: THREE.Vector3;
  isSoftwareGl: boolean;
}

let sharedEnginePromise: Promise<SharedEngineState | null> | null = null;
let sharedEngine: SharedEngineState | null = null;
const screenSurfaceCache = new Map<string, ScreenSurfaceEntry>();
const activeInstances = new Set<CynexMockupPlayerInstance>();
let rafId = 0;
let softwareTimerId: ReturnType<typeof setTimeout> | null = null;
let lastFrameTime = 0;

function drawFallbackScreen(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  title: string
) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, '#090d16');
  grad.addColorStop(0.5, '#0f172a');
  grad.addColorStop(1, '#1e1b4b');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle top macOS status bar
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(0, 0, w, 28);

  // Accent glow
  const radial = ctx.createRadialGradient(
    w * 0.5,
    h * 0.42,
    20,
    w * 0.5,
    h * 0.42,
    w * 0.45
  );
  radial.addColorStop(0, 'rgba(0, 102, 255, 0.32)');
  radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radial;
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 34px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(title || 'CYNEX STUDIO', w / 2, h / 2);
}

function paintScreenSurface(
  entry: ScreenSurfaceEntry,
  scrollProgress: number,
  fallbackTitle: string
) {
  const { canvas, ctx, image, loaded } = entry;
  const w = canvas.width;
  const h = canvas.height;

  if (!loaded || !image || !image.naturalWidth || !image.naturalHeight) {
    if (entry.lastScrollProgress === -1) {
      drawFallbackScreen(ctx, w, h, fallbackTitle);
      entry.texture.needsUpdate = true;
      entry.lastScrollProgress = -0.5;
    }
    return;
  }

  const quantized = Math.round(scrollProgress * 240) / 240;
  if (Math.abs(quantized - entry.lastScrollProgress) < 0.002) {
    return;
  }
  entry.lastScrollProgress = quantized;

  const imgW = image.naturalWidth;
  const imgH = image.naturalHeight;
  // Scale image width to fill the 3024x1964 screen width
  const drawW = w;
  const drawH = (imgH / imgW) * drawW;

  ctx.fillStyle = '#050507';
  ctx.fillRect(0, 0, w, h);

  if (drawH > h * 1.04) {
    const maxScrollY = drawH - h;
    const offsetY = -maxScrollY * quantized;
    ctx.drawImage(image, 0, offsetY, drawW, drawH);
  } else {
    // Cover fit
    const scale = Math.max(w / imgW, h / imgH);
    const cw = imgW * scale;
    const ch = imgH * scale;
    ctx.drawImage(image, (w - cw) / 2, (h - ch) / 2, cw, ch);
  }

  entry.texture.needsUpdate = true;
}

function getOrCreateScreenSurface(
  src: string,
  title: string
): ScreenSurfaceEntry {
  const key = src || '__default__';
  const existing = screenSurfaceCache.get(key);
  if (existing) return existing;

  const canvas = document.createElement('canvas');
  canvas.width = SCREEN_CANVAS_W;
  canvas.height = SCREEN_CANVAS_H;
  const ctx = canvas.getContext('2d', { alpha: false })!;

  const texture = new THREE.CanvasTexture(canvas);
  texture.flipY = false;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;

  const entry: ScreenSurfaceEntry = {
    canvas,
    ctx,
    texture,
    image: null,
    loaded: false,
    lastScrollProgress: -1,
  };

  paintScreenSurface(entry, 0, title);

  if (src && typeof Image !== 'undefined') {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => {
      entry.image = img;
      entry.loaded = true;
      entry.lastScrollProgress = -1;
      paintScreenSurface(entry, 0, title);
      scheduleLoop();
    };
    img.src = src;
  }

  screenSurfaceCache.set(key, entry);
  return entry;
}

function initSharedEngine(): Promise<SharedEngineState | null> {
  if (sharedEnginePromise) return sharedEnginePromise;

  sharedEnginePromise = new Promise<SharedEngineState | null>((resolve) => {
    try {
      const probeCanvas = document.createElement('canvas');
      const probeGl =
        probeCanvas.getContext('webgl2') || probeCanvas.getContext('webgl');
      if (!probeGl) {
        resolve(null);
        return;
      }

      const debugExt = probeGl.getExtension('WEBGL_debug_renderer_info');
      const rendererName = debugExt
        ? String(probeGl.getParameter(debugExt.UNMASKED_RENDERER_WEBGL))
        : '';
      const isSoftwareGl = /SwiftShader|Software|llvmpipe/i.test(rendererName);

      const renderer = new THREE.WebGLRenderer({
        antialias: !isSoftwareGl,
        alpha: false,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true,
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NoToneMapping;
      renderer.setPixelRatio(1);
      renderer.setSize(
        isSoftwareGl ? 520 : 960,
        isSoftwareGl ? 390 : 720,
        false
      );

      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath(MOCKUP_DRACO_PATH);
      dracoLoader.preload();

      const gltfLoader = new GLTFLoader();
      gltfLoader.setDRACOLoader(dracoLoader);

      gltfLoader.load(
        MOCKUP_GLB_PATH,
        (gltf: GLTF) => {
          const scene = new THREE.Scene();
          scene.background = new THREE.Color('#000000');
          scene.add(gltf.scene);

          // 1. Locate authored Camera001
          let camera: THREE.PerspectiveCamera | null = null;
          const authoredCam = gltf.cameras?.[0];
          if (authoredCam && (authoredCam as THREE.PerspectiveCamera).isPerspectiveCamera) {
            camera = authoredCam as THREE.PerspectiveCamera;
          } else {
            scene.traverse((obj) => {
              if (!camera && (obj as THREE.PerspectiveCamera).isPerspectiveCamera) {
                camera = obj as THREE.PerspectiveCamera;
              }
            });
          }

          if (!camera) {
            camera = new THREE.PerspectiveCamera(
              MOCKUP_SCENE_SETTINGS.authoredFovDeg,
              4 / 3,
              0.1,
              1000
            );
            scene.add(camera);
          }
          camera.fov = MOCKUP_SCENE_SETTINGS.authoredFovDeg;
          camera.near = 0.1;
          camera.far = 1000;

          // 2. Locate OrbitPivot
          const pivotObj = scene.getObjectByName('OrbitPivot');
          const orbitPivot = pivotObj
            ? pivotObj.position.clone()
            : new THREE.Vector3(...MOCKUP_SCENE_SETTINGS.orbitPivot);

          // 3. Replace "Change This" screen material with unlit MeshBasicMaterial
          // and tune baked PBR materials
          const screenMaterials: THREE.MeshBasicMaterial[] = [];
          const maxAniso = isSoftwareGl
            ? 1
            : Math.min(8, renderer.capabilities.getMaxAnisotropy());

          scene.traverse((node) => {
            const mesh = node as THREE.Mesh;
            if (!mesh.isMesh) return;

            const mats = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];

            mats.forEach((mat, idx) => {
              if (!mat) return;
              if (mat.name === 'Change This') {
                const screenMat = new THREE.MeshBasicMaterial({
                  color: 0xffffff,
                  side: THREE.DoubleSide,
                  toneMapped: false,
                });
                screenMat.name = 'Change This';
                if (Array.isArray(mesh.material)) {
                  mesh.material[idx] = screenMat;
                } else {
                  mesh.material = screenMat;
                }
                screenMaterials.push(screenMat);
                return;
              }

              const stdMat = mat as THREE.MeshStandardMaterial;
              if (stdMat.isMeshStandardMaterial && stdMat.map) {
                stdMat.map.anisotropy = maxAniso;
                // Subtle self-illumination from Corona_Beauty baked maps so pedestal & keys read crisply
                if (
                  stdMat.name === 'macbook_down_tetall_surface' ||
                  stdMat.name === 'touch' ||
                  stdMat.name === 'keyboard' ||
                  stdMat.name === 'top_side' ||
                  stdMat.name === 'Material.001' ||
                  stdMat.name === 'Material.002'
                ) {
                  stdMat.emissive = new THREE.Color(0xffffff);
                  stdMat.emissiveMap = stdMat.map;
                  stdMat.emissiveIntensity = 0.28;
                }
                stdMat.needsUpdate = true;
              }
            });
          });

          // 4. Configure the 3 SpotLights from MOCKUP_SCENE_SETTINGS.lights
          const foundLights = new Map<string, THREE.SpotLight>();
          scene.traverse((node) => {
            const light = node as THREE.SpotLight;
            if (light.isSpotLight) {
              foundLights.set(light.name, light);
              if (light.parent?.name) {
                foundLights.set(light.parent.name, light);
              }
            }
          });

          for (const spec of MOCKUP_SCENE_SETTINGS.lights) {
            let spot: THREE.SpotLight | undefined;
            for (const alias of spec.aliases) {
              spot = foundLights.get(alias);
              if (spot) break;
            }
            if (!spot) {
              spot = new THREE.SpotLight(spec.color, spec.intensity);
              spot.name = spec.name;
              spot.position.set(...spec.position);
              scene.add(spot);
            }
            spot.color.setHex(spec.color);
            spot.intensity = spec.intensity;
            spot.angle = THREE.MathUtils.degToRad(spec.angleDeg);
            spot.penumbra = spec.penumbra;
            spot.decay = 2;
            spot.distance = 0;
          }

          // Subtle studio fill light for screen bounce glow (screenGlow: 132)
          const bounceLight = new THREE.PointLight(0x3b82f6, 0.85, 2.5, 2);
          bounceLight.position.set(0.34, -0.08, 1.05);
          scene.add(bounceLight);

          const ambientFill = new THREE.AmbientLight(0xffffff, 0.25);
          scene.add(ambientFill);

          // 5. Set up AnimationMixer on gltf.scene with all 6 GLB clips
          const mixer = new THREE.AnimationMixer(gltf.scene);
          const actions: THREE.AnimationAction[] = [];

          for (const clip of gltf.animations) {
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
            actions.push(action);
          }

          if (!isSoftwareGl) {
            renderer.compile(scene, camera);
          }

          const state: SharedEngineState = {
            renderer,
            scene,
            camera,
            mixer,
            actions,
            screenMaterials,
            orbitPivot,
            isSoftwareGl,
          };
          sharedEngine = state;
          resolve(state);
          scheduleLoop();
        },
        undefined,
        () => {
          resolve(null);
        }
      );
    } catch {
      resolve(null);
    }
  });

  return sharedEnginePromise;
}

const scratchOffset = new THREE.Vector3();
const scratchEuler = new THREE.Euler(0, 0, 0, 'YXZ');
const scratchQuat = new THREE.Quaternion();
const scratchBgColor = new THREE.Color('#000000');

interface CynexMockupPlayerInstance {
  host: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx2d: CanvasRenderingContext2D | null;
  isVisible: boolean;
  elapsedSec: number;
  isPlaying: boolean;
  pointerTargetX: number;
  pointerTargetY: number;
  pointerCurrentX: number;
  pointerCurrentY: number;
  clickImpulse: number;
  hasRenderedOnce: boolean;
}

const ACTIVE_LID_START_SEC = 2.5;

function renderSingleInstance(
  engine: SharedEngineState,
  inst: CynexMockupPlayerInstance,
  dt: number
) {
  const { host, canvas, ctx2d } = inst;
  if (!ctx2d) return;

  const rect = host.getBoundingClientRect();
  const cssW = Math.max(1, Math.round(rect.width || 640));
  const aspectAttr = host.getAttribute('aspect-ratio') || '4 / 3';
  const ratio = parseAspectRatio(aspectAttr);
  const cssH = Math.max(
    1,
    Math.round(rect.height > 8 ? rect.height : cssW / ratio)
  );

  const dpr = engine.isSoftwareGl
    ? 1
    : Math.min(window.devicePixelRatio || 1, 1.75);
  const targetW = Math.min(
    engine.isSoftwareGl ? 520 : 1080,
    Math.round(cssW * dpr)
  );
  const targetH = Math.max(1, Math.round(targetW / (cssW / cssH)));

  if (canvas.width !== targetW || canvas.height !== targetH) {
    canvas.width = targetW;
    canvas.height = targetH;
  }

  const rendererCanvas = engine.renderer.domElement;
  if (rendererCanvas.width !== targetW || rendererCanvas.height !== targetH) {
    engine.renderer.setSize(targetW, targetH, false);
  }

  const loop = host.getAttribute('trigger-loop') !== 'false';
  const duration = MOCKUP_SCENE_SETTINGS.masterDurationSec;

  if (inst.isPlaying) {
    inst.elapsedSec += dt;
    if (inst.elapsedSec >= duration) {
      if (loop) {
        inst.elapsedSec =
          ACTIVE_LID_START_SEC +
          ((inst.elapsedSec - duration) % (duration - ACTIVE_LID_START_SEC));
      } else {
        inst.elapsedSec = duration;
        inst.isPlaying = false;
      }
    }
  }

  // Smooth exponential damping for pointer & click impulse
  const damp = 1 - Math.exp(-8 * Math.max(0.001, dt));
  inst.pointerCurrentX +=
    (inst.pointerTargetX - inst.pointerCurrentX) * damp;
  inst.pointerCurrentY +=
    (inst.pointerTargetY - inst.pointerCurrentY) * damp;
  inst.clickImpulse *= Math.exp(-4 * Math.max(0.001, dt));

  // Evaluate all 6 GLB animation clips at inst.elapsedSec without triggering LoopOnce pause
  for (const action of engine.actions) {
    const clipDur = action.getClip().duration;
    action.paused = false;
    action.enabled = true;
    action.time =
      clipDur > 0.002
        ? Math.min(inst.elapsedSec, clipDur - 0.001)
        : 0;
  }
  engine.mixer.update(0);
  engine.scene.updateMatrixWorld(true);

  // Apply orbital cursor/click offset around OrbitPivot
  const cursorRange = parseRangeAttribute(
    host.getAttribute('cursor-range') || '1-1-1-1'
  );
  const clickRange = parseRangeAttribute(
    host.getAttribute('click-range') || '1-1-1-1'
  );
  const { yawRad, pitchRad } = computeOrbitAngles(
    inst.pointerCurrentX,
    inst.pointerCurrentY,
    cursorRange,
    clickRange,
    inst.clickImpulse
  );

  if (Math.abs(yawRad) > 1e-5 || Math.abs(pitchRad) > 1e-5) {
    scratchEuler.set(pitchRad, yawRad, 0, 'YXZ');
    scratchQuat.setFromEuler(scratchEuler);

    scratchOffset.copy(engine.camera.position).sub(engine.orbitPivot);
    scratchOffset.applyQuaternion(scratchQuat);
    engine.camera.position.copy(engine.orbitPivot).add(scratchOffset);
    engine.camera.quaternion.premultiply(scratchQuat);
    engine.camera.updateMatrixWorld(true);
  }

  // Apply camera-zoom="11.600000000000001" and aspect ratio
  const zoomAttr =
    host.getAttribute('camera-zoom') ??
    String(MOCKUP_SCENE_SETTINGS.cameraZoomAttr);
  engine.camera.zoom = computeCameraZoom(zoomAttr);
  engine.camera.aspect = targetW / targetH;
  engine.camera.updateProjectionMatrix();

  // Background color
  const bgAttr = host.getAttribute('background-color') || '#000000';
  scratchBgColor.set(bgAttr);
  engine.scene.background = scratchBgColor;

  // Bind screen texture with smooth scroll
  const screenSrc =
    host.getAttribute('data-screen-src') ||
    '/snapshots/cynex-console-1-1024x571.png';
  const projectTitle =
    host.getAttribute('data-project-title') || 'CYNEX Studio';
  const surface = getOrCreateScreenSurface(screenSrc, projectTitle);
  const scrollProgress = computeScreenScrollProgress(
    inst.elapsedSec,
    duration
  );
  paintScreenSurface(surface, scrollProgress, projectTitle);

  for (const mat of engine.screenMaterials) {
    if (mat.map !== surface.texture) {
      mat.map = surface.texture;
      mat.needsUpdate = true;
    }
  }

  engine.renderer.render(engine.scene, engine.camera);
  ctx2d.clearRect(0, 0, targetW, targetH);
  ctx2d.drawImage(engine.renderer.domElement, 0, 0, targetW, targetH);
  inst.hasRenderedOnce = true;
}

let softwareRobinIdx = 0;

function tickSharedLoop(now: number) {
  rafId = 0;
  if (typeof document !== 'undefined' && document.hidden) {
    return;
  }

  const dt =
    lastFrameTime > 0 ? Math.min(0.064, (now - lastFrameTime) / 1000) : 1 / 60;
  lastFrameTime = now;

  const visible: CynexMockupPlayerInstance[] = [];
  activeInstances.forEach((inst) => {
    if (inst.isVisible || !inst.hasRenderedOnce) {
      visible.push(inst);
    }
  });

  if (visible.length === 0) {
    return;
  }

  if (!sharedEngine) {
    initSharedEngine();
    return;
  }

  if (sharedEngine.isSoftwareGl) {
    // On software WebGL (e.g., headless Chromium), render up to 2 instances per tick
    // and pace frames with setTimeout so screenshots never block.
    const unrendered = visible.filter((v) => !v.hasRenderedOnce);
    const batch =
      unrendered.length > 0
        ? unrendered.slice(0, 3)
        : [visible[softwareRobinIdx % visible.length]];
    softwareRobinIdx++;
    for (const inst of batch) {
      renderSingleInstance(sharedEngine, inst, dt);
    }
    softwareTimerId = setTimeout(() => {
      softwareTimerId = null;
      rafId = requestAnimationFrame(tickSharedLoop);
    }, 45);
    return;
  }

  for (const inst of visible) {
    renderSingleInstance(sharedEngine, inst, dt);
  }

  rafId = requestAnimationFrame(tickSharedLoop);
}

function scheduleLoop() {
  if (typeof window === 'undefined') return;
  if (rafId !== 0 || softwareTimerId !== null) return;
  lastFrameTime = performance.now();
  rafId = requestAnimationFrame(tickSharedLoop);
}

function registerMockupPlayerCustomElement() {
  if (typeof window === 'undefined' || !('customElements' in window)) return;
  if (window.customElements.get('mockup-player')) return;

  class CynexMockupPlayerElement extends HTMLElement {
    private instance: CynexMockupPlayerInstance | null = null;
    private observer: IntersectionObserver | null = null;

    static get observedAttributes() {
      return [
        'mockup-id',
        'width',
        'height',
        'aspect-ratio',
        'trigger',
        'trigger-loop',
        'trigger-restart',
        'cursor-affect-page',
        'cursor-range',
        'click-range',
        'camera-zoom',
        'background-color',
        'data-screen-src',
        'data-project-title',
        'data-initial-time',
      ];
    }

    connectedCallback() {
      this.applyHostLayout();

      let shadow = this.shadowRoot;
      if (!shadow) {
        shadow = this.attachShadow({ mode: 'open' });
      }
      shadow.innerHTML = '';

      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: block;
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #000000;
          user-select: none;
        }
        canvas {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      `;
      const canvas = document.createElement('canvas');
      shadow.appendChild(style);
      shadow.appendChild(canvas);

      const initialTimeRaw = Number.parseFloat(
        this.getAttribute('data-initial-time') || '0'
      );
      const initialTime = Number.isFinite(initialTimeRaw) ? initialTimeRaw : 0;

      const inst: CynexMockupPlayerInstance = {
        host: this,
        canvas,
        ctx2d: canvas.getContext('2d', { alpha: false }),
        isVisible: true,
        elapsedSec: initialTime,
        isPlaying: this.getAttribute('trigger') !== 'click',
        pointerTargetX: 0,
        pointerTargetY: 0,
        pointerCurrentX: 0,
        pointerCurrentY: 0,
        clickImpulse: 0,
        hasRenderedOnce: false,
      };

      this.instance = inst;
      activeInstances.add(inst);

      if (typeof IntersectionObserver !== 'undefined') {
        this.observer = new IntersectionObserver(
          (entries) => {
            const entry = entries[entries.length - 1];
            if (!entry) return;
            inst.isVisible = entry.isIntersecting;
            if (entry.isIntersecting) {
              scheduleLoop();
            }
          },
          { rootMargin: '240px' }
        );
        this.observer.observe(this);
      }

      this.addEventListener('pointermove', this.handlePointerMove, {
        passive: true,
      });
      this.addEventListener('pointerleave', this.handlePointerLeave, {
        passive: true,
      });
      this.addEventListener('click', this.handleClick);

      initSharedEngine().then(() => {
        scheduleLoop();
      });
      scheduleLoop();
    }

    disconnectedCallback() {
      this.observer?.disconnect();
      this.observer = null;
      this.removeEventListener('pointermove', this.handlePointerMove);
      this.removeEventListener('pointerleave', this.handlePointerLeave);
      this.removeEventListener('click', this.handleClick);
      if (this.instance) {
        activeInstances.delete(this.instance);
        this.instance = null;
      }
    }

    attributeChangedCallback() {
      this.applyHostLayout();
      if (this.instance) {
        this.instance.hasRenderedOnce = false;
        scheduleLoop();
      }
    }

    private applyHostLayout() {
      const widthAttr = this.getAttribute('width') || '100%';
      const aspectAttr = this.getAttribute('aspect-ratio') || '4 / 3';
      const bgAttr = this.getAttribute('background-color') || '#000000';
      this.style.width = widthAttr;
      this.style.aspectRatio = aspectAttr;
      this.style.backgroundColor = bgAttr;
    }

    private handlePointerMove = (e: PointerEvent) => {
      if (!this.instance) return;
      const rect = this.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      this.instance.pointerTargetX = Math.max(-1, Math.min(1, nx));
      this.instance.pointerTargetY = Math.max(-1, Math.min(1, ny));
      scheduleLoop();
    };

    private handlePointerLeave = () => {
      if (!this.instance) return;
      this.instance.pointerTargetX = 0;
      this.instance.pointerTargetY = 0;
    };

    private handleClick = () => {
      if (!this.instance) return;
      this.instance.clickImpulse = 1;
      if (this.getAttribute('trigger-restart') === 'true') {
        this.instance.elapsedSec = ACTIVE_LID_START_SEC;
        this.instance.isPlaying = true;
      }
      scheduleLoop();
    };
  }

  window.customElements.define('mockup-player', CynexMockupPlayerElement);
}

export interface PortfolioMockupStageProps {
  screenSrc?: string;
  projectTitle?: string;
  initialTimeSec?: number;
  className?: string;
  aspectRatio?: string;
  cameraZoom?: string;
}

export function PortfolioMockupStage({
  screenSrc = '/snapshots/cynex-console-1-1024x571.png',
  projectTitle = 'CYNEX Studio',
  initialTimeSec = 6.2,
  className = '',
  aspectRatio = '4 / 3',
  cameraZoom = '11.600000000000001',
}: PortfolioMockupStageProps) {
  useEffect(() => {
    registerMockupPlayerCustomElement();
  }, []);

  return (
    <div className={`relative overflow-hidden bg-black ${className}`}>
      <mockup-player
        mockup-id={DEFAULT_MOCKUP_ID}
        width="100%"
        aspect-ratio={aspectRatio}
        trigger="load"
        trigger-loop="true"
        trigger-restart="true"
        cursor-affect-page="false"
        cursor-range="1-1-1-1"
        click-range="1-1-1-1"
        camera-zoom={cameraZoom}
        background-color="#000000"
        data-screen-src={screenSrc}
        data-project-title={projectTitle}
        data-initial-time={String(initialTimeSec)}
      />
    </div>
  );
}
