"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import PhashGrid from "./phash-grid";
import { Reveal, useReducedMotion } from "./reveal";

const stack = [
  { name: "Mera", role: "Identity", body: "WebAuthn PRF passkey derives a self-custodial EOA on-device. No seed phrase, no backend-held keys.", visual: <div className="space-y-3"><div className="flex h-12 w-12 items-center justify-center rounded-full border border-line"><svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="8" cy="15" r="4" /><path d="M11 12L20 3M16 7l2 2M13 10l2 2" /></svg></div><SpecRow label="key material" value="on-device" /><SpecRow label="derived EOA" value="0x7a1e…d4f9" /></div> },
  { name: "Monad testnet", role: "Ledger", body: "Two registries anchor every claim onchain, time-stamped and public.", visual: <div className="space-y-3"><div className="flex h-12 w-12 items-center justify-center rounded-full border border-line"><svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" /><path d="M12 12l8-4.5M12 12L4 7.5M12 12v9" /></svg></div><SpecRow label="identity" value="AgentIdentityRegistry" /><SpecRow label="content" value="ContentProvenanceRegistry" /></div> },
  { name: "goimagehash", role: "Fingerprint", body: "A 64-bit perceptual hash per file, computed from pixels for similarity checks after re-encoding.", visual: <div className="w-full rounded-xl border border-line bg-surface2 p-3.5"><p className="text-[11px] font-medium uppercase tracking-widest text-muted">pHash · 64 bit</p><PhashGrid seed={4} className="mx-auto mt-3 max-w-[172px]" /></div> },
  { name: "Redis", role: "Hash index", body: "Registered hashes are kept in memory so the verification service can compare a file against its records.", visual: <div className="space-y-3"><div className="flex h-12 w-12 items-center justify-center rounded-full border border-line"><svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 17h16M4 12h16M4 7h16" /></svg></div><SpecRow label="lookup" value="Hamming distance" /><SpecRow label="store" value="registered hashes" /></div> },
];

function SpecRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 border-t border-line pt-3"><p className="text-[11px] font-medium uppercase tracking-widest text-muted">{label}</p><p className="truncate text-sm font-medium text-ink">{value}</p></div>;
}

function DeckPreview({ item, side }: { item: (typeof stack)[number]; side: "left" | "right" }) {
  return <div aria-hidden="true" className={`absolute top-7 hidden h-[22rem] w-56 rounded-3xl border border-line bg-surface p-5 opacity-45 lg:block ${side === "left" ? "left-0 -translate-x-24 -rotate-[5deg]" : "right-0 translate-x-24 rotate-[5deg]"}`}><p className="font-display text-base font-black uppercase tracking-tight text-gold">{item.name}</p><p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted">{item.role}</p><p className="mt-28 text-sm leading-relaxed text-muted">{item.body}</p></div>;
}

export default function Stack() {
  const reduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const active = stack[activeIndex];
  const previous = stack[(activeIndex + stack.length - 1) % stack.length];
  const next = stack[(activeIndex + 1) % stack.length];
  const move = (direction: -1 | 1) => setActiveIndex((index) => (index + direction + stack.length) % stack.length);

  return <section id="stack" className="scroll-mt-24 border-t border-line"><div className="mx-auto max-w-6xl px-6 py-24 lg:px-8 md:py-32"><Reveal className="max-w-2xl"><h2 className="font-display text-3xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">The stack behind the seal.</h2><p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">Built for the Metropolis hackathon, Trust, Identity and AI Infrastructure track. Real pieces, each with one job.</p></Reveal><Reveal delay={120}><div className="mx-auto mt-12 max-w-4xl"><div className="flex items-center justify-center gap-3 sm:gap-5"><DeckButton direction="left" label={`Show ${previous.name}`} onClick={() => move(-1)} /><div className="relative h-[27rem] min-w-0 flex-1 max-w-[42rem] overflow-hidden" aria-roledescription="carousel" aria-label="Fealty technology stack"><DeckPreview item={previous} side="left" /><DeckPreview item={next} side="right" /><AnimatePresence initial={false} mode="wait"><motion.article key={active.name} initial={reduced ? { opacity: 0 } : { opacity: 0, x: 18, scale: 0.985 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={reduced ? { opacity: 0 } : { opacity: 0, x: -18, scale: 0.985 }} transition={{ duration: reduced ? 0.01 : 0.22, ease: "easeOut" }} className="absolute left-1/2 top-0 flex h-[25rem] w-[19.5rem] -translate-x-1/2 flex-col rounded-3xl border border-line bg-[linear-gradient(180deg,#101010_0%,#181818_100%)] p-5 shadow-[0_16px_48px_rgba(0,0,0,0.4)]"><p className="font-display text-lg font-black uppercase tracking-tight text-gold">{active.name}</p><p className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted">{active.role}</p><div className="my-4 flex min-h-[10rem] flex-1 items-center">{active.visual}</div><p className="border-t border-line pt-4 text-sm leading-relaxed text-muted">{active.body}</p></motion.article></AnimatePresence></div><DeckButton direction="right" label={`Show ${next.name}`} onClick={() => move(1)} /></div><div className="mt-1 flex justify-center gap-2" role="tablist" aria-label="Technology stack slides">{stack.map((item, index) => <button key={item.name} type="button" role="tab" aria-selected={index === activeIndex} aria-label={`Show ${item.name}`} onClick={() => setActiveIndex(index)} className={`h-3 w-3 rounded-full border transition-colors ${index === activeIndex ? "border-gold bg-gold" : "border-line bg-surface2 hover:border-gold/70"}`} />)}</div></div></Reveal></div></section>;
}

function DeckButton({ direction, label, onClick }: { direction: "left" | "right"; label: string; onClick: () => void }) {
  return <button type="button" aria-label={label} onClick={onClick} className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface2 text-gold transition-colors hover:border-gold active:scale-95"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={direction === "left" ? "M15 18l-6-6 6-6" : "M9 18l6-6-6-6"} /></svg></button>;
}
