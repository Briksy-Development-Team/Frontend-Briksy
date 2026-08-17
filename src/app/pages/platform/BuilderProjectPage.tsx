import { useEffect, useState } from "react";
import axiosInstance from "../../services/api/axiosInstance";

type Project = { id: string; name: string; project_type?: string; status: string; location?: string };
export default function BuilderProjectPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void axiosInstance.get<{ data: { data: Project[] } }>("/admin/builder-projects").then((r) => setItems(r.data.data.data)).catch(() => setError("Builder projects could not be loaded.")); }, []);
  return <div className="card"><div className="card-header"><h3 className="card-title">Builder Projects</h3></div><div className="card-body">{error && <div className="alert alert-danger">{error}</div>}<table className="table"><thead><tr><th>Project</th><th>Type</th><th>Status</th><th>Location</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.name}</td><td>{item.project_type}</td><td>{item.status}</td><td>{item.location}</td></tr>)}</tbody></table></div></div>;
}
