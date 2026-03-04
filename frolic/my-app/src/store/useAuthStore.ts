import type { User } from "@/types/auth"
import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware" // 1. Import add karyu

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean

  setUser: (user: User | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, // Default loading true rakhyu chhe

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: "auth-storage", // 2. LocalStorage ma aa key thi save thase
      
      // 3. Smart Move: Sirf User ane Auth status j save kar, loading nai.
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
)