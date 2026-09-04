"use client";

import { useEffect, useRef } from "react";
import FingerprintSeal from "./fingerprint-seal";
import { useReducedMotion } from "./reveal";

export default function Hero() {
  const reduced = useReducedMotion();
  const glowRef = useRef<HTMLDivElement | null>(null);
  const sealRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(0, ${y * 0.18}px, 0)`;
        }
        if (sealRef.current) {
          sealRef.current.style.transform = `translate3d(0, ${y * 0.08}px, 0)`;
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
        ref={glowRef}
        className="pointer-events-none absolute right-[-18%] top-[-10%] h-[720px] w-[720px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle at center, rgba(201,162,39,0.16) 0%, rgba(201,162,39,0.05) 42%, transparent 68%)",
        }}
        aria-hidden="true"
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-14 px-6 pt-28 pb-24 md:grid-cols-[1.15fr_0.85fr] md:pt-36 md:pb-32 lg:px-8">
        <div className="max-w-xl">
          <p className="mb-6 text-sm font-medium tracking-wide text-muted">
            Passkey identity · Proof of origin · Monad
          </p>

          <h1 className="font-display text-5xl leading-[1.02] font-medium tracking-tightest text-ink sm:text-6xl lg:text-7xl">
            Prove what your{" "}
            <em className="text-goldbright not-italic">agent</em> made.
          </h1>

          <p className="mt-7 text-lg leading-relaxed text-muted sm:text-xl">
            Fealty gives an AI agent a self-custodial identity from a passkey, then binds a
            perceptual fingerprint to everything it creates. Crop, compress, or re-encode a
            file: it still traces back to the agent that made it.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="#mechanism"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-gold px-6 text-base font-semibold text-background transition-colors duration-200 hover:bg-goldbright"
            >
              See the mechanism
            </a>
            <a
              href="#problem"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-line px-6 text-base font-medium text-ink transition-colors duration-200 hover:border-gold hover:text-goldbright"
            >
              Why provenance breaks
            </a>
          </div>

          <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            <span>Mera passkey</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
            <span>Monad testnet</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-gold" />
            <span>perceptual hash</span>
          </p>
        </div>

        <div ref={sealRef} className="relative mx-auto w-full max-w-[420px] will-change-transform">
          <FingerprintSeal />
        </div>
      </div>
    </header>
  );
}