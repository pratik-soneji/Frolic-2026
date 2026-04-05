import axios from "axios"
import { API_BASE_URL } from "../constants/url"

export const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append("avatar", file)

  const res = await axios.post(
    `${API_BASE_URL}/user/avatar`,
    formData,
    {
      withCredentials: true,
    }
  )

  return res.data.data
}