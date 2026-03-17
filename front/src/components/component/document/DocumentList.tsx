//文档列表展示
import React from "react"
import { DocumentCard} from "./DocumentItem"
import { type DocumentList,type DocumentItem } from "./document.types"

interface DocumentListProps{
    documents:DocumentItem[]
    width?:string
    itemHeight?:string
    onOpen?: (id: number) => void
    onStar?: (id: number) => void
    onDelete?: (id: number) => void
}

export const DocList: React.FC<DocumentListProps>=({
     documents,
     width="170px",
     itemHeight="30px",
     onOpen,
     onStar,
     onDelete,
}) =>{
   
    if(documents.length ===0)
    {
        return(
            <div
             style={{width}}
             className="text-xs text-neutral-400 text-center py-4"
             >
              暂无文档
            </div>
        )
    }

    return(
        <div
        style={{width}}
        className="flex
        flex-col
        gap-1"
        >
         {documents.map((doc) => (
        <DocumentCard
          key={doc.id}
          document={doc}
          width={width}
          height={itemHeight}
          onOpen={onOpen}
          onStar={onStar}
          onDelete={onDelete}
        />
      ))}
        </div>
    )
}