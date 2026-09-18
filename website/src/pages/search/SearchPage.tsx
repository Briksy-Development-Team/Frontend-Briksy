import { useEffect, useState } from "react";
import type { SortType } from "../../types/search";
import type { FilterTab } from "../../components/filter/filterTypes";
import type { BreadcrumbItem } from "../../components/nav/Breadcrumb";
import Breadcrumb from "../../components/nav/Breadcrumb";
import SearchToolbar, { SEARCH_CATEGORIES } from "./SearchToolbar";
import BrowseView from "./BrowseView";
import ResultsView from "./ResultsView";
import FullListView from "./FullListView";
import { useResultSearchParams } from "./useResultSearchParams";

const HEADERS: Record<string, { title: string; crumb: string }> = {
  all: { title: "Find anything", crumb: "Search" },
  properties: { title: "Find a property", crumb: "Find a property" },
  builders: { title: "Find a builder", crumb: "Find a builder" },
  professionals: { title: "Find a professional", crumb: "Find a professional" },
  commercial: { title: "Find commercial", crumb: "Commercial" },
};

type BrowseSection = "all" | "popular" | "newly";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useResultSearchParams();
  const [browseSection, setBrowseSection] = useState<BrowseSection>("all");

  const typeParam = searchParams.get("type");
  const queryParam = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort_by") as SortType | null;
  const sort: SortType = ["featured", "newest", "oldest", "price-low", "price-high"].includes(sortParam || "")
    ? (sortParam as SortType)
    : "featured";
  const showMap = searchParams.get("map") === "1";

  const activeCategoryId =
    SEARCH_CATEGORIES.find((c) => c.resultType === typeParam || c.id === typeParam)?.id || "all";

  const rawTabParam = searchParams.get("tab");
  const tabParam = rawTabParam === "buy" ? "Buy" : rawTabParam === "rent" ? "Rent" : rawTabParam === "sold" ? "Sold" : rawTabParam === "builders" ? "Builders" : rawTabParam === "agents" ? "Agents" : rawTabParam === "traders" ? "Traders" : null;
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

  const updateSearchParams = (mutate: (next: URLSearchParams) => void) => {
    const next = new URLSearchParams(searchParams);
    mutate(next);
    setSearchParams(next);
  };

  const handleTabChange = (tab: FilterTab | null) => {
    setActiveTab(tab);
    updateSearchParams((next) => {
      next.delete("page");
      next.delete("intent");
      next.delete("purpose");
      if (!tab) {
        next.delete("tab");
        next.set("type", activeCategoryId);
        return;
      }
      next.set("tab", tab.toLowerCase());
      if (tab === "Buy" || tab === "Rent" || tab === "Sold") {
        next.set("type", "property");
        if (tab === "Buy") next.set("purpose", "sell");
        if (tab === "Rent") next.set("purpose", "rent");
        return;
      }
      next.set("type", tab === "Traders" ? "trader" : "builder");
    });
  };

  const handleSortChange = (nextSort: SortType) => {
    updateSearchParams((next) => {
      next.set("sort_by", nextSort);
      next.delete("page");
    });
  };

  const handleToggleMap = () => {
    updateSearchParams((next) => {
      if (next.get("map") === "1") next.delete("map");
      else next.set("map", "1");
    });
  };

  const handleQueryChange = (q: string) => {
    updateSearchParams((next) => {
      next.set("type", activeCategoryId);
      next.delete("page");
      if (q) next.set("q", q);
      else next.delete("q");
    });
  };

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  if (activeTab) {
    breadcrumbs.push({ label: crumb, onClick: () => { setActiveTab(null); setBrowseSection("all"); } });
    if (browseSection !== "all") {
      breadcrumbs.push(
        { label: activeTab, onClick: () => setBrowseSection("all") },
        { label: browseSection === "popular" ? "Popular" : "Newly Listed" }
      );
    } else {
      breadcrumbs.push({ label: activeTab });
    }
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
  if (browseSection !== "all") {
    content = <FullListView resultType={resultType} section={browseSection} tab={activeTab} />;
  } else if (activeTab || showMap) {
    content = <ResultsView resultType={resultType} selectedSub={activeTab || ""} showMap={showMap} onViewMore={setBrowseSection} />;
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
          onTabChange={handleTabChange}
          sort={sort}
          onSortChange={handleSortChange}
          showMap={showMap}
          onToggleMap={handleToggleMap}
          query={queryParam}
          onQueryChange={handleQueryChange}
        />
        <div className="mt-8 flex flex-col gap-6">{content}</div>
      </div>
    </div>
  );
};

export default SearchPage;
