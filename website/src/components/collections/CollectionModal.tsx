import { useEffect, useState } from "react";
import { Check, FolderPlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  addPropertyToCollection,
  createCollection,
  getCollections,
  removePropertyFromCollection,
  type SeekerCollection,
} from "../../api/seeker/collections.api";

export default function CollectionModal({ propertyId, onClose }: { propertyId: string; onClose: () => void }) {
  const { isAuthenticated, isSeeker } = useAuth();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<SeekerCollection[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isSeeker) return;
    void getCollections(propertyId).then((response) => {
      setCollections(response.data ?? []);
      setSelected(new Set((response.data ?? []).filter((item) => item.contains_property).map((item) => item.id)));
    }).catch(() => setError("Unable to load your Collections."));
  }, [isAuthenticated, isSeeker, propertyId]);

  const toggle = (id: string) => setSelected((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const save = async () => {
    setSaving(true); setError(null);
    try {
      const original = new Set(collections.filter((item) => item.contains_property).map((item) => item.id));
      await Promise.all([
        ...collections.filter((item) => selected.has(item.id) && !original.has(item.id)).map((item) => addPropertyToCollection(item.id, propertyId)),
        ...collections.filter((item) => !selected.has(item.id) && original.has(item.id)).map((item) => removePropertyFromCollection(item.id, propertyId)),
      ]);
      onClose();
    } catch (reason: any) {
      setError(reason?.response?.data?.message || "Unable to update this property’s Collections.");
    } finally { setSaving(false); }
  };

  const createAndAdd = async () => {
    const name = newName.trim();
    if (!name) { setError("Enter a Collection name."); return; }
    setCreating(true); setError(null);
    try {
      const response = await createCollection(name);
      await addPropertyToCollection(response.data.id, propertyId);
      onClose();
    } catch (reason: any) {
      setError(reason?.response?.data?.message || "Unable to create the Collection.");
    } finally { setCreating(false); }
  };

  if (!isAuthenticated || !isSeeker) {
    return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={onClose}><div className="w-full max-w-md rounded-3xl bg-white p-6" onClick={(event) => event.stopPropagation()}><p className="text-primary-brown">Please log in as a seeker to use Collections.</p><button className="mt-5 rounded-full bg-primary-brown px-5 py-2 text-white" onClick={() => navigate("/login")}>Log in</button></div></div>;
  }

  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
    <div className="w-full max-w-md rounded-3xl bg-[#F8F4EE] p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between"><h2 className="text-xl font-medium text-primary-brown">Add to Collection</h2><button onClick={onClose} aria-label="Close"><X /></button></div>
      <div className="mt-5 max-h-64 space-y-2 overflow-y-auto">
        {collections.length === 0 && <p className="text-sm text-primary-light-brown">You haven't created any Collections yet.</p>}
        {collections.map((item) => <button key={item.id} type="button" onClick={() => toggle(item.id)} className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-left text-primary-brown"><span>{item.name}</span>{selected.has(item.id) && <Check className="text-primary-brown" size={18} />}</button>)}
      </div>
      <div className="mt-5 flex gap-2"><input maxLength={100} value={newName} onChange={(event) => setNewName(event.target.value)} placeholder="New Collection name" className="min-w-0 flex-1 rounded-xl border border-[#E2CBB3] bg-white px-3 py-2 outline-none" /><button type="button" disabled={creating} onClick={() => void createAndAdd()} className="flex items-center gap-1 rounded-xl border border-primary-brown px-3 py-2 text-sm text-primary-brown"><FolderPlus size={16} />Create</button></div>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <button type="button" disabled={saving} onClick={() => void save()} className="mt-5 w-full rounded-full bg-primary-brown py-3 text-white disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
    </div>
  </div>;
}
