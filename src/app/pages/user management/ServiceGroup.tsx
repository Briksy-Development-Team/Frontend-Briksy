import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchServiceGroup } from "../../services/features/service_group/service_groupSlice";
import { RootState, AppDispatch } from "../../services/store";
import { useDebounce } from "use-debounce";

import { EntityList, QueryParams } from "../../modules/apps/shared_table/entity-list/EntityList";
import { ServiceGroupColumns } from "../../services/features/service_group/service_groupColumns";
import { ServiceGroupFilters } from "../../services/features/service_group/service_groupFilter";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

const ServiceGroup = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { data, total, error } = useSelector(
        (state: RootState) => state.ServiceGroup
    );

    const [search, setSearch] = useState("");

    const [debouncedSearch] = useDebounce(search, 400);

    const [params, setParams] = useState<QueryParams>({
        page: 1,
        per_page: 10,
        search: "",
        filters: {},
        sort: "",
        direction: "asc",
    });

    useEffect(() => {
        setParams((prev) => ({
            ...prev,
            search: debouncedSearch,
            page: 1,
        }));
    }, [debouncedSearch]);

    useEffect(() => {
        dispatch(fetchServiceGroup(params));
    }, [params]);

    const handleParamsChange = (next: QueryParams) => {
        if (next.search !== params.search) {
            setSearch(next.search);
            return;
        }

        setParams(next);
    };

    if (error) {
        return (
            <Content>
                <PageHeader title="Service Group" subtitle="Manage all service group" />
                <div>{error}</div>
            </Content>
        );
    }

    return (
        <Content>
            <PageHeader title="Service Group " subtitle="Manage all service group" />
            
            <EntityList
                data={data}
                total={total}
                params={params}
                onParamsChange={handleParamsChange}
                columns={ServiceGroupColumns}
                filtersConfig={ServiceGroupFilters}
                enableRowClick
                getRowLink={(row: any) =>
                    `/apps/service-management/group/${row.id}`
                }
            />

        </Content>
    );
};

export default ServiceGroup;