"use client"

import { useCallback, useEffect, useState } from "react"
import type { Editor } from "@tiptap/react"

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { ReturnIcon } from "@/components/component/svg/return"

/**
 * Configuration for the return button functionality
 */
export interface UseReturnButtonConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
}

/**
 * Checks if return button should be available in the current editor state
 */
export function canReturn(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return true
}

/**
 * Determines if the return button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false

  if (hideWhenUnavailable) {
    return canReturn(editor)
  }

  return true
}

/**
 * Custom hook that provides return button functionality for Tiptap editor
 */
export function useReturnButton(config?: UseReturnButtonConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canReturnContent = canReturn(editor)
  const isActive = false // Return button doesn't have an active state

  useEffect(() => {
    if (!editor) return

    const handleSelectionUpdate = () => {
      setIsVisible(shouldShowButton({ editor, hideWhenUnavailable }))
    }

    handleSelectionUpdate()

    editor.on("selectionUpdate", handleSelectionUpdate)

    return () => {
      editor.off("selectionUpdate", handleSelectionUpdate)
    }
  }, [editor, hideWhenUnavailable])

  const handleReturn = useCallback(() => {
    if (!editor) return false
    return true
  }, [editor])

  return {
    isVisible,
    isActive,
    handleReturn,
    canReturn: canReturnContent,
    label: "Return",
    Icon: ReturnIcon,
  }
}
