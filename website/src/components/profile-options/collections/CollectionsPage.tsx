import { useEffect, useState } from "react";
import { Pencil, Trash2, ArrowRight, Bookmark, X, Plus } from "lucide-react";
import { Link } from "react-router-dom";
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
    if (!value) {
      setError("Collection name is required.");
      return;
    }
    try {
      if (editing) {
        await renameCollection(editing.id, value);
      } else {
        await createCollection(value);
        setCreatedMessage(`New Collection "${value}" created`);
        window.setTimeout(() => setCreatedMessage(null), 3500);
      }
      setName("");
      setEditing(null);
      setComposerOpen(false);
      setError(null);
      load();
    } catch (reason: any) {
      setError(
        reason?.response?.data?.message || "Unable to save the Collection.",
      );
    }
  };

  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const remove = async (collection: SeekerCollection) => {
    setIsDeleting(true);
    try {
      await deleteCollection(collection.id);
      setCollections((items) =>
        items.filter((item) => item.id !== collection.id),
      );
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
        <div
          role="status"
          className="fixed right-5 top-5 z-[120] rounded-2xl bg-primary-brown px-5 py-4 text-sm font-medium text-white shadow-2xl animate-fade-in"
        >
          {createdMessage}
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[1.875rem] font-medium text-primary-brown tracking-tight">
            Collections
          </h1>
          <p className="mt-1 text-sm text-primary-light-brown">
            Organize your liked properties and saved listings into custom groups.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setName("");
            setComposerOpen(true);
          }}
          className="flex items-center gap-2 rounded-full bg-primary-brown px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-brown/90 transition-all active:scale-[0.98]"
        >
          <Plus size={18} /> Create Collection
        </button>
      </div>

      {/* Inline Create/Edit Form */}
      {(composerOpen || editing) && (
        <div className="rounded-3xl bg-white border border-[#EDE8E4] p-6 shadow-sm transition-all animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-medium text-primary-brown">
              {editing ? "Rename Collection" : "Create New Collection"}
            </h3>
            <button
              onClick={() => {
                setEditing(null);
                setName("");
                setComposerOpen(false);
              }}
              className="text-primary-brown/60 hover:text-primary-brown p-1 rounded-full hover:bg-[#F8F4EE] transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          <div className="flex flex-wrap md:flex-nowrap gap-3">
            <input
              autoFocus
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void submit();
                }
              }}
              placeholder="e.g. Dream Homes, Renovations, Investment Properties"
              className="min-w-0 flex-1 rounded-2xl border border-[#E2CBB3] bg-[#F8F4EE]/50 px-4 py-3 text-sm outline-none text-primary-brown placeholder:text-primary-light-brown focus:border-primary-brown focus:bg-white transition-all"
            />
            <button
              type="button"
              onClick={() => void submit()}
              className="rounded-2xl bg-primary-brown px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-primary-brown/90 transition-colors shrink-0"
            >
              {editing ? "Save Changes" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setName("");
                setComposerOpen(false);
              }}
              className="rounded-2xl border border-[#EDE8E4] bg-white px-5 py-3 text-sm font-medium text-primary-brown hover:bg-[#F8F4EE] transition-colors shrink-0"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="rounded-3xl bg-white p-6 md:p-8 border border-[#EDE8E4]/80 shadow-sm">
        {error && (
          <p className="mb-4 text-sm font-medium text-red-700 bg-red-50 p-3.5 rounded-xl border border-red-100">
            {error}
          </p>
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
            <h3 className="text-base font-medium text-primary-brown mb-1">
              No collections yet
            </h3>
            <p className="text-xs text-primary-light-brown mb-5">
              Save properties and items into custom collections to organize your search.
            </p>
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setName("");
                setComposerOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-primary-brown px-5 py-2.5 text-xs font-medium text-white hover:bg-primary-brown/90 transition-colors"
            >
              <Plus size={15} /> Create your first collection
            </button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {collections.map((collection) => {
              const count =
                collection.items_count ?? collection.properties_count ?? 0;
              return (
                <div
                  key={collection.id}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[#EDE8E4] bg-white p-6 transition-all duration-200 hover:border-primary-brown/50 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F8F4EE] text-primary-brown group-hover:bg-primary-brown group-hover:text-white transition-colors duration-200">
                        <Bookmark size={20} />
                      </div>
                      <div className="min-w-0 pt-0.5">
                        <Link
                          to={`/profile/collections/${collection.id}`}
                          className="block truncate text-lg font-medium text-primary-brown hover:underline"
                        >
                          {collection.name}
                        </Link>
                        <p className="mt-1 text-xs text-primary-light-brown font-medium">
                          {count} {count === 1 ? "saved item" : "saved items"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        aria-label="Rename Collection"
                        onClick={() => {
                          setEditing(collection);
                          setName(collection.name);
                          setComposerOpen(true);
                        }}
                        className="p-2 rounded-full text-primary-brown/70 hover:bg-[#F8F4EE] hover:text-primary-brown transition-colors"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        aria-label="Delete Collection"
                        onClick={() => setDeletingId(collection.id)}
                        className="p-2 rounded-full text-primary-brown/70 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {deletingId === collection.id ? (
                    <div className="mt-4 flex items-center justify-between gap-3 rounded-xl bg-red-50/90 p-3 border border-red-200 animate-fade-in">
                      <span className="text-xs font-semibold text-red-800">
                        Delete this collection?
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => void remove(collection)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50 transition-colors shadow-sm"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                        <button
                          type="button"
                          disabled={isDeleting}
                          onClick={() => setDeletingId(null)}
                          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-primary-brown hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={`/profile/collections/${collection.id}`}
                      className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-primary-brown hover:text-black transition-colors"
                    >
                      <span>Open Collection</span>
                      <ArrowRight
                        size={16}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
