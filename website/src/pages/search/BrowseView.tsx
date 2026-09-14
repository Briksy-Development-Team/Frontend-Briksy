import type { ResultType } from "../../types/search";
import { useEffect, useState } from "react";
import { getOrganizations, type PublicOrganization } from "../../api/seeker/organization.api";
import { getProperties, type PublicProperty } from "../../api/property/property.api";
import { organizationToBuilder, organizationToTrader, propertyToCard } from "../../api/public.mappers";
import TraderGridCard from "../../components/cards/trader/TraderGridCard";
import BuilderGridCard from "../../components/cards/builder/BuilderGridCard";
import PropertyGridCard from "../../components/cards/property/PropertyGridCard";
import { useSearchParams } from "react-router-dom";
import { propertyQueryToParams } from "../../api/property/propertySearch";
const GRID = "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5";

const organizationTypeForResult = (resultType: ResultType, tab?: string | null) => {
  if (resultType === "builder" && tab === "agents") return "real-estate";
  if (resultType === "builder") return "builders";
  return "trades-professionals";
};

const organizationSort = (sort?: string) =>
  sort === "created_at" || sort === "rating" || sort === "name" || sort === "priority" ? sort : undefined;

function SectionHead({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between py-2">
      <h2 className="text-[1.5rem] font-medium tracking-tight text-[#342511]">{title}</h2>
      <span className="text-[0.75rem] text-[#8B6F54]">{count}</span>
    </div>
  );
}

export default function BrowseView({ resultType }: { resultType: ResultType }) {
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const totalPages = Math.max(1, Math.ceil(total / 24));
  const resetFilters = () => {
    const next = new URLSearchParams(searchParams);
    ["q", "search", "min_price", "max_price", "bedrooms", "bathrooms", "car_spaces", "min_land_size", "max_land_size", "features[]", "features", "suburb", "postcode", "page", "tab"].forEach((key) => next.delete(key));
    if (resultType !== "comercial") next.delete("category");
    setSearchParams(next);
  };
  const pageControls = (resultType === "property" || resultType === "comercial") && totalPages > 1 ? <div className="mt-8 flex items-center justify-center gap-4 text-sm"><button type="button" disabled={page <= 1} onClick={() => { const next = new URLSearchParams(searchParams); next.set("page", String(page - 1)); setSearchParams(next); }} className="rounded-full border px-4 py-2 disabled:opacity-40">Previous</button><span>Page {page} of {totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => { const next = new URLSearchParams(searchParams); next.set("page", String(page + 1)); setSearchParams(next); }} className="rounded-full border px-4 py-2 disabled:opacity-40">Next</button></div> : null;
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const query = propertyQueryToParams(searchParams);
    const tab = searchParams.get("tab");
    const serviceSlug = searchParams.get("service_slug") || undefined;
    const request = resultType === "property" || resultType === "comercial"
      ? getProperties({ ...query, purpose: query.purpose, category: resultType === "comercial" ? "commercial" : query.category, verified_only: 1 })
      : getOrganizations({ type: organizationTypeForResult(resultType, tab), search: query.search, service_slug: resultType === "trader" ? serviceSlug : undefined, sort: organizationSort(query.sort), direction: query.direction, verified_only: 1 });
    request.then((r: any) => {
      if (!active) return;
      if (resultType === "property" || resultType === "comercial") { setProperties(r.data); setTotal(r.meta?.pagination?.total ?? r.data.length); }
      else setOrganizations(r.data);
    }).catch((reason: any) => { if (active) setError(reason?.message || "Unable to load results."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [resultType, searchParams.toString()]);
  const builders = organizations.map(organizationToBuilder);
  const traders = organizations.map(organizationToTrader);
  const propertyCards = properties.map(propertyToCard);
  if (loading) return <p className="py-10 text-center text-sm text-[#8B6F54]">Loading results...</p>;
  if (error) return <p className="rounded-2xl bg-white p-8 text-center text-red-700">{error}</p>;
  if ((resultType === "property" || resultType === "comercial") && propertyCards.length === 0) return <div className="rounded-2xl bg-white p-8 text-center text-primary-light-brown"><p>No properties found for the selected filters.</p><button type="button" onClick={resetFilters} className="mt-4 underline">Reset filters</button></div>;
  return (
    <>
      {resultType === "trader" && (
        <>
          <SectionHead title="Popular Professionals" count={20} />
          <div className={GRID}>
            {traders.slice(0, 4).map((item) => (
              <TraderGridCard key={item.id} item={item} />
            ))}
          </div>
          <SectionHead title="Newly Traders" count={20} />
          <div className={GRID}>
            {traders.slice(4, 8).map((item) => (
              <TraderGridCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
      {resultType === "builder" && (
        <>
          <SectionHead title="Popular Builders" count={20} />
          <div className={GRID}>
            {builders.slice(0, 4).map((item) => (
              <BuilderGridCard key={item.id} item={item} />
            ))}
          </div>
          <SectionHead title="Newly Listed Builders" count={20} />
          <div className={GRID}>
            {builders.slice(4).map((item) => (
              <BuilderGridCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
      {resultType === "property" && (
        <>
          <SectionHead title="Popular Properties" count={total} />
          <div className={GRID}>
            {propertyCards.slice(0, 4).map((item) => (
              <PropertyGridCard key={item.id} item={item} />
            ))}
          </div>
          <SectionHead title="Newly Listed Properties" count={total} />
          <div className={GRID}>
            {propertyCards.slice(4).map((item) => (
              <PropertyGridCard key={item.id} item={item} />
            ))}
          </div>
          {pageControls}
        </>
      )}
      {resultType === "comercial" && (
        <>
          <SectionHead title="Commercial Properties" count={propertyCards.length} />
          <div className={GRID}>{propertyCards.map((item) => <PropertyGridCard key={item.id} item={item} />)}</div>
          {pageControls}
        </>
      )}
    </>
  );
}
