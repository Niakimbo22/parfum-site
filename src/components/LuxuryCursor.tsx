"use client";

import { useEffect, useRef, useState } from "react";

export default function LuxuryCursor() {
  const dotRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovered,  setHovered]  = useState(false);
  const [clicking, setClicking] = useState(false);
  const pos  = useRef({ x: -100, y: -100 });
  const ring = useRef({ x: -100, y: -100 });
  const raf  = useRef<number>(0);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover)").matches) return;

    document.documentElement.style.cursor = "none";

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    // Magnetic — uniquement sur les vrais boutons CTA gold, pas les liens nav
    const applyMagnetic = (e: MouseEvent) => {
      document.querySelectorAll<HTMLElement>(".gold-button").forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const threshold = 60;

        if (dist < threshold) {
          const strength = (1 - dist / threshold) * 5;
          const dx = ((e.clientX - cx) / dist) * strength;
          const dy = ((e.clientY - cy) / dist) * strength;
          el.style.transform = `translate(${dx}px, ${dy}px)`;
        } else if (el.style.transform !== "") {
          el.style.transform = "";
        }
      });
    };

    const resetMagnetic = () => {
      document.querySelectorAll<HTMLElement>(".gold-button").forEach((el) => {
        el.style.transform = "";
      });
    };

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
      applyMagnetic(e);
    };

    const onLeave = () => resetMagnetic();

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) setHovered(true);
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button")) setHovered(false);
    };
    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    document.addEventListener("mousemove",  onMove);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover",  onOver);
    document.addEventListener("mouseout",   onOut);
    document.addEventListener("mousedown",  onDown);
    document.addEventListener("mouseup",    onUp);

    const loop = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.1);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.1);
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${pos.current.x}px,${pos.current.y}px)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px)`;
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      document.documentElement.style.cursor = "";
      resetMagnetic();
      document.removeEventListener("mousemove",  onMove);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover",  onOver);
      document.removeEventListener("mouseout",   onOut);
      document.removeEventListener("mousedown",  onDown);
      document.removeEventListener("mouseup",    onUp);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2" style={{ willChange: "transform" }}>
        <div className="rounded-full bg-gold transition-all duration-150" style={{ width: hovered ? "5px" : "4px", height: hovered ? "5px" : "4px", opacity: clicking ? 0.5 : 1 }} />
      </div>
      <div ref={ringRef} className="fixed top-0 left-0 pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2" style={{ willChange: "transform" }}>
        <div
          className="rounded-full border border-gold/60 transition-all duration-300"
          style={{
            width:     hovered ? "40px" : "26px",
            height:    hovered ? "40px" : "26px",
            opacity:   clicking ? 0.3 : hovered ? 0.9 : 0.55,
            boxShadow: hovered ? "0 0 16px 4px rgba(201,169,97,0.28), inset 0 0 8px rgba(201,169,97,0.08)" : "none",
          }}
        />
      </div>
    </>
  );
}
