import { useEffect, useState } from "react";
import { FolderPlus, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { createCollection, deleteCollection, getCollections, renameCollection, type SeekerCollection } from "../../../api/seeker/collections.api";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<SeekerCollection[]>([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<SeekerCollection | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => { setLoading(true); void getCollections().then((response) => setCollections(response.data ?? [])).catch(() => setError("Unable to load Collections.")).finally(() => setLoading(false)); };
  useEffect(load, []);

  const submit = async () => {
    const value = name.trim();
    if (!value) { setError("Collection name is required."); return; }
    try {
      if (editing) await renameCollection(editing.id, value); else await createCollection(value);
      setName(""); setEditing(null); setComposerOpen(false); setError(null); load();
    } catch (reason: any) { setError(reason?.response?.data?.message || "Unable to save the Collection."); }
  };

  const remove = async (collection: SeekerCollection) => {
    if (!window.confirm(`Delete ${collection.name}?`)) return;
    try { await deleteCollection(collection.id); setCollections((items) => items.filter((item) => item.id !== collection.id)); } catch { setError("Unable to delete the Collection."); }
  };

  return <div className="w-full space-y-8">
    <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-[1.875rem] font-medium text-primary-brown">Collections</h1><p className="mt-1 text-sm text-primary-light-brown">Organize your liked properties into custom groups.</p></div><button type="button" onClick={() => { setEditing(null); setName(""); setComposerOpen(true); }} className="flex items-center gap-2 rounded-full bg-primary-brown px-5 py-3 text-sm text-white"><FolderPlus size={17} /> Create Collection</button></div>
    <div className="rounded-2xl bg-white p-5 md:p-7">
      {error && <p className="mb-4 text-sm text-red-700">{error}</p>}
      {(composerOpen || editing) && <div className="mb-6 flex flex-wrap gap-2"><input autoFocus maxLength={100} value={name} onChange={(event) => setName(event.target.value)} placeholder="Collection name" className="min-w-0 flex-1 rounded-xl border border-[#E2CBB3] px-4 py-3 outline-none" /><button type="button" onClick={() => void submit()} className="rounded-xl bg-primary-brown px-5 py-3 text-sm text-white">{editing ? "Rename" : "Create"}</button><button type="button" onClick={() => { setEditing(null); setName(""); setComposerOpen(false); }} className="rounded-xl border px-4 py-3 text-sm">Cancel</button></div>}
      {loading ? <p className="text-primary-light-brown">Loading Collections...</p> : collections.length === 0 ? <div className="py-12 text-center text-primary-light-brown"><p>You haven't created any collections yet.</p></div> : <div className="grid gap-4 md:grid-cols-2">{collections.map((collection) => <div key={collection.id} className="rounded-2xl border border-[#EDE8E4] p-5"><div className="flex items-start justify-between gap-3"><Link to={`/profile/collections/${collection.id}`} className="min-w-0"><h2 className="truncate text-lg font-medium text-primary-brown">{collection.name}</h2><p className="mt-1 text-sm text-primary-light-brown">{collection.properties_count} {collection.properties_count === 1 ? "property" : "properties"}</p></Link><div className="flex gap-2"><button type="button" aria-label="Rename Collection" onClick={() => { setEditing(collection); setName(collection.name); setComposerOpen(true); }}><Pencil size={17} /></button><button type="button" aria-label="Delete Collection" onClick={() => void remove(collection)}><Trash2 size={17} /></button></div></div><Link to={`/profile/collections/${collection.id}`} className="mt-5 block text-sm font-medium text-primary-brown">Open Collection →</Link></div>)}</div>}
    </div>
  </div>;
}
