import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Plus, X } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import AuthPromptToast from "../custom/AuthPromptToast";
import { SafeImage } from "../custom/SafeImage";
import {
  addItemToCollection,
  createCollection,
  getCollectionsForTarget,
  removeItemFromCollection,
  type CollectionTargetType,
  type SeekerCollection,
} from "../../api/seeker/collections.api";

export default function CollectionModal({
  propertyId,
  targetType = "property",
  onClose,
  onDismissWithoutSelection,
  isOpen = true,
  buttonRect,
  collectionsRequest,
  defaultCollectionId,
}: {
  propertyId: string;
  targetType?: CollectionTargetType;
  onClose: () => void;
  onDismissWithoutSelection?: () => void;
  isOpen?: boolean;
  buttonRect?: DOMRect | null;
  collectionsRequest?: Promise<{ data: SeekerCollection[] }> | null;
  defaultCollectionId?: string | null;
}) {
  const { isAuthenticated, isSeeker } = useAuth();
  const [collections, setCollections] = useState<SeekerCollection[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const userSelectedRef = useRef(false);

  const close = () => {
    if (!userSelectedRef.current) onDismissWithoutSelection?.();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener("scroll", close, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", close, { capture: true });
  });

  useEffect(() => {
    if (!isOpen || !isAuthenticated || !isSeeker) return;
    setLoading(true);
    (collectionsRequest ?? getCollectionsForTarget(targetType, propertyId))
      .then(({ data }) => {
        const list = data ?? [];
        setCollections(list);
        setSelected(
          new Set(
            list
              .filter((c) => c.contains_item || (targetType === "property" && c.contains_property))
              .map((c) => c.id),
          ),
        );
      })
      .catch(() => setError("Unable to load your Collections."))
      .finally(() => setLoading(false));
  }, [collectionsRequest, isOpen, isAuthenticated, isSeeker, propertyId, targetType]);

  useEffect(() => {
    if (defaultCollectionId) {
      setSelected((current) => new Set(current).add(defaultCollectionId));
    }
  }, [defaultCollectionId]);

  if (!isAuthenticated || !isSeeker) {
    return (
      <AuthPromptToast
        isOpen={isOpen}
        onClose={onClose}
        targetId={propertyId}
        targetType={targetType}
      />
    );
  }

  if (!isOpen) return null;

  const flip = (id: string) =>
    setSelected((cur) => {
      const next = new Set(cur);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const toggle = async (id: string) => {
    const isChecked = selected.has(id);
    userSelectedRef.current = true;
    flip(id);
    try {
      if (isChecked) await removeItemFromCollection(id, targetType, propertyId);
      else await addItemToCollection(id, targetType, propertyId);
    } catch {
      flip(id); // revert
      setError("Unable to update Collection.");
    }
  };

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) return;
    setSaving(true);
    setError(null);
    try {
      const { data: created } = await createCollection(name);
      setCollections((prev) => [created, ...prev]);
      userSelectedRef.current = true;
      setSelected((prev) => new Set(prev).add(created.id));
      await addItemToCollection(created.id, targetType, propertyId);
      setNewName("");
      setCreatingNew(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to create Collection.");
    } finally {
      setSaving(false);
    }
  };

  // Always directly below the fav button, right-aligned with it
  const position: React.CSSProperties = buttonRect
    ? { top: buttonRect.bottom + 8, right: window.innerWidth - buttonRect.right - 14 }
    : {};
  const visibleCollections = collections.length > 0
    ? collections
    : defaultCollectionId
      ? [{
          id: defaultCollectionId,
          name: "Liked",
          properties_count: targetType === "property" ? 1 : 0,
          items_count: 1,
          is_default: true,
          contains_property: targetType === "property",
          contains_item: targetType !== "property",
        }]
      : [];

  return createPortal(
    <div
      className="fixed inset-0 z-[100]"
      onClick={(e) => {
        e.stopPropagation();
        close();
      }}
    >
      <div
        className="absolute flex w-[300px] xl:w-[320px] max-w-[calc(100vw-32px)] flex-col rounded-[24px] bg-white p-3 xl:p-4 shadow-[0px_0px_13px_0px_rgba(0,0,0,0.12)]"
        style={position}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3">
          <h2 className="text-[14px] font-medium text-[#342511]">Collections</h2>
          <button
            onClick={() => setCreatingNew(true)}
            aria-label="Create new collection"
            className="rounded-full p-1 text-[#342511] transition-colors hover:bg-black/5"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
        </div>

        <div className="mb-3 w-full border-b border-[#EDE8E4]" />

        <div className="flex max-h-80 flex-col gap-[6px] overflow-y-auto scrollbar-hide">
          {loading && visibleCollections.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-[#6B7280]">Loading Collections...</p>
          )}

          {!loading && visibleCollections.length === 0 && (
            <p className="px-3 py-4 text-center text-sm text-[#6B7280]">
              You haven't created any Collections yet.
            </p>
          )}

          {visibleCollections.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => toggle(item.id)}
              className={`flex items-center gap-3 rounded-[10px] p-1 pr-3 text-left transition-colors ${selected.has(item.id) ? "bg-[#F3F4F3]" : "hover:bg-black/5"
                }`}
            >
              <div className="h-[56px] w-[57px] shrink-0 overflow-hidden rounded-[8px] bg-[#F5F4F2]">
                <SafeImage src="" alt={item.name} className="h-full w-full object-cover" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[14px] font-medium text-[#342511]">{item.name}</span>
                <span className="mt-1 truncate text-[12px] text-[#6B7280]">
                  {String(item.properties_count || 0).padStart(2, "0")} properties,{" "}
                  {String(item.items_count || 0).padStart(2, "0")} items
                </span>
              </div>
            </button>
          ))}
        </div>

        {error && <p className="pt-3 text-center text-xs font-medium text-red-600">{error}</p>}
      </div>

      {creatingNew && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 p-4 backdrop-blur-[2px]"
          onClick={(e) => {
            e.stopPropagation();
            setCreatingNew(false);
          }}
        >
          <div
            className="flex w-full max-w-[598px] flex-col gap-3 rounded-[24px] bg-white p-6 shadow-[0px_0px_14px_0px_rgba(0,0,0,0.25)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-2 flex flex-col items-start">
              <button
                onClick={() => setCreatingNew(false)}
                className="rounded-full p-1 text-black transition-colors hover:bg-black/5"
                aria-label="Close new collection modal"
              >
                <X size={28} strokeWidth={2} />
              </button>
              <h2 className="text-[20px] font-medium text-[#222222]">New Collections</h2>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="h-[152px] w-[155px] shrink-0 overflow-hidden rounded-[8px] bg-[#F5F4F2]">
                <SafeImage src="" alt="Cover" className="h-full w-full object-cover" />
              </div>
              <input
                type="text"
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    void handleCreate();
                  }
                }}
                placeholder="Collection Name"
                className="mt-2 w-full rounded-[8px] border border-[#C7C5BA] p-[13px] text-[16px] text-black outline-none transition-colors placeholder:text-black/40 focus:border-[#342511]"
              />
            </div>

            <div className="mt-2 flex justify-end">
              <button
                type="button"
                disabled={saving || !newName.trim()}
                onClick={() => void handleCreate()}
                className="h-[50px] min-w-[98px] rounded-[900px] bg-primary-brown px-6 text-[14px] font-medium text-white disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  );
}
