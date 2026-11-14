
import type { AiRecommendation } from "../../api/clients.api";
import type { Property } from "../../types/property";
import type { Trader } from "../../types/trader";

import PropertyListCard from "../cards/property/PropertyListCard";
import TraderListCard from "../cards/trader/TraderListCard";

import BusinessPlaceholder from "../../assets/place holder/bussinessholder.svg";
import ServicePlaceholder from "../../assets/place holder/serviceholder.svg";
import BuilderBackground from "../../assets/place holder/builderbg.svg";
import PropertyPlaceholder from "../../assets/place holder/propertyimages.svg";

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
  return {
    id: item.id,
    title: item.title || item.name || "Briksy property",
    address: (r.address as string) || location,
    location,
    image: (r.image as string) || (r.image_url as string) || PropertyPlaceholder,
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
    badge: (r.badge as string) || "Verified",
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

// ─── Gemini Details & Bullets Block ──────────────────────────────────────────

function RecommendationDetailsBlock({ item }: { item: AiRecommendation }) {
  const r = item as Record<string, unknown>;
  const isProp = item.type === "property";
  const isBld = isBuilder(item.category);

  // Summary description
  const summary = (r.description || r.summary) as string | undefined;

  // Key Drivers
  const keyDrivers =
    (r.keyDrivers || r.key_drivers) as string | undefined;

  // Highlights / Features / Services
  const highlights =
    (Array.isArray(r.highlights) ? r.highlights.join(" · ") : (r.highlights as string)) ||
    (Array.isArray(r.tags) && r.tags.length > 0 ? (r.tags as string[]).join(" · ") : undefined);

  // Best Suited For
  const bestSuited =
    (r.bestSuitedFor || r.best_suited_for) as string | undefined;

  const bullets = [
    { label: "Key Drivers", value: keyDrivers },
    { label: isProp ? "Highlights" : isBld ? "Specialisation" : "Core Services", value: highlights },
    { label: "Best Suited For", value: bestSuited },
  ].filter((bullet): bullet is { label: string; value: string } => Boolean(bullet.value));
  if (!summary && bullets.length === 0) return null;

  return (
    <div className="flex flex-col gap-2 px-1 pt-1 text-primary-brown">
      <p className="text-[13.5px] leading-relaxed text-primary-brown/90">{summary}</p>
      <ul className="flex flex-col gap-1.5 pt-0.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex items-start gap-2 text-[12.5px] sm:text-[13px] leading-5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-primary-brown/60" />
            <span className="min-w-0">
              <strong className="font-semibold text-primary-brown">{b.label}: </strong>
              <span className="text-primary-light-brown">{b.value}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function RecommendationSection({ items, visible, onNavigate }: Props) {
  if (!items?.length) return null;

  return (
    <section
      aria-label="Matched Recommendations"
      className={`mt-6 w-full min-w-0 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="mb-4 flex items-center gap-2 px-1">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-light-brown">
          Recommendations
        </span>
        <span className="rounded-full bg-primary-bleach/40 px-2 py-0.5 text-[11px] font-medium text-primary-brown">
          {items.length}
        </span>
      </div>

      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={`rec-${item.type}-${item.id}`} className="flex flex-col gap-2.5">
            <div className="w-full">
              {item.type === "property" ? (
                <div onClick={() => window.setTimeout(() => onNavigate?.(), 0)}><PropertyListCard item={toProperty(item)} /></div>
              ) : (
                <div onClick={() => window.setTimeout(() => onNavigate?.(), 0)}><TraderListCard item={toTrader(item)} /></div>
              )}
            </div>
            <RecommendationDetailsBlock item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
