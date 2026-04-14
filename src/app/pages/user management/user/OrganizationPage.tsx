import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrganization } from "../../../services/features/organization/orgrSlice";
import { RootState, AppDispatch } from "../../../services/store";

import { EntityList } from "../../../modules/apps/shared_table/entity-list/EntityList";
import { OrganizationColumns } from "../../../services/features/organization/orgrColumns";
import { OrganizationFilters } from "../../../services/features/organization/orgrFilter";
import { PageHeader } from "../../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../../_metronic/layout/components/content";

const OrganizationPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { data, total, loading, error } = useSelector(
        (state: RootState) => state.organization
    );

    const [params, setParams] = useState({
        page: 1,
        per_page: 10,
        search: "",
        filters: {},
        sortBy: "",
        sortOrder: "asc" as "asc" | "desc",
    });

    useEffect(() => {
        dispatch(fetchOrganization(params));
    }, [params, dispatch]);

    if (error) {
        return (
            <Content>
                <PageHeader title="Organization" subtitle="Manage all organizations" />
                <div>{error}</div>
            </Content>
        );
    }

    return (
        <Content>
            <PageHeader title="Organization" subtitle="Manage all organizations" />

            {loading ? (
                <div>Loading...</div>
            ) : (
                <EntityList
                    data={data}
                    total={total}
                    params={params}
                    onParamsChange={setParams}
                    columns={OrganizationColumns}
                    filtersConfig={OrganizationFilters}
                    searchableKeys={["organization_name", "email"]}
                    enableRowClick
                    getRowLink={(row: any) =>
                        `/apps/user/organization/${row.id}`
                    }
                />
            )}
        </Content>
    );
};

export default OrganizationPage;