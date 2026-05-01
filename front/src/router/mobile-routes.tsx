// src/router/mobile-routes.tsx
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "./guards";

// 懒加载（企业推荐）
const MobileLoginOrRes = lazy(() => import("../pages/mobile/MobileLoginOrRes"));
const MobileMainPage = lazy(() => import("../pages/mobile/MobileMainPage"));
const MobileEditorPage = lazy(() => import("../pages/mobile/MobileEditorPage"));
const MobileUserPage = lazy(() => import("../pages/mobile/MobileUserPage"));
const MobileSharePage = lazy(() => import("../pages/mobile/MobileSharePage"));
const MobileSharedDocPage = lazy(() => import("../pages/mobile/MobileSharedDocPage"));

export const mobileRoutes: RouteObject[] = [
  {
    path: "/",
    element: <MobileLoginOrRes />,
  },
  {
    path: "/mobile/login",
    element: <MobileLoginOrRes />,
  },
  {
    path: "/mobile",
    element: (
      <ProtectedRoute>
        <MobileMainPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mobile/editor",
    element: (
      <ProtectedRoute>
        <MobileEditorPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/mobile/user",
    element: (
      <ProtectedRoute>
        <MobileUserPage />
      </ProtectedRoute>
    ),
  },
  // 分享相关路由：公开访问，不套 ProtectedRoute
  {
    path: "/mobile/share",
    element: <MobileSharePage />,
  },
  {
    path: "/mobile/share/:code",
    element: <MobileSharedDocPage />,
  },
  {
    path: "*",
    element: <div>404 Not Found</div>,
  },
];
