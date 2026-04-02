<<<<<<< Updated upstream
=======
import axios from "axios";

type GetSeekersParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  filters?: Record<string, any>;
};

export const fetchSeekersApi = async (params: GetSeekersParams) => {
  const apiUrl = import.meta.env.VITE_APP_API_URL ?? "http://127.0.0.1:8000/api/admin";

  const response = await axios.get(`${apiUrl}/seekers`, {
    params,
  });

  return {
    data: response.data.data ?? [],
    total: response.data.meta?.pagination?.total ?? 0,
  };
};
>>>>>>> Stashed changes
