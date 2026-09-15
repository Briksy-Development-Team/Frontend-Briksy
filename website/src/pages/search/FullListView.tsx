import type { ResultType } from "../../types/search";
import type { FilterTab } from "../../components/filter/filterTypes";
import { useEffect, useState } from "react";
import TraderGridCard from "../../components/cards/trader/TraderGridCard";
import BuilderGridCard from "../../components/cards/builder/BuilderGridCard";
import PropertyGridCard from "../../components/cards/property/PropertyGridCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useListingData } from "./useListingData";

const GRID =
  "grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6"; 
  
  const ITEMS_PER_PAGE = 12;

export default function FullListView({
  resultType,
  section,
  tab = null,
}: {
  resultType: ResultType;
  section: "popular" | "newly";
  tab?: FilterTab | null;
}) {
  const [page, setPage] = useState(1);
  const allItems = useListingData(resultType, "", tab);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [resultType, section, tab]);

  const mid = Math.ceil(allItems.length / 2);
  const items = section === "popular" ? allItems.slice(0, mid) : allItems.slice(mid);

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
  const currentItems = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const startIdx = totalItems === 0 ? 0 : (page - 1) * ITEMS_PER_PAGE + 1;
  const endIdx = Math.min(page * ITEMS_PER_PAGE, totalItems);

  const getTitle = () => {
    const typeName = resultType === "property" ? "properties" : resultType === "comercial" ? "commercial properties" : resultType === "builder" ? (tab === "Agents" ? "organizations" : "builders") : "professionals";
    const countText = totalItems === 0 ? "No" : totalItems;
    return `${countText} licensed ${typeName} · Showing ${startIdx}–${endIdx}`;
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between py-2">
        <h2 className="text-[1.5rem] font-medium text-[#342511] tracking-tight">{getTitle()}</h2>
      </div>

      <div className={GRID}>
        {currentItems.map((item) => (
          resultType === "trader" ? <TraderGridCard key={item.id} item={item} /> :
            resultType === "builder" ? <BuilderGridCard key={item.id} item={item} /> :
              <PropertyGridCard key={item.id} item={item} />
        ))}
      </div>

      {totalPages >= 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#E2CBB3] bg-white text-[#342511] disabled:opacity-50 hover:bg-[#F8F4EE] transition-colors">
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${page === p ? "bg-[#342511] text-white font-medium" : "border border-[#E2CBB3] bg-white text-[#342511] hover:bg-[#F8F4EE]"}`}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex items-center justify-center w-10 h-10 rounded-lg border border-[#E2CBB3] bg-white text-[#342511] disabled:opacity-50 hover:bg-[#F8F4EE] transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}