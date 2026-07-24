import type { DetailConfig } from "../../../modules/apps/shared_detail/core/DetailTypes";
import { fetchStaff } from "../staff/staff.slice";
import { staffConfig } from "../staff/staff.config";
import { fetchPropertyList } from "../properties/property.slice";
import { propertyListConfig } from "../properties/property.config";
import { fetchServiceList } from "../service/service_service_list.slice";
import { serviceListConfig } from "../service/service_list.config";
import { store, type RootState } from "../../store";
import { getDisplayId } from "../../utils/displayId";

const getOrganizationId = (data: any) => String(data?.id ?? data?.organization_id ?? "");

const getRelatedFilters = (data: any, filters?: Record<string, unknown>) => ({
  ...(filters ?? {}),
  organization_id: getOrganizationId(data),
});

const isSoloTrader = (data: any) =>
  data?.business_type === "solo_trader" || data?.type?.slug === "solo-traders";

const getOrganizationSubtitle = (data: any) =>
  data?.type?.name ?? data?.business_type ?? data?.slug ?? "Organization";

const getOrganizationDisplayId = (data: any) =>
  getDisplayId(data);

const getVerificationStatus = (data: any) => {
  if (typeof data?.business_verification_status === "string" && data.business_verification_status.trim()) {
    return data.business_verification_status;
  }

  return data?.is_verified ? "verified" : "pending";
};

const getVerificationColor = (data: any) => {
  const status = getVerificationStatus(data);

  if (status === "verified" || status === "active") {
    return "success";
  }

  if (status === "rejected" || status === "blocked") {
    return "danger";
  }

  return "warning";
};

const getPropertyMetric = (data: any) =>
  data?.property_count ?? data?.properties_count ?? data?.properties?.length ?? 0;

const getStaffMetric = (data: any) =>
  data?.staff_count ?? data?.staff_members_count ?? data?.staff?.length ?? 0;

const getServiceMetric = (data: any) =>
  data?.service_count ?? data?.services_count ?? data?.services?.length ?? 0;

const getPortalBase = () =>
  typeof window !== "undefined" && window.location.pathname.startsWith("/super-admin")
    ? "/super-admin"
    : "/admin";

export const organizationDetailConfig: DetailConfig<any> = {
  header: {
    titleAccessor: "name",
    subtitleAccessor: getOrganizationSubtitle,
    badges: [
      {
        label: getVerificationStatus,
        color: getVerificationColor,
      },
    ],
    metrics: [
      {
        label: "Staff Members",
        valueAccessor: getStaffMetric,
      },
      {
        label: (data) => (isSoloTrader(data) ? "Total Services" : "Total Properties"),
        valueAccessor: (data) => (isSoloTrader(data) ? getServiceMetric(data) : getPropertyMetric(data)),
      },
    ],
  },
  tabs: [
    {
      id: "overview",
      label: "Overview",
      sections: ["company_info"],
    },
    {
      id: "staff",
      label: "Staff",
      sections: ["staff_members"],
    },
    {
      id: "properties",
      label: "Properties",
      sections: ["properties_table"],
      showIf: (data) => !isSoloTrader(data),
    },
    {
      id: "services",
      label: "Services",
      sections: ["services_table"],
      showIf: (data) => isSoloTrader(data),
    },
  ],
  sections: [
    {
      id: "company_info",
      type: "info",
      title: "Company Information",
      gridColumnSpan: 12,
      fields: [
        { label: "Company Name", accessor: "name", colSpan: 6 },
        { label: "ID", accessor: getOrganizationDisplayId, colSpan: 6 },
        {
          label: "Type",
          accessor: (data) => data?.type?.name ?? data?.business_type ?? "—",
          colSpan: 6,
        },
        { label: "Email", accessor: "contact_email", colSpan: 6 },
        { label: "Phone", accessor: "contact_phone", colSpan: 6 },
        { label: "ABN", accessor: "abn", colSpan: 6 },
        { label: "ACN", accessor: "acn", colSpan: 6 },
        { label: "Address", accessor: "address", colSpan: 6 },
        { label: "Postcode", accessor: "postcode", colSpan: 6 },
        { label: "State", accessor: "state", colSpan: 6 },
        { label: "Slug", accessor: "slug", colSpan: 6 },
      ],
    },
    {
      id: "staff_members",
      type: "table",
      title: "Staff Members",
      gridColumnSpan: 12,
      fetchFn: (params, data) => {
        const organizationId = getOrganizationId(data);

        if (!organizationId) {
          return;
        }

        void store.dispatch(
          fetchStaff({
            ...params,
            filters: getRelatedFilters(data, params.filters),
          })
        );
      },
      dataSelector: (state: RootState) => state.staff.data,
      totalSelector: (state: RootState) => state.staff.total,
      columns: staffConfig.columns,
      enableRowClick: true,
      getRowLink: (row) =>
        getPortalBase() === "/super-admin"
          ? `/super-admin/staff/${getDisplayId(row)}`
          : `/admin/users/${getDisplayId(row)}`,
    },
    {
      id: "properties_table",
      type: "table",
      title: "Properties",
      gridColumnSpan: 12,
      showIf: (data) => !isSoloTrader(data),
      fetchFn: (params, data) => {
        const organizationId = getOrganizationId(data);

        if (!organizationId) {
          return;
        }

        void store.dispatch(
          fetchPropertyList({
            ...params,
            filters: getRelatedFilters(data, params.filters),
          })
        );
      },
      dataSelector: (state: RootState) => state.propertyList.data,
      totalSelector: (state: RootState) => state.propertyList.total,
      columns: propertyListConfig.columns,
      enableRowClick: true,
      rowActions: [
        {
          label: "Review",
          permission: "property.view",
          onClick: (row) => {
            const scopeBase = getPortalBase();
            const propertyId = getDisplayId(row);

            if (!propertyId) {
              return;
            }

            window.location.href = `${scopeBase}/properties/${propertyId}`;
          },
        },
      ],
      getRowLink: (row) =>
        getPortalBase() === "/super-admin"
          ? `/super-admin/properties/${getDisplayId(row)}`
          : `/admin/properties/${getDisplayId(row)}`,
    },
    {
      id: "services_table",
      type: "table",
      title: "Services",
      gridColumnSpan: 12,
      showIf: (data) => isSoloTrader(data),
      fetchFn: (params, data) => {
        const organizationId = getOrganizationId(data);

        if (!organizationId) {
          return;
        }

        void store.dispatch(
          fetchServiceList({
            ...params,
            filters: getRelatedFilters(data, params.filters),
          })
        );
      },
      dataSelector: (state: RootState) => state.services.data,
      totalSelector: (state: RootState) => state.services.total,
      columns: serviceListConfig.columns,
      enableRowClick: true,
      getRowLink: (row) =>
        getPortalBase() === "/super-admin" ? `/super-admin/services/${getDisplayId(row)}` : `/admin/services/${getDisplayId(row)}`,
    },
  ],
};
