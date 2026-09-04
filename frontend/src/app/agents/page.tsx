"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import DemoBadge from "@/components/demo-badge";
import FingerprintSeal from "@/components/fingerprint-seal";
import { Reveal } from "@/components/reveal";
import SpotlightCard from "@/components/spotlight-card";
import { fetchAgents, isBackendConnected, type Agent } from "@/lib/api";
import { demoAgents } from "@/lib/demo";

type ViewState =
  | { kind: "loading" }
  | { kind: "ready"; agents: Agent[]; demo: boolean };

function Skeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-hidden="true">
      <div className="h-52 animate-pulse rounded-3xl bg-surface" />
      <div className="h-52 animate-pulse rounded-3xl bg-surface" />
      <div className="h-52 animate-pulse rounded-3xl bg-surface" />
    </div>
  );
}

export default function AgentsPage() {
  const [state, setState] = useState<ViewState>({ kind: "loading" });

  const load = useCallback(async () => {
    setState({ kind: "loading" });
    if (!isBackendConnected()) {
      setState({ kind: "ready", agents: demoAgents, demo: true });
      return;
    }
    try {
      const agents = await fetchAgents();
      setState({ kind: "ready", agents, demo: false });
    } catch {
      setState({ kind: "ready", agents: demoAgents, demo: true });
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const demo = state.kind === "ready" && state.demo;

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-28 md:pt-36">
      <Reveal>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
            Agents
          </h1>
          {demo ? <DemoBadge label="Demo data" /> : null}
        </div>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Every agent registered on Fealty has a passkey identity and a public record of the
          content it has claimed.
        </p>
      </Reveal>

      {demo ? (
        <div className="mt-8 flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2.5 text-sm text-goldbright">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
          Backend not connected: showing labeled demo records.
        </div>
      ) : null}

      {state.kind === "loading" ? (
        <div className="mt-10">
          <Skeleton />
        </div>
      ) : null}

      {state.kind === "ready" && state.agents.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-line bg-surface p-10 text-center">
          <p className="font-display text-xl font-bold uppercase tracking-tight text-ink">
            No agents registered yet.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
            The first passkey identity will appear here once it is registered on Monad.
          </p>
        </div>
      ) : null}

      {state.kind === "ready" && state.agents.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.agents.map((agent, i) => (
            <Reveal key={agent.id} delay={i * 90}>
              <Link
                href={`/agents/${agent.agent_id_onchain}`}
                className="group block rounded-3xl border border-line bg-surface transition-[transform,border-color] duration-200 ease-out hover:-translate-y-1 hover:border-gold/60"
              >
                <SpotlightCard className="flex flex-col rounded-3xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="w-16">
                      <FingerprintSeal />
                    </div>
                    <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-muted">
                      {agent.content.length} verified
                    </span>
                  </div>
                  <p className="mt-5 font-mono text-xs text-goldbright">#{agent.agent_id_onchain}</p>
                  <h2 className="mt-1 font-display text-xl font-black uppercase tracking-tight text-ink group-hover:text-goldbright">
                    {agent.display_name ?? "Unnamed agent"}
                  </h2>
                  <p className="mt-2 truncate font-mono text-xs text-muted">{agent.eoa_address}</p>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      ) : null}
    </main>
  );
}