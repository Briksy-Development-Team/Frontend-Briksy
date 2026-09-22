import { useState } from "react";
import { SlidersHorizontal, Search, Sparkles } from "lucide-react";
import DropdownPill from "../../components/custom/DropdownPill";
import { createPortal } from "react-dom";
import Filter from "../../components/filter/Filter";
import type { ResultType, SortType } from "../../types/search";
import type { FilterTab } from "../../components/filter/filterTypes";
import AllIcon from "../../assets/icons/search/search.svg?react";
import PropIcon from "../../assets/icons/search/property.svg?react";
import BuildIcon from "../../assets/icons/search/build.svg?react";
import TraderIcon from "../../assets/icons/search/trades.svg?react";
import ComercialIcon from "../../assets/icons/search/comercial.svg?react";
import MapIcon from "../../assets/icons/search/map.svg?react";

type CategoryDef = {
  id: string;
  label: string;
  resultType: ResultType;
  icon: React.ReactNode;
  tabs: FilterTab[];
};

// eslint-disable-next-line react-refresh/only-export-components
export const SEARCH_CATEGORIES: CategoryDef[] = [
  {
    id: "all",
    label: "All Categories",
    resultType: "all",
    icon: <AllIcon className="w-4 h-4" />,
    tabs: ["Buy", "Rent", "Sold", "Builders", "Agents", "Traders"],
  },
  {
    id: "properties",
    label: "Properties",
    resultType: "property",
    icon: <PropIcon className="w-4 h-4" />,
    tabs: ["Buy", "Rent", "Sold"],
  },
  {
    id: "builders",
    label: "BUILDERS / Org.",
    resultType: "builder",
    icon: <BuildIcon className="w-4 h-4" />,
    tabs: ["Builders", "Agents"],
  },
  {
    id: "professionals",
    label: "Professionals",
    resultType: "trader",
    icon: <TraderIcon className="w-4 h-4" />,
    tabs: ["Traders"],
  },
  {
    id: "commercial",
    label: "Commercial",
    resultType: "comercial",
    icon: <ComercialIcon className="w-4 h-4" />,
    tabs: ["Rent"],
  },
];

const SORT_OPTIONS = [
  { label: "Recommended", value: "featured" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Price ↑", value: "price-low" },
  { label: "Price ↓", value: "price-high" },
];

const TAB_LABELS: Record<FilterTab, string> = {
  Buy: "Buy",
  Rent: "Rent",
  Sold: "Sold",
  Builders: "Builders",
  Agents: "Organizations",
  Traders: "Sole Traders",
};

const SORT_LABELS = SORT_OPTIONS.reduce<Record<string, string>>(
  (acc, option) => {
    acc[option.value] = option.label;
    return acc;
  },
  {},
);

export default function SearchToolbar({
  activeCategoryId,
  activeTab,
  onTabChange,
  sort,
  onSortChange,
  showMap,
  onToggleMap,
  query,
  onQueryChange,
  onAskAi,
}: {
  activeCategoryId: string;
  activeTab: FilterTab | null;
  onTabChange: (tab: FilterTab | null) => void;
  sort: SortType;
  onSortChange: (sort: SortType) => void;
  showMap: boolean;
  onToggleMap: () => void;
  query: string;
  onQueryChange: (value: string) => void;
  onAskAi?: () => void;
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeCategory =
    SEARCH_CATEGORIES.find((c) => c.id === activeCategoryId) ||
    SEARCH_CATEGORIES[0];

  return (
    <div className="flex  flex-col gap-4">
      <div className="flex flex-col lg:items-center lg:flex-row  gap-y-2   justify-between flex-wrap py-1">
        <div className="flex-1 max-w-[30rem] pr-[3%]  gap-x-2 md:gap-x-0 h-12 md:bg-white rounded-xl md:border md:border-[#EDE8E4] md:pl-8 md:pr-2 
         flex items-center justify-between text-left transition-colors shrink-0">
          <div className="flex items-center  w-full  bg-white h-full rounded-[6.25rem] px-2  gap-x-[6px] overflow-hidden ">
            <Search className="md:w-5 md:h-5 h-4 w-4 text-gray-100 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Search for properties, builders, professionals..."
              className="md:text-[0.875rem] text-[0.750rem]  h-full  text-black tracking-[0.03em] truncate  outline-none w-full placeholder:text-black/60"
            />
          </div>

          <div className="flex items-center bg-primary-brown text-white md:text-primary-brown  md:bg-white rounded-[5.4348rem] p-[0.7065rem] gap-3 shrink-0">
            <div className="w-px h-4 hidden md:block bg-[#EDE8E4]" />
            <button
              type="button"
              onClick={onAskAi}
              className="flex items-center justify-center  gap-2 px-0 md:px-2 h-full    text-[0.875rem]"
            >
              <Sparkles className="w-4 h-4" />
              <p className="hidden md:flex"> Ask Ai</p>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 min-w-0 max-w-full overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="py-2 px-3 bg-white rounded-full border border-[#EDE8E4] flex items-center justify-center gap-2 transition-colors shrink-0"
          >
            <SlidersHorizontal className="w-4 h-4  text-primary-brown" />
            <span className="text-[0.875rem] mt-1 text-[#342511] ">
              Filters
            </span>
          </button>
          {activeCategory.tabs.length > 0 && (
            <DropdownPill
              label={activeTab ? TAB_LABELS[activeTab] : activeCategory.label}
              value={activeTab || "all"}
              options={[
                { label: activeCategory.label, value: "all" },
                ...activeCategory.tabs.map((tab) => ({
                  label: TAB_LABELS[tab],
                  value: tab,
                })),
              ]}
              onSelect={(v: string) =>
                onTabChange(v === "all" ? null : (v as FilterTab))
              }
              className="py-2 !px-5"
            />
          )}
          <DropdownPill
            label={SORT_LABELS[sort] || "Sort by"}
            value={sort}
            options={SORT_OPTIONS}
            onSelect={(v: string) => onSortChange(v as SortType)}
            className="py-2 !px-5"
          />
          <button
            onClick={onToggleMap}
            className={`py-2 px-3 rounded-full border flex items-center gap-2 transition-colors shrink-0 ${showMap
              ? "bg-[#342511] text-white border-[#342511]"
              : "bg-white text-[#342511] border-[#EDE8E4]"
              }`}
          >
            <MapIcon className={`w-5 h-5 ${showMap ? "invert brightness-0" : ""}`} />
            <span className="text-[0.875rem] mt-1">Show map</span>
          </button>
        </div>
      </div>

      {isFilterOpen &&
        createPortal(
          <Filter
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            category={activeCategory.id}
            initialTab={
              activeTab || (activeCategory.id === "commercial" ? "Rent" : "Buy")
            }
          />,
          document.body,
        )}
    </div>
  );
}
