import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import { exportToExcel } from "../../modules/apps/shared_table/utils/exportToExcel";
import { useAuth } from "../../modules/auth";
import {
  deleteWebhookApi,
  fetchWebhookLogApi,
  fetchWebhookLogsApi,
  fetchWebhooksApi,
  fetchWebhookStatsApi,
  regenerateWebhookSecretApi,
  retryWebhookDeliveryApi,
  saveWebhookApi,
  testWebhookApi,
} from "../../services/features/webhooks/webhooks.api";
import type {
  WebhookDeliveryLog,
  WebhookEndpoint,
  WebhookEndpointPayload,
  WebhookEventMap,
  WebhookEventRegistryItem,
  WebhookStats,
} from "../../services/features/webhooks/webhooks.types";

type WebhookFormState = WebhookEndpointPayload & { secret_key?: string };
type FilterState = {
  search: string;
  status: string;
  event: string;
};

type LogFilterState = {
  event: string;
  status: string;
  date_from: string;
  date_to: string;
  endpoint_id: string;
  company_id: string;
};

type FeedbackState = {
  title: string;
  message: string;
  status: "success" | "danger" | "warning" | "info";
  details?: string;
  httpStatus?: number | null;
  responseTimeMs?: number | null;
  responseBody?: string | null;
};

const DEFAULT_FORM: WebhookFormState = {
  name: "",
  endpoint_url: "",
  secret_key: "",
  description: "",
  status: "active",
  events: [],
  retry_count: 5,
};

const DEFAULT_ENDPOINT_FILTERS: FilterState = {
  search: "",
  status: "",
  event: "",
};

const DEFAULT_LOG_FILTERS: LogFilterState = {
  event: "",
  status: "",
  date_from: "",
  date_to: "",
  endpoint_id: "",
  company_id: "",
};

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleString() : "N/A");

