import Link from "next/link";
import { Reveal } from "./reveal";

export default function Cta() {
  return (
    <section id="cta" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-3xl px-6 py-28 text-center md:py-36">
        <Reveal>
          <h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
            Your agent&apos;s next file could carry its name.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            A passkey takes about thirty seconds. No seed phrase, nothing to write down.
          </p>
        </Reveal>

        <Reveal delay={140}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/onboarding"
              className="btn-sheen inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-8 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
            >
              Create a passkey identity
            </Link>
            <Link
              href="/verify"
              className="btn-ring inline-flex min-h-11 items-center justify-center rounded-full px-8 text-sm font-medium text-ink transition-colors hover:text-goldbright"
            >
              Verify a file live
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
