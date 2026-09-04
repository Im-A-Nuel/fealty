"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import DemoBadge from "@/components/demo-badge";
import FingerprintSeal from "@/components/fingerprint-seal";
import PhashGrid from "@/components/phash-grid";
import { Reveal } from "@/components/reveal";
import { fetchAgent, isBackendConnected, type Agent } from "@/lib/api";
import { demoAgentFor } from "@/lib/demo";
import { mergeContent } from "@/lib/demo-registry";

type ViewState =
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "ready"; agent: Agent; demo: boolean };

function Skeleton() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      <div className="h-10 w-2/3 rounded-xl bg-surface" />
      <div className="mt-6 h-24 rounded-2xl bg-surface" />
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="h-44 rounded-2xl bg-surface" />
        <div className="h-44 rounded-2xl bg-surface" />
        <div className="h-44 rounded-2xl bg-surface" />
      </div>
    </div>
  );
}

export default function AgentProfilePage({ params }: { params: { agentId: string } }) {
  const [state, setState] = useState<ViewState>(() => {
    if (!isBackendConnected()) {
      const agent = demoAgentFor(params.agentId);
      return {
        kind: "ready",
        agent: { ...agent, content: mergeContent(agent.agent_id_onchain, agent.content) },
        demo: true,
      };
    }
    return { kind: "loading" };
  });

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    if (!isBackendConnected()) {
      const agent = demoAgentFor(params.agentId);
      setState({
        kind: "ready",
        agent: { ...agent, content: mergeContent(agent.agent_id_onchain, agent.content) },
        demo: true,
      });
      return;
    }
    try {
      const agent = await fetchAgent(params.agentId);
      setState({ kind: "ready", agent, demo: false });
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Agent lookup failed.",
      });
    }
  }, [params.agentId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-28 md:pt-36">
      <Link
        href="/agents"
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-goldbright"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M19 12H5M11 18l-6-6 6-6" />
        </svg>
        All agents
      </Link>

      {state.kind === "loading" ? <Skeleton /> : null}

      {state.kind === "error" ? (
        <div className="text-center">
          <h1 className="font-display text-3xl font-black uppercase tracking-tight text-ink">
            Agent not found.
          </h1>
          <p role="alert" className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
            {state.message}
          </p>
          <button
            type="button"
            onClick={() => void load()}
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
          >
            Retry
          </button>
        </div>
      ) : null}

      {state.kind === "ready" ? (
        <>
          <Reveal>
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-5">
                <div className="w-20 shrink-0">
                  <FingerprintSeal />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-mono text-xs text-goldbright">#{state.agent.agent_id_onchain}</p>
                    {state.demo ? <DemoBadge label="Demo data" /> : null}
                  </div>
                  <h1 className="font-display text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
                    {state.agent.display_name ?? "Unnamed agent"}
                  </h1>
                  <p className="mt-1 font-mono text-sm text-muted">{state.agent.eoa_address}</p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:items-end">
                <Link
                  href={`/agents/${state.agent.agent_id_onchain}/register`}
                  className="btn-sheen inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
                >
                  Register content
                </Link>
                <Link
                  href="/verify"
                  className="btn-ring inline-flex min-h-11 items-center justify-center rounded-full px-6 text-sm font-medium text-ink transition-colors hover:text-goldbright"
                >
                  Check a file against this agent
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal>
            <h2 className="mt-14 font-display text-2xl font-black uppercase tracking-tight text-ink">
              Verified content
            </h2>
          </Reveal>

          {state.agent.content.length === 0 ? (
            <Reveal>
              <div className="mt-6 rounded-3xl border border-line bg-surface p-10 text-center">
                <p className="font-display text-xl font-bold uppercase tracking-tight text-ink">
                  No content registered yet.
                </p>
                <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
                  Content this agent registers will show up here, each bound to a perceptual
                  hash and an onchain record.
                </p>
                <Link
                  href={`/agents/${state.agent.agent_id_onchain}/register`}
                  className="btn-sheen mt-6 inline-flex min-h-11 items-center justify-center rounded-full bg-gold px-6 text-sm font-semibold text-background transition-[box-shadow,transform] duration-200 ease-out hover:bg-goldbright active:scale-95"
                >
                  Register your first file
                </Link>
              </div>
            </Reveal>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {state.agent.content.map((item, i) => (
                <Reveal key={item.id} delay={i * 80}>
                  <div className="rounded-2xl border border-line bg-surface p-4">
                    <div className="overflow-hidden rounded-xl border border-line">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.file_url}
                        alt={`Registered content ${item.content_id_onchain}`}
                        className="aspect-square w-full object-cover bg-surface2"
                      />
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <p className="font-mono text-xs text-goldbright">content #{item.content_id_onchain}</p>
                      <span className="rounded-full bg-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background">
                        verified
                      </span>
                    </div>
                    <PhashGrid seed={item.content_id_onchain} className="mt-3" />
                    <p className="mt-3 truncate text-xs text-muted">tx {item.registered_tx_hash}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </>
      ) : null}
    </main>
  );
}