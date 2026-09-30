import api from "./clients.api";

export type PublicServiceCategory = {
  id?: string;
  slug: string;
  name?: string;
  label: string;
};

export const getServiceCategories = async (): Promise<PublicServiceCategory[]> => {
  const response = await api.get<{ data: PublicServiceCategory[] }>("/service-categories", { params: { active_only: 1 } });
  return response.data.data ?? [];
};
