import { notFound } from "next/navigation"

import { getAgent, isAgentId, listAgents } from "@workspace/agent-client"
import { AgentChat } from "@/components/agent-chat"

export function generateStaticParams() {
  return listAgents().map((agent) => ({ agentId: agent.id }))
}

export default async function AgentPage({
  params,
}: {
  params: Promise<{ agentId: string }>
}) {
  const { agentId } = await params
  if (!isAgentId(agentId)) notFound()
  const agent = getAgent(agentId)

  return (
    <AgentChat
      agentId={agentId}
      agentName={agent.name}
      agentDescription={agent.description}
    />
  )
}
