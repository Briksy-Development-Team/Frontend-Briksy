import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { Content } from "../../../_metronic/layout/components/content";
import { KTCard } from "../../../_metronic/helpers";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { EntityTable } from "../../modules/apps/shared_table/entity-list/table/EntityTable";
import Pagination from "../../modules/apps/shared_table/entity-list/components/Pagination";
import { useRoleAccess } from "../../modules/auth";
import { ActivityLogDetailModal } from "../../services/features/activity_logs/components/ActivityLogDetailModal";
import { fetchActivityLogsApi } from "../../services/features/activity_logs/activity-log.api";
import {
  activityLogActions,
  activityLogModules,
  getActivityLogColumns,
} from "../../services/features/activity_logs/activity-log.config";
import type {
  ActivityLog,
  ActivityLogQueryParams,
} from "../../services/features/activity_logs/activity-log.types";
import type { Column } from "../../modules/apps/shared_table/entity-list/EntityList";
import { KTIcon } from "../../../_metronic/helpers";

const defaultParams: ActivityLogQueryParams = {
  page: 1,
  per_page: 10,
  search: "",
  sort: "",
  direction: "desc",
  filters: {},
};

const ActivityLogsPage = () => {
  const { isSuperAdmin } = useRoleAccess();

  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [params, setParams] = useState<ActivityLogQueryParams>(defaultParams);
  const [filtersDraft, setFiltersDraft] = useState<Record<string, string>>({
    date_from: "",
    date_to: "",
    user: "",
    action: "",
    module: "",
    ip_address: "",
    device: "",
  });

  const columns = useMemo(
    () => getActivityLogColumns(isSuperAdmin) as Column<ActivityLog>[],
    [isSuperAdmin],
  );

  useEffect(() => {
    let active = true;

    setLoading(true);
    setError(null);

    void fetchActivityLogsApi(params)
      .then((response) => {
        if (!active) {
          return;
        }

        setLogs(response.data);
        setTotal(response.total);
      })
      .catch((requestError: unknown) => {
        if (!active) {
          return;
        }

        setError(requestError instanceof Error ? requestError.message : "Failed to load activity logs");
        setLogs([]);
        setTotal(0);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [params, refreshKey]);

  const applyFilters = () => {
    const filters: Record<string, string> = {};

    Object.entries(filtersDraft).forEach(([key, value]) => {
      if (value.trim()) {
        filters[key] = value.trim();
      }
    });

    setParams((current) => ({
      ...current,
      page: 1,
      filters,
    }));
  };

  const clearFilters = () => {
    setFiltersDraft({
      date_from: "",
      date_to: "",
      user: "",
      action: "",
      module: "",
      ip_address: "",
      device: "",
    });

    setParams((current) => ({
      ...current,
      page: 1,
      search: "",
      filters: {},
    }));
  };

  const updateFilter = (key: string, value: string) => {
    setFiltersDraft((current) => ({ ...current, [key]: value }));
  };

  const rowActions = [
    {
      label: "View details",
      onClick: (row: ActivityLog) => setSelectedLog(row),
    },
  ];

  const filterSummary = [
    params.search ? `Search: ${params.search}` : null,
    ...Object.entries(params.filters ?? {})
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .map(([key, value]) => `${key.replace(/_/g, " ")}: ${String(value)}`),
  ].filter(Boolean) as string[];

  return (
    <Content>
        <PageHeader
        title="Activity Logs"
        subtitle={
          isSuperAdmin
            ? "View and audit platform activity limited to super admin scope only."
            : "View activity captured for your organisation only."
        }
      />

      <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-3">
        <div className="d-flex flex-wrap gap-2">
          {filterSummary.length > 0 ? (
            filterSummary.map((item) => (
              <span key={item} className="badge badge-light-primary">
                {item}
              </span>
            ))
          ) : (
            <span className="text-muted">No filters applied.</span>
          )}
        </div>

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-light-primary" onClick={() => setRefreshKey((value) => value + 1)}>
            <KTIcon iconName="arrows-circle" className="fs-2 me-1" />
            Refresh
          </button>
          <button type="button" className="btn btn-light" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </div>

      <KTCard>
        <div className="card-header border-0 pt-6">
          <div className="row g-3 w-100">
            <div className="col-lg-3">
              <label className="form-label">Search</label>
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="User, email, action, module, description"
                value={params.search ?? ""}
                onChange={(event) =>
                  setParams((current) => ({
                    ...current,
                    page: 1,
                    search: event.target.value,
                  }))
                }
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Date From</label>
              <input
                type="date"
                className="form-control form-control-solid"
                value={filtersDraft.date_from}
                onChange={(event) => updateFilter("date_from", event.target.value)}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Date To</label>
              <input
                type="date"
                className="form-control form-control-solid"
                value={filtersDraft.date_to}
                onChange={(event) => updateFilter("date_to", event.target.value)}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">User</label>
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Name / email / ID"
                value={filtersDraft.user}
                onChange={(event) => updateFilter("user", event.target.value)}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Action</label>
              <select
                className="form-select form-select-solid"
                value={filtersDraft.action}
                onChange={(event) => updateFilter("action", event.target.value)}
              >
                <option value="">All</option>
                {activityLogActions.map((action) => (
                  <option key={action} value={action}>
                    {action}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2">
              <label className="form-label">Module</label>
              <select
                className="form-select form-select-solid"
                value={filtersDraft.module}
                onChange={(event) => updateFilter("module", event.target.value)}
              >
                <option value="">All</option>
                {activityLogModules.map((module) => (
                  <option key={module} value={module}>
                    {module}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-lg-2">
              <label className="form-label">IP Address</label>
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="127.0.0.1"
                value={filtersDraft.ip_address}
                onChange={(event) => updateFilter("ip_address", event.target.value)}
              />
            </div>

            <div className="col-lg-2">
              <label className="form-label">Device</label>
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Browser / device"
                value={filtersDraft.device}
                onChange={(event) => updateFilter("device", event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="card-body pt-0">
          <div className="d-flex justify-content-end gap-2 mb-4">
            <button type="button" className="btn btn-primary" onClick={applyFilters}>
              Apply Filters
            </button>
          </div>

          {loading && (
            <div className="d-flex justify-content-center py-10">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!loading && error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <>
              <EntityTable
                data={logs}
                columns={columns}
                rowActions={rowActions}
              />

              {logs.length === 0 && (
                <div className="alert alert-light border mt-4 mb-0">
                  No activity logs found for the selected filters.
                </div>
              )}

              <Pagination
                page={params.page ?? 1}
                per_page={params.per_page ?? 10}
                total={total}
                onChange={(page) => setParams((current) => ({ ...current, page }))}
                onPageSizeChange={(size) =>
                  setParams((current) => ({ ...current, per_page: size, page: 1 }))
                }
              />
            </>
          )}
        </div>
      </KTCard>

      {selectedLog && (
        <ActivityLogDetailModal log={selectedLog} onClose={() => setSelectedLog(null)} />
      )}
    </Content>
  );
};

const ActivityLogsRoute = () => {
  return (
    <Routes>
      <Route index element={<ActivityLogsPage />} />
    </Routes>
  );
};

export default ActivityLogsRoute;
