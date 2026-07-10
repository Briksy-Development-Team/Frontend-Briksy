import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { Link } from "react-router-dom";
import { PageTitle } from "../../../_metronic/layout/core";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { useRoleAccess } from "../../modules/auth";
import {
  fetchAdminDashboardSummary,
  fetchSuperAdminDashboardSummary,
  type DashboardFilters,
  type AdminDashboardSummary,
  type SuperAdminDashboardSummary,
} from "../../services/features/dashboard/dashboard.api";
import { formatDateTime } from "../../services/utils/dateFormat";
import DashboardChart from "./components/DashboardChart";

const MetricCard = ({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone: string;
}) => (
  <div className="col-xl-3 col-md-6">
    <div className="card h-100 border-0 shadow-sm" style={{ background: tone }}>
      <div className="card-body d-flex flex-column justify-content-between">
        <div className="text-white opacity-75 fw-semibold fs-7">{label}</div>
        <div className="text-white fs-1 fw-bold">{value}</div>
      </div>
    </div>
  </div>
);

const formatMoney = (value: number | null | undefined, currency = "AUD") =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const formatPercent = (value: number | null | undefined) =>
  `${(value ?? 0).toFixed(1)}%`;

const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

const downloadCsv = (filename: string, headers: string[], rows: Array<Array<unknown>>) => {
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const DashboardPage: FC = () => {
  const { roles, isSuperAdmin } = useRoleAccess();
  const isAgent = roles.includes("admin_staff") && !roles.includes("admin");
  const [summary, setSummary] = useState<SuperAdminDashboardSummary | AdminDashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    date_from: "",
    date_to: "",
    role: "",
    agent_id: "",
    organization_id: "",
  });

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const loader = isSuperAdmin ? fetchSuperAdminDashboardSummary : fetchAdminDashboardSummary;

    void loader(filters)
      .then((data) => {
        if (active) {
          setSummary(data);
        }
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err instanceof Error ? err.message : "Failed to load dashboard summary");
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [isSuperAdmin, filters]);

  const superAdminSummary = isSuperAdmin ? (summary as SuperAdminDashboardSummary | null) : null;
  const adminSummary = !isSuperAdmin ? (summary as AdminDashboardSummary | null) : null;
  const agentOptions = (isSuperAdmin ? superAdminSummary?.agent_leaderboard : adminSummary?.agent_leaderboard) ?? [];
  const companyOptions = superAdminSummary?.recent_companies ?? [];

  const setFilter = (key: keyof DashboardFilters, value: string) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const clearAnalyticsFilters = () => {
    setFilters({
      date_from: "",
      date_to: "",
      role: "",
      agent_id: "",
      organization_id: "",
    });
  };

  return (
    <>
      <ToolbarWrapper />
      <Content>
        {loading && <div className="alert alert-light">Loading dashboard analytics...</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {isSuperAdmin && (
          <>
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-5">
              <div>
                <div className="text-muted fs-7 text-uppercase fw-semibold">Portal</div>
                <h2 className="fw-bold mb-1">Super Admin Dashboard</h2>
                <div className="text-gray-600">Platform-wide monitoring, growth, and governance.</div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-6">
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-lg-3">
                    <label className="form-label fw-semibold">Date From</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.date_from ?? ""}
                      onChange={(event) => setFilter("date_from", event.target.value)}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label fw-semibold">Date To</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.date_to ?? ""}
                      onChange={(event) => setFilter("date_to", event.target.value)}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={filters.role ?? ""}
                      onChange={(event) => setFilter("role", event.target.value)}
                    >
                      <option value="">All roles</option>
                      <option value="admin_staff">Admin staff</option>
                      <option value="super_admin_employee">Super admin employee</option>
                    </select>
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label fw-semibold">Team / Agent</label>
                    <select
                      className="form-select"
                      value={filters.agent_id ?? ""}
                      onChange={(event) => setFilter("agent_id", event.target.value)}
                    >
                      <option value="">All agents</option>
                      {agentOptions.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label fw-semibold">Company</label>
                    <select
                      className="form-select"
                      value={filters.organization_id ?? ""}
                      onChange={(event) => setFilter("organization_id", event.target.value)}
                    >
                      <option value="">All companies</option>
                      {companyOptions.map((company) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-3">
                    <button type="button" className="btn btn-light w-100" onClick={clearAnalyticsFilters}>
                      Clear filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {superAdminSummary && (
              <>
                <div className="row g-5 mb-6">
                  <MetricCard label="Total Companies" value={superAdminSummary.total_companies} tone="#bf9f7d" />
                  <MetricCard label="Active Plans" value={superAdminSummary.active_plans} tone="#bf9f7d" />
                  <MetricCard label="Total Orders" value={superAdminSummary.total_orders} tone="#bf9f7d" />
                  <MetricCard label="Active Subscriptions" value={superAdminSummary.active_subscriptions} tone="#bf9f7d" />
                </div>

                <div className="row g-5 mb-8">
                  <div className="col-lg-3">
                    <div className="card h-100 shadow-sm border-0">
                      <div className="card-body">
                        <div className="text-muted fs-7">Monthly Revenue</div>
                        <div className="fw-bold fs-2 text-dark">{formatMoney(superAdminSummary.revenue_this_month)}</div>
                        <div className="text-gray-600 mt-2">Revenue recognized this month.</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="card h-100 shadow-sm border-0">
                      <div className="card-body">
                        <div className="text-muted fs-7">Property Count</div>
                        <div className="fw-bold fs-2 text-dark">{superAdminSummary.property_summary.total}</div>
                        <div className="text-gray-600 mt-2">All listings tracked on the platform.</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="card h-100 shadow-sm border-0">
                      <div className="card-body">
                        <div className="text-muted fs-7">Pending Review</div>
                        <div className="fw-bold fs-2 text-dark">{superAdminSummary.property_summary.pending_review}</div>
                        <div className="text-gray-600 mt-2">Waiting for a super-admin decision.</div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="card h-100 shadow-sm border-0">
                      <div className="card-body">
                        <div className="text-muted fs-7">Awaiting Location Verification</div>
                        <div className="fw-bold fs-2 text-dark">{superAdminSummary.property_summary.awaiting_location_verification}</div>
                        <div className="text-gray-600 mt-2">Approved records still needing verification.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row g-5 mb-8">
                  <div className="col-12">
                    <div className="card shadow-sm border-0">
                      <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                          <span className="card-label fw-bold fs-3 mb-1">Management Shortcuts</span>
                          <span className="text-muted mt-1 fw-semibold fs-7">Jump straight to the main record screens</span>
                        </h3>
                      </div>
                      <div className="card-body pt-0">
                        <div className="row g-4">
                          <div className="col-md-3">
                            <Link to="/super-admin/companies" className="card h-100 border border-light text-decoration-none">
                              <div className="card-body">
                                <div className="fw-bold fs-5 text-dark">Companies</div>
                                <div className="text-gray-600 mt-2">View and manage organization records.</div>
                              </div>
                            </Link>
                          </div>
                          <div className="col-md-3">
                            <Link to="/super-admin/seekers" className="card h-100 border border-light text-decoration-none">
                              <div className="card-body">
                                <div className="fw-bold fs-5 text-dark">Seekers</div>
                                <div className="text-gray-600 mt-2">Open seeker profiles and details.</div>
                              </div>
                            </Link>
                          </div>
                          <div className="col-md-3">
                            <Link to="/super-admin/plans" className="card h-100 border border-light text-decoration-none">
                              <div className="card-body">
                                <div className="fw-bold fs-5 text-dark">Plans</div>
                                <div className="text-gray-600 mt-2">Edit pricing and feature permissions.</div>
                              </div>
                            </Link>
                          </div>
                          <div className="col-md-3">
                            <Link to="/super-admin/orders" className="card h-100 border border-light text-decoration-none">
                              <div className="card-body">
                                <div className="fw-bold fs-5 text-dark">Orders</div>
                                <div className="text-gray-600 mt-2">Review subscriptions and billing activity.</div>
                              </div>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row g-5 gx-xxl-8 mb-8">
                  <div className="col-xxl-6">
                    <div className="card h-100">
                      <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                          <span className="card-label fw-bold fs-3 mb-1">Recent Companies</span>
                          <span className="text-muted mt-1 fw-semibold fs-7">Latest organizations added</span>
                        </h3>
                      </div>
                      <div className="card-body pt-0">
                        <div className="table-responsive">
                          <table className="table align-middle table-row-dashed fs-6 gy-3">
                            <tbody>
                              {superAdminSummary.recent_companies.map((company) => (
                                <tr key={company.id}>
                                  <td className="fw-bold">{company.name}</td>
                                  <td className="text-muted text-end">{company.created_at ? formatDateTime(company.created_at, { withRelative: false }) : "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-6">
                    <DashboardChart
                      className="h-100"
                      title="Platform Revenue"
                      subtitle="Monthly platform revenue trend"
                      chartType="bar"
                      actions={
                        <button
                          type="button"
                          className="btn btn-sm btn-light"
                          onClick={() =>
                            downloadCsv(
                              "platform_revenue.csv",
                              ["Month", "Revenue"],
                              superAdminSummary.trend_series.map((row) => [row.label, row.revenue]),
                            )
                          }
                        >
                          Export CSV
                        </button>
                      }
                      categories={superAdminSummary.trend_series.map((row) => row.label)}
                      series={[
                        { name: "Revenue", data: superAdminSummary.trend_series.map((row) => row.revenue) },
                      ]}
                    />
                  </div>
                </div>

            <div className="row g-5 gx-xxl-8 mb-8">
              <div className="col-xxl-6">
                <DashboardChart
                  className="h-100"
                  title="Platform Conversion"
                      subtitle="Monthly subscription conversion rate"
                      chartType="area"
                      actions={
                        <button
                          type="button"
                          className="btn btn-sm btn-light"
                          onClick={() =>
                            downloadCsv(
                              "platform_conversion.csv",
                              ["Month", "Conversion %"],
                              superAdminSummary.trend_series.map((row) => [row.label, row.company_conversion_rate]),
                            )
                          }
                        >
                          Export CSV
                        </button>
                      }
                      categories={superAdminSummary.trend_series.map((row) => row.label)}
                      series={[
                        { name: "Conversion %", data: superAdminSummary.trend_series.map((row) => row.company_conversion_rate) },
                      ]}
                    />
                  </div>
                  <div className="col-xxl-6">
                    <div className="card h-100">
                      <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                          <span className="card-label fw-bold fs-3 mb-1">Platform Snapshot</span>
                          <span className="text-muted mt-1 fw-semibold fs-7">Quick month-over-month summary</span>
                        </h3>
                      </div>
                      <div className="card-body pt-0">
                        <div className="table-responsive">
                          <table className="table align-middle table-row-dashed fs-6 gy-3">
                            <thead>
                              <tr className="text-start text-muted fw-bold fs-7 text-uppercase">
                                <th>Month</th>
                                <th>Companies</th>
                                <th>Subscriptions</th>
                                <th>Revenue</th>
                              </tr>
                            </thead>
                            <tbody>
                              {superAdminSummary.trend_series.map((row) => (
                                <tr key={row.label}>
                                  <td className="fw-semibold">{row.label}</td>
                                  <td>{row.companies}</td>
                                  <td>{row.subscriptions}</td>
                                  <td>{formatMoney(row.revenue)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                </div>
              </div>
            </div>

            <div className="row g-5 gx-xxl-8 mb-8">
              <div className="col-12">
                <DashboardChart
                  className="h-100 shadow-sm border-0"
                  title="Lead Funnel"
                  subtitle="Visited -> inquiry -> qualified -> won"
                  chartType="bar"
                  horizontal
                  showLegend={false}
                  actions={
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={() =>
                        downloadCsv(
                          "platform_lead_funnel.csv",
                          ["Stage", "Value"],
                          superAdminSummary.lead_funnel.map((row) => [row.stage, row.value]),
                        )
                      }
                    >
                      Export CSV
                    </button>
                  }
                  categories={superAdminSummary.lead_funnel.map((row) => row.stage)}
                  series={[
                    { name: "Leads", data: superAdminSummary.lead_funnel.map((row) => row.value) },
                  ]}
                />
              </div>
            </div>

            <div className="row g-5 gx-xxl-8 mb-8">
              <div className="col-xxl-5">
                {superAdminSummary.lead_source_funnel.length > 0 ? (
                      <DashboardChart
                        className="h-100 shadow-sm border-0"
                        title="Lead Source Funnel"
                        subtitle="Inquiries grouped by source"
                        chartType="bar"
                        horizontal
                        showLegend={false}
                        actions={
                          <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() =>
                              downloadCsv(
                                "lead_source_funnel.csv",
                                ["Source", "Leads", "Share %"],
                                superAdminSummary.lead_source_funnel.map((row) => [row.label, row.value, row.share]),
                              )
                            }
                          >
                            Export CSV
                          </button>
                        }
                        categories={superAdminSummary.lead_source_funnel.map((row) => row.label)}
                        series={[
                          {
                            name: "Leads",
                            data: superAdminSummary.lead_source_funnel.map((row) => row.value),
                          },
                        ]}
                      />
                    ) : (
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body d-flex flex-column justify-content-center align-items-start">
                          <div className="fw-bold fs-4 mb-2">Lead Source Funnel</div>
                          <div className="text-gray-600">No lead source data is available yet.</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-xxl-7">
                    <DashboardChart
                      className="h-100 shadow-sm border-0"
                      title="Monthly Revenue vs Leads"
                      subtitle="Revenue, leads, and close rate over time"
                      chartType="mixed"
                      actions={
                        <button
                          type="button"
                          className="btn btn-sm btn-light"
                          onClick={() =>
                            downloadCsv(
                              "monthly_revenue_vs_leads.csv",
                              ["Month", "Revenue", "Leads", "Close Rate %"],
                              superAdminSummary.monthly_pipeline.map((row) => [row.label, row.revenue, row.inquiries, row.close_rate]),
                            )
                          }
                        >
                          Export CSV
                        </button>
                      }
                      categories={superAdminSummary.monthly_pipeline.map((row) => row.label)}
                      series={[
                        { name: "Revenue", data: superAdminSummary.monthly_pipeline.map((row) => row.revenue), type: "bar" },
                        { name: "Leads", data: superAdminSummary.monthly_pipeline.map((row) => row.inquiries), type: "line" },
                        { name: "Close Rate %", data: superAdminSummary.monthly_pipeline.map((row) => row.close_rate), type: "line" },
                      ]}
                      yaxis={[
                        {
                          title: { text: "Revenue / Leads" },
                        },
                        {
                          opposite: true,
                          title: { text: "Close Rate %" },
                          labels: {
                            formatter: (value) => `${value.toFixed(0)}%`,
                          },
                        },
                      ]}
                    />
                  </div>
                </div>

                <div className="row g-5 gx-xxl-8 mb-8">
                  <div className="col-xxl-5">
                    {superAdminSummary.agent_leaderboard.length > 0 ? (
                      <DashboardChart
                        className="h-100 shadow-sm border-0"
                        title="Agent Performance"
                        subtitle="Top employees by revenue and conversion"
                        chartType="bar"
                        horizontal
                        showLegend={false}
                        actions={
                          <button
                            type="button"
                            className="btn btn-sm btn-light"
                            onClick={() =>
                              downloadCsv(
                                "agent_performance.csv",
                                ["Agent", "Company", "Leads", "Orders", "Revenue", "Conversion %"],
                                superAdminSummary.agent_leaderboard.map((row) => [
                                  row.name,
                                  row.organization ?? "",
                                  row.inquiries,
                                  row.orders,
                                  row.revenue,
                                  row.conversion_rate,
                                ]),
                              )
                            }
                          >
                            Export CSV
                          </button>
                        }
                        categories={superAdminSummary.agent_leaderboard.map((row) => row.name)}
                        series={[
                          {
                            name: "Revenue",
                            data: superAdminSummary.agent_leaderboard.map((row) => row.revenue),
                          },
                        ]}
                      />
                    ) : (
                      <div className="card h-100 shadow-sm border-0">
                        <div className="card-body d-flex flex-column justify-content-center align-items-start">
                          <div className="fw-bold fs-4 mb-2">Agent Performance</div>
                          <div className="text-gray-600">No agent-level activity has been recorded yet.</div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-xxl-7">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                      <span className="card-label fw-bold fs-3 mb-1">Top Agents</span>
                      <span className="text-muted mt-1 fw-semibold fs-7">Revenue, leads, orders, and conversion rate</span>
                    </h3>
                    <div className="card-toolbar">
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() =>
                          downloadCsv(
                            "top_agents.csv",
                            ["Agent", "Company", "Leads", "Orders", "Revenue", "Conversion %"],
                            superAdminSummary.agent_leaderboard.map((row) => [
                              row.name,
                              row.organization ?? "",
                              row.inquiries,
                              row.orders,
                              row.revenue,
                              row.conversion_rate,
                            ]),
                          )
                        }
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                      <div className="card-body pt-0">
                        <div className="table-responsive">
                          <table className="table align-middle table-row-dashed fs-6 gy-3">
                            <thead>
                              <tr className="text-start text-muted fw-bold fs-7 text-uppercase">
                                <th>Agent</th>
                                <th>Company</th>
                                <th>Leads</th>
                                <th>Orders</th>
                                <th>Revenue</th>
                                <th>Conv.</th>
                              </tr>
                            </thead>
                            <tbody>
                              {superAdminSummary.agent_leaderboard.map((row) => (
                                <tr key={row.id}>
                                  <td className="fw-semibold">{row.name}</td>
                                  <td>{row.organization ?? "—"}</td>
                                  <td>{row.inquiries}</td>
                                  <td>{row.orders}</td>
                                  <td>{formatMoney(row.revenue)}</td>
                                  <td>{formatPercent(row.conversion_rate)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        {!isSuperAdmin && adminSummary && (
          <>
            <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-5">
              <div>
                <div className="text-muted fs-7 text-uppercase fw-semibold">Portal</div>
                <h2 className="fw-bold mb-1">{isAgent ? "Agent Dashboard" : "Admin Dashboard"}</h2>
                <div className="text-gray-600">
                  {isAgent
                    ? "Work assigned listings, inquiries, and company tasks with your permissions."
                    : "Track your company performance, billing, and growth in one place."}
                </div>
              </div>
            </div>

            <div className="card shadow-sm border-0 mb-6">
              <div className="card-body">
                <div className="row g-3 align-items-end">
                  <div className="col-lg-3">
                    <label className="form-label fw-semibold">Date From</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.date_from ?? ""}
                      onChange={(event) => setFilter("date_from", event.target.value)}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label fw-semibold">Date To</label>
                    <input
                      type="date"
                      className="form-control"
                      value={filters.date_to ?? ""}
                      onChange={(event) => setFilter("date_to", event.target.value)}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label fw-semibold">Role</label>
                    <select
                      className="form-select"
                      value={filters.role ?? ""}
                      onChange={(event) => setFilter("role", event.target.value)}
                    >
                      <option value="">All roles</option>
                      <option value="admin">Admin</option>
                      <option value="admin_staff">Admin staff</option>
                    </select>
                  </div>
                  <div className="col-lg-3">
                    <label className="form-label fw-semibold">Team Member</label>
                    <select
                      className="form-select"
                      value={filters.agent_id ?? ""}
                      onChange={(event) => setFilter("agent_id", event.target.value)}
                    >
                      <option value="">All team members</option>
                      {agentOptions.map((agent) => (
                        <option key={agent.id} value={agent.id}>
                          {agent.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-3">
                    <button type="button" className="btn btn-light w-100" onClick={clearAnalyticsFilters}>
                      Clear filters
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-5 mb-6">
              <MetricCard label="Team Members" value={adminSummary.metrics.team_members} tone="#bf9f7d" />
              <MetricCard label="Properties" value={adminSummary.metrics.properties} tone="#bf9f7d" />
              <MetricCard label="Inquiries" value={adminSummary.metrics.inquiries} tone="#bf9f7d" />
              <MetricCard label="Orders" value={adminSummary.metrics.orders} tone="#bf9f7d" />
            </div>

            <div className="row g-5 mb-8">
              <div className="col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-muted fs-7">Pending Review</div>
                    <div className="fw-bold fs-2 text-dark">{adminSummary.metrics.pending_review_properties}</div>
                    <div className="text-gray-600 mt-2">Awaiting super-admin review.</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-muted fs-7">Approved</div>
                    <div className="fw-bold fs-2 text-dark">{adminSummary.metrics.approved_properties}</div>
                    <div className="text-gray-600 mt-2">Approved but not yet published.</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-muted fs-7">Rejected</div>
                    <div className="fw-bold fs-2 text-dark">{adminSummary.metrics.rejected_properties}</div>
                    <div className="text-gray-600 mt-2">Needs edits before resubmission.</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-muted fs-7">Archived</div>
                    <div className="fw-bold fs-2 text-dark">{adminSummary.metrics.archived_properties}</div>
                    <div className="text-gray-600 mt-2">No longer active in the workflow.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-5 mb-8">
              <div className="col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-muted fs-7">Lead Conversion</div>
                    <div className="fw-bold fs-2 text-dark">{formatPercent(adminSummary.lead_conversion_rate)}</div>
                    <div className="text-gray-600 mt-2">Orders divided by inquiries across the selected period.</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-muted fs-7">Monthly Revenue</div>
                    <div className="fw-bold fs-2 text-dark">{formatMoney(adminSummary.metrics.revenue_this_month)}</div>
                    <div className="text-gray-600 mt-2">Paid revenue generated this month.</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-muted fs-7">Average Order Value</div>
                    <div className="fw-bold fs-2 text-dark">{formatMoney(adminSummary.metrics.average_order_value)}</div>
                    <div className="text-gray-600 mt-2">Average paid order value for your company.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-5 mb-6">
              <div className="col-xl-5">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                      <span className="card-label fw-bold fs-3 mb-1">Current Subscription</span>
                      <span className="text-muted mt-1 fw-semibold fs-7">Your live billing and plan snapshot</span>
                    </h3>
                  </div>
                  <div className="card-body pt-0">
                    {adminSummary.current_subscription ? (
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between gap-3">
                          <span className="text-muted">Plan</span>
                          <strong>{adminSummary.current_subscription.plan_name ?? "—"}</strong>
                        </div>
                        <div className="d-flex justify-content-between gap-3">
                          <span className="text-muted">Billing cycle</span>
                          <strong className="text-capitalize">{adminSummary.current_subscription.billing_cycle ?? "—"}</strong>
                        </div>
                        <div className="d-flex justify-content-between gap-3">
                          <span className="text-muted">Status</span>
                          <strong className="text-capitalize">{adminSummary.current_subscription.status ?? "—"}</strong>
                        </div>
                        <div className="d-flex justify-content-between gap-3">
                          <span className="text-muted">Current total</span>
                          <strong>{formatMoney(adminSummary.current_subscription.amount, adminSummary.current_subscription.currency ?? "AUD")}</strong>
                        </div>
                        <div className="d-flex justify-content-between gap-3">
                          <span className="text-muted">Renewal date</span>
                          <strong>{adminSummary.current_subscription.current_period_end ? formatDateTime(adminSummary.current_subscription.current_period_end, { withRelative: false }) : "—"}</strong>
                        </div>
                      </div>
                    ) : (
                      <div className="alert alert-light border mb-0">
                        No active subscription found. Upgrade your plan to unlock more capacity.
                      </div>
                    )}
                    <div className="d-flex gap-3 mt-5">
                      <Link to="/admin/billing" className="btn btn-primary">
                        View Billing
                      </Link>
                      <Link to="/admin/referrals" className="btn btn-light">
                        Referral Insights
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-7">
                <DashboardChart
                  className="h-100 shadow-sm border-0"
                  title="Monthly Revenue"
                  subtitle="Paid revenue over the last six months"
                  chartType="bar"
                  actions={
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={() =>
                        downloadCsv(
                          "monthly_revenue.csv",
                          ["Month", "Revenue"],
                          adminSummary.trend_series.map((row) => [row.label, row.revenue]),
                        )
                      }
                    >
                      Export CSV
                    </button>
                  }
                  categories={adminSummary.trend_series.map((row) => row.label)}
                  series={[
                    { name: "Revenue", data: adminSummary.trend_series.map((row) => row.revenue) },
                  ]}
                />
              </div>
            </div>

            <div className="row g-5 gx-xxl-8 mb-8">
              <div className="col-xxl-6">
                <DashboardChart
                  className="h-100"
                  title="Lead Conversion"
                  subtitle="Orders as a percentage of inquiries"
                  chartType="area"
                  actions={
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={() =>
                        downloadCsv(
                          "lead_conversion.csv",
                          ["Month", "Conversion %"],
                          adminSummary.trend_series.map((row) => [row.label, row.lead_conversion_rate]),
                        )
                      }
                    >
                      Export CSV
                    </button>
                  }
                  categories={adminSummary.trend_series.map((row) => row.label)}
                  series={[
                    { name: "Conversion %", data: adminSummary.trend_series.map((row) => row.lead_conversion_rate) },
                  ]}
                />
              </div>
              <div className="col-xxl-6">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                      <span className="card-label fw-bold fs-3 mb-1">Performance Trends</span>
                      <span className="text-muted mt-1 fw-semibold fs-7">Orders, inquiries, and listings by month</span>
                    </h3>
                    <div className="card-toolbar">
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() =>
                          downloadCsv(
                            "performance_trends.csv",
                            ["Month", "Properties", "Inquiries", "Orders", "Lead Conversion %"],
                            adminSummary.trend_series.map((row) => [row.label, row.properties, row.inquiries, row.orders, row.lead_conversion_rate]),
                          )
                        }
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                  <div className="card-body pt-0">
                    <div className="table-responsive">
                      <table className="table align-middle table-row-dashed fs-6 gy-4">
                        <thead>
                          <tr className="text-start text-muted fw-bold fs-7 text-uppercase">
                            <th>Month</th>
                            <th>Properties</th>
                            <th>Inquiries</th>
                            <th>Orders</th>
                            <th>Lead Conv.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminSummary.trend_series.map((row) => (
                            <tr key={row.label}>
                              <td className="fw-semibold">{row.label}</td>
                              <td>{row.properties}</td>
                              <td>{row.inquiries}</td>
                              <td>{row.orders}</td>
                              <td>{formatPercent(row.lead_conversion_rate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-5 gx-xxl-8 mb-8">
              <div className="col-12">
                <DashboardChart
                  className="h-100 shadow-sm border-0"
                  title="Lead Funnel"
                  subtitle="Visited -> inquiry -> qualified -> won"
                  chartType="bar"
                  horizontal
                  showLegend={false}
                  actions={
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={() =>
                        downloadCsv(
                          "lead_funnel.csv",
                          ["Stage", "Value"],
                          adminSummary.lead_funnel.map((row) => [row.stage, row.value]),
                        )
                      }
                    >
                      Export CSV
                    </button>
                  }
                  categories={adminSummary.lead_funnel.map((row) => row.stage)}
                  series={[
                    { name: "Leads", data: adminSummary.lead_funnel.map((row) => row.value) },
                  ]}
                />
              </div>
            </div>

            <div className="row g-5 gx-xxl-8 mb-8">
              <div className="col-xxl-5">
                {adminSummary.lead_source_funnel.length > 0 ? (
                  <DashboardChart
                    className="h-100 shadow-sm border-0"
                    title="Lead Source Funnel"
                    subtitle="Where your leads are coming from"
                    chartType="bar"
                    horizontal
                    showLegend={false}
                    actions={
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() =>
                          downloadCsv(
                            "admin_lead_source_funnel.csv",
                            ["Source", "Leads", "Share %"],
                            adminSummary.lead_source_funnel.map((row) => [row.label, row.value, row.share]),
                          )
                        }
                      >
                        Export CSV
                      </button>
                    }
                    categories={adminSummary.lead_source_funnel.map((row) => row.label)}
                    series={[
                      {
                        name: "Leads",
                        data: adminSummary.lead_source_funnel.map((row) => row.value),
                      },
                    ]}
                  />
                ) : (
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body d-flex flex-column justify-content-center align-items-start">
                      <div className="fw-bold fs-4 mb-2">Lead Source Funnel</div>
                      <div className="text-gray-600">No lead source data is available yet.</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-xxl-7">
                <DashboardChart
                  className="h-100 shadow-sm border-0"
                  title="Monthly Revenue vs Leads"
                  subtitle="Revenue, leads, and close rate over time"
                  chartType="mixed"
                  actions={
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={() =>
                        downloadCsv(
                          "admin_monthly_revenue_vs_leads.csv",
                          ["Month", "Revenue", "Leads", "Close Rate %"],
                          adminSummary.monthly_pipeline.map((row) => [row.label, row.revenue, row.inquiries, row.close_rate]),
                        )
                      }
                    >
                      Export CSV
                    </button>
                  }
                  categories={adminSummary.monthly_pipeline.map((row) => row.label)}
                  series={[
                    { name: "Revenue", data: adminSummary.monthly_pipeline.map((row) => row.revenue), type: "bar" },
                    { name: "Leads", data: adminSummary.monthly_pipeline.map((row) => row.inquiries), type: "line" },
                    { name: "Close Rate %", data: adminSummary.monthly_pipeline.map((row) => row.close_rate), type: "line" },
                  ]}
                  yaxis={[
                    {
                      title: { text: "Revenue / Leads" },
                    },
                    {
                      opposite: true,
                      title: { text: "Close Rate %" },
                      labels: {
                        formatter: (value) => `${value.toFixed(0)}%`,
                      },
                    },
                  ]}
                />
              </div>
            </div>

            <div className="row g-5 gx-xxl-8 mb-8">
              <div className="col-xxl-5">
                {adminSummary.agent_leaderboard.length > 0 ? (
                  <DashboardChart
                    className="h-100 shadow-sm border-0"
                    title="Agent Performance"
                    subtitle="Revenue contribution by staff member"
                    chartType="bar"
                    horizontal
                    showLegend={false}
                    actions={
                      <button
                        type="button"
                        className="btn btn-sm btn-light"
                        onClick={() =>
                          downloadCsv(
                            "admin_agent_performance.csv",
                            ["Agent", "Leads", "Orders", "Revenue", "Conversion %"],
                            adminSummary.agent_leaderboard.map((row) => [row.name, row.inquiries, row.orders, row.revenue, row.conversion_rate]),
                          )
                        }
                      >
                        Export CSV
                      </button>
                    }
                    categories={adminSummary.agent_leaderboard.map((row) => row.name)}
                    series={[
                      {
                        name: "Revenue",
                        data: adminSummary.agent_leaderboard.map((row) => row.revenue),
                      },
                    ]}
                  />
                ) : (
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-body d-flex flex-column justify-content-center align-items-start">
                      <div className="fw-bold fs-4 mb-2">Agent Performance</div>
                      <div className="text-gray-600">No staff activity has been recorded yet.</div>
                    </div>
                  </div>
                )}
              </div>
              <div className="col-xxl-7">
                  <div className="card h-100 shadow-sm border-0">
                    <div className="card-header border-0 pt-5">
                      <h3 className="card-title align-items-start flex-column">
                        <span className="card-label fw-bold fs-3 mb-1">Top Agents</span>
                        <span className="text-muted mt-1 fw-semibold fs-7">Leads, orders, revenue, and conversion rate</span>
                      </h3>
                      <div className="card-toolbar">
                        <button
                          type="button"
                          className="btn btn-sm btn-light"
                          onClick={() =>
                            downloadCsv(
                              "admin_top_agents.csv",
                              ["Agent", "Leads", "Orders", "Revenue", "Conversion %"],
                              adminSummary.agent_leaderboard.map((row) => [row.name, row.inquiries, row.orders, row.revenue, row.conversion_rate]),
                            )
                          }
                        >
                          Export CSV
                        </button>
                      </div>
                  </div>
                  <div className="card-body pt-0">
                    <div className="table-responsive">
                      <table className="table align-middle table-row-dashed fs-6 gy-3">
                        <thead>
                          <tr className="text-start text-muted fw-bold fs-7 text-uppercase">
                            <th>Agent</th>
                            <th>Leads</th>
                            <th>Orders</th>
                            <th>Revenue</th>
                            <th>Conv.</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminSummary.agent_leaderboard.map((row) => (
                            <tr key={row.id}>
                              <td className="fw-semibold">{row.name}</td>
                              <td>{row.inquiries}</td>
                              <td>{row.orders}</td>
                              <td>{formatMoney(row.revenue)}</td>
                              <td>{formatPercent(row.conversion_rate)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-5 mb-8">
              <div className="col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-muted fs-7">Published Properties</div>
                    <div className="fw-bold fs-2 text-dark">{adminSummary.metrics.published_properties}</div>
                    <div className="text-gray-600 mt-2">Active listings currently visible to seekers.</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-muted fs-7">New Inquiries</div>
                    <div className="fw-bold fs-2 text-dark">{adminSummary.metrics.new_inquiries}</div>
                    <div className="text-gray-600 mt-2">Fresh leads waiting for a response.</div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-body">
                    <div className="text-muted fs-7">Referral Driven Growth</div>
                    <div className="fw-bold fs-2 text-dark">{adminSummary.metrics.referrals}</div>
                    <div className="text-gray-600 mt-2">Companies onboarded from your referral network.</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-5 gx-xxl-8 mb-8">
              <div className="col-xxl-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                      <span className="card-label fw-bold fs-3 mb-1">Recent Properties</span>
                      <span className="text-muted mt-1 fw-semibold fs-7">Newest listings in your account</span>
                    </h3>
                  </div>
                  <div className="card-body pt-0">
                    {adminSummary.recent_properties.length === 0 ? (
                      <div className="alert alert-light border mb-0">No recent properties found.</div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table align-middle table-row-dashed fs-6 gy-3">
                          <tbody>
                            {adminSummary.recent_properties.map((property) => (
                              <tr key={property.id}>
                                <td className="fw-semibold">{property.title}</td>
                                <td className="text-muted text-end">{formatDateTime(property.created_at ?? undefined, { withRelative: false })}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-xxl-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                      <span className="card-label fw-bold fs-3 mb-1">Recent Inquiries</span>
                      <span className="text-muted mt-1 fw-semibold fs-7">Fresh lead volume and pipeline activity</span>
                    </h3>
                  </div>
                  <div className="card-body pt-0">
                    {adminSummary.recent_inquiries.length === 0 ? (
                      <div className="alert alert-light border mb-0">No recent inquiries found.</div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table align-middle table-row-dashed fs-6 gy-3">
                          <tbody>
                            {adminSummary.recent_inquiries.map((inquiry) => (
                              <tr key={inquiry.id}>
                                <td>
                                  <div className="fw-semibold">{inquiry.subject ?? "Inquiry"}</div>
                                  <div className="text-muted fs-7 text-capitalize">{inquiry.status ?? "—"}</div>
                                </td>
                                <td className="text-muted text-end">{formatDateTime(inquiry.created_at ?? undefined, { withRelative: false })}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-xxl-4">
                <div className="card h-100 shadow-sm border-0">
                  <div className="card-header border-0 pt-5">
                    <h3 className="card-title align-items-start flex-column">
                      <span className="card-label fw-bold fs-3 mb-1">Recent Orders</span>
                      <span className="text-muted mt-1 fw-semibold fs-7">Recent billing and subscription transactions</span>
                    </h3>
                  </div>
                  <div className="card-body pt-0">
                    {adminSummary.recent_orders.length === 0 ? (
                      <div className="alert alert-light border mb-0">No recent orders found.</div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table align-middle table-row-dashed fs-6 gy-3">
                          <tbody>
                            {adminSummary.recent_orders.map((order) => (
                              <tr key={order.id}>
                                <td>
                                  <div className="fw-semibold">{order.reference_no ?? order.id}</div>
                                  <div className="text-muted fs-7 text-capitalize">{order.payment_status ?? "—"} / {order.order_status ?? "—"}</div>
                                </td>
                                <td className="text-end">
                                  <div className="fw-semibold">{formatMoney(order.total_amount, "AUD")}</div>
                                  <div className="text-muted fs-7">{order.created_at ? formatDateTime(order.created_at, { withRelative: false }) : "—"}</div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="row g-5 mb-6">
              <div className="col-md-4">
                <Link to="/admin/businesses" className="card h-100 shadow-sm border-0 text-decoration-none">
                  <div className="card-body">
                    <div className="text-muted fs-7">Module</div>
                    <div className="fw-bold fs-3 text-dark">Business Details</div>
                    <div className="text-gray-600 mt-2">Edit your organization profile and plan-facing company information.</div>
                  </div>
                </Link>
              </div>

              <div className="col-md-4">
                <Link to="/admin/referrals" className="card h-100 shadow-sm border-0 text-decoration-none">
                  <div className="card-body">
                    <div className="text-muted fs-7">Module</div>
                    <div className="fw-bold fs-3 text-dark">Referrals</div>
                    <div className="text-gray-600 mt-2">Track onboarding growth coming from your invite link.</div>
                  </div>
                </Link>
              </div>

              <div className="col-md-4">
                <Link to="/admin/billing" className="card h-100 shadow-sm border-0 text-decoration-none">
                  <div className="card-body">
                    <div className="text-muted fs-7">Module</div>
                    <div className="fw-bold fs-3 text-dark">Billing</div>
                    <div className="text-gray-600 mt-2">Review your subscription, add-ons, and renewal timeline.</div>
                  </div>
                </Link>
              </div>
            </div>
          </>
        )}
      </Content>
    </>
  );
};

const DashboardWrapper: FC = () => {
  const intl = useIntl();
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({ id: "MENU.DASHBOARD" })}
      </PageTitle>
      <DashboardPage />
    </>
  );
};

export { DashboardWrapper };
