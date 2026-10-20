import { Link } from "react-router-dom";
import SwiperScroll from "../../../../components/swiper/SwiperScroll";
import PropertyGridCard from "../../../../components/cards/property/PropertyGridCard";
import type { Property } from "../../../../types/property";

export interface AgentPropertiesProps {
  agentName: string;
  homes: Property[];
  totalCount?: number;
  slug?: string | null;
}

/**
 * Agent's Properties section with map banner and horizontal properties carousel.
 * Pure presentation: receives homes data from AgentDetail.
 */
export function AgentProperties({
  agentName,
  homes,
  totalCount,
  slug,
}: AgentPropertiesProps) {
  const countDisplay = totalCount || homes.length;

  return (
    <section className="flex flex-col gap-6 w-full" aria-labelledby="agent-properties-title">
      <h2
        id="agent-properties-title"
        className="text-[1.25rem] md:text-[1.375rem] font-medium text-[#222222]"
      >
        {agentName}'s properties
      </h2>

      {/* Counter text */}
      <div className="flex items-center justify-between">
        <p className="text-[0.875rem] text-black">
          Showing {homes.length} of {countDisplay} sold properties
        </p>
        {slug && (
          <Link
            to={`/result?type=property&organization_slug=${encodeURIComponent(slug)}`}
            className="text-[0.875rem] font-medium text-[#8B6F54] hover:text-[#342511] transition-colors"
          >
            View all properties ↗
          </Link>
        )}
      </div>

      {homes.length > 0 ? (
        <div className="w-full">
          <SwiperScroll
            items={homes}
            spaceBetween={16}
            slideClassName="!w-[19.6667rem]"
            className="!ml-0"
            renderItem={(property) => <PropertyGridCard item={property} />}
          />
        </div>
      ) : (
        <p className="rounded-xl bg-white px-5 py-6 text-sm text-[#7C5F42]">
          No properties listed by this agent.
        </p>
      )}
    </section>
  );
}

export default AgentProperties;
