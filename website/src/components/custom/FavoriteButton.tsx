import { useState } from "react";
import { Heart } from "lucide-react";
import { useAuth } from "../../auth/AuthContext";
import { storePendingFavoriteAction } from "../../auth/auth.intent";
import { toggleSeekerFavorite, type FavoriteType } from "../../api/seeker/seeker.api";

type FavoriteButtonProps = {
  initialIsFavourite?: boolean;
  className?: string;
  iconSize?: number;
  variant?: "overlay" | "inline";
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
  const { isAuthenticated } = useAuth();

  return (
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
  );
}
