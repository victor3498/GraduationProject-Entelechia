//文档列表展示
import React from "react"
import { DocumentCard } from "./DocumentItem"
import { type DocumentItem } from "./document.types"

interface DocumentListProps {
  documents: DocumentItem[]
  width?: string
  itemHeight?: string
  onOpen?: (id: number) => void
  onStar?: (id: number) => void
  onDelete?: (id: number) => void
}

export const DocList: React.FC<DocumentListProps> = ({
  documents,
  width = "250px",
  itemHeight = "30px",
  onOpen,
  onStar,
  onDelete,
}) => {
  // 处理文档打开
  const handleOpen = (id: number) => {
    onOpen?.(id)
  }

  // 处理文档星标
  const handleStar = (id: number) => {
    onStar?.(id)
  }

  // 处理文档删除
  const handleDelete = (id: number) => {
    onDelete?.(id)
  }

  if (documents.length === 0) {
    return (
      <div
        style={{ width }}
        className="text-xs text-neutral-400 text-center py-8 px-4 bg-white rounded-md border border-neutral-200 shadow-sm"
      >
        <div className="mb-2">📄</div>
        暂无文档
      </div>
    )
  }

  return (
    <div
      style={{ width }}
      className="flex flex-col bg-white rounded-md border border-neutral-200 shadow-sm overflow-hidden"
    >
      {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          width={width}
          height={itemHeight}
          onOpen={handleOpen}
          onStar={handleStar}
          onDelete={handleDelete}
        />
      ))}
    </div>
  )
}