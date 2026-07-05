"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeftIcon,
  ArrowUpIcon,
  RotateCcwIcon,
  WrenchIcon,
} from "lucide-react"

import { useAgent } from "@workspace/agent-client/react"
import type {
  AgentId,
  EveMessage,
  EveMessagePart,
} from "@workspace/agent-client/react"
import { Button } from "@workspace/ui/components/button"
import { Bubble, BubbleContent } from "@workspace/ui/components/bubble"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@workspace/ui/components/input-group"
import {
  Message,
  MessageContent,
} from "@workspace/ui/components/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@workspace/ui/components/message-scroller"
import { Spinner } from "@workspace/ui/components/spinner"

export function AgentChat({
  agentId,
  agentName,
  agentDescription,
}: {
  agentId: AgentId
  agentName: string
  agentDescription: string
}) {
  const agent = useAgent(agentId)
  const isBusy = agent.status === "submitted" || agent.status === "streaming"

  return (
    <div className="mx-auto flex h-svh w-full max-w-2xl flex-col">
      <ChatHeader
        name={agentName}
        description={agentDescription}
        onReset={agent.reset}
      />
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1">
          <MessageScrollerViewport>
            <MessageScrollerContent className="px-4 py-6">
              {agent.data.messages.length === 0 ? (
                <EmptyState name={agentName} />
              ) : (
                agent.data.messages.map((message) => (
                  <MessageScrollerItem
                    key={message.id}
                    scrollAnchor={message.role === "user"}
                  >
                    <ChatMessage message={message} />
                  </MessageScrollerItem>
                ))
              )}
              {agent.status === "submitted" && (
                <MessageScrollerItem>
                  <span className="shimmer text-muted-foreground text-sm">
                    Thinking…
                  </span>
                </MessageScrollerItem>
              )}
              {agent.status === "error" && agent.error && (
                <MessageScrollerItem>
                  <p className="text-destructive text-sm">
                    {agent.error.message}
                  </p>
                </MessageScrollerItem>
              )}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <ChatComposer
        disabled={isBusy}
        onSend={(text) => void agent.send({ message: text })}
      />
    </div>
  )
}

function ChatHeader({
  name,
  description,
  onReset,
}: {
  name: string
  description: string
  onReset: () => void
}) {
  return (
    <header className="flex items-center gap-3 border-b px-4 py-3">
      <Button variant="ghost" size="icon-sm" render={<Link href="/" />}>
        <ArrowLeftIcon />
        <span className="sr-only">All agents</span>
      </Button>
      <div className="flex min-w-0 flex-1 flex-col">
        <h1 className="truncate text-sm font-medium">{name}</h1>
        <p className="text-muted-foreground truncate text-xs">{description}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onReset}>
        <RotateCcwIcon />
        New chat
      </Button>
    </header>
  )
}

function EmptyState({ name }: { name: string }) {
  return (
    <div className="text-muted-foreground flex flex-1 flex-col items-center justify-center gap-1 text-center text-sm">
      <p className="text-foreground font-medium">{name}</p>
      <p>Send a message to start the conversation.</p>
    </div>
  )
}

function ChatMessage({ message }: { message: EveMessage }) {
  const align = message.role === "user" ? "end" : "start"

  return (
    <Message align={align}>
      <MessageContent>
        {message.parts.map((part, index) => (
          <MessagePart key={index} part={part} align={align} />
        ))}
      </MessageContent>
    </Message>
  )
}

function MessagePart({
  part,
  align,
}: {
  part: EveMessagePart
  align: "start" | "end"
}) {
  if (part.type === "text" && part.text.length > 0) {
    return (
      <Bubble align={align} variant={align === "end" ? "default" : "muted"}>
        <BubbleContent className="whitespace-pre-wrap">
          {part.text}
        </BubbleContent>
      </Bubble>
    )
  }

  if (part.type === "dynamic-tool") {
    const isRunning =
      part.state === "input-streaming" || part.state === "input-available"
    return (
      <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
        {isRunning ? <Spinner className="size-3" /> : <WrenchIcon className="size-3" />}
        {part.toolName}
      </span>
    )
  }

  return null
}

function ChatComposer({
  disabled,
  onSend,
}: {
  disabled: boolean
  onSend: (text: string) => void
}) {
  const [text, setText] = React.useState("")
  const canSend = !disabled && text.trim().length > 0

  const submit = () => {
    const message = text.trim()
    if (message.length === 0 || disabled) return
    onSend(message)
    setText("")
  }

  return (
    <form
      className="border-t p-4"
      onSubmit={(event) => {
        event.preventDefault()
        submit()
      }}
    >
      <InputGroup>
        <InputGroupTextarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault()
              submit()
            }
          }}
          placeholder="Send a message…"
          rows={1}
          autoFocus
        />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            type="submit"
            variant="default"
            size="icon-sm"
            disabled={!canSend}
          >
            <ArrowUpIcon />
            <span className="sr-only">Send</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </form>
  )
}
