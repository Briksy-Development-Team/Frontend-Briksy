import { useEffect, useState } from "react";
import { Pencil, Trash2, ArrowRight, Bookmark, X, Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Mousewheel } from "swiper/modules";
import {
  createCollection,
  deleteCollection,
  getCollections,
  renameCollection,
  type SeekerCollection,
} from "../../../api/seeker/collections.api";

export default function CollectionsPage() {
  const [collections, setCollections] = useState<SeekerCollection[]>([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState<SeekerCollection | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [createdMessage, setCreatedMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    void getCollections()
      .then((response) => setCollections(response.data ?? []))
      .catch(() => setError("Unable to load Collections."))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const submit = async () => {
    const value = name.trim();
    if (!value) { setError("Collection name is required."); return; }
    try {
      if (editing) {
        await renameCollection(editing.id, value);
      } else {
        await createCollection(value);
        setCreatedMessage(`New Collection "${value}" created`);
        window.setTimeout(() => setCreatedMessage(null), 3500);
      }
      setName(""); setEditing(null); setComposerOpen(false); setError(null);
      load();
    } catch (reason: any) {
      setError(reason?.response?.data?.message || "Unable to save the Collection.");
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = async (collection: SeekerCollection) => {
    setIsDeleting(true);
    try {
      await deleteCollection(collection.id);
      setCollections((items) => items.filter((item) => item.id !== collection.id));
      setDeletingId(null);
    } catch {
      setError("Unable to delete the Collection.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="w-full space-y-8">
      {createdMessage && (
        <div role="status" className="fixed right-5 top-5 z-[120] rounded-2xl bg-primary-brown px-5 py-4 text-sm font-medium text-white shadow-2xl animate-fade-in">
          {createdMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.875rem] font-medium text-primary-brown tracking-tight">Collections</h1>
          <p className="mt-1 text-sm text-primary-light-brown">
            Organize your liked properties and saved listings into custom groups.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditing(null); setName(""); setComposerOpen(true); }}
          className="flex items-center gap-2 rounded-full bg-primary-brown px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-brown/90 transition-all active:scale-[0.98]"
        >
          <Plus size={18} /> Create Collection
        </button>
      </div>

      {/* Inline Create/Edit Form */}
      {(composerOpen || editing) && (
        <div className="rounded-3xl bg-white border border-[#EDE8E4] p-6 shadow-sm animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-primary-brown">
              {editing ? "Rename Collection" : "Create New Collection"}
            </h3>
            <button onClick={() => { setEditing(null); setName(""); setComposerOpen(false); }} className="text-primary-brown/60 hover:text-primary-brown p-1 rounded-full hover:bg-[#F8F4EE] transition-colors">
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-3">
            <input
              autoFocus maxLength={100} value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void submit(); } }}
              placeholder="e.g. Dream Homes, Renovations, Investment Properties"
              className="min-w-0 flex-1 rounded-2xl border border-[#E2CBB3] bg-[#F8F4EE]/50 px-4 py-3 text-sm outline-none text-primary-brown placeholder:text-primary-light-brown focus:border-primary-brown focus:bg-white transition-all"
            />
            <button type="button" onClick={() => void submit()} className="rounded-2xl bg-primary-brown px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-brown/90 transition-colors shrink-0">
              {editing ? "Save Changes" : "Create"}
            </button>
            <button type="button" onClick={() => { setEditing(null); setName(""); setComposerOpen(false); }} className="rounded-2xl border border-[#EDE8E4] bg-white px-5 py-3 text-sm font-medium text-primary-brown hover:bg-[#F8F4EE] transition-colors shrink-0">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="rounded-3xl bg-white p-6 md:p-8 border border-[#EDE8E4]/80 shadow-sm">
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
              onClick={() => { setEditing(null); setName(""); setComposerOpen(true); }}
              className="inline-flex items-center gap-2 rounded-full bg-primary-brown px-5 py-2.5 text-xs font-medium text-white hover:bg-primary-brown/90 transition-colors"
            >
              <Plus size={15} /> Create your first collection
            </button>
          </div>
        ) : (
          <Swiper
            modules={[Mousewheel]}
            spaceBetween={16}
            slidesPerView="auto"
            watchOverflow={false}
            grabCursor
            mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }}
            slidesOffsetBefore={0}
            slidesOffsetAfter={0}
            className="!ml-0 [overscroll-behavior-x:contain] touch-pan-y !pb-4"
          >
            {collections.map((collection) => {
              const count = collection.items_count ?? collection.properties_count ?? 0;
              const imgs = collection.preview_images ?? [];
              return (
                <SwiperSlide key={collection.id} className="!w-[19.4375rem]">
                  <CollectionCard
                    collection={collection}
                    count={count}
                    imgs={imgs}
                    isDeleting={isDeleting}
                    deletingId={deletingId}
                    onEdit={() => { setEditing(collection); setName(collection.name); setComposerOpen(true); }}
                    onDeleteStart={() => setDeletingId(collection.id)}
                    onDeleteConfirm={() => void remove(collection)}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        )}
      </div>
    </div>
  );
}

// Spotify-folder mosaic: 1 img = full, 2 = side-by-side, 3 = left-full + right-split, 4 = 2×2
function CollectionMosaic({ imgs }: { imgs: string[] }) {
  const tiles = imgs.slice(0, 4);
  const n = tiles.length;

  if (n === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#4a2c1a] to-[#8B6340] flex items-center justify-center">
        <Bookmark size={40} className="text-white/30" />
      </div>
    );
  }

  if (n === 1) return <img src={tiles[0]} alt="" className="w-full h-full object-cover" />;

  if (n === 2) return (
    <div className="w-full h-full grid grid-cols-2 gap-px">
      {tiles.map((src, i) => <img key={i} src={src} alt="" className="w-full h-full object-cover" />)}
    </div>
  );

  if (n === 3) return (
    <div className="w-full h-full grid grid-cols-2 gap-px">
      <img src={tiles[0]} alt="" className="w-full h-full object-cover row-span-2" />
      <img src={tiles[1]} alt="" className="w-full h-full object-cover" />
      <img src={tiles[2]} alt="" className="w-full h-full object-cover" />
    </div>
  );

  return (
    <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-px">
      {tiles.map((src, i) => <img key={i} src={src} alt="" className="w-full h-full object-cover" />)}
    </div>
  );
}

function CollectionCard({
  collection, count, imgs, isDeleting, deletingId,
  onEdit, onDeleteStart, onDeleteConfirm,
}: {
  collection: SeekerCollection;
  count: number;
  imgs: string[];
  isDeleting: boolean;
  deletingId: string | null;
  onEdit: () => void;
  onDeleteStart: () => void;
  onDeleteConfirm: () => void;
}) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-[#1a0e08] shadow-sm hover:shadow-lg transition-shadow duration-200 aspect-square">
      {/* Mosaic background */}
      <div className="absolute inset-0">
        <CollectionMosaic imgs={imgs} />
      </div>

      {/* Gradient overlay — bottom heavy for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />

      {/* Action buttons — top-right, visible on hover */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        <button
          type="button"
          aria-label="Rename Collection"
          onClick={(e) => { e.preventDefault(); onEdit(); }}
          className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-black/60 transition-colors"
        >
          <Pencil size={14} />
        </button>
        {deletingId === collection.id ? (
          <button
            type="button"
            aria-label="Confirm Delete"
            disabled={isDeleting}
            onClick={(e) => { e.preventDefault(); onDeleteConfirm(); }}
            className="flex items-center gap-1 rounded-full bg-red-500/90 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 transition-colors"
          >
            {isDeleting ? "..." : <Check size={12} />} Confirm
          </button>
        ) : (
          <button
            type="button"
            aria-label="Delete Collection"
            onClick={(e) => { e.preventDefault(); onDeleteStart(); }}
            className="p-2 rounded-full bg-black/40 backdrop-blur-sm text-white hover:bg-red-500/80 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Bottom overlay — name + count + arrow */}
      <Link
        to={`/profile/collections/${collection.id}`}
        className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between"
      >
        <div className="min-w-0">
          <p className="text-white font-semibold text-[1rem] leading-snug truncate drop-shadow">
            {collection.name}
          </p>
          <p className="text-white/65 text-xs mt-0.5">
            {count} {count === 1 ? "saved item" : "saved items"}
          </p>
        </div>
        <ArrowRight
          size={18}
          className="text-white/60 shrink-0 ml-3 transition-transform group-hover:translate-x-1"
        />
      </Link>
    </div>
  );
}
