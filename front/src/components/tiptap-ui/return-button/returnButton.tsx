import { forwardRef, useCallback } from "react"

// --- Tiptap UI ---
import type { UseReturnButtonConfig } from "@/components/tiptap-ui/return-button"
import { useReturnButton } from "@/components/tiptap-ui/return-button"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"

export interface ReturnButtonProps
  extends Omit<ButtonProps, "type">,
    UseReturnButtonConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
}

/**
 * Button component for returning in a Tiptap editor.
 *
 * For custom button implementations, use the `useReturnButton` hook instead.
 */
export const ReturnButton = forwardRef<
  HTMLButtonElement,
  ReturnButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const {
      isVisible,
      canReturn,
      isActive,
      handleReturn,
      label,
      Icon,
    } = useReturnButton({
      editor,
      hideWhenUnavailable,
    })

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleReturn()
      },
      [handleReturn, onClick]
    )

    if (!isVisible) {
      return null
    }

    return (
      <Button
        type="button"
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        role="button"
        tabIndex={-1}
        disabled={!canReturn}
        data-disabled={!canReturn}
        aria-label={label}
        aria-pressed={isActive}
        tooltip={label}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
          </>
        )}
      </Button>
    )
  }
)

ReturnButton.displayName = "ReturnButton"
