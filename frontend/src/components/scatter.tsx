"use client";

import { useCallback, useRef, useState } from "react";
import FingerprintSeal from "./fingerprint-seal";
import PhashGrid from "./phash-grid";
import { useReducedMotion } from "./reveal";

type Card = {
  depth: number;
  className: string;
  node: React.ReactNode;
};

export default function Scatter() {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || e.pointerType !== "mouse") return;
      const rect = frame.current?.getBoundingClientRect();
      if (!rect) return;
      setOffset({
        x: (e.clientX - rect.left) / rect.width - 0.5,
        y: (e.clientY - rect.top) / rect.height - 0.5,
      });
    },
    [reduced],
  );

  const cards: Card[] = [
    {
      depth: 18,
      className:
        "w-40 sm:w-48 rounded-xl border border-line bg-surface p-3 shadow-[0_16px_48px_rgba(0,0,0,0.4)]",
      node: (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Agent identity
          </p>
          <p className="mt-1 font-display text-base font-bold tracking-tight text-ink">
            FEALTY-0x7a1e
          </p>
        </>
      ),
    },
    {
      depth: 32,
      className:
        "w-44 rounded-xl border border-line bg-surface p-3 shadow-[0_16px_48px_rgba(0,0,0,0.4)]",
      node: (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">
            Perceptual hash
          </p>
          <PhashGrid seed={2} className="mt-2 w-full" />
          <p className="mt-2 font-mono text-[10px] text-muted">8f3a…c21d</p>
        </>
      ),
    },
    {
      depth: 46,
      className:
        "flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 shadow-[0_16px_48px_rgba(0,0,0,0.4)]",
      node: (
        <>
          <span
            aria-hidden="true"
            className="h-2 w-2 rounded-full bg-gold"
          />
          <p className="text-xs font-semibold uppercase tracking-wide text-goldbright">
            Verified on Monad
          </p>
        </>
      ),
    },
  ];

  return (
    <div
      ref={frame}
      onPointerMove={onMove}
      className="relative mx-auto flex h-[440px] w-full max-w-[520px] items-center justify-center sm:h-[520px]"
      aria-hidden="true"
    >
      <div
        className="absolute h-56 w-56 rounded-full"
        style={{
          background:
            "radial-gradient(circle at center, rgba(201,162,39,0.14) 0%, transparent 66%)",
        }}
      />
      <div
        className="absolute left-1/2 top-1/2 w-40 -translate-x-1/2 -translate-y-1/2 sm:w-52"
        style={{ willChange: "transform" }}
      >
        <FingerprintSeal />
      </div>

      {cards.map((card, i) => (
        <div
          key={i}
          className={`absolute ${card.className} will-change-transform`}
          style={{
            top: `${[18, 78, 46][i]}%`,
            left: `${[2, 62, 84][i]}%`,
            transform: `translate(${offset.x * card.depth}px, ${offset.y * card.depth}px)`,
            transition: "transform 0.4s ease-out",
          }}
        >
          {card.node}
        </div>
      ))}
    </div>
  );
}