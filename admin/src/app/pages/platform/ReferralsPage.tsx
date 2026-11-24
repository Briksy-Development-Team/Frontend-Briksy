import { useEffect, useMemo, useState, useCallback } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { EntityList, type Column, type SummaryCardItem } from "../../modules/apps/shared_table/entity-list/EntityList";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { useRoleAccess } from "../../modules/auth";
import {
  fetchAdminReferralDashboardApi,
  fetchSuperAdminReferralProgramsApi,
} from "../../services/features/referrals/referral.api";
import type {
  ReferralDashboard,
  ReferralOrganization,
  ReferralProgramOverview,
} from "../../services/features/referrals/referral.types";
import { formatDateTime } from "../../services/utils/dateFormat";

const ReferralsPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const [data, setData] = useState<ReferralDashboard | ReferralProgramOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { params, handleParamsChange } = useEntityTable(() => undefined);

  useEffect(() => {
    let active = true;
    setLoading(true);

    const loader = isSuperAdmin ? fetchSuperAdminReferralProgramsApi : fetchAdminReferralDashboardApi;

    loader()
      .then((response) => {
        if (active) setData(response);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(requestError instanceof Error ? requestError.message : "Failed to load referrals");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [isSuperAdmin]);

  const isAdminReferralDashboard = (
    value: ReferralDashboard | ReferralProgramOverview | null,
  ): value is ReferralDashboard => Boolean(value && "referral_link" in value);

  const copyLink = useCallback(async () => {
    if (!isAdminReferralDashboard(data) || !data.referral_link) return;
    await navigator.clipboard.writeText(data.referral_link);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2500);
  }, [data]);

  const rawList: ReferralOrganization[] = useMemo(() => {
    if (!data) return [];
    if (isSuperAdmin) {
      return (data as ReferralProgramOverview).organizations ?? [];
    }
    return (data as ReferralDashboard).recent_referrals ?? [];
  }, [data, isSuperAdmin]);

  const filtered = useMemo(() => {
    let list = rawList;
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.trading_name?.toLowerCase().includes(q) ||
          r.referral_code?.toLowerCase().includes(q) ||
          r.contact_email?.toLowerCase().includes(q) ||
          r.referred_by_name?.toLowerCase().includes(q)
      );
    }
    return list;
  }, [rawList, params.search]);

  const paged = useMemo(() => {
    const start = (params.page - 1) * params.per_page;
    return filtered.slice(start, start + params.per_page);
  }, [filtered, params.page, params.per_page]);

  const summaryCards = useMemo<SummaryCardItem[]>(() => {
    if (!data) return [];
    if (isSuperAdmin) {
      const overview = data as ReferralProgramOverview;
      return [
        {
          id: "companies",
          label: "Companies",
          count: overview.totals.organizations ?? 0,
          subtitle: "Total registered companies",
          dotColor: "#342511",
          active: true,
        },
        {
          id: "with_referrals",
          label: "With Referrals",
          count: overview.totals.with_referrals ?? 0,
          subtitle: "Active referring businesses",
          dotColor: "#1F7A4D",
        },
        {
          id: "total",
          label: "Total in Page",
          count: overview.pagination?.total ?? overview.organizations.length,
          subtitle: "Total program records",
          dotColor: "#8A5A00",
        },
      ];
    }

    const dashboard = data as ReferralDashboard;
    return [
      {
        id: "code",
        label: "Referral Code",
        count: dashboard.referral_code ?? "—",
        subtitle: "Your unique invite code",
        dotColor: "#342511",
        active: true,
      },
      {
        id: "onboards",
        label: "Total Onboards",
        count: dashboard.total_referrals ?? 0,
        subtitle: "Companies joined via your link",
        dotColor: "#1F7A4D",
      },
    ];
  }, [data, isSuperAdmin]);

  const columns = useMemo<Column<ReferralOrganization>[]>(() => {
    const baseCol: Column<ReferralOrganization>[] = [
      {
        Header: "Company",
        accessor: "name",
        Cell: ({ row }: { row: ReferralOrganization | { original: ReferralOrganization } }) => {
          const item = "original" in row ? row.original : row;
          return (
            <div>
              <div className="fw-semibold">{item.name}</div>
              <div className="text-muted fs-7">{item.trading_name ?? "—"}</div>
            </div>
          );
        },
      },
    ];

    if (isSuperAdmin) {
      return [
        ...baseCol,
        {
          Header: "Referral Code",
          accessor: "referral_code",
          Cell: ({ value }: { value: unknown }) => String(value ?? "—"),
        },
        {
          Header: "Referred By",
          accessor: "referred_by_name",
          Cell: ({ value }: { value: unknown }) => String(value ?? "—"),
        },
        {
          Header: "Referral Count",
          accessor: "referred_organizations_count",
          Cell: ({ value }: { value: unknown }) => String(value ?? 0),
        },
        {
          Header: "Created",
          accessor: "created_at",
          Cell: ({ value }: { value: unknown }) =>
            formatDateTime(value ? String(value) : undefined, { withRelative: false }),
        },
      ];
    }

    return [
      ...baseCol,
      {
        Header: "Email",
        accessor: "contact_email",
        Cell: ({ value }: { value: unknown }) => String(value ?? "—"),
      },
      {
        Header: "Referral Code",
        accessor: "referral_code",
        Cell: ({ value }: { value: unknown }) => String(value ?? "—"),
      },
      {
        Header: "Created",
        accessor: "created_at",
        Cell: ({ value }: { value: unknown }) =>
          formatDateTime(value ? String(value) : undefined, { withRelative: false }),
      },
    ];
  }, [isSuperAdmin]);

  const headerActions = useMemo(() => {
    if (!isSuperAdmin && isAdminReferralDashboard(data)) {
      return [
        {
          label: copied ? "Copied!" : "Copy Referral Link",
          onClick: copyLink,
        },
      ];
    }
    return [];
  }, [isSuperAdmin, data, copied, copyLink]);

  return (
    <Content>
      {loading && <div className="text-muted mb-2">Loading referral data...</div>}
      {error && <div className="alert alert-danger mb-4">{error}</div>}

      <EntityList
        title={isSuperAdmin ? "Referral Programs" : "Referrals"}
        subtitle={
          isSuperAdmin
            ? "Review referral codes and onboarding activity across all companies."
            : "Share your referral link to bring new companies and onboard more businesses."
        }
        entityName="referrals"
        profileType="none"
        summaryCards={summaryCards}
        data={paged}
        total={filtered.length}
        params={params}
        onParamsChange={handleParamsChange}
        columns={columns}
        headerActions={headerActions}
      />
    </Content>
  );
};

export default ReferralsPage;
