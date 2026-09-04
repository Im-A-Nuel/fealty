import type { Agent, ContentRecord, VerificationResult } from "./api";
import { demoAgents } from "./demo";
import { hammingDistance } from "./hash";

const KEY = "fealty-demo-content-v1";
const COUNTER_KEY = "fealty-demo-content-counter-v1";
export const VERIFY_THRESHOLD = 12;

type Stored = ContentRecord & { agentId: number };

function read(): Stored[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Stored[]) : [];
  } catch {
    return [];
  }
}

function write(items: Stored[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items));
  } catch {
    // localStorage full or unavailable; keep session-only behavior
  }
}

function nextContentId(): number {
  const current = Number(window.localStorage.getItem(COUNTER_KEY) ?? "900");
  window.localStorage.setItem(COUNTER_KEY, String(current + 1));
  return current;
}

export async function registerContentDemo(
  agentId: number,
  file: File,
  phash: string,
  fileUrl: string,
): Promise<ContentRecord> {
  const contentId = nextContentId();
  const record: Stored = {
    id: `demo-reg-${contentId}`,
    content_id_onchain: contentId,
    phash,
    file_url: fileUrl,
    registered_tx_hash: `0x${contentId.toString(16).padStart(8, "0")}deadbeef`,
    created_at: new Date().toISOString(),
    agentId,
  };
  write([...read(), record]);
  return record;
}

export function demoContentForAgent(agentId: number): ContentRecord[] {
  return read().filter((r) => r.agentId === agentId);
}

export function mergeContent(agentId: number, base: ContentRecord[]): ContentRecord[] {
  const registered = demoContentForAgent(agentId);
  const merged = [...registered, ...base];
  return merged.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  );
}

export function demoAgentCards(): Agent[] {
  return demoAgents.map((agent) => ({
    ...agent,
    content: mergeContent(agent.agent_id_onchain, agent.content),
  }));
}

export function demoScanSet(): { agentId: number; contentId: number; phash: string }[] {
  const staticRecs = demoAgents.flatMap((a) =>
    a.content.map((c) => ({
      agentId: a.agent_id_onchain,
      contentId: c.content_id_onchain,
      phash: c.phash,
    })),
  );
  const registered = read().map((r) => ({
    agentId: r.agentId,
    contentId: r.content_id_onchain,
    phash: r.phash,
  }));
  return [...registered, ...staticRecs];
}

export function scanDemo(phash: string): VerificationResult {
  let best: { agentId: number; contentId: number; phash: string; dist: number } | null = null;
  for (const rec of demoScanSet()) {
    const dist = hammingDistance(phash, rec.phash);
    if (!best || dist < best.dist) {
      best = { agentId: rec.agentId, contentId: rec.contentId, phash: rec.phash, dist };
    }
  }
  if (best && best.dist <= VERIFY_THRESHOLD) {
    return {
      verified: true,
      agent_id_onchain: best.agentId,
      content_id_onchain: best.contentId,
      hamming_distance: best.dist,
      phash,
    };
  }
  return { verified: false, phash };
}