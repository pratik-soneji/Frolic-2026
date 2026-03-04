import { useAuthStore } from "@/store/useAuthStore"

export const useAuth = () => {
    const user = useAuthStore((state) => state.user)
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
    const isLoading = useAuthStore((state) => state.isLoading)
  
    return { user, isAuthenticated, isLoading }
  }