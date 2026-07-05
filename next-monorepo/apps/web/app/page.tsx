import Link from "next/link"
import { BotIcon, ChevronRightIcon } from "lucide-react"

import { listAgents } from "@workspace/agent-client"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemActions,
  ItemTitle,
} from "@workspace/ui/components/item"

export default function Page() {
  const agents = listAgents()

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-2xl flex-col gap-8 p-6 pt-16">
      <header className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold">Agents</h1>
        <p className="text-muted-foreground text-sm">
          Every agent in this workspace, available to chat.
        </p>
      </header>
      <ItemGroup>
        {agents.map((agent) => (
          <Item
            key={agent.id}
            variant="outline"
            render={<Link href={`/agents/${agent.id}`} />}
          >
            <ItemMedia variant="icon">
              <BotIcon />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{agent.name}</ItemTitle>
              <ItemDescription>{agent.description}</ItemDescription>
            </ItemContent>
            <ItemActions>
              <ChevronRightIcon className="text-muted-foreground size-4" />
            </ItemActions>
          </Item>
        ))}
      </ItemGroup>
    </main>
  )
}
