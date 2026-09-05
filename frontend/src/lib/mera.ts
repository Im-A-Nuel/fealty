import {
  createPasskeyWithPrfOutput,
  createSecp256k1SigningSession,
  getEvmAddress,
  getPasskeyPrfOutput,
} from "@category-labs/mera";
import { HDKey } from "@scure/bip32";
import { entropyToMnemonic, mnemonicToSeedSync } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";
import {
  createPublicClient,
  createWalletClient,
  encodeFunctionData,
  http,
  type Hash,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { deployments } from "./contracts";

const RP_ID =
  typeof window !== "undefined" ? window.location.hostname : "localhost";

const RP_NAME = "Fealty";

export const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  nativeCurrency: { name: "MON", symbol: "MON", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
  },
} as const;

const IDENTITY_ABI = [
  {
    name: "register",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [],
    outputs: [{ name: "agentId", type: "uint256" }],
  },
] as const;

const PROVENANCE_ABI = [
  {
    name: "registerContent",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "agentId", type: "uint256" },
      { name: "phash", type: "bytes8" },
    ],
    outputs: [{ name: "contentId", type: "uint256" }],
  },
] as const;

function deriveNodeFromPrf(prfOutput: Uint8Array): HDKey {
  const mnemonic = entropyToMnemonic(prfOutput, wordlist);
  const seed = mnemonicToSeedSync(mnemonic);
  return HDKey.fromMasterSeed(seed).derive("m/44'/60'/0'/0/0");
}

export type MeraSession = {
  address: `0x${string}`;
  signAndSendTx: (to: `0x${string}`, data: `0x${string}`) => Promise<Hash>;
  end: () => void;
};

function buildSession(privateKey: Uint8Array): MeraSession {
  const signingSession = createSecp256k1SigningSession({ privateKey });
  const address = getEvmAddress(signingSession.publicKey) as `0x${string}`;

  const account = privateKeyToAccount(
    `0x${Buffer.from(privateKey).toString("hex")}` as `0x${string}`,
  );

  const walletClient = createWalletClient({
    account,
    chain: monadTestnet,
    transport: http("https://testnet-rpc.monad.xyz"),
  });

  const publicClient = createPublicClient({
    chain: monadTestnet,
    transport: http("https://testnet-rpc.monad.xyz"),
  });

  return {
    address,
    async signAndSendTx(to, data) {
      const nonce = await publicClient.getTransactionCount({ address });
      const gasPrice = await publicClient.getGasPrice();
      const hash = await walletClient.sendTransaction({
        to,
        data,
        nonce,
        gasPrice,
        gas: BigInt(300_000),
      });
      return hash;
    },
    end() {
      signingSession.end();
    },
  };
}

/// Create a brand-new passkey and derive an EVM session from it.
export async function createPasskeySession(userLabel: string): Promise<MeraSession> {
  const { prfOutput } = await createPasskeyWithPrfOutput({
    rp: { id: RP_ID, name: RP_NAME },
    user: { name: userLabel, displayName: userLabel },
  });
  const node = deriveNodeFromPrf(prfOutput);
  return buildSession(node.privateKey!);
}

/// Sign back in with an existing passkey and restore the session.
export async function restorePasskeySession(): Promise<MeraSession> {
  const { prfOutput } = await getPasskeyPrfOutput({ rpId: RP_ID });
  const node = deriveNodeFromPrf(prfOutput);
  return buildSession(node.privateKey!);
}

/// Register the derived EOA into AgentIdentityRegistry on Monad testnet.
export async function registerAgentOnchain(session: MeraSession): Promise<Hash> {
  const data = encodeFunctionData({ abi: IDENTITY_ABI, functionName: "register" });
  return session.signAndSendTx(
    deployments.AgentIdentityRegistry as `0x${string}`,
    data,
  );
}

/// Register a perceptual hash into ContentProvenanceRegistry on Monad testnet.
/// phashHex: 16-char hex string (64-bit / 8 bytes), e.g. "a1b2c3d4e5f60718"
export async function registerContentOnchain(
  session: MeraSession,
  agentId: number,
  phashHex: string,
): Promise<Hash> {
  const phashBytes = `0x${phashHex.padEnd(16, "0").slice(0, 16)}` as `0x${string}`;
  const data = encodeFunctionData({
    abi: PROVENANCE_ABI,
    functionName: "registerContent",
    args: [BigInt(agentId), phashBytes as `0x${string}`],
  });
  return session.signAndSendTx(
    deployments.ContentProvenanceRegistry as `0x${string}`,
    data,
  );
}
