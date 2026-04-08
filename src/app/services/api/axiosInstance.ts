import axios from "axios";
import { getAuth } from "../../modules/auth/core/AuthHelpers";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const auth = getAuth();

  console.log("AUTH OBJECT:", auth);
  localStorage.getItem("kt-auth-react-v"); 

  if (auth?.api_token) {
    config.headers.Authorization = `Bearer ${auth.api_token}`;
  } else {
    console.log("NO TOKEN FOUND"); 
  }

  return config;
});

export default axiosInstance;
