import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { SEARCH_CATEGORIES, type Category } from "../../../constants/searchCategories";
import { useListingData } from "../../../pages/search/useListingData";
import type { FilterTab } from "../../../components/filter/filterTypes";
import TraderListCard from "../../../components/cards/trader/TraderListCard";
import BuilderListCard from "../../../components/cards/builder/BuilderListCard";
import PropertyListCard from "../../../components/cards/property/PropertyListCard";

// Exclude the raw address category since it's a search input mode rather than a catalog category
const CATEGORIES = SEARCH_CATEGORIES.filter((c) => c.id !== "address");

interface AppPopularNearYouProps {
  initialCategoryId?: string;
  maxItems?: number;
}

export default function AppPopularNearYou({
  initialCategoryId = "real-estate",
  maxItems = 6,
}: AppPopularNearYouProps) {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(initialCategoryId);
  const [activeSubTab, setActiveSubTab] = useState<FilterTab | null>(null);

  const activeCategory: Category = useMemo(
    () => CATEGORIES.find((c) => c.id === activeCategoryId) || CATEGORIES[0],
    [activeCategoryId]
  );

  const items = useListingData(activeCategory.resultType, "", activeSubTab, "popular");

  const handleCategoryChange = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setActiveSubTab(null);
  };

  const getSeeAllUrl = () => {
    if (activeCategory.id === "traders") return "/professionals";
    if (activeCategory.id === "builders") return "/builders";
    if (activeCategory.id === "agents") return "/agents";
    if (activeCategory.id === "commercial") return "/commercials";
    if (activeCategory.id === "auction") return "/auctions";
    return "/buy";
  };

  return (
    <section className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium text-[#342511] tracking-tight">Popular near you</h2>
        <Link
          to={getSeeAllUrl()}
          className="text-xs text-[#7C5F42] hover:text-[#342511] font-medium flex items-center gap-1 transition-colors"
        >
          <span>See all</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 -mx-4 px-4">
        {CATEGORIES.map((cat) => {
          const isSelected = cat.id === activeCategoryId;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryChange(cat.id)}
              className={`py-1.5 px-3.5 text-xs font-medium rounded-full transition-all text-center whitespace-nowrap cursor-pointer shrink-0 ${isSelected
                ? "bg-[#342511] text-white shadow-xs"
                : "bg-white text-[#7C5F42] border border-[#EDE8E4] hover:bg-[#F8F4EE] hover:text-[#342511]"
                }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Subcategory Pills (if the category has subcategories like Buy, Rent, Landscapers, etc.) */}
      {activeCategory.propTypes && activeCategory.propTypes.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-0.5 -mx-4 px-4">
          {activeCategory.propTypes.map((prop) => {
            const isAll = prop.id === "all";
            const isSelected = isAll ? !activeSubTab : activeSubTab === prop.label;
            return (
              <button
                key={prop.id}
                type="button"
                onClick={() => setActiveSubTab(isAll ? null : (prop.label as FilterTab))}
                className={`py-1 px-3 text-[11px] rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${isSelected
                  ? "bg-[#8B6F54] text-white font-medium"
                  : "bg-[#EBE5DC] text-[#7C5F42] hover:bg-[#dfd7cc] font-normal"
                  }`}
              >
                {prop.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Vertical Cards Scroller */}
      <div className="flex flex-col gap-3 pt-1">
        {items.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center text-[#7C5F42] gap-2">
            <Loader2 size={24} className="animate-spin text-[#8B6F54]" />
            <span className="text-xs">Loading {activeCategory.label.toLowerCase()}...</span>
          </div>
        ) : (
          items.slice(0, maxItems).map((item) => {
            if (activeCategory.resultType === "trader") {
              return <TraderListCard key={item.id} item={item} />;
            }
            if (activeCategory.resultType === "builder") {
              return <BuilderListCard key={item.id} item={item} />;
            }
            return <PropertyListCard key={item.id} item={item} />;
          })
        )}
      </div>
    </section>
  );
}
