import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { SortType } from "../../types/search";
import type { FilterTab } from "../../components/filter/filterTypes";
import type { BreadcrumbItem } from "../../components/nav/Breadcrumb";
import Breadcrumb from "../../components/nav/Breadcrumb";
import SearchToolbar, { SEARCH_CATEGORIES } from "./SearchToolbar";
import BrowseView from "./BrowseView";
import ResultsView from "./ResultsView";
import FullListView from "./FullListView";

const HEADERS: Record<string, { title: string; crumb: string }> = {
  all: { title: "Find anything", crumb: "Search" },
  properties: { title: "Find a property", crumb: "Find a property" },
  builders: { title: "Find a builder", crumb: "Find a builder" },
  professionals: { title: "Find a professional", crumb: "Find a professional" },
  commercial: { title: "Find commercial", crumb: "Commercial" },
};

type BrowseSection = "all" | "popular" | "newly";



const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState<SortType>("featured");
  const [showMap, setShowMap] = useState(false);
  const [browseSection, setBrowseSection] = useState<BrowseSection>("all");
  const [activeTab, setActiveTab] = useState<FilterTab | null>(null);

  const typeParam = searchParams.get("type");
  const queryParam = searchParams.get("q") || "";

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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBrowseSection("all");
  }, [resultType]);

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  if (activeTab) {
    breadcrumbs.push(
      { label: crumb, onClick: () => { setActiveTab(null); setBrowseSection("all"); } },
      { label: activeTab }
    );
  } else if (browseSection !== "all") {
    const noun = crumb.split(" ").pop() || "Results";
    breadcrumbs.push(
      { label: crumb, onClick: () => setBrowseSection("all") },
      { label: browseSection === "popular" ? `Popular ${noun}` : `Newly Listed ${noun}` }
    );
  } else {
    breadcrumbs.push({ label: crumb });
  }

  let content;
  if (activeTab || showMap) {
    content = <ResultsView resultType={resultType} selectedSub={activeTab || ""} showMap={showMap} />;
  } else if (browseSection !== "all") {
    content = <FullListView resultType={resultType} section={browseSection} />;
  } else {
    content = <BrowseView resultType={resultType} onViewMore={setBrowseSection} />;
  }

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

        <div className="mt-8 flex flex-col gap-6">{content}</div>
      </div>
    </div>
  );
};

export default SearchPage;