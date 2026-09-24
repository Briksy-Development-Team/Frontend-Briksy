import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Filter from "../filter/Filter";
import { useScrollFade } from "./FloatingSearch";

import type { ResultType } from "../../types/search";

import All from "../../assets/icons/search/search.svg";
import Build from "../../assets/icons/search/build.svg";
import Prop from "../../assets/icons/search/property.svg";
import Trader from "../../assets/icons/search/trades.svg";
import Comercial from "../../assets/icons/search/comercial.svg";

type Category = {
  id: string;
  label: string;
  title: string;
  desc: string;
  icon: string;
  resultType: ResultType;
};

const CATEGORIES: Category[] = [
  {
    id: "all",
    label: "ALL",
    title: "ALL",
    desc: "Explore everything BRIKSY offers",
    icon: All,
    resultType: "all",
  },
  {
    id: "properties",
    label: "Properties",
    title: "PROPERTIES",
    desc: "Find properties to buy or rent",
    icon: Prop,
    resultType: "property",
  },
  {
    id: "builders",
    label: "Builders / Org.",
    title: "BUILDERS / ORGANISATIONS",
    desc: "Discover trusted property businesses",
    icon: Build,
    resultType: "builder",
  },
  {
    id: "professionals",
    label: "Professionals",
    title: "PROFESSIONALS",
    desc: "Connect with skilled independent experts",
    icon: Trader,
    resultType: "trader",
  },
  {
    id: "Commercial",
    label: "Commercial",
    title: "Commercial",
    desc: "Find properties to rent",
    icon: Comercial,
    resultType: "comercial",
  },
];

type Mode = "collapsed" | "search" | "ai";
type Props = {
  mode: Mode;
  setMode: (m: Mode) => void;
};

const HeroSearchBar = ({ mode, setMode }: Props) => {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(CATEGORIES[0]);

  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useScrollFade(rootRef, "out");

  // Close mobile dropdown on outside click / Escape
  useEffect(() => {
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;

      if (
        e instanceof MouseEvent &&
        dropdownRef.current?.contains(e.target as Node)
      ) {
        return;
      }

      setDropdownOpen(false);
    };

    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);

    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, []);

  const goToResults = () => {
    if (mode === "ai") return;

    const params = new URLSearchParams({
      type: selected.resultType,
    });

    if (query) params.set("q", query);

    navigate(`/result?${params.toString()}`);
  };

  const searchInput = (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && goToResults()}
      placeholder="Try '3-bedroom house in Richmond' or 'mortgage broker in Sydney'"
      className="flex-1 min-w-0 bg-transparent outline-none text-gray-700 placeholder:text-gray-500 text-[15px]"
    />
  );

  const filterButton = (
    <button
      type="button"
      onClick={() => setFilterOpen(true)}
      className="text-gray-500 hover:text-gray-800 transition"
    >
      <SlidersHorizontal size={20} />
    </button>
  );

  const aiButton = (
    <button
      type="button"
      onClick={() => setMode("ai")}
      className="
      flex shrink-0 items-center justify-center gap-2 h-10 px-2 mt-1 md:h-12 md:mt-0 md:px-4 md:py-2 rounded-[0.375rem] border-[3px] border-transparent
      [background:linear-gradient(110.61deg,#79241D_22.989%,#DF4235_86.442%)_padding-box,linear-gradient(290deg,#DF4235,#79241D)_border-box]
      text-[#FBF8F3] font-medium shadow-md shadow-red-900/20 hover:opacity-90 transition
    "
    >
      <Sparkles size={18} fill="#FBF8F3" />
      Ask Ai
    </button>
  );

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
        <div className="absolute left-0 bottom-full mb-4 w-[70vw] sm:w-[25rem] max-w-[25rem] bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 z-50">
          <h3 className="text-[0.875rem] font-medium text-primary-brown mb-3 px-2">
            Categories options
          </h3>

          <div className="flex flex-col gap-1">
            {CATEGORIES.map((cat) => {
              const active = selected.id === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setSelected(cat);
                    setDropdownOpen(false);
                  }}
                  className={`flex items-center gap-4 p-2 rounded-xl text-left border transition hover:bg-[#F3F4F3] ${
                    active ? "border-primary-brown" : "border-white"
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
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  // ── Desktop tab strip (≥ md) ────────────────────────────────────────────────
  const desktopTabs = (
    <div className="flex items-center gap-1 w-full">
      {CATEGORIES.map((cat) => {
        const active = selected.id === cat.id;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelected(cat)}
            className={`flex-1 flex items-center justify-center py-[0.5rem] rounded-[0.75rem] text-[0.9rem] font-medium whitespace-nowrap transition-all duration-200 ${
              active
                ? "bg-[#342511] text-white shadow-sm"
                : "text-[#342511] bg-[#f0ebe4] hover:bg-[#e8e0d8]"
            }`}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-4xl relative">
      {/* ── Mobile layout (< md) ── */}
      <div className="md:hidden bg-white border border-[#ede8e4] rounded-[12px] shadow-lg overflow-visible">
        <div className="flex items-center gap-2 px-4 py-[18px]">
          {searchInput}
          {filterButton}
        </div>

        <div className="border-t border-[#ede8e4] w-full px-2 flex justify-between h-[49px]">
          <div className="flex items-center pl-2">{mobileDropdown}</div>
          {aiButton}
        </div>
      </div>

      {/* ── Desktop layout (≥ md) ── */}
      <div className="hidden md:block w-full rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md shadow-lg overflow-hidden">
        {/* Tab row — full width across the entire card */}
        <div className="px-3 pt-3 pb-2">{desktopTabs}</div>

        {/* Search row */}
        <div className="flex items-center gap-2 px-3 pb-3">
          <div className="flex flex-1 items-center bg-white rounded-xl h-14 px-5 shadow-sm gap-3">
            {searchInput}
            <div className="w-[1px] h-6 bg-gray-200 shrink-0" />
            {filterButton}
          </div>

          {aiButton}
        </div>
      </div>

      <Filter
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        category={selected.id}
        initialTab={
          selected.id === "builders"
            ? "Builders"
            : selected.id === "professionals"
              ? "Traders"
              : "Buy"
        }
      />
    </div>
  );
};

export default HeroSearchBar;
