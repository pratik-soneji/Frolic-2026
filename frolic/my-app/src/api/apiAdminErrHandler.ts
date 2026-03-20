import { apiAdmin } from "@/constants/api"

const refreshAccessToken = async () => {
  await apiAdmin.post("/auth/refresh", {}, {
    withCredentials: true
  });
};

apiAdmin.interceptors.response.use(
  (response) => response,
  async (error) => {

    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      originalRequest._retry = true;

      try {

        await refreshAccessToken();

        return apiAdmin(originalRequest);

      } catch (refreshError) {

        // refresh failed → logout
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);