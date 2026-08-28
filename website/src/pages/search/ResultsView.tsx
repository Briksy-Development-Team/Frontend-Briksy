import { useState } from "react";
import { Map, X, ChevronDown } from "lucide-react";
import type { ResultType, SortType } from "../../types/search";
import { mockProperties } from "../../data/mockProperties";
import { mockBuilders } from "../../data/mockBuilders";
import { mockTraders } from "../../data/mockTraders";
import TraderGridCard from "../../components/cards/trader/TraderGridCard";
import BuilderGridCard from "../../components/cards/builder/BuilderGridCard";
import PropertyGridCard from "../../components/cards/property/PropertyGridCard";
import MapSplitView from "./MapSplitView";

const GRID = "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";
const DISTANCE_OPTIONS = ["Within 5 km", "Within 10 km", "Within 25 km", "Within 50 km"];
const RATING_OPTIONS = [4.0, 4.5];

type ActiveFilters = { distance: string | null; licenceVerified: boolean; minRating: number | null };

function FilterDropdown({ active, onToggle }: { active: ActiveFilters; onToggle: (k: keyof ActiveFilters, v: string | boolean | number | null) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)} className="px-4 h-10 bg-white border border-[#EDE8E4] rounded-full text-[0.875rem] text-[primary-brown] flex items-center gap-2 hover:bg-[#F8F4EE] transition-colors">
        + Filters
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-12 z-50 bg-white border border-[#EDE8E4] rounded-2xl shadow-[0_8px_30px_rgba(52,37,17,0.12)] p-4 w-64 flex flex-col gap-4">
            <div>
              <p className="text-[0.7rem] font-semibold text-[#8B6F54] uppercase tracking-wider mb-2">Distance</p>
              {DISTANCE_OPTIONS.map(d => (
                <button key={d} onClick={() => onToggle("distance", active.distance === d ? null : d)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-[0.8rem] transition-colors ${active.distance === d ? "bg-[#E2CBB3] text-[primary-brown] font-medium" : "text-[#5C4D40] hover:bg-[#F5F0EB]"}`}>{d}</button>
              ))}
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold text-[#8B6F54] uppercase tracking-wider mb-2">Licence</p>
              <button onClick={() => onToggle("licenceVerified", !active.licenceVerified)}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-[0.8rem] transition-colors ${active.licenceVerified ? "bg-[#E2CBB3] text-[primary-brown] font-medium" : "text-[#5C4D40] hover:bg-[#F5F0EB]"}`}>
                ✓ Licence verified
              </button>
            </div>
            <div>
              <p className="text-[0.7rem] font-semibold text-[#8B6F54] uppercase tracking-wider mb-2">Min rating</p>
              {RATING_OPTIONS.map(r => (
                <button key={r} onClick={() => onToggle("minRating", active.minRating === r ? null : r)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-[0.8rem] transition-colors ${active.minRating === r ? "bg-[#E2CBB3] text-[primary-brown] font-medium" : "text-[#5C4D40] hover:bg-[#F5F0EB]"}`}>
                  ★ {r} and above
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

const SORT_LABELS: Record<SortType, string> = { featured: "Recommended", newest: "Newest", oldest: "Oldest", "price-low": "Price ↑", "price-high": "Price ↓" };
const SORT_CYCLE: SortType[] = ["featured", "newest", "oldest", "price-low", "price-high"];

export default function ResultsView({ resultType, selectedSub, sort, setSort, onClearSub, showMap, onToggleMap }: {
  resultType: ResultType; selectedSub: string; sort: SortType;
  setSort: (s: SortType) => void; onClearSub: () => void;
  showMap: boolean; onToggleMap: () => void;
}) {
  const [filters, setFilters] = useState<ActiveFilters>({ distance: null, licenceVerified: false, minRating: null });
  const toggle = (k: keyof ActiveFilters, v: string | boolean | number | null) => setFilters(f => ({ ...f, [k]: v }));

  const chip = "px-[14px] py-2 bg-[#E2CBB3] rounded-full text-[0.875rem] text-[primary-brown] flex items-center gap-1.5 hover:bg-[#D9C0A5] transition-colors";

  const displayTraders = (() => {
    const byCat = mockTraders.filter(t => t.category === selectedSub);
    const base = byCat.length > 0 ? byCat : mockTraders;
    return filters.minRating ? base.filter(t => t.rating >= filters.minRating!) : base;
  })();

  return (
    <>
      <div className="flex items-center gap-2.5 mb-4 flex-wrap">
        <button onClick={onClearSub} className={chip}>{selectedSub} <X className="w-3.5 h-3.5" /></button>
        {filters.distance && <button onClick={() => toggle("distance", null)} className={chip}>{filters.distance} <X className="w-3.5 h-3.5" /></button>}
        {filters.licenceVerified && <button onClick={() => toggle("licenceVerified", false)} className={chip}>Licence verified <X className="w-3.5 h-3.5" /></button>}
        {filters.minRating && <button onClick={() => toggle("minRating", null)} className={chip}>{filters.minRating} and above <X className="w-3.5 h-3.5" /></button>}
        <FilterDropdown active={filters} onToggle={toggle} />
        <div className="ml-auto flex items-center gap-2.5">
          <button onClick={onToggleMap} className={`px-4 h-10 rounded-full text-[0.875rem] font-medium flex items-center gap-2 transition-colors border ${showMap ? "bg-[primary-brown] text-white border-[primary-brown]" : "bg-white border-[#EDE8E4] text-[primary-brown] hover:bg-[#F8F4EE]"}`}>
            <Map className="w-4 h-4" /> Show map
          </button>
          <button onClick={() => setSort(SORT_CYCLE[(SORT_CYCLE.indexOf(sort) + 1) % SORT_CYCLE.length])}
            className="px-4 h-10 bg-white border border-[#EDE8E4] rounded-full text-[0.875rem] text-[primary-brown] flex items-center gap-2 hover:bg-[#F8F4EE] transition-colors">
            Sort by: {SORT_LABELS[sort]} <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-[0.75rem] text-[#8B6F54] mb-5">{displayTraders.length * 12} verified professionals · Showing 1–{Math.min(12, displayTraders.length)}</p>

      {showMap ? <MapSplitView resultType={resultType} selectedSub={selectedSub} /> : (
        <>
          {resultType === "trader"   && <div className={GRID}>{displayTraders.map(item => <TraderGridCard key={item.id} item={item} />)}</div>}
          {resultType === "builder"  && <div className={GRID}>{mockBuilders.map(item => <BuilderGridCard key={item.id} item={item} />)}</div>}
          {resultType === "property" && <div className={GRID}>{mockProperties.map(item => <PropertyGridCard key={item.id} item={item} />)}</div>}
        </>
      )}
    </>
  );
}
