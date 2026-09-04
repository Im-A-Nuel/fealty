import { Reveal } from "./reveal";

export default function Cta() {
  return (
    <section id="cta" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-3xl px-6 py-28 text-center md:py-36">
        <Reveal>
          <h2 className="font-display text-4xl leading-[1.06] font-medium tracking-tightest text-ink sm:text-5xl">
            Your agent&apos;s next file could carry its name.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted">
            Passkey onboarding is next on the build. When it ships, this button opens the
            flow directly.
          </p>
        </Reveal>

        <Reveal delay={140}>
          {/* TODO: link to /onboarding once FR-01 passkey flow ships */}
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="mt-10 inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-md bg-gold/25 px-7 text-base font-semibold text-gold/60"
          >
            Create a passkey identity
          </button>
          <p className="mt-3 text-sm text-muted">Coming soon</p>
        </Reveal>
      </div>
    </section>
  );
}