import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { offersConfig } from "../../services/features/offers/offers.config";
import type { PropertyList, PropertyOffer } from "../../services/features/properties/property.types";
import { fetchPropertyListApi } from "../../services/features/properties/property.api";
import {
  deletePropertyOfferApi,
  fetchPropertyOffersApi,
  savePropertyOfferApi,
  togglePropertyOfferApi,
} from "../../services/features/offers/offers.api";
import { getRolePortalBaseRoute, useRoleAccess } from "../../modules/auth";

type OfferForm = Partial<PropertyOffer> & {
  highlights_text?: string;
};

const emptyOffer: OfferForm = {
  title: "",
  tag_label: "",
  summary: "",
  description: "",
  highlights_text: "",
  terms: "",
  is_active: true,
  sort_order: 0,
};

function PropertyOffersList({
  items,
  loading,
  error,
  rowActions,
  onNewOffer,
}: {
  items: PropertyOffer[];
  loading: boolean;
  error: string | null;
  rowActions: any[];
  onNewOffer: () => void;
}) {
  const { isSuperAdmin } = useRoleAccess();
  const portalBase = getRolePortalBaseRoute(
    isSuperAdmin ? ["super_admin"] : ["admin"]
  );

  const { params, handleParamsChange } = useEntityTable(() => undefined);

  const filteredItems = useMemo(() => {
    let result = [...items];
    if (params.search) {
      const q = params.search.toLowerCase();
      result = result.filter(
        (item) =>
          item.title?.toLowerCase().includes(q) ||
          item.property_listing?.title?.toLowerCase().includes(q) ||
          item.tag_label?.toLowerCase().includes(q)
      );
    }
    if (params.filters?.is_active) {
      const isActiveBool = params.filters.is_active === "1";
      result = result.filter((item) => item.is_active === isActiveBool);
    }
    return result;
  }, [items, params.search, params.filters]);

  return (
    <Content>
      <PageHeader
        title="Property Offers"
        subtitle="Create promotional offers for listings"
      />
      {loading ? <div className="text-muted mb-4">Loading offers...</div> : null}
      {error ? <div className="alert alert-danger mb-5">{error}</div> : null}

      <EntityList
        data={filteredItems}
        total={filteredItems.length}
        params={params}
        onParamsChange={handleParamsChange}
        columns={offersConfig.columns}
        filtersConfig={offersConfig.filters}
        getRowLink={(row) => `${portalBase}/property-offers/${row.id}`}
        enableRowClick
        storageKey="propertyOfferColumns"
        headerActions={[
          {
            label: "New Offer",
            onClick: onNewOffer,
          },
        ]}
        rowActions={rowActions}
      />
    </Content>
  );
}

