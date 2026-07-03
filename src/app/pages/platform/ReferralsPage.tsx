import { useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { KTCard, KTIcon } from "../../../_metronic/helpers";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { useRoleAccess } from "../../modules/auth";
import {
  fetchAdminReferralDashboardApi,
  fetchSuperAdminReferralProgramsApi,
} from "../../services/features/referrals/referral.api";
import type {
  ReferralDashboard,
  ReferralProgramOverview,
} from "../../services/features/referrals/referral.types";
import { formatDateTime } from "../../services/utils/dateFormat";

const ReferralsPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const [data, setData] = useState<ReferralDashboard | ReferralProgramOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copyMessage, setCopyMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const loader = isSuperAdmin ? fetchSuperAdminReferralProgramsApi : fetchAdminReferralDashboardApi;

    loader()
      .then((response) => {
        if (active) {
          setData(response);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load referrals");
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

  const isAdminReferralDashboard = (
    value: ReferralDashboard | ReferralProgramOverview | null,
  ): value is ReferralDashboard => Boolean(value && "referral_link" in value);

  const summaryCards = useMemo(
    () =>
      isSuperAdmin
        ? [
            { label: "Companies", value: String((data as ReferralProgramOverview | null)?.totals.organizations ?? 0) },
            { label: "With Referrals", value: String((data as ReferralProgramOverview | null)?.totals.with_referrals ?? 0) },
            { label: "Total in Page", value: String((data as ReferralProgramOverview | null)?.pagination?.total ?? 0) },
          ]
        : [
            { label: "Referral Code", value: (data as ReferralDashboard | null)?.referral_code ?? "—" },
            { label: "Total Onboards", value: String((data as ReferralDashboard | null)?.total_referrals ?? 0) },
            { label: "Share Link", value: (data as ReferralDashboard | null)?.referral_link ?? "—" },
          ],
    [data, isSuperAdmin],
  );

  const copyLink = async () => {
    if (!isAdminReferralDashboard(data) || !data.referral_link) {
      return;
    }

    await navigator.clipboard.writeText(data.referral_link);
    setCopyMessage("Referral link copied to clipboard.");
    window.setTimeout(() => setCopyMessage(null), 2500);
  };

  return (
    <Content>
      <PageHeader
        title={isSuperAdmin ? "Referral Programs" : "Referrals"}
        subtitle={
          isSuperAdmin
            ? "Review referral codes and onboarding activity across all companies."
            : "Share your referral link to bring new companies and onboard more businesses."
        }
      />

      {loading && <div className="alert alert-light">Loading referral dashboard...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {copyMessage && <div className="alert alert-success">{copyMessage}</div>}

      {!loading && !error && data && (
        <>
          <div className="row g-5 mb-5">
            {summaryCards.map((card) => (
              <div className="col-md-4" key={card.label}>
                <KTCard>
                  <div className="card-body">
                    <div className="text-muted fs-7 mb-2">{card.label}</div>
                    <div className="fw-bold fs-4 text-gray-900 text-break">{card.value}</div>
                  </div>
                </KTCard>
              </div>
            ))}
          </div>

          <KTCard>
            <div className="card-body">
              {isSuperAdmin ? (
                <>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                    <div>
                      <h3 className="fw-bold mb-1">Referral Programs</h3>
                      <div className="text-muted">Company-wide referral overview.</div>
                    </div>
                  </div>

                  <div className="table-responsive">
                    <table className="table align-middle table-row-dashed fs-6 gy-4">
                      <thead>
                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase">
                          <th>Company</th>
                          <th>Referral Code</th>
                          <th>Referred By</th>
                          <th>Referral Count</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data as ReferralProgramOverview).organizations.length === 0 ? (
                          <tr>
                            <td colSpan={5}>
                              <div className="alert alert-light border mb-0">No referral programs found.</div>
                            </td>
                          </tr>
                        ) : (
                          (data as ReferralProgramOverview).organizations.map((organization) => (
                            <tr key={organization.id}>
                              <td>
                                <div className="fw-semibold">{organization.name}</div>
                                <div className="text-muted fs-7">{organization.trading_name ?? "—"}</div>
                              </td>
                              <td>{organization.referral_code ?? "—"}</td>
                              <td>{organization.referred_by_name ?? "—"}</td>
                              <td>{String(organization.referred_organizations_count ?? 0)}</td>
                              <td>{formatDateTime(organization.created_at ?? undefined, { withRelative: false })}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
                    <div>
                      <h3 className="fw-bold mb-1">Referral Link</h3>
                      <div className="text-muted">Use this link when inviting new signups.</div>
                    </div>
                    <button className="btn btn-primary" onClick={copyLink}>
                      <KTIcon iconName="copy" className="fs-2 me-2" />
                      Copy Link
                    </button>
                  </div>

                  <div className="alert alert-light border border-dashed mb-5 text-break">
                    {(data as ReferralDashboard).referral_link}
                  </div>

                  <div className="table-responsive">
                    <table className="table align-middle table-row-dashed fs-6 gy-4">
                      <thead>
                        <tr className="text-start text-muted fw-bold fs-7 text-uppercase">
                          <th>Company</th>
                          <th>Email</th>
                          <th>Referral Code</th>
                          <th>Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(data as ReferralDashboard).recent_referrals.length === 0 ? (
                          <tr>
                            <td colSpan={4}>
                              <div className="alert alert-light border mb-0">No referred companies yet.</div>
                            </td>
                          </tr>
                        ) : (
                          (data as ReferralDashboard).recent_referrals.map((organization) => (
                            <tr key={organization.id}>
                              <td>
                                <div className="fw-semibold">{organization.name}</div>
                                <div className="text-muted fs-7">{organization.trading_name ?? "—"}</div>
                              </td>
                              <td>{organization.contact_email ?? "—"}</td>
                              <td>{organization.referral_code ?? "—"}</td>
                              <td>{formatDateTime(organization.created_at ?? undefined, { withRelative: false })}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </KTCard>
        </>
      )}
    </Content>
  );
};

export default ReferralsPage;
