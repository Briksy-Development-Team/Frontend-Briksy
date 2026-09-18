import type { ResultType } from "../../types/search";
import { useEffect, useState } from "react";
import { getOrganizations, type PublicOrganization } from "../../api/seeker/organization.api";
import { getProperties, type PublicProperty } from "../../api/property/property.api";
import { organizationToBuilder, organizationToTrader, propertyToCard } from "../../api/public.mappers";
import TraderGridCard from "../../components/cards/trader/TraderGridCard";
import BuilderGridCard from "../../components/cards/builder/BuilderGridCard";
import PropertyGridCard from "../../components/cards/property/PropertyGridCard";
import { useResultSearchParams } from "./useResultSearchParams";
import { propertyQueryToParams } from "../../api/property/propertySearch";
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
    <Swiper
      modules={[Mousewheel]}
      spaceBetween={16}
      slidesPerView="auto"
      watchOverflow={false}
      grabCursor
      mousewheel={{ forceToAxis: true, sensitivity: 1, releaseOnEdges: true }}
      className="[overscroll-behavior-x:contain] touch-pan-y"
    >
      {children.map((child, index) => (
        <SwiperSlide key={index} className="!w-[20.5rem] ">
          {child}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function Section<T extends { id: string | number }>({
  title,
  count,
  items,
  Card,
  onViewMore,
}: {
  title: string;
  count: number;
  items: T[];
  Card: React.ComponentType<{ item: T }>;
  onViewMore: () => void;
}) {
  if (items.length === 0) {
    return (
      <div>
        <h2 className="text-[1.5rem] ml-2 font-medium tracking-tight text-primary-brown">{title}</h2>
        <p className="mt-2 ml-2 text-sm text-[#8B6F54]">No {title.toLowerCase()} available</p>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between py-2">
        <h2 className=" text-[1.2rem] md:text-[1.5rem] ml-2  font-medium tracking-tight text-primary-brown">{title}</h2>
        {items.length > 4 && (
          <button
            type="button"
            onClick={onViewMore}
            className="text-[0.75rem] pr-[3%] text-[#8B6F54] transition-colors hover:text-primary-brown"
          >
            View more ({count})
          </button>
        )}
      </div>
      <SectionSwiper>
        {items.slice(0, 10).map((item) => (
          <div key={item.id}>
            <Card item={item} />
          </div>
        ))}
      </SectionSwiper>
    </section>
  );
}

export default function BrowseView({
  resultType,
  onViewMore,
}: {
  resultType: ResultType;
  onViewMore: (section: "popular" | "newly") => void;
}) {
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [commercialProperties, setCommercialProperties] = useState<PublicProperty[]>([]);
  const [searchParams, setSearchParams] = useResultSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const tab = searchParams.get("tab");
  const isAgents = resultType === "builder" && tab === "agents";

  const resetFilters = () => {
    const next = new URLSearchParams(searchParams);
    ["q", "search", "min_price", "max_price", "bedrooms", "bathrooms", "car_spaces", "min_land_size", "max_land_size", "features[]", "features", "suburb", "postcode", "page", "tab"].forEach((key) => next.delete(key));
    if (resultType !== "comercial") next.delete("category");
    setSearchParams(next);
  };

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const query = propertyQueryToParams(searchParams);
    const serviceSlug = searchParams.get("service_slug") || undefined;

    if (resultType === "all") {
      Promise.all([
        getProperties({ ...query, purpose: query.purpose, verified_only: 1 }),
        getProperties({ ...query, purpose: query.purpose, category: "commercial", verified_only: 1 }),
        getOrganizations({ search: query.search, verified_only: 1 })
      ])
        .then(([propRes, comRes, orgsRes]: any) => {
          if (!active) return;
          setProperties(propRes.data);
          setCommercialProperties(comRes.data);
          setOrganizations(orgsRes.data);
          setTotal(propRes.meta?.pagination?.total ?? propRes.data.length);
        })
        .catch((reason: any) => {
          if (active) setError(reason?.message || "Unable to load results.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    } else {
      const request = resultType === "property" || resultType === "comercial"
        ? getProperties({ ...query, purpose: query.purpose, category: resultType === "comercial" ? "commercial" : query.category, verified_only: 1 })
        : getOrganizations({ type: organizationTypeForResult(resultType, tab), search: query.search, service_slug: resultType === "trader" ? serviceSlug : undefined, sort: organizationSort(query.sort), direction: query.direction, verified_only: 1 });
      request.then((r: any) => {
        if (!active) return;
        if (resultType === "property" || resultType === "comercial") { setProperties(r.data); setTotal(r.meta?.pagination?.total ?? r.data.length); }
        else setOrganizations(r.data);
      }).catch((reason: any) => { if (active) setError(reason?.message || "Unable to load results."); })
        .finally(() => { if (active) setLoading(false); });
    }
    return () => { active = false; };
  }, [resultType, searchParams.toString()]);

  const builders = organizations.map(organizationToBuilder);
  const traders = organizations.map(organizationToTrader);
  const propertyCards = properties.map(propertyToCard);

  const allTraders = organizations.filter(o => o.type?.slug === "trades-professionals" || (!o.type?.slug && !o.type?.name)).map(organizationToTrader);
  const allAgenciesAndBuilders = organizations.filter(o => o.type?.slug === "real-estate" || o.type?.slug === "builders").map(organizationToBuilder);
  const allCommercialCards = commercialProperties.map(propertyToCard);

  if (loading) return <p className="py-10 text-center text-sm text-[#8B6F54]">Loading results...</p>;
  if (error) return <p className="rounded-2xl bg-white p-8 text-center text-red-700">{error}</p>;
  if ((resultType === "property" || resultType === "comercial") && propertyCards.length === 0) return (
    <div className="rounded-2xl bg-white p-8 text-center text-primary-light-brown">
      <p>No properties found for the selected filters.</p>
      <button type="button" onClick={resetFilters} className="mt-4 underline">Reset filters</button>
    </div>
  );

  return (
    <>
      {resultType === "all" && (
        <>
          <div className="space-y-12">
            <Section title="Popular properties" count={propertyCards.length} items={propertyCards} Card={PropertyGridCard} onViewMore={() => onViewMore("popular")} />
            <Section title="Trades and professionals" count={allTraders.length} items={allTraders} Card={TraderGridCard} onViewMore={() => onViewMore("popular")} />
            <Section title="Agencies and builders" count={allAgenciesAndBuilders.length} items={allAgenciesAndBuilders} Card={BuilderGridCard} onViewMore={() => onViewMore("popular")} />
            <Section title="Commercial properties" count={allCommercialCards.length} items={allCommercialCards} Card={PropertyGridCard} onViewMore={() => onViewMore("popular")} />
          </div>
        </>
      )}
      {resultType === "trader" && (
        <>
          <Section title="Popular Professionals" count={traders.length} items={traders.slice(0, 4)} Card={TraderGridCard} onViewMore={() => onViewMore("popular")} />
          <Section title="Newly Traders" count={traders.length} items={traders.slice(4)} Card={TraderGridCard} onViewMore={() => onViewMore("newly")} />
        </>
      )}
      {resultType === "builder" && (
        <>
          <Section
            title={isAgents ? "Popular Organizations" : "Popular Builders"}
            count={builders.length}
            items={builders.slice(0, 4)}
            Card={BuilderGridCard}
            onViewMore={() => onViewMore("popular")}
          />
          <Section
            title={isAgents ? "Newly Listed Organizations" : "Newly Listed Builders"}
            count={builders.length}
            items={builders.slice(4)}
            Card={BuilderGridCard}
            onViewMore={() => onViewMore("newly")}
          />
        </>
      )}
      {resultType === "property" && (
        <>
          <Section title="Popular Properties" count={total} items={propertyCards.slice(0, 4)} Card={PropertyGridCard} onViewMore={() => onViewMore("popular")} />
          <Section title="Newly Listed Properties" count={total} items={propertyCards.slice(4)} Card={PropertyGridCard} onViewMore={() => onViewMore("newly")} />
        </>
      )}
      {resultType === "comercial" && (
        <>
          <Section title="Popular Commercial" count={total} items={propertyCards.slice(0, 4)} Card={PropertyGridCard} onViewMore={() => onViewMore("popular")} />
          <Section title="Newly Listed Commercial" count={total} items={propertyCards.slice(4)} Card={PropertyGridCard} onViewMore={() => onViewMore("newly")} />
        </>
      )}
    </>
  );
}
