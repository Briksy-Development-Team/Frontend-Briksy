import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { SortType } from "../../types/search";
import type { FilterTab } from "../../components/filter/filterTypes";
import type { BreadcrumbItem } from "../../components/nav/Breadcrumb";
import Breadcrumb from "../../components/nav/Breadcrumb";
import SearchToolbar, { SEARCH_CATEGORIES } from "./SearchToolbar";
import BrowseView from "./BrowseView";
import ResultsView from "./ResultsView";

const HEADERS: Record<string, { title: string; crumb: string }> = {
  all: { title: "Find anything", crumb: "Search" },
  properties: { title: "Find a property", crumb: "Find a property" },
  builders: { title: "Find a builder", crumb: "Find a builder" },
  professionals: { title: "Find a professional", crumb: "Find a professional" },
  commercial: { title: "Find commercial", crumb: "Commercial" },
};

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortType>("featured");
  const [showMap, setShowMap] = useState(false);

  // Sync state with URL if needed, or just use URL as truth
  const typeParam = searchParams.get("type");
  const queryParam = searchParams.get("q") || "";

  // Map URL `type` to one of our category IDs (all, properties, builders, professionals, commercial)
  const activeCategoryId =
    SEARCH_CATEGORIES.find((c) => c.resultType === typeParam || c.id === typeParam)?.id || "all";

  const rawTabParam = searchParams.get("tab");
  const tabParam = rawTabParam === "buy" ? "Buy" : rawTabParam === "rent" ? "Rent" : rawTabParam === "sold" ? "Sold" : null;
  const [activeTab, setActiveTab] = useState<FilterTab | null>((tabParam as FilterTab) || null);

  useEffect(() => {
    setActiveTab((tabParam as FilterTab) || null);
  }, [tabParam]);

  const activeCategory =
    SEARCH_CATEGORIES.find((c) => c.id === activeCategoryId) || SEARCH_CATEGORIES[0];
  const resultType = activeCategory.resultType;

  const { crumb } = HEADERS[activeCategoryId] || HEADERS.all;

  const breadcrumbs: BreadcrumbItem[] = activeTab
    ? [
        { label: "Home", href: "/" },
        { label: crumb, onClick: () => setActiveTab(null) },
        { label: activeTab },
      ]
    : [{ label: "Home", href: "/" }, { label: crumb }];

  return (
    <div className="min-h-screen bg-[#F8F4EE] pt-24 pb-16 font-helvetica">
      <div className="mx-auto px-[5%]">
        <Breadcrumb items={breadcrumbs} />

        <SearchToolbar
          activeCategoryId={activeCategoryId}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sort={sort}
          onSortChange={setSort}
          showMap={showMap}
          onToggleMap={() => setShowMap((v) => !v)}
          query={queryParam}
          onQueryChange={(q) => {
            const next = new URLSearchParams(searchParams);
            next.set("type", activeCategoryId);
            if (q) next.set("q", q); else next.delete("q");
            setSearchParams(next);
          }}
        />

        <div className="mt-8 flex flex-col gap-6">
          {activeTab || showMap ? (
            <ResultsView
              resultType={resultType}
              selectedSub={activeTab || ""}
              showMap={showMap}
            />
          ) : (
            <BrowseView resultType={resultType} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
