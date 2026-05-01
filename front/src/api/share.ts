import { http } from "../lib/http"
import type { ApiResponse } from "@/types/api"
import type {
  CreateShareParams,
  SaveSharedDocResult,
  SharedDocDetail,
  ShareInfo,
} from "@/types/share"
import type { JSONContent } from "@tiptap/react"

// =====================================================
// 鉴权接口（仅文档所有者）
// =====================================================

/**
 * POST /api/doc/:id/share
 * 生成或复用某文档某权限（view / edit）的分享码（幂等）。
 */
export function createShareApi(
  documentId: number,
  data: CreateShareParams
) {
  return http<ApiResponse<ShareInfo>>(`/doc/${documentId}/share`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

/**
 * GET /api/doc/:id/shares
 * 列出某文档当前生效的全部分享记录（最多两条）。
 */
export function listSharesApi(documentId: number) {
  return http<ApiResponse<ShareInfo[]>>(`/doc/${documentId}/shares`)
}

/**
 * DELETE /api/doc/:id/share/:code
 * 撤销（软删除）某条分享记录。
 */
export function revokeShareApi(documentId: number, shareCode: string) {
  return http<ApiResponse<{ revoked: boolean }>>(
    `/doc/${documentId}/share/${shareCode}`,
    { method: "DELETE" }
  )
}

// =====================================================
// 公开接口（游客可访问，无需登录）
// =====================================================

/**
 * GET /api/share/:code
 * 通过分享码取分享文档详情。
 */
export function getSharedDocApi(shareCode: string) {
  return http<ApiResponse<SharedDocDetail>>(`/share/${shareCode}`)
}

/**
 * PUT /api/share/:code/content
 * 通过分享码保存文档内容（仅 permission=edit 时允许）。
 */
export function saveSharedDocApi(
  shareCode: string,
  content: JSONContent
) {
  return http<ApiResponse<SaveSharedDocResult>>(
    `/share/${shareCode}/content`,
    {
      method: "PUT",
      body: JSON.stringify({ content }),
    }
  )
}
