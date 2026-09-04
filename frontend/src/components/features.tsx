import FingerprintSeal from "./fingerprint-seal";
import PhashGrid from "./phash-grid";
import { Reveal } from "./reveal";

function Panel({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6 shadow-[0_16px_48px_rgba(0,0,0,0.4)]">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted">{label}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const features = [
  {
    num: "01",
    id: "identity",
    title: "A name your agent can't lose.",
    body: "Mera derives a self-custodial EOA from a WebAuthn PRF passkey. No seed phrase to guard, no server-held key. The same passkey on a new device derives the same address.",
    visual: (
      <Panel label="Passkey identity">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-line">
              <svg viewBox="0 0 24 24" className="h-6 w-6 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <circle cx="8" cy="15" r="4" />
                <path d="M11 12L20 3M16 7l2 2M13 10l2 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">WebAuthn PRF</p>
              <p className="text-xs text-muted">on-device, no seed phrase</p>
            </div>
          </div>
          <div className="flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-line" />
            <span className="h-2 w-2 rotate-45 border border-gold" />
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
            <div className="min-w-0">
              <p className="text-xs text-muted">derived EOA</p>
              <p className="truncate font-mono text-sm text-goldbright">0x7a1e…d4f9</p>
            </div>
            <span className="shrink-0 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background">
              same passkey, same address
            </span>
          </div>
        </div>
      </Panel>
    ),
  },
  {
    num: "02",
    id: "register",
    title: "The pixels become the proof.",
    body: "Upload a file. Fealty computes a 64-bit perceptual hash and binds it to your agent on Monad testnet, where the claim is time-stamped and public.",
    visual: (
      <Panel label="Content registration">
        <div className="flex items-center gap-6">
          <div className="w-32 shrink-0">
            <FingerprintSeal />
          </div>
          <div className="flex-1 space-y-4">
            <div className="rounded-xl border border-line bg-surface2 p-3">
              <p className="text-[10px] uppercase tracking-widest text-muted">phash · 64 bit</p>
              <PhashGrid seed={4} className="mt-2" />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface2 px-4 py-3">
              <p className="text-xs text-muted">agentId</p>
              <p className="font-mono text-sm text-goldbright">042</p>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-line bg-surface2 px-4 py-3">
              <p className="text-xs text-muted">recorded on</p>
              <p className="font-mono text-sm text-goldbright">Monad testnet</p>
            </div>
          </div>
        </div>
      </Panel>
    ),
  },
  {
    num: "03",
    id: "verify",
    title: "Crop it. Compress it. It still points back.",
    body: "Drop a re-encoded, cropped, or compressed copy anywhere. A Hamming-distance scan over the registry finds the original claim and the agent behind it.",
    visual: (
      <Panel label="Verification">
        <div className="flex items-center gap-5">
          <div className="relative flex-1 overflow-hidden rounded-xl border border-line">
            <PhashGrid seed={1} className="p-3" />
            <span className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-ink">
              uploaded copy
            </span>
          </div>
          <div aria-hidden="true" className="flex flex-col items-center gap-1">
            <span className="font-mono text-xs text-goldbright">4/64</span>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
          <div className="relative flex-1 overflow-hidden rounded-xl border border-gold/40">
            <PhashGrid seed={1} className="p-3" />
            <span className="absolute left-2 top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-background">
              match
            </span>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Two files, near-identical hash. Hamming distance 4 of 64 bits, under the match
          threshold.
        </p>
      </Panel>
    ),
  },
];

export default function Features() {
  return (
    <section id="mechanism" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 md:py-32">
        {features.map((feature, i) => (
          <div
            key={feature.id}
            className={`grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16 ${
              i > 0 ? "mt-24 border-t border-line pt-24" : ""
            }`}
          >
            <Reveal
              className={i % 2 === 0 ? "md:order-1" : "md:order-2"}
            >
              <p className="font-display text-2xl font-black uppercase tracking-tight text-gold">
                {feature.num}
              </p>
              <h2 className="mt-4 font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
                {feature.title}
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                {feature.body}
              </p>
            </Reveal>
            <Reveal delay={120} className={i % 2 === 0 ? "md:order-2" : "md:order-1"}>
              {feature.visual}
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}