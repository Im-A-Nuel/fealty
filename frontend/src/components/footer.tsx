import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <Link href="/" className="font-display text-2xl font-medium tracking-tight text-ink">
            Fealty
          </Link>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Passkey identity and proof of origin for AI agents, on Monad. Built for the
            Metropolis hackathon.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <Link href="/verify" className="text-muted transition-colors hover:text-goldbright">
            Verify
          </Link>
          <Link href="/onboarding" className="text-muted transition-colors hover:text-goldbright">
            Onboarding
          </Link>
          <Link
            href="https://github.com/Im-A-Nuel/fealty"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted transition-colors hover:text-goldbright"
          >
            GitHub
          </Link>
        </nav>

        <p className="text-sm text-muted">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}