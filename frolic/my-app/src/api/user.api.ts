import axios from "axios"

export const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append("avatar", file)

  const res = await axios.post(
    "https://frolic-backend-8qmc.onrender.com/user/avatar",
    formData,
    {
      withCredentials: true,
    }
  )

  return res.data.data
}