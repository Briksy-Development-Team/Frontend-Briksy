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

const InquiryList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { isSuperAdmin } = useRoleAccess();

    const portalBase = getRolePortalBaseRoute(
        isSuperAdmin ? ["super_admin"] : ["admin"],
    );

    const {
        data,
        total,
        // isModalOpen,
        // editingRequest,
        // reviewingRequest,
        // reviewAction,
        // saving,
        // deleteModalOpen,
        // deletingRequest,
    } = useSelector((s: RootState) => s.planRequests);

    const { params, handleParamsChange } = useEntityTable((p) =>
        dispatch(fetchPlanRequests(p)),
    );

    return (
        <>
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
                    rowActions={[
                        {
                            label: "Approve",
                            onClick: (row) =>
                                dispatch(
                                    openReviewModal({
                                        request: row,
                                        actionType: "approve",
                                    }),
                                ),
                        },
                        {
                            label: "Reject",
                            onClick: (row) =>
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
                            onClick: (row) => dispatch(openDeletePlanRequestModal(row)),
                        },
                    ]}
                />
            </Content>

            {/* {isModalOpen && (
                <PlanRequestModal
                    initialValues={editingRequest}
                    isSubmitting={saving}
                    onClose={() => dispatch(closePlanRequestModal())}
                    onSubmit={(values) =>
                        dispatch(
                            savePlanRequest({
                                id: editingRequest?.id,
                                values,
                            }),
                        )
                    }
                />
            )} */}

            {/* {reviewingRequest && reviewAction && (
                <PlanRequestReviewModal
                    request={reviewingRequest}
                    action={reviewAction}
                    isSubmitting={saving}
                    onClose={() => dispatch(closeReviewModal())}
                    onSubmit={(payload) =>
                        dispatch(
                            reviewAction === "approve"
                                ? approvePlanRequest({
                                    id: reviewingRequest.id,
                                    payload,
                                })
                                : rejectPlanRequest({
                                    id: reviewingRequest.id,
                                    payload,
                                }),
                        )
                    }
                />
            )} */}
{/* 
            {deleteModalOpen && deletingRequest && (
                <DeleteConfirmModal
                    title="Delete Plan Request"
                    message={`Are you sure you want to delete ${deletingRequest.company_name ??
                        deletingRequest.contact_name ??
                        "this request"
                        }?`}
                    onClose={() => dispatch(closeDeletePlanRequestModal())}
                    onConfirm={() => dispatch(deletePlanRequest(deletingRequest.id))}
                    isSubmitting={saving}
                />
            )} */}
        </>
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
