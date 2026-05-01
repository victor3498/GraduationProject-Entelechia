//单个文档展示
import React,{useState} from "react"
import { Button } from "../ui/Buttton"
import { Tooltip } from "../ui/Tooltip/Tooltip.tsx"
import type { DocumentItem } from "./document.types.ts"
import {DeleteIcon} from "../svg/delete"
import { ShareIcon } from "../svg/share"

interface DocumentCardProps {
    document: DocumentItem;
    onOpen?: (id:number) => void;
    onStar?: (id:number) => void;
    onDelete?: (id:number) =>void;
    onShare?: (id:number) =>void;
    width?: string
    height?: string
 
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onOpen,
  onStar,
  onDelete,
  onShare,
  width = "170px",
  height = "30px",

}) => {
  const { id, title, is_starred, created_at, updated_at } = document

  const [isStar,setisStar] = useState(is_starred)
  const handleStar = ()=>{
       setisStar(!isStar)
       //这里再加上api函数
  }

  return (
    <div 
      className="flex items-center bg-white hover:bg-neutral-100 transition cursor-pointer border-b border-neutral-200 h-full last:border-b-0" 
      style={{ width }}
      onClick={() => onOpen?.(id)}
    >
      {/* star */}
      <Button
        onClick={(e) => {
          e.stopPropagation()
          onStar?.(id)
          handleStar()
        }}
        className="flex items-center justify-center w-10 h-full text-yellow-400 bg-transparent hover:bg-neutral-100 transition"
        height={30}
      >
        {isStar ? "⭐" : "☆"}
      </Button>

      {/* delete */}
      <Button
        onClick={(e) => {
          e.stopPropagation()
          onDelete?.(id)
        }}
        className="flex items-center justify-center w-10 h-full text-black bg-transparent hover:bg-red-50 transition"
        height={30}
      >
        <DeleteIcon className="size-5" />
      </Button>

      {/* share */}
      {onShare && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onShare(id)
          }}
          className="flex items-center justify-center w-10 h-full text-blue-600 bg-transparent hover:bg-blue-50 transition"
          height={30}
          title="分享文档"
        >
          <ShareIcon className="w-4 h-4" />
        </Button>
      )}

      <Tooltip
        content={
          <div>
            <div className="font-semibold mb-1">{title}</div>
            <div className="text-neutral-400">创建时间：{new Date(created_at).toLocaleString()}</div>
            <div className="text-neutral-400">更新时间：{new Date(updated_at).toLocaleString()}</div>
            <div className="text-neutral-400">ID：{id}</div>
          </div>
        }
      >
        <div
          style={{ flex: 1, minWidth: 0 }}
          className="flex items-center h-full px-3"
        >
          {/* title */}
          <span className="text-xs truncate font-medium tracking-tight font-sans whitespace-nowrap overflow-hidden text-ellipsis">
            {title}
          </span>
        </div>
      </Tooltip>
    </div>
  )
}
