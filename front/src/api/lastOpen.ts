import {http} from "../lib/http"
import type { ApiResponse } from "@/types/api"
import type {getLast_opened,recordOpen,recordParams} from "../types/lastOpen"

export async function getLastOpenApi(){
    const res = await http<ApiResponse<getLast_opened>>("/user-preference/last-opened",{
        method:"GET"

    })
    return res
}

export async function recordOpenApi(data:recordParams){
   const res = await http<ApiResponse<recordOpen>>("/user-preference/last-opened",{
        method:"POST",
        body: JSON.stringify(data)
    })
    return res

}