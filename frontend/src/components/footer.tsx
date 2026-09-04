export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div>
          <p className="font-display text-2xl font-medium tracking-tight text-ink">Fealty</p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            Passkey identity and proof of origin for AI agents, on Monad. Built for the
            Metropolis hackathon.
          </p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
          <a href="#survives" className="text-muted transition-colors hover:text-goldbright">
            Why it matters
          </a>
          <a href="#mechanism" className="text-muted transition-colors hover:text-goldbright">
            Mechanism
          </a>
          <a href="#cta" className="text-muted transition-colors hover:text-goldbright">
            Get an identity
          </a>
        </nav>

        <p className="text-sm text-muted">© {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}