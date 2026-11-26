import { useEffect, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  SlidersHorizontal,
  Sparkles,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Filter from "../filter/Filter";
import { useScrollFade } from "./FloatingSearch";

import { SEARCH_TAB_CATEGORIES, type Category, type PropType } from "../../constants/categories";

type Mode = "collapsed" | "search" | "ai";
type Props = { mode: Mode; setMode: (m: Mode) => void };

// 4 rows × 40px + 12px padding
const LIST_MAX_HEIGHT = 172;

const HeroSearchBar = ({ mode, setMode }: Props) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(SEARCH_TAB_CATEGORIES[0]);
  const [propType, setPropType] = useState<PropType | undefined>(
    SEARCH_TAB_CATEGORIES[0].propTypes[0],
  );
  const [typeOpen, setTypeOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useScrollFade(rootRef, "out");

  useEffect(() => {
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (e instanceof MouseEvent && typeRef.current?.contains(e.target as Node)) return;
      setTypeOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  // One place to switch category (used by mobile + desktop)
  const selectCategory = (cat: Category) => {
    setSelected(cat);
    setPropType(cat.propTypes[0]); // undefined when the category has no types
    setTypeOpen(false);
  };

  const goToResults = (overridePropType?: PropType) => {
    if (mode === "ai") return;

    // Address search requires input
    if (selected.id === "address" && !query.trim()) return;

    const targetType = selected.defaultTab ? "real-estate" : selected.id;
    const params = new URLSearchParams({ type: targetType });

    if (query) {
      params.set(selected.id === "address" ? "location" : "q", query);
    }

    const activePropType = overridePropType || propType;
    if (selected.defaultTab) {
      params.set("tab", selected.defaultTab);
    } else if (activePropType && activePropType.id !== "all") {
      params.set("tab", activePropType.id);
    }

    navigate(`/result?${params.toString()}`);
  };

  // ── Category tabs (shared by mobile + desktop) ───────────────────────────────
  const tabs = (list: Category[], className: string) => (
    <div className="flex items-center gap-1 w-full">
      {list.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => selectCategory(cat)}
          className={`group flex-1 min-w-0 flex items-center justify-center rounded-xl font-medium whitespace-nowrap transition-all duration-200 ${className} ${selected.id === cat.id
            ? "bg-primary-brown text-white shadow-sm"
            : "text-primary-brown bg-[#f0ebe4] hover:bg-[#e8e0d8]"
            }`}
        >
          <p>{cat.label}</p>
        </button>
      ))}
    </div>
  );

  // ── Type dropdown (fixed width, scrolls with wheel, shows 4 rows) ────────────
  const typeDropdown = propType && (
    <div ref={typeRef} className="relative shrink-0 w-[180px]">
      <button
        type="button"
        onClick={() => setTypeOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 text-[#6B7280] text-[15px] hover:text-[#342511] transition"
      >
        <span className="truncate">{propType.label}</span>
        <ChevronDown
          size={15}
          className={`shrink-0 transition-transform duration-200 ${typeOpen ? "rotate-180" : ""}`}
        />
      </button>

      {typeOpen && (
        <div className="absolute right-0 bottom-full mb-4 w-56 bg-white rounded-2xl shadow-xl border border-[#EDE8E4] z-50 overflow-hidden">
          <div
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            style={{ maxHeight: LIST_MAX_HEIGHT }}
            className="overflow-y-auto overscroll-contain p-1.5 [scrollbar-width:thin] [scrollbar-color:#D9CFC5_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#D9CFC5]"
          >
            {selected.propTypes.map((pt) => {
              const active = propType.id === pt.id;
              return (
                <button
                  key={pt.id}
                  type="button"
                  onClick={() => {
                    setPropType(pt);
                    setTypeOpen(false);
                  }}
                  className={`flex w-full h-10 items-center justify-between rounded-lg px-3 text-[15px] transition-colors hover:bg-[#F8F4EE] ${active
                    ? "bg-[#F8F4EE] font-medium text-[#342511]"
                    : "text-gray-700"
                    }`}
                >
                  <span className="truncate">{pt.label}</span>
                  {active && <Check size={16} className="shrink-0 text-[#562F00]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  const openAi = () => {
    setMode("ai");
    window.dispatchEvent(new CustomEvent("briksy:ai-ask", { detail: query.trim() }));
  };

  // ── Desktop input row ────────────────────────────────────────────────────────
  const divider = <div className="w-px h-8 bg-[#EDE8E4] shrink-0" />;

  const inputRow = (
    <div className="flex items-center gap-3">
      <div className="flex flex-1 items-center bg-white border border-[#EDE8E4] rounded-xl h-16 px-5 gap-3 shadow-sm">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && goToResults()}
          placeholder={selected.placeholder}
          className="flex-1 min-w-0 bg-transparent outline-none text-gray-700 placeholder:text-[#6B7280] text-base"
        />

        {selected.id !== "address" && (
          <>
            {divider}
            {typeDropdown && (
              <>
                {typeDropdown}
                {divider}
              </>
            )}
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="text-gray-500 hover:text-[#342511] transition p-1"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={20} />
            </button>
          </>
        )}

        <button
          type="button"
          onClick={() => goToResults()}
          aria-label="Search"
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#562F00] text-white hover:bg-[#3d2000] transition shrink-0"
        >
          <Search size={20} />
        </button>
      </div>

      {/* Ask AI — orange glow button */}
      <button
        type="button"
        onClick={openAi}
        className="group flex shrink-0 items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#F5551A]/40 shadow-[inset_0_0_20px_rgba(245,85,26,0.35)] text-[15px] text-[#F5551A] whitespace-nowrap transition  hover:scale-105 hover:opacity-90"
      >
        <Sparkles size={17} />
        <p>Ask AI</p>
      </button>
    </div>
  );

  useEffect(() => {
    const handleSelectTab = (e: Event) => {
      const targetId = (e as CustomEvent<{ categoryId: string }>).detail?.categoryId;
      const cat = SEARCH_TAB_CATEGORIES.find(
        (c) => c.id === targetId || (targetId === "real-estate" && c.id === "buy")
      );
      if (cat) selectCategory(cat);
    };
    window.addEventListener("briksy:select-hero-tab", handleSelectTab);
    return () => window.removeEventListener("briksy:select-hero-tab", handleSelectTab);
  }, []);

  const glass = "w-full rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md shadow-lg overflow-visible";

  return (
    <div ref={rootRef} id="hero-search-bar" className="mx-auto w-full max-w-5xl relative">
      {/* ── Mobile layout (< md) ── */}
      <div className={`md:hidden ${glass}`}>
        <div className="px-3 pt-3 pb-2">
          {tabs(SEARCH_TAB_CATEGORIES.slice(0, 5), "py-1.5 text-xs px-1")}
        </div>

        <div className=" pb-3 px-3 flex justify-between items-center space-x-2">
          <div className="flex items-center gap-2 w-full bg-white border border-[#EDE8E4] rounded-xl px-4 py-[18px] shadow-sm">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goToResults()}
              placeholder={selected.placeholder}
              className="flex-1 min-w-0 bg-transparent outline-none text-gray-700 placeholder:text-gray-500 text-[15px]"
            />
            {selected.id !== "address" && (
              <button
                type="button"
                onClick={() => setFilterOpen(true)}
                className="text-gray-500 hover:text-gray-800 transition"
                aria-label="Open filters"
              >
                <SlidersHorizontal size={20} />
              </button>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={openAi}
              className="flex shrink-0 items-center justify-center gap-2 h-10 px-3 rounded-3xl border-[3px] border-transparent
                [background:linear-gradient(110.61deg,#79241D_22.989%,#DF4235_86.442%)_padding-box,linear-gradient(290deg,#DF4235,#79241D)_border-box]
                text-[#FBF8F3] font-medium shadow-md shadow-red-900/20 hover:opacity-90 transition"
            >
              <Sparkles size={18} fill="#FBF8F3" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Desktop layout (≥ md) ── */}
      <div className={`hidden md:block ${glass}`}>
        <div className="px-3 pt-3 pb-2">{tabs(SEARCH_TAB_CATEGORIES, "py-2 text-[0.9rem]")}</div>
        <div className="px-3 pb-3">{inputRow}</div>
      </div>

      <Filter
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        category={selected.defaultTab ? "real-estate" : selected.id}
        initialTab={selected.defaultTab ? selected.label : (propType?.label || "All")}
      />
    </div>
  );
};

export default HeroSearchBar;