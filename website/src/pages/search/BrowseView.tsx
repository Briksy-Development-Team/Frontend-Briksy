import type { ResultType } from "../../types/search";
import { useEffect, useState } from "react";
import { getOrganizations, getProperties, type PublicOrganization, type PublicProperty } from "../../api/public.api";
import { organizationToBuilder, organizationToTrader, propertyToCard } from "../../api/public.mappers";
import TraderGridCard from "../../components/cards/trader/TraderGridCard";
import BuilderGridCard from "../../components/cards/builder/BuilderGridCard";
import PropertyGridCard from "../../components/cards/property/PropertyGridCard";

const GRID =
  "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function SectionHead({ title, count }: { title: string; count: number }) {
  return (
    <div className="flex items-center justify-between py-2">
      <h2 className="text-[1.5rem] font-medium text-[primary-brown] tracking-tight">
        {title}
      </h2>
      <button className="text-[0.75rem] text-[#8B6F54] hover:text-[primary-brown] transition-colors">
        View more ({count})
      </button>
    </div>
  );
}

export default function BrowseView({ resultType }: { resultType: ResultType }) {
  const [organizations, setOrganizations] = useState<PublicOrganization[]>([]);
  const [properties, setProperties] = useState<PublicProperty[]>([]);
  useEffect(() => {
    if (resultType === "property") getProperties({ verified_only: true }).then((r) => setProperties(r.data)).catch(console.error);
    else getOrganizations({ type: resultType === "builder" ? "builders" : "trades-professionals", verified_only: true }).then((r) => setOrganizations(r.data)).catch(console.error);
  }, [resultType]);
  const builders = organizations.map(organizationToBuilder);
  const traders = organizations.map(organizationToTrader);
  const propertyCards = properties.map(propertyToCard);
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
          <SectionHead title="Popular Properties" count={20} />
          <div className={GRID}>
            {propertyCards.slice(0, 4).map((item) => (
              <PropertyGridCard key={item.id} item={item} />
            ))}
          </div>
          <SectionHead title="Newly Listed Properties" count={20} />
          <div className={GRID}>
            {propertyCards.slice(4).map((item) => (
              <PropertyGridCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
