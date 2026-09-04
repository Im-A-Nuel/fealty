"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useReducedMotion } from "./reveal";
import { cn } from "@/lib/utils";

const CARD_W = 300;
const GAP = 20;
const STEP = CARD_W + GAP;

type StackItem = {
  name: string;
  role: string;
  body: string;
  visual: ReactNode;
};

function CardContent({ item }: { item: StackItem }) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-3xl border border-line p-6",
        "bg-[linear-gradient(180deg,#101010_0%,#181818_100%)]",
        "shadow-[0_16px_48px_rgba(0,0,0,0.4)]",
      )}
    >
      <p className="font-display text-xl font-black uppercase tracking-tight text-gold">
        {item.name}
      </p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted">
        {item.role}
      </p>
      <div className="my-6 flex-1">{item.visual}</div>
      <p className="border-t border-line pt-4 text-sm leading-relaxed text-muted">{item.body}</p>
    </div>
  );
}

export default function StackCarousel({ items }: { items: StackItem[] }) {
  const reduced = useReducedMotion();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [containerW, setContainerW] = useState(0);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setContainerW(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      if (!pausedRef.current) setActive((a) => (a + 1) % items.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, [reduced, items.length]);

  const n = items.length;
  const track = [...items, ...items, items[0]];
  const k = active + n;
  const x = containerW / 2 - CARD_W / 2 - k * STEP;

  const go = (dir: 1 | -1) => setActive((a) => (a + dir + n) % n);

  return (
    <div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="btn-ring hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-gold md:inline-flex"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        <div
          ref={containerRef}
          onMouseEnter={() => (pausedRef.current = true)}
          onMouseLeave={() => (pausedRef.current = false)}
          className="relative flex-1 overflow-hidden rounded-3xl"
          style={{ height: 460 }}
        >
          <div
            className="flex items-start"
            style={{
              width: "max-content",
              transform: `translate3d(${x}px, 0, 0)`,
              transition: reduced ? "none" : "transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {track.map((item, i) => {
              const offset = i - k;
              const isCenter = offset === 0;
              const isSide = Math.abs(offset) === 1;
              const sideTransform = isCenter
                ? undefined
                : `perspective(1200px) rotateY(${offset < 0 ? 16 : -16}deg) scale(0.9)`;
              return (
                <div
                  key={i}
                  className="shrink-0"
                  style={{
                    width: CARD_W,
                    marginRight: GAP,
                    opacity: isSide ? 0.55 : isCenter ? 1 : 0,
                    transform: sideTransform,
                    zIndex: isCenter ? 3 : 1,
                    transition: "opacity 0.4s ease",
                  }}
                >
                  <div style={{ height: 400 }}>
                    <CardContent item={item} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next slide"
          className="btn-ring hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-gold md:inline-flex"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2">
        {items.map((item, i) => (
          <button
            key={item.name}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === active ? "true" : undefined}
            className={cn(
              "h-2 w-2 rounded-full transition-colors duration-200",
              i === active ? "bg-gold" : "bg-line hover:bg-muted",
            )}
          />
        ))}
      </div>
    </div>
  );
}