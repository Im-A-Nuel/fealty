import { Reveal } from "./reveal";

const stack = [
  {
    name: "Mera",
    role: "Identity",
    body: "WebAuthn PRF passkey derives a self-custodial EOA on-device. No seed phrase, no backend-held keys.",
  },
  {
    name: "Monad testnet",
    role: "Ledger",
    body: "AgentIdentityRegistry and ContentProvenanceRegistry anchor every claim onchain, time-stamped and public.",
  },
  {
    name: "goimagehash",
    role: "Fingerprint",
    body: "A 64-bit perceptual hash per file, matched by Hamming distance over the registry in Redis.",
  },
];

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

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stack.map((item, i) => (
            <Reveal key={item.name} delay={i * 120}>
              <div className="flex h-full flex-col rounded-t-3xl rounded-b-[4rem] border border-line bg-[linear-gradient(180deg,#101010_0%,#181818_100%)] p-8">
                <p className="font-display text-xl font-black uppercase tracking-tight text-gold">
                  {item.name}
                </p>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-muted">
                  {item.role}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}