import { useEffect, useState, useRef } from "react";
import { Bookmark } from "lucide-react";
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
  const { isAuthenticated, isSeeker } = useAuth();
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);
  const [showCollections, setShowCollections] = useState(false);
  const [showAuthToast, setShowAuthToast] = useState(false);
  const [buttonRect, setButtonRect] = useState<DOMRect | null>(null);
  const [collectionsRequest, setCollectionsRequest] = useState<Promise<{ data: SeekerCollection[] }> | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isFavouriteRef = useRef(isFavourite);

  useEffect(() => {
    isFavouriteRef.current = isFavourite;
  }, [isFavourite]);

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

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!targetId) return;
    if (!isAuthenticated || !isSeeker) {
      setShowAuthToast(true);
      return;
    }

    if (showCollections) {
      setShowCollections(false);
      return;
    }

    // Do NOT automatically register or change favourite state here.
    // The collection popover opens below, and state only changes when a collection is chosen.
    setButtonRect(buttonRef.current?.getBoundingClientRect() ?? null);
    setCollectionsRequest(getCollectionsForTarget(targetType, String(targetId)));
    setShowCollections(true);
  };

  const handleSelectionChange = async (hasSelections: boolean, _collectionId: string, isAdded: boolean) => {
    try {
      if (isAdded) {
        const wasNotFav = !isFavouriteRef.current;
        setIsFavourite(true);
        isFavouriteRef.current = true;
        if (wasNotFav) {
          await toggleSeekerFavorite(String(targetId), targetType);
        }
        invalidateSeekerFavorites(targetType);
      } else if (!hasSelections) {
        const wasFav = isFavouriteRef.current;
        setIsFavourite(false);
        isFavouriteRef.current = false;
        if (wasFav) {
          await toggleSeekerFavorite(String(targetId), targetType);
        }
        invalidateSeekerFavorites(targetType);
      }
    } catch (error) {
      console.error("Unable to update favourite status.", error);
    }
  };

  const iconColor = isFavourite
    ? "fill-red-500 text-red-500"
    : variant === "overlay"
      ? "fill-white/40 text-white"
      : "fill-white/40 text-current";

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
        <Bookmark
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
          onSelectionChange={handleSelectionChange}
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
