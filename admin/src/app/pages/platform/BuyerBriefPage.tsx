import { useEffect, useState } from "react";
import axiosInstance from "../../services/api/axiosInstance";

type Brief = { id: string; client_name: string; status: string; budget_min?: number; budget_max?: number };
export default function BuyerBriefPage() {
  const [items, setItems] = useState<Brief[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { void axiosInstance.get<{ data: { data: Brief[] } }>("/admin/buyer-briefs").then((r) => setItems(r.data.data.data)).catch(() => setError("Buyer briefs could not be loaded.")); }, []);
  return <div className="card"><div className="card-header"><h3 className="card-title">Buyer Briefs</h3></div><div className="card-body">{error && <div className="alert alert-danger">{error}</div>}<table className="table"><thead><tr><th>Client</th><th>Status</th><th>Budget</th></tr></thead><tbody>{items.map((item) => <tr key={item.id}><td>{item.client_name}</td><td>{item.status}</td><td>${item.budget_min?.toLocaleString()} – ${item.budget_max?.toLocaleString()}</td></tr>)}</tbody></table></div></div>;
}
