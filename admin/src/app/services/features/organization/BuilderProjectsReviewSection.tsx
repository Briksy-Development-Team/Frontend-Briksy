import { useCallback, useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { formatDateTime } from "../../utils/dateFormat";

type Project = {
  id: string;
  name: string;
  project_type?: string | null;
  status: string;
  location?: string | null;
  state?: string | null;
  postcode?: string | null;
  created_at?: string | null;
};

const isPending = (status: string) => status.trim().toLowerCase().replace(/_/g, " ") === "pending review";

export default function BuilderProjectsReviewSection({ data }: { data: any }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    if (!data?.id) return;
    setLoading(true);
    try {
      const response = await axiosInstance.get<{ data: { data: Project[] } }>("/super-admin/builder-projects", {
        params: { "filter[organization_id]": data.id, per_page: 100 },
      });
      const payload: any = response.data.data;
      setProjects(Array.isArray(payload) ? payload : payload?.data ?? payload?.items ?? []);
      setMessage(null);
    } catch {
      setMessage("Builder projects could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [data?.id]);

  useEffect(() => { void loadProjects(); }, [loadProjects]);

  const review = async (project: Project, action: "approve" | "reject") => {
    const rejection_reason = action === "reject" ? window.prompt("Reason for rejecting this project:")?.trim() : undefined;
    if (action === "reject" && !rejection_reason) return;

    try {
      await axiosInstance.patch(`/super-admin/builder-projects/${project.id}/${action}`, rejection_reason ? { rejection_reason } : undefined);
      await loadProjects();
    } catch (reason: any) {
      setMessage(reason?.response?.data?.message ?? "Unable to update this project.");
    }
  };

  if (loading) return <div className="text-muted">Loading builder projects…</div>;
  if (message) return <div className="alert alert-warning mb-0">{message}</div>;
  if (!projects.length) return <div className="text-muted">No builder projects have been submitted by this organisation.</div>;

  return (
    <div className="table-responsive">
      <table className="table align-middle mb-0">
        <thead><tr><th>Project</th><th>Location</th><th>Status</th><th>Created</th><th className="text-end">Actions</th></tr></thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project.id}>
              <td><a href={`/super-admin/builder-projects/${project.id}`} className="fw-semibold text-gray-900">{project.name}</a>{project.project_type && <div className="text-muted fs-7">{project.project_type}</div>}</td>
              <td>{[project.location, project.state, project.postcode].filter(Boolean).join(", ") || "—"}</td>
              <td><span className={`badge ${project.status === "Published" ? "badge-light-success" : project.status === "Rejected" ? "badge-light-danger" : "badge-light-info"}`}>{project.status}</span></td>
              <td>{project.created_at ? formatDateTime(project.created_at) : "—"}</td>
              <td className="text-end text-nowrap">
                {isPending(project.status) && <><button type="button" className="btn btn-sm btn-light-success me-2" onClick={() => void review(project, "approve")}>Approve</button><button type="button" className="btn btn-sm btn-light-danger" onClick={() => void review(project, "reject")}>Reject</button></>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
