import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrganization } from "../../../services/features/organization/organization.slice";
import { organizationConfig } from "../../../services/features/organization/organization.config";
import { RootState, AppDispatch } from "../../../services/store";
import { useEntityTable } from "../../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../../modules/apps/shared_table/entity-list/EntityList";
import type { RowAction } from "../../../modules/apps/shared_table/entity-list/table/EntityTable";
import { PageHeader } from "../../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../../_metronic/layout/components/content";
import { useRoleAccess } from "../../../modules/auth";
import { getRolePortalBaseRoute } from "../../../modules/auth/core/roleRoutes";
import type { Organization } from "../../../services/features/organization/organization.types";

type OrganizationPageProps = {
    rowActions?: RowAction<Organization>[];
    title?: string;
    subtitle?: string;
    typeSlugs?: string[];
    businessTypes?: Array<"organisation" | "company" | "solo_trader">;
};

const OrganizationPage = ({
    rowActions: externalRowActions,
    title,
    subtitle,
    typeSlugs,
    businessTypes,
}: OrganizationPageProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { isSuperAdmin } = useRoleAccess();
    const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ['super_admin'] : ['admin']);
    const resolveOrganizationId = (row: Organization) =>
        row.display_id ?? row.generated_id ?? row.id;
    const resolvedTitle = title ?? "Organisations";
    const resolvedSubtitle = subtitle ?? "All registered organisations and companies";
    const resolvedTypeSlugs = typeSlugs ?? [];
    const resolvedBusinessTypes = businessTypes ?? ["organisation", "company"];
    const { data, total, error } = useSelector((s: RootState) => s.organization);

    const baseFilters: Record<string, unknown> = {
        business_type: resolvedBusinessTypes,
        ...(resolvedTypeSlugs.length ? { type_slug: resolvedTypeSlugs } : {}),
    };

    const { params, handleParamsChange } = useEntityTable(
        (p) => dispatch(fetchOrganization(p)),
        { filters: baseFilters }
    );

    const handleOrganizationParamsChange = (next: typeof params) => {
        handleParamsChange({
            ...next,
            filters: {
                ...(next.filters ?? {}),
                ...baseFilters,
            },
        });
    };
    const rowActions = [
        ...(isSuperAdmin
            ? [
                  {
                      label: "Review Properties",
                      permission: "company.view",
                      onClick: (row: Organization) =>
                          navigate(`${portalBase}/companies/organization/${resolveOrganizationId(row)}`),
                  },
              ]
            : []),
        ...(externalRowActions || []),
    ];

    if (error) return (
        <Content>
            <PageHeader title={resolvedTitle} subtitle={resolvedSubtitle} />
            <div>{error}</div>
        </Content>
    );

    return (
        <Content>
            <PageHeader title={resolvedTitle} subtitle={resolvedSubtitle} />
            <EntityList
                data={data}
                total={total}
                params={params}
                onParamsChange={handleOrganizationParamsChange}
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
