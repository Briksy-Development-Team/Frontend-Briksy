import { useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { EntityList, type Column, type RowAction } from "../../modules/apps/shared_table/entity-list/EntityList";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import axiosInstance from "../../services/api/axiosInstance";

type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  is_active: boolean;
  sort_order: number;
};

type Envelope = { data: ServiceCategory[] };

const emptyForm = { name: "", slug: "", description: "", is_active: true, sort_order: 0 };

const ServiceCategoryPage = () => {
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<ServiceCategory | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const { params, handleParamsChange } = useEntityTable(() => undefined);

  const load = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<Envelope>("/super-admin/service-categories");
      setCategories(response.data.data ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load service categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (category: ServiceCategory) => {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      is_active: category.is_active,
      sort_order: category.sort_order,
    });
    setIsModalOpen(true);
  };

  const save = async () => {
    setSaving(true);
    try {
      const payload = { ...form, sort_order: Number(form.sort_order) || 0 };
      if (editing) {
        await axiosInstance.put(`/super-admin/service-categories/${editing.id}`, payload);
      } else {
        await axiosInstance.post("/super-admin/service-categories", payload);
      }
      setEditing(null);
      setIsModalOpen(false);
      await load();
    } finally {
      setSaving(false);
    }
  };

  const remove = async (category: ServiceCategory) => {
    if (!window.confirm(`Delete ${category.name}?`)) return;
    await axiosInstance.delete(`/super-admin/service-categories/${category.id}`);
    await load();
  };

  const filtered = useMemo(() => {
    let list = categories;
    if (params.search) {
      const q = params.search.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q));
    }
    if (params.filters?.is_active !== undefined && params.filters.is_active !== "") {
      const active = params.filters.is_active === "1";
      list = list.filter((c) => c.is_active === active);
    }
    return list;
  }, [categories, params.search, params.filters]);

  const paged = useMemo(() => {
    const start = (params.page - 1) * params.per_page;
    return filtered.slice(start, start + params.per_page);
  }, [filtered, params.page, params.per_page]);

  const columns = useMemo<Column<ServiceCategory>[]>(() => [
    {
      Header: "Category",
      accessor: "name",
      Cell: ({ row }: { row: ServiceCategory | { original: ServiceCategory } }) => {
        const item = "original" in row ? row.original : row;
        return (
          <div>
            <div className="fw-bold">{item.name}</div>
            {item.description && <div className="text-muted fs-7">{item.description}</div>}
          </div>
        );
      },
    },
    { Header: "Slug", accessor: "slug" },
    {
      Header: "Status",
      accessor: "is_active",
      Cell: ({ value }: { value: unknown }) => (value ? "Active" : "Hidden"),
    },
    { Header: "Order", accessor: "sort_order" },
  ], []);

  const rowActions: RowAction<ServiceCategory>[] = [
    { label: "Edit", onClick: (c) => openEdit(c) },
    { label: "Delete", className: "text-danger", onClick: (c) => void remove(c) },
  ];

  return (
    <Content>
      {error && <div className="alert alert-danger mb-4">{error}</div>}
      {loading && <div className="text-muted mb-2">Loading categories...</div>}

      <EntityList
        title="Service Categories"
        subtitle="Manage the categories shown across service forms and the public website."
        entityName="categories"
        profileType="none"
        data={paged}
        total={filtered.length}
        params={params}
        onParamsChange={handleParamsChange}
        columns={columns}
        filtersConfig={[
          {
            key: "is_active",
            label: "Status",
            type: "select",
            options: [
              { label: "Active", value: "1" },
              { label: "Hidden", value: "0" },
            ],
          },
        ]}
        headerActions={[{ label: "Add Category", onClick: openCreate }]}
        rowActions={rowActions}
      />

      {isModalOpen && (
        <ModalShell
          title={editing ? "Edit service category" : "Add service category"}
          onClose={() => { setEditing(null); setIsModalOpen(false); }}
          onSubmit={save}
          isSubmitting={saving}
          isValid={form.name.trim().length > 0}
        >
          <div className="mb-5"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
          <div className="mb-5"><label className="form-label">Slug <span className="text-muted">(optional)</span></label><input className="form-control" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></div>
          <div className="mb-5"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
          <div className="row">
            <div className="col-md-6 mb-5"><label className="form-label">Sort order</label><input type="number" className="form-control" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} /></div>
            <div className="col-md-6 mb-5 d-flex align-items-end"><label className="form-check form-switch form-check-custom form-check-solid"><input className="form-check-input" type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /><span className="form-check-label">Visible on website</span></label></div>
          </div>
        </ModalShell>
      )}
    </Content>
  );
};

export default ServiceCategoryPage;
