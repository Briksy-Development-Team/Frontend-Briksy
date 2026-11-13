/**
 * RecommendationSection.tsx — contextual inline recommendation cards per AI response.
 *
 * Implements the Gemini layout:
 *   • Card on top (Briksy's native ListCards: PropertyListCard, TraderListCard, BuilderListCard)
 *   • Directly below each card: description in short to medium details + structured bullet highlights
 *   • Natural vertical flow down the conversation (no Swiper, no nested scroll traps)
 */
import type { AiRecommendation } from "../../api/clients.api";
import type { Property } from "../../types/property";
import type { Trader } from "../../types/trader";
import type { Builder } from "../../types/builder";

// Real Briksy ListCard components
import PropertyListCard from "../cards/property/PropertyListCard";
import TraderListCard from "../cards/trader/TraderListCard";
import BuilderListCard from "../cards/builder/BuilderListCard";

// Briksy fallback placeholder assets
import BusinessPlaceholder from "../../assets/place holder/bussinessholder.svg";
import ServicePlaceholder from "../../assets/place holder/serviceholder.svg";
import BuilderBackground from "../../assets/place holder/builderbg.svg";
import PropertyPlaceholder from "../../assets/place holder/propertyimages.svg";

interface Props {
  items: AiRecommendation[];
  /** Delayed entrance animation flag */
  visible: boolean;
}

// ─── Type Converters & Classifiers ────────────────────────────────────────────

function isBuilderCategory(category?: string, role?: string): boolean {
  const combined = `${category ?? ""} ${role ?? ""}`.toLowerCase();
  return (
    combined.includes("builder") ||
    combined.includes("architect") ||
    combined.includes("developer") ||
    combined.includes("agency") ||
    combined.includes("agent")
  );
}

function toProperty(item: AiRecommendation): Property {
  const raw = item as Record<string, unknown>;
  const locationStr =
    [item.suburb, item.state].filter(Boolean).join(", ") ||
    (raw.location as string) ||
    "Australia";

  return {
    id: item.id,
    title: item.title || item.name || `Property in ${locationStr}`,
    address: (raw.address as string) || (raw.full_address as string) || locationStr,
    location: locationStr,
    image: (raw.image as string) || (raw.image_url as string) || PropertyPlaceholder,
    price: typeof item.price === "number" ? item.price : Number(item.price) || 0,
    pricingType: (raw.pricingType as Property["pricingType"]) ?? "fixed",
    priceMin: (raw.priceMin as number) ?? null,
    priceMax: (raw.priceMax as number) ?? null,
    beds: (raw.beds as number) ?? 2,
    baths: (raw.baths as number) ?? 2,
    cars: (raw.cars as number) ?? 1,
    sqm: (raw.sqm as number) ?? 120,
    posterName: item.organization || (raw.posterName as string) || "Briksy Member",
    posterAvatar: (raw.posterAvatar as string) || (raw.avatar as string) || BusinessPlaceholder,
    badge: (raw.badge as string) || "Verified",
    purpose: (raw.purpose as Property["purpose"]) ?? "SELL",
    transactionStatus: (raw.transactionStatus as Property["transactionStatus"]) ?? "BUY",
    isAuction: Boolean(raw.isAuction),
    propertyCategory: item.category || null,
    propertyType: (raw.propertyType as string) || item.category || "Residential",
    lat: (raw.lat as number) ?? 0,
    lng: (raw.lng as number) ?? 0,
    isFavourite: Boolean(raw.isFavourite),
  };
}

function toTrader(item: AiRecommendation): Trader {
  const raw = item as Record<string, unknown>;
  const locationStr =
    [item.suburb, item.state].filter(Boolean).join(", ") ||
    (raw.location as string) ||
    "Australia";

  return {
    id: item.id,
    name: item.name || item.title || "Professional",
    tagLine: (raw.tagLine as string) || item.category || "Verified Service Professional",
    role: (raw.role as string) || item.category || "Professional",
    location: locationStr,
    avatar: (raw.avatar as string) || (raw.logo_url as string) || ServicePlaceholder,
    bannerImage: (raw.bannerImage as string) || (raw.banner_url as string) || BuilderBackground,
    rating: raw.rating ? Number(raw.rating) : 4.8,
    reviews: raw.reviews ? Number(raw.reviews) : 18,
    tags: Array.isArray(raw.tags) && raw.tags.length > 0 ? (raw.tags as string[]) : [item.category || "Services", "Verified"],
    isFavourite: Boolean(raw.isFavourite),
    favoriteId: String(item.id),
    category: item.category,
  };
}

function toBuilder(item: AiRecommendation): Builder {
  const raw = item as Record<string, unknown>;
  const locationStr =
    [item.suburb, item.state].filter(Boolean).join(", ") ||
    (raw.location as string) ||
    "Australia";

  const isAgent = (item.category ?? "").toLowerCase().includes("agent") || raw.profileType === "agent";

  return {
    id: item.id,
    name: item.name || item.title || "Briksy Partner",
    location: locationStr,
    avatar: (raw.avatar as string) || (raw.logo_url as string) || BusinessPlaceholder,
    bannerImage: (raw.bannerImage as string) || (raw.banner_url as string) || BuilderBackground,
    rating: raw.rating ? Number(raw.rating) : 4.9,
    reviews: raw.reviews ? Number(raw.reviews) : 28,
    tags: Array.isArray(raw.tags) && raw.tags.length > 0 ? (raw.tags as string[]) : [item.category || "Builder", "Licensed"],
    establishedYear: (raw.establishedYear as number) || 2018,
    isFavourite: Boolean(raw.isFavourite),
    favoriteId: String(item.id),
    profileType: isAgent ? "agent" : "builder",
  };
}

