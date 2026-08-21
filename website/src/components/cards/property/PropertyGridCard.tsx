import { Link } from "react-router-dom";
import { Heart, ArrowRight } from "lucide-react";
import type { Property } from "../../../types/property";

type Props = {
  item: Property;
};

const PropertyGridCard = ({ item }: Props) => (
  <Link to={`/property/${item.id}`} className="flex h-[25rem] w-full flex-col border border-transparent transition-colors duration-200 overflow-hidden rounded-3xl bg-white text-left text-primary-brown mx-auto hover:border-primary">
    <div className="relative h-[60%] shrink-0 overflow-hidden">
      <img loading="lazy"
        src={item.image}
        alt={item.title}
        className="h-full w-full object-cover"
      />

      {item.badge && (
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.75rem] font-medium">
          {item.badge}
        </span>
      )}

      <button
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/85"
        aria-label={item.isFavourite ? "Remove from favourites" : "Add to favourites"}
      >
        <Heart
          size={18}
          className={
            item.isFavourite
              ? "fill-primary-brown text-primary-brown"
              : "fill-transparent text-primary-brown stroke-[1.5]"
          }
        />
      </button>
    </div>

    
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <h3 className="line-clamp-2 text-[0.9375rem] font-bold leading-[1.3] lg:text-[1.0625rem]">
        {item.title}
      </h3>

      <p className="mt-2 text-[1rem] font-bold">
        ${item.price.toLocaleString()}
      </p>

      <p className="mt-1 truncate text-[0.875rem] text-primary-brown">
        {item.beds} Bed&nbsp;&nbsp;•&nbsp;&nbsp;{item.baths} Bath&nbsp;&nbsp;•&nbsp;&nbsp;{item.sqm} sqm
      </p>

      
      <div className="mt-auto">
        <div className="w-full border-t border-primary-light-brown/70" />

        <div className="mt-3 flex w-full items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <img loading="lazy"
              src={item.posterAvatar}
              alt={item.posterName}
              className="h-7 w-7 shrink-0 rounded-full object-cover"
            />
            <span className="min-w-0 truncate text-[0.875rem]">
              Listed by <span className="font-bold">{item.posterName}</span>
            </span>
          </div>
          <ArrowRight size={18} className="shrink-0 text-primary-light-brown/70" />
        </div>
      </div>
    </div>
  </Link>
);

export default PropertyGridCard;