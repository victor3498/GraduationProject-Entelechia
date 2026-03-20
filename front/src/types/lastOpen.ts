export interface getLast_opened{
    lastOpenedDocId: number | null
}

export interface recordParams{
    documentId:number
}

export interface recordOpen{
    user_id:string,
    last_opened_doc_id:number
}