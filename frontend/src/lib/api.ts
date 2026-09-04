export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

export type ContentRecord = {
  id: string;
  content_id_onchain: number;
  phash: string;
  file_url: string;
  registered_tx_hash: string;
  created_at: string;
};

export type Agent = {
  id: string;
  agent_id_onchain: number;
  eoa_address: string;
  display_name: string | null;
  content: ContentRecord[];
};

export type VerificationResult = {
  verified: boolean;
  agent_id_onchain?: number;
  content_id_onchain?: number;
  hamming_distance?: number;
};

export function isBackendConnected(): boolean {
  return API_BASE.length > 0;
}

export async function fetchAgent(agentId: string): Promise<Agent> {
  const res = await fetch(`${API_BASE}/agents/${agentId}`);
  if (!res.ok) throw new Error(`Agent lookup failed: HTTP ${res.status}`);
  return res.json();
}

export async function verifyFile(file: File): Promise<VerificationResult> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch(`${API_BASE}/content/verify`, { method: "POST", body: form });
  if (!res.ok) throw new Error(`Verification failed: HTTP ${res.status}`);
  return res.json();
}