"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  worldY: number; // position dans le monde (pas l'écran)
  size: number;
  speed: number;
  opacity: number;
  drift: number;
  phase: number;
}

export default function AmbientParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = window.innerWidth;
    let H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const onResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W;
      canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    const COUNT = 40;
    // Particules initialisées dans l'espace "monde" (viewport actuel)
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      worldY: window.scrollY + Math.random() * H,
      size: Math.random() * 1.8 + 0.4,
      speed: Math.random() * 0.35 + 0.1,
      opacity: 0,
      drift: (Math.random() - 0.5) * 0.28,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let raf: number;

    const draw = () => {
      const scrollY = window.scrollY;
      ctx.clearRect(0, 0, W, H);
      frame++;

      for (const p of particles) {
        // Monte dans le monde
        p.worldY -= p.speed;
        p.x += Math.sin(frame * 0.008 + p.phase) * p.drift;
        p.opacity = Math.abs(Math.sin(frame * 0.01 + p.phase)) * 0.16 + 0.07;

        // Reset quand hors du viewport par le haut
        if (p.worldY < scrollY - 20) {
          p.worldY = scrollY + H + Math.random() * 100;
          p.x = Math.random() * W;
        }

        // Coordonnée écran
        const screenY = p.worldY - scrollY;

        // Ne pas dessiner si hors écran
        if (screenY < -10 || screenY > H + 10) continue;

        // Fondu aux bords haut/bas
        const edgeFade = Math.min(screenY / 80, 1) * Math.min((H - screenY) / 80, 1);

        ctx.beginPath();
        ctx.arc(p.x, screenY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,97,${p.opacity * edgeFade})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[2]" />;
}
