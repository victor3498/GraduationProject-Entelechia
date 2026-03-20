import {http} from "../lib/http"
import type { ApiResponse } from "@/types/api"
import type { createDocParams, createDocResult, renameDocParams, renameDocResult, saveDocParams, saveDocResult, searchDocResult, getDocDetail, getDocListResult, starParams, starResult } from "@/types/doc"

export function createDocApi(data: createDocParams) {
  return http<ApiResponse<createDocResult>>("/doc", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export function deleteDocApi(id: number) {
  return http<ApiResponse<null>>(`/doc/${id}`, {
    method: "DELETE",
  })
}

export function renameDocApi(
  id: number,
  data: renameDocParams
) {
  return http<ApiResponse<renameDocResult>>(
    `/doc/${id}/title`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  )
}

export function saveDocApi(
  id: number,
  data: saveDocParams
) {
  return http<ApiResponse<saveDocResult>>(
    `/doc/${id}/content`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  )
}

export interface searchDocParams {
  keyword?: string
  isStarred?: boolean
}

export function searchDocApi(params: searchDocParams) {
  const query = new URLSearchParams({
    ...(params.keyword && { keyword: params.keyword }),
    ...(params.isStarred !== undefined && {
      isStarred: String(params.isStarred),
    }),
  }).toString()

  return http<ApiResponse<searchDocResult>>(
    `/doc/search?${query}`
  )
}

export function getDocDetailApi(id: number) {
  return http<ApiResponse<getDocDetail>>(
    `/doc/${id}`
  )
}

export function getDocListApi() {
  return http<ApiResponse<getDocListResult>>(
    "/doc"
  )
}

export function starDocApi(
  id: number,
  data: starParams
) {
  return http<ApiResponse<starResult>>(
    `/doc/${id}/star`,
    {
      method: "PATCH",
      body: JSON.stringify(data),
    }
  )
}