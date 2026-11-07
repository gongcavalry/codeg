"use client"

import { ArrowDown, ArrowDownToLine, ArrowUp } from "lucide-react"
import { useTranslations } from "next-intl"
import { useCallback, type ReactNode } from "react"
import { useStickToBottomContext } from "use-stick-to-bottom"

import { Button } from "@/components/ui/button"
import { useChatAnimationsEnabled } from "@/hooks/use-appearance"
import { cn } from "@/lib/utils"

/** The user-turn row just above `anchor`, and the one just below it.
 *  `anchor` is the thread index at the top of the viewport. A row that IS a
 *  user turn is not its own neighbor: up leaves it, down leaves it. */
export function userPromptNeighbors(
  userIndexes: readonly number[],
  anchor: number
): { previous: number | null; next: number | null } {
  let previous: number | null = null
  let next: number | null = null
  for (const index of userIndexes) {
    if (index < anchor) previous = index
    else if (index > anchor) {
      next = index
      break
    }
  }
  return { previous, next }
}

interface UserPromptRailProps {
  previousIndex: number | null
  nextIndex: number | null
  onJump: (threadIndex: number) => void
}

/**
 * Three buttons on the trailing edge of the transcript: the previous thing
 * the user typed, the next one, and the bottom of the thread. Thinking and
 * replies stay expanded, so the transcript is too long to scan by hand.
 */
export function UserPromptRail({
  previousIndex,
  nextIndex,
  onJump,
}: UserPromptRailProps) {
  const t = useTranslations("Folder.chat.messageList")
  const { isAtBottom, scrollToBottom } = useStickToBottomContext()
  const chatAnimations = useChatAnimationsEnabled()

  const goBottom = useCallback(() => {
    scrollToBottom(chatAnimations ? undefined : { animation: "instant" })
  }, [scrollToBottom, chatAnimations])

  return (
    // BC patch v3: centered at the bottom of the transcript, right above the
    // live-turn stats bar (the "26s · N token" strip) — that's where the eyes
    // and mouse already are. bottom-1 keeps it clear of the rare
    // "load background activity" pill at bottom-4.
    <div className="pointer-events-none absolute bottom-1 left-1/2 z-20 flex -translate-x-1/2 flex-row gap-1.5">
      <RailButton
        label={t("promptRailPrevious")}
        disabled={previousIndex == null}
        onClick={() => {
          if (previousIndex != null) onJump(previousIndex)
        }}
      >
        <ArrowUp className="size-4" />
      </RailButton>
      <RailButton
        label={t("promptRailNext")}
        disabled={nextIndex == null}
        onClick={() => {
          if (nextIndex != null) onJump(nextIndex)
        }}
      >
        <ArrowDown className="size-4" />
      </RailButton>
      <RailButton
        label={t("promptRailBottom")}
        disabled={isAtBottom}
        onClick={goBottom}
      >
        <ArrowDownToLine className="size-4" />
      </RailButton>
    </div>
  )
}

function RailButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      title={label}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "pointer-events-auto size-8 rounded-full bg-background/90 shadow-sm hover:bg-muted/90",
        disabled && "opacity-40"
      )}
    >
      {children}
    </Button>
  )
}
