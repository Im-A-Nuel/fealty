"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ConfirmDialog from "@/components/confirm-dialog";
import FingerprintSeal from "@/components/fingerprint-seal";
import { useReducedMotion } from "@/components/reveal";
import { useToast } from "@/components/toast";
import { delay } from "@/lib/demo";
import { cn } from "@/lib/utils";

type Step = "passkey" | "derive" | "register" | "done";

const steps: { id: Step; label: string }[] = [
  { id: "passkey", label: "Passkey" },
  { id: "derive", label: "Derive" },
  { id: "register", label: "Register" },
];

const DEMO_EOA = "0x7a1e…d4f9";
const DEMO_AGENT_ID = 42;

const stepMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -16 },
  transition: { duration: 0.28, ease: "easeOut" as const },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.92, y: 8 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

function Spinner() {
  return (
    <span
      aria-hidden="true"
      className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"
    />
  );
}

function BackIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

function StepActions({
  onBack,
  backDisabled = false,
  children,
}: {
  onBack?: () => void;
  backDisabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-8 flex items-center justify-between gap-4 border-t border-line pt-6">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          disabled={backDisabled}
          className="btn-ring inline-flex min-h-11 items-center gap-1.5 rounded-full px-5 text-sm font-medium text-ink transition-colors hover:text-goldbright disabled:pointer-events-none disabled:opacity-50"
        >
          <BackIcon />
          Back
        </button>
      ) : (
        <span aria-hidden="true" />
      )}
      {children}
    </div>
  );
}

