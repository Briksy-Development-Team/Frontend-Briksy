import { useDispatch, useSelector } from "react-redux";
import { fetchOrganization } from "../../../services/features/organization/organization.slice";
import { organizationConfig } from "../../../services/features/organization/organization.config";
import { RootState, AppDispatch } from "../../../services/store";
import { useEntityTable } from "../../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../../_metronic/layout/components/content";

const OrganizationPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, total, error } = useSelector((s: RootState) => s.organization);

    const { params, handleParamsChange } = useEntityTable(
        (p) => dispatch(fetchOrganization(p))
    );

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
                getRowLink={(row) => `/organizations/${row.id}`}
            />
        </Content>
    );
};

export default OrganizationPage;