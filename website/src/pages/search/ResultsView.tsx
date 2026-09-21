import type { ResultType } from "../../types/search";
import { useEffect, useState } from "react";
import { useResultSearchParams } from "./useResultSearchParams";
import { getOrganizations, type PublicOrganization } from "../../api/seeker/organization.api";
import { getProperties, type PublicProperty } from "../../api/property/property.api";
import { organizationToBuilder, organizationToTrader, propertyToCard } from "../../api/public.mappers";
import TraderGridCard from "../../components/cards/trader/TraderGridCard";
import BuilderGridCard from "../../components/cards/builder/BuilderGridCard";
import PropertyGridCard from "../../components/cards/property/PropertyGridCard";
import { propertyQueryToParams } from "../../api/property/propertySearch";
import MapSplitView from "./MapSplitView";
import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";

const organizationTypeForResult = (resultType: ResultType, tab?: string | null) => {
  if (resultType === "builder" && tab === "agents") return "real-estate";
  if (resultType === "builder") return "builders";
  return "trades-professionals";
};

const organizationSort = (sort?: string) =>
  sort === "created_at" || sort === "rating" || sort === "name" || sort === "priority" ? sort : undefined;

function SectionSwiper({ children }: { children: React.ReactNode[] }) {
  return (
    <Swiper modules={[Mousewheel]} spaceBetween={16} slidesPerView="auto" watchOverflow={false} grabCursor mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }} className="[overscroll-behavior-x:contain] touch-pan-y">
      {children.map((child, index) => (
        <SwiperSlide key={index} className="!w-[20.5rem]">{child}</SwiperSlide>
      ))}
    </Swiper>
  );
}

function Section<T extends { id: string | number }>({ title, count, items, Card, onViewMore }: {
  title: string; count: number; items: T[]; Card: React.ComponentType<{ item: T }>; onViewMore: () => void;
}) {
  return (
    <section>
      <div className="flex items-center justify-between py-2">
        <h2 className="text-[1.5rem] font-medium tracking-tight text-[#342511]">{title}</h2>
        {items.length > 4 && (
          <button type="button" onClick={onViewMore} className="text-[0.75rem] text-[#8B6F54] transition-colors hover:text-[#342511]">
            View more ({count})
          </button>
        )}
      </div>
      <SectionSwiper>
        {items.slice(0, 10).map((item) => <div key={item.id}><Card item={item} /></div>)}
      </SectionSwiper>
    </section>
  );
}

export default function ResultsView({
  resultType, selectedSub, showMap, onViewMore,
}: {
  resultType: ResultType; selectedSub: string; showMap: boolean; onViewMore: (section: "popular" | "newly") => void;
}) {
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [newlyProperties, setNewlyProperties] = useState<PublicProperty[]>([]);
  const [searchParams] = useResultSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const isAgents = resultType === "builder" && selectedSub.toLowerCase() === "agents";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const query = propertyQueryToParams(searchParams);
    const serviceSlug = searchParams.get("service_slug") || undefined;
    const intent = query.purpose || (selectedSub === "Buy" ? "sell" : selectedSub === "Rent" ? "rent" : undefined);
    const request = resultType === "property" || resultType === "comercial"
      ? Promise.all([
          getProperties({ ...query, purpose: intent, category: resultType === "comercial" ? "commercial" : query.category, verified_only: 1 }),
          getProperties({ ...query, purpose: intent, category: resultType === "comercial" ? "commercial" : query.category, sort: "created_at", direction: "desc", verified_only: 1 }),
        ])
      : getOrganizations({ type: organizationTypeForResult(resultType, selectedSub.toLowerCase()), search: query.search, service_slug: resultType === "trader" ? serviceSlug : undefined, sort: organizationSort(query.sort), direction: query.direction, verified_only: 1 });
    request.then((r: any) => {
      if (!active) return;
      if (resultType === "property" || resultType === "comercial") {
        setProperties(r[0].data);
        setNewlyProperties(r[1].data);
        setTotal(r[0].meta?.pagination?.total ?? r[0].data.length);
      } else {
        setOrganizations(r.data);
        setTotal(r.data.length);
      }
    }).catch((reason: any) => { if (active) setError(reason?.message || "Unable to load results."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [resultType, selectedSub, searchParams.toString()]);

  const traders = organizations.map(organizationToTrader);
  const builders = organizations.map(organizationToBuilder);
  const propertyCards = properties.map(propertyToCard);
  const newlyPropertyCards = newlyProperties.map(propertyToCard);
  const displayItems = resultType === "trader" ? traders : resultType === "builder" ? builders : propertyCards;

  if (loading) return <p className="text-sm text-[#8B6F54]">Loading results...</p>;
  if (error) return <p className="text-sm text-red-700">{error}</p>;
  if ((resultType === "property" || resultType === "comercial") && propertyCards.length === 0) {
    return <div className="rounded-2xl bg-white p-8 text-center text-primary-light-brown"><p>No properties found for the selected filters.</p></div>;
  }

  return (
    <>
      <p className="text-[0.75rem] text-[#8B6F54] mb-5">{total} verified results</p>

      {showMap ? (
        <MapSplitView resultType={resultType} items={displayItems} />
      ) : (
        <>
          {resultType === "trader" && (
            <>
              <Section title="Popular Professionals" count={traders.length} items={traders.slice(0, 4)} Card={TraderGridCard} onViewMore={() => onViewMore("popular")} />
              <Section title="Newly Traders" count={traders.length} items={traders.slice(4)} Card={TraderGridCard} onViewMore={() => onViewMore("newly")} />
            </>
          )}
          {resultType === "builder" && (
            <>
              <Section title={isAgents ? "Popular Organizations" : "Popular Builders"} count={builders.length} items={builders.slice(0, 4)} Card={BuilderGridCard} onViewMore={() => onViewMore("popular")} />
              <Section title={isAgents ? "Newly Listed Organizations" : "Newly Listed Builders"} count={builders.length} items={builders.slice(4)} Card={BuilderGridCard} onViewMore={() => onViewMore("newly")} />
            </>
          )}
          {(resultType === "property" || resultType === "comercial") && (
            <>
              <Section title="Popular Properties" count={total} items={propertyCards.slice(0, 4)} Card={PropertyGridCard} onViewMore={() => onViewMore("popular")} />
              <Section title="Newly Listed Properties" count={newlyPropertyCards.length} items={newlyPropertyCards} Card={PropertyGridCard} onViewMore={() => onViewMore("newly")} />
            </>
          )}
        </>
      )}
    </>
  );
}
