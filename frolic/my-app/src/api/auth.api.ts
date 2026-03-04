import type { loginFormProps } from "@/components/pages/Login"
import type { signupFormProps } from "@/components/pages/SignUp"
import {api} from "@/constants/api"
import type { LoginResponse } from "@/types/auth"

export const login = async (data : loginFormProps) : Promise<LoginResponse>=>{
    const res = await api.post('/login',data)
    return res.data.data
  }
export const signup = async (data : signupFormProps) : Promise<LoginResponse>=>{
    const res = await api.post('/register',data)
    return res.data.data
  }