// ─── Gemini-Style Short to Medium Details ──────────────────────────────────────

interface DetailRow {
  label: string;
  value: string;
}

interface ItemDetails {
  summary: string;
  details: DetailRow[];
}

function getRecommendationDetails(item: AiRecommendation): ItemDetails {
  const raw = item as Record<string, unknown>;
  const locationStr =
    [item.suburb, item.state].filter(Boolean).join(", ") ||
    (raw.location as string) ||
    "the local area";

  if (item.type === "property") {
    const summary =
      (raw.description as string) ||
      (raw.summary as string) ||
      `${item.title || "This property"} is located in ${locationStr}, offering a sought-after residential opportunity with quality construction and convenient access to local infrastructure.`;

    const details: DetailRow[] = [
      {
        label: "Key Drivers",
        value:
          (raw.key_drivers as string) ||
          (raw.keyDrivers as string) ||
          `Strong local demand in ${item.suburb || "the area"}, established neighbourhood amenities, and ongoing value retention.`,
      },
      {
        label: "Highlights",
        value:
          Array.isArray(raw.highlights)
            ? raw.highlights.join(" · ")
            : `${raw.beds ?? 2} Bed · ${raw.baths ?? 2} Bath · ${raw.cars ?? 1} Car Space · ${raw.sqm ? `${raw.sqm}m² floor plan` : "Spacious layout"}`,
      },
      {
        label: "Best Suited For",
        value:
          (raw.best_suited_for as string) ||
          (raw.bestSuitedFor as string) ||
          "Buyers seeking long-term capital appreciation, prime connectivity, and verified property quality.",
      },
    ];

    return { summary, details };
  }

  // Builder
  if (isBuilderCategory(item.category)) {
    const summary =
      (raw.description as string) ||
      (raw.summary as string) ||
      `${item.name} is a licensed builder and construction practitioner servicing ${locationStr}, known for quality craftsmanship and structured project delivery.`;

    const details: DetailRow[] = [
      {
        label: "Key Drivers",
        value: "Verified structural licensing, end-to-end site management, and dependable timelines.",
      },
      {
        label: "Specialisation",
        value: Array.isArray(raw.tags) && raw.tags.length > 0 ? (raw.tags as string[]).join(" · ") : "Custom residential homes, extensions, and modern builds.",
      },
      {
        label: "Best Suited For",
        value: "Homeowners and developers seeking vetted building partners for reliable project execution.",
      },
    ];

    return { summary, details };
  }

  // Trades & Services
  const summary =
    (raw.description as string) ||
    (raw.summary as string) ||
    `${item.name} provides certified ${item.category || "property"} services in ${locationStr}, consistently rated for fast turnaround and verified trade standards.`;

  const details: DetailRow[] = [
    {
      label: "Core Services",
      value: Array.isArray(raw.tags) && raw.tags.length > 0 ? (raw.tags as string[]).join(" · ") : `${item.category || "Specialist trade"} maintenance and installations.`,
    },
    {
      label: "Track Record",
      value: `${raw.rating ? `${raw.rating}★ rating` : "Top-rated"} with verified customer reviews and licensed credentials.`,
    },
    {
      label: "Best Suited For",
      value: "Homeowners requiring verified local trades for maintenance, emergency repairs, and property upgrades.",
    },
  ];

  return { summary, details };
}

// ─── Render item helper ───────────────────────────────────────────────────────

function renderCard(item: AiRecommendation) {
  if (item.type === "property") {
    return <PropertyListCard item={toProperty(item)} />;
  }
  if (isBuilderCategory(item.category)) {
    return <BuilderListCard item={toBuilder(item)} />;
  }
  return <TraderListCard item={toTrader(item)} />;
}

// ─── Gemini Details Block Component ───────────────────────────────────────────

function RecommendationDetailsBlock({ item }: { item: AiRecommendation }) {
  const { summary, details } = getRecommendationDetails(item);

  return (
    <div className="flex flex-col gap-2 px-1 pt-1 text-primary-brown">
      {summary && (
        <p className="text-[13.5px] sm:text-[14px] leading-relaxed text-primary-brown/90">
          {summary}
        </p>
      )}

      {details.length > 0 && (
        <ul className="flex flex-col gap-1.5 pt-0.5">
          {details.map((d, i) => (
            <li key={i} className="flex items-start gap-2 text-[12.5px] sm:text-[13px] leading-5">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full border border-primary-brown/50 bg-transparent" />
              <span className="min-w-0">
                <strong className="font-semibold text-primary-brown">{d.label}: </strong>
                <span className="text-primary-light-brown">{d.value}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Main Recommendation Section ──────────────────────────────────────────────

export default function RecommendationSection({ items, visible }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <section
      aria-label="Matched Recommendations"
      className={`mt-6 w-full min-w-0 transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      {/* Header bar */}
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-light-brown">
            Recommendations
          </span>
          <span className="rounded-full bg-primary-bleach/40 px-2 py-0.5 text-[11px] font-medium text-primary-brown">
            {items.length}
          </span>
        </div>
      </div>

      {/* Gemini-style natural flow: Card on top, short/medium details and bullets below */}
      <div className="flex flex-col gap-6">
        {items.map((item) => (
          <div key={`rec-${item.type}-${item.id}`} className="flex flex-col gap-2.5">
            {/* The Briksy Card */}
            <div className="w-full">
              {renderCard(item)}
            </div>

            {/* Description & Structured Bullet Details below the card */}
            <RecommendationDetailsBlock item={item} />
          </div>
        ))}
      </div>
    </section>
  );
}
