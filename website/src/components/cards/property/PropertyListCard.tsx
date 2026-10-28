import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bathtub01Icon,
  BedDoubleIcon,
  Car01Icon,
  House01Icon,
} from "@hugeicons/core-free-icons";
import type { Property } from "../../../types/property";
import { SafeImage } from "../../custom/SafeImage";
import FavoriteButton from "../../custom/FavoriteButton";
import { propertyStatusLabel } from "../../../utils/propertyStatus";
import { formatPropertyPrice } from "../../../utils/propertyPrice";

type Props = {
  item: Property;
};

const PropertyListCard = ({ item }: Props) => {
  const targetUrl = item.isAuction ? `/auction/${item.id}` : `/property/${item.id}`;

  const badgeText = item.isAuction
    ? "Auction"
    : propertyStatusLabel(item.purpose, item.transactionStatus, item.badge) || "Open Home";

  const priceDisplay = formatPropertyPrice({
    pricing_type: item.pricingType,
    price: item.price,
    price_min: item.priceMin,
    price_max: item.priceMax,
  });

  const baths = item.baths ?? 2;
  const beds = item.beds ?? 2;
  const cars = item.cars ?? 2;
  const sqm = item.sqm ? `${item.sqm}m²` : "103m²";

  return (
    <Link
      to={targetUrl}
      className="group flex items-stretch gap-2.5 sm:gap-3 rounded-2xl border border-[#EDE8E4] bg-white p-2 font-helvetica text-primary-brown transition-all duration-200 hover:border-primary-brown hover:shadow-sm"
    >
      {/* Left Photo + Badge */}
      <div className="relative w-[130px] sm:w-[137px] shrink-0 overflow-hidden rounded-lg bg-[#E2CBB3]">
        <SafeImage
          loading="lazy"
          src={item.image}
          alt={item.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {badgeText && (
          <span className="absolute left-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-normal text-primary-brown shadow-sm backdrop-blur-xs">
            {badgeText}
          </span>
        )}
      </div>

      {/* Right Info Column */}
      <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
        {/* Top Header & Specs */}
        <div className="flex flex-col gap-1">
          {/* Title & Bookmark Button */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[14px] font-medium text-primary-brown leading-tight">
              {item.title}
            </h3>
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <FavoriteButton
                initialIsFavourite={item.isFavourite}
                targetId={item.id}
                targetType="property"
                variant="icon-only"
                iconSize={13}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F8F4EE] hover:bg-[#EDE8E4] transition-colors"
              />
            </div>
          </div>

          {/* Price */}
          <p className="text-[12px] font-bold text-primary-brown leading-tight">
            {priceDisplay}
          </p>

          {/* Specs / Amenities */}
          <div className="flex items-center gap-2.5 sm:gap-3 pt-0.5">
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={Bathtub01Icon} size={13} className="text-primary-brown/70" />
              <span className="text-[10px] text-primary-brown/70">{baths}</span>
            </div>
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={BedDoubleIcon} size={13} className="text-primary-brown/70" />
              <span className="text-[10px] text-primary-brown/70">{beds}</span>
            </div>
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={Car01Icon} size={13} className="text-primary-brown/70" />
              <span className="text-[10px] text-primary-brown/70">{cars}</span>
            </div>
            <div className="flex items-center gap-1">
              <HugeiconsIcon icon={House01Icon} size={13} className="text-primary-brown/70" />
              <span className="text-[10px] text-primary-brown/70">{sqm}</span>
            </div>
          </div>
        </div>

        {/* Bottom Poster Row & Divider */}
        <div className="flex flex-col gap-1.5 pt-1.5">
          <div className="border-t border-[#EDE8E4] w-full" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="h-6 w-6 shrink-0 overflow-hidden rounded-full bg-[#F8F4EE]">
                <SafeImage
                  loading="lazy"
                  src={item.posterAvatar}
                  alt={item.posterName || "Sunrise"}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="truncate text-[12px] text-primary-brown">
                By {item.posterName || "Sunrise"}
              </span>
            </div>
            <ArrowRight
              size={12}
              className="shrink-0 text-primary-brown transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyListCard;
