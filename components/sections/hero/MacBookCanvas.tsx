'use client';

import { useEffect, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import {
  getHeroFrame,
  HERO_SCREEN_HEIGHT,
  HERO_SCREEN_WIDTH,
  HERO_CAMERA_TIME,
  HERO_LID_END,
  screenQuadMatrix,
  type ScreenQuad,
} from '@/lib/heroScene';
import { MOCKUP_DRACO_PATH, MOCKUP_GLB_PATH } from '@/lib/mockupPlayerConfig';

interface MacBookCanvasProps {
  screenRef: RefObject<HTMLDivElement | null>;
  theme: 'dark' | 'light';
  showTable: boolean;
  replayKey: number;
  onReady: () => void;
  onSettled: () => void;
  onFailure: () => void;
}

interface SceneController {
  redraw: () => void;
  replay: () => void;
}

const TABLE_NODES = new Set(['Object124', 'Object125', 'Object126', 'Object127', 'Shape004', 'Shape005']);
const BACKDROP_NODES = new Set(['Plane', 'Plane001', 'Plane002', 'Plane_001', 'Plane_002', 'Plane.001', 'Plane.002', 'Shadow']);
const STAGE_MATERIALS = new Set(['Shadow', 'Material.001', 'Material.002', 'Material.003', 'metall_planks']);

function releaseScene(root: THREE.Object3D) {
  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  root.traverse((node) => {
    if (!(node instanceof THREE.Mesh)) return;
    geometries.add(node.geometry);
    const entries = Array.isArray(node.material) ? node.material : [node.material];
    entries.forEach((material) => {
      materials.add(material);
      Object.values(material).forEach((value: unknown) => {
        if (value instanceof THREE.Texture) textures.add(value);
      });
    });
  });
  geometries.forEach((geometry) => geometry.dispose());
  materials.forEach((material) => material.dispose());
  textures.forEach((texture) => texture.dispose());
}

function getScreenVertices(mesh: THREE.Mesh): THREE.Vector3[] {
  const position = mesh.geometry.getAttribute('position');
  const uv = mesh.geometry.getAttribute('uv');
  if (!position || !uv) return [];
  let minU = Infinity;
  let maxU = -Infinity;
  let minV = Infinity;
  let maxV = -Infinity;
  for (let index = 0; index < uv.count; index += 1) {
    minU = Math.min(minU, uv.getX(index));
    maxU = Math.max(maxU, uv.getX(index));
    minV = Math.min(minV, uv.getY(index));
    maxV = Math.max(maxV, uv.getY(index));
  }
  return [[minU, minV], [maxU, minV], [maxU, maxV], [minU, maxV]].map(([u, v]) => {
    let nearest = 0;
    let distance = Infinity;
    for (let index = 0; index < uv.count; index += 1) {
      const next = (uv.getX(index) - u) ** 2 + (uv.getY(index) - v) ** 2;
      if (next < distance) {
        nearest = index;
        distance = next;
      }
    }
    return new THREE.Vector3().fromBufferAttribute(position, nearest);
  });
}

export default function MacBookCanvas({
  screenRef,
  theme,
  showTable,
  replayKey,
  onReady,
  onSettled,
  onFailure,
}: MacBookCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<SceneController | null>(null);
  const appearanceRef = useRef({ theme, showTable });

  useEffect(() => {
    appearanceRef.current = { theme, showTable };
    controllerRef.current?.redraw();
  }, [theme, showTable]);

  useEffect(() => {
    if (replayKey > 0) controllerRef.current?.replay();
  }, [replayKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;

    let disposed = false;
    let raf = 0;
    let elapsed = 0;
    let lastFrame = 0;
    let visible = true;
    let firstFrame = true;
    let settled = false;
    let width = 1;
    let height = 1;
    let fittedZoom = 1;
    let viewOffsetX = 0;
    let viewOffsetY = 0;
    let needsCalibration = true;
    let softwareRenderer = false;
    let screenFacingSign = 1;
    let lastTable = appearanceRef.current.showTable;
    let renderer: THREE.WebGLRenderer | null = null;
    let model: THREE.Group | null = null;
    let camera: THREE.PerspectiveCamera | null = null;
    let mixer: THREE.AnimationMixer | null = null;
    let display: THREE.Mesh | null = null;
    let screenVertices: THREE.Vector3[] = [];
    let environmentMap: THREE.WebGLRenderTarget | null = null;
    const actions: THREE.AnimationAction[] = [];
    const laptopMeshes: THREE.Mesh[] = [];
    const tables: THREE.Object3D[] = [];
    const screenMaterials: THREE.MeshBasicMaterial[] = [];
    const scene = new THREE.Scene();
    const abort = new AbortController();
    const draco = new DRACOLoader();
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const box = new THREE.Box3();
    const partBox = new THREE.Box3();
    const corner = new THREE.Vector3();
    const worldScreen = Array.from({ length: 4 }, () => new THREE.Vector3());
    const screenNormal = new THREE.Vector3();
    const screenEdge = new THREE.Vector3();
    const cameraDirection = new THREE.Vector3();
    const fill = new THREE.HemisphereLight(0xeaf1ff, 0x1e2634, 1.7);
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(0.2, 3, 4);
    scene.add(fill, key);

    const evaluateTime = (cameraTime: number, lidTime: number) => {
      if (!mixer || !model) return;
      for (const action of actions) {
        action.enabled = true;
        action.paused = true;
        const time = action.getClip().name.startsWith('top.') ? lidTime : cameraTime;
        action.time = Math.min(time, Math.max(0, action.getClip().duration - 0.00001));
      }
      mixer.update(0);
      model.updateMatrixWorld(true);
    };

    const schedule = () => {
      if (!disposed && !raf && visible && !document.hidden) raf = requestAnimationFrame(render);
    };

    const calibrate = () => {
      if (!camera) return;
      evaluateTime(HERO_CAMERA_TIME, HERO_LID_END);
      camera.aspect = width / height;
      camera.zoom = 1;
      camera.clearViewOffset();
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      box.makeEmpty();
      laptopMeshes.forEach((mesh) => {
        partBox.setFromObject(mesh);
        box.union(partBox);
      });

      let minX = Infinity;
      let minY = Infinity;
      let maxX = -Infinity;
      let maxY = -Infinity;
      for (let index = 0; index < 8; index += 1) {
        corner.set(index & 1 ? box.max.x : box.min.x, index & 2 ? box.max.y : box.min.y, index & 4 ? box.max.z : box.min.z);
        corner.project(camera);
        minX = Math.min(minX, corner.x);
        maxX = Math.max(maxX, corner.x);
        minY = Math.min(minY, corner.y);
        maxY = Math.max(maxY, corner.y);
      }
      const mobile = width < 640;
      const targetWidth = mobile ? 0.96 : 0.77;
      const targetHeight = appearanceRef.current.showTable ? 0.74 : 0.89;
      fittedZoom = Math.min(targetWidth * 2 / (maxX - minX), targetHeight * 2 / (maxY - minY));
      fittedZoom = Number.isFinite(fittedZoom) ? Math.max(0.15, Math.min(4, fittedZoom)) : 0.7;
      viewOffsetX = (minX + maxX) * fittedZoom * width / 4;
      viewOffsetY = -(minY + maxY) * fittedZoom * height / 4;
      if (appearanceRef.current.showTable) viewOffsetY += height * 0.045;
      if (display && screenVertices.length === 4) {
        screenVertices.forEach((vertex, index) => worldScreen[index].copy(vertex).applyMatrix4(display!.matrixWorld));
        screenNormal.subVectors(worldScreen[1], worldScreen[0]).cross(screenEdge.subVectors(worldScreen[3], worldScreen[0])).normalize();
        camera.getWorldPosition(cameraDirection).sub(worldScreen[0]).normalize();
        screenFacingSign = Math.sign(screenNormal.dot(cameraDirection)) || 1;
      }
      needsCalibration = false;
    };

    const updateScreen = (opacity: number) => {
      const element = screenRef.current;
      if (!element || !display || !camera || screenVertices.length !== 4) return;
      screenVertices.forEach((vertex, index) => worldScreen[index].copy(vertex).applyMatrix4(display!.matrixWorld));
      screenNormal.subVectors(worldScreen[1], worldScreen[0]).cross(screenEdge.subVectors(worldScreen[3], worldScreen[0])).normalize();
      camera.getWorldPosition(cameraDirection).sub(worldScreen[0]).normalize();
      if (opacity <= 0 || screenNormal.dot(cameraDirection) * screenFacingSign < 0.08) {
        element.style.opacity = '0';
        element.dataset.projected = 'false';
        return;
      }
      const projected = screenVertices.map((vertex) => {
        corner.copy(vertex).applyMatrix4(display!.matrixWorld).project(camera!);
        return { x: (corner.x + 1) * width / 2, y: (1 - corner.y) * height / 2 };
      }).sort((a, b) => a.y - b.y);
      const top = projected.slice(0, 2).sort((a, b) => a.x - b.x);
      const bottom = projected.slice(2).sort((a, b) => a.x - b.x);
      const quad: ScreenQuad = [top[0], top[1], bottom[1], bottom[0]];
      const transform = screenQuadMatrix(HERO_SCREEN_WIDTH, HERO_SCREEN_HEIGHT, quad);
      if (!transform) {
        element.style.opacity = '0';
        return;
      }
      element.style.width = `${HERO_SCREEN_WIDTH}px`;
      element.style.height = `${HERO_SCREEN_HEIGHT}px`;
      element.style.transform = transform;
      element.style.opacity = String(opacity);
      element.dataset.projected = 'true';
    };

    function render(now: number) {
      raf = 0;
      if (disposed || !canvas || !renderer || !model || !camera || !visible || document.hidden) return;
      const delta = lastFrame ? Math.max(0, (now - lastFrame) / 1000) : 0;
      lastFrame = now;
      if (!firstFrame) elapsed += delta;

      const appearance = appearanceRef.current;
      if (appearance.showTable !== lastTable) {
        lastTable = appearance.showTable;
        needsCalibration = true;
      }
      tables.forEach((table) => { table.visible = appearance.showTable; });
      if (needsCalibration) calibrate();

      const frame = getHeroFrame(elapsed, reducedMotion.matches);
      evaluateTime(frame.cameraTime, frame.lidTime);
      camera.aspect = width / height;
      camera.zoom = fittedZoom;
      camera.setViewOffset(width, height, viewOffsetX, viewOffsetY, width, height);
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
      scene.environmentIntensity = appearance.theme === 'light' ? 0.85 : 0.6;
      renderer.toneMappingExposure = appearance.theme === 'light' ? 1.22 : 1.03;
      fill.intensity = appearance.theme === 'light' ? 2 : 1.6;
      screenMaterials.forEach((material) => material.color.set(appearance.theme === 'light' ? '#f1f3f7' : '#101720'));
      renderer.render(scene, camera);
      updateScreen(frame.screenOpacity);
      canvas.dataset.cameraTime = frame.cameraTime.toFixed(4);
      canvas.dataset.lidTime = frame.lidTime.toFixed(4);
      canvas.dataset.openingProgress = frame.progress.toFixed(4);
      canvas.dataset.playing = String(!frame.finished);

      if (firstFrame) {
        firstFrame = false;
        onReady();
      }
      if (frame.finished && !settled) {
        settled = true;
        onSettled();
      }
      if (!frame.finished) schedule();
    }

    const resize = () => {
      const nextWidth = Math.max(1, host.clientWidth);
      const nextHeight = Math.max(1, host.clientHeight);
      if (nextWidth === width && nextHeight === height) return;
      width = nextWidth;
      height = nextHeight;
      renderer?.setPixelRatio(softwareRenderer ? 1 : Math.min(window.devicePixelRatio || 1, 1.5));
      renderer?.setSize(width, height, false);
      needsCalibration = true;
      lastFrame = 0;
      schedule();
    };

    const visibilityChange = () => {
      lastFrame = 0;
      if (document.hidden && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      schedule();
    };

    const motionChange = () => {
      lastFrame = 0;
      schedule();
    };

    const contextLost = (event: Event) => {
      event.preventDefault();
      if (!disposed) onFailure();
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      lastFrame = 0;
      if (!visible && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      schedule();
    }, { rootMargin: '120px' });

    async function initialize() {
      try {
        renderer = new THREE.WebGLRenderer({ canvas: canvas!, alpha: true, antialias: true, powerPreference: 'high-performance' });
        const context = renderer.getContext();
        const debug = context.getExtension('WEBGL_debug_renderer_info');
        softwareRenderer = debug ? /SwiftShader|Software|llvmpipe/i.test(String(context.getParameter(debug.UNMASKED_RENDERER_WEBGL))) : false;
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        const room = new RoomEnvironment();
        const pmrem = new THREE.PMREMGenerator(renderer);
        environmentMap = pmrem.fromScene(room, 0.04);
        scene.environment = environmentMap.texture;
        room.dispose();
        pmrem.dispose();
        draco.setDecoderPath(MOCKUP_DRACO_PATH);
        draco.setWorkerLimit(2);
        const loader = new GLTFLoader().setDRACOLoader(draco);
        const response = await fetch(MOCKUP_GLB_PATH, { signal: abort.signal });
        if (!response.ok) throw new Error('MacBook asset unavailable');
        const asset = await loader.parseAsync(await response.arrayBuffer(), '/models/');
        if (disposed) {
          releaseScene(asset.scene);
          return;
        }
        model = asset.scene;
        scene.add(model);
        const authoredCamera = asset.cameras.find((entry) => entry instanceof THREE.PerspectiveCamera);
        if (!(authoredCamera instanceof THREE.PerspectiveCamera)) throw new Error('Authored camera unavailable');
        camera = authoredCamera;
        camera.near = 0.01;
        camera.far = 100;

        model.traverse((node) => {
          if (TABLE_NODES.has(node.name)) tables.push(node);
          if (BACKDROP_NODES.has(node.name)) node.visible = false;
          if (node instanceof THREE.SpotLight) {
            const isKey = /001|_1/.test(node.name) || /001|_1/.test(node.parent?.name || '');
            node.color.set(isKey ? 0xffffff : 0x4b86ff);
            node.intensity = isKey ? 2.2 : 7.5;
          }
          if (!(node instanceof THREE.Mesh)) return;
          const materials = Array.isArray(node.material) ? node.material : [node.material];
          if (materials.some((material) => !STAGE_MATERIALS.has(material.name))) laptopMeshes.push(node);
          materials.forEach((material, index) => {
            if (material.name === 'Change This') {
              const screenMaterial = new THREE.MeshBasicMaterial({ color: 0x101720, side: THREE.DoubleSide, toneMapped: false });
              screenMaterial.name = 'Change This';
              if (Array.isArray(node.material)) node.material[index] = screenMaterial;
              else node.material = screenMaterial;
              material.dispose();
              display = node;
              screenVertices = getScreenVertices(node);
              screenMaterials.push(screenMaterial);
            } else if (material instanceof THREE.MeshStandardMaterial && material.map) {
              material.map.anisotropy = Math.min(8, renderer!.capabilities.getMaxAnisotropy());
              if (['macbook_down_tetall_surface', 'touch', 'keyboard', 'top_side'].includes(material.name)) {
                material.emissive.set(0xffffff);
                material.emissiveMap = material.map;
                material.emissiveIntensity = 0.2;
              }
            }
          });
        });
        if (!display || screenVertices.length !== 4 || !laptopMeshes.length) throw new Error('Display geometry unavailable');
        mixer = new THREE.AnimationMixer(model);
        asset.animations.forEach((clip) => {
          const action = mixer!.clipAction(clip);
          action.setLoop(THREE.LoopOnce, 1);
          action.clampWhenFinished = true;
          action.play();
          actions.push(action);
        });
        controllerRef.current = {
          redraw: () => { lastFrame = 0; schedule(); },
          replay: () => {
            elapsed = 0;
            settled = false;
            lastFrame = 0;
            schedule();
          },
        };
        resize();
        resizeObserver.observe(host!);
        intersection.observe(host!);
        schedule();
      } catch (error) {
        if (!disposed && !abort.signal.aborted) {
          console.error('Unable to initialize the MacBook preview.', error);
          onFailure();
        }
      }
    }

    document.addEventListener('visibilitychange', visibilityChange);
    reducedMotion.addEventListener('change', motionChange);
    canvas.addEventListener('webglcontextlost', contextLost);
    void initialize();

    return () => {
      disposed = true;
      abort.abort();
      if (raf) cancelAnimationFrame(raf);
      controllerRef.current = null;
      resizeObserver.disconnect();
      intersection.disconnect();
      document.removeEventListener('visibilitychange', visibilityChange);
      reducedMotion.removeEventListener('change', motionChange);
      canvas.removeEventListener('webglcontextlost', contextLost);
      mixer?.stopAllAction();
      if (model) {
        mixer?.uncacheRoot(model);
        releaseScene(model);
      }
      draco.dispose();
      environmentMap?.dispose();
      renderer?.dispose();
    };
  }, [screenRef, onReady, onSettled, onFailure]);

  return <canvas ref={canvasRef} className="lx-macbook-canvas" aria-hidden="true" />;
}
