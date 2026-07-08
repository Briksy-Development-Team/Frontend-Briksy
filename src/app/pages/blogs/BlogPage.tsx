import { useEffect, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { KTCard, KTIcon } from "../../../_metronic/helpers";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";
import { useRoleAccess } from "../../modules/auth";
import { getAuth } from "../../modules/auth/core/AuthHelpers";
import type { Blog, BlogFormValues } from "../../services/features/blogs/blog.types";
import {
  createBlogApi,
  deleteBlogApi,
  fetchBlogsApi,
  updateBlogApi,
} from "../../services/features/blogs/blog.api";
import { BlogModal } from "../../services/features/blogs/components/BlogModal";
import { BlogPreviewModal } from "../../services/features/blogs/components/BlogPreviewModal";

const BlogPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const scope = isSuperAdmin ? "super-admin" : "admin";
  const auth = getAuth();
  const abilities = auth?.abilities ?? [];
  const canCreate = abilities.includes("blog.create");
  const canUpdate = abilities.includes("blog.update");
  const canDelete = abilities.includes("blog.delete");

  const [items, setItems] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState<Blog | null>(null);
  const [previewBlog, setPreviewBlog] = useState<Blog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchBlogsApi(scope)
      .then((data) => { if (active) setItems(data); })
      .catch((err: unknown) => {
        if (active) setError(err instanceof Error ? err.message : "Failed to load blogs");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [scope]);

  const submit = async (payload: BlogFormValues) => {
    const saved = editing
      ? await updateBlogApi(scope, editing.id, payload)
      : await createBlogApi(scope, payload);
    setItems((cur) => {
      const idx = cur.findIndex((b) => b.id === saved.id);
      if (idx === -1) return [saved, ...cur];
      const next = [...cur];
      next[idx] = saved;
      return next;
    });
    closeModal();
  };

  const remove = async () => {
    if (!deleting) return;
    await deleteBlogApi(scope, deleting.id);
    setItems((cur) => cur.filter((b) => b.id !== deleting.id));
    setDeleting(null);
  };

  const closeModal = () => {
    setEditing(null);
    setIsModalOpen(false);
  };

  const openCreate = () => {
    setEditing(null);
    setIsModalOpen(true);
  };

  const openEdit = (blog: Blog) => {
    setEditing(blog);
    setIsModalOpen(true);
  };

  const statusBadge = (status: Blog["status"]) => {
    const map = { published: "success", draft: "warning", archived: "secondary" } as const;
    return map[status] ?? "secondary";
  };

  return (
    <Content>
      <PageHeader title="Blogs" subtitle="Create and manage blog posts with rich content and images." />

      <KTCard>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-6">
            <div>
              <h3 className="fw-bold mb-1">Blogs</h3>
              <div className="text-muted">{items.length} posts</div>
            </div>
            <button className="btn btn-primary" onClick={openCreate} disabled={!canCreate}>
              <KTIcon iconName="plus" className="fs-2 me-2" />
              New Blog
            </button>
          </div>

          {loading && <div className="alert alert-light">Loading blogs...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && items.length === 0 && (
            <div className="alert alert-info">No blogs yet. Create your first post.</div>
          )}

          <div className="row g-5">
            {items.map((blog) => (
              <div className="col-xl-4 col-md-6" key={blog.id}>
                <div className="card h-100 border">
                  {blog.cover_image && (
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="card-img-top"
                      style={{ height: 180, objectFit: "cover", cursor: "pointer" }}
                      onClick={() => setPreviewBlog(blog)}
                    />
                  )}
                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <span className={`badge badge-light-${statusBadge(blog.status)}`}>
                        {blog.status}
                      </span>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-icon btn-sm btn-light"
                          title="Preview"
                          onClick={() => setPreviewBlog(blog)}
                        >
                          <KTIcon iconName="eye" className="fs-4" />
                        </button>
                        <button
                          className="btn btn-icon btn-sm btn-light-primary"
                          title="Edit"
                          onClick={() => openEdit(blog)}
                          disabled={!canUpdate}
                        >
                          <KTIcon iconName="pencil" className="fs-4" />
                        </button>
                        <button
                          className="btn btn-icon btn-sm btn-light-danger"
                          title="Delete"
                          onClick={() => setDeleting(blog)}
                          disabled={!canDelete}
                        >
                          <KTIcon iconName="trash" className="fs-4" />
                        </button>
                      </div>
                    </div>

                    <h5 className="fw-bold mb-1 cursor-pointer" onClick={() => setPreviewBlog(blog)}>{blog.title}</h5>
                    <div className="text-muted fs-7 mb-2">By {blog.name}</div>
                    <div className="text-muted fs-7 mb-3 font-monospace">{blog.slug}</div>

                    <div className="flex-grow-1">
                      {blog.paragraphs?.slice(0, 2).map((p, i) => (
                        <div key={i} className="mb-2">
                          {p.heading && <div className="fw-semibold fs-7">{p.heading}</div>}
                          <div
                            className="text-muted fs-7"
                            style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {p.content}
                          </div>
                        </div>
                      ))}
                      {(blog.paragraphs?.length ?? 0) > 2 && (
                        <div className="text-muted fs-8">
                          +{blog.paragraphs.length - 2} more paragraph(s)
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </KTCard>

      {isModalOpen && (
        <BlogModal
          editing={editing}
          onClose={closeModal}
          onSubmit={submit}
        />
      )}

      {previewBlog && (
        <BlogPreviewModal
          blog={previewBlog}
          onClose={() => setPreviewBlog(null)}
        />
      )}

      {deleting && (
        <DeleteConfirmModal
          title="Delete Blog"
          message={`Delete "${deleting.title}"? This cannot be undone.`}
          onClose={() => setDeleting(null)}
          onConfirm={remove}
        />
      )}
    </Content>
  );
};

export default BlogPage;