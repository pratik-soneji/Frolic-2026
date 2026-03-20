import axios from "axios"

export const uploadAvatar = async (file: File) => {
  const formData = new FormData()
  formData.append("avatar", file)

  const res = await axios.post(
    "http://localhost:5000/user/avatar",
    formData,
    {
      withCredentials: true,
    }
  )

  return res.data.data
}