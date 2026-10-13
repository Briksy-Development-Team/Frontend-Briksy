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

import { SEARCH_CATEGORIES, type Category, type PropType } from "../../constants/searchCategories";



type Mode = "collapsed" | "search" | "ai";
type Props = { mode: Mode; setMode: (m: Mode) => void };

// 4 rows × 40px + 12px padding
const LIST_MAX_HEIGHT = 172;

const HeroSearchBar = ({ mode, setMode }: Props) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(SEARCH_CATEGORIES[0]);
  const [propType, setPropType] = useState<PropType | undefined>(
    SEARCH_CATEGORIES[0].propTypes[0],
  );
  const [typeOpen, setTypeOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // mobile category picker
  const [filterOpen, setFilterOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useScrollFade(rootRef, "out");

  useEffect(() => {
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (
        e instanceof MouseEvent &&
        (typeRef.current?.contains(e.target as Node) ||
          dropdownRef.current?.contains(e.target as Node))
      )
        return;
      setTypeOpen(false);
      setDropdownOpen(false);
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
    setDropdownOpen(false);
    setTypeOpen(false);
  };

  const goToResults = (overridePropType?: PropType) => {
    if (mode === "ai") return;

    // Address search requires input
    if (selected.id === "address" && !query.trim()) return;

    const params = new URLSearchParams({ type: selected.id });

    if (query) {
      if (selected.id === "address") {
        params.set("location", query);
      } else {
        params.set("q", query);
      }
    }

    const activePropType = overridePropType || propType;
    if (activePropType && activePropType.id !== "all")
      params.set("tab", activePropType.id);

    navigate(`/result?${params.toString()}`);
  };

  // ── Mobile category dropdown ─────────────────────────────────────────────────
  const mobileDropdown = (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        className="flex items-center gap-2 text-gray-500 text-[15px] hover:text-gray-700 transition w-[130px]"
      >
        <span className="truncate">{selected.label}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute left-0 bottom-full mb-4 w-[70vw] sm:w-[25rem] max-w-[28rem] bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50">
          <h3 className="text-[0.875rem] font-medium text-primary-brown mb-3 px-2">
            Categories options
          </h3>
          <div className="flex flex-col gap-1">
            {SEARCH_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => selectCategory(cat)}
                className={`flex items-center gap-4 p-2 rounded-xl text-left border transition hover:bg-[#F3F4F3] ${selected.id === cat.id
                  ? "border-primary-brown"
                  : "border-white"
                  }`}
              >
                <div className="w-14 h-14 shrink-0 rounded-lg flex items-center justify-center bg-[#EDE8E4]">
                  <img src={cat.icon} alt="" className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs lg:text-sm font-medium text-primary-brown tracking-wide uppercase">
                    {cat.title}
                  </div>
                  <div className="text-[0.6rem] lg:text-xs text-gray-500 mt-0.5">
                    {cat.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const desktopTabs = (
    <div className="flex items-center gap-1 w-full">
      {SEARCH_CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          onClick={() => selectCategory(cat)}
          className={`flex-1 flex items-center justify-center py-2 rounded-xl text-[0.9rem] font-medium whitespace-nowrap transition-all duration-200 ${selected.id === cat.id
            ? "bg-[#342511] text-white shadow-sm"
            : "text-[#342511] bg-[#f0ebe4] hover:bg-[#e8e0d8]"
            }`}
        >
          {cat.label}
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
        <span className="truncate">
          {propType.label}
        </span>
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
                  {active && (
                    <Check size={16} className="shrink-0 text-[#562F00]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

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
        onClick={() => setMode("ai")}
        className="flex shrink-0 items-center gap-2 px-5 py-3 rounded-full bg-white border border-[#F5551A]/40 shadow-[inset_0_0_20px_rgba(245,85,26,0.35)] text-[15px] text-[#F5551A] whitespace-nowrap transition hover:opacity-90"
      >
        <Sparkles size={17} />
        Ask AI
      </button>
    </div>
  );

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-5xl relative">
      {/* ── Mobile layout (< md) ── */}
      <div className="md:hidden bg-white border border-[#ede8e4] rounded-xl shadow-lg overflow-visible">
        <div className="flex items-center gap-2 px-4 py-[18px]">
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
            >
              <SlidersHorizontal size={20} />
            </button>
          )}
        </div>

        <div className="border-t border-[#ede8e4] w-full px-2 flex justify-between h-[49px]">
          <div className="flex items-center pl-2">{mobileDropdown}</div>
          <button
            type="button"
            onClick={() => setMode("ai")}
            className="flex shrink-0 items-center justify-center gap-2 h-10 px-2 mt-1 rounded-md border-[3px] border-transparent
              [background:linear-gradient(110.61deg,#79241D_22.989%,#DF4235_86.442%)_padding-box,linear-gradient(290deg,#DF4235,#79241D)_border-box]
              text-[#FBF8F3] font-medium shadow-md shadow-red-900/20 hover:opacity-90 transition"
          >
            <Sparkles size={18} fill="#FBF8F3" />
            Ask AI
          </button>
        </div>
      </div>

      {/* ── Desktop layout (≥ md) ── */}
      <div className="hidden md:block w-full rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md shadow-lg overflow-visible">
        <div className="px-3 pt-3 pb-2">{desktopTabs}</div>
        <div className="px-3 pb-3">{inputRow}</div>
      </div>

      <Filter
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        category={selected.id}
        initialTab={propType?.label || "All"}
      />
    </div>
  );
};

export default HeroSearchBar;
