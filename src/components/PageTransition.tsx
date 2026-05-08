"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function PageTransition() {
  const pathname = usePathname();
  const [phase, setPhase] = useState<"idle" | "in" | "hold" | "out">("idle");
  const prevPath = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    // Clear any running timer
    if (timerRef.current) clearTimeout(timerRef.current);

    // Slide in from bottom
    setPhase("in");

    // After slide-in (300ms), hold briefly
    timerRef.current = setTimeout(() => {
      setPhase("hold");

      // Then slide out upward
      timerRef.current = setTimeout(() => {
        setPhase("out");

        // Then idle (remove from paint)
        timerRef.current = setTimeout(() => setPhase("idle"), 350);
      }, 200);
    }, 350);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (phase === "idle") return null;

  const translateClass =
    phase === "in"
      ? "translate-y-0"
      : phase === "hold"
      ? "translate-y-0"
      : "-translate-y-full";

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-luxury-black flex flex-col justify-end pointer-events-none transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        phase === "in" ? "translate-y-0" : phase === "hold" ? "translate-y-0" : "-translate-y-full"
      }`}
      style={{
        transform:
          phase === "out"
            ? "translateY(-100%)"
            : phase === "in" || phase === "hold"
            ? "translateY(0)"
            : "translateY(100%)",
      }}
      aria-hidden="true"
    >
      <div className="h-px w-full bg-gold/60" />
    </div>
  );
}
