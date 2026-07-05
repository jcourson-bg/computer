import type { NextConfig } from "next"
import { agentRewrites } from "@workspace/agent-client/server"

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/agent-client"],
  async rewrites() {
    // Proxies every registered workspace agent under /api/agents/<id>/* so
    // browser traffic stays same-origin.
    return agentRewrites()
  },
}

export default nextConfig
