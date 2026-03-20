// src/router/guards.tsx
import type { JSX } from "react"
import { Navigate } from "react-router-dom"

function getToken() {
  return localStorage.getItem("accessToken")
}

interface Props {
  children: JSX.Element
}

export function ProtectedRoute({ children }: Props) {
  const token = getToken()

  // 未登录 → 跳登录页
  if (!token) {
    return <Navigate to="/login" replace />
  }

  return children
}