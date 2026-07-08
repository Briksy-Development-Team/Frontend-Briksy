import { useState, useEffect } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import { KTIcon } from "../../../../../_metronic/helpers";
import type { Blog, BlogFormValues, BlogParagraph } from "../blog.types";

const emptyParagraph = (): BlogParagraph => ({ heading: "", content: "", image: "" });

const emptyForm: BlogFormValues = {
  title: "",
  name: "",
  slug: "",
  cover_image: "",
  paragraphs: [emptyParagraph()],
  status: "draft",
};

const toSlug = (val: string) =>
  val.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

type Props = {
  editing: Blog | null;
  onClose: () => void;
  onSubmit: (payload: BlogFormValues) => Promise<void>;
};

export const BlogModal = ({ editing, onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<BlogFormValues>(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editing) {
      setForm({
        title: editing.title,
        name: editing.name,
        slug: editing.slug,
        cover_image: editing.cover_image ?? "",
        paragraphs: editing.paragraphs?.length ? editing.paragraphs : [emptyParagraph()],
        status: editing.status,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editing]);

  const setField = <K extends keyof BlogFormValues>(key: K, val: BlogFormValues[K]) =>
    setForm((f) => ({ ...f, [key]: val }));

  const setParagraph = (i: number, field: keyof BlogParagraph, val: string) =>
    setForm((f) => {
      const next = [...f.paragraphs];
      next[i] = { ...next[i], [field]: val };
      return { ...f, paragraphs: next };
    });

  const addParagraph = () =>
    setForm((f) => ({ ...f, paragraphs: [...f.paragraphs, emptyParagraph()] }));

  const removeParagraph = (i: number) =>
    setForm((f) => ({ ...f, paragraphs: f.paragraphs.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload: BlogFormValues = {
        ...form,
        slug: form.slug || toSlug(form.title),
        paragraphs: form.paragraphs.map((p) => ({
          heading: p.heading || undefined,
          content: p.content,
          image: p.image || undefined,
        })),
      };
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  const isValid =
    form.title.trim().length > 0 &&
    form.name.trim().length > 0 &&
    form.paragraphs.some((p) => p.content.trim().length > 0);

  return (
    <ModalShell
      title={editing ? "Edit Blog" : "New Blog"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={submitting}
      submitLabel={editing ? "Update" : "Publish"}
      isValid={isValid}
    >
      <div className="fv-row mb-4">
        <label className="form-label required">Title</label>
        <input
          className="form-control form-control-solid"
          value={form.title}
          onChange={(e) => {
            setField("title", e.target.value);
            if (!editing) setField("slug", toSlug(e.target.value));
          }}
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label required">Author Name</label>
        <input
          className="form-control form-control-solid"
          value={form.name}
          onChange={(e) => setField("name", e.target.value)}
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">Slug</label>
        <input
          className="form-control form-control-solid"
          value={form.slug}
          onChange={(e) => setField("slug", e.target.value)}
          placeholder="auto-generated from title"
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">Cover Image URL</label>
        <input
          className="form-control form-control-solid"
          value={form.cover_image ?? ""}
          onChange={(e) => setField("cover_image", e.target.value)}
          placeholder="https://..."
        />
        {form.cover_image && (
          <img
            src={form.cover_image}
            alt="cover preview"
            className="mt-3 rounded"
            style={{ maxHeight: 140, objectFit: "cover", width: "100%" }}
          />
        )}
      </div>

      <div className="fv-row mb-5">
        <label className="form-label">Status</label>
        <select
          className="form-select form-select-solid"
          value={form.status}
          onChange={(e) => setField("status", e.target.value as BlogFormValues["status"])}
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      <div className="separator mb-5" />

      <div className="mb-3 fw-bold d-flex align-items-center gap-2">
        <KTIcon iconName="text-align-left" className="fs-4" />
        Content Paragraphs
      </div>

      {form.paragraphs.map((para, i) => (
        <div
          key={i}
          className="border rounded p-4 mb-4"
          style={{ background: "var(--kt-card-bg)" }}
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="fw-semibold text-muted fs-7">Paragraph {i + 1}</span>
            {form.paragraphs.length > 1 && (
              <button
                type="button"
                className="btn btn-icon btn-sm btn-light-danger"
                onClick={() => removeParagraph(i)}
              >
                <KTIcon iconName="minus" className="fs-5" />
              </button>
            )}
          </div>

          <div className="fv-row mb-3">
            <label className="form-label fs-7">Heading (optional)</label>
            <input
              className="form-control form-control-solid form-control-sm"
              value={para.heading ?? ""}
              onChange={(e) => setParagraph(i, "heading", e.target.value)}
              placeholder="Section heading..."
            />
          </div>

          <div className="fv-row mb-3">
            <label className="form-label fs-7 required">Content</label>
            <textarea
              className="form-control form-control-solid"
              rows={4}
              value={para.content}
              onChange={(e) => setParagraph(i, "content", e.target.value)}
              placeholder="Write your paragraph content..."
            />
          </div>

          <div className="fv-row mb-0">
            <label className="form-label fs-7">Image URL (optional)</label>
            <input
              className="form-control form-control-solid form-control-sm"
              value={para.image ?? ""}
              onChange={(e) => setParagraph(i, "image", e.target.value)}
              placeholder="https://..."
            />
            {para.image && (
              <img
                src={para.image}
                alt={`para-${i}`}
                className="mt-2 rounded"
                style={{ maxHeight: 100, objectFit: "cover", width: "100%" }}
              />
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        className="btn btn-light-primary btn-sm w-100"
        onClick={addParagraph}
      >
        <KTIcon iconName="plus" className="fs-5 me-1" />
        Add Paragraph
      </button>
    </ModalShell>
  );
};
