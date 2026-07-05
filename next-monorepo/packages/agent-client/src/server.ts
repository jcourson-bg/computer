import { agents, agentProxyPath, type AgentId } from "./registry";

/**
 * Resolves the origin an app's server should forward agent traffic to.
 *
 * Deployed environments set `AGENT_<ID>_URL` (e.g. `AGENT_ASSISTANT_URL`) per
 * app; local dev falls back to the agent's `eve dev` port from the registry.
 */
export function agentOrigin(id: AgentId): string {
  const envKey = `AGENT_${id.toUpperCase().replaceAll("-", "_")}_URL`;
  return process.env[envKey] ?? agents[id].devUrl;
}

interface Rewrite {
  readonly source: string;
  readonly destination: string;
}

/**
 * Next.js rewrites that proxy each registered agent under its same-origin
 * path. Spread into `rewrites()` in `next.config.ts`:
 *
 * ```ts
 * const nextConfig: NextConfig = {
 *   async rewrites() {
 *     return agentRewrites();
 *   },
 * };
 * ```
 */
export function agentRewrites(): Rewrite[] {
  return (Object.keys(agents) as AgentId[]).map((id) => ({
    source: `${agentProxyPath(id)}/:path*`,
    destination: `${agentOrigin(id)}/:path*`,
  }));
}
