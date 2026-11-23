
import type { AiRecommendation } from "../../api/clients.api";
import type { Property } from "../../types/property";
import type { Trader } from "../../types/trader";
import type { Builder } from "../../types/builder";

import SwiperScroll from "../swiper/SwiperScroll";
import PropertyGridCard from "../cards/property/PropertyGridCard";
import BuilderGridCard from "../cards/builder/BuilderGridCard";
import TraderListCard from "../cards/trader/TraderListCard";

import BusinessPlaceholder from "../../assets/place holder/bussinessholder.svg";
import ServicePlaceholder from "../../assets/place holder/serviceholder.svg";
import BuilderBackground from "../../assets/place holder/builderbg.svg";
import PropertyPlaceholder from "../../assets/place holder/propertyimages.svg";
import { resolveMediaUrl } from "../../utils/mediaUrl";

interface Props {
  items: AiRecommendation[];
  visible: boolean;
  onNavigate?: () => void;
}

const isBuilder = (cat = "", role = "") =>
  /builder|architect|developer|agency|agent/i.test(`${cat} ${role}`);

const loc = (item: AiRecommendation, raw: Record<string, unknown>) =>
  [item.suburb, item.state].filter(Boolean).join(", ") || (raw.location as string) || "Australia";

const countValue = (value: unknown) => typeof value === "string" ? (value === "studio" ? 0 : Number(value.replace("_plus", "")) || undefined) : typeof value === "number" ? value : undefined;

function toProperty(item: AiRecommendation): Property {
  const r = item as Record<string, unknown>;
  const location = loc(item, r);
  const mediaList = Array.isArray(r.media)
    ? (r.media as Array<{ url?: string; is_primary?: boolean }>)
    : Array.isArray(r.images)
    ? (r.images as Array<{ url?: string; is_primary?: boolean }>)
    : [];
  const primaryMedia = (mediaList.find((m) => (m as { is_primary?: boolean })?.is_primary) as { url?: string })?.url || mediaList[0]?.url;
  const rawImage = (r.image as string) || (r.image_url as string) || primaryMedia;
  return {
    id: item.id,
    title: item.title || item.name || "Briksy property",
    address: (r.address as string) || location,
    location,
    image: (rawImage ? resolveMediaUrl(rawImage) : null) || PropertyPlaceholder,
    price: item.price == null ? undefined : Number(item.price),
    pricingType: (r.pricingType ?? r.pricing_type) as Property["pricingType"],
    priceMin: (r.priceMin ?? r.price_min) as number | null,
    priceMax: (r.priceMax ?? r.price_max) as number | null,
    beds: countValue(r.beds),
    baths: countValue(r.baths),
    cars: countValue(r.cars),
    sqm: r.sqm as number | undefined,
    areaUnit: (r.floor_area_unit as Property["areaUnit"]) ?? "sqm",
    carpetArea: (r.carpet_area as number) ?? null,
    carpetAreaUnit: (r.carpet_area_unit as Property["carpetAreaUnit"]) ?? "sqm",
    amenities: Array.isArray(r.amenities) ? r.amenities as Property["amenities"] : [],
    posterName: item.organization || (r.posterName as string) || "Briksy Member",
    posterAvatar: (r.posterAvatar as string) || (r.avatar as string) || BusinessPlaceholder,
    badge: (r.badge as string) || "For sale",
    purpose: r.purpose as Property["purpose"],
    transactionStatus: (r.transactionStatus as Property["transactionStatus"]) ?? "BUY",
    isAuction: Boolean(r.isAuction ?? r.is_auction),
    propertyCategory: item.category || null,
    propertyType: (r.propertyType as string) || item.category || "Residential",
    lat: (r.lat as number) ?? 0,
    lng: (r.lng as number) ?? 0,
    isFavourite: Boolean(r.isFavourite),
  };
}

function toBuilder(item: AiRecommendation): Builder {
  const r = item as Record<string, unknown>;
  return {
    id: item.id,
    name: item.name || item.title || "Briksy Builder",
    location: loc(item, r),
    avatar: (r.avatar as string) || (r.logo_url as string) || BusinessPlaceholder,
    bannerImage: (r.bannerImage as string) || (r.banner_url as string) || BuilderBackground,
    rating: Number(r.rating) || 4.9,
    reviews: Number(r.reviews) || 24,
    tags: Array.isArray(r.tags) && r.tags.length > 0 ? (r.tags as string[]) : [item.category || "Builder", "Verified"],
    establishedYear: Number(r.establishedYear || r.established_year) || 2018,
    isFavourite: Boolean(r.isFavourite),
    favoriteId: String(item.id),
    profileType: "builder",
  };
}

function toTrader(item: AiRecommendation): Trader {
  const r = item as Record<string, unknown>;
  return {
    id: item.id,
    name: item.name || item.title || "Professional",
    tagLine: (r.tagLine as string) || item.category || "Verified Service Professional",
    role: (r.role as string) || item.category || "Professional",
    location: loc(item, r),
    avatar: (r.avatar as string) || (r.logo_url as string) || ServicePlaceholder,
    bannerImage: (r.bannerImage as string) || (r.banner_url as string) || BuilderBackground,
    rating: Number(r.rating) || 4.8,
    reviews: Number(r.reviews) || 18,
    tags: Array.isArray(r.tags) && r.tags.length > 0 ? (r.tags as string[]) : [item.category || "Services", "Verified"],
    isFavourite: Boolean(r.isFavourite),
    favoriteId: String(item.id),
    category: item.category,
  };
}

export default function RecommendationSection({ items, visible, onNavigate }: Props) {
  if (!items?.length) return null;

  const isTraderOrPro = (it: AiRecommendation) =>
    it.type !== "property" && !isBuilder(it.category, (it as Record<string, unknown>).role as string);

  const gridItems = items.filter((it) => !isTraderOrPro(it));
  const listItems = items.filter(isTraderOrPro);

  return (
    <section
      aria-label="Matched Recommendations"
      className={`mt-4 w-full min-w-0 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      {gridItems.length > 0 && (
        <div className="w-full min-w-0">
          <SwiperScroll
            items={gridItems}
            spaceBetween={14}
            slideClassName="!w-[19.6667rem] shrink-0"
            className="w-full !ml-0 py-1"
            renderItem={(item) => (
              <div
                key={`rec-${item.type}-${item.id}`}
                onClick={() => window.setTimeout(() => onNavigate?.(), 0)}
              >
                {item.type === "property" ? (
                  <PropertyGridCard item={toProperty(item)} />
                ) : (
                  <BuilderGridCard item={toBuilder(item)} />
                )}
              </div>
            )}
          />
        </div>
      )}

      {listItems.length > 0 && (
        <div className={`flex flex-col gap-3 w-full ${gridItems.length > 0 ? "mt-3.5" : ""}`}>
          {listItems.map((item) => (
            <div key={`rec-${item.type}-${item.id}`} onClick={() => window.setTimeout(() => onNavigate?.(), 0)}>
              <TraderListCard item={toTrader(item)} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
