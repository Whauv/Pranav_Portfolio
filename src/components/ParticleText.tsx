import { useEffect, useRef } from "react";

interface ParticleTextProps {
  text?: string;
  fontSize?: number;
  color?: string;
  particleSize?: number;
  particleDensity?: number;
  mouseRadius?: number;
  mouseForce?: number;
  animSpeed?: number;
  className?: string;
}

export function ParticleText({
  text = "Welcome to\nPranav's Portfolio",
  fontSize = 80,
  color = "#ffffff",
  particleSize = 2,
  particleDensity = 3,
  mouseRadius = 80,
  mouseForce = 6,
  animSpeed = 0.05,
  className = "",
}: ParticleTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<
    Array<{
      homeX: number;
      homeY: number;
      x: number;
      y: number;
      vx: number;
      vy: number;
      alpha: number;
    }>
  >([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const buildParticles = (w: number, h: number) => {
      const off = document.createElement("canvas");
      const offCtx = off.getContext("2d");
      if (!offCtx) return;
      off.width = w;
      off.height = h;

      offCtx.clearRect(0, 0, w, h);
      offCtx.fillStyle = "#ffffff";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";

      const lines = text.split("\n");
      const lineH = fontSize * 1.25;
      const totalH = lineH * lines.length;
      const startY = (h - totalH) / 2 + lineH / 2;

      lines.forEach((line, i) => {
        let fs = fontSize;
        offCtx.font = `300 ${fs}px Bebas Neue, Impact, sans-serif`;
        while (offCtx.measureText(line).width > w * 0.9 && fs > 20) {
          fs -= 2;
          offCtx.font = `300 ${fs}px Bebas Neue, Impact, sans-serif`;
        }
        offCtx.fillText(line, w / 2, startY + i * lineH);
      });

      const imageData = offCtx.getImageData(0, 0, w, h);
      const data = imageData.data;
      const particles: typeof particlesRef.current = [];

      for (let y = 0; y < h; y += particleDensity) {
        for (let x = 0; x < w; x += particleDensity) {
          const idx = (y * w + x) * 4;
          const alpha = data[idx + 3];
          if (alpha > 128) {
            particles.push({
              homeX: x,
              homeY: y,
              x: Math.random() * w,
              y: Math.random() * h,
              vx: (Math.random() - 0.5) * 2,
              vy: (Math.random() - 0.5) * 2,
              alpha: Math.random() * 0.5 + 0.5,
            });
          }
        }
      }

      particlesRef.current = particles;
    };

    const tmpEl = document.createElement("div");
    tmpEl.style.color = color;
    document.body.appendChild(tmpEl);
    const computed = getComputedStyle(tmpEl).color;
    document.body.removeChild(tmpEl);
    const rgb = computed.match(/\d+/g)?.slice(0, 3).join(",") ?? "255,255,255";

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio ?? 1, 2);
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildParticles(w, h);
    };

    const render = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const r2 = mouseRadius * mouseRadius;

      for (const particle of particlesRef.current) {
        const dx = particle.x - mx;
        const dy = particle.y - my;
        const dist2 = dx * dx + dy * dy;

        if (dist2 < r2 && dist2 > 0) {
          const dist = Math.sqrt(dist2);
          const force = ((mouseRadius - dist) / mouseRadius) * mouseForce;
          particle.vx += (dx / dist) * force;
          particle.vy += (dy / dist) * force;
        }

        particle.vx += (particle.homeX - particle.x) * animSpeed;
        particle.vy += (particle.homeY - particle.y) * animSpeed;
        particle.vx *= 0.88;
        particle.vy *= 0.88;
        particle.x += particle.vx;
        particle.y += particle.vy;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particleSize / 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${particle.alpha})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(render);
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };

    resize();
    rafRef.current = requestAnimationFrame(render);
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", onMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [animSpeed, color, fontSize, mouseForce, mouseRadius, particleDensity, particleSize, text]);

  return <canvas ref={canvasRef} className={`particle-text-canvas ${className}`} aria-label={text} role="img" />;
}
