import { useEffect, useRef, useState } from "react";
import {
  SlidersHorizontal,
  Sparkles,
  ChevronDown,
  Check,
  
} from "lucide-react";
import Filter from "../filter/Filter";
import { useScrollFade } from "./FloatingSearch";
import { useNavigate } from "react-router-dom";
import type { ResultType } from "../../types/search";
import All from "../../assets/icons/search/search.svg"
import Build from "../../assets/icons/search/build.svg"
import Prop from "../../assets/icons/search/property.svg"
import Trader from "../../assets/icons/search/trades.svg"



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
    resultType: "property",
  },
  {
    id: "properties",
    label: "Properties",
    title: "PROPERTIES",
    desc: "Find properties to buy or rent",
    icon: Build,
    resultType: "property",
  },
  {
    id: "builders",
    label: "Builders & Organisations",
    title: "BUILDERS / ORGANISATIONS",
    desc: "Discover trusted property businesses",
    icon: Prop,
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
];

type Mode = "collapsed" | "search" | "ai";
type Props = { mode: Mode; setMode: (m: Mode) => void };

const HeroSearchBar = ({ mode, setMode }: Props) => {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selected, setSelected] = useState(CATEGORIES[0]);

  const rootRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useScrollFade(rootRef, "out");
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      if (
        e instanceof MouseEvent &&
        dropdownRef.current?.contains(e.target as Node)
      )
        return;
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
    const params = new URLSearchParams({ type: selected.resultType });
    if (query) params.set("q", query);
    navigate(`/result?${params.toString()}`);
  };

  return (
    <div ref={rootRef} className="mx-auto w-full  max-w-4xl relative">
      <div className="flex w-full items-center p-2 rounded-2xl border border-white/40 bg-white/30 backdrop-blur-md shadow-lg">
        <div className="flex flex-1 items-center bg-white rounded-xl h-14 px-5 shadow-sm relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && goToResults()}
            placeholder="Try '3-bedroom house in Richmond' or 'mortgage broker in Sydney'"
            className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-500 text-[15px]"
          />
          <div className="w-[1px] h-6 bg-gray-200 mx-4 hidden sm:block" />

          <div className="relative ml-10 hidden sm:block" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              aria-expanded={dropdownOpen}
              className="flex items-center gap-2 text-gray-500 text-[15px] hover:text-gray-700 transition max-w-[160px]"
            >
              <span className="truncate">{selected.label}</span>
              <ChevronDown
                size={16}
                className={`flex-shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {dropdownOpen && (
              <div
                role="menu"
                className="absolute -left-30 bottom-full mb-10 w-[25rem] bg-white rounded-3xl shadow-2xl border border-gray-100 p-5 z-50"
              >
                <h3 className="text-[0.875rem] font-medium text-primary-brown  mb-3 px-2">
                  Categories options
                </h3>
                <div className="flex flex-col gap-1 max-h-80 overflow-y-auto ">
                  {CATEGORIES.map((cat) => {
                    const active = selected.id === cat.id;
                    return (
                      <button
                        key={cat.id}
                        role="menuitemradio"
                        aria-checked={active}
                        onClick={() => {
                          setSelected(cat);
                          setDropdownOpen(false);
                        }}
                        className={`flex items-center gap-4 p-2 rounded-xl text-left border border-white  transition ${active ? "bg-[#A65B40]/10" : "  hover:border-gray-50"}`}
                      >
                        <div
                          className={`w-14 h-14 flex-shrink-0 rounded-lg flex items-center justify-center bg-[#EDE8E4] ${active ? " text-white" : " text-[#A65B40]"}`}
                        >
                          <img src={cat.icon} alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-primary-brown tracking-wide uppercase">
                            {cat.title}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {cat.desc}
                          </div>
                        </div>
                        {active && (
                          <Check
                            size={18}
                            className="text-[#A65B40] flex-shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setFilterOpen(true)}
            className="ml-4 text-gray-500 hover:text-gray-800 transition"
          >
            <SlidersHorizontal size={20} />
          </button>
        </div>

        <button
          onClick={() => setMode("ai")}
          className="ml-2 flex flex-shrink-0   items-center justify-center gap-2 h-14 px-4 py-[0.5rem] rounded-xl bg-gradient-to-br from-[#79241D] to-[#DF4235] text-white font-medium shadow-md shadow-red-900/20 hover:from-[#d13a3a] hover:to-[#9e1c1c] transition border border-red-800/30"
        >
          <Sparkles size={18} fill="white" />
          Ask Ai
        </button>
      </div>

      <Filter
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
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
