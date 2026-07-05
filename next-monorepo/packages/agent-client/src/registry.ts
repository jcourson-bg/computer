/**
 * Central registry of every eve agent in this workspace.
 *
 * Apps never hardcode agent URLs. In the browser they talk to a same-origin
 * proxy path (see `agentProxyPath`), and on the server each app resolves the
 * agent's real origin from an environment variable (see `server.ts`).
 *
 * To add an agent: scaffold it under `agents/`, add an entry here, and every
 * app in the workspace can connect to it.
 */
export interface AgentDefinition {
  /** Stable identifier. Matches the directory name under `agents/`. */
  readonly id: string;
  /** Human-facing name for pickers and headers. */
  readonly name: string;
  /** Short description shown in agent lists. */
  readonly description: string;
  /** Origin of the agent's local dev server (`eve dev`). */
  readonly devUrl: string;
}

export const agents = {
  assistant: {
    id: "assistant",
    name: "Assistant",
    description: "General-purpose workspace assistant.",
    devUrl: "http://localhost:4111",
  },
} as const satisfies Record<string, AgentDefinition>;

export type AgentId = keyof typeof agents;

export function getAgent(id: AgentId): AgentDefinition {
  return agents[id];
}

export function listAgents(): readonly AgentDefinition[] {
  return Object.values(agents);
}

export function isAgentId(value: string): value is AgentId {
  return value in agents;
}

/**
 * Same-origin path prefix an app mounts for a given agent. Browsers send all
 * eve traffic here (`<prefix>/eve/v1/...`), and the app proxies it to the
 * agent's origin — no CORS, and no agent URLs shipped to the client.
 */
export function agentProxyPath(id: AgentId): string {
  return `/api/agents/${id}`;
}
