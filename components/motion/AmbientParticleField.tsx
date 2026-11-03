'use client';

import { useEffect, useRef } from 'react';

type Particle = {
  x: number;
  y: number;
  radius: number;
  alpha: number;
  speed: number;
  phase: number;
};

const particleTotal = (width: number) => width < 600 ? 26 : width < 1000 ? 34 : 46;

function seeded(index: number, salt: number) {
  const value = Math.sin(index * 91.371 + salt * 17.117) * 43758.5453;
  return value - Math.floor(value);
}

export function AmbientParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarse = window.matchMedia('(pointer: coarse)');
    let particles: Particle[] = [];
    let width = 0;
    let height = 0;
    let color = '140 175 255';
    let opacity = 0.1;
    let frame = 0;
    let raf = 0;
    let lastPaint = 0;
    let disposed = false;

    const readTheme = () => {
      const styles = getComputedStyle(canvas);
      const accent = styles.getPropertyValue('--lx-accent').trim();
      const parsed = accent.match(/[a-f\d]{2}/gi)?.map(value => Number.parseInt(value, 16));
      if (parsed?.length === 3) color = parsed.join(' ');
      opacity = Number(styles.getPropertyValue('--lx-ambient-opacity')) || 0.1;
      canvas.dataset.color = accent;
    };

    const populate = () => {
      particles = Array.from({ length: particleTotal(width) }, (_, index) => ({
        x: seeded(index, 1),
        y: seeded(index, 2),
        radius: 0.7 + seeded(index, 3) * 1.35,
        alpha: 0.25 + seeded(index, 4) * 0.75,
        speed: 0.15 + seeded(index, 5) * 0.32,
        phase: seeded(index, 6) * Math.PI * 2,
      }));
      canvas.dataset.particles = String(particles.length);
    };

    const paint = (time = 0) => {
      context.clearRect(0, 0, width, height);
      for (const particle of particles) {
        const motion = reduced.matches ? 0 : time * 0.00004 * particle.speed;
        const x = ((particle.x + motion) % 1) * width;
        const y = (particle.y + Math.sin(time * 0.00013 * particle.speed + particle.phase) * 0.012) * height;
        const pulse = reduced.matches ? 0.72 : 0.58 + Math.sin(time * 0.00034 + particle.phase) * 0.18;
        context.beginPath();
        context.fillStyle = `rgb(${color} / ${opacity * particle.alpha * pulse})`;
        context.arc(x, y, particle.radius, 0, Math.PI * 2);
        context.fill();
      }
      canvas.dataset.frames = String(++frame);
      canvas.dataset.state = reduced.matches ? 'still' : 'playing';
    };

    const schedule = () => {
      if (!disposed && !document.hidden && !document.documentElement.dataset.routeTransition && !raf) raf = requestAnimationFrame(render);
    };

    const render = (time: number) => {
      raf = 0;
      if (disposed || document.hidden || document.documentElement.dataset.routeTransition) return;
      const fps = coarse.matches ? 10 : 15;
      if (!lastPaint || time - lastPaint >= 1000 / fps || reduced.matches) {
        lastPaint = time;
        paint(time);
        canvas.dataset.fps = String(fps);
      }
      if (!reduced.matches) schedule();
    };

    const resize = () => {
      width = Math.min(window.innerWidth, 1600);
      height = Math.min(window.innerHeight, 1100);
      canvas.width = width;
      canvas.height = height;
      populate();
      lastPaint = 0;
      schedule();
    };

    const pause = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      lastPaint = 0;
      canvas.dataset.state = 'paused';
    };

    const sync = () => {
      readTheme();
      if (document.hidden || document.documentElement.dataset.routeTransition) pause();
      else {
        lastPaint = 0;
        paint(performance.now());
        if (!reduced.matches) schedule();
      }
    };

    const visibility = () => document.hidden ? pause() : sync();
    const rootObserver = new MutationObserver(sync);
    rootObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-route-transition'] });
    window.addEventListener('resize', resize, { passive: true });
    reduced.addEventListener('change', sync);
    coarse.addEventListener('change', sync);
    document.addEventListener('visibilitychange', visibility);
    readTheme();
    resize();
    sync();

    return () => {
      disposed = true;
      pause();
      rootObserver.disconnect();
      window.removeEventListener('resize', resize);
      reduced.removeEventListener('change', sync);
      coarse.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, []);

  return <canvas ref={canvasRef} className="site-ambient-particles" data-source="kexsio:bg-particles" data-state="loading" aria-hidden="true" />;
}
