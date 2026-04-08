import { forwardRef, useCallback } from "react"

// --- Tiptap UI ---
import type { UseContentSaveConfig } from "@/components/tiptap-ui/contentsave-button"
import { useContentSave } from "@/components/tiptap-ui/contentsave-button"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- UI Primitives ---
import type { ButtonProps } from "@/components/tiptap-ui-primitive/button"
import { Button } from "@/components/tiptap-ui-primitive/button"

export interface ContentSaveButtonProps
  extends Omit<ButtonProps, "type">,
    UseContentSaveConfig {
  /**
   * Optional text to display alongside the icon.
   */
  text?: string
}

/**
 * Button component for saving content in a Tiptap editor.
 *
 * For custom button implementations, use the `useContentSave` hook instead.
 */
export const ContentSaveButton = forwardRef<
  HTMLButtonElement,
  ContentSaveButtonProps
>(
  (
    {
      editor: providedEditor,
      text,
      hideWhenUnavailable = false,
      onSaved,
      onClick,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor)
    const {
      isVisible,
      canSave,
      isActive,
      handleSave,
      label,
      Icon,
    } = useContentSave({
      editor,
      hideWhenUnavailable,
      onSaved,
    })

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (event.defaultPrevented) return
        handleSave()
      },
      [handleSave, onClick]
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
        disabled={!canSave}
        data-disabled={!canSave}
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

ContentSaveButton.displayName = "ContentSaveButton"
