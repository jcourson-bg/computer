"use client";

import { useEveAgent, type UseEveAgentOptions } from "eve/react";
import type { EveMessageData } from "eve/react";

import { agentProxyPath, type AgentId } from "./registry";

export type { AgentId } from "./registry";
export type {
  EveDynamicToolPart,
  EveMessage,
  EveMessageData,
  EveMessagePart,
  UseEveAgentHelpers,
  UseEveAgentStatus,
} from "eve/react";

export interface UseAgentOptions
  extends Omit<UseEveAgentOptions<EveMessageData>, "host"> {}

/**
 * Opens a durable chat session with a workspace agent through the app's
 * same-origin proxy. A thin wrapper over eve's `useEveAgent` that resolves
 * the host from the agent registry, so components only name an agent id.
 */
export function useAgent(agentId: AgentId, options?: UseAgentOptions) {
  return useEveAgent({ ...options, host: agentProxyPath(agentId) });
}
