import { useState } from "react";
import { Heart } from "lucide-react";

type FavoriteButtonProps = {
  initialIsFavourite?: boolean;
  className?: string;
  iconSize?: number;
  variant?: "overlay" | "inline";
  showText?: boolean;
};

export default function FavoriteButton({ 
  initialIsFavourite = false, className = "", iconSize = 24, variant = "overlay", showText = false 
}: FavoriteButtonProps) {
  const [isFavourite, setIsFavourite] = useState(initialIsFavourite);

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsFavourite(!isFavourite); }}
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
