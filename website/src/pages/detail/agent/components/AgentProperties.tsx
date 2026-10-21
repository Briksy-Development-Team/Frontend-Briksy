import { useState } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { SwiperSection } from "../../../../components/swiper";
import PropertyGridCard from "../../../../components/cards/property/PropertyGridCard";
import type { Property } from "../../../../types/property";
import defaultMapBanner from "../../../../assets/agent/agent_map.png";
import NearbySchools from "../../shared/NearbySchools";

export interface AgentPropertiesProps {
  agentName: string;
  homes: Property[];
  totalCount?: number;
  slug?: string | null;
  nearby?: boolean;
  showNearby?: boolean;
}


export function AgentProperties({
  agentName,
  homes,
  totalCount,
  slug,
  nearby = true,
  showNearby = true,
}: AgentPropertiesProps) {
  const [filter, setFilter] = useState<"sales" | "rentals" | "sold">("sales");

  const countDisplay = totalCount || homes.length;
  const displayNearby = nearby && showNearby;

  const toggleFilter = () => {
    setFilter((prev) => (prev === "sales" ? "rentals" : prev === "rentals" ? "sold" : "sales"));
  };

  return (
    <section className="flex flex-col gap-6 w-full" aria-labelledby="agent-properties-title">
      <h2
        id="agent-properties-title"
        className="text-[1.25rem] md:text-[1.375rem] font-medium text-[#222222]"
      >
        {agentName}'s properties
      </h2>

      {/* Map visual / banner */}
      <div className="relative w-full h-[280px] md:h-[350px] rounded-[1.5rem] overflow-hidden bg-[#E6E3DF] shadow-sm">
        <img
          src={defaultMapBanner}
          alt="Properties Map"
          className="w-full h-full object-cover"
        />

        {/* Filter button pill */}
        <div className="absolute top-4 left-4 z-10">
          <button
            type="button"
            onClick={toggleFilter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-sm text-[0.875rem] text-[#222222] font-medium shadow-sm border border-white hover:bg-white transition-colors cursor-pointer"
          >
            <MapPin size={14} className="text-[#8B6F54]" />
            <span className="capitalize">{filter}</span>
            <ChevronDown size={14} className="text-[#8B6F54]" />
          </button>
        </div>
      </div>

      {displayNearby && <NearbySchools />}

      {/* Properties Swiper Section */}
      <SwiperSection
        title={`Showing ${homes.length} of ${countDisplay} sold properties`}
        variant="detail"
        viewAllHref={slug ? `/result?type=property&organization_slug=${encodeURIComponent(slug)}` : undefined}
        viewAllText="View all properties"
        items={homes}
        spaceBetween={16}
        slideClassName="!w-[19.6667rem]"
        renderItem={(property) => <PropertyGridCard item={property} />}
      />
    </section>
  );
}

export default AgentProperties;