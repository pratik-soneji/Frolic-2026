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
  const navigate = useNavigate();
  const setUser = useAuthStore.getState().setUser
  return useMutation<LoginResponse, AxiosError<ApiError>, loginFormProps>({
    mutationFn: login,
    onSuccess: (data) => {
        setUser(data.user)
        console.log(data);
        if(data.user.isAdmin){
          navigate('/admin')
        }else{
          navigate('/dashboard')        
        }
        
    },
    onError: ()=>{
        console.log("Errr");
        
    }
  })
}
export const useRegister = () => {
  const navigate = useNavigate();
  return useMutation<LoginResponse, AxiosError<ApiError>, signupFormProps>({
    mutationFn: signup,
    onSuccess: (data) => {
        console.log(data);
        navigate('/dashboard')        
    },
    onError: (err)=>{
      console.log(err);
      
        console.log("sign up Errr");
        
    }
  })
}

