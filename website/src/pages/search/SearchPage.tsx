import { useEffect, useState } from "react";
import type { SortType } from "../../types/search";
import type { FilterTab } from "../../components/filter/filterTypes";
import type { BreadcrumbItem } from "../../components/nav/Breadcrumb";
import Breadcrumb from "../../components/nav/Breadcrumb";
import SearchToolbar, { buildSearchCategories } from "./SearchToolbar";
import BrowseView from "./BrowseView";
import ResultsView from "./ResultsView";
import FullListView from "./FullListView";
import { useResultSearchParams } from "./useResultSearchParams";
import { SERVICE_CATEGORIES, serviceSlugForLabel } from "../../constants/serviceCategories";
import { getServiceCategories, type PublicServiceCategory } from "../../api/serviceCategories.api";
import { agentTypeForLabel, getAgentTypes, type PublicAgentType } from "../../api/agentTypes.api";

const HEADERS: Record<string, { title: string; crumb: string }> = {
  all: { title: "Find anything", crumb: "Search" },
  properties: { title: "Find a property", crumb: "Find a property" },
  agents: { title: "Find an agent", crumb: "Find an agent" },
  traders: { title: "Find a professional", crumb: "Find a professional" },
  builders: { title: "Find a builder", crumb: "Find a builder" },
  address: { title: "Search by address", crumb: "Address" },
  commercial: { title: "Find commercial", crumb: "Commercial" },
};

type BrowseSection = "all" | "popular" | "newly";

const SearchPage = () => {
  const [searchParams, setSearchParams] = useResultSearchParams();
  const [browseSection, setBrowseSection] = useState<BrowseSection>("all");
  const [serviceCategories, setServiceCategories] = useState<PublicServiceCategory[]>([...SERVICE_CATEGORIES]);
  const [agentTypes, setAgentTypes] = useState<PublicAgentType[]>([]);

  useEffect(() => {
    void getServiceCategories().then(setServiceCategories).catch(() => undefined);
    void getAgentTypes().then(setAgentTypes).catch(() => undefined);
  }, []);

  const searchCategories = buildSearchCategories(serviceCategories, agentTypes);

  const typeParam = searchParams.get("type");
  const queryParam = searchParams.get("q") || "";
  const sortParam = searchParams.get("sort_by") as SortType | null;
  const sort: SortType = ["featured", "newest", "oldest", "price-low", "price-high"].includes(sortParam || "")
    ? (sortParam as SortType)
    : "featured";
  const showMap = searchParams.get("map") === "1";

  const activeCategoryId =
    searchCategories.find((c) => c.resultType === typeParam || c.id === typeParam)?.id || "all";

  const rawTabParam = searchParams.get("tab");
  const normalizedTabParam = rawTabParam?.trim().toLowerCase() || "";
  const intentParam = searchParams.get("intent")?.trim().toLowerCase() || "";
  const routeIntentTab = !rawTabParam
    ? intentParam === "buy" ? "Buy"
      : intentParam === "rent" ? "Rent"
        : intentParam === "sell" ? "Sold"
          : null
    : null;
  const professionalTab = serviceCategories.find((category) =>
    category.label.trim().toLowerCase() === normalizedTabParam ||
    category.slug.trim().toLowerCase() === normalizedTabParam,
  )?.label;
  const dynamicAgentTab = agentTypeForLabel(rawTabParam, agentTypes)?.label
    || (normalizedTabParam === "real-estate" ? agentTypes.find((type) => type.slug === "real-estate-agent")?.label : null);
  const legacyAgentTab = normalizedTabParam === "agents" ? (agentTypes[0]?.label || "Buyer Agents") : null;
  const tabParam = normalizedTabParam === "buy" ? "Buy" : normalizedTabParam === "rent" ? "Rent" : normalizedTabParam === "lease" ? "Lease" : normalizedTabParam === "sold" ? "Sold" : normalizedTabParam === "leased" ? "Leased" : normalizedTabParam === "builders" ? "Builders" : normalizedTabParam === "traders" ? "Traders" : dynamicAgentTab || legacyAgentTab || professionalTab || routeIntentTab || null;
  const [activeTab, setActiveTab] = useState<FilterTab | null>((tabParam as FilterTab) || null);

  useEffect(() => {
    setActiveTab((tabParam as FilterTab) || "All");
  }, [tabParam]);

  const activeCategory = searchCategories.find((c) => c.id === activeCategoryId) || searchCategories[0];
  const resultType = activeCategory.resultType;
  const { crumb: defaultCrumb } = HEADERS[activeCategoryId] || HEADERS.all;
  const crumb = activeTab && agentTypes.some((type) => type.label === activeTab) ? "Find an agent" : defaultCrumb;

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
      next.delete("transaction_status");
      next.delete("service_slug");
      next.delete("agent_type");
      if (!tab) {
        next.delete("tab");
        next.set("type", activeCategoryId);
        return;
      }
      const serviceSlug = serviceSlugForLabel(tab, serviceCategories);
      const agentType = agentTypeForLabel(tab, agentTypes);
      next.set("type", tab === "Traders" || serviceSlug ? "trader" : "builder");
      if (agentType) next.set("agent_type", agentType.slug);
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

  const breadcrumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
  if (activeTab && activeTab !== "All") {
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
  const resultViewKey = searchParams.toString();
  if (browseSection !== "all") {
    content = <FullListView key={resultViewKey} resultType={resultType} section={browseSection} tab={activeTab} />;
  } else if (activeTab || showMap) {
    content = <ResultsView key={resultViewKey} resultType={resultType} selectedSub={activeTab || ""} showMap={showMap} onViewMore={setBrowseSection} />;
  } else {
    content = <BrowseView key={resultViewKey} resultType={resultType} onViewMore={setBrowseSection} />;
  }

  return (
    <div className="min-h-screen bg-[#F8F4EE] pt-24 pb-16 font-helvetica">
      <div className="mx-auto pl-[3%] md:px-[3%] ">
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
          serviceCategories={serviceCategories}
          agentTypes={agentTypes}
        />
        <div className="mt-3 flex flex-col gap-6">{content}</div>
      </div>
    </div>
  );
};

export default SearchPage;
