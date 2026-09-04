"use client";

import { useCallback, useRef, useState } from "react";
import { useReducedMotion } from "./reveal";

type Point = { x: number; y: number };

function polar(cx: number, cy: number, r: number, angleDeg: number): Point {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number): string {
  const p1 = polar(cx, cy, r, start);
  const p2 = polar(cx, cy, r, end);
  const large = Math.abs(end - start) > 180 ? 1 : 0;
  return `M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
}

function ridgeArcs(cx: number, cy: number, rings: number): string[] {
  const paths: string[] = [];
  const startR = 34;
  const step = (118 - startR) / rings;
  for (let i = 0; i < rings; i++) {
    const r = startR + i * step;
    const offset = i * 9; // gaps rotate ring by ring, reads as a real fingerprint
    const arcs = [
      [offset, offset + 108],
      [offset + 128, offset + 236],
      [offset + 258, offset + 348],
    ] as const;
    for (const [s, e] of arcs) {
      paths.push(arcPath(cx, cy, r, s, e));
    }
  }
  return paths;
}

function serration(cx: number, cy: number, r1: number, r2: number, ticks: number): string[] {
  const lines: string[] = [];
  for (let a = 0; a < 360; a += 360 / ticks) {
    const p1 = polar(cx, cy, r1, a);
    const p2 = polar(cx, cy, r2, a);
    lines.push(`M ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} L ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`);
  }
  return lines;
}

export default function FingerprintSeal({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const frame = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || e.pointerType !== "mouse") return;
      const el = frame.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: -py * 16, y: px * 22 });
    },
    [reduced],
  );

  const onLeave = useCallback(() => {
    if (reduced) return;
    setTilt({ x: 0, y: 0 });
  }, [reduced]);

  const rings = 12;
  const cx = 160;
  const cy = 160;

  return (
    <div
      ref={frame}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={className}
      style={{ perspective: "900px" }}
      aria-hidden="true"
    >
      <div
        className="will-change-transform"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.35s ease-out",
        }}
      >
        <div className="animate-seal-float will-change-transform">
          <svg
          viewBox="0 0 320 320"
          className="block h-auto w-full"
          role="img"
          aria-label="A gold wax seal embossed with a fingerprint"
        >
          <defs>
            <radialGradient id="sealDisc" cx="42%" cy="36%" r="75%">
              <stop offset="0%" stopColor="#2a2418" />
              <stop offset="55%" stopColor="#1a150c" />
              <stop offset="100%" stopColor="#0e0b06" />
            </radialGradient>
            <linearGradient id="ridgeGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#E6C34F" />
              <stop offset="55%" stopColor="#C9A227" />
              <stop offset="100%" stopColor="#8A6D1C" />
            </linearGradient>
            <radialGradient id="sealSheen" cx="38%" cy="30%" r="60%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
          </defs>

          <ellipse cx="160" cy="188" rx="96" ry="14" fill="#000000" opacity="0.35" />

          <circle cx={cx} cy={cy} r="148" fill="url(#sealDisc)" />

          {serration(cx, cy, 138, 148, 64).map((d, i) => (
            <path key={`serr-${i}`} d={d} stroke="url(#ridgeGold)" strokeWidth="1.6" />
          ))}

          <circle cx={cx} cy={cy} r="136" fill="none" stroke="url(#ridgeGold)" strokeWidth="2.4" />
          <circle cx={cx} cy={cy} r="131" fill="none" stroke="#8A6D1C" strokeWidth="1" />

          {ridgeArcs(cx, cy, rings).map((d, i) => (
            <path
              key={`ridge-${i}`}
              d={d}
              fill="none"
              stroke="url(#ridgeGold)"
              strokeWidth="2.7"
              strokeLinecap="round"
            />
          ))}

          <circle cx={cx} cy={cy} r="7" fill="none" stroke="url(#ridgeGold)" strokeWidth="2.6" />
          <circle cx={cx} cy={cy} r="3" fill="url(#ridgeGold)" />

          <circle cx={cx} cy={cy} r="148" fill="url(#sealSheen)" />
          </svg>
        </div>
      </div>
    </div>
  );
}