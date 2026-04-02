import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const testConnection = async () => {
  try {
    const res = await api.get("/");

    if (res.status === 200) {
      console.log("Backend connected successfully ");
    } else {
      console.log("Backend responded but status:", res.status);
    }
  } catch (error) {
    console.error("Backend connection failed ", error);
  }
};

export default api;
    