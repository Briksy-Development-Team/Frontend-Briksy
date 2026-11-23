import { useState } from "react";
import {
  ChevronDown,
  ListTree,
  ShieldCheck,
} from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Bathtub01Icon,
  BedDoubleIcon,
  Car01Icon,
  Home03Icon,
  House01Icon,
  KitchenUtensilsIcon,
  MetroIcon,
  Sun03Icon,
} from "@hugeicons/core-free-icons";
import Approves from "../../../../assets/logo/apprrove.svg";
import { SafeImage } from "../../../../components/custom/SafeImage";
import NearbySchools from "../../shared/NearbySchools";

export type PropertyAgent = {
  name?: string | null;
  avatar?: string | null;
  verified?: string | null;
  role?: string | null;
  since?: number | null;
};

export type PropertyAmenity = {
  name: string;
  slug?: string;
  quantity?: number | string | null;
  value_type?: "boolean" | "number";
};

const formatSpecNumber = (
  val: string | number | null | undefined,
  fallback: string = "02",
) => {
  if (val == null || val === "" || val === "0") return fallback;
  if (val === "studio") return "00";
  const cleaned = String(val).replace("_plus", "+");
  return cleaned.length === 1 ? `0${cleaned}` : cleaned;
};

// ─── 1. PROPERTY HEADER (Status Tag + Title + Price + Inline Specs) ──────────
export interface PropertyHeaderProps {
  title: string;
  price?: string | null;
  statusLabel?: string | null;
  isAuction?: boolean;
  beds?: string | number | null;
  baths?: string | number | null;
  car?: string | number | null;
  sqm?: string | number | null;
  carpetArea?: number | null;
  carpetAreaUnit?: "sqm" | "sqft" | null;
  landArea?: number | null;
  landAreaUnit?: "sqm" | "sqft" | null;
  floorAreaUnit?: "sqm" | "sqft" | null;
  rating?: number | null;
  ratingCount?: number | null;
  reviewsCount?: number | null;
  organizationName?: string | null;
}

