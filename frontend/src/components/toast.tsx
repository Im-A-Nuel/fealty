"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactElement,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "./reveal";

type ToastVariant = "success" | "error" | "info";
type ToastItem = { id: number; title: string; message?: string; variant: ToastVariant };
type ToastInput = { title: string; message?: string; variant?: ToastVariant };

const DURATION = 4200;

const ToastContext = createContext<(t: ToastInput) => void>(() => {});
export function useToast() {
  return useContext(ToastContext);
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-goldbright" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ef6b6b]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 4L21 20H3L12 4z" />
      <path d="M12 10v4M12 17h.01" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  );
}

const ICONS: Record<ToastVariant, ReactElement> = {
  success: <CheckIcon />,
  error: <AlertIcon />,
  info: <InfoIcon />,
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((input: ToastInput) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { ...input, variant: input.variant ?? "info", id }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, DURATION + 300);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={push}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed right-4 top-20 z-[70] flex w-[min(92vw,360px)] flex-col gap-3"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={reduced ? { opacity: 0 } : { opacity: 0, x: 48, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, x: 24 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="pointer-events-auto relative overflow-hidden rounded-2xl border border-line bg-surface p-4 shadow-[0_16px_48px_rgba(0,0,0,0.55)]"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">{ICONS[toast.variant]}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{toast.title}</p>
                  {toast.message ? (
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{toast.message}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(toast.id)}
                  aria-label="Dismiss notification"
                  className="shrink-0 rounded-md p-1 text-muted transition-colors hover:text-ink"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </div>
              {!reduced ? (
                <motion.span
                  aria-hidden="true"
                  className="absolute bottom-0 left-0 h-0.5 bg-gold"
                  initial={{ width: "100%" }}
                  animate={{ width: "0%" }}
                  transition={{ duration: DURATION / 1000, ease: "linear" }}
                />
              ) : null}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}