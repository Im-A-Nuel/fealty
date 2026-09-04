"use client";

import { motion } from "framer-motion";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import {
  Autoplay,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";

import { cn } from "@/lib/utils";
import PhashGrid from "./phash-grid";
import { Reveal, useReducedMotion } from "./reveal";

const stack = [
  {
    name: "Mera",
    role: "Identity",
    body: "WebAuthn PRF passkey derives a self-custodial EOA on-device. No seed phrase, no backend-held keys.",
    visual: (
      <div className="space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="8" cy="15" r="4" />
            <path d="M11 12L20 3M16 7l2 2M13 10l2 2" />
          </svg>
        </div>
        <div className="rounded-xl border border-line bg-surface2 px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-muted">derived EOA</p>
          <p className="mt-1 truncate font-mono text-sm text-goldbright">0x7a1e…d4f9</p>
        </div>
        <div className="rounded-xl border border-line bg-surface2 px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-muted">key material</p>
          <p className="mt-1 text-sm text-ink">stays on-device</p>
        </div>
      </div>
    ),
  },
  {
    name: "Monad testnet",
    role: "Ledger",
    body: "AgentIdentityRegistry and ContentProvenanceRegistry anchor every claim onchain, time-stamped and public.",
    visual: (
      <div className="space-y-3">
        <div className="rounded-xl border border-line bg-surface2 px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-muted">registry</p>
          <p className="mt-1 truncate font-mono text-sm text-goldbright">AgentIdentityRegistry</p>
        </div>
        <div className="rounded-xl border border-line bg-surface2 px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-muted">registry</p>
          <p className="mt-1 truncate font-mono text-sm text-goldbright">ContentProvenanceRegistry</p>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-line bg-surface2 px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-muted">network</p>
          <p className="text-sm font-semibold text-goldbright">Monad</p>
        </div>
      </div>
    ),
  },
  {
    name: "goimagehash",
    role: "Fingerprint",
    body: "A 64-bit perceptual hash per file, computed from the pixels, so it survives re-encoding.",
    visual: (
      <div className="rounded-xl border border-line bg-surface2 p-4">
        <p className="text-[10px] uppercase tracking-widest text-muted">phash · 64 bit</p>
        <PhashGrid seed={4} className="mt-3" />
      </div>
    ),
  },
  {
    name: "Redis",
    role: "Hash index",
    body: "Every registered hash lives in memory, so a verification scan compares against all of them in one pass.",
    visual: (
      <div className="space-y-3">
        <div className="rounded-xl border border-line bg-surface2 px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-muted">lookup</p>
          <p className="mt-1 text-sm text-ink">Hamming distance scan</p>
        </div>
        <div className="rounded-xl border border-line bg-surface2 px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-muted">store</p>
          <p className="mt-1 text-sm text-ink">all registered hashes</p>
        </div>
        <div className="rounded-xl border border-line bg-surface2 px-4 py-3">
          <p className="text-[10px] uppercase tracking-widest text-muted">match rule</p>
          <p className="mt-1 text-sm text-ink">below the threshold</p>
        </div>
      </div>
    ),
  },
];

const css = `
  .stack-carousel {
    width: 100%;
    height: 430px;
    padding-bottom: 48px !important;
  }

  .stack-carousel .swiper-slide {
    width: 300px;
    height: 380px;
    background-position: center;
    background-size: cover;
  }

  .stack-carousel .swiper-pagination-bullet {
    background-color: var(--gold) !important;
    opacity: 0.35;
  }

  .stack-carousel .swiper-pagination-bullet-active {
    opacity: 1;
  }

  .stack-carousel .swiper-button-next,
  .stack-carousel .swiper-button-prev {
    top: 46%;
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    background-color: var(--surface-2);
    border: 1px solid var(--line);
    color: var(--gold);
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .stack-carousel .swiper-button-next:hover,
  .stack-carousel .swiper-button-prev:hover {
    border-color: var(--gold);
  }

  .stack-carousel .swiper-button-prev {
    left: 4px;
  }

  .stack-carousel .swiper-button-next {
    right: 4px;
  }

  @media (min-width: 768px) {
    .stack-carousel .swiper-button-prev {
      left: 24px;
    }

    .stack-carousel .swiper-button-next {
      right: 24px;
    }
  }
`;

export default function Stack() {
  const reduced = useReducedMotion();

  return (
    <section id="stack" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 md:py-32">
        <Reveal className="max-w-2xl">
          <h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
            The stack behind the seal.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
            Built for the Metropolis hackathon, Trust, Identity and AI Infrastructure track.
            Real pieces, each with one job.
          </p>
        </Reveal>

        <Reveal delay={120}>
          <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="relative mx-auto mt-14 w-full max-w-5xl px-2 sm:px-8"
          >
            <style>{css}</style>

            <Swiper
              spaceBetween={0}
              autoplay={
                reduced
                  ? false
                  : {
                      delay: 1500,
                      disableOnInteraction: true,
                    }
              }
              effect="coverflow"
              grabCursor={true}
              slidesPerView="auto"
              centeredSlides={true}
              loop={true}
              coverflowEffect={{
                rotate: 40,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
              }}
              pagination={{ clickable: true }}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              className="stack-carousel"
              modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
            >
              {stack.map((item) => (
                <SwiperSlide key={item.name}>
                  <div
                    className={cn(
                      "flex h-full flex-col rounded-3xl border border-line p-7",
                      "bg-[linear-gradient(180deg,#101010_0%,#181818_100%)]",
                      "shadow-[0_16px_48px_rgba(0,0,0,0.4)]",
                    )}
                  >
                    <p className="font-display text-2xl font-black uppercase tracking-tight text-gold">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted">
                      {item.role}
                    </p>
                    <div className="my-6 flex-1">{item.visual}</div>
                    <p className="text-sm leading-relaxed text-muted">{item.body}</p>
                  </div>
                </SwiperSlide>
              ))}

              <div>
                <div className="swiper-button-next after:hidden">
                  <ChevronRightIcon className="h-5 w-5" />
                </div>
                <div className="swiper-button-prev after:hidden">
                  <ChevronLeftIcon className="h-5 w-5" />
                </div>
              </div>
            </Swiper>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}