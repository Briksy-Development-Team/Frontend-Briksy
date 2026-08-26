import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Search, SlidersHorizontal, Sparkles, AudioLines, X, TrendingUp, ArrowLeft } from "lucide-react";
import AiVoiceModal from "../search/AiVoiceModal";
import Filter from "../filter/Filter";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

const TRENDING = ["Electricians*", "Plumbers*", "Builders", "Landscapers", "Painters", "Conveyancers", "Properties"];
const AI_SUGGESTIONS = ["Electrical Solutions & Services", "Electrical Services & Solutions", "Expert Plumbing Services"];

export const NavSearchButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20" aria-label="Open search">
    <Search size={18} color="white" />
  </button>
);

export const SearchOverlay = ({ open, mode: initialMode, onClose }: { open: boolean; mode: "search" | "ai"; onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const [isAi, setIsAi] = useState(initialMode === "ai");
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState<string[]>([]);
  const navigate = useNavigate();

  const refs = {
    panel: useRef<HTMLDivElement>(null),
    input: useRef<HTMLInputElement>(null),
    searchBox: useRef<HTMLDivElement>(null),
    aiBtn: useRef<HTMLButtonElement>(null),
    searchContent: useRef<HTMLDivElement>(null),
    aiContent: useRef<HTMLDivElement>(null),
    row3Search: useRef<HTMLDivElement>(null),
    row3Ai: useRef<HTMLDivElement>(null),
  };

  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const mounted = useRef(false);

  useEffect(() => {
    if (open) {
      setIsAi(initialMode === "ai");
      setTimeout(() => refs.input.current?.focus(), 180);
    } else {
      setQuery("");
      setFilters([]);
    }
  }, [open, initialMode]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && !filterOpen && !voiceOpen && !refs.panel.current?.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, onClose, filterOpen, voiceOpen]);

  const switchMode = (toAi: boolean) => {
    if (toAi === isAi) return;
    const targets = [refs.panel.current, refs.searchBox.current, refs.aiBtn.current].filter(Boolean) as Element[];
    flipState.current = Flip.getState(targets, { props: "borderRadius,width,height" });
    setIsAi(toAi);
  };

  useLayoutEffect(() => {
    if (!mounted.current) return void (mounted.current = true);
    if (!flipState.current) return;

    const outContent = isAi ? refs.searchContent.current : refs.aiContent.current;
    const inContent = isAi ? refs.aiContent.current : refs.searchContent.current;
    const outRow3 = isAi ? refs.row3Search.current : refs.row3Ai.current;
    const inRow3 = isAi ? refs.row3Ai.current : refs.row3Search.current;

    gsap.set([outContent, inContent, outRow3, inRow3], { opacity: 0 });

    Flip.from(flipState.current, {
      duration: 0.5, ease: "power3.inOut", absolute: true, nested: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }),
      onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.9, duration: 0.2, ease: "power2.in" }),
    });

    gsap.to([inContent, inRow3], { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", delay: 0.25, stagger: 0.1 });
    setTimeout(() => refs.input.current?.focus(), 350);
    flipState.current = null;
  }, [isAi]);

  const onSearch = () => query.trim() && (onClose(), navigate(`/result?q=${encodeURIComponent(query)}`));
  const addFilter = (lbl: string) => (setQuery(lbl), !filters.includes(lbl) && setFilters([...filters, lbl]), refs.input.current?.focus());

  return (
    <div className={`fixed inset-0 z-40 flex items-start justify-center pt-28 px-4 transition-colors duration-300 ${open ? "bg-black/40 pointer-events-auto" : "bg-transparent pointer-events-none"}`}>
      <div className="w-full max-w-[780px] origin-top transition-all duration-300" style={{ transform: open ? "scale(1)" : "scale(0.88)", opacity: open ? 1 : 0 }}>
        <div ref={refs.panel} className="w-full rounded-2xl bg-[#EEECE0] shadow-2xl origin-top overflow-hidden">
          
          <div className="flex items-start gap-3 p-4 pb-0">
          <div ref={refs.searchBox} data-flip-id="search-box" className={`flex flex-1 rounded-xl border border-gray-100 bg-white overflow-hidden transition-none ${isAi ? "flex-col p-2 gap-2" : "h-[54px] items-center"}`}>
            
            {/* Search Content */}
            <div ref={refs.searchContent} className={`flex w-full items-center ${isAi ? "hidden" : "h-full pl-4 pr-1.5"}`}>
              <input ref={isAi ? undefined : refs.input} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch()} placeholder="Electricians in Footscray VIC 3011" className="h-full flex-1 outline-none text-primary-brown bg-transparent placeholder:text-gray-400 text-[15px]" />
              <button onClick={() => setFilterOpen(true)} className="px-3 text-primary-brown hover:opacity-70"><SlidersHorizontal size={20} /></button>
              <button onClick={onSearch} className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-xl bg-primary-brown text-white hover:opacity-90"><Search size={18} /></button>
            </div>

            {/* AI Content */}
            <div ref={refs.aiContent} className={`w-full flex-col gap-2 ${isAi ? "flex" : "hidden"}`}>
              <div className="flex items-center gap-2 px-2 pt-1">
                <button onClick={() => switchMode(false)} className="text-primary-brown hover:opacity-70"><ArrowLeft size={20} /></button>
                <input ref={isAi ? refs.input : undefined} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && onSearch()} placeholder="Write your requirements..." className="h-10 flex-1 outline-none text-primary-brown bg-transparent placeholder:text-primary-light-brown text-[15px]" />
              </div>
              <div className="flex items-center justify-end gap-2 px-2 pb-1.5">
                <button onClick={() => setVoiceOpen(true)} className="px-2 text-primary-brown hover:opacity-70"><AudioLines size={20} /></button>
                <div className="h-6 w-px bg-gray-100" />
                <button onClick={onSearch} className="flex h-10 items-center gap-1.5 rounded-[15px] bg-primary-brown px-4 text-[15px] font-medium text-white hover:opacity-90"><Sparkles size={16} />Search</button>
              </div>
            </div>
          </div>

          {!isAi && (
            <button ref={refs.aiBtn} data-flip-id="ask-ai-btn" onClick={() => switchMode(true)} className="flex h-[54px] shrink-0 items-center gap-2 rounded-[12px] bg-gradient-to-tr from-[#79241D] to-[#DF4235] px-5 text-[15px] font-semibold text-white hover:opacity-90">
              <Sparkles size={17} /> Ask Ai
            </button>
          )}
        </div>

        {/* Active Filters */}
        {!isAi && filters.length > 0 && (
          <div className="flex flex-wrap gap-2 px-4 pt-3">
            {filters.map((f) => (
              <span key={f} className="flex items-center gap-1.5 rounded-full bg-[#E2CBB3] px-3.5 py-1.5 text-[13px] font-medium text-primary-brown">{f} <button onClick={() => setFilters(filters.filter((x) => x !== f))}><X size={13} strokeWidth={2.5} /></button></span>
            ))}
          </div>
        )}

        <div className="p-4 pt-3">
          {/* Trending Searches */}
          <div ref={refs.row3Search} className={`flex flex-wrap gap-2 ${isAi ? "hidden" : "flex"}`}>
            {TRENDING.map((lbl) => {
              const isTrend = lbl.endsWith("*");
              const text = isTrend ? lbl.slice(0, -1) : lbl;
              return (
                <button key={text} onClick={() => addFilter(text)} className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-white px-4 py-2 text-[13px] text-primary-brown hover:bg-white-50">
                  {isTrend && <TrendingUp size={13} className="text-primary-light-brown" />}{text}
                </button>
              );
            })}
          </div>

          {/* AI Suggestions */}
          <div ref={refs.row3Ai} className={`flex-col gap-1.5 ${isAi ? "flex" : "hidden"}`}>
            {AI_SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => { setQuery(s); refs.input.current?.focus(); }} className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-[10px] text-[12px] text-primary-brown hover:bg-white-50">
                <TrendingUp size={13} className="shrink-0 text-primary-light-brown" /> {s}
              </button>
            ))}
          </div>
        </div>
      </div>
      </div>

      <Filter isOpen={filterOpen} onClose={() => setFilterOpen(false)} initialTab="Buy" />
      <AiVoiceModal isOpen={voiceOpen} onClose={() => setVoiceOpen(false)} />
    </div>
  );
};