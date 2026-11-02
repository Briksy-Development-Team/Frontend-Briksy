import { Link } from "react-router-dom";
import { Star, ArrowRight } from "lucide-react";
import type { Builder } from "../../../types/builder";
import type { Trader } from "../../../types/trader";
import Approves from "../../../assets/logo/apprrove.svg";
import Mappin from "../../../assets/icons/location.svg";
import { SafeImage } from "../../custom/SafeImage";
import FavoriteButton from "../../custom/FavoriteButton";

export type OrganizationCardItem = (Builder | Trader) & {
  tagLine?: string;
  role?: string;
  category?: string;
  establishedYear?: number;
  profileType?: "builder" | "agent";
};

type Props = {
  item: OrganizationCardItem;
};

const BuilderListCard = ({ item }: Props) => {
  const isTrader = Boolean(item.role || item.category);
  const linkUrl = isTrader
    ? `/service/${item.id}`
    : `/${item.profileType === "agent" ? "agent" : "builder"}/${item.id}`;

  const favoriteType = isTrader ? "service" : "organization";
  const subtitle =
    item.role ||
    item.tagLine ||
    (item.profileType === "agent" ? "Real Estate Agent" : "Licensed Builder");

  const yearLabel = item.establishedYear ? `Since ${item.establishedYear}` : "Since 2016";
  const ratingValue = item.rating ? Number(item.rating).toFixed(1) : "4.7";
  const reviewsCount = item.reviews ? item.reviews.toLocaleString() : "789";

  return (
    <Link
      to={linkUrl}
      className="group flex flex-col justify-between rounded-2xl border border-[#EDE8E4] bg-white p-2.5 sm:p-3 text-primary-brown transition-all duration-200 hover:border-primary-brown hover:shadow-sm"
    >
      {/* Top Section */}
      <div className="flex items-start gap-3">
        {/* Avatar + Verified Badge */}
        <div className="relative shrink-0 flex flex-col items-center">
          <div className="h-[60px] w-[60px] overflow-hidden rounded-full border-2 border-white bg-[#F8F4EE]">
            <SafeImage
              loading="lazy"
              src={item.avatar}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          </div>
          <img
            loading="lazy"
            src={Approves}
            alt="Verified"
            className="absolute -bottom-2 left-1/2 h-6 w-6 -translate-x-1/2 drop-shadow-sm"
          />
        </div>

        {/* Info Column */}
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          {/* Title Row + Favorite Button */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="truncate text-[14px] font-medium text-primary-brown leading-5">
              {item.name}
            </h3>
            <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
              <FavoriteButton
                initialIsFavourite={item.isFavourite}
                targetId={item.id}
                targetType={favoriteType}
                variant="icon-only"
                iconSize={13}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#F8F4EE] hover:bg-[#EDE8E4] transition-colors"
              />
            </div>
          </div>

          {/* Subtitle / Role */}
          <p className="truncate text-[12px] text-primary-brown leading-4">
            {subtitle}
          </p>

          {/* Location */}
          <div className="flex items-center gap-1 text-[10px] sm:text-[11px] text-primary-brown/80 pt-0.5">
            <img loading="lazy" src={Mappin} alt="" className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{item.location || "Australia"}</span>
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {(item.tags && item.tags.length > 0 ? item.tags : ["Tag Line 2", "Tag Line 2"])
              .slice(0, 3)
              .map((tag, i) => (
                <span
                  key={`${tag}-${i}`}
                  className="rounded-md bg-[#EDE8E4] px-2 py-0.5 text-[10px] text-primary-brown whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-2 border-t border-[#EDE8E4] w-full" />

      {/* Bottom Row */}
      <div className="flex items-center justify-between px-1 text-[11px] text-primary-brown">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star size={12} fill="#FF8200" className="text-[#FF8200]" />
          <span className="font-medium text-[12px]">{ratingValue}</span>
          <span className="text-[10px] text-primary-brown/75">({reviewsCount})</span>
        </div>

        {/* Separator Dot */}
        <span className="text-[#E2CBB3] text-[12px]">·</span>

        {/* Year + Arrow */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-primary-brown">{yearLabel}</span>
          <ArrowRight
            size={12}
            className="text-primary-brown transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </div>
      </div>
    </Link>
  );
};

export default BuilderListCard;