const generateSecret = () => {
  const bytes = new Uint8Array(32);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const flattenPayload = (value: unknown): string => {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
};

const downloadCsv = (filename: string, rows: WebhookDeliveryLog[]) => {
  const headers = [
    "Event",
    "Endpoint",
    "HTTP Status",
    "Response Time (ms)",
    "Delivery Status",
    "Retry Count",
    "Attempt Count",
    "Timestamp",
  ];

  const csvRows = rows.map((row) => [
    row.event,
    row.endpoint_url,
    row.http_status ?? "",
    row.response_time_ms ?? "",
    row.delivery_status,
    row.retry_count,
    row.attempt_count,
    row.created_at ?? "",
  ]);

  const escape = (value: unknown) => {
    const text = String(value ?? "");
    return `"${text.replace(/"/g, '""')}"`;
  };

  const csv = [headers.map(escape).join(","), ...csvRows.map((row) => row.map(escape).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const copyText = async (text: string) => {
  if (!text) return false;

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  const result = document.execCommand("copy");
  textarea.remove();
  return result;
};

export default function WebhooksPage() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isSuperAdmin = currentUser?.roles?.some((role) => role === "super_admin" || role === "super_admin_employee") ?? false;

  const [endpoints, setEndpoints] = useState<WebhookEndpoint[]>([]);
  const [logs, setLogs] = useState<WebhookDeliveryLog[]>([]);
  const [supportedEvents, setSupportedEvents] = useState<WebhookEventMap>({});
  const [eventRegistry, setEventRegistry] = useState<WebhookEventRegistryItem[]>([]);
  const [eventCategories, setEventCategories] = useState<Array<{ category: string; events: WebhookEventRegistryItem[] }>>([]);
  const [stats, setStats] = useState<WebhookStats | null>(null);
  const [activeTab, setActiveTab] = useState<"endpoints" | "logs">("endpoints");
  const [editing, setEditing] = useState<WebhookFormState | null>(null);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [selectedLog, setSelectedLog] = useState<WebhookDeliveryLog | null>(null);
  const [loading, setLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const [endpointFilters, setEndpointFilters] = useState<FilterState>(DEFAULT_ENDPOINT_FILTERS);
  const [logFilters, setLogFilters] = useState<LogFilterState>(DEFAULT_LOG_FILTERS);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const groupedEvents = useMemo(() => {
    if (eventCategories.length > 0) {
      return eventCategories.reduce<Record<string, WebhookEventRegistryItem[]>>((acc, group) => {
        acc[group.category] = group.events;
        return acc;
      }, {});
    }

    return eventRegistry.reduce<Record<string, WebhookEventRegistryItem[]>>((acc, event) => {
      acc[event.category] = [...(acc[event.category] ?? []), event];
      return acc;
    }, {});
  }, [eventCategories, eventRegistry]);

  const filteredEndpoints = useMemo(() => {
    const search = endpointFilters.search.trim().toLowerCase();
    return endpoints.filter((endpoint) => {
      const matchesSearch =
        !search ||
        [endpoint.name, endpoint.endpoint_url, endpoint.description ?? ""]
          .join(" ")
          .toLowerCase()
          .includes(search);
      const matchesStatus = !endpointFilters.status || endpoint.status === endpointFilters.status;
      const matchesEvent = !endpointFilters.event || endpoint.events.includes(endpointFilters.event);
      return matchesSearch && matchesStatus && matchesEvent;
    });
  }, [endpointFilters, endpoints]);

  const groupedEventEntries = useMemo(() => Object.entries(groupedEvents), [groupedEvents]);

  const visibleLogs = useMemo(() => {
    if (logFilters.status === "dead_letter") {
      return logs.filter((log) => Boolean(log.dead_lettered_at));
    }

    return logs;
  }, [logFilters.status, logs]);

  const loadEndpoints = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchWebhooksApi();
      setEndpoints(response.endpoints ?? []);
      setSupportedEvents(response.supported_events ?? {});
      setEventRegistry(response.event_registry ?? []);
      setEventCategories(response.event_categories ?? []);
      if (response.stats) {
        setStats(response.stats);
      }
      if (Object.keys(expandedGroups).length === 0) {
        const initialExpanded = (response.event_categories ?? []).reduce<Record<string, boolean>>((acc, group) => {
          acc[group.category] = true;
          return acc;
        }, {});
        setExpandedGroups(initialExpanded);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load webhook endpoints.");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      setStats(await fetchWebhookStatsApi());
    } catch {
      // Keep the page usable even if stats refresh fails.
    }
  };

  const loadLogs = async () => {
    setLogsLoading(true);
    setError(null);
    try {
      const response = await fetchWebhookLogsApi({
        filter: {
          event: logFilters.event || undefined,
          status: logFilters.status === "dead_letter" ? "failed" : logFilters.status || undefined,
          date_from: logFilters.date_from || undefined,
          date_to: logFilters.date_to || undefined,
          endpoint_id: logFilters.endpoint_id || undefined,
          company_id: isSuperAdmin ? logFilters.company_id || undefined : undefined,
        },
      });
      setLogs(response.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load delivery logs.");
    } finally {
      setLogsLoading(false);
    }
  };

  useEffect(() => {
    void loadEndpoints();
  }, []);

  const refreshAll = async () => {
    await Promise.all([loadEndpoints(), loadLogs()]);
  };

  const startCreate = () => {
    setEditing({ ...DEFAULT_FORM, secret_key: generateSecret() });
    setEditingId(undefined);
    setFeedback(null);
  };

  const startEdit = (endpoint: WebhookEndpoint) => {
    setEditing({
      name: endpoint.name,
      endpoint_url: endpoint.endpoint_url,
      secret_key: endpoint.secret_key ?? generateSecret(),
      description: endpoint.description ?? "",
      status: endpoint.status,
      events: endpoint.events ?? [],
      retry_count: endpoint.retry_count ?? 5,
    });
    setEditingId(endpoint.id);
    setFeedback(null);
  };

  const toggleEvent = (eventKey: string) => {
    if (!editing) return;

    setEditing((current) => {
      if (!current) return current;
      const events = current.events.includes(eventKey)
        ? current.events.filter((event) => event !== eventKey)
        : [...current.events, eventKey];
      return { ...current, events };
    });
  };

  const setGroupEvents = (groupTitle: string, checked: boolean) => {
    if (!editing) return;
    const keys = groupedEvents[groupTitle]?.map((event) => event.key) ?? [];
    setEditing((current) => {
      if (!current) return current;
      const eventSet = new Set(current.events);
      keys.forEach((key) => {
        if (checked) {
          eventSet.add(key);
        } else {
          eventSet.delete(key);
        }
      });
      return { ...current, events: Array.from(eventSet) };
    });
  };

  const selectAllEvents = () => {
    if (!editing) return;
    const allEvents = Object.values(groupedEvents).flatMap((events) => events.map((event) => event.key));
    setEditing((current) => (current ? { ...current, events: allEvents } : current));
  };

  const deselectAllEvents = () => {
    if (!editing) return;
    setEditing((current) => (current ? { ...current, events: [] } : current));
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      await saveWebhookApi(
        {
          name: editing.name,
          endpoint_url: editing.endpoint_url,
          secret_key: editing.secret_key,
          description: editing.description,
          status: editing.status,
          events: editing.events,
          retry_count: editing.retry_count,
        },
        editingId,
      );
      setEditing(null);
      setEditingId(undefined);
      setFeedback({
        title: editingId ? "Webhook updated" : "Webhook created",
        message: editingId ? "Your changes were saved successfully." : "The endpoint is ready to receive events.",
        status: "success",
      });
      await refreshAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save webhook.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (endpoint: WebhookEndpoint) => {
    if (!window.confirm(`Delete webhook "${endpoint.name}"?`)) return;
    setBusyId(endpoint.id);
    setError(null);
    try {
      await deleteWebhookApi(endpoint.id);
      setFeedback({
        title: "Webhook deleted",
        message: `"${endpoint.name}" was removed.`,
        status: "warning",
      });
      await refreshAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete webhook.");
    } finally {
      setBusyId(null);
    }
  };

  const regenerateSecret = async (endpoint: WebhookEndpoint) => {
    if (!window.confirm(`Regenerate the secret for "${endpoint.name}"? Existing integrations will stop working until updated.`)) {
      return;
    }

    setBusyId(endpoint.id);
    setError(null);
    try {
      const response = await regenerateWebhookSecretApi(endpoint.id);
      setFeedback({
        title: "Secret regenerated",
        message: "Copy the new secret into every downstream integration immediately.",
        status: "warning",
        details: response.secret_key ?? undefined,
      });
      await refreshAll();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to regenerate webhook secret.");
    } finally {
      setBusyId(null);
    }
  };

  const sendTestEvent = async (endpoint: WebhookEndpoint) => {
    setBusyId(endpoint.id);
    setError(null);
    try {
      const response = await testWebhookApi(endpoint.id);
      const result = response.result ?? null;
      setFeedback({
        title: result?.success ? "Test event delivered" : "Test event failed",
        message: result?.success
          ? "The endpoint responded successfully."
          : "The endpoint returned an error. Review the response body and retry after fixing the integration.",
        status: result?.success ? "success" : "danger",
        httpStatus: result?.http_status ?? null,
        responseTimeMs: result?.response_time_ms ?? null,
        responseBody: result?.response_body ?? null,
      });
      await refreshAll();
    } catch (err) {
      setFeedback({
        title: "Test event failed",
        message: err instanceof Error ? err.message : "Unable to send the test event.",
        status: "danger",
      });
    } finally {
      setBusyId(null);
    }
  };

  const retryDelivery = async (log: WebhookDeliveryLog) => {
    setBusyId(log.id);
    setError(null);
    try {
      await retryWebhookDeliveryApi(log.id);
      setFeedback({
        title: "Retry queued",
        message: "The delivery has been re-dispatched to the webhook queue.",
        status: "info",
      });
      await loadLogs();
      await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to retry webhook delivery.");
    } finally {
      setBusyId(null);
    }
  };

  const exportLogs = async (format: "csv" | "xlsx") => {
    const filename = `webhook-delivery-logs-${new Date().toISOString().slice(0, 10)}.${format === "csv" ? "csv" : "xlsx"}`;

    if (format === "csv") {
      downloadCsv(filename, visibleLogs);
      setFeedback({
        title: "CSV export started",
        message: "Filtered delivery logs were exported.",
        status: "success",
      });
      return;
    }

    await exportToExcel(
      visibleLogs.map((log) => ({
        event: log.event,
        endpoint: log.endpoint_url,
        http_status: log.http_status ?? "",
        response_time_ms: log.response_time_ms ?? "",
        delivery_status: log.delivery_status,
        retry_count: log.retry_count,
        attempt_count: log.attempt_count,
        timestamp: log.created_at ?? "",
      })),
      [
        { accessor: "event", Header: "Event" },
        { accessor: "endpoint", Header: "Endpoint" },
        { accessor: "http_status", Header: "HTTP Status" },
        { accessor: "response_time_ms", Header: "Response Time (ms)" },
        { accessor: "delivery_status", Header: "Delivery Status" },
        { accessor: "retry_count", Header: "Retry Count" },
        { accessor: "attempt_count", Header: "Attempt Count" },
        { accessor: "timestamp", Header: "Timestamp" },
      ],
      filename,
    );

    setFeedback({
      title: "Excel export started",
      message: "Filtered delivery logs were exported.",
      status: "success",
    });
  };

  const resetLogFilters = () => {
    setLogFilters(DEFAULT_LOG_FILTERS);
  };

  useEffect(() => {
    void loadLogs();
  }, [logFilters.event, logFilters.status, logFilters.date_from, logFilters.date_to, logFilters.endpoint_id, logFilters.company_id]);

  const statsCards = [
    { label: "Total Endpoints", value: stats?.total_endpoints ?? endpoints.length },
    { label: "Active Endpoints", value: stats?.active_endpoints ?? endpoints.filter((endpoint) => endpoint.status === "active").length },
    { label: "Total Deliveries", value: stats?.total_deliveries ?? logs.length },
    { label: "Successful Deliveries", value: stats?.successful_deliveries ?? logs.filter((log) => log.delivery_status === "delivered").length },
    { label: "Failed Deliveries", value: stats?.failed_deliveries ?? logs.filter((log) => ["failed", "dead_letter"].includes(log.delivery_status)).length },
    { label: "Dead Letters", value: stats?.dead_letter_deliveries ?? logs.filter((log) => Boolean(log.dead_lettered_at)).length },
    { label: "Retry Queue", value: stats?.retry_queue ?? logs.filter((log) => log.delivery_status === "retrying").length },
    { label: "Success Rate", value: `${stats?.success_rate ?? 0}%` },
  ];

  return (
    <Content>
      <PageHeader
        title="Webhooks"
        subtitle="Connect Briksy to external systems with signed deliveries, retries, and delivery logs"
      />

      <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-5">
        <div className="d-flex flex-wrap gap-2">
          <button className="btn btn-primary" onClick={startCreate}>
            New Webhook
          </button>
          <button className="btn btn-light" onClick={() => navigate("/admin/webhooks/docs")}>
            View Documentation
          </button>
          <button className="btn btn-light" onClick={() => void refreshAll()}>
            Refresh
          </button>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-outline-secondary" onClick={() => void exportLogs("csv")} disabled={!visibleLogs.length}>
            Export CSV
          </button>
          <button className="btn btn-outline-secondary" onClick={() => void exportLogs("xlsx")} disabled={!visibleLogs.length}>
            Export Excel
          </button>
        </div>
      </div>

      {stats && (stats.retry_queue > 0 || stats.pending_retries > 0 || stats.problem_endpoints.some((endpoint) => endpoint.failure_count >= 3)) ? (
        <div className="alert alert-warning d-flex flex-wrap justify-content-between align-items-center mb-5">
          <div>
            <div className="fw-semibold mb-1">Webhook queue attention required</div>
            <div className="text-muted">
              Pending retries: {stats.pending_retries}. Retry queue: {stats.retry_queue}. Dead letter deliveries: {stats.dead_letter_deliveries}. High-failure endpoints are highlighted below.
            </div>
          </div>
        </div>
      ) : null}

      {feedback ? (
        <div className={`alert alert-${feedback.status} mb-5`}>
          <div className="fw-semibold">{feedback.title}</div>
          <div>{feedback.message}</div>
          {feedback.details ? <div className="mt-2 font-monospace small text-break">{feedback.details}</div> : null}
          {feedback.httpStatus !== undefined ? (
            <div className="mt-2 small">
              HTTP Status: {feedback.httpStatus ?? "-"} | Response Time: {feedback.responseTimeMs ?? "-"} ms
            </div>
          ) : null}
          {feedback.responseBody ? <pre className="mt-2 mb-0 small bg-light rounded-3 p-3 text-break">{feedback.responseBody}</pre> : null}
        </div>
      ) : null}

      {error ? <div className="alert alert-danger mb-5">{error}</div> : null}

      <div className="row g-4 mb-5">
        {statsCards.map((card) => (
          <div className="col-md-6 col-xl-3" key={card.label}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column justify-content-between">
                <div className="text-muted fs-8 text-uppercase fw-semibold">{card.label}</div>
                <div className="fs-2hx fw-bold mt-3">{card.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card mb-5">
        <div className="card-header border-0 pb-0">
          <ul className="nav nav-tabs nav-line-tabs nav-line-tabs-2x">
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "endpoints" ? "active" : ""}`} onClick={() => setActiveTab("endpoints")}>
                Endpoints
              </button>
            </li>
            <li className="nav-item">
              <button className={`nav-link ${activeTab === "logs" ? "active" : ""}`} onClick={() => setActiveTab("logs")}>
                Delivery Logs
              </button>
            </li>
          </ul>
        </div>
        <div className="card-body">
          {activeTab === "endpoints" ? (
            <>
              <div className="row g-3 mb-4">
                <div className="col-md-4">
                  <input
                    className="form-control form-control-solid"
                    placeholder="Search by name or URL"
                    value={endpointFilters.search}
                    onChange={(e) => setEndpointFilters((current) => ({ ...current, search: e.target.value }))}
                  />
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select form-select-solid"
                    value={endpointFilters.status}
                    onChange={(e) => setEndpointFilters((current) => ({ ...current, status: e.target.value }))}
                  >
                    <option value="">All statuses</option>
                    <option value="active">Active</option>
                    <option value="disabled">Disabled</option>
                  </select>
                </div>
                <div className="col-md-3">
                  <select
                    className="form-select form-select-solid"
                    value={endpointFilters.event}
                    onChange={(e) => setEndpointFilters((current) => ({ ...current, event: e.target.value }))}
                  >
                    <option value="">All events</option>
                    {Object.entries(supportedEvents).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-2 d-flex justify-content-md-end gap-2">
                  <button className="btn btn-light" onClick={() => setEndpointFilters(DEFAULT_ENDPOINT_FILTERS)}>
                    Reset
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="row g-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <div className="col-12" key={index}>
                      <div className="placeholder-glow">
                        <span className="placeholder col-12 rounded-3" style={{ height: 88 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : filteredEndpoints.length === 0 ? (
                <div className="alert alert-info mb-0">No webhook endpoints match the current filters.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle table-row-bordered table-row-dashed">
                    <thead>
                      <tr className="text-muted fw-semibold fs-7 text-uppercase">
                        <th>Name</th>
                        <th>URL</th>
                        <th>Events</th>
                        <th>Status</th>
                        <th>Last Delivery</th>
                        <th>Created By</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEndpoints.map((endpoint) => {
                        const hasFailures = (stats?.problem_endpoints ?? []).some((problem) => problem.id === endpoint.id && problem.failure_count >= 3);

                        return (
                          <tr key={endpoint.id} className={hasFailures ? "table-warning" : undefined}>
                            <td className="fw-semibold">{endpoint.name}</td>
                            <td className="text-truncate" style={{ maxWidth: 280 }}>
                              {endpoint.endpoint_url}
                            </td>
                            <td>
                              <div className="d-flex flex-wrap gap-2">
                                {endpoint.events.map((event) => (
                                  <span key={event} className="badge badge-light-primary">
                                    {supportedEvents[event] ?? event}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td>
                              <span className={`badge ${endpoint.status === "active" ? "badge-light-success" : "badge-light-secondary"}`}>
                                {endpoint.status}
                              </span>
                              <div className={`badge mt-2 ${
                                endpoint.health_status === "healthy"
                                  ? "badge-light-success"
                                  : endpoint.health_status === "warning"
                                    ? "badge-light-warning"
                                    : endpoint.health_status === "critical"
                                      ? "badge-light-danger"
                                      : "badge-light-secondary"
                              }`}>
                                {endpoint.health_status}
                              </div>
                            </td>
                            <td>
                              {endpoint.last_delivery ? (
                                <div>
                                  <div className="fw-semibold text-capitalize">{endpoint.last_delivery.delivery_status}</div>
                                  <div className="text-muted fs-8">{formatDate(endpoint.last_delivery.created_at)}</div>
                                </div>
                              ) : (
                                <span className="text-muted">No deliveries yet</span>
                              )}
                            </td>
                            <td>{endpoint.created_by_user?.name ?? "System"}</td>
                            <td className="text-end">
                              <div className="d-flex flex-wrap justify-content-end gap-2">
                                <button className="btn btn-sm btn-light" onClick={() => startEdit(endpoint)}>
                                  Edit
                                </button>
                                <button className="btn btn-sm btn-light-primary" onClick={() => void sendTestEvent(endpoint)} disabled={busyId === endpoint.id}>
                                  Send Test Event
                                </button>
                                <button className="btn btn-sm btn-light-warning" onClick={() => void regenerateSecret(endpoint)} disabled={busyId === endpoint.id}>
                                  Regenerate Secret
                                </button>
                                <button className="btn btn-sm btn-light-danger" onClick={() => void remove(endpoint)} disabled={busyId === endpoint.id}>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="row g-3 mb-4 align-items-end">
                <div className="col-md-3">
                  <label className="form-label">Event</label>
                  <input
                    className="form-control form-control-solid"
                    placeholder="user.created"
                    value={logFilters.event}
                    onChange={(e) => setLogFilters((current) => ({ ...current, event: e.target.value }))}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">Status</label>
                  <select
                    className="form-select form-select-solid"
                    value={logFilters.status}
                    onChange={(e) => setLogFilters((current) => ({ ...current, status: e.target.value }))}
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="retrying">Retrying</option>
                    <option value="delivered">Delivered</option>
                    <option value="failed">Failed</option>
                    <option value="dead_letter">Dead Letter</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <label className="form-label">From</label>
                  <input
                    type="date"
                    className="form-control form-control-solid"
                    value={logFilters.date_from}
                    onChange={(e) => setLogFilters((current) => ({ ...current, date_from: e.target.value }))}
                  />
                </div>
                <div className="col-md-2">
                  <label className="form-label">To</label>
                  <input
                    type="date"
                    className="form-control form-control-solid"
                    value={logFilters.date_to}
                    onChange={(e) => setLogFilters((current) => ({ ...current, date_to: e.target.value }))}
                  />
                </div>
                <div className="col-md-3">
                  <label className="form-label">Endpoint</label>
                  <select
                    className="form-select form-select-solid"
                    value={logFilters.endpoint_id}
                    onChange={(e) => setLogFilters((current) => ({ ...current, endpoint_id: e.target.value }))}
                  >
                    <option value="">All endpoints</option>
                    {endpoints.map((endpoint) => (
                      <option key={endpoint.id} value={endpoint.id}>
                        {endpoint.name}
                      </option>
                    ))}
                  </select>
                </div>
                {isSuperAdmin ? (
                  <div className="col-md-3">
                    <label className="form-label">Company</label>
                    <input
                      className="form-control form-control-solid"
                      placeholder="Company UUID"
                      value={logFilters.company_id}
                      onChange={(e) => setLogFilters((current) => ({ ...current, company_id: e.target.value }))}
                    />
                  </div>
                ) : null}
                <div className="col-md-3 d-flex gap-2">
                  <button className="btn btn-light" onClick={resetLogFilters}>
                    Reset
                  </button>
                </div>
              </div>

              {logsLoading ? (
                <div className="row g-3">
                  {Array.from({ length: 4 }).map((_, index) => (
                    <div className="col-12" key={index}>
                      <div className="placeholder-glow">
                        <span className="placeholder col-12 rounded-3" style={{ height: 72 }} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : visibleLogs.length === 0 ? (
                <div className="alert alert-info mb-0">No webhook deliveries match the current filters.</div>
              ) : (
                <div className="table-responsive">
                  <table className="table align-middle table-row-bordered table-row-dashed">
                    <thead>
                      <tr className="text-muted fw-semibold fs-7 text-uppercase">
                        <th>Event</th>
                        <th>Endpoint</th>
                        <th>Status</th>
                        <th>HTTP</th>
                        <th>Response Time</th>
                        <th>Retries</th>
                        <th>Timestamp</th>
                        <th className="text-end">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleLogs.map((log) => {
                        const displayStatus = log.dead_lettered_at ? "dead_letter" : log.delivery_status;

                        return (
                          <tr key={log.id}>
                            <td className="fw-semibold">{supportedEvents[log.event] ?? log.event}</td>
                            <td className="text-truncate" style={{ maxWidth: 260 }}>
                              {log.endpoint_url}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  displayStatus === "delivered"
                                    ? "badge-light-success"
                                    : ["failed", "dead_letter"].includes(displayStatus)
                                      ? "badge-light-danger"
                                      : "badge-light-warning"
                                }`}
                              >
                                {displayStatus}
                              </span>
                            </td>
                            <td>{log.http_status ?? "-"}</td>
                            <td>{log.response_time_ms ? `${log.response_time_ms} ms` : "-"}</td>
                            <td>
                              {log.attempt_count}/{log.retry_count}
                            </td>
                            <td>{formatDate(log.created_at)}</td>
                            <td className="text-end">
                              <div className="d-flex flex-wrap justify-content-end gap-2">
                                <button
                                  className="btn btn-sm btn-light"
                                  onClick={async () => {
                                    try {
                                      setSelectedLog(await fetchWebhookLogApi(log.id));
                                    } catch (err) {
                                      setError(err instanceof Error ? err.message : "Failed to load webhook log.");
                                    }
                                  }}
                                >
                                  View
                                </button>
                                <button
                                  className="btn btn-sm btn-light-primary"
                                  onClick={() => void copyText(flattenPayload(log.payload))}
                                >
                                  Copy Payload
                                </button>
                                <button
                                  className="btn btn-sm btn-light-primary"
                                  onClick={() => void copyText(log.response_body ?? "")}
                                >
                                  Copy Response
                                </button>
                                <button
                                  className="btn btn-sm btn-light-primary"
                                  onClick={() => void copyText(log.signature ?? "")}
                                >
                                  Copy Signature
                                </button>
                                {displayStatus !== "delivered" ? (
                                  <button className="btn btn-sm btn-light-warning" onClick={() => void retryDelivery(log)} disabled={busyId === log.id}>
                                    Retry
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header border-0">
          <div>
            <h4 className="mb-1">Event categories</h4>
            <div className="text-muted">Group events by lifecycle and manage selections quickly.</div>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-sm btn-light" onClick={selectAllEvents} disabled={!editing}>
              Select All
            </button>
            <button className="btn btn-sm btn-light" onClick={deselectAllEvents} disabled={!editing}>
              Deselect All
            </button>
          </div>
        </div>
        <div className="card-body">
          {Object.keys(groupedEvents).length === 0 ? (
            <div className="text-muted">Event catalog will appear after the first load.</div>
          ) : (
            <div className="accordion accordion-icon-toggle" id="webhook-event-categories">
              {groupedEventEntries.map(([category, events]) => {
                const isExpanded = expandedGroups[category] ?? true;
                return (
                  <div className="accordion-item" key={category}>
                    <h2 className="accordion-header">
                      <button
                        className={`accordion-button ${isExpanded ? "" : "collapsed"}`}
                        type="button"
                        onClick={() => setExpandedGroups((current) => ({ ...current, [category]: !isExpanded }))}
                      >
                        <div className="d-flex flex-column align-items-start">
                          <span className="fw-semibold">{category}</span>
                          <span className="text-muted fs-8">Events in this category are synchronized from the central webhook registry.</span>
                        </div>
                      </button>
                    </h2>
                    <div className={`accordion-collapse collapse ${isExpanded ? "show" : ""}`}>
                      <div className="accordion-body">
                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <button type="button" className="btn btn-sm btn-light" onClick={() => setGroupEvents(category, true)}>
                            Select All
                          </button>
                          <button type="button" className="btn btn-sm btn-light" onClick={() => setGroupEvents(category, false)}>
                            Deselect All
                          </button>
                        </div>
                        <div className="row g-3">
                          {events.map((event) => (
                            <div className="col-md-6 col-xl-4" key={event.key}>
                              <label className="form-check form-check-custom form-check-solid border rounded-4 p-3 h-100">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={editing?.events.includes(event.key) ?? false}
                                  onChange={() => toggleEvent(event.key)}
                                  disabled={!editing}
                                />
                                <span className="form-check-label ms-3">
                                  <span className="fw-semibold d-block">{event.display_name}</span>
                                  <span className="text-muted fs-8">{event.key}</span>
                                  {event.description ? <span className="text-muted fs-8 d-block">{event.description}</span> : null}
                                </span>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <ModalShell
          title={editingId ? "Edit Webhook" : "New Webhook"}
          onClose={() => setEditing(null)}
          onSubmit={save}
          isSubmitting={saving}
          submitLabel={editingId ? "Update Webhook" : "Create Webhook"}
          isValid={Boolean(editing.name && editing.endpoint_url && editing.events.length > 0)}
        >
          <div className="fv-row mb-4">
            <label className="form-label required">Name</label>
            <input
              className="form-control form-control-solid"
              value={editing.name}
              onChange={(e) => setEditing((current) => (current ? { ...current, name: e.target.value } : current))}
            />
          </div>

          <div className="fv-row mb-4">
            <label className="form-label required">Endpoint URL</label>
            <input
              className="form-control form-control-solid"
              placeholder="https://example.com/webhooks/briksy"
              value={editing.endpoint_url}
              onChange={(e) => setEditing((current) => (current ? { ...current, endpoint_url: e.target.value } : current))}
            />
            <div className="text-muted fs-8 mt-2">HTTPS is required. HTTP endpoints will be rejected by the delivery engine.</div>
          </div>

          <div className="row g-4">
            <div className="col-md-8 fv-row">
              <label className="form-label required">Secret Key</label>
              <input
                className="form-control form-control-solid"
                value={editing.secret_key ?? ""}
                onChange={(e) => setEditing((current) => (current ? { ...current, secret_key: e.target.value } : current))}
              />
            </div>
            <div className="col-md-4 fv-row">
              <label className="form-label">&nbsp;</label>
              <button type="button" className="btn btn-light w-100" onClick={() => setEditing((current) => (current ? { ...current, secret_key: generateSecret() } : current))}>
                Generate
              </button>
            </div>
          </div>

          <div className="fv-row mt-4 mb-4">
            <label className="form-label">Description</label>
            <textarea
              className="form-control form-control-solid"
              rows={3}
              value={editing.description ?? ""}
              onChange={(e) => setEditing((current) => (current ? { ...current, description: e.target.value } : current))}
            />
          </div>

          <div className="fv-row mb-4">
            <label className="form-label required">Retry Count</label>
            <input
              type="number"
              min={0}
              max={10}
              className="form-control form-control-solid"
              value={editing.retry_count ?? 5}
              onChange={(e) =>
                setEditing((current) =>
                  current ? { ...current, retry_count: Math.max(0, Number(e.target.value) || 0) } : current,
                )
              }
            />
          </div>

          <div className="fv-row mb-4">
            <label className="form-label required">Events</label>
            <div className="border rounded-4 p-4">
              {Object.keys(groupedEvents).length === 0 ? (
                <div className="text-muted">No events available.</div>
              ) : (
                <div className="d-flex flex-column gap-4">
                  {groupedEventEntries.map(([category, events]) => (
                    <div key={category}>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                          <div className="fw-semibold">{category}</div>
                          <div className="text-muted fs-8">Registry-managed webhook events.</div>
                        </div>
                        <div className="d-flex gap-2">
                          <button type="button" className="btn btn-sm btn-light" onClick={() => setGroupEvents(category, true)}>
                            Select All
                          </button>
                          <button type="button" className="btn btn-sm btn-light" onClick={() => setGroupEvents(category, false)}>
                            Deselect All
                          </button>
                        </div>
                      </div>
                      <div className="row g-3">
                        {events.map((event) => (
                          <div className="col-md-6" key={event.key}>
                            <label className="form-check form-check-custom form-check-solid">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={editing.events.includes(event.key)}
                                onChange={() => toggleEvent(event.key)}
                              />
                              <span className="form-check-label ms-3">
                                <span className="fw-semibold d-block">{event.display_name}</span>
                                <span className="text-muted fs-8">{event.key}</span>
                                {event.description ? <span className="text-muted fs-8 d-block">{event.description}</span> : null}
                              </span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="fv-row mb-2">
            <label className="form-check form-switch form-check-custom form-check-solid">
              <input
                className="form-check-input"
                type="checkbox"
                checked={editing.status === "active"}
                onChange={(e) =>
                  setEditing((current) =>
                    current ? { ...current, status: e.target.checked ? "active" : "disabled" } : current,
                  )
                }
              />
              <span className="form-check-label ms-3">Active</span>
            </label>
          </div>
        </ModalShell>
      ) : null}

      {selectedLog ? (
        <ModalShell title={`Delivery log: ${selectedLog.event}`} onClose={() => setSelectedLog(null)} onSubmit={() => setSelectedLog(null)} submitLabel="Close" isValid>
          <div className="row g-3 mb-4">
            <div className="col-md-4">
              <div className="text-muted fs-8">Status</div>
              <div className="fw-semibold text-capitalize">{selectedLog.delivery_status}</div>
            </div>
            <div className="col-md-4">
              <div className="text-muted fs-8">HTTP</div>
              <div className="fw-semibold">{selectedLog.http_status ?? "-"}</div>
            </div>
            <div className="col-md-4">
              <div className="text-muted fs-8">Attempts</div>
              <div className="fw-semibold">
                {selectedLog.attempt_count}/{selectedLog.retry_count}
              </div>
            </div>
            <div className="col-md-4">
              <div className="text-muted fs-8">Response Time</div>
              <div className="fw-semibold">{selectedLog.response_time_ms ? `${selectedLog.response_time_ms} ms` : "-"}</div>
            </div>
            <div className="col-md-4">
              <div className="text-muted fs-8">Endpoint</div>
              <div className="fw-semibold text-break">{selectedLog.endpoint_url}</div>
            </div>
            <div className="col-md-4">
              <div className="text-muted fs-8">Signature</div>
              <div className="fw-semibold text-break">{selectedLog.signature ?? "-"}</div>
            </div>
          </div>

          <div className="d-flex flex-wrap gap-2 mb-3">
            <button className="btn btn-light" onClick={() => void copyText(flattenPayload(selectedLog.payload))}>
              Copy Payload
            </button>
            <button className="btn btn-light" onClick={() => void copyText(selectedLog.response_body ?? "")}>
              Copy Response
            </button>
            <button className="btn btn-light" onClick={() => void copyText(selectedLog.signature ?? "")}>
              Copy Signature
            </button>
          </div>

          <div className="fv-row mb-4">
            <label className="form-label">Payload</label>
            <textarea className="form-control form-control-solid font-monospace" rows={10} value={flattenPayload(selectedLog.payload)} readOnly />
          </div>
          <div className="fv-row mb-4">
            <label className="form-label">Response</label>
            <textarea className="form-control form-control-solid font-monospace" rows={8} value={selectedLog.response_body ?? ""} readOnly />
          </div>
          <div className="fv-row">
            <label className="form-label">Error</label>
            <textarea className="form-control form-control-solid font-monospace" rows={4} value={selectedLog.error_message ?? ""} readOnly />
          </div>
        </ModalShell>
      ) : null}

      <div className="card mt-5">
        <div className="card-body">
          <div className="fw-semibold mb-2">Delivery summary</div>
          <div className="row g-3">
            {(stats?.problem_endpoints ?? []).length > 0 ? (
              (stats?.problem_endpoints ?? []).map((endpoint) => (
                <div className="col-md-6 col-xl-4" key={endpoint.id}>
                  <div className="border rounded-4 p-4 h-100">
                    <div className="fw-semibold">{endpoint.name}</div>
                    <div className="text-muted fs-8">Status: {endpoint.status}</div>
                    <div className="mt-2 badge badge-light-danger">Failed deliveries: {endpoint.failure_count}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-12 text-muted">No problem endpoints detected.</div>
            )}
          </div>
        </div>
      </div>
    </Content>
  );
}
