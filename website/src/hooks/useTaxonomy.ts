import { useQuery } from "@tanstack/react-query";
import { getAgentTypes } from "../api/agentTypes.api";
import { getPropertyTypes } from "../api/propertyTypes.api";
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

export const usePropertyTypes = () =>
  useQuery({
    queryKey: ["property-types"],
    queryFn: getPropertyTypes,
    staleTime: Infinity,
  });
