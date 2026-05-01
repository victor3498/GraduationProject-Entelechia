// src/router/mobile-router.tsx
import { createHashRouter, RouterProvider } from "react-router-dom"
import { mobileRoutes } from "./mobile-routes"
import { Suspense } from "react"

const mobileRouter = createHashRouter(mobileRoutes)

export function MobileAppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={mobileRouter} />
    </Suspense>
  )
}
