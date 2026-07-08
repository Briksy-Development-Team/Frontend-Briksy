import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { Blog } from "../blog.types";

type Props = {
  blog: Blog;
  onClose: () => void;
};

export const BlogPreviewModal = ({ blog, onClose }: Props) => {
  return (
    <ModalShell
      title={blog.title}
      onClose={onClose}
      onSubmit={onClose}
      isSubmitting={false}
      submitLabel="Close"
      isValid={true}
    >
      {blog.cover_image && (
        <img
          src={blog.cover_image}
          alt="cover"
          className="rounded mb-5 w-100"
          style={{ maxHeight: 220, objectFit: "cover" }}
        />
      )}
      <div className="text-muted mb-4">By {blog.name}</div>

      {blog.paragraphs?.map((p, i) => (
        <div key={i} className="mb-5">
          {p.heading && <h5 className="fw-bold mb-2">{p.heading}</h5>}
          <p className="text-gray-700" style={{ whiteSpace: "pre-wrap" }}>{p.content}</p>
          {p.image && (
            <img
              src={p.image}
              alt={`paragraph-${i}`}
              className="rounded mt-2 w-100"
              style={{ maxHeight: 180, objectFit: "cover" }}
            />
          )}
        </div>
      ))}
    </ModalShell>
  );
};
