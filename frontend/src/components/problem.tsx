import { Reveal } from "./reveal";

export default function Problem() {
  return (
    <section id="problem" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-[1fr_1.1fr] md:gap-20 md:py-32 lg:px-8">
        <Reveal>
          <p className="text-sm font-medium tracking-wide text-gold">The problem</p>
          <h2 className="mt-5 font-display text-4xl leading-[1.08] font-medium tracking-tightest text-ink sm:text-5xl">
            Metadata is the first thing that dies.
          </h2>
        </Reveal>

        <Reveal delay={120}>
          <div className="space-y-6 text-lg leading-relaxed text-muted">
            <p>
              A screenshot strips C2PA tags. A re-upload strips EXIF. Any provenance that
              lives inside a file is gone the moment the file is copied.
            </p>
            <p>
              So an agent&apos;s work drifts loose from its maker. Nobody can tell what it
              actually produced, and nobody can prove what it did not.
            </p>
          </div>
        </Reveal>

        <Reveal className="md:col-span-2">
          <blockquote className="border-l-2 border-gold pl-6 font-display text-3xl leading-snug font-medium tracking-tight text-ink sm:text-4xl">
            Anyone should be able to ask of any file: who made this?
          </blockquote>
        </Reveal>

        <div className="md:col-span-2">
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            <div className="bg-surface p-6">
              <p className="font-display text-lg font-medium text-ink">Tag metadata</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Stripped the moment the image is screenshotted.
              </p>
            </div>
            <div className="bg-surface p-6">
              <p className="font-display text-lg font-medium text-ink">EXIF headers</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Gone after a single re-upload or resize.
              </p>
            </div>
            <div className="bg-surface p-6">
              <p className="font-display text-lg font-medium text-ink">Perceptual hash</p>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Computed from the pixels, so it survives all three.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}