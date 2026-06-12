import { useDispatch, useSelector } from "react-redux";
import { fetchPropertyList } from "../../services/features/properties/property.slice";
import { propertyListConfig } from "../../services/features/properties/property.config";
import type { RootState, AppDispatch } from "../../services/store";

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import { useRoleAccess } from "../../modules/auth";

const PropertyListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isSuperAdmin } = useRoleAccess();
    const { data, total, error, loading } = useSelector((s: RootState) => s.propertyList);

    const { params, handleParamsChange } = useEntityTable(
        (p) => dispatch(fetchPropertyList(p))
    );

    if (error) return (
        <Content>
            <PageHeader
                title={isSuperAdmin ? "Property Management - At a Glance" : "Property Management"}
                subtitle={isSuperAdmin ? "All properties across companies" : "Manage properties for your company"}
            />
            <div className="text-danger">{error}</div>
        </Content>
    );

    if (loading) return (
        <Content>
            <PageHeader
                title={isSuperAdmin ? "Property Management - At a Glance" : "Property Management"}
                subtitle={isSuperAdmin ? "All properties across companies" : "Manage properties for your company"}
            />
            <div className="alert alert-light">Loading properties...</div>
        </Content>
    );

    return (
        <Content>
            <PageHeader
                title={isSuperAdmin ? "Property Management - At a Glance" : "Property Management"}
                subtitle={isSuperAdmin ? "All properties across companies" : "Manage properties for your company"}
            />
            <EntityList
                data={data}
                total={total}
                params={params}
                onParamsChange={handleParamsChange}
                columns={propertyListConfig.columns}
                filtersConfig={propertyListConfig.filters}
                enableRowClick={false}
            />
        </Content>
    );
};

export default PropertyListPage;
