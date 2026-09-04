import axios from "axios";

const API_ROOT = "http://localhost:8000/api/v1";

export const normalizeRole = (value = "participant") => {
  return String(value || "participant")
    .trim()
    .toLowerCase();
};

export const getStoredUser = () => ({
  name: localStorage.getItem("username") || "Hackathon User",
  role: normalizeRole(localStorage.getItem("userRole")),
});

export const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const setLoggedInUser = ({
  username,
  role,
  accessToken,
  refreshToken,
}) => {
  if (username) localStorage.setItem("username", username);
  if (role) localStorage.setItem("userRole", normalizeRole(role));
  if (accessToken) localStorage.setItem("accessToken", accessToken);
  if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
};

export const isAuthenticated = () => !!localStorage.getItem("accessToken");

export const installAuthInterceptor = () => {
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      const isExpiredAccessToken = error.response?.status === 401;
      const isRefreshRequest =
        originalRequest?.url?.includes("/token/refresh/");

      if (
        !isExpiredAccessToken ||
        isRefreshRequest ||
        originalRequest?._retry
      ) {
        return Promise.reject(error);
      }

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const response = await axios.post(`${API_ROOT}/token/refresh/`, {
          refresh: refreshToken,
        });
        localStorage.setItem("accessToken", response.data.access);
        originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
        return axios(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("username");
        window.location.assign("/login");
        return Promise.reject(refreshError);
      }
    },
  );
};
