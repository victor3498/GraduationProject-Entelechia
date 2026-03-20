// src/store/modules/auth.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
  accessToken: string | null
}

const initialState: AuthState = {
  accessToken: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.accessToken = action.payload
    },
    clearToken(state) {
      state.accessToken = null
    },
  },
})

export const { setToken, clearToken } = authSlice.actions
export default authSlice.reducer