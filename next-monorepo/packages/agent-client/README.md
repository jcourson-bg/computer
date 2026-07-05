# @workspace/agent-client

Shared connectivity layer between apps (`apps/*`) and eve agents (`agents/*`).

## The model

- Every agent lives in `agents/<id>` and exposes eve's HTTP channel
  (`/eve/v1/*`) on its own origin.
- Every app proxies each agent under a same-origin path,
  `/api/agents/<id>/*`, so the browser never crosses a CORS boundary and
  agent URLs stay server-side configuration.
- Components connect by agent id, not URL.

## Usage

Register the proxy in an app's `next.config.ts`:

```ts
import { agentRewrites } from "@workspace/agent-client/server";

const nextConfig: NextConfig = {
  async rewrites() {
    return agentRewrites();
  },
};
```

Chat with an agent from a client component:

```tsx
"use client";
import { useAgent } from "@workspace/agent-client/react";

const agent = useAgent("assistant");
await agent.send({ message: "Hello" });
```

## Adding an agent

1. Scaffold it: `npx eve init agents/<id>` (from the workspace root).
2. Give it a unique dev port in its `dev` script (`eve dev --port <port>`).
3. Add an entry to `src/registry.ts` with that dev URL.
4. In deployed environments, point apps at it with `AGENT_<ID>_URL`.
