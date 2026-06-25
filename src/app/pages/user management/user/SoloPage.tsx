import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import GenericDetailPage from "../../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import { fetchOrganization } from "../../../services/features/organization/organization.slice";
import { organizationConfig } from "../../../services/features/organization/organization.config";
import type { RootState, AppDispatch } from "../../../services/store";
import { useEntityTable } from "../../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../../_metronic/layout/components/content";
import { getRolePortalBaseRoute, useRoleAccess } from "../../../modules/auth";

const SOLO_TRADER_SERVICES = [
  { label: "Electrical", value: "electrical" },
  { label: "Plumbing", value: "plumbing" },
  { label: "Fencing", value: "fencing" },
  { label: "Landscapers", value: "landscapers" },
  { label: "Conveyancers", value: "conveyancers" },
  { label: "Brokers", value: "brokers" },
];

const SoloPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSuperAdmin } = useRoleAccess();
  const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ["super_admin"] : ["admin"]);
  const { data, total, error } = useSelector((s: RootState) => s.organization);

  const { params, handleParamsChange } = useEntityTable(
    (p) => dispatch(fetchOrganization(p)),
    { filters: { type_slug: ["solo-traders"] } }
  );

  const handleSoloParamsChange = (next: typeof params) => {
    handleParamsChange({
      ...next,
      filters: {
        ...(next.filters ?? {}),
        type_slug: ["solo-traders"],
      },
    });
  };

  const filtersConfig = [
    ...organizationConfig.filters,
    {
      key: "service_slug",
      label: "Service",
      type: "select" as const,
      options: SOLO_TRADER_SERVICES,
    },
  ];

  if (error) {
    return (
      <Content>
        <PageHeader title="Solo Traders" subtitle="Filter and inspect solo trader organizations" />
        <div className="text-danger">{error}</div>
      </Content>
    );
  }

  return (
    <Content>
      <PageHeader title="Solo Traders" subtitle="Solo trader organizations and service tags" />
      <EntityList
        data={data}
        total={total}
        params={params}
        onParamsChange={handleSoloParamsChange}
        columns={organizationConfig.columns}
        filtersConfig={filtersConfig}
        enableRowClick
        getRowLink={(row) => `${portalBase}/companies/solo-traders/detail/${row.id}`}
      />
    </Content>
  );
};

const SoloPageWrapper = () => (
    <Routes>
        <Route index element={<SoloPage />} />
        <Route path="detail/:id" element={<GenericDetailPage />} />
    </Routes>
);

export default SoloPageWrapper;