export const PropertyHeader = ({
  title,
  price,
  statusLabel,
  isAuction,
  baths,
  beds,
  car,
  sqm,
  floorAreaUnit,
}: PropertyHeaderProps) => {
  const displayStatus = statusLabel || (isAuction ? "AUCTION" : "FOR SALE");
  const bathsDisplay = formatSpecNumber(baths, "02");
  const bedsDisplay = formatSpecNumber(beds, "02");
  const carDisplay = formatSpecNumber(car, "02");
  const unitLabel = floorAreaUnit === "sqft" ? "ft²" : "m²";
  const sizeDisplay = sqm ? `${sqm}${unitLabel}` : "103m²";

  return (
    <div className="flex flex-col gap-2.5 w-full font-helvetica">
      {displayStatus && (
        <span className="inline-flex w-fit items-center px-3 py-1 rounded-full bg-primary-brown text-[#E7E7E4] text-[0.875rem] font-medium tracking-wide uppercase">
          {displayStatus}
        </span>
      )}

      <h1 className="text-[26px] sm:text-[1.875rem] font-medium leading-[34px] sm:leading-[36px] tracking-[-0.03em] text-primary-brown">
        {title}
      </h1>

      {price && (
        <p className="text-[20px] sm:text-[1.5rem] font-medium leading-[28px] sm:leading-[32px] tracking-[-0.006em] text-[#8B6F54]">
          {price}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-primary-brown">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Bathtub01Icon} size={20} className="text-primary-brown shrink-0" />
          <span className="text-[14px] sm:text-[0.9375rem] leading-tight">
            <strong className="font-bold">{bathsDisplay}</strong> Bathrooms
          </span>
        </div>

        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={BedDoubleIcon} size={20} className="text-primary-brown shrink-0" />
          <span className="text-[14px] sm:text-[0.9375rem] leading-tight">
            <strong className="font-bold">{bedsDisplay}</strong> Beds
          </span>
        </div>

        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={Car01Icon} size={20} className="text-primary-brown shrink-0" />
          <span className="text-[14px] sm:text-[0.9375rem] leading-tight">
            <strong className="font-bold">{carDisplay}</strong> Parking space
          </span>
        </div>

        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={House01Icon} size={20} className="text-primary-brown shrink-0" />
          <span className="text-[14px] sm:text-[0.9375rem] leading-tight">
            <strong className="font-bold">{sizeDisplay}</strong> Area
          </span>
        </div>
      </div>
    </div>
  );
};

export const PropertyTitle = PropertyHeader;

// ─── 2. BRIKSY QUICK VIEW ───────────────────────────────────────────────────
export interface QuickViewItem {
  icon?: React.ReactNode;
  title: string;
  description: string;
}

const DEFAULT_QUICK_VIEW: QuickViewItem[] = [
  {
    title: "Family-friendly layout",
    description: "Functional space for modern families",
  },
  {
    title: "Renovated kitchen",
    description: "Modern finishes and quality appliances",
  },
  {
    title: "Walk to transport",
    description: "Easy access to shops and transport",
  },
  {
    title: "North-facing backyard",
    description: "Bright outdoor entertaining space",
  },
];

export const BriksyQuickView = ({
  items = DEFAULT_QUICK_VIEW,
}: {
  items?: QuickViewItem[];
}) => {
  const defaultIcons = [
    <HugeiconsIcon icon={Home03Icon} size={24} className="text-primary-light-brown shrink-0" />,
    <HugeiconsIcon icon={KitchenUtensilsIcon} size={24} className="text-primary-light-brown shrink-0" />,
    <HugeiconsIcon icon={MetroIcon} size={24} className="text-primary-light-brown shrink-0" />,
    <HugeiconsIcon icon={Sun03Icon} size={24} className="text-primary-light-brown shrink-0" />,
  ];

  return (
    <div className="flex flex-col gap-1.5 w-full font-helvetica">
      <h2 className="px-1.5 text-[18px] sm:text-[1.25rem] font-medium leading-[28px] tracking-[-0.005em] text-[#222222]">
        Briksy Quick View
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-1.5 w-full">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[12px] p-4 flex items-start gap-2.5"
          >
            <div className="shrink-0 text-primary-light-brown">
              {item.icon || defaultIcons[idx % defaultIcons.length]}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[0.875rem] font-medium leading-[20px] text-primary-brown">
                {item.title}
              </span>
              <span className="text-[0.875rem] font-normal leading-[20px] tracking-[0.03em] text-primary-light-brown">
                {item.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── 3. ABOUT THIS PROPERTY ─────────────────────────────────────────────────
const DEFAULT_ABOUT =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.\n\nCurabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh. Mauris sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat turpis sed lacinia. Nam eget mi in purus lobortis eleifend. Sed nec ante dictum sem condimentum ullamcorper quis venenatis nisi. Proin vitae facilisis nisi, ac posuere leo.";

export interface PropertyAboutAndSpecsProps {
  about?: string | null;
}

export const PropertyAboutAndSpecs = ({
  about,
}: PropertyAboutAndSpecsProps) => {
  const [expanded, setExpanded] = useState(false);
  const text =
    about && about.trim() && about.trim() !== "No description provided."
      ? about
      : DEFAULT_ABOUT;

  return (
    <div className="flex flex-col gap-2.5 w-full font-helvetica">
      <h2 className="text-[18px] sm:text-[1.25rem] font-medium leading-[28px] text-primary-brown">
        About this property
      </h2>
      <p
        className={`text-[14.5px] sm:text-[0.875rem] font-normal leading-[24px] sm:leading-[26px] text-primary-brown/90 whitespace-pre-line ${!expanded ? "line-clamp-6" : ""
          }`}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-fit flex items-center gap-1.5 text-[14px] font-medium text-[#8B6F54] hover:opacity-80 transition cursor-pointer mt-1"
      >
        <span>{expanded ? "read less" : "read more"}</span>
        <ChevronDown
          size={16}
          className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""
            }`}
        />
      </button>
    </div>
  );
};

export const PropertyAbout = ({ about }: { about?: string | null }) => {
  return <PropertyAboutAndSpecs about={about} />;
};

export const PropertyAmenities = ({
  amenities,
}: {
  amenities?: PropertyAmenity[];
}) => {
  const items = (amenities ?? [])
    .filter((item) => item.quantity == null || Number(item.quantity) > 0)
    .map((a) => a.name);

  if (!items.length) return null;

  return (
    <div className="flex flex-col gap-3 w-full font-helvetica">
      <h2 className="text-[18px] sm:text-[1.25rem] font-medium leading-[28px] text-primary-brown">
        Property Features
      </h2>

      <div className="flex flex-wrap gap-2.5 sm:gap-3">
        {items.map((name, idx) => (
          <div
            key={`${name}-${idx}`}
            className="bg-white border border-white-100 rounded-xl px-3.5 py-2 flex items-center gap-2 text-[13.5px] sm:text-[0.875rem] text-primary-brown shadow-2xs"
          >
            <ListTree size={16} className="text-primary-brown shrink-0" />
            <span>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── 5. AGENT CARD (Mobile Fallback) ────────────────────────────────────────
export const PropertyAgentCard = ({
  agent,
}: {
  agent: PropertyAgent | null;
}) => {
  if (!agent || !agent.name) return null;

  return (
    <div className="w-full bg-white rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#EDE8E4] shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0 flex flex-col items-center">
          <SafeImage
            src={agent.avatar ?? undefined}
            className="w-12 h-12 rounded-full object-cover border border-[#EDE8E4]"
            alt={agent.name}
          />
          {agent.verified && (
            <img
              loading="lazy"
              src={Approves}
              alt="Verified"
              className="absolute -bottom-1 -right-1 w-4 h-4 object-contain drop-shadow-2xs"
            />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-[16px] font-bold text-primary-brown leading-tight truncate">
            {agent.name}
          </h4>
          <div className="flex items-center gap-1.5 text-[14px] text-primary-brown font-normal mt-0.5">
            <span>{agent.role || "Property Management"}</span>
            {agent.since && (
              <>
                <span className="text-[#BF9F7D] font-medium">•</span>
                <span>Since {agent.since}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {agent.verified && (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EDE8E4] text-[#342511] text-[13px] font-medium shrink-0 self-start sm:self-auto">
          <ShieldCheck size={18} className="text-primary-brown" />
          <span>Verified [ Builder / Org. ]</span>
        </div>
      )}
    </div>
  );
};

// ─── 6. WHERE YOU'LL BE (Map + Nearby) ──────────────────────────────────────
export interface PropertyMapProps {
  mapSrc?: string | null;
  nearby?: boolean;
  showNearby?: boolean;
}

export const PropertyMap = ({
  mapSrc,
  nearby = true,
  showNearby = true,
}: PropertyMapProps) => {
  if (!mapSrc) return null;

  const displayNearby = nearby && showNearby;

  return (
    <div className="flex flex-col gap-8 w-full font-helvetica">
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-[18px] sm:text-[1.25rem] font-medium leading-[28px] text-primary-brown">
          Location & Nearby
        </h2>
        <div className="w-full h-[280px] sm:h-[321px] rounded-xl overflow-hidden border border-[#EDE8E4] bg-[#F8F4EE]">
          <iframe
            title="Property location map"
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      {displayNearby && <NearbySchools />}
    </div>
  );
};
