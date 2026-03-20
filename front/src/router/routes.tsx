// src/router/routes.tsx
import type { RouteObject } from "react-router-dom"
import { lazy } from "react"
import { ProtectedRoute } from "./guards"

// 懒加载（企业推荐）
const LogAndResPage = lazy(() => import("../pages/LoginOrRes"))
const MainLayout = lazy(() => import("../layouts/MainLayout"))
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
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true, // /
        element: <MainPage/>,
      },
      {
        path: "profile", // /profile
        element: <UserPage />,
      },
    ],
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
]