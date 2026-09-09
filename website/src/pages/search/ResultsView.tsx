import { useEffect, useState } from "react";

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
  useEffect(() => {
    const serviceSlug = selectedSub.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");
    if (resultType === "property") {
      getProperties({ verified_only: 1, search: selectedSub }).then((r) => setProperties(r.data)).catch(console.error);
    } else {
      getOrganizations({ type: resultType === "builder" ? "builders" : "trades-professionals", service_slug: resultType === "trader" ? serviceSlug : undefined, verified_only: 1 })
        .then((r) => setOrganizations(r.data)).catch(console.error);
    }
  }, [resultType, selectedSub]);



  const displayTraders = organizations.map(organizationToTrader);
  const displayBuilders = organizations.map(organizationToBuilder);
  const displayProperties = properties.map(propertyToCard);

  return (
    <>


      <p className="text-[0.75rem] text-[#8B6F54] mb-5">{resultType === "property" ? displayProperties.length : organizations.length} verified results</p>

      {showMap ? <MapSplitView resultType={resultType} selectedSub={selectedSub} traders={displayTraders} builders={displayBuilders} properties={displayProperties} /> : (
        <>
          {resultType === "trader" && <div className={GRID}>{displayTraders.map(item => <TraderGridCard key={item.id} item={item} />)}</div>}
          {resultType === "builder" && <div className={GRID}>{displayBuilders.map(item => <BuilderGridCard key={item.id} item={item} />)}</div>}
          {resultType === "property" && <div className={GRID}>{displayProperties.map(item => <PropertyGridCard key={item.id} item={item} />)}</div>}
        </>
      )}

    </>
  );
}
