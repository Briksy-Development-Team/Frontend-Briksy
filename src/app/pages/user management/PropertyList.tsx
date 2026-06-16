import { useDispatch, useSelector } from "react-redux";
import { fetchPropertyList } from "../../services/features/properties/property.slice";
import {
    openPropertyModal,
    closePropertyModal,
    openDeletePropertyModal,
    closeDeletePropertyModal,
    saveProperty,
    deleteProperty,
} from "../../services/features/properties/property.slice";

import { propertyListConfig } from "../../services/features/properties/property.config";
import type { RootState, AppDispatch } from "../../services/store";

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

import { useRoleAccess } from "../../modules/auth";

import  PropertyModal  from "../../services/features/properties/component/PropertyModal";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";

const PropertyListPage = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { isSuperAdmin } = useRoleAccess();

    const {
        data,
        total,
        error,
        loading,

        isModalOpen,
        editingProperty,

        deleteModalOpen,
        deletingProperty,

        saving,
    } = useSelector((s: RootState) => s.propertyList);

    const { params, handleParamsChange } = useEntityTable((p) =>
        dispatch(fetchPropertyList(p))
    );

    if (error)
        return (
            <Content>
                <PageHeader
                    title={
                        isSuperAdmin
                            ? "Property Management - At a Glance"
                            : "Property Management"
                    }
                    subtitle={
                        isSuperAdmin
                            ? "All properties across companies"
                            : "Manage properties for your company"
                    }
                />
                <div className="text-danger">{error}</div>
            </Content>
        );

    if (loading)
        return (
            <Content>
                <PageHeader
                    title={
                        isSuperAdmin
                            ? "Property Management - At a Glance"
                            : "Property Management"
                    }
                    subtitle={
                        isSuperAdmin
                            ? "All properties across companies"
                            : "Manage properties for your company"
                    }
                />
                <div className="alert alert-light">
                    Loading properties...
                </div>
            </Content>
        );

    return (
        <>
            <Content>
                <PageHeader
                    title={
                        isSuperAdmin
                            ? "Property Management - At a Glance"
                            : "Property Management"
                    }
                    subtitle={
                        isSuperAdmin
                            ? "All properties across companies"
                            : "Manage properties for your company"
                    }
                />

                <EntityList
                    data={data}
                    total={total}
                    params={params}
                    onParamsChange={handleParamsChange}
                    columns={propertyListConfig.columns}
                    filtersConfig={propertyListConfig.filters}
                    enableRowClick
                    headerActions={
                        !isSuperAdmin
                            ? [
                                {
                                    label: "Add Property",
                                    onClick: () =>
                                        dispatch(openPropertyModal(null)),
                                },
                            ]
                            : undefined
                    }
                    rowActions={
                        !isSuperAdmin
                            ? [
                                {
                                    label: "Edit",
                                    onClick: (row) =>
                                        dispatch(openPropertyModal(row)),
                                },
                                {
                                    label: "Delete",
                                    className: "text-danger",
                                    onClick: (row) =>
                                        dispatch(
                                            openDeletePropertyModal(row)
                                        ),
                                },
                            ]
                            : undefined
                    }
                />
            </Content>

            {isModalOpen && (
                <PropertyModal
                    initialValues={editingProperty}
                    isSubmitting={saving}
                    onClose={() =>
                        dispatch(closePropertyModal())
                    }
                    onSubmit={(values) =>
                        dispatch(
                            saveProperty({
                                id: editingProperty?.id,
                                values,
                            })
                        )
                    }
                />
            )}

            {deleteModalOpen && deletingProperty && (
                <DeleteConfirmModal
                    title="Delete Property"
                    message={`Are you sure you want to delete "${deletingProperty.title}"?`}
                    onClose={() =>
                        dispatch(closeDeletePropertyModal())
                    }
                    onConfirm={() =>
                        dispatch(deleteProperty(deletingProperty.id))
                    }
                    isSubmitting={saving}
                />
            )}
        </>
    );
};

export default PropertyListPage;