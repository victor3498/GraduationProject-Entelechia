//单个文档展示
import React from "react"
import { Button } from "../ui/Buttton"
import { Tooltip } from "../ui/Tooltip/Tooltip.tsx"
import type { DocumentItem } from "./document.types.ts"

interface DocumentItemProps {
    document: DocumentItem
    onOpen?: (id:number) => void
    onStar?: (id:number) => void
    onDelete?: (id:number) =>void
}

export const DocumentCard: React.FC<DocumentItemProps> = ({
  document,
  onOpen,
  onStar,
  onDelete,
}) => {
  const { id, title, is_starred,created_at,updated_at } = document

  return (
    <div
      onClick={() => onOpen?.(id)}
      className="
        flex items-center justify-between
        bg-neutral-800
        hover:bg-neutral-700
        px-3 py-2
        rounded
        cursor-pointer
      "
    >
      {/* Star */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onStar?.(id)
        }}
        className="text-yellow-400"
      >
        {is_starred ? "⭐" : "☆"}
      </button>

      {/* Title */}
      <span className="flex-1 px-2 text-sm truncate">
        {title}
      </span>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.(id)
        }}
        className="text-red-400"
      >
        🗑
      </button>
    </div>
  )
}