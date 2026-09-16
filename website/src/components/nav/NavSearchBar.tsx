import { useState, useRef, useEffect } from "react";
import { Search, SlidersHorizontal, X, TrendingUp, Sparkles } from "lucide-react";
import Filter from "../filter/Filter";
import { useNavigate } from "react-router-dom";

const TRENDING = ["Electricians*", "Plumbers*", "Builders", "Landscapers", "Painters", "Conveyancers"];

export const NavSearchButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="flex items-center justify-center rounded-[0.9375rem]" aria-label="Open search">
    <Search size={24} color="white" />
  </button>
);

export const SearchOverlay = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const navigate = useNavigate();

  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 180);
    } else {
      setQuery("");
      setFilters([]);
    }
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && !filterOpen && !panelRef.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, filterOpen]);

  const onSearch = () => query.trim() && (onClose(), navigate(`/result?q=${encodeURIComponent(query)}`));
  const addFilter = (lbl: string) => (setQuery(lbl), !filters.includes(lbl) && setFilters([...filters, lbl]), inputRef.current?.focus());

  return (
    <div className={`fixed inset-0 z-40  flex items-start justify-center pt-28 px-4 transition-colors duration-300 ${open ? "bg-black/40 pointer-events-auto" : "bg-transparent pointer-events-none"}`}>
      <div className="w-full max-w-[980px]  rounded-xl origin-top transition-all bg-[#F8F4EE] duration-300" style={{ transform: open ? "scale(1)" : "scale(0.88)", opacity: open ? 1 : 0 }}>
        <div ref={panelRef} className="w-full rounded-2xl origin-top overflow-hidden">

          <div className="flex items-start gap-3 p-4 pb-0">
            <div className="flex flex-1 h-[54px] items-center rounded-xl border border-[#EDE8E4] bg-white overflow-hidden">
              <div className="flex w-full h-full items-center pl-4 pr-1.5">
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSearch()}
                  placeholder="Electricians in Footscray VIC 3011"
                  className="h-full flex-1 outline-none text-primary-brown bg-transparent placeholder:text-gray-400 text-[15px]"
                />
                <button onClick={() => setFilterOpen(true)} className="px-3 text-primary-brown rotate-90 hover:opacity-70">
                  <SlidersHorizontal size={20} />
                </button>
                <button onClick={onSearch} className="flex h-[42px] px-[1.875rem] py-[0.9375rem] rounded-[62.4375rem] shrink-0 items-center justify-center  bg-primary-brown text-white hover:opacity-90">
                  <Search size={18} /> Search
                </button>
              </div>
            </div>

            <button onClick={() => { }} className="flex h-[54px] shrink-0 items-center gap-2 rounded-[12px] bg-gradient-to-tr from-[#79241D] to-[#DF4235] px-5 text-[15px] font-semibold text-white hover:opacity-90">
              <Sparkles size={17} /> Ask Ai
            </button>
          </div>

          {/* Active Filters */}
          {filters.length > 0 && (
            <div className="flex flex-wrap gap-2 px-4 pt-3">
              {filters.map((f) => (
                <span key={f} className="flex items-center gap-1.5 rounded-full bg-[#E2CBB3] px-3.5 py-1.5 text-[13px] font-medium text-primary-brown">
                  {f} <button onClick={() => setFilters(filters.filter((x) => x !== f))}><X size={13} strokeWidth={2.5} /></button>
                </span>
              ))}
            </div>
          )}

          <div className="p-4 pt-3">
            {/* Trending Searches */}
            <div className="flex flex-wrap gap-2">
              {TRENDING.map((lbl) => {
                const isTrend = lbl.endsWith("*");
                const text = isTrend ? lbl.slice(0, -1) : lbl;
                return (
                  <button key={text} onClick={() => addFilter(text)} className="flex items-center gap-1.5 rounded-full border border-[#EDE8E4] bg-white px-4 py-2 text-[13px] text-primary-brown hover:bg-white-50">
                    {isTrend && <TrendingUp size={13} className="text-primary-light-brown" />}{text}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Filter isOpen={filterOpen} onClose={() => setFilterOpen(false)} initialTab="Buy" />
    </div>
  );
};