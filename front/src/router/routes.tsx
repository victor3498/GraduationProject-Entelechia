// src/router/routes.tsx
import type { RouteObject } from "react-router-dom"
import { lazy } from "react"
import { ProtectedRoute } from "./guards"


// 懒加载（企业推荐）
const LogAndResPage = lazy(() => import("../pages/LoginOrRes"))
const MainPage = lazy(() => import("../pages/mainPage"))
const UserPage = lazy(() => import("../pages/UserPage"))
const SharePage = lazy(() => import("../pages/SharePage"))
const SharedDocPage = lazy(() => import("../pages/SharedDocPage"))

export const routes: RouteObject[] = [
  {
    path: "/login",
    element: <LogAndResPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <UserPage />
      </ProtectedRoute>
    ),
  },
  // 分享相关路由：公开访问，不套 ProtectedRoute，游客可直接进入
  {
    path: "/share",
    element: <SharePage />,
  },
  {
    path: "/share/:code",
    element: <SharedDocPage />,
  },

  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]
