"use client"

import { useCallback, useEffect, useState } from "react"
import type { Editor } from "@tiptap/react"

// --- Hooks --- 
import { useTiptapEditor } from "@/hooks/use-tiptap-editor"

// --- Icons ---
import { SaveIcon } from "@/components/component/svg/save"

/**
 * Configuration for the content save functionality
 */
export interface UseContentSaveConfig {
  /**
   * The Tiptap editor instance.
   */
  editor?: Editor | null
  /**
   * Whether the button should hide when save is not available.
   * @default false
   */
  hideWhenUnavailable?: boolean
  /**
   * Callback function called after a successful save.
   */
  onSaved?: () => void
}

/**
 * Checks if save can be performed in the current editor state
 */
export function canSaveContent(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  return true
}

/**
 * Saves the content of the editor
 */
export function saveContent(editor: Editor | null): boolean {
  if (!editor || !editor.isEditable) return false
  if (!canSaveContent(editor)) return false

  try {
    // Here you would implement the actual save logic
    // For now, we'll just return true as a placeholder
    return true
  } catch {
    return false
  }
}

/**
 * Determines if the save button should be shown
 */
export function shouldShowButton(props: {
  editor: Editor | null
  hideWhenUnavailable: boolean
}): boolean {
  const { editor, hideWhenUnavailable } = props

  if (!editor || !editor.isEditable) return false

  if (hideWhenUnavailable) {
    return canSaveContent(editor)
  }

  return true
}

/**
 * Custom hook that provides content save functionality for Tiptap editor
 */
export function useContentSave(config?: UseContentSaveConfig) {
  const {
    editor: providedEditor,
    hideWhenUnavailable = false,
    onSaved,
  } = config || {}

  const { editor } = useTiptapEditor(providedEditor)
  const [isVisible, setIsVisible] = useState<boolean>(true)
  const canSave = canSaveContent(editor)
  const isActive = false // Save button doesn't have an active state

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

  const handleSave = useCallback(() => {
    if (!editor) return false

    const success = saveContent(editor)
    if (success) {
      onSaved?.()
    }
    return success
  }, [editor, onSaved])

  return {
    isVisible,
    isActive,
    handleSave,
    canSave,
    label: "Save",
    Icon: SaveIcon,
  }
}