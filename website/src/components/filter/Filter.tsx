import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import PropertyFilters from "./panels/PropertyFilters";
import BuilderFilters from "./panels/BuilderFilters";
import AgentFilters from "./panels/AgentFilters";
import TradeFilters from "./panels/TradeFilters";
import type {
  FilterTab, BuilderMode, AgentType,
  BuyFilters, RentFilters, SoldFilters,
  BuilderProfileFilters, AgentFiltersType, TradeFiltersType,
} from "./filterTypes";
import {
  DEFAULT_BUY_FILTERS, DEFAULT_RENT_FILTERS, DEFAULT_SOLD_FILTERS,
  DEFAULT_BUILDER_PROFILE_FILTERS, DEFAULT_AGENT_FILTERS, DEFAULT_TRADE_FILTERS,
} from "./filterTypes";
import { filtersToPropertyParams, propertyQueryToParams } from "../../api/property/propertySearch";

const slugify = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/, "");

type FilterProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: FilterTab;
  builderMode?: BuilderMode;
  agentCategory?: string;
  category?: string;
};

const ALL_TABS: { label: string; value: FilterTab }[] = [
  { label: "Buy", value: "Buy" },
  { label: "Rent", value: "Rent" },
  { label: "Sold", value: "Sold" },
  { label: "Builders", value: "Builders" },
  { label: "Organizations", value: "Agents" },
  { label: "Sole Traders", value: "Traders" },
];

const TABS_BY_CATEGORY: Record<string, FilterTab[]> = {
  all: ["Buy", "Rent", "Sold", "Builders", "Agents", "Traders"],
  properties: ["Buy", "Rent", "Sold"],
  builders: ["Builders", "Agents"],
  professionals: ["Traders"],
  commercial: ["Buy", "Rent"],
};

const getVisibleTabs = (category = "all") => {
  const allowed = TABS_BY_CATEGORY[category.toLowerCase()] ?? TABS_BY_CATEGORY.all;
  const seen = new Set<FilterTab>();
  return ALL_TABS.filter(
    (t) => allowed.includes(t.value) && !seen.has(t.value) && seen.add(t.value)
  );
};

