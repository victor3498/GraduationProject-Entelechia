const BASE_URL = "http://localhost:3000/api"

/**
 * 公开路由（如分享码访问）允许游客访问，遇到 401 / token 失效不应强制跳转登录页。
 * 这里通过 path 前缀做白名单匹配。
 */
function isPublicPath(path: string): boolean {
  return path.startsWith("/share")
}

async function handleTokenError(response: Response, path: string): Promise<void> {
  if (isPublicPath(path)) return
  try {
    const data = await response.clone().json()
    if (data.message === "Invalid or expired token") {
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      window.location.href = "/login"
      throw new Error("Token expired, redirecting to login")
    }
  } catch {
  }
}

export async function http<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("accessToken")

  const headers = {
    "Content-Type": "application/json",
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...(options.headers || {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  console.log("http部分的res", res)

  if (!res.ok) {
    await handleTokenError(res, path)
    throw new Error(`HTTP error: ${res.status}`)
  }

  const data = await res.json()

  if (!isPublicPath(path) && data.message === "Invalid or expired token") {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    window.location.href = "/login"
    throw new Error("Token expired, redirecting to login")
  }

  return data
}
