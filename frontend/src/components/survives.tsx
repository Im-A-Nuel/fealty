import { Reveal } from "./reveal";

function Artifact({ variant, seed }: { variant: "blur" | "small" | "crop" | "shift"; seed: number }) {
  const rects = Array.from({ length: 9 }, (_, i) => {
    const x = (i % 3) * 40;
    const y = Math.floor(i / 3) * 40;
    const gray = (i * 37 + seed * 23) % 200 + 20;
    return (
      <rect
        key={i}
        x={x}
        y={y}
        width={40}
        height={40}
        fill={`rgb(${gray},${gray},${Math.min(255, gray + 30)})`}
      />
    );
  });
  const filters: Record<typeof variant, string> = {
    blur: "blur(2.5px) saturate(0.8)",
    small: "none",
    crop: "none",
    shift: "hue-rotate(40deg) contrast(1.2)",
  };
  const transforms: Record<typeof variant, string> = {
    blur: "none",
    small: "scale(0.5)",
    crop: "scale(1.5)",
    shift: "none",
  };
  return (
    <div className="overflow-hidden rounded-xl border border-line" style={{ height: 120 }}>
      <svg
        viewBox="0 0 120 120"
        className="h-full w-full"
        style={{ filter: filters[variant], transform: transforms[variant], transformOrigin: "center" }}
        aria-hidden="true"
      >
        {rects}
      </svg>
    </div>
  );
}

const attacks = [
  { name: "Compression", note: "JPEG re-encoded, quality 60", variant: "blur" as const, seed: 1 },
  { name: "Resize", note: "shrunk to 50%", variant: "small" as const, seed: 2 },
  { name: "Crop", note: "90% of the frame kept", variant: "crop" as const, seed: 3 },
  { name: "Re-encode", note: "converted, re-toned", variant: "shift" as const, seed: 4 },
];

export default function Survives() {
  return (
    <section id="survives" className="scroll-mt-24 border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 md:py-32">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold">
            The problem
          </p>
          <h2 className="mt-4 font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Metadata is the first thing that dies.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            A screenshot strips C2PA tags. A re-upload strips EXIF. Provenance that lives
            inside a file is gone the moment the file is copied. A perceptual hash is
            computed from the pixels, so it survives all of it.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {attacks.map((attack, i) => (
            <Reveal key={attack.name} delay={i * 100}>
              <div className="group rounded-2xl border border-line bg-surface p-4 transition-transform duration-300 ease-out hover:scale-[1.03]">
                <Artifact variant={attack.variant} seed={attack.seed} />
                <div className="mt-4 flex items-center justify-between">
                  <p className="font-display text-base font-bold uppercase tracking-tight text-ink">
                    {attack.name}
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background">
                    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    match
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted">{attack.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}