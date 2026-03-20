// src/router/index.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { routes } from "./routes"
import { Suspense } from "react"

const router = createBrowserRouter(routes)

export function AppRouter() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  )
}