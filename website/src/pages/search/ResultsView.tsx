import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { propertyQueryToParams } from "../../api/property/propertySearch";

import type { ResultType } from "../../types/search";
import { getOrganizations, type PublicOrganization } from "../../api/seeker/organization.api";
import { getProperties, type PublicProperty } from "../../api/property/property.api";
import { organizationToBuilder, organizationToTrader, propertyToCard } from "../../api/public.mappers";
import TraderGridCard from "../../components/cards/trader/TraderGridCard";
import BuilderGridCard from "../../components/cards/builder/BuilderGridCard";
import PropertyGridCard from "../../components/cards/property/PropertyGridCard";
import MapSplitView from "./MapSplitView";


const GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";



export default function ResultsView({ resultType, selectedSub, showMap }: {
  resultType: ResultType; selectedSub: string; showMap: boolean;
}) {
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
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    const query = propertyQueryToParams(searchParams);
    const intent = query.purpose || (selectedSub === "Buy" ? "sell" : selectedSub === "Rent" ? "rent" : undefined);
    const request = resultType === "property" || resultType === "comercial"
      ? getProperties({ ...query, purpose: intent, category: resultType === "comercial" ? "commercial" : query.category, verified_only: 1 })
      : getOrganizations({ type: resultType === "builder" ? "builders" : "trades-professionals", service_slug: resultType === "trader" ? selectedSub.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "") : undefined, verified_only: 1 });
    request.then((r: any) => {
      if (!active) return;
      if (resultType === "property" || resultType === "comercial") {
        setProperties(r.data);
        setTotal(r.meta?.pagination?.total ?? r.data.length);
      } else setOrganizations(r.data);
    }).catch((reason: any) => { if (active) setError(reason?.message || "Unable to load results."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [resultType, selectedSub, searchParams.toString()]);



  const displayTraders = organizations.map(organizationToTrader);
  const displayBuilders = organizations.map(organizationToBuilder);
  const displayProperties = properties.map(propertyToCard);

  return (
    <>


      {loading && <p className="text-sm text-[#8B6F54]">Loading results...</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
      {!loading && !error && <p className="text-[0.75rem] text-[#8B6F54] mb-5">{resultType === "property" || resultType === "comercial" ? total : organizations.length} verified results</p>}
      {!loading && !error && (resultType === "property" || resultType === "comercial") && displayProperties.length === 0 && <div className="rounded-2xl bg-white p-8 text-center text-primary-light-brown"><p>No properties found for the selected filters.</p><button type="button" onClick={resetFilters} className="mt-4 underline">Reset filters</button></div>}

      {!loading && !error && showMap ? <MapSplitView resultType={resultType} selectedSub={selectedSub} traders={displayTraders} builders={displayBuilders} properties={displayProperties} /> : (
        <>
          {resultType === "trader" && <div className={GRID}>{displayTraders.map(item => <TraderGridCard key={item.id} item={item} />)}</div>}
          {resultType === "builder" && <div className={GRID}>{displayBuilders.map(item => <BuilderGridCard key={item.id} item={item} />)}</div>}
          {(resultType === "property" || resultType === "comercial") && <div className={GRID}>{displayProperties.map(item => <PropertyGridCard key={item.id} item={item} />)}</div>}
        </>
      )}
      {!loading && !error && (resultType === "property" || resultType === "comercial") && totalPages > 1 && <div className="mt-8 flex items-center justify-center gap-4 text-sm"><button type="button" disabled={page <= 1} onClick={() => { const next = new URLSearchParams(searchParams); next.set("page", String(page - 1)); setSearchParams(next); }} className="rounded-full border px-4 py-2 disabled:opacity-40">Previous</button><span>Page {page} of {totalPages}</span><button type="button" disabled={page >= totalPages} onClick={() => { const next = new URLSearchParams(searchParams); next.set("page", String(page + 1)); setSearchParams(next); }} className="rounded-full border px-4 py-2 disabled:opacity-40">Next</button></div>}

    </>
  );
}
