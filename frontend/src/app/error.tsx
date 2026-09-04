"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="grain bg-background text-ink">
        <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 text-center">
          <h1 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
            Something came apart.
          </h1>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted">
            The page hit an unexpected error. Try again, or go back to the start.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={reset}
              className="btn-sheen inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
            >
              Try again
            </button>
            <a
              href="/"
              className="btn-ring inline-flex min-h-11 items-center justify-center rounded-full px-7 text-sm font-medium text-ink transition-colors hover:text-goldbright"
            >
              Back to Fealty
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
