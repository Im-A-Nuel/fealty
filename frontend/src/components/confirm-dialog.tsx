"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "./reveal";

export default function ConfirmDialog({
  open,
  title,
  labelledBy,
  children,
  confirmLabel,
  cancelLabel = "Cancel",
  busy = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  labelledBy?: string;
  children: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6">
          <motion.button
            type="button"
            aria-label="Close dialog"
            onClick={onCancel}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
            initial={reduced ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={labelledBy}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative w-full max-w-md rounded-3xl border border-line bg-surface p-7 shadow-[0_24px_80px_rgba(0,0,0,0.6)]"
          >
            <h2
              id={labelledBy}
              className="font-display text-xl font-black uppercase tracking-tight text-ink"
            >
              {title}
            </h2>
            <div className="mt-4">{children}</div>
            <div className="mt-7 flex flex-col-reverse justify-end gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onCancel}
                disabled={busy}
                className="btn-ring inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-ink transition-colors hover:text-goldbright disabled:pointer-events-none disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={busy}
                className="btn-sheen inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95 disabled:pointer-events-none disabled:opacity-70"
              >
                {busy ? "Broadcasting…" : confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}