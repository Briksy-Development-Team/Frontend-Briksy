import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import {
    fetchPlanRequests,
    // savePlanRequest,
    // deletePlanRequest,
    // approvePlanRequest,
    // rejectPlanRequest,
    openPlanRequestModal,
    // closePlanRequestModal,
    openReviewModal,
    // closeReviewModal,
    openDeletePlanRequestModal,
    // closeDeletePlanRequestModal,
} from "../../services/features/plan_requests/plan-request.slice";

import { planRequestConfig } from "../../services/features/plan_requests/plan-request.config";

// import { PlanRequestModal } from "../../services/features/plan_requests/component/PlanRequestModal";
// import { PlanRequestReviewModal } from "../../services/features/plan_requests/component/PlanRequestReviewModal";

import type { RootState, AppDispatch } from "../../services/store";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
// import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import { getRolePortalBaseRoute, useRoleAccess } from "../../modules/auth";

const InquiryList = ({ rowActions }: { rowActions: any[] }) => {
    const dispatch = useDispatch<AppDispatch>();

    const { isSuperAdmin } = useRoleAccess();

    const portalBase = getRolePortalBaseRoute(
        isSuperAdmin ? ["super_admin"] : ["admin"],
    );

    const {
        data,
        total,
    } = useSelector((s: RootState) => s.planRequests);

    const { params, handleParamsChange } = useEntityTable((p) =>
        dispatch(fetchPlanRequests(p)),
    );

    return (
        <Content>
            <PageHeader title="Inquiry Requests" subtitle="Manage Inquiry requests" />

            <EntityList
                data={data}
                total={total}
                params={params}
                onParamsChange={handleParamsChange}
                columns={planRequestConfig.columns}
                filtersConfig={planRequestConfig.filters}
                getRowLink={(row) => `${portalBase}/inquiry/${row.id}`}
                enableRowClick
                headerActions={[
                    {
                        label: "New Request",
                        onClick: () => dispatch(openPlanRequestModal(null)),
                    },
                ]}
                rowActions={rowActions}
            />
        </Content>
    );
};

export default function InquiryPage() {
    const dispatch = useDispatch<AppDispatch>();
    
    const rowActions = [
        {
            label: "Approve",
            onClick: (row: any) =>
                dispatch(
                    openReviewModal({
                        request: row,
                        actionType: "approve",
                    }),
                ),
        },
        {
            label: "Reject",
            onClick: (row: any) =>
                dispatch(
                    openReviewModal({
                        request: row,
                        actionType: "reject",
                    }),
                ),
        },
        {
            label: "Delete",
            className: "text-danger",
            onClick: (row: any) => dispatch(openDeletePlanRequestModal(row)),
        },
    ];

    return (
        <Routes>
            <Route index element={<InquiryList rowActions={rowActions} />} />
            <Route path=":id" element={<GenericDetailPage rowActions={rowActions} />} />
        </Routes>
    );
}
