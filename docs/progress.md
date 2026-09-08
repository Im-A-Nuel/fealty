# Fealty Progress

Last reviewed: 2026-09-08

## Executive Status

**Frontend demo:** ready for a guided hackathon demo.

**MVP live integration:** not complete.

**Current blocker:** the Go backend does not exist in the repository yet. The frontend
falls back to clearly labeled local demo data when `NEXT_PUBLIC_API_URL` is empty or the
network/backend is unavailable.

## Repository Status

| Area | Status | Notes |
|---|---|---|
| Next.js + Tailwind frontend | Done | App Router, responsive UI, metadata, favicon, 404 and error boundary. |
| Landing page | Done | Leonardo-inspired dark editorial UI, seal identity, parallax, coverflow stack section, premium motion. |
| Onboarding UI | Done | Passkey, derive, register, confirmation dialog, success flow, toasts and error states. |
| Mera integration | Partially live | `@category-labs/mera` is integrated in `frontend/src/lib/mera.ts`; requires browser/device validation. |
| Agent identity contract | Scaffolded/deployment metadata present | Address is recorded in `contracts/deployments.json`; compile/test/source verification still needs to be confirmed with Foundry. |
| Content provenance contract | Scaffolded/deployment metadata present | Contract and deploy metadata exist; live content registration is not wired into the frontend flow yet. |
| Go backend | Not started | No `backend/` directory currently exists. |
| PostgreSQL / Redis | Not started | No database migrations, sqlc output, API server, or Redis index currently exists. |
| Deployment | Not complete | Frontend can be deployed, but the live API and data services are still missing. |

## MVP Requirements

### FR-01: Passkey Agent Identity

**UI:** complete.

The onboarding flow now calls the Mera integration in `frontend/src/lib/mera.ts` to create a
passkey PRF output and derive an EVM address. The UI includes progress, loading, cancellation
error, retry, and reduced-motion handling.

**Still required:** verify on the target demo device/browser that the WebAuthn PRF ceremony
works reliably and that the same passkey reproduces the same address.

### FR-02: Onchain Identity Registration

**UI and client transaction path:** implemented.

The onboarding flow calls `registerAgentOnchain()`, displays the transaction state, links to
Monad Explorer, and attempts to synchronize the transaction with the API when the backend is
configured.

**Still required:** verify the deployed contract address, transaction confirmation, event
decoding, and backend synchronization on Monad testnet.

### FR-03: Content Fingerprint Registration

**UI:** complete.

The route `/agents/[agentId]/register` supports image upload, validation, client-side hashing,
hash review, confirmation, success state, and profile linking. The demo path stores a thumbnail
and record in localStorage.

**Live integration:** incomplete.

The page currently uses the local demo registry when the API is unavailable. It does not yet
restore a real Mera signing session and call `registerContentOnchain()` for a real agent. This
is the most important remaining frontend integration gap.

### FR-04: Content Verification

**UI and demo path:** complete.

The route `/verify` supports drag-and-drop, image validation, preview, scan animation, real
client-side demo hashing, Hamming matching, result reveal, phash display, retry, no-match,
offline fallback, and a live demo that re-encodes a copy at 50% / JPEG quality 50.

**Live integration:** pending backend.

When `NEXT_PUBLIC_API_URL` is configured, the page calls `POST /content/verify`. The Go API,
real pHash implementation, Redis lookup, threshold calibration, and production error contract
are not implemented yet.

### FR-05: Public Agent Profile

**UI:** complete.

The routes `/agents` and `/agents/[agentId]` include demo data, live API paths, loading,
empty, error, offline fallback, verified content cards, phash visuals, register-content CTA,
verify CTA, breadcrumb navigation, and staggered motion.

**Live integration:** pending backend.

The API currently has no implementation in this repository. The frontend expects `GET /agents`
and `GET /agents/:agent_id_onchain`.

### FR-06: Native Android Session Signer

**Status:** intentionally not started.

This remains a stretch goal and must stay blocked until FR-01 through FR-05 are live and stable.

## Demo Flow Today

The frontend can demonstrate this local flow:

1. Open onboarding and create a real Mera-derived passkey address on a compatible browser.
2. Register the identity on Monad through the deployed identity contract.
3. Open the content registration route for an agent.
4. Use a real image or the sample image flow.
5. Compute a client-side demo hash and save the demo record locally.
6. Verify the original or a re-encoded copy.
7. Show the match, Hamming distance, phash, and public profile record.

The content registration and verification steps are still **demo/local** unless the API and
real content transaction path are connected.

## Remaining Critical Work

### P0: Backend Foundation

- Create `backend/` Go module with chi router.
- Add health endpoint.
- Implement PostgreSQL schema and sqlc queries for agents, content records, and verification log.
- Implement image upload validation and Go `goimagehash` pHash computation.
- Implement Redis hash index and Hamming scan.
- Implement the API consumed by the frontend:
  - `POST /agents/register`
  - `GET /agents`
  - `GET /agents/:agent_id_onchain`
  - `POST /content/register`
  - `POST /content/verify`

### P0: Real Content Registration Flow

- Restore a Mera signing session from the passkey before content registration.
- Call `registerContentOnchain(session, agentId, phash)` from the frontend.
- Wait for transaction confirmation.
- Send the transaction hash and file metadata to `POST /content/register`.
- Replace the local demo record with the API/onchain record after confirmation.
- Preserve a clear fallback only for explicitly labeled demo mode.

### P1: Contract Verification

- Run `forge build` and `forge test` in an environment with Foundry.
- Verify both deployed contracts on the Monad block explorer.
- Confirm the deployed `ContentProvenanceRegistry` points to the deployed identity registry.
- Test owner checks, duplicate identity registration, unknown agent, and content lookup errors.

### P1: Robustness Evidence

- Test JPEG quality 80, 65, and 50.
- Test resize to 75% and 50%.
- Test crop at 90% and 80% retained area.
- Record actual Hamming distances and false-positive behavior.
- Calibrate the backend threshold from measurements, not the client demo threshold.

### P1: Demo Readiness

- Test Mera PRF on the exact device/browser used for judging.
- Test the complete live flow in under three minutes.
- Test offline recovery and backend timeout behavior against the deployed API.
- Deploy frontend to Vercel and backend/Postgres/Redis to Railway.
- Verify all contract links, API links, demo links, and explorer links publicly.
- Record the final demo and write the Metropolis submission.

## What Is Intentionally Not Done

- ERC-8004 reputation and validation registries.
- Video/audio fingerprinting.
- Multi-chain support.
- Native Android session signer.
- Production key rotation, recovery, and multi-device sync.
- Marketplace, monetization, or content moderation.

## Definition Of Done Checklist

- [ ] Mera passkey flow works on the tested judging device.
- [ ] Same passkey reproduces the same EVM address.
- [ ] Agent identity transaction confirms on Monad testnet.
- [ ] Content registration transaction confirms through Mera.
- [ ] Content registration is persisted by the Go API and Postgres.
- [ ] Verification uses Go pHash and Redis, not only client demo hashing.
- [ ] Re-encoding robustness is measured and documented.
- [x] Frontend has loading, empty, error, offline, and reduced-motion states.
- [x] Frontend has landing, onboarding, register, verify, agents, and profile flows.
- [ ] Backend is deployed and connected through `NEXT_PUBLIC_API_URL`.
- [ ] Contracts are compiled, tested, and explorer-verified.
- [ ] Final live demo is under three minutes.
- [ ] Submission write-up, video, and public links are ready.
