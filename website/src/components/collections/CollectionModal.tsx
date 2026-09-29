import { useEffect, useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import ModalWrapper from "../wrapper/ModalWrapper";
import AuthPromptToast from "../custom/AuthPromptToast";
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
  isOpen = true,
}: {
  propertyId: string;
  targetType?: CollectionTargetType;
  onClose: () => void;
  isOpen?: boolean;
}) {
  const { isAuthenticated, isSeeker } = useAuth();
  const [collections, setCollections] = useState<SeekerCollection[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // New collection creation inline state
  const [creatingNew, setCreatingNew] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!isOpen || !isAuthenticated || !isSeeker) return;
    void getCollectionsForTarget(targetType, propertyId)
      .then((response) => {
        setCollections(response.data ?? []);
        setSelected(
          new Set(
            (response.data ?? [])
              .filter(
                (item) =>
                  item.contains_item ||
                  (targetType === "property" && item.contains_property),
              )
              .map((item) => item.id),
          ),
        );
      })
      .catch(() => setError("Unable to load your Collections."));
  }, [isOpen, isAuthenticated, isSeeker, propertyId, targetType]);

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

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const handleCreateCollection = async () => {
    const val = newCollectionName.trim();
    if (!val) return;
    setCreating(true);
    setError(null);
    try {
      const res = await createCollection(val);
      const created = res.data;
      setCollections((prev) => [...prev, created]);
      setSelected((prev) => new Set([...prev, created.id]));
      setNewCollectionName("");
      setCreatingNew(false);
    } catch (reason: any) {
      setError(
        reason?.response?.data?.message || "Unable to create Collection.",
      );
    } finally {
      setCreating(false);
    }
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const original = new Set(
        collections
          .filter(
            (item) =>
              item.contains_item ||
              (targetType === "property" && item.contains_property),
          )
          .map((item) => item.id),
      );
      await Promise.all([
        ...collections
          .filter((item) => selected.has(item.id) && !original.has(item.id))
          .map((item) => addItemToCollection(item.id, targetType, propertyId)),
        ...collections
          .filter((item) => !selected.has(item.id) && original.has(item.id))
          .map((item) =>
            removeItemFromCollection(item.id, targetType, propertyId),
          ),
      ]);
      onClose();
    } catch (reason: any) {
      setError(
        reason?.response?.data?.message ||
          "Unable to update this item's Collections.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalWrapper isOpen={isOpen}>
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <div
          className="w-full max-w-md rounded-3xl bg-[#F8F4EE] p-6 shadow-2xl transition-all"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-primary-brown">
              Add to Collection
            </h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="p-1 rounded-full text-primary-brown/60 hover:text-primary-brown hover:bg-black/5 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mt-5 max-h-64 space-y-2.5 overflow-y-auto pr-1 scrollbar-hide">
            {collections.length === 0 && !creatingNew && (
              <p className="text-sm text-primary-light-brown py-2">
                You haven't created any Collections yet.
              </p>
            )}

            {collections.map((item) => {
              const isChecked = selected.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => toggle(item.id)}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-left text-primary-brown transition-all ${
                    isChecked
                      ? "border-primary-brown bg-white shadow-sm font-medium"
                      : "border-transparent bg-white/80 hover:bg-white hover:border-[#E2CBB3]"
                  }`}
                >
                  <span className="text-sm truncate pr-2">{item.name}</span>
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors ${
                      isChecked
                        ? "bg-primary-brown border-primary-brown text-white"
                        : "border-[#C8C5BD] bg-white"
                    }`}
                  >
                    {isChecked && <Check size={13} strokeWidth={3} />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Inline Create New Collection Form */}
          <div className="mt-4">
            {!creatingNew ? (
              <button
                type="button"
                onClick={() => setCreatingNew(true)}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#C8C5BD] bg-white/60 py-3 text-sm font-medium text-primary-brown hover:bg-white hover:border-primary-brown transition-all"
              >
                <Plus size={16} /> Create New Collection
              </button>
            ) : (
              <div className="flex items-center gap-2 rounded-2xl bg-white p-2 border border-[#E2CBB3] shadow-sm">
                <input
                  type="text"
                  autoFocus
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleCreateCollection();
                    }
                  }}
                  placeholder="Collection name..."
                  className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none text-primary-brown placeholder:text-primary-light-brown"
                />
                <button
                  type="button"
                  disabled={creating || !newCollectionName.trim()}
                  onClick={() => void handleCreateCollection()}
                  className="rounded-xl bg-primary-brown px-4 py-2 text-xs font-medium text-white hover:bg-primary-brown/90 disabled:opacity-50 transition-colors"
                >
                  {creating ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCreatingNew(false);
                    setNewCollectionName("");
                  }}
                  className="px-2 text-xs text-primary-light-brown hover:text-primary-brown transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {error && <p className="mt-3 text-xs text-red-700 font-medium">{error}</p>}

          <button
            type="button"
            disabled={saving}
            onClick={() => void save()}
            className="mt-6 w-full rounded-full bg-primary-brown py-3.5 text-sm font-medium text-white shadow-md hover:bg-primary-brown/90 disabled:opacity-50 transition-all active:scale-[0.99]"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
