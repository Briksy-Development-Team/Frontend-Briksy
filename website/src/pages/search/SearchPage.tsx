import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobileApp } from "../../utils/platform";
import type { SortType } from "../../types/search";
import type { FilterTab } from "../../components/filter/filterTypes";
import Breadcrumb, { type BreadcrumbItem } from "../../components/nav/Breadcrumb";
import SearchToolbar from "./SearchToolbar";
import { SEARCH_CATEGORIES } from "../../constants/searchCategories";
import BrowseView from "./BrowseView";
import ResultsView from "./ResultsView";
import FullListView from "./FullListView";
import { useResultSearchParams } from "./useResultSearchParams";
import { serviceSlugForLabel } from "../../constants/serviceCategories";

type BrowseSection = "all" | "popular" | "newly";

const CRUMBS: Record<string, string> = {
  all: "Search",
  "real-estate": "Find real estate",
  agents: "Find an agent",
  traders: "Find a professional",
  builders: "Find a builder",
  address: "Address",
  commercial: "Commercial",
  auction: "Auctions",
};

const TAB_MAP: Record<string, FilterTab> = {
  all: "All",
  buy: "Buy",
  rent: "Rent",
  sold: "Sold",
  lease: "Lease",
  leased: "Leased",
  "real-estate": "Real Estate Agents",
  buyer: "Buyer Agents",
  landscaper: "Landscapers",
  landscapers: "Landscapers",
  concreter: "Concreter",
  fencing: "Fencing",
  mortgage: "Mortgage Brokers",
  "mortgage-brokers": "Mortgage Brokers",
  conveyancer: "Conveyancers",
  conveyancers: "Conveyancers",
  "building-pest": "Building & Pest",
  "building-and-pest": "Building & Pest",
};

const SORTS = ["featured", "newest", "oldest", "price-low", "price-high"];

const SearchPage = () => {
  const isApp = useIsMobileApp();
  const [searchParams, setSearchParams] = useResultSearchParams();
  const [browseSection, setBrowseSection] = useState<BrowseSection>("all");
  const navigate = useNavigate();

  const typeParam = searchParams.get("type");
  const queryParam = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort_by") ?? "";
  const sort = (SORTS.includes(sortParam) ? sortParam : "featured") as SortType;
  const showMap = searchParams.get("map") === "1";

  const activeCategoryId =
    SEARCH_CATEGORIES.find((c) => c.id === typeParam)?.id ||
    (typeParam !== "all" ? SEARCH_CATEGORIES.find((c) => c.resultType === typeParam)?.id : undefined) ||
    "all";
  const activeCategory = SEARCH_CATEGORIES.find((c) => c.id === activeCategoryId) || SEARCH_CATEGORIES[0];
  const resultType = activeCategory.resultType;
  const crumb = CRUMBS[activeCategoryId] ?? CRUMBS.all;

  const tabParam = TAB_MAP[searchParams.get("tab") ?? ""] ?? null;
  const defaultTab = (activeCategory.propTypes[0]?.label as FilterTab) || null;
  const [activeTab, setActiveTab] = useState<FilterTab | null>(tabParam ?? defaultTab);

  useEffect(() => {
    setActiveTab(tabParam ?? defaultTab);
  }, [tabParam, defaultTab]);

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
      ["page", "intent", "purpose", "transaction_status", "service_slug"].forEach((k) => next.delete(k));
      next.set("type", activeCategoryId);

      if (!tab) {
        next.delete("tab");
        return;
      }

      next.set("tab", Object.keys(TAB_MAP).find((key) => TAB_MAP[key] === tab) || tab.toLowerCase());

      if (tab === "Buy") next.set("purpose", "sell");
      else if (tab === "Rent" || tab === "Lease") next.set("purpose", "rent");

      if (["real-estate", "commercial"].includes(activeCategoryId) && ["Sold", "Lease", "Leased"].includes(tab)) {
        next.set("transaction_status", tab.toUpperCase());
      }

      const serviceSlug = serviceSlugForLabel(tab);
      if (serviceSlug) next.set("service_slug", serviceSlug);
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

  const sectionLabel = browseSection === "popular" ? "Popular" : "Newly Listed";
  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  if (activeTab && activeTab !== "All") {
    breadcrumbs.push({ label: crumb, onClick: () => { setActiveTab(null); setBrowseSection("all"); } });
    if (browseSection !== "all") {
      breadcrumbs.push({ label: activeTab, onClick: () => setBrowseSection("all") }, { label: sectionLabel });
    } else {
      breadcrumbs.push({ label: activeTab });
    }
  } else if (browseSection !== "all") {
    const noun = crumb.split(" ").pop() || "Results";
    breadcrumbs.push({ label: crumb, onClick: () => setBrowseSection("all") }, { label: `${sectionLabel} ${noun}` });
  } else {
    breadcrumbs.push({ label: crumb });
  }

  let content;
  if (browseSection !== "all") {
    content = <FullListView resultType={resultType} section={browseSection} tab={activeTab} />;
  } else if ((activeTab && activeTab !== "All") || showMap) {
    content = <ResultsView resultType={resultType} selectedSub={activeTab || ""} showMap={showMap} onViewMore={setBrowseSection} />;
  } else {
    content = <BrowseView resultType={resultType} onViewMore={setBrowseSection} />;
  }

  return (
    <div className={`min-h-screen pb-16 font-helvetica ${isApp ? "pt-2" : "pt-20 md:pt-24"}`}>
      {isApp && (
        <div className="flex items-center justify-between px-4 pt-1 pb-3">
          <p className="text-xl font-medium text-primary-brown">Search</p>

          <button
            type="button"
            onClick={() => navigate("/notification")}
            className="relative w-10 h-10 rounded-full bg-white border border-[#342511]/10 flex items-center justify-center text-[#342511] hover:bg-[#342511]/10 active:scale-95 transition-all cursor-pointer shadow-sm"
            aria-label="Notifications"
          >
            <Bell size={19} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-[#F5551A] ring-2 ring-white" />
          </button>
        </div>
      )}
      <div className="mx-auto w-full max-w-[2000px] pl-[3%] pt-6 md:px-[3%]">
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
        <div className="mt-3 flex flex-col">{content}</div>
      </div>
    </div>
  );
};

export default SearchPage;
