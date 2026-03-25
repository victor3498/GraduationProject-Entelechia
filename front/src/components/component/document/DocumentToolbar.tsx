import { useState } from "react"
// import type { docItem } from "@/types/doc"
import type { searchDocType } from "@/types/doc"

import { ArrowsUpDown } from "../svg/arrows-up-down"
import { DocSearchIcon } from "../svg/docSearch"
import { StarIcon } from "../svg/star"

import { Button } from "../ui/Buttton"
import { Input } from "../ui/Input"

import { searchDocApi } from "@/api/document"

export interface searchDocParams {
  keyword?: string
  isStarred?: boolean
}

interface DocToolbarProps {
  width?: number | string
  height?: number | string

  // 把搜索后的数据传给父组件
  onSearch?: (list: searchDocType[]) => void
}

export default function DocToolbar({
  width = 400,
  height = 40,
  onSearch,
}: DocToolbarProps) {
  const [keyword, setKeyword] = useState("")
  const [isStarred, setIsStarred] = useState(false)
  const [sortType, setSortType] = useState<"latest" | "oldest">("latest")
  const [loading, setLoading] = useState(false)

  // 执行搜索
  const handleSearch = async () => {
    try {
      setLoading(true)

      const res = await searchDocApi({
        keyword,
        isStarred,
      })

      const list = res.data?.searched_list|| []

      // 排序逻辑
      const sortedList = [...list].sort((a, b) => {
        if (sortType === "latest") {
          return (
            new Date(b.updated_at).getTime() -
            new Date(a.updated_at).getTime()
          )
        } else {
          return (
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
          )
        }
      })

      onSearch?.(sortedList)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{ width, height ,gap:3}}
      className="flex items-center "
    >
      {/* 输入搜索关键词 */}
      <Input
        placeholder="搜索文档名..."
        width={175}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        height={height}
      />

      {/* 是否只显示星标 */}
      <Button
        width={25}
        height={40}
        variant={isStarred ? "primary" : "secondary"}
        onClick={() => setIsStarred(!isStarred)}
      >
        <StarIcon />
      </Button>

      {/* 执行搜索 */}
      <Button 
        variant="secondary"
        width={25}
        height={40}
        onClick={handleSearch} >
        <DocSearchIcon />
      </Button>

      {/* 排序切换 */}
      <Button
        width={25}
        height={40}
        variant="secondary"
        onClick={() =>
          setSortType(sortType === "latest" ? "oldest" : "latest")
        }
      >
        <ArrowsUpDown />
      </Button>
    </div>
  )
}