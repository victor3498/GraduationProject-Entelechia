// src/router/mobile-routes.tsx
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import { ProtectedRoute } from "./guards";

// 懒加载（企业推荐）
const MobileLoginOrRes = lazy(() => import("../pages/mobile/MobileLoginOrRes"));
const MobileMainPage = lazy(() => import("../pages/mobile/MobileMainPage"));
const MobileEditorPage = lazy(() => import("../pages/mobile/MobileEditorPage"));

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
    path: "*",
    element: <div>404 Not Found</div>,
  },
];
