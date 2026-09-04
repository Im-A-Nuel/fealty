import type { Agent, ContentRecord, VerificationResult } from "./api";

function demoImage(seed: number): string {
  const r1 = 40 + ((seed * 17) % 120);
  const r2 = 90 + ((seed * 23) % 140);
  const cx1 = 180 + ((seed * 53) % 260);
  const cy1 = 160 + ((seed * 41) % 240);
  const cx2 = 400 - ((seed * 47) % 220);
  const cy2 = 380 - ((seed * 37) % 220);
  const q1 = 150 + ((seed * 61) % 300);
  const a1 = 18 + (seed % 20);
  const a2 = 12 + (seed % 16);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'>
<rect width='600' height='600' fill='#0e0c08'/>
<circle cx='${cx1}' cy='${cy1}' r='${r1}' fill='rgba(201,162,39,0.${a1})'/>
<circle cx='${cx2}' cy='${cy2}' r='${r2}' fill='rgba(230,195,79,0.${a2})'/>
<path d='M0 ${300 + (seed % 120)} Q${q1} ${180 + ((seed * 37) % 200)} 300 ${300 + ((seed * 53) % 80)} T600 ${240 + ((seed * 29) % 160)}' stroke='rgba(230,195,79,0.35)' stroke-width='2' fill='none'/>
<circle cx='300' cy='300' r='80' fill='none' stroke='rgba(201,162,39,0.5)' stroke-width='2'/>
</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function demoContent(count: number, baseId: number, seed: number): ContentRecord[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `demo-${baseId}-${i}`,
    content_id_onchain: baseId + i,
    phash: `8f3a${(seed + i * 7).toString(16).padStart(3, "0")}c21d`,
    file_url: demoImage(seed + i),
    registered_tx_hash: `0x${(seed + i).toString(16).padStart(8, "0")}ab12c0de`,
    created_at: new Date(Date.UTC(2026, 7, 20 - i, 14, 2)).toISOString(),
  }));
}

export const demoAgents: Agent[] = [
  {
    id: "demo-42",
    agent_id_onchain: 42,
    eoa_address: "0x7a1e…d4f9",
    display_name: "Demo Agent 01",
    content: demoContent(4, 456, 1),
  },
  {
    id: "demo-7",
    agent_id_onchain: 7,
    eoa_address: "0x2b4f…a10c",
    display_name: "Demo Agent 02",
    content: demoContent(2, 512, 5),
  },
  {
    id: "demo-128",
    agent_id_onchain: 128,
    eoa_address: "0x9c21…e77b",
    display_name: "Demo Agent 03",
    content: demoContent(5, 603, 9),
  },
];

export function demoAgentFor(agentId: string): Agent {
  const num = Number(agentId);
  const match = demoAgents.find((a) => a.agent_id_onchain === num);
  if (match) return match;
  return {
    ...demoAgents[0],
    id: `demo-${agentId}`,
    agent_id_onchain: Number.isFinite(num) ? num : demoAgents[0].agent_id_onchain,
    content: demoAgents[0].content,
  };
}

export const demoVerification: VerificationResult = {
  verified: true,
  agent_id_onchain: 42,
  content_id_onchain: 456,
  hamming_distance: 4,
};

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}