export default function PropertyOffersPage() {
  const [items, setItems] = useState<PropertyOffer[]>([]);
  const [properties, setProperties] = useState<PropertyList[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<OfferForm | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<PropertyOffer | null>(null);
  const [savedOffer, setSavedOffer] = useState<PropertyOffer | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [offers, propertyResponse] = await Promise.all([
        fetchPropertyOffersApi(),
        fetchPropertyListApi({ per_page: 100, sort: "created_at", direction: "desc" }),
      ]);

      setItems(offers);
      setProperties(propertyResponse.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load property offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const propertyOptions = useMemo(
    () =>
      properties.map((property) => ({
        id: property.id,
        label: `${property.display_id ?? property.generated_id ?? property.id} - ${property.title}`,
      })),
    [properties]
  );

  const submit = async () => {
    if (!editing?.title || !editing.property_listing_id) {
      return;
    }

    setSaving(true);
    try {
      const res = await savePropertyOfferApi(
        {
          ...editing,
          property_listing_id: editing.property_listing_id,
          title: editing.title,
          tag_label: editing.tag_label?.trim() || null,
          highlights: editing.highlights_text
            ? editing.highlights_text.split("\n").map((line) => line.trim()).filter(Boolean)
            : editing.highlights ?? [],
        },
        editing.id
      );
      if (res) {
        setSavedOffer(res);
      }
      setEditing(null);
      await load();
    } catch (error: any) {
      const responseMessage = error?.response?.data?.message;
      const message = responseMessage ?? error?.message ?? "Unable to save property offer.";
      setError(message);
      window.alert(message);
    } finally {
      setSaving(false);
    }
  };

  const selectedProperty = properties.find((property) => property.id === editing?.property_listing_id);

  const rowActions = [
    {
      label: "Edit",
      onClick: (row: PropertyOffer) =>
        setEditing({
          ...row,
          highlights_text: Array.isArray(row.highlights) ? row.highlights.join("\n") : "",
        }),
    },
    {
      label: "Toggle Active",
      onClick: async (row: PropertyOffer) => {
        const updated = await togglePropertyOfferApi(row.id, !row.is_active);
        setSavedOffer(updated);
        await load();
        return updated;
      },
    },
    {
      label: "Delete",
      className: "text-danger",
      onClick: (row: PropertyOffer) => setDeletingOffer(row),
    },
  ];

  return (
    <>
      <Routes>
        <Route
          index
          element={
            <PropertyOffersList
              items={items}
              loading={loading}
              error={error}
              rowActions={rowActions}
              onNewOffer={() => setEditing(emptyOffer)}
            />
          }
        />
        <Route
          path=":id"
          element={<GenericDetailPage rowActions={rowActions} dataPatch={savedOffer} />}
        />
      </Routes>

      {editing ? (
        <ModalShell
          title={editing.id ? "Edit Offer" : "New Offer"}
          onClose={() => setEditing(null)}
          onSubmit={submit}
          submitLabel={saving ? "Saving..." : "Save"}
          isValid={!!editing.title && !!editing.property_listing_id}
        >
          <div className="row g-5">
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                className="form-control form-control-solid"
                value={editing.title ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, title: e.target.value }))}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Property</label>
              <select
                className="form-select form-select-solid"
                value={editing.property_listing_id ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, property_listing_id: e.target.value }))}
              >
                <option value="">Select property</option>
                {propertyOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {selectedProperty ? (
                <div className="form-text">
                  {selectedProperty.full_address ?? selectedProperty.address ?? "Property selected"}
                </div>
              ) : null}
            </div>
            <div className="col-md-6">
              <label className="form-label">Tag Label</label>
              <input
                className="form-control form-control-solid"
                value={editing.tag_label ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, tag_label: e.target.value }))}
                placeholder="Optional"
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Sort Order</label>
              <input
                className="form-control form-control-solid"
                type="number"
                value={editing.sort_order ?? 0}
                onChange={(e) => setEditing((current) => ({ ...current, sort_order: Number(e.target.value) }))}
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Active</label>
              <select
                className="form-select form-select-solid"
                value={editing.is_active ? "1" : "0"}
                onChange={(e) => setEditing((current) => ({ ...current, is_active: e.target.value === "1" }))}
              >
                <option value="1">Yes</option>
                <option value="0">No</option>
              </select>
            </div>
            <div className="col-12">
              <label className="form-label">Summary</label>
              <input
                className="form-control form-control-solid"
                value={editing.summary ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, summary: e.target.value }))}
              />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                className="form-control form-control-solid"
                rows={4}
                value={editing.description ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, description: e.target.value }))}
              />
            </div>
            <div className="col-12">
              <label className="form-label">What&apos;s Included</label>
              <textarea
                className="form-control form-control-solid"
                rows={4}
                value={editing.highlights_text ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, highlights_text: e.target.value }))}
                placeholder="Enter one item per line"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Terms</label>
              <textarea
                className="form-control form-control-solid"
                rows={3}
                value={editing.terms ?? ""}
                onChange={(e) => setEditing((current) => ({ ...current, terms: e.target.value }))}
              />
            </div>
          </div>
        </ModalShell>
      ) : null}

      {deletingOffer ? (
        <DeleteConfirmModal
          title="Delete Offer"
          message={`Are you sure you want to delete offer "${deletingOffer.title}"?`}
          onClose={() => setDeletingOffer(null)}
          onConfirm={async () => {
            await deletePropertyOfferApi(deletingOffer.id);
            setDeletingOffer(null);
            await load();
          }}
          isSubmitting={saving}
        />
      ) : null}
    </>
  );
}
