import api from "./clients.api";

export type PublicAgentType = {
  id: string;
  name: string;
  label: string;
  slug: string;
  module?: string | null;
  display_name?: string | null;
  capability_profile?: string | null;
  is_active: boolean;
  sort_order: number;
};

export const getAgentTypes = async (): Promise<PublicAgentType[]> => {
  const response = await api.get<{ data: PublicAgentType[] }>("/agent-types");
  return response.data.data ?? [];
};

export const agentTypeForLabel = (
  label: string | null | undefined,
  types: readonly PublicAgentType[],
) => types.find((type) =>
  type.label.toLowerCase() === (label ?? "").toLowerCase() ||
  type.name.toLowerCase() === (label ?? "").toLowerCase() ||
  type.slug.toLowerCase() === (label ?? "").toLowerCase(),
);
