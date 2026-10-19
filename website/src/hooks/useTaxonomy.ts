import { useQuery } from "@tanstack/react-query";
import { getAgentTypes } from "../api/agentTypes.api";
import { getServiceCategories } from "../api/serviceCategories.api";

export const useAgentTypes = () =>
  useQuery({
    queryKey: ["agent-types"],
    queryFn: getAgentTypes,
    staleTime: Infinity,
  });

export const useServiceCategories = () =>
  useQuery({
    queryKey: ["service-categories"],
    queryFn: getServiceCategories,
    staleTime: Infinity,
  });
