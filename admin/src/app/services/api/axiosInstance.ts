import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const authData = localStorage.getItem("kt-auth-react-v");
  let token = null;

  if (authData) {
    try {
      const auth = JSON.parse(authData);
      token = auth.token;
    } catch (error) {
      console.error('Error parsing auth data:', error);
    }
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
