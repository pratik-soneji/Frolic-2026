// queries/auth.queries.ts
import { useMutation } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { login, signup } from "@/api/auth.api"
import { useNavigate } from 'react-router-dom';

import type { loginFormProps } from "@/components/pages/Login"
import type { LoginResponse } from "@/types/auth"
import type { signupFormProps } from "@/components/pages/SignUp";
import { useAuthStore } from "@/store/useAuthStore";

type ApiError = {
  message: string
}
export const useLogin = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation<LoginResponse, AxiosError<ApiError>, loginFormProps>({
    mutationFn: login,

    onSuccess: (data) => {
      setUser(data.user)

      if (data.user.isAdmin) {
        navigate("/admin")
      } else {
        navigate("/")
      }
    },

    onError: (err) => {
      console.log(err.response?.data?.message)
    },
  })
}
export const useRegister = () => {
  const navigate = useNavigate()
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation<LoginResponse, AxiosError<ApiError>, signupFormProps>({
    mutationFn: signup,

    onSuccess: (data) => {
      setUser(data.user)

      navigate("/")
    },

    onError: (err) => {
      console.log(err.response?.data?.message)
    },
  })
}


