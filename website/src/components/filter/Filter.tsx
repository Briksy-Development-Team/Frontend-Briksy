import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import FilterPanel from "./panels/FilterPanel";
import type { FilterMode } from "./filterConfig";
import { SERVICE_CATEGORIES, serviceSlugForLabel } from "../../constants/serviceCategories";

type FilterProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: FilterMode;
  category?: string;
};

const ALL_TABS: { label: string; value: FilterMode }[] = [
  { label: "Buy", value: "Buy" },
  { label: "Rent", value: "Rent" },
  { label: "Lease", value: "Lease" },
  { label: "Sold", value: "Sold" },
  { label: "Leased", value: "Leased" },
  { label: "Builders", value: "Builders" },
  { label: "Organizations", value: "Agents" },
  { label: "Sole Traders", value: "Traders" },
  ...SERVICE_CATEGORIES.map((category) => ({ label: category.label, value: category.label as FilterMode })),
];

const TABS_BY_CATEGORY: Record<string, FilterMode[]> = {
  all: ["Buy", "Rent", "Sold", "Builders", "Agents", "Traders"],
  properties: ["Buy", "Rent", "Sold"],
  builders: ["Builders", "Agents"],
  professionals: ["Traders", ...SERVICE_CATEGORIES.map((category) => category.label as FilterMode)],
  commercial: ["Buy", "Lease", "Sold", "Leased"],
};

const getVisibleTabs = (category = "all") => {
  const allowed = TABS_BY_CATEGORY[category.toLowerCase()] ?? TABS_BY_CATEGORY.all;
  const seen = new Set<FilterMode>();
  return ALL_TABS.filter(
    (t) => allowed.includes(t.value) && !seen.has(t.value) && seen.add(t.value)
  );
};

const Filter = ({
  isOpen,
  onClose,
  initialTab = "Buy",
  category = "all",
}: FilterProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const visibleTabs = getVisibleTabs(category);
  const [activeTab, setActiveTab] = useState<FilterMode>(initialTab);
  const tabsScrollRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [currentValues, setCurrentValues] = useState<Record<string, any>>({});

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
    const params = new URLSearchParams(location.search);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const initial: Record<string, any> = {};
    params.forEach((val, key) => {
      const cleanKey = key.replace(/\[\]$/, "");
      const allVals = params.getAll(key);
      if (allVals.length > 1 || key.endsWith("[]")) {
        initial[cleanKey] = allVals;
      } else {
        initial[cleanKey] = val;
      }
    });

    setCurrentValues(initial);
  }, [isOpen, location.search]);

  // Handle locking body scroll when modal is open
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

  const handleClear = () => {
    setCurrentValues({});
    navigate(`${location.pathname}`, { replace: true });
  };

  const handleApply = () => {
    const params = new URLSearchParams();

    params.set("tab", activeTab.toLowerCase());
    params.set("page", "1");

    const typeMap: Record<FilterMode, string> = {
      Buy: "property", Rent: "property", Lease: "comercial", Sold: "property", Leased: "comercial",
      Builders: "builder", Agents: "builder", Traders: "trader",
      Landscappers: "trader", Concreter: "trader", Fencing: "trader", "Mortgage Brokers": "trader", Conveyancers: "trader", "Building and Pest": "trader",
    };
    params.set("type", typeMap[activeTab]);

    if (category.toLowerCase() === "commercial") {
      params.set("category", "commercial");
    }

    if (activeTab === "Buy") params.set("purpose", "sell");
    if (activeTab === "Rent") params.set("purpose", "rent");
    const serviceSlug = serviceSlugForLabel(activeTab);
    if (serviceSlug) params.set("service_slug", serviceSlug);
    if (category.toLowerCase() === "commercial" && ["Buy", "Lease", "Sold", "Leased"].includes(activeTab)) {
      params.set("type", "comercial");
      params.set("transaction_status", activeTab.toUpperCase());
    }

    Object.entries(currentValues).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      if (Array.isArray(value)) {
        if (value.length > 0) {
          value.forEach(v => params.append(`${key}[]`, String(v)));
        }
      } else {
        // Special mapping for keyword searching
        if (key === "keyword" && String(value).trim()) {
          params.set("q", String(value).trim());
        } else {
          params.set(key, String(value));
        }
      }
    });

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
          <FilterPanel key={activeTab} mode={activeTab} values={currentValues} onChange={setCurrentValues} />
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
