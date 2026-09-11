import { useEffect, useRef, useState } from "react";
import {
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
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
    label: "All Categories",
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
    label: "BUILDERS / Org.",
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
      placeholder="Try '3-bedroom house in Richmond'…"
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
      className="flex shrink-0 items-center justify-center gap-2 h-12 px-4 py-2 rounded-[0.375rem] bg-gradient-to-br from-[#79241D] to-[#DF4235] text-white font-medium shadow-md shadow-red-900/20 hover:from-[#d13a3a] hover:to-[#9e1c1c] transition border border-red-800/30"
    >
      <Sparkles size={18} fill="white" />
      Ask Ai
    </button>
  );

  const dropdown = (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setDropdownOpen((v) => !v)}
        className="flex items-center gap-2 text-gray-500 text-[15px] hover:text-gray-700 transition w-[160px]"
      >
        <span className="truncate">{selected.label}</span>
        {/* <ChevronDown
          size={16}
          className={`transition-transform ${dropdownOpen ? "rotate-180" : ""
            }`}
        /> */}
      </button>

      {dropdownOpen && (
        <div className="absolute left-0 md:-left-12 bottom-full mb-4 md:mb-10 w-[70vw] sm:w-[25rem] max-w-[25rem] bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 md:p-5 z-50">
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
                  className={`flex items-center gap-4 p-2 rounded-xl text-left border transition hover:bg-[#F3F4F3] ${active ? "border-primary-brown" : "border-white"
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

  return (
    <div ref={rootRef} className="mx-auto w-full max-w-4xl relative">

      {/* Mobile */}
      <div className="md:hidden bg-white border border-[#ede8e4] rounded-[12px] shadow-lg overflow-visible">
        <div className="flex items-center gap-2 px-4 py-[18px]">
          {searchInput}
          {filterButton}
        </div>

        <div className="border-t border-[#ede8e4] flex h-[49px]">
          <div className="flex-1 flex items-center px-4">
            {dropdown}
          </div>

          {aiButton}
        </div>
      </div>

      {/* Desktop */}
      <div className="hidden md:flex w-full items-center p-2 rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md shadow-lg">
        <div className="flex flex-1 items-center bg-white rounded-xl h-14 px-5 shadow-sm">
          {searchInput}

          <div className="w-[1px] h-6 bg-gray-200 mx-4" />

          {dropdown}

          <div className="ml-4">
            {filterButton}
          </div>
        </div>

        <div className="ml-2">
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
        agentCategory=""
      />
    </div>
  );
};

export default HeroSearchBar;