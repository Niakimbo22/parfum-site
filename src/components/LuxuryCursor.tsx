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
  const magneticTarget = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // Only on pointer devices
    if (!window.matchMedia("(hover: hover)").matches) return;

    document.documentElement.style.cursor = "none";

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      // Magnetic effect on gold buttons
      const targets = document.querySelectorAll<HTMLElement>(".gold-button, [data-magnetic]");
      targets.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width  / 2;
        const cy = rect.top  + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const threshold = 70;
        if (dist < threshold) {
          const pull = (1 - dist / threshold) * 6;
          const dx = ((e.clientX - cx) / dist) * pull;
          const dy = ((e.clientY - cy) / dist) * pull;
          el.style.transform = `translate(${dx}px, ${dy}px)`;
          el.style.transition = "transform 0.1s ease-out";
          magneticTarget.current = el;
        } else {
          el.style.transform = "";
          el.style.transition = "transform 0.4s cubic-bezier(0.16,1,0.3,1)";
        }
      });
    };

    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor-glow]")) setHovered(true);
    };
    const onOut  = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a, button, [data-cursor-glow]")) setHovered(false);
    };
    const onDown = () => setClicking(true);
    const onUp   = () => setClicking(false);

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup",   onUp);

    const loop = () => {
      ring.current.x = lerp(ring.current.x, pos.current.x, 0.1);
      ring.current.y = lerp(ring.current.y, pos.current.y, 0.1);

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x}px,${pos.current.y}px)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px,${ring.current.y}px)`;
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
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full bg-gold transition-all duration-150"
          style={{
            width:   hovered ? "5px" : "4px",
            height:  hovered ? "5px" : "4px",
            opacity: clicking ? 0.5 : 1,
          }}
        />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2"
        style={{ willChange: "transform" }}
      >
        <div
          className="rounded-full border border-gold/50 transition-all duration-300"
          style={{
            width:     hovered ? "38px" : "24px",
            height:    hovered ? "38px" : "24px",
            opacity:   clicking ? 0.35 : hovered ? 0.85 : 0.5,
            boxShadow: hovered
              ? "0 0 14px 3px rgba(201,169,97,0.22), inset 0 0 8px rgba(201,169,97,0.06)"
              : "none",
          }}
        />
      </div>
    </>
  );
}
