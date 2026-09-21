import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Property } from "../../../types/property";
import FavoriteButton from "../../custom/FavoriteButton";

type Props = {
  item: Property
}

const PropertyGridCard = ({ item }: Props) => {
  const truncateText = (text: string, maxLength = 30) =>
    text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  return (
    <Link
      to={`/property/${item.id}`}
      className="flex h-[28rem] w-[19.6667rem] flex-col border border-transparent transition-colors duration-200 overflow-hidden rounded-3xl bg-white text-left text-primary-brown mx-auto hover:border-primary"
    >
      <div className="relative h-[60%] shrink-0 overflow-hidden">
        <img
          loading="lazy"
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover"
        />

          {(item.purpose || item.badge) && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[0.75rem] font-medium">
            {( { SELL: "For Sale", RENT: "For Rent", BOTH: "Sale & Rent" } as Record<string, string> )[item.purpose || ""] || item.badge}
            </span>
          )}

        <FavoriteButton
          initialIsFavourite={item.isFavourite}
          targetId={item.id}
          targetType="property"
          className="absolute right-4 top-3"
          variant="overlay"
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-[0.875rem]  leading-[1.3] lg:text-[0.875rem]">
            {truncateText(item.title, 30)}
        </h3>

        {item.propertyType && <p className="mt-1 text-xs text-primary-light-brown">{item.propertyType}</p>}

        <p className="mt-2 text-[1rem] ">
          {item.price ? `$${item.price.toLocaleString()}` : "Contact for pricing"}
        </p>

        <p className="mt-1 truncate text-[0.875rem] text-primary-brown">
          {item.beds || "—"} Bed&nbsp;&nbsp;•&nbsp;&nbsp;{item.baths || "—"} Bath&nbsp;&nbsp;•&nbsp;&nbsp;{item.sqm || "—"} sqm
        </p>

        <div className="mt-auto">
          <div className="w-full border-t border-primary-light-brown/70" />

          <div className="mt-3 flex w-full items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <img
                loading="lazy"
                src={item.posterAvatar}
                alt={item.posterName}
                className="h-7 w-7 shrink-0 rounded-full object-cover"
              />
              <span className="min-w-0 truncate text-[0.875rem]">
                Listed by <span className="">{item.posterName}</span>
              </span>
            </div>
            <ArrowRight size={18} className="shrink-0 text-primary-light-brown/70" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyGridCard;
