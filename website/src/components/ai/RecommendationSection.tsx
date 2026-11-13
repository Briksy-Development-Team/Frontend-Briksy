/**
 * RecommendationSection.tsx — contextual inline recommendation cards per AI response.
 *
 * Implements the Gemini layout:
 *   • Briksy ListCard on top (PropertyListCard, TraderListCard, BuilderListCard)
 *   • Description in short/medium details directly below each card
 *   • Structured bullet highlights: Key Drivers, Highlights / Specialisation, Best Suited For
 */
import type { AiRecommendation } from "../../api/clients.api";
import type { Property } from "../../types/property";
import type { Trader } from "../../types/trader";
import type { Builder } from "../../types/builder";

import PropertyListCard from "../cards/property/PropertyListCard";
import TraderListCard from "../cards/trader/TraderListCard";
import BuilderListCard from "../cards/builder/BuilderListCard";

import BusinessPlaceholder from "../../assets/place holder/bussinessholder.svg";
import ServicePlaceholder from "../../assets/place holder/serviceholder.svg";
import BuilderBackground from "../../assets/place holder/builderbg.svg";
import PropertyPlaceholder from "../../assets/place holder/propertyimages.svg";

interface Props {
  items: AiRecommendation[];
  visible: boolean;
}

const isBuilder = (cat = "", role = "") =>
  /builder|architect|developer|agency|agent/i.test(`${cat} ${role}`);

const loc = (item: AiRecommendation, raw: Record<string, unknown>) =>
  [item.suburb, item.state].filter(Boolean).join(", ") || (raw.location as string) || "Australia";

function toProperty(item: AiRecommendation): Property {
  const r = item as Record<string, unknown>;
  const location = loc(item, r);
  return {
    id: item.id,
    title: item.title || item.name || `Property in ${location}`,
    address: (r.address as string) || location,
    location,
    image: (r.image as string) || (r.image_url as string) || PropertyPlaceholder,
    price: Number(item.price) || 0,
    pricingType: (r.pricingType as Property["pricingType"]) ?? "fixed",
    priceMin: (r.priceMin as number) ?? null,
    priceMax: (r.priceMax as number) ?? null,
    beds: (r.beds as number) ?? 2,
    baths: (r.baths as number) ?? 2,
    cars: (r.cars as number) ?? 1,
    sqm: (r.sqm as number) ?? 120,
    posterName: item.organization || (r.posterName as string) || "Briksy Member",
    posterAvatar: (r.posterAvatar as string) || (r.avatar as string) || BusinessPlaceholder,
    badge: (r.badge as string) || "Verified",
    purpose: (r.purpose as Property["purpose"]) ?? "SELL",
    transactionStatus: (r.transactionStatus as Property["transactionStatus"]) ?? "BUY",
    isAuction: Boolean(r.isAuction),
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

function toBuilder(item: AiRecommendation): Builder {
  const r = item as Record<string, unknown>;
  const isAgent = (item.category ?? "").toLowerCase().includes("agent") || r.profileType === "agent";
  return {
    id: item.id,
    name: item.name || item.title || "Briksy Partner",
    location: loc(item, r),
    avatar: (r.avatar as string) || (r.logo_url as string) || BusinessPlaceholder,
    bannerImage: (r.bannerImage as string) || (r.banner_url as string) || BuilderBackground,
    rating: Number(r.rating) || 4.9,
    reviews: Number(r.reviews) || 28,
    tags: Array.isArray(r.tags) && r.tags.length > 0 ? (r.tags as string[]) : [item.category || "Builder", "Licensed"],
    establishedYear: (r.establishedYear as number) || 2018,
    isFavourite: Boolean(r.isFavourite),
    favoriteId: String(item.id),
    profileType: isAgent ? "agent" : "builder",
  };
}

// ─── Gemini Details & Bullets Block ──────────────────────────────────────────

function RecommendationDetailsBlock({ item }: { item: AiRecommendation }) {
  const r = item as Record<string, unknown>;
  const location = loc(item, r);
  const isProp = item.type === "property";
  const isBld = isBuilder(item.category);

  // Summary description
  const summary =
    ((r.summary || r.description) as string) ||
    (isProp
      ? `${item.title || "This property"} is located in ${location}, offering a sought-after residential opportunity with quality construction and convenient access to local infrastructure.`
      : `${item.name || "This professional"} provides verified ${item.category || "property"} services in ${location}, known for dependable project delivery and licensed standards.`);

  // Key Drivers
  const keyDrivers =
    ((r.keyDrivers || r.key_drivers) as string) ||
    (isProp
      ? `Strong local demand in ${item.suburb || "the area"}, established neighbourhood amenities, and ongoing value retention.`
      : "Verified structural licensing, end-to-end site management, and dependable project timelines.");

  // Highlights / Features / Services
  const highlights =
    (Array.isArray(r.highlights) ? r.highlights.join(" · ") : (r.highlights as string)) ||
    (isProp
      ? `${r.beds ?? 2} Bed · ${r.baths ?? 2} Bath · ${r.cars ?? 1} Car Space · ${r.sqm ? `${r.sqm}m² layout` : "Spacious floor plan"}`
      : Array.isArray(r.tags) && r.tags.length > 0
      ? (r.tags as string[]).join(" · ")
      : isBld
      ? "Custom residential homes, extensions, and modern builds."
      : `${item.category || "Specialist trade"} maintenance, repairs, and installations.`);

  // Best Suited For
  const bestSuited =
    ((r.bestSuitedFor || r.best_suited_for) as string) ||
    (isProp
      ? "Buyers seeking long-term capital appreciation, prime connectivity, and verified property quality."
      : "Homeowners and investors seeking vetted, licensed professionals for reliable project execution.");

  const bullets = [
    { label: "Key Drivers", value: keyDrivers },
    { label: isProp ? "Highlights" : isBld ? "Specialisation" : "Core Services", value: highlights },
    { label: "Best Suited For", value: bestSuited },
  ];

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

export default function RecommendationSection({ items, visible }: Props) {
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
                <PropertyListCard item={toProperty(item)} />
              ) : isBuilder(item.category) ? (
                <BuilderListCard item={toBuilder(item)} />
              ) : (
                <TraderListCard item={toTrader(item)} />
              )}
            </div>
            <RecommendationDetailsBlock item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
