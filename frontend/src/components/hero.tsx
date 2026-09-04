"use client";

import { useEffect, useRef } from "react";
import Scatter from "./scatter";
import { useReducedMotion } from "./reveal";

export default function Hero() {
  const reduced = useReducedMotion();
  const markRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const mark = markRef.current;
        if (mark) {
          const scale = Math.max(0.94, 1 - y * 0.0003);
          mark.style.transform = `translate3d(0, ${y * 0.35}px, 0) scale(${scale})`;
          mark.style.opacity = String(Math.max(0, 1 - y * 0.0016));
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <header id="top" className="relative overflow-hidden">
      <div
        ref={markRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-2 w-[200vw] -translate-x-1/2 select-none whitespace-nowrap text-center will-change-transform"
      >
        <span
          className="font-display text-[24vw] font-black uppercase leading-[0.85] tracking-tight text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(230,195,79,0.5) 0%, rgba(201,162,39,0.16) 55%, rgba(201,162,39,0.05) 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
          }}
        >
          FEALTY
        </span>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 pb-24 pt-32 md:grid-cols-[1.1fr_0.9fr] md:pt-40 md:pb-32 lg:px-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-black uppercase leading-[0.93] tracking-tight text-ink sm:text-6xl lg:text-7xl">
            Prove what your agent made.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Fealty gives an AI agent a self-custodial identity from a passkey, then binds a
            perceptual fingerprint to everything it creates. Crop, compress, or re-encode a
            file: it still traces back to the agent that made it.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="#mechanism"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
            >
              See the mechanism
            </a>
            <a
              href="#survives"
              className="btn-ring inline-flex min-h-11 items-center justify-center rounded-full px-7 text-sm font-medium text-ink transition-colors duration-200 hover:text-goldbright active:scale-95"
            >
              Why metadata dies
            </a>
          </div>

          <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted">
            <span className="rounded-full border border-line px-3 py-1">Mera passkey</span>
            <span className="rounded-full border border-line px-3 py-1">Monad testnet</span>
            <span className="rounded-full border border-line px-3 py-1">perceptual hash</span>
          </p>
        </div>

        <div className="relative">
          <Scatter />
        </div>
      </div>
    </header>
  );
}