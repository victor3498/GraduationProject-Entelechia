import {http} from "../lib/http"
import type {ApiResponse} from "../types/api"
import type {LoginParams,LoginResult,registerParams,Logout,changePasswordParams,registerResult} from "../types/auth"


export async function loginApi(data: LoginParams){
    // return http<ApiResponse<LoginResult>>("/auth/login",{
    //     method:"POST",
    //     body: JSON.stringify(data),
    // })
    const res = await http<ApiResponse<LoginResult>>("/auth/login",{
        method: "POST",
        body: JSON.stringify(data),
    })
    if(res.data?.accessToken){
         localStorage.setItem("accessToken", res.data.accessToken)
         localStorage.setItem("refreshToken", res.data.refreshToken)
    }
     return res
}

export async function registerApi(data: registerParams){
  const res= http<ApiResponse<registerResult>>("/auth/register",{ method:"POST", body: JSON.stringify(data), })
  return res
}

export async function logoutApi(data: Logout){
    const refreshToken = localStorage.getItem("refreshToken") || ""

  const res = await http<ApiResponse<null>>("/auth/logout", {
    method: "POST",
    body: JSON.stringify({
      refreshToken,
    }),
  })

  // ===== 自动删除 token =====
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")

  return res
}

export async function changePasswordApi(data:changePasswordParams ){
    const res= http<ApiResponse<null>>("/auth/change-password",{
        method:"POST",
        body: JSON.stringify(data),
    })
    return res
}