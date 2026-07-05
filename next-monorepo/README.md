# next-monorepo

A Turborepo workspace where web apps talk to durable [eve](https://eve.dev) agents.

## Layout

```
agents/      eve agents, one directory each, deployed as their own services
  assistant/   general-purpose assistant with a get_current_time tool
apps/        web apps, each can connect to any agent
  web/         Next.js app with a shadcn chat UI
packages/
  agent-client/   shared connectivity layer between apps and agents
  ui/             shared shadcn/ui components
  eslint-config/  shared ESLint config
  typescript-config/  shared TypeScript config
```

## How apps connect to agents

Agents run as separate services and expose eve's HTTP channel (`/eve/v1/*`).
Apps never talk to them cross-origin; instead each app proxies every
registered agent under `/api/agents/<id>/*` (see
`packages/agent-client/src/server.ts`), and client components open sessions
by agent id with `useAgent("<id>")` from `@workspace/agent-client/react`.

Adding a new agent or a new app only requires a registry entry — see
`packages/agent-client/README.md`.

## Development

Requires Node 24 and pnpm.

```bash
pnpm install
pnpm dev          # runs the web app and the assistant agent via turbo
```

Or run them individually:

```bash
pnpm --filter assistant dev   # eve dev server on :4111
pnpm --filter web dev         # Next.js on :3000
```

The agent needs model credentials: set `AI_GATEWAY_API_KEY`
([create a key](https://vercel.com/dashboard/ai/api-keys)) or run
`eve link` inside `agents/assistant` when deploying on Vercel.

## Adding components

To add shadcn components, run from the `apps/web` directory:

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

This places ui components in `packages/ui/src/components`, importable as:

```tsx
import { Button } from "@workspace/ui/components/button";
```
