import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrganization } from "../../../services/features/organization/organization.slice";
import { organizationConfig } from "../../../services/features/organization/organization.config";
import { RootState, AppDispatch } from "../../../services/store";
import { useEntityTable } from "../../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../../_metronic/layout/components/content";
import { useRoleAccess } from "../../../modules/auth";
import { getRolePortalBaseRoute } from "../../../modules/auth/core/roleRoutes";

const OrganizationPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isSuperAdmin } = useRoleAccess();
    const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ['super_admin'] : ['admin']);
    const resolveOrganizationId = (row: { id: string; generated_id?: string | null; display_id?: string | null }) =>
        row.display_id ?? row.generated_id ?? row.id;
    const { data, total, error } = useSelector((s: RootState) => s.organization);

    const { params, handleParamsChange } = useEntityTable(
        (p) => dispatch(fetchOrganization(p))
    );
    const rowActions = isSuperAdmin
        ? [
              {
                  label: "Review Properties",
                  permission: "company.view",
                  onClick: (row: { id: string; generated_id?: string | null; display_id?: string | null }) =>
                      navigate(`${portalBase}/companies/organization/${resolveOrganizationId(row)}`),
              },
          ]
        : undefined;

    if (error) return (
        <Content>
            <PageHeader title="Organizations" subtitle="All registered organizations" />
            <div>{error}</div>
        </Content>
    );

    return (
        <Content>
            <PageHeader title="Organizations" subtitle="All registered organizations" />
            <EntityList
                data={data}
                total={total}
                params={params}
                onParamsChange={handleParamsChange}
                columns={organizationConfig.columns}
                filtersConfig={organizationConfig.filters}
                enableRowClick
                getRowLink={(row) =>
                    isSuperAdmin
                        ? `${portalBase}/companies/organization/${resolveOrganizationId(row)}`
                        : `${portalBase}/businesses/${resolveOrganizationId(row)}`
                }
                rowActions={rowActions}
            />
        </Content>
    );
};

export default OrganizationPage;
