"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number; y: number;
  size: number; speed: number;
  opacity: number; drift: number; phase: number;
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
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W; canvas.height = H;
    };
    window.addEventListener("resize", onResize);

    const COUNT = 35;
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      size: Math.random() * 1.6 + 0.5,
      speed: Math.random() * 0.3 + 0.1,
      opacity: 0,
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));

    let frame = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      frame++;

      for (const p of particles) {
        p.y -= p.speed;
        p.x += Math.sin(frame * 0.008 + p.phase) * p.drift;
        // Plus visible : opacity entre 0.08 et 0.22
        p.opacity = Math.abs(Math.sin(frame * 0.012 + p.phase)) * 0.14 + 0.08;

        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,169,97,${p.opacity})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-[2]" />;
}
