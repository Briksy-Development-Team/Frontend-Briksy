import { useDispatch, useSelector } from "react-redux";
import { fetchServiceList } from "../../services/features/service/service_service_list.slice";
import { serviceListConfig } from "../../services/features/service/service_list.config";
import type { RootState, AppDispatch } from "../../services/store";

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

const ServiceListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, total, error } = useSelector((s: RootState) => s.serviceGroup);

    const { params, handleParamsChange } = useEntityTable(
        (p) => dispatch(fetchServiceList(p))
    );

    if (error) return (
        <Content>
            <PageHeader title="Service List" subtitle="All service List on the platform" />
            <div className="text-danger">{error}</div>
        </Content>
    );

    return (
        <Content>
            <PageHeader title="Service List" subtitle="All service List on the platform" />
            <EntityList
                data={data}
                total={total}
                params={params}
                onParamsChange={handleParamsChange}
                columns={serviceListConfig.columns}
                filtersConfig={serviceListConfig.filters}
                enableRowClick={false}
            />
        </Content>
    );
};

export default ServiceListPage;
