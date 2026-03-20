// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./modules/auth"

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
})

// 类型（很重要）
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch