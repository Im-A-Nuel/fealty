import Link from "next/link";
import DemoBadge from "@/components/demo-badge";
import FingerprintSeal from "@/components/fingerprint-seal";
import { isBackendConnected } from "@/lib/api";
import { demoAgents } from "@/lib/demo";

export default function AgentsPage() {
  const demo = !isBackendConnected();

  return (
    <main className="mx-auto max-w-4xl px-6 pb-24 pt-28 md:pt-36">
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

      {demo ? (
        <div className="mt-8 flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-2.5 text-sm text-goldbright">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-gold" />
          Backend not connected: the agents below are labeled demo records.
        </div>
      ) : null}

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {demoAgents.map((agent) => (
          <Link
            key={agent.id}
            href={`/agents/${agent.agent_id_onchain}`}
            className="group flex flex-col rounded-3xl border border-line bg-surface p-6 transition-colors duration-200 hover:border-gold/60"
          >
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
              {agent.display_name}
            </h2>
            <p className="mt-2 truncate font-mono text-xs text-muted">{agent.eoa_address}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}