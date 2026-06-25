import { useState, useEffect } from "react";
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

import { getRolePortalBaseRoute, useRoleAccess } from "../../modules/auth";

import { useNavigate } from "react-router-dom";
import { Routes, Route } from "react-router-dom";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import PropertyModal from "../../services/features/properties/component/PropertyModal";
import PropertyMapView from "../../services/features/properties/component/PropertyMapView";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";

const PropertyListPage = ({ rowActions }: { rowActions?: any[] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const { isSuperAdmin } = useRoleAccess();
  const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ["super_admin"] : ["admin"]);
  const {
    data,
    total,
    error,
    loading,
    isModalOpen,
    saving,
  } = useSelector((s: RootState) => s.propertyList);

  const { params, handleParamsChange } = useEntityTable((p) =>
    dispatch(fetchPropertyList(p)),
  );

  useEffect(() => {
    if (!saving && !isModalOpen) {
      dispatch(fetchPropertyList(params));
    }
  }, [isModalOpen, saving, params, dispatch]);

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
        <div className="alert alert-light">Loading properties...</div>
      </Content>
    );

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

      <div className="d-flex justify-content-end mb-5">
        <div className="btn-group">
          <button
            type="button"
            className={`btn btn-sm ${viewMode === "list" ? "btn-primary" : "btn-light"}`}
            onClick={() => setViewMode("list")}
          >
            List View
          </button>
          <button
            type="button"
            className={`btn btn-sm ${viewMode === "map" ? "btn-primary" : "btn-light"}`}
            onClick={() => setViewMode("map")}
          >
            Map View
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <EntityList
          data={data}
          total={total}
          params={params}
          onParamsChange={handleParamsChange}
          columns={propertyListConfig.columns}
          filtersConfig={propertyListConfig.filters}
          enableRowClick={true}
          getRowLink={(row) => `${portalBase}/property-management/detail/${row.id}`}
          headerActions={
            !isSuperAdmin
              ? [
                  {
                    label: "Add Property",
                    onClick: () => dispatch(openPropertyModal(null)),
                  },
                ]
              : undefined
          }
          rowActions={rowActions}
        />
      ) : (
        <PropertyMapView properties={data} />
      )}
    </Content>
  );
};

const PropertyListPageWrapper = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSuperAdmin } = useRoleAccess();
  
  const {
    isModalOpen,
    editingProperty,
    deleteModalOpen,
    deletingProperty,
    saving,
  } = useSelector((s: RootState) => s.propertyList);

  const rowActions = !isSuperAdmin
    ? [
        {
          label: "Edit",
          onClick: (row: any) => dispatch(openPropertyModal(row)),
        },
        {
          label: "Delete",
          className: "text-danger",
          onClick: (row: any) => dispatch(openDeletePropertyModal(row)),
        },
      ]
    : undefined;

  return (
    <>
      <Routes>
        <Route index element={<PropertyListPage rowActions={rowActions} />} />
        <Route path="detail/:id" element={<GenericDetailPage rowActions={rowActions} />} />
      </Routes>

      {isModalOpen && (
        <PropertyModal
          initialValues={editingProperty}
          isSubmitting={saving}
          onClose={() => dispatch(closePropertyModal())}
          onSubmit={async (values) => {
            await dispatch(
              saveProperty({
                id: editingProperty?.id,
                values,
              }),
            ).unwrap();
          }}
        />
      )}

      {deleteModalOpen && deletingProperty && (
        <DeleteConfirmModal
          title="Delete Property"
          message={`Are you sure you want to delete "${deletingProperty.title}"?`}
          onClose={() => dispatch(closeDeletePropertyModal())}
          onConfirm={() => dispatch(deleteProperty(deletingProperty.id))}
          isSubmitting={saving}
        />
      )}
    </>
  );
};

export default PropertyListPageWrapper;
