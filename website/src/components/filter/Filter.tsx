import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import PropertyFilters from "./panels/PropertyFilters";
import BuilderFilters from "./panels/BuilderFilters";
import AgentFilters from "./panels/AgentFilters";
import TradeFilters from "./panels/TradeFilters";
import type {
  FilterTab,
  BuilderMode,
  AgentType,
  BuyFilters,
  SoldFilters,
  BuilderProfileFilters,
  AgentFiltersType,
  TradeFiltersType,
} from "./filterTypes";
import {
  DEFAULT_BUY_FILTERS,
  DEFAULT_SOLD_FILTERS,
  DEFAULT_BUILDER_PROFILE_FILTERS,
  DEFAULT_AGENT_FILTERS,
  DEFAULT_TRADE_FILTERS,
} from "./filterTypes";

type FilterProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: FilterTab;
  builderMode?: BuilderMode;
  agentCategory?: string; 
};

const TABS: { label: string; value: FilterTab }[] = [
  { label: "Buy", value: "Buy" },
  { label: "Sold", value: "Sold" },
  { label: "Builders", value: "Builders" },
  { label: "Agents", value: "Agents" },
  { label: "Traders", value: "Traders" },
];

const Filter = ({
  isOpen,
  onClose,
  initialTab = "Buy",
  builderMode = "profiles",
  agentCategory,
}: FilterProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<FilterTab>(initialTab);

  const [buy, setBuy] = useState<BuyFilters>(DEFAULT_BUY_FILTERS);
  const [sold, setSold] = useState<SoldFilters>(DEFAULT_SOLD_FILTERS);
  const [builderProfile, setBuilderProfile] = useState<BuilderProfileFilters>(
    DEFAULT_BUILDER_PROFILE_FILTERS,
  );
  const [builderListings, setBuilderListings] =
    useState<BuyFilters>(DEFAULT_BUY_FILTERS);
  const [agents, setAgents] = useState<AgentFiltersType>(DEFAULT_AGENT_FILTERS);
  const [trades, setTrades] = useState<TradeFiltersType>(DEFAULT_TRADE_FILTERS);

  useEffect(() => {
    if (isOpen) setActiveTab(initialTab);
  }, [isOpen, initialTab]);

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const body = document.body;
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      body.style.overflow = "";
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const agentType: AgentType = agentCategory?.toLowerCase().includes("buyer")
    ? "buyers"
    : "real-estate";

  const handleClear = () => {
    switch (activeTab) {
      case "Buy":
        setBuy(DEFAULT_BUY_FILTERS);
        break;
      case "Sold":
        setSold(DEFAULT_SOLD_FILTERS);
        break;
      case "Builders":
        setBuilderProfile(DEFAULT_BUILDER_PROFILE_FILTERS);
        setBuilderListings(DEFAULT_BUY_FILTERS);
        break;
      case "Agents":
        setAgents(DEFAULT_AGENT_FILTERS);
        break;
      case "Traders":
        setTrades(DEFAULT_TRADE_FILTERS);
        break;
    }
  };

  const handleApply = () => {
    const typeMap: Record<FilterTab, string> = {
      Buy: "property",
      Sold: "property",
      Builders: "builder",
      Agents: "trader",
      Traders: "trader",
    };
    const params = new URLSearchParams({
      type: typeMap[activeTab],
      tab: activeTab.toLowerCase(),
    });
    if (activeTab === "Agents" && agentCategory) {
      params.set("category", agentCategory);
    }
    navigate(`/result?${params.toString()}`);
    onClose();
  };

  const panel = (
    <>
      <div
        className={`fixed inset-0 z-[99998] bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
          }`}
        onClick={onClose}
      />

      <div
        className={`fixed z-[99999] flex flex-col bg-white shadow-2xl transition-all duration-300 ease-out
    bottom-0 left-0 right-0 h-[92vh] rounded-t-3xl
    md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:h-auto md:max-h-[90vh] md:w-[60vw]
    md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl
    ${isOpen
            ? "translate-y-0 md:opacity-100 md:scale-100"
            : "translate-y-full md:opacity-0 md:scale-95 md:pointer-events-none"
          }`}
      >
        <div className="flex shrink-0 items-center justify-between  border-gray-100 px-6 py-5">
          <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400  transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-wrap justify-center  mx-auto shrink-0 overflow-x-auto gap-3  pb-3 border-gray-100 px-2 scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`shrink-0 border-2 rounded-xl hover:cursor-pointer px-6 sm:px-8 md:px-8 xl:px-14 py-2 text-sm font-medium transition-all ${activeTab === tab.value
                  ? "bg-[#3D2C1D] text-white"
                  : "border-[#DBDAD3]   hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        
        <div
          className="flex-1 overflow-y-auto overscroll-contain px-6 py-6"
          style={
            {
              touchAction: "pan-y",
              WebkitOverflowScrolling: "touch",
            } as React.CSSProperties
          }
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          {activeTab === "Buy" && (
            <PropertyFilters mode="Buy" values={buy} onChange={setBuy} />
          )}
          {activeTab === "Sold" && (
            <PropertyFilters mode="Sold" values={sold} onChange={setSold} />
          )}
          {activeTab === "Builders" && (
            <BuilderFilters
              mode={builderMode}
              profileValues={builderProfile}
              onProfileChange={setBuilderProfile}
              listingsValues={builderListings}
              onListingsChange={setBuilderListings}
            />
          )}
          {activeTab === "Agents" && (
            <AgentFilters
              agentType={agentType}
              values={agents}
              onChange={setAgents}
            />
          )}
          {activeTab === "Traders" && (
            <TradeFilters values={trades} onChange={setTrades} />
          )}
        </div>

        
        <div className="flex shrink-0 items-center justify-between border-t border-gray-100 px-6 py-4">
          <button
            onClick={handleClear}
            className="text-sm font-medium text-gray-500 hover:cursor-pointer underline underline-offset-2 hover:text-gray-800 transition-colors"
          >
            Clear filters
          </button>
          <button
            onClick={handleApply}
            className="rounded-xl bg-[#3D2C1D] px-8 py-3 text-sm font-medium hover:cursor-pointer text-white transition-colors hover:bg-[#2c1f14]"
          >
            Show results
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(panel, document.body);
};

export default Filter;
