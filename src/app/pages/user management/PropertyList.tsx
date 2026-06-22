import { useEffect, useMemo, useState } from "react";
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
import { fetchPropertyMapApi } from "../../services/features/properties/property.api";
import type { RootState, AppDispatch } from "../../services/store";

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

import { useRoleAccess } from "../../modules/auth";

import PropertyModal from "../../services/features/properties/component/PropertyModal";
import PropertyMapView from "../../services/features/properties/component/PropertyMapView";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { useToast } from "../../services/ui/toast/useToast";
import type { PropertyList } from "../../services/features/properties/property.types";

const PropertyListPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [mapProperties, setMapProperties] = useState<PropertyList[]>([]);
  const [mapLoading, setMapLoading] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapFilters, setMapFilters] = useState({
    status: "",
    suburb: "",
    state: "",
    postcode: "",
    property_type_id: "",
    search: "",
  });

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
    dispatch(fetchPropertyList(p)),
  );

  useEffect(() => {
    if (viewMode !== "map") {
      return;
    }

    let active = true;
    setMapLoading(true);
    setMapError(null);

    fetchPropertyMapApi({
      ...params,
      search: mapFilters.search || params.search,
      filters: {
        ...(params.filters ?? {}),
        status: mapFilters.status || (params.filters as Record<string, unknown>)?.status || undefined,
        suburb: mapFilters.suburb || (params.filters as Record<string, unknown>)?.suburb || undefined,
        state: mapFilters.state || (params.filters as Record<string, unknown>)?.state || undefined,
        postcode: mapFilters.postcode || (params.filters as Record<string, unknown>)?.postcode || undefined,
        property_type_id: mapFilters.property_type_id || (params.filters as Record<string, unknown>)?.property_type_id || undefined,
      },
    })
      .then((items) => {
        if (!active) {
          return;
        }

        setMapProperties(items);
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        setMapError(error instanceof Error ? error.message : "Failed to load property map data");
      })
      .finally(() => {
        if (active) {
          setMapLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [mapFilters, params, viewMode]);

  const mappedCount = useMemo(
    () => mapProperties.filter((property) => typeof property.latitude === "number" && typeof property.longitude === "number").length,
    [mapProperties],
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
        <div className="alert alert-light">Loading properties...</div>
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
            rowActions={
              !isSuperAdmin
                ? [
                    {
                      label: "Edit",
                      onClick: (row) => dispatch(openPropertyModal(row)),
                    },
                    {
                      label: "Delete",
                      className: "text-danger",
                      onClick: (row) => dispatch(openDeletePropertyModal(row)),
                    },
                  ]
                : undefined
            }
          />
        ) : (
          <div className="d-flex flex-column gap-5">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <div className="row g-4">
                  <div className="col-md-3">
                    <label className="form-label">Search</label>
                    <input
                      className="form-control form-control-solid"
                      value={mapFilters.search}
                      onChange={(e) => setMapFilters((prev) => ({ ...prev, search: e.target.value }))}
                      placeholder="Search properties"
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select form-select-solid"
                      value={mapFilters.status}
                      onChange={(e) => setMapFilters((prev) => ({ ...prev, status: e.target.value }))}
                    >
                      <option value="">All</option>
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Suburb</label>
                    <input
                      className="form-control form-control-solid"
                      value={mapFilters.suburb}
                      onChange={(e) => setMapFilters((prev) => ({ ...prev, suburb: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">State</label>
                    <input
                      className="form-control form-control-solid"
                      value={mapFilters.state}
                      onChange={(e) => setMapFilters((prev) => ({ ...prev, state: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-2">
                    <label className="form-label">Postcode</label>
                    <input
                      className="form-control form-control-solid"
                      value={mapFilters.postcode}
                      onChange={(e) => setMapFilters((prev) => ({ ...prev, postcode: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-1 d-flex align-items-end">
                    <button
                      type="button"
                      className="btn btn-light w-100"
                      onClick={() =>
                        setMapFilters({
                          status: "",
                          suburb: "",
                          state: "",
                          postcode: "",
                          property_type_id: "",
                          search: "",
                        })
                      }
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div className="text-muted fs-7 mt-3">
                  {mappedCount} mapped property markers, {mapProperties.length - mappedCount} missing coordinates.
                </div>
              </div>
            </div>

            {mapLoading ? <div className="alert alert-light">Loading property map...</div> : null}
            {mapError ? <div className="alert alert-danger">{mapError}</div> : null}
            {!mapLoading && !mapError ? <PropertyMapView properties={mapProperties} /> : null}
          </div>
        )}
      </Content>

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

            dispatch(fetchPropertyList(params));
            toast.success(editingProperty ? "Property updated." : "Property created.");
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

export default PropertyListPage;
