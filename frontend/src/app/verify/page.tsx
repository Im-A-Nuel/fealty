"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import DemoBadge from "@/components/demo-badge";
import FingerprintSeal from "@/components/fingerprint-seal";
import PhashGrid from "@/components/phash-grid";
import { useReducedMotion } from "@/components/reveal";
import { useToast } from "@/components/toast";
import { isBackendConnected, verifyFile, type VerificationResult } from "@/lib/api";
import { delay } from "@/lib/demo";
import { scanDemo } from "@/lib/demo-registry";
import { computeDHash } from "@/lib/hash";
import { cn } from "@/lib/utils";

const MAX_SIZE = 10 * 1024 * 1024;

type State =
  | { kind: "idle" }
  | { kind: "preview"; file: File; url: string }
  | { kind: "verifying"; file: File; url: string }
  | { kind: "done"; result: VerificationResult; file: File; url: string }
  | { kind: "error"; message: string; file: File | null; url: string | null };

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"
    />
  );
}

function CountUp({ value, duration = 700 }: { value: number; duration?: number }) {
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (reduced) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      setDisplay(Math.round(p * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration, reduced]);

  return <span>{display}</span>;
}

export default function VerifyPage() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const reduced = useReducedMotion();
  const toast = useToast();
  const [dragOver, setDragOver] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });

  const acceptFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setState({ kind: "error", message: "Only image files are supported.", file: null, url: null });
      toast({ variant: "error", title: "Unsupported file", message: "Only images are supported." });
      return;
    }
    if (file.size > MAX_SIZE) {
      setState({ kind: "error", message: "File is larger than 10MB.", file: null, url: null });
      toast({ variant: "error", title: "File too large", message: "Keep it under 10MB." });
      return;
    }
    setState({ kind: "preview", file, url: URL.createObjectURL(file) });
  }, [toast]);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) acceptFile(file);
    },
    [acceptFile],
  );

  const runVerify = useCallback(async () => {
    if (state.kind !== "preview") return;
    const { file, url } = state;
    setState({ kind: "verifying", file, url });
    try {
      let result: VerificationResult;
      if (!isBackendConnected()) {
        await delay(500);
        const phash = await computeDHash(file);
        result = scanDemo(phash);
      } else {
        result = await verifyFile(file);
      }
      setState({ kind: "done", result, file, url });
      if (result.verified) {
        toast({
          variant: "success",
          title: "Verified",
          message: `Traces to agent #${result.agent_id_onchain}.`,
        });
      } else {
        toast({ variant: "info", title: "No match", message: "No registered content matched." });
      }
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Verification failed.",
        file,
        url,
      });
      toast({
        variant: "error",
        title: "Verification failed",
        message: err instanceof Error ? err.message : "Try again.",
      });
    }
  }, [state, toast]);

  function clearFile() {
    if (
      state.kind === "preview" ||
      state.kind === "verifying" ||
      state.kind === "done" ||
      state.kind === "error"
    ) {
      URL.revokeObjectURL(state.url ?? "");
    }
    setState({ kind: "idle" });
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-28 md:pt-36">
      <h1 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
        Check a file&apos;s origin.
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
        Drop any image, including a re-encoded, cropped, or compressed copy. Fealty computes
        its perceptual hash and scans the registry for the agent that made it.
      </p>

      {!isBackendConnected() ? (
        <div className="mt-8 flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2.5 text-sm text-goldbright">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
          Backend not connected: the result below is a simulated demo.
        </div>
      ) : null}

      <div className="mt-10 rounded-3xl border border-line bg-surface p-8">
        {state.kind === "idle" || state.kind === "error" ? (
          <label
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={cn(
              "flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-10 text-center transition-colors",
              dragOver ? "border-gold bg-gold/5" : "border-line hover:border-gold/60",
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) acceptFile(file);
              }}
            />
            <span
              aria-hidden="true"
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full border border-line transition-transform duration-200",
                dragOver ? "-translate-y-1" : "",
              )}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 16V4M7 9l5-5 5 5" />
                <path d="M4 17v2a1 1 0 001 1h14a1 1 0 001-1v-2" />
              </svg>
            </span>
            <p className="mt-4 text-sm font-medium text-ink">
              Drop an image here, or click to browse
            </p>
            <p className="mt-1 text-xs text-muted">Image only, up to 10MB</p>
          </label>
        ) : null}

        {state.kind === "preview" || state.kind === "verifying" ? (
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.url}
                alt="Uploaded file preview"
                className="max-h-80 w-full object-contain bg-surface2"
              />
              {state.kind === "verifying" ? (
                <div className="scan-line" aria-hidden="true" />
              ) : null}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="truncate text-sm text-muted">{state.file.name}</p>
              <button
                type="button"
                onClick={clearFile}
                disabled={state.kind === "verifying"}
                className="shrink-0 text-xs font-medium text-muted underline underline-offset-2 transition-colors hover:text-goldbright disabled:pointer-events-none disabled:opacity-50"
              >
                Remove
              </button>
            </div>
            <button
              type="button"
              onClick={runVerify}
              disabled={state.kind === "verifying"}
              className="btn-sheen mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95 disabled:pointer-events-none disabled:opacity-70"
            >
              {state.kind === "verifying" ? (
                <>
                  <Spinner /> Verifying…
                </>
              ) : (
                "Verify this file"
              )}
            </button>
          </div>
        ) : null}

        {state.kind === "error" ? (
          <div>
            {state.url ? (
              <div className="overflow-hidden rounded-2xl border border-line">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={state.url}
                  alt="Uploaded file preview"
                  className="max-h-80 w-full object-contain bg-surface2"
                />
              </div>
            ) : null}
            <p role="alert" className="mt-5 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm text-ink">
              {state.message}
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  state.file
                    ? setState({ kind: "preview", file: state.file, url: state.url ?? "" })
                    : setState({ kind: "idle" })
                }
                className="btn-sheen inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
              >
                Try again
              </button>
              <button
                type="button"
                onClick={clearFile}
                className="btn-ring inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-ink transition-colors hover:text-goldbright"
              >
                Choose another file
              </button>
            </div>
          </div>
        ) : null}

        {state.kind === "done" ? (
          <div className="text-center">
            <motion.div
              initial={reduced ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className="mx-auto w-28"
            >
              <FingerprintSeal />
            </motion.div>

            {!isBackendConnected() ? (
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="mt-4 flex justify-center"
              >
                <DemoBadge label="Demo result" />
              </motion.div>
            ) : null}

            {state.result.verified ? (
              <>
                <motion.h2
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6 font-display text-3xl font-black uppercase tracking-tight text-ink"
                >
                  Verified.
                </motion.h2>
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted"
                >
                  This file traces back to agent{" "}
                  <span className="font-mono text-goldbright">#{state.result.agent_id_onchain}</span>{" "}
                  content{" "}
                  <span className="font-mono text-goldbright">#{state.result.content_id_onchain}</span>,
                  Hamming distance{" "}
                  <span className="font-mono text-goldbright">
                    <CountUp value={state.result.hamming_distance ?? 0} />
                  </span>
                  .
                </motion.p>
              </>
            ) : (
              <>
                <motion.h2
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="mt-6 font-display text-3xl font-black uppercase tracking-tight text-ink"
                >
                  No match.
                </motion.h2>
                <motion.p
                  initial={reduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted"
                >
                  No registered content matches this file closely enough.
                </motion.p>
              </>
            )}

            <motion.div
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mx-auto mt-6 max-w-xs rounded-xl border border-line bg-surface2 p-4 text-left"
            >
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted">
                perceptual hash
              </p>
              <PhashGrid seed={2} className="mt-3" />
              <p className="mt-2 font-mono text-xs text-goldbright">
                {state.result.phash ?? "n/a"}
              </p>
            </motion.div>

            <motion.button
              type="button"
              onClick={clearFile}
              initial={reduced ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="btn-sheen mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
            >
              Verify another file
            </motion.button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
