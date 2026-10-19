import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Bookmark, Check, Pencil, Plus, Trash2 } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  createCollection,
  deleteCollection,
  getCollections,
  renameCollection,
  type SeekerCollection,
} from "../../../api/seeker/collections.api";

type Form = { id?: string; name: string };

export default function CollectionsPage({ showBack = true }: { showBack?: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [collections, setCollections] = useState<SeekerCollection[]>([]);
  const [form, setForm] = useState<Form | null>(null); // null = closed, no id = create, id = rename
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [createdMessage, setCreatedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    getCollections()
      .then((res) => setCollections(res.data ?? []))
      .catch(() => setError("Unable to load Collections."))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => setForm({ name: "" });

  const submit = () => {
    const value = form?.name.trim();
    if (!form || !value) return setError("Collection name is required.");

    const request = form.id ? renameCollection(form.id, value) : createCollection(value);
    request
      .then(() => {
        if (!form.id) {
          setCreatedMessage(`New Collection "${value}" created`);
          window.setTimeout(() => setCreatedMessage(null), 3500);
        }
        setForm(null);
        setError(null);
        load();
      })
      .catch((e) => setError(e?.response?.data?.message || "Unable to save the Collection."));
  };

  const remove = (collection: SeekerCollection) =>
    deleteCollection(collection.id)
      .then(() => {
        setCollections((items) => items.filter((item) => item.id !== collection.id));
        setDeletingId(null);
      })
      .catch(() => setError("Unable to delete the Collection."));

  const isSavedRoute = location.pathname === "/saved";

  return (
    <div className={`w-full space-y-8 ${isSavedRoute ? "min-h-screen px-3 py-4 md:px-5 md:py-6 max-w-7xl mx-auto" : ""}`}>
      {createdMessage && (
        <div role="status" className="fixed right-5 top-5 z-[120] rounded-2xl bg-primary-brown px-5 py-4 text-sm font-medium text-white shadow-2xl animate-fade-in">
          {createdMessage}
        </div>
      )}

      {showBack && (
        <button
          type="button"
          aria-label="Back"
          onClick={() => navigate(-1)}
          className="-mb-4 flex h-9 w-9 items-center justify-center rounded-full text-primary-brown transition-colors hover:bg-[#F0EBE5]"
        >
          <ArrowLeft size={18} />
        </button>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-[1.875rem] font-medium text-primary-brown tracking-tight">Collections</h1>
          <p className="mt-1 text-xs md:text-sm text-primary-light-brown">
            Organize your liked properties and saved listings into custom groups.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="flex items-center gap-2 rounded-full bg-primary-brown px-3 py-3 text-xs md:text-sm font-medium text-white shadow-sm hover:bg-primary-brown/90 transition-all active:scale-[0.98]"
        >
          <Plus size={18} /> Create Collection
        </button>
      </div>

      {form && (
        <div className="rounded-3xl bg-white border border-[#EDE8E4] p-6 shadow-sm animate-fade-in">
          <h3 className="mb-4 text-base font-medium text-primary-brown">
            {form.id ? "Rename Collection" : "Create New Collection"}
          </h3>
          <div className="flex flex-wrap md:flex-nowrap gap-3">
            <input
              autoFocus
              maxLength={100}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. Dream Homes, Renovations, Investment Real Estate"
              className="min-w-0 flex-1 rounded-2xl border border-[#E2CBB3] bg-[#F8F4EE]/50 px-4 py-3 text-sm outline-none text-primary-brown placeholder:text-primary-light-brown focus:border-primary-brown focus:bg-white transition-all"
            />
            <button type="button" onClick={submit} className="rounded-2xl bg-primary-brown px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-brown/90 transition-colors shrink-0">
              {form.id ? "Save Changes" : "Create"}
            </button>
            <button type="button" onClick={() => setForm(null)} className="rounded-2xl border border-[#EDE8E4] bg-white px-5 py-3 text-sm font-medium text-primary-brown hover:bg-[#F8F4EE] transition-colors shrink-0">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div>
        {error && (
          <p className="mb-4 text-sm font-medium text-red-700 bg-red-50 p-3.5 rounded-xl border border-red-100">{error}</p>
        )}

        {loading ? (
          <div className="py-16 text-center text-primary-light-brown">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary-brown border-t-transparent mb-3" />
            <p className="text-sm">Loading Collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="py-16 text-center text-primary-light-brown max-w-sm mx-auto">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F8F4EE] text-primary-brown mb-4">
              <Bookmark size={26} />
            </div>
            <h3 className="text-base font-medium text-primary-brown mb-1">No collections yet</h3>
            <p className="text-xs text-primary-light-brown mb-5">
              Save properties and items into custom collections to organize your search.
            </p>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center gap-2 rounded-full bg-primary-brown px-5 py-2.5 text-xs font-medium text-white hover:bg-primary-brown/90 transition-colors"
            >
              <Plus size={15} /> Create your first collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                confirming={deletingId === collection.id}
                onEdit={() => setForm({ id: collection.id, name: collection.name })}
                onDeleteStart={() => setDeletingId(collection.id)}
                onDeleteConfirm={() => remove(collection)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// 1 image = full, 2 = side by side, 3 = left tall + right split, 4 = 2x2
function CollectionMosaic({ imgs }: { imgs: string[] }) {
  const sources = Array.from(new Set(imgs.filter(Boolean))).slice(0, 4);
  const sourceKey = sources.join("\u0000");
  const [failureState, setFailureState] = useState<{ key: string; sources: string[] }>({ key: "", sources: [] });
  const failedSources = failureState.key === sourceKey ? failureState.sources : [];

  const tiles = sources.filter((src) => !failedSources.includes(src));

  if (!tiles.length) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#4a2c1a] to-[#8B6340]">
        <Bookmark size={40} className="text-white/30" />
      </div>
    );
  }

  const layoutClass = tiles.length === 1
    ? ""
    : tiles.length === 3
      ? "grid-cols-2 grid-rows-2"
      : "grid-cols-2";

  return (
    <div className={`grid h-full w-full ${layoutClass}`}>
      {tiles.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          onError={() => setFailureState((current) => ({
            key: sourceKey,
            sources: current.key === sourceKey && !current.sources.includes(src)
              ? [...current.sources, src]
              : current.key === sourceKey ? current.sources : [src],
          }))}
          className={`h-full w-full min-h-0 object-cover ${tiles.length === 3 && i === 0 ? "row-span-2" : ""}`}
        />
      ))}
    </div>
  );
}

function CollectionCard({
  collection,
  confirming,
  onEdit,
  onDeleteStart,
  onDeleteConfirm,
}: {
  collection: SeekerCollection;
  confirming: boolean;
  onEdit: () => void;
  onDeleteStart: () => void;
  onDeleteConfirm: () => void;
}) {
  const count = collection.items_count ?? collection.properties_count ?? 0;

  return (
    <div className="group relative aspect-square overflow-hidden rounded-2xl bg-[#1a0e08] shadow-sm transition-shadow duration-200 hover:shadow-lg">
      <div className="absolute inset-0">
        <CollectionMosaic imgs={collection.preview_images ?? []} />
      </div>

      {/* Bottom-heavy gradient for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      {/* Rename / delete: always visible on touch screens, on hover from md up */}
      {!collection.is_default && (
        <div className="absolute right-2 top-2 flex items-center gap-1 transition-opacity duration-150 md:right-3 md:top-3 md:gap-1.5 md:opacity-0 md:group-hover:opacity-100">
          <button
            type="button"
            aria-label="Rename Collection"
            onClick={onEdit}
            className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-black/60 md:p-2"
          >
            <Pencil size={14} />
          </button>
          {confirming ? (
            <button
              type="button"
              aria-label="Confirm Delete"
              onClick={onDeleteConfirm}
              className="flex items-center gap-1 rounded-full bg-red-500/90 px-2.5 py-1.5 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:bg-red-600"
            >
              <Check size={12} /> Confirm
            </button>
          ) : (
            <button
              type="button"
              aria-label="Delete Collection"
              onClick={onDeleteStart}
              className="rounded-full bg-black/40 p-1.5 text-white backdrop-blur-sm transition-colors hover:bg-red-500/80 md:p-2"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}

      <Link
        to={`/profile/collections/${collection.id}`}
        className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-3 md:p-4"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-snug text-white drop-shadow md:text-base">{collection.name}</p>
          <p className="mt-0.5 text-[11px] text-white/65 md:text-xs">
            {count} {count === 1 ? "saved item" : "saved items"}
          </p>
        </div>
        <ArrowRight size={16} className="ml-2 shrink-0 text-white/60 transition-transform group-hover:translate-x-1 md:ml-3 md:size-[18px]" />
      </Link>
    </div>
  );
}
