"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Perfume {
  id: string;
  name: string;
  brand: string | null;
  image_url: string | null;
}

export default function HeroCarousel({ perfumes }: { perfumes: Perfume[] }) {
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (perfumes.length <= 1) return;
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setCurrent((i) => (i + 1) % perfumes.length);
        setVisible(true);
      }, 600);
    }, 4500);
    return () => clearInterval(interval);
  }, [perfumes.length]);

  const go = (i: number) => {
    if (i === current) return;
    setVisible(false);
    setTimeout(() => {
      setCurrent(i);
      setVisible(true);
    }, 300);
  };

  const p = perfumes[current];
  if (!p) return null;

  return (
    <div className="relative flex justify-center lg:justify-end">
      <div className="relative w-[340px] md:w-[440px] h-[500px] md:h-[640px]">
        {/* Ambient glow */}
        <div className="absolute inset-0 bg-gold/8 blur-[60px] rounded-full scale-90 animate-pulse-glow" />

        {/* Image */}
        <Link
          href={`/parfum/${p.id}`}
          className="block relative w-full h-full animate-float group"
          style={{
            opacity: visible ? 1 : 0,
            transition: "opacity 0.6s ease",
            maskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 100%)",
            mixBlendMode: "luminosity",
          }}
        >
          {p.image_url ? (
            <img
              src={p.image_url}
              alt={p.name}
              className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-[1.02] transition-transform duration-700"
              style={{ filter: "brightness(0.92) contrast(1.05)" }}
            />
          ) : (
            <span className="font-serif text-[120px] leading-none text-gold/10 flex items-center justify-center h-full">№</span>
          )}
        </Link>

        {/* Parfum name tag */}
        <div
          className="absolute bottom-10 left-0 right-0 text-center pointer-events-none"
          style={{ opacity: visible ? 1 : 0, transition: "opacity 0.6s ease" }}
        >
          <p className="text-[8px] tracking-[0.4em] uppercase text-cream/30">{p.brand}</p>
          <p className="font-serif text-xs text-cream/50 mt-1">{p.name}</p>
        </div>

        {/* Decorative N°1 */}
        <span className="absolute top-6 right-6 font-serif text-[80px] leading-none text-gold/5 pointer-events-none select-none">
          N°{current + 1}
        </span>

        {/* Dots nav */}
        {perfumes.length > 1 && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex gap-2 items-center">
            {perfumes.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                className={`rounded-full transition-all duration-400 ${
                  i === current
                    ? "w-5 h-[3px] bg-gold"
                    : "w-[3px] h-[3px] bg-gold/25 hover:bg-gold/50"
                }`}
                aria-label={`Parfum ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
