import api from "./clients.api";

export type PublicPropertyType = {
  id: string;
  name: string;
  slug: string;
  category: string;
};

export const getPropertyTypes = async (): Promise<PublicPropertyType[]> => {
  const response = await api.get<{ data: PublicPropertyType[] }>("/property-types");
  return response.data.data ?? [];
};
