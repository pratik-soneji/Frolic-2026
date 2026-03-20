import { useMutation } from "@tanstack/react-query"
import { uploadAvatar } from "@/api/user.api"
import { useAuthStore } from "@/store/useAuthStore"

export const useUploadAvatar = () => {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: uploadAvatar,

    onSuccess: (data) => {
      const currentUser = useAuthStore.getState().user;
      setUser({
        ...currentUser!,
        avatar: data.url
      })
    }
  })
}