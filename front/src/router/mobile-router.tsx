// src/router/mobile-router.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { mobileRoutes } from "./mobile-routes"
import { Suspense } from "react"

const mobileRouter = createBrowserRouter(mobileRoutes)

export function MobileAppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={mobileRouter} />
    </Suspense>
  )
}
