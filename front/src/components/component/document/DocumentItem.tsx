//单个文档展示
import React,{useState} from "react"
import { Button } from "../ui/Buttton"
import { Tooltip } from "../ui/Tooltip/Tooltip.tsx"
import type { DocumentItem } from "./document.types.ts"

interface DocumentCardProps {
    document: DocumentItem;
    onOpen?: (id:number) => void;
    onStar?: (id:number) => void;
    onDelete?: (id:number) =>void;
    width?: string
    height?: string
 
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  document,
  onOpen,
  onStar,
  onDelete,
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
    <div>
{/* star */}
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onStar?.(id)
            handleStar()
          }}
          
         
          className="
           flex
            items-center
            justify-center
            w-7
            h-full
            text-yellow-400
          "

          height={30}
        >
          {isStar ? "⭐" : "☆"}
        </Button>

        <Tooltip
      content={
        <div>
          <div className="font-semibold mb-1">{title}</div>

          <div className="text-neutral-400">
            创建时间：{new Date(created_at).toLocaleString()}
          </div>

          <div className="text-neutral-400">
            更新时间：{new Date(updated_at).toLocaleString()}
          </div>

          <div className="text-neutral-400">
            ID：{id}
          </div>
        </div>
      }
    >
      <div
       style={{ width, height }}
        onClick={() => onOpen?.(id)}
        className="
         group
          flex
          items-center
          bg-white
          hover:bg-neutral-100
          text-black
          rounded-md
          transition
          cursor-pointer
          border
          border-neutral-200
          overflow-hidden
        "
      >
        

        {/* title */}
        <span className="flex-1
            px-1
            text-xs
            truncate
            font-medium
            tracking-tight
            font-sans">
          {title}
        </span>

        
      </div>
    </Tooltip>

        {/* delete */}
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(id)
          }}
          className="flex
            items-center
            justify-center
            w-7
            h-full
            opacity-60
            transition"

            height={30}
        >
          🗑
        </Button>

    </div>

  )
}