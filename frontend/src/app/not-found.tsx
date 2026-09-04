import Link from "next/link";
import FingerprintSeal from "@/components/fingerprint-seal";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-32 text-center md:pt-40">
      <div className="mx-auto w-32">
        <FingerprintSeal />
      </div>
      <h1 className="mt-8 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
        Nothing seals here.
      </h1>
      <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/"
        className="btn-sheen mt-9 inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
      >
        Back to Fealty
      </Link>
    </main>
  );
}
