//以下调用全附带Auth-Bearer Token,是accessToken

import type { JSONContent } from "@tiptap/react"
//http://localhost:3000/api/doc  POST
export interface createDocParams {
    title: string
}

export interface createDocResult {
    id: number,
    title: string,
    is_starred: boolean,
    created_at: string
}


//http://localhost:3000/api/doc/{id}  DELETE
//路径参数id
//删除文件



//http://localhost:3000/api/doc/{id}/title PATCH
//路径参数id
export interface renameDocParams {
    title: string
}

export interface renameDocResult {
    id: number,
    title: string,
    updated_at: string
}

//http://localhost:3000/api/doc/{id}/content PUT
//路径参数id
export interface saveDocParams {
      content: unknown
}

export interface saveDocResult {
    id: number,
    update_at: string
}

//http://localhost:3000/api/doc/search?{keyword}&?{isStarred} GET
//示例：/api/doc/search?keyword=项目&isStarred=true
export type searchDocType={
    id:number,
    title: string,
    is_starred: boolean,
    created_at: string,
    updated_at: string
}

export interface searchDocResult{
   searched_list:searchDocType[]
}

//http://localhost:3000/api/doc/{id} GET
export interface getDocDetail{
    id: number,
    title: string,
    content: JSONContent,
    is_starred: boolean,
    created_at: string,
    updated_at: string
}

export type docItem={
    id: number,
    title: string,
    content: JSONContent,
    is_starred: boolean,
    created_at: string,
    updated_at: string
}

//http://localhost:3000/api/doc GET
export interface getDocListResult{
  list:docItem[]
}

//http://localhost:3000/api/doc/{id}/star PATCH
export interface starParams{
    isStarred: boolean
} 

export interface starResult{
    id: number,
    is_starred: boolean,
    updated_at: string
}