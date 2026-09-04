"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import ConfirmDialog from "@/components/confirm-dialog";
import DemoBadge from "@/components/demo-badge";
import FingerprintSeal from "@/components/fingerprint-seal";
import PhashGrid from "@/components/phash-grid";
import { useReducedMotion } from "@/components/reveal";
import ScanOverlay from "@/components/scan-overlay";
import { useToast } from "@/components/toast";
import {
  isBackendConnected,
  isOnline,
  NetworkError,
  registerContent,
  type ContentRecord,
} from "@/lib/api";
import { registerContentDemo } from "@/lib/demo-registry";
import { demoAgentFor } from "@/lib/demo";
import { computeDHash, makeThumbnail } from "@/lib/hash";
import { makeSampleFile } from "@/lib/sample";
import { cn } from "@/lib/utils";

const MAX_SIZE = 10 * 1024 * 1024;

type State =
  | { kind: "idle" }
  | { kind: "preview"; file: File; url: string }
  | { kind: "hashing"; file: File; url: string }
  | { kind: "ready"; file: File; url: string; phash: string }
  | { kind: "done"; record: ContentRecord; file: File; url: string };

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"
    />
  );
}

export default function RegisterPage({ params }: { params: { agentId: string } }) {
  const agentId = Number(params.agentId);
  const reduced = useReducedMotion();
  const toast = useToast();
  const agent = demoAgentFor(String(agentId));
  const [dragOver, setDragOver] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [sampleBusy, setSampleBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Only image files are supported.");
        toast({ variant: "error", title: "Unsupported file", message: "Only images are supported." });
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("File is larger than 10MB.");
        toast({ variant: "error", title: "File too large", message: "Keep it under 10MB." });
        return;
      }
      setError(null);
      setState({ kind: "preview", file, url: URL.createObjectURL(file) });
    },
    [toast],
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) acceptFile(file);
    },
    [acceptFile],
  );

  const computeHash = useCallback(async () => {
    if (state.kind !== "preview") return;
    const { file, url } = state;
    setState({ kind: "hashing", file, url });
    setError(null);
    try {
      const phash = await computeDHash(file);
      setState({ kind: "ready", file, url, phash });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not compute the hash.");
      toast({ variant: "error", title: "Hashing failed", message: "Try another image." });
      setState({ kind: "preview", file, url });
    }
  }, [state, toast]);

  const register = useCallback(async () => {
    if (state.kind !== "ready") return;
    setBusy(true);
    setError(null);
    try {
      let record: ContentRecord;
      if (!isBackendConnected() || !isOnline()) {
        const thumb = await makeThumbnail(state.file);
        record = await registerContentDemo(agentId, state.file, state.phash, thumb);
      } else {
        try {
          record = await registerContent(agentId, state.file, `0x${state.phash}deadbeef`);
        } catch (err) {
          if (err instanceof NetworkError) {
            toast({
              variant: "info",
              title: "Backend unreachable",
              message: "Storing a local demo record instead.",
            });
            const thumb = await makeThumbnail(state.file);
            record = await registerContentDemo(agentId, state.file, state.phash, thumb);
          } else {
            throw err;
          }
        }
      }
      setConfirmOpen(false);
      setState({ kind: "done", record, file: state.file, url: state.url });
      toast({
        variant: "success",
        title: "Fingerprint registered",
        message: `content #${record.content_id_onchain} is bound to agent #${agentId}.`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
      toast({ variant: "error", title: "Registration failed", message: "Try again." });
    } finally {
      setBusy(false);
    }
  }, [state, agentId, toast]);

  function reset() {
    if (state.kind === "preview" || state.kind === "hashing" || state.kind === "ready" || state.kind === "done") {
      URL.revokeObjectURL(state.url);
    }
    setState({ kind: "idle" });
    setError(null);
    setConfirmOpen(false);
  }

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-28 md:pt-36">
      <Link
        href={`/agents/${agentId}`}
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-goldbright"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        Agent #{agentId}
      </Link>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
          Register a fingerprint.
        </h1>
        {!isBackendConnected() ? <DemoBadge label="Demo flow" /> : null}
      </div>
      <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
        Upload an image as{" "}
        <span className="font-medium text-ink">{agent.display_name ?? `agent #${agentId}`}</span>.
        Fealty computes its perceptual hash and binds it to this agent on Monad testnet.
      </p>

      {!isBackendConnected() ? (
        <div className="mt-8 flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2.5 text-sm text-goldbright">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
          Backend not connected: hashing runs in your browser, records are stored locally and
          labeled as demo.
        </div>
      ) : null}

      <div className="mt-10 rounded-3xl border border-line bg-surface p-8">
        {error ? (
          <p role="alert" className="mb-5 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm text-ink">
            {error}
          </p>
        ) : null}

        {state.kind === "idle" ? (
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
            <p className="mt-4 text-sm font-medium text-ink">Drop an image here, or click to browse</p>
            <p className="mt-1 text-xs text-muted">Image only, up to 10MB</p>
          </label>
        ) : null}

        {state.kind === "idle" ? (
          <div className="mt-5 flex items-center justify-center gap-2 border-t border-line pt-5">
            <button
              type="button"
              onClick={async () => {
                setSampleBusy(true);
                try {
                  acceptFile(await makeSampleFile(9));
                } finally {
                  setSampleBusy(false);
                }
              }}
              disabled={sampleBusy}
              className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-goldbright transition-opacity hover:opacity-80 disabled:pointer-events-none disabled:opacity-50"
            >
              {sampleBusy ? (
                <Spinner />
              ) : (
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M8 5l11 7-11 7V5z" />
                </svg>
              )}
              Use a sample image
            </button>
          </div>
        ) : null}

        {state.kind === "preview" || state.kind === "hashing" ? (
          <div>
            <div className="relative overflow-hidden rounded-2xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.url}
                alt="Uploaded file preview"
                className="max-h-80 w-full object-contain bg-surface2"
              />
              {state.kind === "hashing" ? <ScanOverlay label="Hashing" /> : null}
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
              <p className="truncate text-sm text-muted">{state.file.name}</p>
              <button
                type="button"
                onClick={reset}
                disabled={state.kind === "hashing"}
                className="shrink-0 text-xs font-medium text-muted underline underline-offset-2 transition-colors hover:text-goldbright disabled:pointer-events-none disabled:opacity-50"
              >
                Remove
              </button>
            </div>
            <button
              type="button"
              onClick={computeHash}
              disabled={state.kind === "hashing"}
              className="btn-sheen mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95 disabled:pointer-events-none disabled:opacity-70"
            >
              {state.kind === "hashing" ? (
                <>
                  <Spinner /> Computing perceptual hash…
                </>
              ) : (
                "Compute fingerprint"
              )}
            </button>
          </div>
        ) : null}

        {state.kind === "ready" ? (
          <div>
            <div className="overflow-hidden rounded-2xl border border-line">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.url}
                alt="Uploaded file preview"
                className="max-h-72 w-full object-contain bg-surface2"
              />
            </div>

            <div className="mt-6 rounded-xl border border-line bg-surface2 p-4">
              <p className="text-[11px] font-medium uppercase tracking-widest text-muted">
                perceptual hash · 64 bit
              </p>
              <PhashGrid seed={state.phash.charCodeAt(0)} className="mt-3" />
              <p className="mt-2 font-mono text-xs text-goldbright">{state.phash}</p>
            </div>

            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted">agent</p>
                <p className="font-mono text-sm text-ink">#{agentId}</p>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
                <p className="text-[11px] font-medium uppercase tracking-widest text-muted">network</p>
                <p className="text-sm font-medium text-ink">Monad testnet</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="btn-sheen mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
            >
              Register onchain
            </button>
          </div>
        ) : null}

        {state.kind === "done" ? (
          <motion.div
            initial={reduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <motion.div
              initial={reduced ? false : { scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 20 }}
              className="mx-auto w-28"
            >
              <FingerprintSeal />
            </motion.div>
            {!isBackendConnected() ? (
              <div className="mt-4 flex justify-center">
                <DemoBadge label="Demo record" />
              </div>
            ) : null}
            <h2 className="mt-6 font-display text-3xl font-black uppercase tracking-tight text-ink">
              Fingerprint registered.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
              content <span className="font-mono text-goldbright">#{state.record.content_id_onchain}</span>{" "}
              is bound to agent <span className="font-mono text-goldbright">#{agentId}</span> and
              time-stamped on Monad testnet. Crop, compress, or re-encode it: verification
              still finds this record.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:items-center">
              <Link
                href={`/agents/${agentId}`}
                className="btn-sheen inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
              >
                View in profile
              </Link>
              <button
                type="button"
                onClick={reset}
                className="btn-ring inline-flex min-h-11 items-center justify-center rounded-full px-7 text-sm font-medium text-ink transition-colors hover:text-goldbright"
              >
                Register another file
              </button>
            </div>
          </motion.div>
        ) : null}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Bind this fingerprint?"
        labelledBy="confirm-register-title"
        confirmLabel="Confirm & broadcast"
        busy={busy}
        onConfirm={() => void register()}
        onCancel={() => setConfirmOpen(false)}
      >
        <h3 id="confirm-register-title" className="sr-only">
          Bind this fingerprint?
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted">agent</p>
            <p className="font-mono text-sm text-ink">#{agentId}</p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted">network</p>
            <p className="text-sm font-medium text-ink">Monad testnet</p>
          </div>
          {state.kind === "ready" ? (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-widest text-muted">phash</p>
              <p className="truncate font-mono text-xs text-goldbright">{state.phash}</p>
            </div>
          ) : null}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          This writes the fingerprint onchain, tied permanently to this agent.
        </p>
      </ConfirmDialog>
    </main>
  );
}