const Filter = ({
  isOpen, onClose, initialTab = "Buy",
  builderMode = "profiles", agentCategory, category = "all",
}: FilterProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const visibleTabs = getVisibleTabs(category);
  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [buy, setBuy] = useState<BuyFilters>(DEFAULT_BUY_FILTERS);
  const [rent, setRent] = useState<RentFilters>(DEFAULT_RENT_FILTERS);
  const [sold, setSold] = useState<SoldFilters>(DEFAULT_SOLD_FILTERS);
  const [builderProfile, setBuilderProfile] = useState<BuilderProfileFilters>(DEFAULT_BUILDER_PROFILE_FILTERS);
  const [builderListings, setBuilderListings] = useState<BuyFilters>(DEFAULT_BUY_FILTERS);
  const [agents, setAgents] = useState<AgentFiltersType>(DEFAULT_AGENT_FILTERS);
  const [trades, setTrades] = useState<TradeFiltersType>(DEFAULT_TRADE_FILTERS);

  useEffect(() => {
    const btn = tabRefs.current[activeTab];
    const container = tabsScrollRef.current;
    if (!btn || !container) return;
    const btnLeft = btn.offsetLeft;
    const btnRight = btnLeft + btn.offsetWidth;
    const containerLeft = container.scrollLeft;
    const containerRight = containerLeft + container.offsetWidth;
    if (btnLeft < containerLeft + 16) container.scrollTo({ left: btnLeft - 16, behavior: "smooth" });
    else if (btnRight > containerRight - 16) container.scrollTo({ left: btnRight - container.offsetWidth + 16, behavior: "smooth" });
  }, [activeTab]);

  useEffect(() => {
    if (!isOpen) return;
    const tabs = getVisibleTabs(category);
    const values = tabs.map((t) => t.value);
    setActiveTab(values.includes(initialTab) ? initialTab : tabs[0]?.value ?? "Buy");
  }, [isOpen, initialTab, category]);

  useEffect(() => {
    if (!isOpen) return;
    const query = propertyQueryToParams(new URLSearchParams(location.search));
    const shared = {
      ...(query.search ? { keyword: query.search } : {}),
      ...(query.min_price !== undefined ? { priceMin: query.min_price } : {}),
      ...(query.max_price !== undefined ? { priceMax: query.max_price } : {}),
      ...(query.bedrooms !== undefined ? { bedrooms: query.bedrooms } : {}),
      ...(query.bathrooms !== undefined ? { bathrooms: query.bathrooms } : {}),
      ...(query.car_spaces !== undefined ? { carSpaces: query.car_spaces } : {}),
      ...(query.min_land_size !== undefined ? { landSizeMin: query.min_land_size } : {}),
      ...(query.max_land_size !== undefined ? { landSizeMax: query.max_land_size } : {}),
      ...(query.features?.length ? { features: query.features.map((feature) => ({ swimming_pool: "Pool", air_conditioning: "Air conditioning", solar_panels: "Solar panels", study: "Study", pet_friendly: "Pet-friendly" } as Record<string, string>)[feature]).filter(Boolean) } : {}),
      ...(query.category === "commercial" ? { propertyTypes: ["Commercial"] } : {}),
    };
    setBuy((current) => ({ ...current, ...shared }));
    setRent((current) => ({ ...current, ...shared }));
  }, [isOpen, location.search]);

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const body = document.body;
    Object.assign(body.style, { position: "fixed", top: `-${scrollY}px`, left: "0", right: "0", width: "100%", overflow: "hidden" });
    return () => {
      Object.assign(body.style, { position: "", top: "", left: "", right: "", width: "", overflow: "" });
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const agentType: AgentType = agentCategory?.toLowerCase().includes("buyer") ? "buyers" : "real-estate";

  const handleClear = () => {
    switch (activeTab) {
      case "Buy": setBuy(DEFAULT_BUY_FILTERS); break;
      case "Rent": setRent(DEFAULT_RENT_FILTERS); break;
      case "Sold": setSold(DEFAULT_SOLD_FILTERS); break;
      case "Builders": setBuilderProfile(DEFAULT_BUILDER_PROFILE_FILTERS); setBuilderListings(DEFAULT_BUY_FILTERS); break;
      case "Agents": setAgents(DEFAULT_AGENT_FILTERS); break;
      case "Traders": setTrades(DEFAULT_TRADE_FILTERS); break;
    }

    const params = new URLSearchParams(location.search);
    ["q", "search", "min_price", "max_price", "bedrooms", "bathrooms", "car_spaces", "min_land_size", "max_land_size", "features[]", "features", "suburb", "postcode", "page", "tab", "purpose", "intent", "service_slug"].forEach((key) => params.delete(key));
    if (category.toLowerCase() !== "commercial") params.delete("category");
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  const handleApply = () => {
    const typeMap: Record<FilterTab, string> = {
      Buy: "property", Rent: "property", Sold: "property",
      Builders: "builder", Agents: "builder", Traders: "trader",
    };
    const params = new URLSearchParams(location.search);
    params.set("type", typeMap[activeTab]);
    params.set("tab", activeTab.toLowerCase());
    params.set("page", "1");
    if (activeTab === "Agents" && agentCategory) params.set("category", agentCategory);
    params.delete("service_slug");
    params.delete("q");
    params.delete("search");
    params.delete("min_price");
    params.delete("max_price");
    params.delete("purpose");
    params.delete("intent");
    ["bedrooms", "bathrooms", "car_spaces", "min_land_size", "max_land_size", "features[]", "features"].forEach((key) => params.delete(key));
    if (activeTab === "Buy" || activeTab === "Rent") {
      const filters = activeTab === "Buy" ? buy : rent;
      const propertyParams = filtersToPropertyParams(filters);
      params.delete("category");
      if (propertyParams.search) params.set("q", propertyParams.search);
      if (propertyParams.min_price !== undefined) params.set("min_price", String(propertyParams.min_price));
      if (propertyParams.max_price !== undefined) params.set("max_price", String(propertyParams.max_price));
      if (propertyParams.bedrooms !== undefined) params.set("bedrooms", String(propertyParams.bedrooms));
      if (propertyParams.bathrooms !== undefined) params.set("bathrooms", String(propertyParams.bathrooms));
      if (propertyParams.car_spaces !== undefined) params.set("car_spaces", String(propertyParams.car_spaces));
      if (propertyParams.min_land_size !== undefined) params.set("min_land_size", String(propertyParams.min_land_size));
      if (propertyParams.max_land_size !== undefined) params.set("max_land_size", String(propertyParams.max_land_size));
      propertyParams.features?.forEach((feature) => params.append("features[]", feature));
      if (propertyParams.category) params.set("category", propertyParams.category);
      if (category.toLowerCase() === "commercial") params.set("category", "commercial");
      params.set("purpose", activeTab === "Buy" ? "sell" : "rent");
    }
    if (activeTab === "Sold") {
      const soldParams = filtersToPropertyParams({
        ...DEFAULT_BUY_FILTERS,
        propertyTypes: sold.propertyTypes,
        priceMin: sold.soldPriceMin,
        priceMax: sold.soldPriceMax,
        bedrooms: sold.bedrooms,
        bathrooms: sold.bathrooms,
        carSpaces: sold.carSpaces,
        landSizeMin: sold.landSizeMin,
        landSizeMax: sold.landSizeMax,
      });
      params.delete("category");
      if (soldParams.min_price !== undefined) params.set("min_price", String(soldParams.min_price));
      if (soldParams.max_price !== undefined) params.set("max_price", String(soldParams.max_price));
      if (soldParams.bedrooms !== undefined) params.set("bedrooms", String(soldParams.bedrooms));
      if (soldParams.bathrooms !== undefined) params.set("bathrooms", String(soldParams.bathrooms));
      if (soldParams.car_spaces !== undefined) params.set("car_spaces", String(soldParams.car_spaces));
      if (soldParams.min_land_size !== undefined) params.set("min_land_size", String(soldParams.min_land_size));
      if (soldParams.max_land_size !== undefined) params.set("max_land_size", String(soldParams.max_land_size));
      if (soldParams.category) params.set("category", soldParams.category);
      if (category.toLowerCase() === "commercial") params.set("category", "commercial");
      params.set("purpose", "sell");
    }
    if (activeTab === "Builders" && builderProfile.serviceArea.trim()) {
      params.set("q", builderProfile.serviceArea.trim());
    }
    if (activeTab === "Agents" && (agents.location.trim() || agents.agency.trim())) {
      params.set("q", agents.agency.trim() || agents.location.trim());
    }
    if (activeTab === "Traders") {
      if (trades.serviceArea.trim()) params.set("q", trades.serviceArea.trim());
      if (trades.categories[0]) params.set("service_slug", slugify(trades.categories[0]));
    }
    navigate(`/result?${params.toString()}`);
    onClose();
  };

  const handleTabsWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY === 0) return;
    e.currentTarget.scrollLeft += e.deltaY;
    e.preventDefault();
  };

  const panel = (
    <>
      <div
        className={`fixed inset-0 z-[99998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
      />
      <div
        className={`fixed z-[99999] flex flex-col overflow-hidden bg-white shadow-2xl transition-all duration-300 ease-out
          bottom-0 left-0 right-0 h-[92vh] rounded-t-3xl
          md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:h-auto md:max-h-[90vh] md:w-[60vw]
          md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl
          ${isOpen ? "translate-y-0 md:opacity-100 md:scale-100" : "translate-y-full md:opacity-0 md:scale-95 md:pointer-events-none"}`}
      >
        <div className="flex shrink-0 items-center justify-between px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button onClick={onClose} className="rounded-full p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>

        <div
          ref={tabsScrollRef}
          className="flex w-full shrink-0 overflow-x-auto gap-3 pb-3 mx-4 scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
          onWheel={handleTabsWheel}
        >
          {visibleTabs.map((tab) => (
            <button
              key={tab.value}
              ref={(el) => { tabRefs.current[tab.value] = el; }}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`shrink-0 border-2 rounded-xl cursor-pointer px-6 sm:px-8 md:px-8 xl:px-14 py-2 text-sm font-medium transition-all ${activeTab === tab.value ? "bg-[#3D2C1D] text-white border-[#3D2C1D]" : "border-[#DBDAD3] hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="flex-1 overflow-y-auto overscroll-contain px-6 py-6"
          style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {activeTab === "Buy" && <PropertyFilters mode="Buy" values={buy} onChange={setBuy} />}
          {activeTab === "Rent" && <PropertyFilters mode="Rent" values={rent} onChange={setRent} />}
          {activeTab === "Sold" && <PropertyFilters mode="Sold" values={sold} onChange={setSold} />}
          {activeTab === "Builders" && (
            <BuilderFilters
              mode={builderMode}
              profileValues={builderProfile}
              onProfileChange={setBuilderProfile}
              listingsValues={builderListings}
              onListingsChange={setBuilderListings}
            />
          )}
          {activeTab === "Agents" && <AgentFilters agentType={agentType} values={agents} onChange={setAgents} />}
          {activeTab === "Traders" && <TradeFilters values={trades} onChange={setTrades} />}
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-6 py-4">
          <button onClick={handleClear} className="text-sm font-medium text-gray-500 underline underline-offset-2 hover:text-gray-800 transition-colors">
            Clear filters
          </button>
          <button onClick={handleApply} className="rounded-xl bg-[#3D2C1D] px-8 py-3 text-sm font-medium text-white transition-colors hover:bg-[#2c1f14]">
            Show results
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(panel, document.body);
};

export default Filter;
