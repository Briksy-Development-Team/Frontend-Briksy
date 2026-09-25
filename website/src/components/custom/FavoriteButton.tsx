import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { storePendingFavoriteAction } from "../../auth/auth.intent";
import { getSeekerFavorites, toggleSeekerFavorite, type FavoriteType } from "../../api/seeker/seeker.api";
import CollectionModal from "../collections/CollectionModal";

type FavoriteButtonProps = {
  initialIsFavourite?: boolean;
  className?: string;
  iconSize?: number;
  variant?: "overlay" | "inline" | "icon-only";
  showText?: boolean;
  targetId?: string | number;
  targetType?: FavoriteType;
};

export default function FavoriteButton({
  initialIsFavourite = false, className = "", iconSize = 24, variant = "overlay", showText = false,
  targetId, targetType = "property",
}: FavoriteButtonProps) {
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const [saving, setSaving] = useState(false);
  const [collectionPromptOpen, setCollectionPromptOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    let active = true;

    if (!isAuthenticated || !targetId) {
      setIsFavourite(initialIsFavourite);
      return () => { active = false; };
    }

    void getSeekerFavorites(targetType).then((response) => {
      if (!active) return;
      setIsFavourite((response.data ?? []).some((item) => String(item.target?.id ?? "") === String(targetId)));
    }).catch(() => {
      // Keep the button usable even if the initial favourites request fails.
    });

    return () => { active = false; };
  }, [initialIsFavourite, isAuthenticated, targetId, targetType]);

  return (
    <>
    <button
      type="button"
      aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
      title={isFavourite ? "Remove from favourites" : "Add to favourites"}
      disabled={saving}
      onClick={async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!targetId) return;
        if (!isAuthenticated) {
          storePendingFavoriteAction(String(targetId), window.location.pathname, targetType);
          window.location.assign("/login");
          return;
        }
        setSaving(true);
        try {
          const response = await toggleSeekerFavorite(String(targetId), targetType);
          setIsFavourite(response.data.action === "added");
          if (response.data.action === "added" && response.data.collection_selection_required) {
            setCollectionPromptOpen(true);
          }
        } catch (error) {
          console.error("Unable to update favourite.", error);
        } finally {
          setSaving(false);
        }
      }}
      className={`flex items-center justify-center active:scale-125 transition-transform duration-200 ${className}`}
    >
      <Heart
        size={iconSize}
        strokeWidth={variant === "overlay" ? 2.5 : 2}
        className={`transition-colors duration-200 ${isFavourite ? "fill-red-500 text-red-500" : (variant === "overlay" ? "fill-transparent text-white" : "fill-transparent text-current")}`}
      />
      {showText && <span className="ml-2 font-medium">{isFavourite ? "Liked" : "Like"}</span>}
    </button>
    {collectionPromptOpen && targetId && (
      <CollectionModal
        propertyId={String(targetId)}
        targetType={targetType}
        onClose={() => setCollectionPromptOpen(false)}
      />
    )}
    </>
  );
}
