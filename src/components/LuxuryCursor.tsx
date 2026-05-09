"use client";

import { useEffect, useRef, useState } from "react";

export default function LuxuryCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [clicking, setClicking] = useState(false);
  const pos = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf = useRef<number>(0);

  useEffect(() => {
    // Hide default cursor
    document.documentElement.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };

    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-cursor-glow]")) setHovered(true);
    };

    const onOut = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, [data-cursor-glow]")) setHovered(false);
    };

    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup",   onUp);

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.12);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`;
      }

      raf.current = requestAnimationFrame(loop);
    };

    raf.current = requestAnimationFrame(loop);

    return () => {
      document.documentElement.style.cursor = "";
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup",   onUp);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Dot — sharp, instant */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full bg-gold transition-all duration-150"
          style={{
            width:  hovered ? "5px" : "4px",
            height: hovered ? "5px" : "4px",
            opacity: clicking ? 0.6 : 1,
          }}
        />
      </div>

      {/* Ring — lagged, elegant */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full border border-gold/50 transition-all duration-300"
          style={{
            width:     hovered ? "36px" : "24px",
            height:    hovered ? "36px" : "24px",
            opacity:   clicking ? 0.4 : hovered ? 0.8 : 0.5,
            boxShadow: hovered
              ? "0 0 12px 2px rgba(201,169,97,0.25), inset 0 0 6px rgba(201,169,97,0.08)"
              : "none",
          }}
        />
      </div>
    </>
  );
}
