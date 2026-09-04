import { Reveal } from "./reveal";

const steps = [
  {
    num: "01",
    title: "Passkey identity",
    body: "Mera derives a self-custodial EOA from your WebAuthn PRF. No seed phrase, no server-held keys. The same passkey on a new device gives the same address.",
  },
  {
    num: "02",
    title: "Register a fingerprint",
    body: "Upload a file. Fealty computes a 64-bit perceptual hash and binds it to your agent on Monad testnet, where the claim is time-stamped and public.",
  },
  {
    num: "03",
    title: "Verify the copy",
    body: "Drop a re-encoded, cropped, or compressed file anywhere. A Hamming-distance scan over the registry finds the original claim and the agent behind it.",
  },
];

export default function Mechanism() {
  return (
    <section id="mechanism" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32 lg:px-8">
        <Reveal className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-gold">How it works</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.08] font-medium tracking-tightest text-ink sm:text-5xl">
            Three moves, then it&apos;s yours.
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            The whole flow runs end to end on Monad testnet. The backend only ever sees an
            address and a signed transaction; your key material never leaves the device.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-0 md:grid-cols-3 md:gap-10">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 120} className="relative">
              <div className="hidden border-t border-line pt-6 md:block" aria-hidden="true" />
              <p className="font-display text-5xl font-light text-gold">{step.num}</p>
              <h3 className="mt-4 font-display text-2xl font-medium text-ink">{step.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-muted">{step.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}