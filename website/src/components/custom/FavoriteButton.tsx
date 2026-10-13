import { useEffect, useState, useRef } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { getSeekerFavorites, invalidateSeekerFavorites, toggleSeekerFavorite, type FavoriteType } from "../../api/seeker/seeker.api";
import { getCollectionsForTarget, type SeekerCollection } from "../../api/seeker/collections.api";
import CollectionModal from "../collections/CollectionModal";
import AuthPromptToast from "./AuthPromptToast";

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
  initialIsFavourite = false,
  className = "",
  iconSize = 24,
  variant = "overlay",
  showText = false,
  targetId,
  targetType = "property",
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const [showCollections, setShowCollections] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [collectionsRequest, setCollectionsRequest] = useState<Promise<{ data: SeekerCollection[] }> | null>(null);
  const [defaultCollectionId, setDefaultCollectionId] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inFlight = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !targetId) {
      setIsFavourite(initialIsFavourite);
      return;
    }
    let active = true;
    getSeekerFavorites(targetType)
      .then((res) => {
        if (active) {
          setIsFavourite((res.data ?? []).some((i) => String(i.target?.id ?? "") === String(targetId)));
        }
      })
      .catch(() => { });
    return () => {
      active = false;
    };
  }, [initialIsFavourite, isAuthenticated, targetId, targetType]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!targetId || inFlight.current) return;
    if (!isAuthenticated) {
      setShowAuthToast(true);
      return;
    }

    // Optimistic update; open the collections popover only when adding
    const wasLiked = isFavourite;
    invalidateSeekerFavorites(targetType);
    setIsFavourite(!wasLiked);
    if (!wasLiked) {
      setButtonRect(buttonRef.current?.getBoundingClientRect() ?? null);
      setCollectionsRequest(getCollectionsForTarget(targetType, String(targetId)));
    } else {
      setCollectionsRequest(null);
      setDefaultCollectionId(null);
    }
    setShowCollections(!wasLiked);

    inFlight.current = true;
    try {
      const res = await toggleSeekerFavorite(String(targetId), targetType);
      invalidateSeekerFavorites(targetType);
      setIsFavourite(res.data.action === "added");
      setDefaultCollectionId(res.data.action === "added" ? (res.data.collection_id ?? null) : null);
    } catch (error) {
      setIsFavourite(wasLiked);
      setShowCollections(false);
      console.error("Unable to update favourite.", error);
    } finally {
      inFlight.current = false;
    }
  };

  const iconColor = isFavourite
    ? "fill-red-500 text-red-500"
    : variant === "overlay"
      ? "fill-transparent text-white"
      : "fill-transparent text-current";

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={isFavourite ? "Remove from favourites" : "Add to favourites"}
        title={isFavourite ? "Remove from favourites" : "Add to favourites"}
        onClick={(e) => void handleClick(e)}
        className={`flex items-center justify-center transition-transform duration-200 active:scale-125 ${className}`}
      >
        <Heart
          size={iconSize}
          strokeWidth={variant === "overlay" ? 2.5 : 2}
          className={`transition-colors duration-200 ${iconColor}`}
        />
        {showText && <span className="ml-2 font-medium">{isFavourite ? "Liked" : "Like"}</span>}
      </button>

      {showCollections && targetId && (
        <CollectionModal
          propertyId={String(targetId)}
          targetType={targetType}
          buttonRect={buttonRect}
          collectionsRequest={collectionsRequest}
          defaultCollectionId={defaultCollectionId}
          onClose={() => setShowCollections(false)}
        />
      )}

      <AuthPromptToast
        isOpen={showAuthToast}
        onClose={() => setShowAuthToast(false)}
        targetId={targetId}
        targetType={targetType}
      />
    </>
  );
}