export default function OnboardingPage() {
  const reduced = useReducedMotion();
  const toast = useToast();
  const [step, setStep] = useState<Step>("passkey");
  const [busy, setBusy] = useState(false);
  const [deriving, setDeriving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [eoa, setEoa] = useState<string | null>(null);

  async function createPasskey() {
    // TODO(FR-01): replace with the Mera SDK call. WebAuthn PRF passkey
    // creation derives the EOA client-side; no seed phrase, no backend keys.
    setBusy(true);
    setError(null);
    try {
      await delay(900);
      setEoa(DEMO_EOA);
      setStep("derive");
      setDeriving(true);
      await delay(900);
      setDeriving(false);
      toast({
        variant: "success",
        title: "Passkey created",
        message: "Address derived from your passkey.",
      });
    } catch {
      setError("Passkey creation was cancelled or failed. Try again.");
      toast({ variant: "error", title: "Passkey creation failed", message: "Try again." });
    } finally {
      setBusy(false);
    }
  }

  async function registerIdentity() {
    // TODO(FR-01): sign and submit the AgentIdentityRegistry.register() tx via
    // Mera, then POST /agents/register with the tx hash.
    setBusy(true);
    setError(null);
    try {
      await delay(1100);
      setStep("done");
      toast({
        variant: "success",
        title: "Identity registered",
        message: `Agent #${DEMO_AGENT_ID} is now on Monad testnet.`,
      });
    } catch {
      setError("Registration failed. The transaction did not confirm.");
      toast({ variant: "error", title: "Registration failed", message: "Try again." });
    } finally {
      setBusy(false);
    }
  }

  function goBack() {
    setError(null);
    if (step === "register") setStep("derive");
    else if (step === "derive") setStep("passkey");
  }

  function reset() {
    setStep("passkey");
    setEoa(null);
    setError(null);
    setDeriving(false);
  }

  const stepIndex = step === "done" ? steps.length : steps.findIndex((s) => s.id === step);

  return (
    <main className="mx-auto max-w-2xl px-6 pb-24 pt-28 md:pt-36">
      <h1 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
        Claim your agent&apos;s identity.
      </h1>
      <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">
        A passkey is the key. Fealty turns it into a self-custodial Monad address with Mera.
        No seed phrase, nothing to write down.
      </p>

      <div className="mt-8 flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2.5 text-sm text-goldbright">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
        Demo mode: the passkey service and backend are not connected yet. Values below are
        labeled placeholders.
      </div>

      <div className="mt-10">
        <div className="flex items-center gap-3" role="list" aria-label="Registration steps">
          {steps.map((s, i) => (
            <div key={s.id} className="flex flex-1 items-center gap-3">
              <span
                aria-current={step === s.id ? "step" : undefined}
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors duration-300",
                  i <= stepIndex
                    ? "border-gold bg-gold text-background"
                    : "border-line text-muted",
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-widest",
                  i <= stepIndex ? "text-ink" : "text-muted",
                )}
              >
                {s.label}
              </span>
              {i < steps.length - 1 ? (
                <span aria-hidden="true" className="h-px flex-1 bg-line" />
              ) : null}
            </div>
          ))}
        </div>
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-line">
          <motion.div
            className="h-full rounded-full bg-gold"
            animate={{ width: `${(stepIndex / steps.length) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-line bg-surface p-8">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            {...(reduced ? { initial: false, exit: undefined } : stepMotion)}
          >
            {step === "passkey" ? (
              <div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-ink">
                  Create the passkey
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Your device will ask you to confirm (Face ID, fingerprint, or PIN). That
                  confirmation is the only secret: Fealty derives the address from it and
                  never stores a key.
                </p>

                {error ? (
                  <p role="alert" className="mt-5 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm text-ink">
                    {error}
                  </p>
                ) : null}

                <StepActions>
                  <button
                    type="button"
                    onClick={createPasskey}
                    disabled={busy}
                    className="btn-sheen inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95 disabled:pointer-events-none disabled:opacity-70"
                  >
                    {busy ? (
                      <>
                        <Spinner /> Waiting for your device…
                      </>
                    ) : (
                      "Create passkey"
                    )}
                  </button>
                </StepActions>
              </div>
            ) : null}

            {step === "derive" ? (
              <div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-ink">
                  Your derived address
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  The same passkey always derives the same address, on any device, every
                  time. That is the identity: yours to hold, no seed phrase to guard.
                </p>

                {deriving ? (
                  <div
                    role="status"
                    className="mt-6 flex items-center gap-3 rounded-xl border border-line bg-surface2 px-4 py-4"
                  >
                    <Spinner />
                    <span className="text-sm text-muted">
                      Deriving address from your passkey…
                    </span>
                  </div>
                ) : (
                  <div className="mt-6 rounded-xl border border-line bg-surface2 px-4 py-4">
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-[11px] font-medium uppercase tracking-widest text-muted">
                        EOA address
                      </p>
                      <span className="shrink-0 rounded-full border border-gold/30 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-goldbright">
                        demo
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-sm text-goldbright">{eoa}</p>
                  </div>
                )}

                <StepActions onBack={goBack} backDisabled={busy}>
                  {deriving ? null : (
                    <button
                      type="button"
                      onClick={() => setStep("register")}
                      className="btn-sheen inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
                    >
                      Continue
                    </button>
                  )}
                </StepActions>
              </div>
            ) : null}

            {step === "register" ? (
              <div>
                <h2 className="font-display text-2xl font-black uppercase tracking-tight text-ink">
                  Register on Monad
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  One transaction mints your agent identity in AgentIdentityRegistry,
                  time-stamped and public on Monad testnet.
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-muted">
                      address
                    </p>
                    <p className="font-mono text-sm text-ink">{eoa}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-muted">
                      network
                    </p>
                    <p className="text-sm font-medium text-ink">Monad testnet</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
                    <p className="text-[11px] font-medium uppercase tracking-widest text-muted">
                      agentId
                    </p>
                    <p className="font-mono text-sm text-goldbright">{DEMO_AGENT_ID}</p>
                  </div>
                </div>

                {error ? (
                  <p role="alert" className="mt-5 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm text-ink">
                    {error}
                  </p>
                ) : null}

                <StepActions onBack={goBack} backDisabled={busy}>
                  <button
                    type="button"
                    onClick={() => setConfirmOpen(true)}
                    disabled={busy}
                    className="btn-sheen inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95 disabled:pointer-events-none disabled:opacity-70"
                  >
                    {busy ? (
                      <>
                        <Spinner /> Broadcasting…
                      </>
                    ) : (
                      "Register identity"
                    )}
                  </button>
                </StepActions>
              </div>
            ) : null}

            {step === "done" ? (
              <motion.div
                className="text-center"
                variants={container}
                initial={reduced ? false : "hidden"}
                animate="show"
              >
                <motion.div variants={item} className="mx-auto w-36">
                  <FingerprintSeal />
                </motion.div>
                <motion.h2
                  variants={item}
                  className="mt-6 font-display text-3xl font-black uppercase tracking-tight text-ink"
                >
                  Identity claimed.
                </motion.h2>
                <motion.p
                  variants={item}
                  className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted"
                >
                  Agent <span className="font-mono text-goldbright">#{DEMO_AGENT_ID}</span> is
                  registered on Monad testnet. Content it registers will trace back to this
                  identity.
                </motion.p>
                <motion.div
                  variants={item}
                  className="mt-8 flex flex-col justify-center gap-3 sm:flex-row sm:items-center"
                >
                  <Link
                    href={`/agents/${DEMO_AGENT_ID}`}
                    className="btn-sheen inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
                  >
                    View agent profile
                  </Link>
                  <button
                    type="button"
                    onClick={reset}
                    className="btn-ring inline-flex min-h-11 items-center justify-center rounded-full px-7 text-sm font-medium text-ink transition-colors hover:text-goldbright"
                  >
                    Start over
                  </button>
                </motion.div>
              </motion.div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Broadcast registration?"
        labelledBy="confirm-register-title"
        confirmLabel="Confirm & broadcast"
        busy={busy}
        onConfirm={() => {
          setConfirmOpen(false);
          void registerIdentity();
        }}
        onCancel={() => setConfirmOpen(false)}
      >
        <h3 id="confirm-register-title" className="sr-only">
          Broadcast registration?
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted">address</p>
            <p className="font-mono text-sm text-ink">{eoa}</p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted">network</p>
            <p className="text-sm font-medium text-ink">Monad testnet</p>
          </div>
          <div className="flex items-center justify-between gap-4 rounded-xl border border-line bg-surface2 px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-widest text-muted">agentId</p>
            <p className="font-mono text-sm text-goldbright">{DEMO_AGENT_ID}</p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          This mints the agent identity onchain. The transaction cannot be undone.
        </p>
      </ConfirmDialog>
    </main>
  );
}
