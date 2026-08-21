import axiosInstance from "../../api/axiosInstance";
import { buildApiParams } from "../../utils/buildApiParams";
import type {
  WebhookEndpointActionResponse,
  WebhookDeliveryLog,
  WebhookEndpoint,
  WebhookEndpointPayload,
  WebhookIndexResponse,
  WebhookLogsResponse,
  WebhookStats,
} from "./webhooks.types";

const basePath = "/admin/webhooks";

export const fetchWebhooksApi = async (): Promise<WebhookIndexResponse> => {
  const response = await axiosInstance.get(basePath);
  return {
    endpoints: response.data.data?.endpoints ?? [],
    supported_events: response.data.data?.supported_events ?? {},
    event_registry: response.data.data?.event_registry ?? [],
    event_categories: response.data.data?.event_categories ?? [],
    stats: response.data.data?.stats ?? undefined,
  };
};

export const fetchWebhookStatsApi = async (): Promise<WebhookStats> => {
  const response = await axiosInstance.get(`${basePath}/stats`);
  return response.data.data as WebhookStats;
};

export const saveWebhookApi = async (
  payload: WebhookEndpointPayload,
  id?: string,
): Promise<WebhookEndpoint> => {
  const response = id
    ? await axiosInstance.put(`${basePath}/${id}`, payload)
    : await axiosInstance.post(basePath, payload);

  return response.data.data as WebhookEndpoint;
};

export const deleteWebhookApi = async (id: string): Promise<void> => {
  await axiosInstance.delete(`${basePath}/${id}`);
};

export const regenerateWebhookSecretApi = async (id: string): Promise<WebhookEndpointActionResponse> => {
  const response = await axiosInstance.post(`${basePath}/${id}/regenerate-secret`);
  return response.data.data as WebhookEndpointActionResponse;
};

export const testWebhookApi = async (id: string): Promise<WebhookEndpointActionResponse> => {
  const response = await axiosInstance.post(`${basePath}/${id}/test`);
  return response.data.data as WebhookEndpointActionResponse;
};

export const fetchWebhookLogsApi = async (params: Record<string, unknown> = {}): Promise<WebhookLogsResponse> => {
  const response = await axiosInstance.get(`${basePath}/logs`, {
    params: buildApiParams({
      filters: params.filter as Record<string, unknown> | undefined,
      search: params.search as string | undefined,
      page: params.page as number | undefined,
      per_page: params.per_page as number | undefined,
      sort: params.sort as string | undefined,
      direction: params.direction as string | undefined,
    }),
  });

  const { data, meta } = response.data || {};

  return {
    data: Array.isArray(data) ? (data as WebhookDeliveryLog[]) : [],
    total: meta?.pagination?.total ?? 0,
  };
};

export const fetchWebhookLogApi = async (id: string): Promise<WebhookDeliveryLog> => {
  const response = await axiosInstance.get(`${basePath}/logs/${id}`);
  return response.data.data as WebhookDeliveryLog;
};

export const retryWebhookDeliveryApi = async (id: string): Promise<WebhookDeliveryLog> => {
  const response = await axiosInstance.post(`${basePath}/logs/${id}/retry`);
  return response.data.data as WebhookDeliveryLog;
};

export const exportWebhookLogsApi = async (params: Record<string, unknown> = {}): Promise<WebhookDeliveryLog[]> => {
  const response = await axiosInstance.get(`${basePath}/logs/export`, {
    params: buildApiParams({
      filters: params.filter as Record<string, unknown> | undefined,
      search: params.search as string | undefined,
      page: params.page as number | undefined,
      per_page: params.per_page as number | undefined,
      sort: params.sort as string | undefined,
      direction: params.direction as string | undefined,
    }),
  });

  return response.data.data?.logs ?? [];
};
