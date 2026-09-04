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
        <SpecRow label="key material" value="on-device" />
        <SpecRow label="derived EOA" value="0x7a1e…d4f9" />
      </div>
    ),
  },
  {
    name: "Monad testnet",
    role: "Ledger",
    body: "Two registries anchor every claim onchain, time-stamped and public.",
    visual: (
      <div className="space-y-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
            <path d="M12 12l8-4.5M12 12L4 7.5M12 12v9" />
          </svg>
        </div>
        <SpecRow label="identity" value="AgentIdentityRegistry" />
        <SpecRow label="content" value="ContentProvenanceRegistry" />
      </div>
    ),
  },
  {
    name: "goimagehash",
    role: "Fingerprint",
    body: "A 64-bit perceptual hash per file, computed from the pixels, so it survives re-encoding.",
    visual: (
      <div className="rounded-xl border border-line bg-surface2 p-4">
        <p className="text-[11px] font-medium uppercase tracking-widest text-muted">phash · 64 bit</p>
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
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line">
          <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 17h16M4 12h16M4 7h16" />
          </svg>
        </div>
        <SpecRow label="lookup" value="Hamming distance" />
        <SpecRow label="store" value="all registered hashes" />
      </div>
    ),
  },
];

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted">{label}</p>
      <p className="truncate text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

const css = `
  .carousal-fealty {
    width: 100%;
    max-width: 932px;
    height: 460px;
    padding-bottom: 46px !important;
    overflow: hidden;
  }

  .carousal-fealty .swiper-slide {
    background-position: center;
    background-size: cover;
    width: 300px;
    height: 400px;
    z-index: 1;
  }

  .carousal-fealty .swiper-slide-active {
    z-index: 5 !important;
  }

  .carousal-fealty .swiper-pagination-bullet {
    width: 6px;
    height: 6px;
    background-color: var(--gold) !important;
    opacity: 0.3;
  }

  .carousal-fealty .swiper-pagination-bullet-active {
    opacity: 1;
  }

  .stack-nav .stack-next,
  .stack-nav .stack-prev {
    position: static;
    top: auto;
    margin-top: 0;
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    background-color: var(--surface-2);
    border: 1px solid var(--line);
    color: var(--gold);
    transition: border-color 0.2s ease;
  }

  .stack-nav .stack-next:hover,
  .stack-nav .stack-prev:hover {
    border-color: var(--gold);
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
            className="relative mx-auto mt-12 w-full max-w-[1080px] px-2 sm:px-6"
          >
            <style>{css}</style>

            <div className="stack-nav flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                aria-label="Previous slide"
                className="stack-prev after:hidden hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-gold sm:inline-flex"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>

              <Swiper
                spaceBetween={16}
                autoplay={
                  reduced
                    ? false
                    : {
                        delay: 2600,
                        disableOnInteraction: true,
                        reverseDirection: true,
                      }
                }
                effect="coverflow"
                grabCursor={true}
                slidesPerView="auto"
                centeredSlides={true}
                loop={true}
                loopAdditionalSlides={2}
                watchSlidesProgress={true}
                coverflowEffect={{
                  rotate: 30,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: false,
                }}
                pagination={{ clickable: true }}
              navigation={{
                nextEl: ".stack-next",
                prevEl: ".stack-prev",
              }}
              className="carousal-fealty min-w-0 flex-1"
                modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
              >
                {stack.map((item) => (
                  <SwiperSlide key={item.name}>
                    <div className="flex h-full flex-col rounded-3xl border border-line p-6 bg-[linear-gradient(180deg,#101010_0%,#181818_100%)] shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
                      <p className="font-display text-xl font-black uppercase tracking-tight text-gold">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted">
                        {item.role}
                      </p>
                      <div className="my-6 flex-1">{item.visual}</div>
                      <p className="border-t border-line pt-4 text-sm leading-relaxed text-muted">
                        {item.body}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <button
                type="button"
                aria-label="Next slide"
                className="stack-next after:hidden hidden h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full text-gold sm:inline-flex"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
