// src/router/routes.tsx
import type { RouteObject } from "react-router-dom"
import { lazy } from "react"
import { ProtectedRoute } from "./guards"


// 懒加载（企业推荐）
const LogAndResPage = lazy(() => import("../pages/LoginOrRes"))
const MainPage = lazy(() => import("../pages/mainPage"))
const UserPage = lazy(() => import("../pages/UserPage"))

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
  
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]