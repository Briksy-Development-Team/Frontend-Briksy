import { useDispatch, useSelector } from "react-redux";
import {
    fetchServiceList,
    saveService,
    deleteService,
    openServiceModal,
    closeServiceModal,
    openDeleteServiceModal,
    closeDeleteServiceModal,
} from "../../services/features/service/service_service_list.slice";

import ServiceModal from "../../services/features/service/component/ServiceModal";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { serviceListConfig } from "../../services/features/service/service_list.config";
import type { RootState, AppDispatch } from "../../services/store";

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import { getRolePortalBaseRoute, useRoleAccess } from "../../modules/auth";

const ServiceListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isSuperAdmin } = useRoleAccess();
    const canManage = !isSuperAdmin;
    const portalBase = getRolePortalBaseRoute(
        isSuperAdmin ? ["super_admin"] : ["admin"],
    );
    const {
        data,
        total,
        error,
        loading,
        saving,
        isModalOpen,
        editingService,
        deleteModalOpen,
        deletingService,
    } = useSelector((s: RootState) => s.services);

    const { params, handleParamsChange } = useEntityTable((p) =>
        dispatch(fetchServiceList(p)),
    );

    const title = "Services";
    const subtitle = isSuperAdmin
        ? "View all services across the platform"
        : "Manage services offered by your company";

    if (error) {
        return (
            <Content>
                <PageHeader title={title} subtitle={subtitle} />
                <div className="text-danger">{error}</div>
            </Content>
        );
    }

    if (loading) {
        return (
            <Content>
                <PageHeader title={title} subtitle={subtitle} />
                <div className="alert alert-light">Loading services...</div>
            </Content>
        );
    }

    return (
        <>
            <Content>
                <PageHeader title={title} subtitle={subtitle} />

                <EntityList
                    data={data}
                    total={total}
                    params={params}
                    onParamsChange={handleParamsChange}
                    columns={serviceListConfig.columns}
                    filtersConfig={serviceListConfig.filters}
                    getRowLink={(row) => `${portalBase}/services-management/${row.id}`}
                    enableRowClick headerActions={
                        !isSuperAdmin
                            ? [
                                {
                                    label: "Add Service",
                                    onClick: () => dispatch(openServiceModal(null)),
                                },
                            ]
                            : undefined
                    }
                    rowActions={
                        canManage
                            ? [
                                {
                                    label: "Edit",
                                    onClick: (row) => dispatch(openServiceModal(row)),
                                },
                                {
                                    label: "Delete",
                                    className: "text-danger",
                                    onClick: (row) => dispatch(openDeleteServiceModal(row)),
                                },
                            ]
                            : []
                    }
                />
            </Content>

            {canManage && isModalOpen && (
                <ServiceModal
                    initialValues={editingService}
                    isSubmitting={saving}
                    onClose={() => dispatch(closeServiceModal())}
                    onSubmit={(values) =>
                        dispatch(saveService({ id: editingService?.id, values }))
                    }
                />
            )}

            {canManage && deleteModalOpen && deletingService && (
                <DeleteConfirmModal
                    title="Delete Service"
                    message={`Are you sure you want to delete "${deletingService.name}"?`}
                    onClose={() => dispatch(closeDeleteServiceModal())}
                    onConfirm={() => dispatch(deleteService(deletingService.id))}
                    isSubmitting={saving}
                />
            )}
        </>
    );
};

export default ServiceListPage;
