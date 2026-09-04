"use client";

import StackCarousel from "./stack-carousel";
import PhashGrid from "./phash-grid";
import { Reveal } from "./reveal";

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

export default function Stack() {
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
          <div className="mx-auto mt-12 w-full max-w-3xl">
            <StackCarousel items={stack} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}