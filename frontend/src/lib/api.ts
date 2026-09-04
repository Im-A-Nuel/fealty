export const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";
export const API_TIMEOUT_MS = 8000;

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export class NetworkError extends Error {
  constructor(message = "Could not reach the Fealty service.") {
    super(message);
    this.name = "NetworkError";
  }
}

export function isOnline(): boolean {
  return typeof navigator === "undefined" ? true : navigator.onLine;
}

async function fetchJson<T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  try {
    const res = await fetch(input, { ...init, signal: controller.signal });
    if (!res.ok) throw new HttpError(res.status, `HTTP ${res.status}`);
    return (await res.json()) as T;
  } catch (err) {
    if (err instanceof HttpError) throw err;
    throw new NetworkError();
  } finally {
    clearTimeout(timer);
  }
}

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
  phash?: string;
};

export function isBackendConnected(): boolean {
  return API_BASE.length > 0;
}

export async function fetchAgent(agentId: string): Promise<Agent> {
  return fetchJson<Agent>(`${API_BASE}/agents/${agentId}`);
}

export async function fetchAgents(): Promise<Agent[]> {
  return fetchJson<Agent[]>(`${API_BASE}/agents`);
}

export async function verifyFile(file: File): Promise<VerificationResult> {
  const form = new FormData();
  form.append("file", file);
  return fetchJson<VerificationResult>(`${API_BASE}/content/verify`, {
    method: "POST",
    body: form,
  });
}

export async function registerContent(
  agentId: number,
  file: File,
  txHash: string,
): Promise<ContentRecord> {
  const form = new FormData();
  form.append("file", file);
  form.append("agent_id_onchain", String(agentId));
  form.append("tx_hash", txHash);
  return fetchJson<ContentRecord>(`${API_BASE}/content/register`, {
    method: "POST",
    body: form,
  });
}