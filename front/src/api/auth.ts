import {http} from "../lib/http"
import type {ApiResponse} from "../types/api"
import type {LoginParams,LoginResult,registerParams,Logout,changePasswordParams,registerResult} from "../types/auth"

export function loginApi(data: LoginParams){
    return http<ApiResponse<LoginResult>>("/auth/login",{
        method:"POST",
        body: JSON.stringify(data),
    })
}

export function registerApi(data: registerParams){
    return http<ApiResponse<registerResult>>("/auth/register",{
        method:"POST",
        body: JSON.stringify(data),
    })
}

export function logoutApi(data: Logout){
    return http<ApiResponse<null>>("/auth/logout",{
        method:"POST",
        body: JSON.stringify(data),
    })
}

export function changePasswordApi(data:changePasswordParams ){
    return http<ApiResponse<null>>("/auth/logout",{
        method:"POST",
        body: JSON.stringify(data),
    })
}