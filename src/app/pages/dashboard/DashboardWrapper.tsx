import { FC, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { toAbsoluteUrl } from "../../../_metronic/helpers";
import { PageTitle } from "../../../_metronic/layout/core";
import {
  ListsWidget3,
  TablesWidget5,
  TablesWidget10,
  CardsWidget7,
  CardsWidget17,
  CardsWidget20,
  ChartsWidget3,
  ChartsWidget4,
  TablesWidget8,
  ListsWidget8,
  ChartsWidget1,
} from "../../../_metronic/partials/widgets";
import { ToolbarWrapper } from "../../../_metronic/layout/components/toolbar";
import { Content } from "../../../_metronic/layout/components/content";
import { useRoleAccess } from "../../modules/auth";
import { fetchDashboardSummary, type DashboardSummary } from "../../services/features/dashboard/dashboard.api";

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

const DashboardPage: FC = () => {
  const { isSuperAdmin } = useRoleAccess();
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSuperAdmin) {
      return;
    }

    let active = true;
    setLoading(true);

    void fetchDashboardSummary()
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
  }, [isSuperAdmin]);

  return (
    <>
      <ToolbarWrapper />
      <Content>
        {isSuperAdmin && (
          <>
            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="alert alert-light">Loading platform summary...</div>}

            {summary && (
              <>
                <div className="row g-5 mb-6">
                  <MetricCard label="Total Companies" value={summary.total_companies} tone="#0D6EFD" />
                  <MetricCard label="Active Plans" value={summary.active_plans} tone="#198754" />
                  <MetricCard label="Total Orders" value={summary.total_orders} tone="#6F42C1" />
                  <MetricCard label="Property Count" value={summary.property_summary.total} tone="#F59E0B" />
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
                              {summary.recent_companies.map((company) => (
                                <tr key={company.id}>
                                  <td className="fw-bold">{company.name}</td>
                                  <td className="text-muted text-end">{company.created_at ?? "—"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xxl-6">
                    <div className="card h-100">
                      <div className="card-header border-0 pt-5">
                        <h3 className="card-title align-items-start flex-column">
                          <span className="card-label fw-bold fs-3 mb-1">Property Summary</span>
                          <span className="text-muted mt-1 fw-semibold fs-7">All properties across companies</span>
                        </h3>
                      </div>
                      <div className="card-body pt-0">
                        <div className="d-flex flex-column gap-3">
                          <div className="d-flex justify-content-between"><span>Total</span><strong>{summary.property_summary.total}</strong></div>
                          <div className="d-flex justify-content-between"><span>Published</span><strong>{summary.property_summary.published}</strong></div>
                          <div className="d-flex justify-content-between"><span>Draft</span><strong>{summary.property_summary.draft}</strong></div>
                          <div className="d-flex justify-content-between"><span>Archived</span><strong>{summary.property_summary.archived}</strong></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <div className="d-flex flex-wrap align-items-stretch gap-8 ">
          <div className="flex-grow-1">
            <CardsWidget20
              className="h-100"
              description={isSuperAdmin ? "Platform overview" : "Active Builders"}
              color="#F1416C"
              img={toAbsoluteUrl("media/patterns/vector-1.png")}
            />
          </div>

          <div className="flex-grow-1">
            <CardsWidget7
              className="h-100"
              description={isSuperAdmin ? "Platform" : "Agency"}
              icon={false}
              stats={isSuperAdmin ? summary?.total_companies ?? 0 : 357}
              labelColor="dark"
              textColor="gray-800"
            />
          </div>

          <div className="flex-grow-1">
            <CardsWidget17 className="h-100" />
          </div>
        </div>

        <div className="row gx-5 gx-xl-10 ">
          <div className="col-xxl-6 mb-5 mb-xl-10"></div>

          <div className="col-xxl-6 mb-5 mb-xl-10"></div>
        </div>
        <div className="row g-5 g-xl-8">
          <div className="col-xl-6">
            <ChartsWidget3 className="card-xl-stretch mb-xl-8" />
          </div>
          <div className="col-xl-6">
            <ChartsWidget4 className="card-xl-stretch mb-5 mb-xl-8" />
          </div>
        </div>

        <div className="row gy-5 gx-xl-8">
          <div className="col-xxl-4">
            <ListsWidget3 className="card-xxl-stretch mb-xl-3" />
          </div>
          <div className="col-xl-8">
            <TablesWidget10 className="card-xxl-stretch mb-5 mb-xl-8" />
          </div>
        </div>

        <div className="row g-5 g-xl-8">
          <div className="col-xl-6">
            <ChartsWidget1 className='card-xl-stretch mb-xl-8' />
          </div>
          <div className="col-xl-6">
            <TablesWidget8 className='card-xl-stretch mb-5 mb-xl-8' />
          </div>
        </div>

        <div className="row g-5 gx-xxl-8">
          <div className="col-xxl-4">
            <ListsWidget8 className="card-xl-stretch mb-5 mb-xl-8" />
          </div>
          <div className="col-xxl-8">
            <TablesWidget5 className="card-xxl-stretch mb-5 mb-xxl-8" />
          </div>
        </div>
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
