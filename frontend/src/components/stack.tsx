"use client";

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

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-t border-line pt-3">
      <p className="text-[11px] font-medium uppercase tracking-widest text-muted">{label}</p>
      <p className="truncate text-sm font-medium text-ink">{value}</p>
    </div>
  );
}

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

const css = `
  .stack-carousel {
    width: 100%;
    height: 460px;
    padding-bottom: 46px !important;
  }

  .stack-carousel .swiper-slide {
    height: 400px;
    z-index: 1;
  }

  .stack-carousel .swiper-slide-active {
    z-index: 5 !important;
  }

  .stack-carousel .swiper-pagination-bullet {
    width: 6px;
    height: 6px;
    background-color: var(--gold) !important;
    opacity: 0.3;
  }

  .stack-carousel .swiper-pagination-bullet-active {
    opacity: 1;
  }

  .stack-carousel .swiper-button-next,
  .stack-carousel .swiper-button-prev {
    top: 44%;
    display: none;
    z-index: 10;
    width: 44px;
    height: 44px;
    border-radius: 9999px;
    background-color: var(--surface-2);
    border: 1px solid var(--line);
    color: var(--gold);
    transition: border-color 0.2s ease;
    cursor: pointer;
  }

  .stack-carousel .swiper-button-next:hover,
  .stack-carousel .swiper-button-prev:hover {
    border-color: var(--gold);
  }

  .stack-carousel .swiper-button-prev {
    left: 0;
  }

  .stack-carousel .swiper-button-next {
    right: 0;
  }

  @media (min-width: 768px) {
    .stack-carousel .swiper-button-next,
    .stack-carousel .swiper-button-prev {
      display: flex;
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
          <div className="relative mx-auto mt-12 w-full max-w-[760px]">
            <style>{css}</style>

            <Swiper
              spaceBetween={16}
              breakpoints={{
                640: { slidesPerView: 1.8, spaceBetween: 20 },
                1024: { slidesPerView: 2.3, spaceBetween: 20 },
              }}
              autoplay={
                reduced
                  ? false
                  : {
                      delay: 2600,
                      disableOnInteraction: true,
                    }
              }
              effect="coverflow"
              grabCursor={true}
              slidesPerView={1.35}
              centeredSlides={true}
              loop={true}
              watchSlidesProgress={true}
              coverflowEffect={{
                rotate: 20,
                stretch: 24,
                depth: 70,
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

                    <p className="border-t border-line pt-4 text-sm leading-relaxed text-muted">
                      {item.body}
                    </p>
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
          </div>
        </Reveal>
      </div>
    </section>
  );
}