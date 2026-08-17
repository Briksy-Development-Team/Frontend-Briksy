import { Link } from "react-router-dom";
import type { AdminDashboardSummary } from "../../../services/features/dashboard/dashboard.api";
import DashboardChart from "./DashboardChart";

type Props = { summary: AdminDashboardSummary };
type DashboardConfig = {
  title: string;
  description: string;
  metrics: Array<[string, string | number]>;
  chartTitle: string;
  chartSubtitle: string;
  series: Array<{ name: string; data: number[]; color: string }>;
  link: string;
  linkLabel: string;
};

const formatMoney = (value: number | null | undefined, currency = "AUD") =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency, maximumFractionDigits: 0 }).format(value ?? 0);

const formatPercent = (value: number | null | undefined) => `${(value ?? 0).toFixed(1)}%`;

const downloadCsv = (filename: string, headers: string[], rows: Array<Array<unknown>>) => {
  const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
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

const Metric = ({ label, value }: { label: string; value: string | number }) => (
  <div className="col-xl-3 col-md-6">
    <div className="card h-100 border-0 shadow-sm" style={{ background: "#bf9f7d" }}>
      <div className="card-body">
        <div className="text-white opacity-75 fw-semibold fs-7">{label}</div>
        <div className="text-white fs-1 fw-bold">{value}</div>
      </div>
    </div>
  </div>
);

const CategoryDashboard = ({ summary }: Props) => {
  const category = summary.category ?? "business";
  const rows = summary.trend_series;
  const config = ({
    "real-estate": {
      title: "Real Estate Dashboard",
      description: "Monitor listings, property approvals, and buyer enquiries.",
      metrics: [
        ["Team Members", summary.metrics.team_members],
        ["Properties", summary.metrics.properties],
        ["Published Listings", summary.metrics.published_properties],
        ["New Enquiries", summary.metrics.new_inquiries],
      ],
      chartTitle: "Property Activity",
      chartSubtitle: "Listings and enquiries created over the last six months",
      series: [
        { name: "Properties", data: rows.map((row) => row.properties), color: "#bf9f7d" },
        { name: "Enquiries", data: rows.map((row) => row.inquiries), color: "#df4235" },
      ],
      link: "/admin/property-management",
      linkLabel: "Manage Properties",
    },
    "buyers-agent": {
      title: "Buyers Agent Dashboard",
      description: "Manage buyer briefs, preferences, and enquiry activity.",
      metrics: [
        ["Team Members", summary.metrics.team_members],
        ["Buyer Briefs", summary.metrics.buyer_briefs ?? 0],
        ["New Enquiries", summary.metrics.new_inquiries],
        ["Total Enquiries", summary.metrics.inquiries],
      ],
      chartTitle: "Buyer Network Activity",
      chartSubtitle: "Buyer briefs and enquiries created over the last six months",
      series: [
        { name: "Buyer Briefs", data: rows.map((row) => row.buyer_briefs), color: "#bf9f7d" },
        { name: "Enquiries", data: rows.map((row) => row.inquiries), color: "#df4235" },
      ],
      link: "/admin/buyer-briefs",
      linkLabel: "Manage Buyer Briefs",
    },
    builders: {
      title: "Builders Dashboard",
      description: "Track developments, building projects, and project enquiries.",
      metrics: [
        ["Team Members", summary.metrics.team_members],
        ["Building Projects", summary.metrics.builder_projects ?? 0],
        ["New Enquiries", summary.metrics.new_inquiries],
        ["Total Enquiries", summary.metrics.inquiries],
      ],
      chartTitle: "Project Activity",
      chartSubtitle: "Building projects and enquiries created over the last six months",
      series: [
        { name: "Projects", data: rows.map((row) => row.builder_projects), color: "#bf9f7d" },
        { name: "Enquiries", data: rows.map((row) => row.inquiries), color: "#df4235" },
      ],
      link: "/admin/builder-projects",
      linkLabel: "Manage Projects",
    },
    "trades-professionals": {
      title: "Trades & Professionals Dashboard",
      description: "Manage services, service providers, coverage regions, and leads.",
      metrics: [
        ["Team Members", summary.metrics.team_members],
        ["Services", summary.metrics.services],
        ["Service Regions", summary.metrics.service_regions ?? 0],
        ["New Enquiries", summary.metrics.new_inquiries],
      ],
      chartTitle: "Service Coverage Activity",
      chartSubtitle: "Services, coverage regions, and enquiries created over the last six months",
      series: [
        { name: "Services", data: rows.map((row) => row.services), color: "#bf9f7d" },
        { name: "Service Regions", data: rows.map((row) => row.service_regions), color: "#6f4e37" },
        { name: "Enquiries", data: rows.map((row) => row.inquiries), color: "#df4235" },
      ],
      link: "/admin/services",
      linkLabel: "Manage Services",
    },
  }[category] ?? {
    title: "Business Dashboard",
    description: "Monitor your business activity and enquiries.",
    metrics: [
      ["Team Members", summary.metrics.team_members],
      ["New Enquiries", summary.metrics.new_inquiries],
      ["Total Enquiries", summary.metrics.inquiries],
      ["Referrals", summary.metrics.referrals],
    ],
    chartTitle: "Business Activity",
    chartSubtitle: "Enquiries created over the last six months",
    series: [{ name: "Enquiries", data: rows.map((row) => row.inquiries), color: "#df4235" }],
    link: "/admin/businesses",
    linkLabel: "View Business Details",
  }) as DashboardConfig;

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-5">
        <div>
          <div className="text-muted fs-7 text-uppercase fw-semibold">Portal</div>
          <h2 className="fw-bold mb-1">{config.title}</h2>
          <div className="text-gray-600">{config.description}</div>
        </div>
        <Link to={config.link} className="btn btn-primary">{config.linkLabel}</Link>
      </div>

      <div className="row g-5 mb-8">
        {config.metrics.map(([label, value]) => <Metric key={label} label={label} value={value} />)}
      </div>

      <div className="row g-5 mb-8">
        <div className="col-xl-8">
          <DashboardChart
            className="h-100 shadow-sm border-0"
            title={config.chartTitle}
            subtitle={config.chartSubtitle}
            chartType="area"
            categories={rows.map((row) => row.label)}
            series={config.series}
            actions={<button type="button" className="btn btn-sm btn-light" onClick={() => downloadCsv(`${category}-activity.csv`, ["Month", ...config.series.map((series) => series.name)], rows.map((row, index) => [row.label, ...config.series.map((series) => series.data[index])] ))}>Export CSV</button>}
          />
        </div>
        <div className="col-xl-4">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header border-0 pt-5">
              <h3 className="card-title flex-column align-items-start">
                <span className="card-label fw-bold fs-3 mb-1">Current Snapshot</span>
                <span className="text-muted fw-semibold fs-7">Plan and workflow performance</span>
              </h3>
            </div>
            <div className="card-body pt-0">
              <div className="d-flex flex-column gap-4">
                <div className="d-flex justify-content-between"><span className="text-muted">Plan</span><strong>{summary.current_subscription?.plan_name ?? "—"}</strong></div>
                <div className="d-flex justify-content-between"><span className="text-muted">Status</span><strong className="text-capitalize">{summary.current_subscription?.status ?? "—"}</strong></div>
                <div className="d-flex justify-content-between"><span className="text-muted">Lead conversion</span><strong>{formatPercent(summary.lead_conversion_rate)}</strong></div>
                <div className="d-flex justify-content-between"><span className="text-muted">Referrals</span><strong>{summary.metrics.referrals}</strong></div>
              </div>
              <Link to="/admin/billing" className="btn btn-light w-100 mt-6">View Billing</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-5 mb-8">
        <div className="col-xl-6">
          <DashboardChart
            className="h-100 shadow-sm border-0"
            title="Enquiry Trend"
            subtitle="New enquiries by month"
            chartType="bar"
            categories={rows.map((row) => row.label)}
            series={[{ name: "Enquiries", data: rows.map((row) => row.inquiries), color: "#df4235" }]}
          />
        </div>
        <div className="col-xl-6">
          <div className="card h-100 shadow-sm border-0">
            <div className="card-header border-0 pt-5">
              <h3 className="card-title flex-column align-items-start">
                <span className="card-label fw-bold fs-3 mb-1">Workflow Overview</span>
                <span className="text-muted fw-semibold fs-7">Live records for this business category</span>
              </h3>
            </div>
            <div className="card-body pt-0">
              <div className="d-flex flex-column gap-4">
                {category === "real-estate" && <><div className="d-flex justify-content-between"><span>Published listings</span><strong>{summary.metrics.published_properties}</strong></div><div className="d-flex justify-content-between"><span>Pending review</span><strong>{summary.metrics.pending_review_properties ?? 0}</strong></div><div className="d-flex justify-content-between"><span>Archived listings</span><strong>{summary.metrics.archived_properties ?? 0}</strong></div></>}
                {category === "buyers-agent" && <><div className="d-flex justify-content-between"><span>Buyer briefs</span><strong>{summary.metrics.buyer_briefs ?? 0}</strong></div><div className="d-flex justify-content-between"><span>New enquiries</span><strong>{summary.metrics.new_inquiries}</strong></div><div className="d-flex justify-content-between"><span>Saved-search capability</span><strong>{summary.capabilities?.saved_searches ? "Enabled" : "Not enabled"}</strong></div></>}
                {category === "builders" && <><div className="d-flex justify-content-between"><span>Building projects</span><strong>{summary.metrics.builder_projects ?? 0}</strong></div><div className="d-flex justify-content-between"><span>New enquiries</span><strong>{summary.metrics.new_inquiries}</strong></div><div className="d-flex justify-content-between"><span>Project capability</span><strong>{summary.capabilities?.projects ? "Enabled" : "Not enabled"}</strong></div></>}
                {category === "trades-professionals" && <><div className="d-flex justify-content-between"><span>Services</span><strong>{summary.metrics.services}</strong></div><div className="d-flex justify-content-between"><span>Coverage regions</span><strong>{summary.metrics.service_regions ?? 0}</strong></div><div className="d-flex justify-content-between"><span>Service map</span><strong>{summary.capabilities?.service_map ? "Enabled" : "Not enabled"}</strong></div></>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryDashboard;
