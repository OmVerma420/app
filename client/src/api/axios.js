import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: { Accept: "application/json" },
  timeout: 10000, // 10 seconds
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      // silent; let app handle redirect
    }
    return Promise.reject(err);
  }
);

export default api;
