import { useEffect, useMemo, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { serviceOffersConfig } from "../../services/features/service/service_offers.config";
import { fetchServiceGroupApi } from "../../services/features/service/service_list.api";
import {
  deleteServiceOfferApi,
  fetchServiceOffersApi,
  saveServiceOfferApi,
  toggleServiceOfferApi,
  type ServiceOffer,
} from "../../services/features/service/service_offers.api";
import { getRolePortalBaseRoute, useRoleAccess } from "../../modules/auth";

type OfferForm = Partial<ServiceOffer> & { highlights_text?: string };

const emptyOffer: OfferForm = {
  title: "",
  service_id: "",
  tag_label: "",
  summary: "",
  description: "",
  highlights_text: "",
  terms: "",
  is_active: true,
  sort_order: 0,
};

function ServiceOffersList({
  items,
  loading,
  error,
  rowActions,
  onNewOffer,
}: {
  items: ServiceOffer[];
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
          item.service?.name?.toLowerCase().includes(q) ||
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
        title="Service Offers"
        subtitle="Create promotional offers for services"
      />
      {loading ? <div className="text-muted mb-4">Loading offers...</div> : null}
      {error ? <div className="alert alert-danger mb-5">{error}</div> : null}

      <EntityList
        data={filteredItems}
        total={filteredItems.length}
        params={params}
        onParamsChange={handleParamsChange}
        columns={serviceOffersConfig.columns}
        filtersConfig={serviceOffersConfig.filters}
        getRowLink={(row) => `${portalBase}/service-offers/${row.id}`}
        enableRowClick
        storageKey="serviceOfferColumns"
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

export default function ServiceOffersPage() {
  const [items, setItems] = useState<ServiceOffer[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [editing, setEditing] = useState<OfferForm | null>(null);
  const [deletingOffer, setDeletingOffer] = useState<ServiceOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedOffer, setSavedOffer] = useState<ServiceOffer | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [offers, serviceResponse] = await Promise.all([
        fetchServiceOffersApi(),
        fetchServiceGroupApi({ per_page: 100, sort: "name", direction: "asc" }),
      ]);
      setItems(offers);
      setServices(serviceResponse.data);
      setError(null);
    } catch (e: any) {
      setError(e?.response?.data?.message ?? e?.message ?? "Failed to load service offers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const submit = async () => {
    if (!editing?.title || !editing.service_id) return;
    setSaving(true);
    try {
      const res = await saveServiceOfferApi(
        {
          ...editing,
          service_id: editing.service_id,
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
    } catch (e: any) {
      const msg = e?.response?.data?.message ?? e?.message ?? "Unable to save service offer.";
      setError(msg);
      window.alert(msg);
    } finally {
      setSaving(false);
    }
  };

  const serviceOptions = useMemo(
    () =>
      services.map((service) => ({
        id: service.id,
        label: `${service.name}${service.category ? ` — ${service.category}` : ""}`,
      })),
    [services]
  );

  const rowActions = [
    {
      label: "Edit",
      onClick: (row: ServiceOffer) =>
        setEditing({
          ...row,
          highlights_text: row.highlights?.join("\n") ?? "",
        }),
    },
    {
      label: "Toggle Active",
      onClick: async (row: ServiceOffer) => {
        const updated = await toggleServiceOfferApi(row.id, !row.is_active);
        setSavedOffer(updated);
        await load();
        return updated;
      },
    },
    {
      label: "Delete",
      className: "text-danger",
      onClick: (row: ServiceOffer) => setDeletingOffer(row),
    },
  ];

  return (
    <>
      <Routes>
        <Route
          index
          element={
            <ServiceOffersList
              items={items}
              loading={loading}
              error={error}
              rowActions={rowActions}
              onNewOffer={() => setEditing({ ...emptyOffer })}
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
          isSubmitting={saving}
          isValid={!!editing.title && !!editing.service_id}
        >
          <div className="row g-5">
            <div className="col-md-6">
              <label className="form-label">Title</label>
              <input
                className="form-control form-control-solid"
                value={editing.title ?? ""}
                onChange={(e) =>
                  setEditing((current) => ({ ...current, title: e.target.value }))
                }
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Service</label>
              <select
                className="form-select form-select-solid"
                value={editing.service_id ?? ""}
                onChange={(e) =>
                  setEditing((current) => ({ ...current, service_id: e.target.value }))
                }
              >
                <option value="">Select service</option>
                {serviceOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Tag Label</label>
              <input
                className="form-control form-control-solid"
                placeholder="Optional"
                value={editing.tag_label ?? ""}
                onChange={(e) =>
                  setEditing((current) => ({ ...current, tag_label: e.target.value }))
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Sort Order</label>
              <input
                type="number"
                className="form-control form-control-solid"
                value={editing.sort_order ?? 0}
                onChange={(e) =>
                  setEditing((current) => ({
                    ...current,
                    sort_order: Number(e.target.value),
                  }))
                }
              />
            </div>
            <div className="col-md-3">
              <label className="form-label">Active</label>
              <select
                className="form-select form-select-solid"
                value={editing.is_active ? "1" : "0"}
                onChange={(e) =>
                  setEditing((current) => ({
                    ...current,
                    is_active: e.target.value === "1",
                  }))
                }
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
                onChange={(e) =>
                  setEditing((current) => ({ ...current, summary: e.target.value }))
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea
                rows={4}
                className="form-control form-control-solid"
                value={editing.description ?? ""}
                onChange={(e) =>
                  setEditing((current) => ({ ...current, description: e.target.value }))
                }
              />
            </div>
            <div className="col-12">
              <label className="form-label">What&apos;s Included</label>
              <textarea
                rows={4}
                className="form-control form-control-solid"
                value={editing.highlights_text ?? ""}
                onChange={(e) =>
                  setEditing((current) => ({
                    ...current,
                    highlights_text: e.target.value,
                  }))
                }
                placeholder="Enter one item per line"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Terms</label>
              <textarea
                rows={3}
                className="form-control form-control-solid"
                value={editing.terms ?? ""}
                onChange={(e) =>
                  setEditing((current) => ({ ...current, terms: e.target.value }))
                }
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
            await deleteServiceOfferApi(deletingOffer.id);
            setDeletingOffer(null);
            await load();
          }}
          isSubmitting={saving}
        />
      ) : null}
    </>
  );
}
