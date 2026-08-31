import type { ResultType } from "../../types/search";
import { mockProperties } from "../../data/mockProperties";
import { mockBuilders } from "../../data/mockBuilders";
import { mockTraders } from "../../data/mockTraders";
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
  return (
    <>
      {resultType === "trader" && (
        <>
          <SectionHead title="Popular Professionals" count={20} />
          <div className={GRID}>
            {mockTraders.slice(0, 4).map((item) => (
              <TraderGridCard key={item.id} item={item} />
            ))}
          </div>
          <SectionHead title="Newly Traders" count={20} />
          <div className={GRID}>
            {mockTraders.slice(4, 8).map((item) => (
              <TraderGridCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
      {resultType === "builder" && (
        <>
          <SectionHead title="Popular Builders" count={20} />
          <div className={GRID}>
            {mockBuilders.slice(0, 4).map((item) => (
              <BuilderGridCard key={item.id} item={item} />
            ))}
          </div>
          <SectionHead title="Newly Listed Builders" count={20} />
          <div className={GRID}>
            {mockBuilders.slice(4).map((item) => (
              <BuilderGridCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
      {resultType === "property" && (
        <>
          <SectionHead title="Popular Properties" count={20} />
          <div className={GRID}>
            {mockProperties.slice(0, 4).map((item) => (
              <PropertyGridCard key={item.id} item={item} />
            ))}
          </div>
          <SectionHead title="Newly Listed Properties" count={20} />
          <div className={GRID}>
            {mockProperties.slice(4).map((item) => (
              <PropertyGridCard key={item.id} item={item} />
            ))}
          </div>
        </>
      )}
    </>
  );
}
