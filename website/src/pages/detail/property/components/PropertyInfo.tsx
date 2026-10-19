import { useState } from "react";
import { ShieldCheck, ListTree, Star } from "lucide-react";
import Approves from "../../../../assets/logo/apprrove.svg";
import { SafeImage } from "../../../../components/custom/SafeImage";
import NearbySchools from "../../shared/NearbySchools";

export const PropertyTitle = ({
  title,
  beds,
  baths,
  car,
  sqm,
  rating,
  ratingCount,
  reviewsCount,
  organizationName,
}: {
  title: string;
  beds?: string | number | null;
  baths?: string | number | null;
  car?: string | number | null;
  sqm?: string | number | null;
  rating?: number | null;
  ratingCount?: number | null;
  reviewsCount?: number | null;
  organizationName?: string | null;
}) => {
  const specs = [
    beds ? `${beds} Bed${Number(beds) === 1 ? "" : "s"}` : null,
    baths ? `${baths} Bath${Number(baths) === 1 ? "" : "s"}` : null,
    car ? `${car} Car` : null,
    sqm ? `${sqm} sqm` : null,
  ].filter(Boolean);

  return (
    <div className="flex flex-col gap-1 w-full">
      <h1 className="text-[24px] md:text-[30px] font-medium leading-[34px] md:leading-[38px] tracking-[-0.03em] text-[#342511]">
        {title}
      </h1>

      {specs.length > 0 && (
        <p className="text-[14px] font-medium leading-[20px] text-[#342511]/75">
          {specs.join(" \u00A0•\u00A0 ")}
        </p>
      )}

      {(rating || organizationName) && (
        <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[0.875rem] text-[#8C8370] font-medium">
          {rating ? (
            <div className="flex items-center gap-1 text-[#342511]">
              <Star
                className="text-[#F05537] fill-[#F05537] -mt-0.5"
                size={14}
              />
              <span className="font-semibold text-[#342511]">{rating}</span>
              <span className="text-[#8C8370] font-normal">
                ({ratingCount || reviewsCount || 0} reviews)
              </span>
            </div>
          ) : null}

          {rating && organizationName && <span className="mx-1 text-[#BF9F7D]">•</span>}

          {organizationName && (
            <span className="font-normal text-[#6B6560]">Listed by {organizationName}</span>
          )}
        </div>
      )}
    </div>
  );
};

export const PropertyAgentCard = ({ agent }: { agent: any }) => {
  if (!agent || !agent.name) return null;

  return (
    <div className="w-full bg-white rounded-xl p-3 sm:p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-[#EDE8E4] shadow-xs">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0">
          <SafeImage
            src={agent.avatar}
            className="w-12 h-12 rounded-full object-cover border border-[#EDE8E4]"
            alt={agent.name}
          />
          {agent.verified && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-[1px]">
              <img
                loading="lazy"
                src={Approves}
                alt="Verified"
                className="w-4 h-4 object-contain"
              />
            </div>
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <h4 className="text-[16px] font-bold text-[#342511] leading-tight truncate">
            {agent.name}
          </h4>
          <div className="flex items-center gap-1.5 text-[14px] text-[#342511]/80 font-normal mt-0.5">
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
          <ShieldCheck size={18} className="text-[#342511]" />
          <span>Verified [ Builder / Org. ]</span>
        </div>
      )}
    </div>
  );
};

export const PropertyAbout = ({ about }: { about?: string | null }) => {
  const [expanded, setExpanded] = useState(false);

  if (!about || !about.trim() || about.trim() === "No description provided.") {
    return null;
  }

  const isLong = about.length > 280;

  return (
    <div className="flex flex-col gap-3 w-full">
      <h2 className="text-[20px] font-medium leading-[28px] tracking-[-0.005em] text-[#222222]">
        About this property
      </h2>
      <p
        className={`text-[15px] font-normal leading-[26px] text-[#222222] whitespace-pre-line ${
          !expanded && isLong ? "line-clamp-4" : ""
        }`}
      >
        {about}
      </p>
      {isLong && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="w-fit text-[14px] font-medium text-[#222222] hover:opacity-75 transition-opacity flex items-center gap-1 mt-0.5 cursor-pointer"
        >
          {expanded ? "Show Less" : "Show More"}
        </button>
      )}
    </div>
  );
};

export const PropertyAmenities = ({ amenities }: { amenities?: any[] }) => {
  const [showAll, setShowAll] = useState(false);

  if (!amenities || amenities.length === 0) {
    return null;
  }

  const displayed = showAll ? amenities : amenities.slice(0, 12);

  return (
    <div className="flex flex-col gap-3.5 w-full">
      <h2 className="text-[20px] font-medium leading-[28px] tracking-[-0.005em] text-[#222222]">
        What this place offers
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3.5 gap-x-6">
        {displayed.map((item, idx) => (
          <div
            key={`${item.name}-${idx}`}
            className="flex items-center gap-2.5 text-[#000000] text-[14px] font-medium"
          >
            <ListTree size={16} className="text-[#342511] shrink-0" />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>

      {amenities.length > 12 && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-fit mt-1 px-4 py-2 rounded-lg border border-[#EDE8E4] bg-white text-[14px] font-medium text-[#222222] hover:bg-[#F8F4EE] transition-colors cursor-pointer"
        >
          {showAll ? "Show Less Amenities" : "Show All Amenities"}
        </button>
      )}
    </div>
  );
};

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
    <div className="flex flex-col gap-8 w-full">
      <div className="flex flex-col gap-3 w-full">
        <h2 className="text-[20px] font-medium leading-[28px] tracking-[-0.005em] text-[#222222]">
          Where you’ll be
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
