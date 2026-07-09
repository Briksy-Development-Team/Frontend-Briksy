export type WebhookEventMap = Record<string, string>;

export type WebhookEventRegistryItem = {
  key: string;
  display_name: string;
  category: string;
  description?: string | null;
  payload_schema?: string | null;
};

export type WebhookEndpoint = {
  id: string;
  company_id: string;
  name: string;
  endpoint_url: string;
  secret_key?: string;
  description?: string | null;
  status: "active" | "disabled";
  health_status?: "healthy" | "warning" | "critical" | "disabled";
  events: string[];
  retry_count: number;
  created_by?: string | null;
  updated_by?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  created_by_user?: { id: string; name: string; email?: string | null } | null;
  updated_by_user?: { id: string; name: string; email?: string | null } | null;
  last_delivery?: {
    id: string;
    event: string;
    delivery_status: string;
    http_status?: number | null;
    created_at?: string | null;
  } | null;
};

export type WebhookDeliveryLog = {
  id: string;
  webhook_endpoint_id: string;
  company_id: string;
  event_id?: string | null;
  event: string;
  endpoint_url: string;
  deduplication_key?: string | null;
  payload: Record<string, unknown>;
  signature?: string | null;
  response_body?: string | null;
  http_status?: number | null;
  response_time_ms?: number | null;
  delivery_status: "pending" | "retrying" | "delivered" | "failed";
  attempt_count: number;
  retry_count: number;
  error_message?: string | null;
  last_attempt_at?: string | null;
  next_retry_at?: string | null;
  delivered_at?: string | null;
  failed_at?: string | null;
  dead_lettered_at?: string | null;
  created_at?: string | null;
  updated_at?: string | null;
  endpoint?: {
    id: string;
    name: string;
    endpoint_url: string;
    status: string;
  } | null;
};

export type WebhookEndpointPayload = {
  name: string;
  endpoint_url: string;
  secret_key?: string;
  description?: string | null;
  status: "active" | "disabled";
  events: string[];
  retry_count?: number;
};

export type WebhookIndexResponse = {
  endpoints: WebhookEndpoint[];
  supported_events: WebhookEventMap;
  event_registry: WebhookEventRegistryItem[];
  event_categories: Array<{
    category: string;
    events: WebhookEventRegistryItem[];
  }>;
  stats?: WebhookStats;
};

export type WebhookLogsResponse = {
  data: WebhookDeliveryLog[];
  total: number;
};

export type WebhookStats = {
  total_endpoints: number;
  active_endpoints: number;
  total_deliveries: number;
  successful_deliveries: number;
  failed_deliveries: number;
  dead_letter_deliveries: number;
  retry_queue: number;
  success_rate: number;
  pending_retries: number;
  recent_failures: number;
  problem_endpoints: Array<{
    id: string;
    name: string;
    status: string;
    failure_count: number;
  }>;
};

export type WebhookDeliveryTestResult = {
  success: boolean;
  http_status?: number | null;
  response_time_ms?: number | null;
  response_body?: string | null;
  signature?: string | null;
  delivery_status?: string;
};

export type WebhookEndpointActionResponse = {
  secret_key?: string;
  endpoint?: WebhookEndpoint | null;
  log?: WebhookDeliveryLog | null;
  result?: WebhookDeliveryTestResult | null;
};
