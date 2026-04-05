import { create } from "zustand"


import type { User } from "@/types/auth"
import { api } from "@/constants/api"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: User | null) => void
  checkAuth: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      isLoading: false,
    }),

  checkAuth: async () => {
    try {
      const res = await api.get("/me")

      set({
        user: res.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      })
    } catch {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  },

  logout: async () => {
    try {
      await api.post("/logout")
    } catch (error) {
      console.error("Logout Error:", error)
    }

    set({
      user: null,
      isAuthenticated: false,
    })
  },
}))