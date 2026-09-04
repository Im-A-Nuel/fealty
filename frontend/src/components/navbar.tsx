"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const links = [
  { href: "/agents", label: "Agents" },
  { href: "/verify", label: "Verify" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "border-b border-line bg-background/90 backdrop-blur-sm" : ""
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-xl font-medium tracking-tight text-ink"
          aria-label="Fealty, home"
        >
          <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rounded-full bg-gold" />
          Fealty
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? "page" : undefined}
              className={`text-sm transition-colors hover:text-goldbright ${
                pathname === link.href ? "text-goldbright" : "text-muted"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/onboarding"
            className="btn-sheen inline-flex min-h-11 items-center rounded-full bg-gold px-5 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
          >
            Create identity
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h10" />
            )}
          </svg>
        </button>
      </div>

      {open ? (
        <nav
          id="mobile-menu"
          className="border-t border-line bg-background px-6 py-4 md:hidden"
          aria-label="Mobile"
        >
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-2 py-3 text-base text-ink hover:bg-surface"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/onboarding"
              className="btn-sheen mt-2 inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-5 text-sm font-semibold text-background"
            >
              Create identity
            </Link>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
