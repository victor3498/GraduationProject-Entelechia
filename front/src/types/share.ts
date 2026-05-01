import type { JSONContent } from "@tiptap/react"

export type SharePermission = "view" | "edit"

/**
 * 后端 POST /api/doc/:id/share 请求体
 */
export interface CreateShareParams {
  permission: SharePermission
}

/**
 * 后端 POST /api/doc/:id/share、GET /api/doc/:id/shares 单条返回结构
 */
export interface ShareInfo {
  shareCode: string
  permission: SharePermission
  createdAt: string
}

/**
 * 后端 GET /api/share/:code 返回结构
 */
export interface SharedDocDetail {
  docId: number
  title: string
  content: JSONContent
  isStarred: boolean
  createdAt: string
  updatedAt: string
  permission: SharePermission
  shareCode: string
}

/**
 * 后端 PUT /api/share/:code/content 返回结构
 */
export interface SaveSharedDocResult {
  docId: number
  updatedAt: string
}
