import { useEffect, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { KTCard } from "../../../_metronic/helpers";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
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

  return (
    <Content>
      <PageHeader title="Service Categories" subtitle="Manage the categories shown across service forms and the public website." />
      <KTCard>
        <div className="card-header border-0 pt-6">
          <h3 className="card-title">Trades & professional categories</h3>
          <div className="card-toolbar">
            <button type="button" className="btn btn-primary" onClick={openCreate}>Add category</button>
          </div>
        </div>
        <div className="card-body py-4">
          {error && <div className="alert alert-danger">{error}</div>}
          {loading ? <div className="text-muted">Loading categories...</div> : (
            <div className="table-responsive">
              <table className="table align-middle table-row-dashed fs-6 gy-5">
                <thead><tr><th>Name</th><th>Slug</th><th>Status</th><th>Order</th><th className="text-end">Actions</th></tr></thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td><div className="fw-bold">{category.name}</div><div className="text-muted">{category.description}</div></td>
                      <td>{category.slug}</td>
                      <td><span className={`badge ${category.is_active ? "badge-light-success" : "badge-light-secondary"}`}>{category.is_active ? "Active" : "Hidden"}</span></td>
                      <td>{category.sort_order}</td>
                      <td className="text-end">
                        <button type="button" className="btn btn-sm btn-light-primary me-2" onClick={() => openEdit(category)}>Edit</button>
                        <button type="button" className="btn btn-sm btn-light-danger" onClick={() => void remove(category)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </KTCard>

      {isModalOpen && (
        <ModalShell title={editing ? "Edit service category" : "Add service category"} onClose={() => { setEditing(null); setIsModalOpen(false); }} onSubmit={save} isSubmitting={saving} isValid={form.name.trim().length > 0}>
          <div className="mb-5"><label className="form-label">Name</label><input className="form-control" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></div>
          <div className="mb-5"><label className="form-label">Slug <span className="text-muted">(optional)</span></label><input className="form-control" value={form.slug} onChange={(event) => setForm({ ...form, slug: event.target.value })} /></div>
          <div className="mb-5"><label className="form-label">Description</label><textarea className="form-control" rows={3} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
          <div className="row"><div className="col-md-6 mb-5"><label className="form-label">Sort order</label><input type="number" className="form-control" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} /></div><div className="col-md-6 mb-5 d-flex align-items-end"><label className="form-check form-switch form-check-custom form-check-solid"><input className="form-check-input" type="checkbox" checked={form.is_active} onChange={(event) => setForm({ ...form, is_active: event.target.checked })} /><span className="form-check-label">Visible on website</span></label></div></div>
        </ModalShell>
      )}
    </Content>
  );
};

export default ServiceCategoryPage;
