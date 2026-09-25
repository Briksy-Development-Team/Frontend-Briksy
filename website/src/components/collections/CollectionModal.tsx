import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
  addItemToCollection,
  getCollectionsForTarget,
  removeItemFromCollection,
  type CollectionTargetType,
  type SeekerCollection,
} from "../../api/seeker/collections.api";

export default function CollectionModal({ propertyId, targetType = "property", onClose }: { propertyId: string; targetType?: CollectionTargetType; onClose: () => void }) {
  const { isAuthenticated, isSeeker } = useAuth();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<SeekerCollection[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isSeeker) return;
    void getCollectionsForTarget(targetType, propertyId).then((response) => {
      setCollections(response.data ?? []);
      setSelected(new Set((response.data ?? []).filter((item) => item.contains_item || (targetType === "property" && item.contains_property)).map((item) => item.id)));
    }).catch(() => setError("Unable to load your Collections."));
  }, [isAuthenticated, isSeeker, propertyId, targetType]);

  const toggle = (id: string) => setSelected((current) => {
    const next = new Set(current);
    if (next.has(id)) next.delete(id); else next.add(id);
    return next;
  });

  const save = async () => {
    setSaving(true); setError(null);
    try {
    const original = new Set(collections.filter((item) => item.contains_item || (targetType === "property" && item.contains_property)).map((item) => item.id));
    await Promise.all([
        ...collections.filter((item) => selected.has(item.id) && !original.has(item.id)).map((item) => addItemToCollection(item.id, targetType, propertyId)),
        ...collections.filter((item) => !selected.has(item.id) && original.has(item.id)).map((item) => removeItemFromCollection(item.id, targetType, propertyId)),
      ]);
      onClose();
    } catch (reason: any) {
      setError(reason?.response?.data?.message || "Unable to update this property’s Collections.");
    } finally { setSaving(false); }
  };

  if (!isAuthenticated || !isSeeker) {
    return createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={onClose}><div className="w-full max-w-md rounded-3xl bg-white p-6" onClick={(event) => event.stopPropagation()}><p className="text-primary-brown">Please log in as a seeker to use Collections.</p><button className="mt-5 rounded-full bg-primary-brown px-5 py-2 text-white" onClick={() => navigate("/login")}>Log in</button></div></div>, document.body);
  }

  return createPortal(<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
    <div className="w-full max-w-md rounded-3xl bg-[#F8F4EE] p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
      <div className="flex items-center justify-between"><h2 className="text-xl font-medium text-primary-brown">Add to Collection</h2><button onClick={onClose} aria-label="Close"><X /></button></div>
      <div className="mt-5 max-h-64 space-y-2 overflow-y-auto">
        {collections.length === 0 && <p className="text-sm text-primary-light-brown">You haven't created any Collections yet.</p>}
        {collections.map((item) => <button key={item.id} type="button" onClick={() => toggle(item.id)} className="flex w-full items-center justify-between rounded-xl bg-white px-4 py-3 text-left text-primary-brown"><span>{item.name}</span>{selected.has(item.id) && <Check className="text-primary-brown" size={18} />}</button>)}
      </div>
      <p className="mt-5 text-sm text-primary-light-brown">Create new Collections from Profile → Collections.</p>
      {error && <p className="mt-3 text-sm text-red-700">{error}</p>}
      <button type="button" disabled={saving} onClick={() => void save()} className="mt-5 w-full rounded-full bg-primary-brown py-3 text-white disabled:opacity-50">{saving ? "Saving…" : "Save"}</button>
    </div>
  </div>, document.body);
}
