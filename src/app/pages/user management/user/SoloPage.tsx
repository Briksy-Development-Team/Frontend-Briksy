import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../../services/store";
import { EntityList } from "../../../modules/apps/shared_table/entity-list/EntityList";
import { SoloColumns } from "../../../services/features/solo/soloColumns";
import { SoloFilters } from "../../../services/features/solo/soloFilter";
import { PageHeader } from "../../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../../_metronic/layout/components/content";
import { fetchSolo } from "../../../services/features/solo/soloSlice";

const SoloPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { data, total, loading, error } = useSelector(
        (state: RootState) => state.solo
    );

    const [params, setParams] = useState({
        page: 1,
        pageSize: 10,
        search: "",
        filters: {},
        sortBy: "",
        sortOrder: "asc" as "asc" | "desc",
    });

    useEffect(() => {
        dispatch(fetchSolo(params));
    }, [params, dispatch]);

    if (error) {
        return (
            <Content>
                <PageHeader title="Solo Trader" subtitle="Manage all Solo" />
                <div>{error}</div>
            </Content>
        );
    }

    return (



        <Content>
            <PageHeader title="Solo Trader" subtitle="Manage all Solo" />

            {loading ? (
                <div>Loading...</div>
            ) : (
                <EntityList
                    data={data}
                    total={total}
                    params={params}
                    onParamsChange={setParams}
                    columns={SoloColumns}
                    filtersConfig={SoloFilters}
                    searchableKeys={["solo_name", "email"]}
                    enableRowClick
                    getRowLink={(row: any) =>
                        `/apps/user/solo/${row.id}`
                    }
                />
            )}
        </Content>
                    
       


    );
};

export default SoloPage;