import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

function getCookie(name) {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split("=");
    if (key === name) {
      return decodeURIComponent(value);
    }
  }
  return null;
}

export const fetchCsrfToken = async () => {
  await api.get("/sanctum/csrf-cookie");
  const token = getCookie("XSRF-TOKEN");
  if (token) {
    api.defaults.headers.common["X-XSRF-TOKEN"] = token;
  }
};

export default api;
