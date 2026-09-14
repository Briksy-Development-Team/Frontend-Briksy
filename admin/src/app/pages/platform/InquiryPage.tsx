import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import type { RootState, AppDispatch } from "../../services/store";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import { getRolePortalBaseRoute, useRoleAccess } from "../../modules/auth";
import { getDisplayId } from "../../services/utils/displayId";
import { fetchInquiries } from "../../services/features/inquiries/inquiry.slice";
import { inquiryConfig } from "../../services/features/inquiries/inquiry.config";

const InquiryList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { isSuperAdmin } = useRoleAccess();

    const portalBase = getRolePortalBaseRoute(
        isSuperAdmin ? ["super_admin"] : ["admin"],
    );

    const {
        data,
        total,
    } = useSelector((s: RootState) => s.inquiries);

    const { params, handleParamsChange } = useEntityTable((p) =>
        dispatch(fetchInquiries(p)),
    );

    return (
        <Content>
            <PageHeader title="Property Inquiries" subtitle="Manage enquiries submitted from the website" />

            <EntityList
                data={data}
                total={total}
                params={params}
                onParamsChange={handleParamsChange}
                columns={inquiryConfig.columns}
                filtersConfig={inquiryConfig.filters}
                getRowLink={(row) => `${portalBase}/inquiry/${getDisplayId(row)}`}
                enableRowClick
            />
        </Content>
    );
};

export default function InquiryPage() {
    return (
        <Routes>
            <Route index element={<InquiryList />} />
            <Route path=":id" element={<GenericDetailPage />} />
        </Routes>
    );
}
