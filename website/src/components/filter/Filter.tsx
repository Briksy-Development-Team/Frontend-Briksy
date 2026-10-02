import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import FilterPanel from "./panels/FilterPanel";
import { getFieldsForMode } from "./filterConfig";
import type { FilterMode } from "./filterConfig";
import { serviceSlugForLabel } from "../../constants/serviceCategories";
import { SEARCH_CATEGORIES } from "../../constants/searchCategories";

type FilterProps = {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: FilterMode;
  category?: string;
};

const getVisibleTabs = () => {
  return SEARCH_CATEGORIES.filter(c => c.id !== "address").map(c => ({
    label: c.label,
    value: c.id
  }));
};

const Filter = ({
  isOpen,
  onClose,
  initialTab,
  category = "real-estate",
}: FilterProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const visibleTabs = getVisibleTabs();
  const [activeTab, setActiveTab] = useState<string>(category);
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
    setActiveTab(category !== "all" && category !== "address" ? category : "real-estate");
  }, [isOpen, category]);

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

    // Handle initializing propertyFor from URL tab param or initialTab prop
    const tabParam = params.get("tab");
    if (tabParam) {
      const catConfig = SEARCH_CATEGORIES.find(c => c.id === activeTab);
      const match = catConfig?.propTypes.find(p => p.id.toLowerCase() === tabParam.toLowerCase() || p.label.toLowerCase() === tabParam.toLowerCase());
      if (match) initial.propertyFor = match.id;
    } else if (initialTab) {
      initial.propertyFor = initialTab.toLowerCase();
    }

    setCurrentValues(initial);
  }, [isOpen, location.search, activeTab, initialTab]);

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

    params.set("page", "1");
    params.set("type", activeTab);

    // Extract propertyFor from currentValues if it's there
    const categoryConfig = SEARCH_CATEGORIES.find(c => c.id === activeTab);
    const selectedPropType = currentValues.propertyFor;

    if (selectedPropType && selectedPropType !== "all" && selectedPropType.length > 0) {
      const propTypeValue = String(Array.isArray(selectedPropType) ? selectedPropType[0] : selectedPropType);
      params.set("tab", propTypeValue.toLowerCase());
      if (propTypeValue.toLowerCase() === "buy") params.set("purpose", "sell");
      if (propTypeValue.toLowerCase() === "rent") params.set("purpose", "rent");

      const serviceSlug = serviceSlugForLabel(propTypeValue);
      if (serviceSlug) params.set("service_slug", serviceSlug);

      if (activeTab === "commercial" && ["buy", "lease", "sold", "leased"].includes(propTypeValue.toLowerCase())) {
        params.set("transaction_status", propTypeValue.toUpperCase());
      }
    } else {
      params.set("tab", "all");
    }

    Object.entries(currentValues).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "" || key === "propertyFor") return;
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

  const handleTabChange = (newTab: string) => {
    if (newTab !== activeTab) {
      setActiveTab(newTab);
      setCurrentValues(prev => {
        const next = { ...prev };
        delete next.propertyFor;
        return next;
      });
    }
  };

  const modalWidthClass = "md:w-[90vw] lg:w-[75vw] xl:w-[65vw] max-w-6xl";

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
          md:bottom-auto md:left-1/2 md:right-auto md:top-1/2 md:h-[85vh] ${modalWidthClass}
          md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl
          ${isOpen ? "translate-y-0 md:opacity-100 md:scale-100" : "translate-y-full md:opacity-0 md:scale-95 md:pointer-events-none"}`}
      >
        <div className="px-6 pt-5 pb-4">
          <button onClick={onClose} className="p-1 -ml-1 text-gray-500 transition hover:text-gray-900 mb-2 block">
            <X size={24} strokeWidth={1.5} />
          </button>
          <h2 className="text-[22px] font-semibold text-[#333]">Filters</h2>
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
              onClick={() => handleTabChange(tab.value)}
              className={`shrink-0 border-2 rounded-xl cursor-pointer px-6 sm:px-8 md:px-8 xl:px-14 py-2 text-sm font-medium transition-all ${activeTab === tab.value ? "bg-[#3D2C1D] text-white border-[#3D2C1D]" : "border-[#DBDAD3] hover:text-gray-700"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div
          className="flex-1 overflow-y-auto md:overflow-hidden overscroll-contain px-6 py-6"
          style={{ touchAction: "pan-y", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <FilterPanel key={activeTab} mode={activeTab} values={currentValues} onChange={setCurrentValues} />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-[#EDE8E4] px-6 py-4">
          <button onClick={handleClear} className="rounded-[20px] border border-[#ccc] px-6 py-2.5 text-[14px] font-medium text-[#333] transition-colors hover:bg-gray-50">
            Clear filter
          </button>
          <button onClick={handleApply} className="rounded-[20px] bg-[#3D2C1D] px-6 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#2c1f14]">
            Show results
          </button>
        </div>
      </div>
    </>
  );

  return createPortal(panel, document.body);
};

export default Filter;
